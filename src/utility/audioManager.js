import { Howl } from 'howler';

// Here we can add different sounds to use by calling AudioManager methods
const sounds = {
  bg: new Howl({
    src: ['/music/bg.mp3'],      // from public/music folder
    loop: true,
    volume: 0.4,
  }),
  correct: new Howl({
    src: ['/sfx/correct.wav'],    // from public/sfx folder
    volume: 0.3,
  }),
  wrong: new Howl({
    src: ['/sfx/wrong.mp3'],    // from public/sfx folder
    volume: 0.3,
  }),
};

export const AudioManager = {
  // Background music control, play, pause, stop
  playBg() {
    return sounds.bg.play();
  },
  pauseBg() {
    sounds.bg.pause();
  },
  stopBg() {
    sounds.bg.stop();
  },

  // Fading: fade background to volume over duration (ms). Same principle can be used for SFX if desired
  fadeBg(targetVolume, duration = 1500) {
    sounds.bg.fade(sounds.bg.volume(), targetVolume, duration);
  },

  // Volume control for usage on a music volume slider if desired
  setBgVolume(vol) {
    sounds.bg.volume(vol);
  },

  // Return true if background music is currently playing
  isBgPlaying() {
    try {
      return sounds.bg.playing();
    } catch (e) {
      return false;
    }
  },

  // Play button effects (SFX feedback)
  playCorrect() {
    sounds.correct.play();
  },
  playWrong() {
    sounds.wrong.play();
  },

};