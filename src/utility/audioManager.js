import { Howl } from 'howler';

const sounds = {
  bg: new Howl({
    src: ['/music/bg.mp3'],      // from public/ folder
    loop: true,
    volume: 0.4,
  }),
  correct: new Howl({
    src: ['/sfx/correct.wav'],
    volume: 0.7,
  }),
  wrong: new Howl({
    src: ['/sfx/wrong.wav'],
    volume: 0.7,
  }),
};

export const AudioManager = {
  // Background music control
  playBg() {
    sounds.bg.play();
  },
  pauseBg() {
    sounds.bg.pause();
  },
  stopBg() {
    sounds.bg.stop();
  },

  // Fading: fade background to volume over duration (ms)
  fadeBg(targetVolume, duration = 1500) {
    sounds.bg.fade(sounds.bg.volume(), targetVolume, duration);
  },

  // Volume control
  setBgVolume(vol) {
    sounds.bg.volume(vol);
  },

  // Play button effects (SFX feedback)
  playCorrect() {
    sounds.correct.play();
  },
  playWrong() {
    sounds.wrong.play();
  },

  // Button "effect": quick volume spike on answer
  buttonEffect(sound) {
    const original = sounds[sound].volume();
    sounds[sound].volume(original + 0.2); // spike up
    sounds[sound].play();
    // Reset after short delay
    setTimeout(() => sounds[sound].volume(original), 300);
  },
};