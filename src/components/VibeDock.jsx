import React from 'react';
import { useKitchen } from '../context/KitchenContext';
import { Play, Pause, CloudRain, Coffee, Trees, Flame, Moon, Volume2 } from 'lucide-react';

export const VibeDock = () => {
  const { audioState, toggleAudio, setAudioTrack, setAudioVolume } = useKitchen();

  const trackDetails = {
    rain: { title: "Rainy Kitchen", desc: "Gentle rain & warm acoustics", icon: CloudRain },
    cafe: { title: "Cozy Café", desc: "Coffee shop chatter & cup clinks", icon: Coffee },
    forest: { title: "Forest Breeze", desc: "Soft wind & rustling leaves", icon: Trees },
    fireplace: { title: "Fireplace Embers", desc: "Wood pops & warm hearth", icon: Flame },
    evening: { title: "Calm Evening", desc: "Lofi chill pads & crickets", icon: Moon }
  };

  const currentInfo = trackDetails[audioState.track] || trackDetails.rain;
  const IconComponent = currentInfo.icon;

  return (
    <div className="vibe-dock">
      <div className="vibe-info">
        <div className={`vibe-icon-wrapper ${audioState.isPlaying ? 'playing' : ''}`}>
          <IconComponent size={22} color="white" />
        </div>
        <div>
          <div className="vibe-title">{currentInfo.title}</div>
          <div className="vibe-subtitle">{currentInfo.desc}</div>
        </div>
        <div className={`equalizer ${audioState.isPlaying ? 'playing' : ''} ms-2 d-none d-sm-flex`}>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
        </div>
      </div>

      <div className="vibe-controls">
        <select 
          className="vibe-soundscape-select" 
          value={audioState.track}
          onChange={(e) => setAudioTrack(e.target.value)}
        >
          <option value="rain">🌧️ Rainy Kitchen</option>
          <option value="cafe">☕ Cozy Café</option>
          <option value="forest">🌲 Forest Breeze</option>
          <option value="fireplace">🔥 Fireplace Embers</option>
          <option value="evening">🌙 Calm Evening</option>
        </select>

        <button 
          className="btn-vibe-play" 
          onClick={toggleAudio}
          title="Toggle Ambience"
        >
          {audioState.isPlaying ? <Pause size={20} /> : <Play size={20} className="ms-1" />}
        </button>

        <div className="d-none d-md-flex align-items-center gap-2">
          <Volume2 size={18} className="text-white-50" />
          <input 
            type="range" 
            className="vibe-volume-slider" 
            min="0" 
            max="1" 
            step="0.05" 
            value={audioState.volume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};
