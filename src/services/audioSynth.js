class AmbientAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.activeNodes = [];
    this.currentSoundscape = 'rain';
    this.isPlaying = false;
  }

  initContext(volume = 0.6) {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = volume;
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(vol) {
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    }
  }

  stopCurrent() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  playSoundscape(name, volume = 0.6) {
    this.initContext(volume);
    this.stopCurrent();
    this.currentSoundscape = name;
    this.isPlaying = true;

    if (name === 'rain') this.synthRain();
    else if (name === 'cafe') this.synthCafe();
    else if (name === 'forest') this.synthForest();
    else if (name === 'fireplace') this.synthFireplace();
    else if (name === 'evening') this.synthEvening();
  }

  synthRain() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.06;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    whiteNoise.connect(filter);
    filter.connect(this.masterGain);
    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter);
  }

  synthFireplace() {
    const osc = this.audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 45;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = 0.15;

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    osc.start();

    const crackleInterval = setInterval(() => {
      if (!this.isPlaying) { clearInterval(crackleInterval); return; }
      if (Math.random() > 0.4) {
        const popOsc = this.audioCtx.createOscillator();
        const popGain = this.audioCtx.createGain();
        popOsc.frequency.value = 400 + Math.random() * 800;
        popGain.gain.setValueAtTime(0.04 + Math.random() * 0.05, this.audioCtx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.03);
        popOsc.connect(popGain);
        popGain.connect(this.masterGain);
        popOsc.start();
        popOsc.stop(this.audioCtx.currentTime + 0.04);
      }
    }, 150);

    this.activeNodes.push(osc, filter, gainNode);
  }

  synthCafe() {
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    osc1.frequency.value = 110;
    osc2.frequency.value = 114;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.08;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    this.activeNodes.push(osc1, osc2, gain);
  }

  synthForest() {
    const osc = this.audioCtx.createOscillator();
    osc.frequency.value = 220;

    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.value = 0.2;

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 40;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    lfo.start();
    this.activeNodes.push(osc, lfo, lfoGain, gain);
  }

  synthEvening() {
    [261.63, 329.63, 392.00].forEach(freq => {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = this.audioCtx.createGain();
      g.gain.value = 0.03;
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start();
      this.activeNodes.push(osc, g);
    });
  }

  playTimerBell() {
    this.initContext();
    const osc = this.audioCtx.createOscillator();
    const g = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.8);
    g.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.8);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.85);
  }
}

export const audioEngine = new AmbientAudioEngine();
