/* ==========================================================================
   AuraCook – Core JavaScript Application Engine
   Includes: State Management, Sound Synthesizer, Speech Engine, Multi-Timers,
             Pantry CRUD & Smart Recipe Recommendation Matching Engine
   ========================================================================== */

// --- Initial Datasets ---

const DEFAULT_RECIPES = [
  {
    id: "tuscan-chicken",
    title: "Creamy Tuscan Garlic Chicken",
    category: "Main Course",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    image: "assets/images/tuscan_chicken_1787063126108.jpg",
    tags: ["Chicken", "Creamy", "Italian", "Gluten-Free"],
    description: "Tender chicken breasts pan-seared and smothered in a rich garlic cream sauce with sun-dried tomatoes and fresh spinach.",
    ingredients: [
      { name: "Chicken Breast", amount: 2, unit: "large" },
      { name: "Olive Oil", amount: 2, unit: "tbsp" },
      { name: "Garlic", amount: 4, unit: "cloves" },
      { name: "Heavy Cream", amount: 1, unit: "cup" },
      { name: "Sun-dried Tomatoes", amount: 0.5, unit: "cup" },
      { name: "Fresh Spinach", amount: 2, unit: "cups" },
      { name: "Parmesan Cheese", amount: 0.5, unit: "cup" },
      { name: "Salt", amount: 1, unit: "tsp" },
      { name: "Black Pepper", amount: 0.5, unit: "tsp" }
    ],
    instructions: [
      {
        step: 1,
        text: "Season the chicken breasts generously on both sides with 1 tsp salt and 0.5 tsp black pepper.",
        tools: ["Cutting Board", "Chef Knife"],
        ingredients: ["Chicken Breast", "Salt", "Black Pepper"],
        timerMinutes: 0
      },
      {
        step: 2,
        text: "Heat 2 tbsp Olive Oil in a large cast-iron skillet over medium-high heat. Add chicken breasts and sear until golden brown.",
        tools: ["Cast-iron Skillet", "Tongs"],
        ingredients: ["Olive Oil"],
        timerMinutes: 6
      },
      {
        step: 3,
        text: "Flip the chicken breasts and cook for another 6-8 minutes until internal temperature reaches 165°F (74°C). Transfer chicken to a plate.",
        tools: ["Meat Thermometer", "Plate"],
        ingredients: [],
        timerMinutes: 7
      },
      {
        step: 4,
        text: "In the same skillet, add minced Garlic and chopped Sun-dried Tomatoes. Sauté for 1-2 minutes until fragrant.",
        tools: ["Wooden Spoon"],
        ingredients: ["Garlic", "Sun-dried Tomatoes"],
        timerMinutes: 2
      },
      {
        step: 5,
        text: "Reduce heat to medium-low. Pour in 1 cup Heavy Cream and bring to a gentle simmer, scraping up any browned bits.",
        tools: ["Whisk"],
        ingredients: ["Heavy Cream"],
        timerMinutes: 3
      },
      {
        step: 6,
        text: "Stir in Parmesan Cheese and Fresh Spinach until cheese melts and spinach wilts down completely into the sauce.",
        tools: ["Wooden Spoon"],
        ingredients: ["Parmesan Cheese", "Fresh Spinach"],
        timerMinutes: 2
      },
      {
        step: 7,
        text: "Return the seared chicken breasts to the skillet, spoon cream sauce over the top, and let simmer for 2 minutes before serving hot.",
        tools: ["Serving Platter"],
        ingredients: [],
        timerMinutes: 2
      }
    ]
  },
  {
    id: "tomato-pasta",
    title: "Creamy Tomato & Mushroom Pasta",
    category: "Quick & Easy",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 3,
    image: "assets/images/tomato_pasta_1787063685678.jpg",
    tags: ["Vegetarian", "Pasta", "Italian", "Comfort Food"],
    description: "Al dente fettuccine tossed in a rich, velvety tomato garlic cream sauce filled with sautéed mushrooms and fresh basil.",
    ingredients: [
      { name: "Fettuccine Pasta", amount: 250, unit: "g" },
      { name: "Mushrooms", amount: 200, unit: "g" },
      { name: "Crushed Tomatoes", amount: 1, unit: "can" },
      { name: "Heavy Cream", amount: 0.5, unit: "cup" },
      { name: "Garlic", amount: 3, unit: "cloves" },
      { name: "Olive Oil", amount: 1.5, unit: "tbsp" },
      { name: "Fresh Basil", amount: 0.25, unit: "cup" },
      { name: "Parmesan Cheese", amount: 0.25, unit: "cup" },
      { name: "Salt", amount: 1, unit: "tsp" }
    ],
    instructions: [
      {
        step: 1,
        text: "Bring a large pot of salted water to a rolling boil. Add 250g Fettuccine and cook until al dente.",
        tools: ["Large Pot", "Colander"],
        ingredients: ["Fettuccine Pasta", "Salt"],
        timerMinutes: 9
      },
      {
        step: 2,
        text: "Heat Olive Oil in a pan. Add sliced Mushrooms and sauté until golden brown and liquid evaporates.",
        tools: ["Skillet", "Spatula"],
        ingredients: ["Mushrooms", "Olive Oil"],
        timerMinutes: 5
      },
      {
        step: 3,
        text: "Add minced Garlic and cook for 1 minute. Add Crushed Tomatoes and simmer for 5 minutes.",
        tools: ["Wooden Spoon"],
        ingredients: ["Garlic", "Crushed Tomatoes"],
        timerMinutes: 5
      },
      {
        step: 4,
        text: "Stir in Heavy Cream and Parmesan Cheese until smooth and creamy.",
        tools: ["Spatula"],
        ingredients: ["Heavy Cream", "Parmesan Cheese"],
        timerMinutes: 2
      },
      {
        step: 5,
        text: "Toss pasta with sauce, garnish with torn Fresh Basil leaves and serve immediately.",
        tools: ["Pasta Tongs"],
        ingredients: ["Fresh Basil"],
        timerMinutes: 0
      }
    ]
  },
  {
    id: "mediterranean-bowl",
    title: "Mediterranean Quinoa Bowl",
    category: "Vegetarian",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    tags: ["Healthy", "Quinoa", "Vegetarian", "Meal Prep"],
    description: "Fluffy quinoa topped with spiced roasted chickpeas, crisp cucumbers, cherry tomatoes, olives, and feta with lemon herb dressing.",
    ingredients: [
      { name: "Quinoa", amount: 1, unit: "cup" },
      { name: "Chickpeas", amount: 1, unit: "can" },
      { name: "Cucumber", amount: 1, unit: "medium" },
      { name: "Cherry Tomatoes", amount: 1, unit: "cup" },
      { name: "Feta Cheese", amount: 0.5, unit: "cup" },
      { name: "Lemon", amount: 1, unit: "whole" },
      { name: "Olive Oil", amount: 2, unit: "tbsp" }
    ],
    instructions: [
      {
        step: 1,
        text: "Rinse 1 cup Quinoa under cold water. Combine with 2 cups water in a pot, bring to a boil, cover and simmer for 15 minutes.",
        tools: ["Saucepan", "Lid"],
        ingredients: ["Quinoa"],
        timerMinutes: 15
      },
      {
        step: 2,
        text: "Drain and pat dry Chickpeas. Toss with Olive Oil and spices, then roast in oven or pan until crispy.",
        tools: ["Baking Sheet"],
        ingredients: ["Chickpeas", "Olive Oil"],
        timerMinutes: 12
      },
      {
        step: 3,
        text: "Dice Cucumber and halve Cherry Tomatoes. Fluff cooked quinoa with a fork.",
        tools: ["Knife", "Fork"],
        ingredients: ["Cucumber", "Cherry Tomatoes"],
        timerMinutes: 0
      },
      {
        step: 4,
        text: "Assemble bowls: base of quinoa, arranged vegetables, roasted chickpeas, crumbled Feta Cheese, and lemon juice drizzle.",
        tools: ["Serving Bowls"],
        ingredients: ["Feta Cheese", "Lemon"],
        timerMinutes: 0
      }
    ]
  },
  {
    id: "honey-salmon",
    title: "Cozy Honey Glazed Salmon",
    category: "Seafood",
    difficulty: "Medium",
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    tags: ["Seafood", "Glazed", "Omega-3", "Quick"],
    description: "Pan-roasted salmon fillets drizzled with a warm garlic, honey, and soy glaze alongside tender roasted asparagus.",
    ingredients: [
      { name: "Salmon Fillet", amount: 2, unit: "pieces" },
      { name: "Honey", amount: 2, unit: "tbsp" },
      { name: "Soy Sauce", amount: 1, unit: "tbsp" },
      { name: "Garlic", amount: 2, unit: "cloves" },
      { name: "Butter", amount: 1, unit: "tbsp" },
      { name: "Lemon", amount: 1, unit: "whole" },
      { name: "Asparagus", amount: 1, unit: "bunch" }
    ],
    instructions: [
      {
        step: 1,
        text: "Pat Salmon Fillets dry with paper towels. Whisk together Honey, Soy Sauce, minced Garlic, and 1 tbsp Lemon juice.",
        tools: ["Small Bowl", "Whisk"],
        ingredients: ["Salmon Fillet", "Honey", "Soy Sauce", "Garlic", "Lemon"],
        timerMinutes: 0
      },
      {
        step: 2,
        text: "Melt Butter in a non-stick pan over medium heat. Place salmon skin-side up and sear for 4 minutes until golden.",
        tools: ["Non-stick Pan", "Spatula"],
        ingredients: ["Butter"],
        timerMinutes: 4
      },
      {
        step: 3,
        text: "Flip salmon fillets carefully. Pour honey garlic glaze over salmon and simmer until sauce thickens into a glossy glaze.",
        tools: ["Spoon"],
        ingredients: [],
        timerMinutes: 4
      },
      {
        step: 4,
        text: "Serve hot garnished with lemon slices and trimmed sautéed Asparagus.",
        tools: ["Platter"],
        ingredients: ["Asparagus"],
        timerMinutes: 0
      }
    ]
  }
];

const DEFAULT_PANTRY = [
  { id: "p1", name: "Garlic", quantity: 6, unit: "cloves", category: "Produce", expiryDate: "2026-09-01", status: "In Stock" },
  { id: "p2", name: "Olive Oil", quantity: 500, unit: "ml", category: "Pantry Staples", expiryDate: "2027-01-01", status: "In Stock" },
  { id: "p3", name: "Heavy Cream", quantity: 250, unit: "ml", category: "Dairy & Eggs", expiryDate: "2026-08-28", status: "In Stock" },
  { id: "p4", name: "Chicken Breast", quantity: 4, unit: "pieces", category: "Meat & Seafood", expiryDate: "2026-08-22", status: "In Stock" },
  { id: "p5", name: "Fresh Spinach", quantity: 1, unit: "bunch", category: "Produce", expiryDate: "2026-08-24", status: "Low Stock" },
  { id: "p6", name: "Parmesan Cheese", quantity: 150, unit: "g", category: "Dairy & Eggs", expiryDate: "2026-09-15", status: "In Stock" },
  { id: "p7", name: "Mushrooms", quantity: 250, unit: "g", category: "Produce", expiryDate: "2026-08-23", status: "In Stock" },
  { id: "p8", name: "Fettuccine Pasta", quantity: 500, unit: "g", category: "Grains & Bakery", expiryDate: "2027-06-01", status: "In Stock" },
  { id: "p9", name: "Crushed Tomatoes", quantity: 2, unit: "cans", category: "Pantry Staples", expiryDate: "2027-03-01", status: "In Stock" },
  { id: "p10", name: "Salt", quantity: 1, unit: "container", category: "Spices & Herbs", expiryDate: "2028-01-01", status: "In Stock" },
  { id: "p11", name: "Black Pepper", quantity: 1, unit: "container", category: "Spices & Herbs", expiryDate: "2028-01-01", status: "In Stock" }
];

// --- App State ---

class AuraCookState {
  constructor() {
    this.recipes = DEFAULT_RECIPES;
    this.pantry = this.loadPantry();
    this.timers = [];
    this.currentAudioTrack = 'rain';
    this.isPlayingAudio = false;
    this.audioVolume = 0.6;
    this.activeRecipeId = null;
    this.cookingStepIndex = 0;
    this.isListeningVoice = false;
  }

  loadPantry() {
    const saved = localStorage.getItem('auracook_pantry');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error("Error parsing pantry", e); }
    }
    return DEFAULT_PANTRY;
  }

  savePantry() {
    localStorage.setItem('auracook_pantry', JSON.stringify(this.pantry));
  }
}

const state = new AuraCookState();

// --- Web Audio Ambient Synthesizer Engine ---

class AmbientAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.activeNodes = [];
    this.currentSoundscape = 'rain';
    this.isPlaying = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = state.audioVolume;
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(vol) {
    state.audioVolume = vol;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(vol, this.audioCtx ? this.audioCtx.currentTime : 0);
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

  playSoundscape(name) {
    this.initContext();
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
    // Pink noise buffer for rain simulation
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
    // Low rumble + crackle pops
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

    // Crackle generator loop
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
    // Warm low-frequency drone + soft resonance
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
    // Breeze low filter noise + bird chirps
    const osc = this.audioCtx.createOscillator();
    osc.frequency.value = 220;

    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.value = 0.2; // Slow breeze pulse

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
    // Soft soothing sine chord
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
    osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.8);
    g.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.8);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.85);
  }
}

const audioEngine = new AmbientAudioEngine();

// --- Voice Cooking Assistant ---

class VoiceCookingAssistant {
  constructor() {
    this.recognition = null;
    this.synth = window.speechSynthesis;
    this.isSupported = false;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript.trim().toLowerCase();
        console.log("Voice Command Received:", transcript);
        this.processCommand(transcript);
      };

      this.recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        showToast("Voice assistant notice: " + e.error, "info");
        state.isListeningVoice = false;
        updateVoiceUI();
      };

      this.recognition.onend = () => {
        if (state.isListeningVoice) {
          try { this.recognition.start(); } catch (e) {}
        } else {
          updateVoiceUI();
        }
      };
    }
  }

  toggleListening() {
    if (!this.isSupported) {
      showToast("Web Speech API is not supported in this browser. You can still use interactive on-screen controls!", "warning");
      return;
    }
    if (state.isListeningVoice) {
      state.isListeningVoice = false;
      try { this.recognition.stop(); } catch (e) {}
      showToast("Voice assistant deactivated", "info");
    } else {
      state.isListeningVoice = true;
      try { this.recognition.start(); } catch (e) {}
      showToast("Voice assistant active! Try saying 'Next step' or 'Read step'", "success");
    }
    updateVoiceUI();
  }

  speak(text) {
    if (!this.synth) return;
    this.synth.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    this.synth.speak(utterance);
  }

  processCommand(cmd) {
    showToast(`Voice heard: "${cmd}"`, "info");
    
    if (cmd.includes("next step") || cmd.includes("next")) {
      navigateCookingStep(1);
      this.speak("Moving to next step");
    } else if (cmd.includes("previous step") || cmd.includes("previous") || cmd.includes("back")) {
      navigateCookingStep(-1);
      this.speak("Going back to previous step");
    } else if (cmd.includes("repeat") || cmd.includes("read this step") || cmd.includes("read step")) {
      readCurrentStepAloud();
    } else if (cmd.includes("start timer")) {
      // e.g., "start timer 5 minutes"
      const match = cmd.match(/(\d+)/);
      const mins = match ? parseInt(match[1], 10) : 5;
      createTimer(`Voice Timer (${mins}m)`, mins * 60);
      this.speak(`Started ${mins} minute timer`);
    } else if (cmd.includes("how much")) {
      // Search current recipe for ingredient amount
      const currentRecipe = getCurrentCookingRecipe();
      if (currentRecipe) {
        const foundIng = currentRecipe.ingredients.find(i => cmd.includes(i.name.toLowerCase()));
        if (foundIng) {
          this.speak(`You need ${foundIng.amount} ${foundIng.unit} of ${foundIng.name}`);
        } else {
          this.speak("I couldn't find that ingredient in this recipe.");
        }
      }
    }
  }
}

const voiceAssistant = new VoiceCookingAssistant();

// --- Multi-Timer Manager Engine ---

function createTimer(name, durationSeconds) {
  const timer = {
    id: "timer_" + Date.now(),
    name: name || "Cooking Timer",
    totalSeconds: durationSeconds,
    remainingSeconds: durationSeconds,
    status: 'running', // 'running', 'paused', 'finished'
    intervalId: null
  };

  timer.intervalId = setInterval(() => {
    if (timer.status === 'running') {
      timer.remainingSeconds--;
      if (timer.remainingSeconds <= 0) {
        timer.remainingSeconds = 0;
        timer.status = 'finished';
        clearInterval(timer.intervalId);
        audioEngine.playTimerBell();
        showToast(`⏰ Timer Alert! "${timer.name}" has completed!`, "warning");
      }
      renderTimerDrawer();
    }
  }, 1000);

  state.timers.push(timer);
  renderTimerDrawer();
  updateTimerCountBadge();
  showToast(`Timer "${timer.name}" set for ${formatTime(durationSeconds)}`, "success");
}

function toggleTimerPause(timerId) {
  const t = state.timers.find(item => item.id === timerId);
  if (t) {
    if (t.status === 'running') {
      t.status = 'paused';
    } else if (t.status === 'paused' && t.remainingSeconds > 0) {
      t.status = 'running';
    }
    renderTimerDrawer();
  }
}

function resetTimer(timerId) {
  const t = state.timers.find(item => item.id === timerId);
  if (t) {
    t.remainingSeconds = t.totalSeconds;
    t.status = 'paused';
    renderTimerDrawer();
  }
}

function deleteTimer(timerId) {
  const idx = state.timers.findIndex(item => item.id === timerId);
  if (idx !== -1) {
    if (state.timers[idx].intervalId) clearInterval(state.timers[idx].intervalId);
    state.timers.splice(idx, 1);
    renderTimerDrawer();
    updateTimerCountBadge();
  }
}

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// --- Smart Pantry-Recipe Matching Algorithm ---

function computeRecipePantryMatch(recipe) {
  const pantryNames = state.pantry
    .filter(item => item.status !== 'Out of Stock')
    .map(item => item.name.toLowerCase());

  let matched = 0;
  const missing = [];

  recipe.ingredients.forEach(ing => {
    const isAvailable = pantryNames.some(p => p.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p));
    if (isAvailable) {
      matched++;
    } else {
      missing.push(ing.name);
    }
  });

  const percent = Math.round((matched / recipe.ingredients.length) * 100);
  return { matched, total: recipe.ingredients.length, percent, missing };
}

// --- Toast Notification Manager ---

function showToast(msg, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container-auracook";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `auracook-toast toast-${type}`;
  let icon = "fa-info-circle";
  if (type === "success") icon = "fa-check-circle";
  if (type === "warning") icon = "fa-exclamation-triangle";

  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- UI Renderers & Setup ---

function renderVibeDock() {
  const container = document.getElementById("vibe-dock-container");
  if (!container) return;

  const trackNames = {
    rain: { title: "Rainy Kitchen", icon: "fa-cloud-showers-heavy", desc: "Gentle rain & warm acoustics" },
    cafe: { title: "Cozy Café", icon: "fa-coffee", desc: "Coffee shop chatter & cup clinks" },
    forest: { title: "Forest Breeze", icon: "fa-tree", desc: "Soft wind & rustling leaves" },
    fireplace: { title: "Fireplace Embers", icon: "fa-fire", desc: "Wood pops & warm hearth" },
    evening: { title: "Calm Evening", icon: "fa-moon", desc: "Lofi chill pads & crickets" }
  };

  const curr = trackNames[state.currentAudioTrack] || trackNames.rain;

  container.innerHTML = `
    <div class="vibe-dock">
      <div class="vibe-info">
        <div class="vibe-icon-wrapper ${audioEngine.isPlaying ? 'playing' : ''}">
          <i class="fas ${curr.icon}"></i>
        </div>
        <div>
          <div class="vibe-title">${curr.title}</div>
          <div class="vibe-subtitle">${curr.desc}</div>
        </div>
        <div class="equalizer ${audioEngine.isPlaying ? 'playing' : ''} ms-2 d-none d-sm-flex">
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
        </div>
      </div>

      <div class="vibe-controls">
        <select class="vibe-soundscape-select" id="vibe-select-track">
          <option value="rain" ${state.currentAudioTrack === 'rain' ? 'selected' : ''}>🌧️ Rainy Kitchen</option>
          <option value="cafe" ${state.currentAudioTrack === 'cafe' ? 'selected' : ''}>☕ Cozy Café</option>
          <option value="forest" ${state.currentAudioTrack === 'forest' ? 'selected' : ''}>🌲 Forest Breeze</option>
          <option value="fireplace" ${state.currentAudioTrack === 'fireplace' ? 'selected' : ''}>🔥 Fireplace Embers</option>
          <option value="evening" ${state.currentAudioTrack === 'evening' ? 'selected' : ''}>🌙 Calm Evening</option>
        </select>

        <button class="btn-vibe-play" id="vibe-play-btn" title="Toggle Ambience">
          <i class="fas ${audioEngine.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
        </button>

        <div class="d-none d-md-flex align-items-center gap-2">
          <i class="fas fa-volume-down text-white-50"></i>
          <input type="range" class="vibe-volume-slider" id="vibe-vol-slider" min="0" max="1" step="0.05" value="${state.audioVolume}">
        </div>
      </div>
    </div>
  `;

  document.getElementById("vibe-play-btn").addEventListener("click", () => {
    if (audioEngine.isPlaying) {
      audioEngine.stopCurrent();
    } else {
      audioEngine.playSoundscape(state.currentAudioTrack);
    }
    renderVibeDock();
  });

  document.getElementById("vibe-select-track").addEventListener("change", (e) => {
    state.currentAudioTrack = e.target.value;
    if (audioEngine.isPlaying) {
      audioEngine.playSoundscape(state.currentAudioTrack);
    }
    renderVibeDock();
  });

  const volSlider = document.getElementById("vibe-vol-slider");
  if (volSlider) {
    volSlider.addEventListener("input", (e) => {
      audioEngine.setVolume(parseFloat(e.target.value));
    });
  }
}

function renderTimerDrawer() {
  const container = document.getElementById("timer-list-container");
  if (!container) return;

  if (state.timers.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fas fa-stopwatch fa-3x mb-3 text-terracotta opacity-50"></i>
        <p>No active kitchen timers.</p>
        <button class="btn btn-sm btn-auracook-primary mt-2" onclick="promptCreateTimer()">
          <i class="fas fa-plus me-1"></i> Add Timer
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.timers.map(t => {
    const pct = Math.round((t.remainingSeconds / t.totalSeconds) * 100);
    return `
      <div class="timer-card ${t.status === 'finished' ? 'finished' : ''}">
        <div>
          <div class="fw-bold text-dark mb-1">${t.name}</div>
          <div class="timer-display-time">${formatTime(t.remainingSeconds)}</div>
        </div>
        <div class="d-flex gap-2">
          ${t.status !== 'finished' ? `
            <button class="btn btn-sm btn-light shadow-sm" onclick="toggleTimerPause('${t.id}')">
              <i class="fas ${t.status === 'running' ? 'fa-pause' : 'fa-play'}"></i>
            </button>
          ` : ''}
          <button class="btn btn-sm btn-light shadow-sm" onclick="resetTimer('${t.id}')">
            <i class="fas fa-redo"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteTimer('${t.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="timer-progress-bg" style="width: ${pct}%;"></div>
      </div>
    `;
  }).join('');
}

function updateTimerCountBadge() {
  const badges = document.querySelectorAll(".badge-timer-count");
  badges.forEach(b => {
    b.textContent = state.timers.length;
  });
}

function promptCreateTimer() {
  const name = prompt("Timer Name (e.g. Pasta Boiling):", "Kitchen Timer");
  if (!name) return;
  const minsStr = prompt("Duration in minutes:", "5");
  const mins = parseInt(minsStr, 10);
  if (isNaN(mins) || mins <= 0) {
    alert("Please enter a valid number of minutes.");
    return;
  }
  createTimer(name, mins * 60);
  openTimerDrawer();
}

function openTimerDrawer() {
  const overlay = document.getElementById("timer-drawer-overlay");
  const drawer = document.getElementById("timer-drawer");
  if (overlay && drawer) {
    overlay.classList.add("active");
    drawer.classList.add("active");
  }
}

function closeTimerDrawer() {
  const overlay = document.getElementById("timer-drawer-overlay");
  const drawer = document.getElementById("timer-drawer");
  if (overlay && drawer) {
    overlay.classList.remove("active");
    drawer.classList.remove("active");
  }
}

function updateVoiceUI() {
  const btns = document.querySelectorAll(".voice-mic-btn");
  const statusTexts = document.querySelectorAll(".voice-status-text");

  btns.forEach(btn => {
    if (state.isListeningVoice) {
      btn.classList.add("listening");
      btn.innerHTML = `<i class="fas fa-microphone"></i>`;
    } else {
      btn.classList.remove("listening");
      btn.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
    }
  });

  statusTexts.forEach(txt => {
    txt.textContent = state.isListeningVoice ? "Voice Assistant Listening..." : "Click mic to enable Voice Controls";
  });
}

// --- Global Initialization ---

document.addEventListener("DOMContentLoaded", () => {
  renderVibeDock();
  renderTimerDrawer();
  updateTimerCountBadge();

  // Setup Timer Drawer toggle listeners
  const timerToggleBtns = document.querySelectorAll(".btn-toggle-timer");
  timerToggleBtns.forEach(btn => {
    btn.addEventListener("click", openTimerDrawer);
  });

  const closeTimerBtn = document.getElementById("close-timer-drawer");
  if (closeTimerBtn) closeTimerBtn.addEventListener("click", closeTimerDrawer);

  const overlay = document.getElementById("timer-drawer-overlay");
  if (overlay) overlay.addEventListener("click", closeTimerDrawer);
});
