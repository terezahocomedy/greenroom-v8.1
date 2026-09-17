let audioContext;

export function playSound(type) {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();

    const tones = {
      pop: [400, 'sine', 0.15, 300, 0.06],
      click: [1200, 'sine', 0.04, 1000, 0.1],
      delete: [150, 'sine', 0.25, 80, 0.08],
      timer: [400, 'sine', 0.05, null, 0.03],
    };
    const tone = tones[type];
    if (!tone) return;

    const [frequency, waveType, duration, slideTo, volume] = tone;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime;
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + duration * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  } catch {
    // Audio is an enhancement; never block the application.
  }
}
