// Procedural Offline Web Audio Engine for Aura Sacra
// Generates soothing ambient rainfall and gentle monastic bells without external audio files.

let audioCtx = null;
let rainNode = null;
let rainGain = null;
let isRainPlaying = false;
let rainVolume = 0.5;
let cachedNoiseBuffer = null;
let stopTimeout = null;

export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioUnlocked() {
  return !!audioCtx && audioCtx.state === 'running';
}

export async function unlockAudio(playConfirmation = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }
    
    // WebKit / iOS silent buffer unlock to ensure hardware pipeline wakes up
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    if (playConfirmation) {
      // Gentle, subtle confirmation chime (524Hz C5 soft sine wave, 250ms decay)
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(524, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    }
    return ctx.state === 'running';
  } catch (err) {
    console.warn('Audio unlock error:', err);
    return false;
  }
}

// Generates or retrieves cached looping pink/brown noise for soft rainfall
function getNoiseBuffer(ctx) {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedNoiseBuffer;
  }
  const bufferSize = ctx.sampleRate * 5;
  const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const output = noiseBuffer.getChannelData(channel);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter algorithm
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }
  }
  cachedNoiseBuffer = noiseBuffer;
  return cachedNoiseBuffer;
}

// 1. Procedural Ambient Rainfall Generator
export function toggleRain() {
  if (isRainPlaying) {
    stopRain();
    return false;
  } else {
    startRain();
    return true;
  }
}

export function isPlayingRain() {
  return isRainPlaying;
}

export function setRainVolume(vol) {
  rainVolume = Math.max(0, Math.min(1, vol));
  if (rainGain && audioCtx) {
    try {
      rainGain.gain.cancelScheduledValues(audioCtx.currentTime);
      rainGain.gain.setTargetAtTime(rainVolume * 0.4, audioCtx.currentTime, 0.08);
    } catch (e) {}
  }
}

export function getRainVolume() {
  return rainVolume;
}

export async function startRain() {
  try {
    if (stopTimeout) {
      clearTimeout(stopTimeout);
      stopTimeout = null;
    }
    await unlockAudio(false);
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    if (isRainPlaying && rainNode) return;

    if (rainNode) {
      try { rainNode.stop(); rainNode.disconnect(); } catch (e) {}
      rainNode = null;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = getNoiseBuffer(ctx);
    whiteNoise.loop = true;

    // Dual filter to create realistic soft rain frequency profile
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(850, ctx.currentTime);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(220, ctx.currentTime);

    rainGain = ctx.createGain();
    const targetGain = Math.max(0, rainVolume * 0.4);
    rainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    rainGain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 1.2);

    whiteNoise.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(rainGain);
    rainGain.connect(ctx.destination);

    whiteNoise.start(0);
    rainNode = whiteNoise;
    isRainPlaying = true;
  } catch (err) {
    console.error('Audio engine startRain error:', err);
    isRainPlaying = false;
  }
}

export function stopRain() {
  isRainPlaying = false;
  if (stopTimeout) {
    clearTimeout(stopTimeout);
    stopTimeout = null;
  }
  if (rainGain && audioCtx) {
    try {
      rainGain.gain.cancelScheduledValues(audioCtx.currentTime);
      rainGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.12);
      const nodeToStop = rainNode;
      rainNode = null;
      stopTimeout = setTimeout(() => {
        try {
          if (nodeToStop) {
            nodeToStop.stop();
            nodeToStop.disconnect();
          }
        } catch (e) {}
      }, 250);
    } catch (e) {
      if (rainNode) {
        try { rainNode.stop(); rainNode.disconnect(); } catch (err) {}
        rainNode = null;
      }
    }
  } else {
    if (rainNode) {
      try { rainNode.stop(); rainNode.disconnect(); } catch (e) {}
      rainNode = null;
    }
  }
}

// 2. Monastic Bell Chime (Pure Additive Synthesis)
export async function playMonasticBell() {
  try {
    await unlockAudio(false);
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (e) {}
    }
    const now = ctx.currentTime;
    
    // Fundamental tone + overtones (characteristic of cathedral bronze bells)
    const partials = [
      { freq: 440, gain: 0.5, decay: 3.5 },  // Strike note (A4)
      { freq: 524, gain: 0.35, decay: 4.0 }, // Tierce (Minor third)
      { freq: 659, gain: 0.25, decay: 3.0 }, // Quint
      { freq: 880, gain: 0.15, decay: 2.5 }, // Nominal (Octave)
      { freq: 220, gain: 0.3, decay: 4.5 }   // Hum tone
    ];

    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(p.gain * 0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  } catch (err) {
    console.error('Audio bell error:', err);
  }
}
