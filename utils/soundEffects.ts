let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    // @ts-ignore - Support for older Safari if needed
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

export const playSoftClick = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // ASMR-style soft "tap" or "wood block" sound
    // Starts at 400Hz and drops quickly to create a percussive feel without being sharp
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.08);

    // Short envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.005); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); // Quick decay

    osc.start(t);
    osc.stop(t + 0.08);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const playPurr = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const duration = 1.8;

    // We use two oscillators slightly detuned to create a "beating" texture
    // mixed with a lowpass filter to make it soft and breathy (rumble)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.value = 24; 

    osc2.type = 'sawtooth';
    osc2.frequency.value = 27; // Detuned to create interference

    // Lowpass to muffle the sawtooth harshness
    filter.type = 'lowpass';
    filter.frequency.value = 180;

    // Smooth envelope for the purr breath
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.4);
    gain.gain.linearRampToValueAtTime(0.1, t + 1.2);
    gain.gain.linearRampToValueAtTime(0, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);

  } catch (e) {
    console.error("Audio play failed", e);
  }
};
