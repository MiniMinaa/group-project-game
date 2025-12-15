import React, { useEffect, useState } from 'react';
import { AudioManager } from '../utility/audioManager';
import '../Audio.css';

// AudioControls component
// - UI to control the game's background music
// - Play/Pause button and a volume slider
// - Persists settings in localStorage so they survive reloads
export default function AudioControls({ className }) {
  
  // Track whether music is currently playing (for button label)
  const [isPlaying, setIsPlaying] = useState(false);
  // Track the slider value (0.0 - 1.0)
  const [volume, setVolume] = useState(0.4);

 
  useEffect(() => {
    // Load saved volume and music-on flag from previous session
    const storedVol = localStorage.getItem('musicVolume');
    const storedOn = localStorage.getItem('musicOn');

    if (storedVol !== null) {
      const v = Number(storedVol);
      setVolume(v);
      // Apply the saved volume to the AudioManager
      try { AudioManager.setBgVolume(v); } catch (e) { /* ignore */ }
    } else {
      // No saved volume: ensure AudioManager has the default
      try { AudioManager.setBgVolume(volume); } catch (e) { /* ignore */ }
    }

   
    if (storedOn === 'true') {
      try {
        AudioManager.playBg();
        setIsPlaying(true);
        
        setTimeout(() => {
          if (!AudioManager.isBgPlaying()) {
            setIsPlaying(false);
            localStorage.setItem('musicOn', 'false');
          }
        }, 400);
      } catch (e) { /* ignore */ }
    }
  }, []);

  
  // Toggle music play/pause when user clicks the button
  const togglePlay = () => {
    if (isPlaying) {
      try { AudioManager.pauseBg(); } catch (e) { /* ignore */ }
      setIsPlaying(false);
      localStorage.setItem('musicOn', 'false');
    } else {
      try {
        AudioManager.playBg();
        setIsPlaying(true);
        localStorage.setItem('musicOn', 'true');
        // Verify playback actually started 
        setTimeout(() => {
          if (!AudioManager.isBgPlaying()) {
            setIsPlaying(false);
            localStorage.setItem('musicOn', 'false');
          }
        }, 400);
      } catch (e) { /* ignore */ }
    }
  };

  // Called when the volume slider changes
  // - updates UI state
  // - tells AudioManager to set the new volume
  // - saves the preference
  const onVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    try { AudioManager.setBgVolume(v); } catch (e) { /* ignore */ }
    localStorage.setItem('musicVolume', String(v));
  };

  
  // Minimal Pokémon themed layout: play/pause button + volume slider + percent label
  return (
    <div className='audio_controls'>
      {/* Play / Pause */}
      <button type="button" onClick={togglePlay} className='audio_controls_toggle'>
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* Volume slider and percentage */}
      <div className='audio_controls_volume-row'>
        <label className='normal-text'>Volume</label>
        <input
          className='pokeball-range'
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
        />
        <span className='audio_controls_percent' >{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}
