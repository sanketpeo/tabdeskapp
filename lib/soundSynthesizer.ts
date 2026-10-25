/**
 * High-Fidelity Client-Side Procedural Audio Engine
 * Uses native Web Audio API (AudioContext) to generate DISTINCT, REALISTIC, and RELAXING
 * acoustic environments without external files.
 */

export type SoundChannelId =
  | "rain"
  | "whitenoise"
  | "cafe"
  | "forest"
  | "campfire"
  | "waves";

export interface ChannelState {
  id: SoundChannelId;
  name: string;
  icon: string;
  volume: number; // 0 to 100
  isPlaying: boolean;
  description: string;
}

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private channelGains: Map<SoundChannelId, GainNode> = new Map();
  private channelSources: Map<SoundChannelId, { stop: () => void }> = new Map();
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.masterVolume,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  public toggleMasterMute(muted?: boolean): boolean {
    this.isMuted = muted !== undefined ? muted : !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.masterVolume,
        this.ctx.currentTime,
        0.05
      );
    }
    return this.isMuted;
  }

  public setChannelVolume(id: SoundChannelId, volume: number) {
    const gainNode = this.channelGains.get(id);
    if (gainNode && this.ctx) {
      const normalized = Math.max(0, Math.min(1, volume / 100));
      gainNode.gain.setTargetAtTime(normalized, this.ctx.currentTime, 0.05);
    }
  }

  public playChannel(id: SoundChannelId, volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopChannel(id);

    const channelGain = this.ctx.createGain();
    const normalized = Math.max(0, Math.min(1, volume / 100));
    channelGain.gain.setValueAtTime(normalized, this.ctx.currentTime);
    channelGain.connect(this.masterGain);
    this.channelGains.set(id, channelGain);

    switch (id) {
      case "rain":
        this.channelSources.set(id, this.createRain(channelGain));
        break;
      case "whitenoise":
        this.channelSources.set(id, this.createDeepBrownNoise(channelGain));
        break;
      case "cafe":
        this.channelSources.set(id, this.createCafe(channelGain));
        break;
      case "forest":
        this.channelSources.set(id, this.createForestWithBirdsong(channelGain));
        break;
      case "campfire":
        this.channelSources.set(id, this.createCampfireWithCrackles(channelGain));
        break;
      case "waves":
        this.channelSources.set(id, this.createOceanWaves(channelGain));
        break;
    }
  }

  public stopChannel(id: SoundChannelId) {
    const source = this.channelSources.get(id);
    if (source) {
      try {
        source.stop();
      } catch {}
      this.channelSources.delete(id);
    }
    const gain = this.channelGains.get(id);
    if (gain) {
      try {
        gain.disconnect();
      } catch {}
      this.channelGains.delete(id);
    }
  }

  public stopAll() {
    for (const id of Array.from(this.channelSources.keys())) {
      this.stopChannel(id);
    }
  }

  // ==========================================
  // DISTINCT PROCEDURAL SOUND ENGINES
  // ==========================================

  /**
   * 1. RAIN & DROPLETS:
   * Ambient steady rain wash + algorithmic random individual raindrop pitter-patter clicks
   */
  private createRain(dest: GainNode) {
    if (!this.ctx) return { stop: () => {} };
    const sampleRate = this.ctx.sampleRate;

    // Steady rain bed (5 seconds looped pink noise with mid-band frequency)
    const bufferSize = sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.4;
    }

    const rainBed = this.ctx.createBufferSource();
    rainBed.buffer = buffer;
    rainBed.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(300, this.ctx.currentTime);

    rainBed.connect(highpass);
    highpass.connect(filter);
    filter.connect(dest);
    rainBed.start();

    // Procedural Raindrop Patter Engine (distinct drops splashing)
    let isRunning = true;
    const triggerRaindrop = () => {
      if (!isRunning || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();

      // Random water pitch between 1400Hz and 3200Hz
      const freq = 1400 + Math.random() * 1800;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.04);

      dropGain.gain.setValueAtTime(0.08 + Math.random() * 0.12, now);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(dropGain);
      dropGain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.05);

      const nextInterval = 40 + Math.random() * 90; // Rapid gentle drops
      setTimeout(triggerRaindrop, nextInterval);
    };

    triggerRaindrop();

    return {
      stop: () => {
        isRunning = false;
        try {
          rainBed.stop();
          rainBed.disconnect();
          highpass.disconnect();
          filter.disconnect();
        } catch {}
      },
    };
  }

  /**
   * 2. VELVET DEEP BROWN NOISE (Airplane cabin / cozy fan hum):
   * Pure warm Brownian motion, zero harsh treble, velvety soft for deep focus
   */
  private createDeepBrownNoise(dest: GainNode) {
    if (!this.ctx) return { stop: () => {} };
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 6;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Integrated Brownian walk with subtle leak
      lastOut = (lastOut + 0.02 * white) / 1.018;
      data[i] = lastOut * 4.2;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Steep warm lowpass to remove all harsh hiss
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(320, this.ctx.currentTime);
    lowpass.Q.setValueAtTime(0.7, this.ctx.currentTime);

    source.connect(lowpass);
    lowpass.connect(dest);
    source.start();

    return {
      stop: () => {
        try {
          source.stop();
          source.disconnect();
          lowpass.disconnect();
        } catch {}
      },
    };
  }

  /**
   * 3. COZY CAFE:
   * Multi-formant ambient crowd murmur + periodic ceramic cup and spoon clinks
   */
  private createCafe(dest: GainNode) {
    if (!this.ctx) return { stop: () => {} };
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 6;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Speech formant filter bank (simulates distant cafe murmur)
    const formant1 = this.ctx.createBiquadFilter();
    formant1.type = "bandpass";
    formant1.frequency.setValueAtTime(420, this.ctx.currentTime);
    formant1.Q.setValueAtTime(3.5, this.ctx.currentTime);

    const formant2 = this.ctx.createBiquadFilter();
    formant2.type = "bandpass";
    formant2.frequency.setValueAtTime(1100, this.ctx.currentTime);
    formant2.Q.setValueAtTime(2.8, this.ctx.currentTime);

    const murmurMix = this.ctx.createGain();
    murmurMix.gain.setValueAtTime(0.7, this.ctx.currentTime);

    noiseSource.connect(formant1);
    noiseSource.connect(formant2);
    formant1.connect(murmurMix);
    formant2.connect(murmurMix);
    murmurMix.connect(dest);
    noiseSource.start();

    // Occasional subtle coffee cup / ceramic spoon clink generator
    let isRunning = true;
    const triggerCupClink = () => {
      if (!isRunning || !this.ctx) return;
      const now = this.ctx.currentTime;
      const clinkOsc = this.ctx.createOscillator();
      const clinkGain = this.ctx.createGain();

      clinkOsc.type = "sine";
      const pitch = 2200 + Math.random() * 800; // Ceramic ringing frequency
      clinkOsc.frequency.setValueAtTime(pitch, now);

      clinkGain.gain.setValueAtTime(0.04 + Math.random() * 0.03, now);
      clinkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      clinkOsc.connect(clinkGain);
      clinkGain.connect(dest);

      clinkOsc.start(now);
      clinkOsc.stop(now + 0.09);

      const nextClink = 3500 + Math.random() * 5000;
      setTimeout(triggerCupClink, nextClink);
    };

    setTimeout(triggerCupClink, 2000);

    return {
      stop: () => {
        isRunning = false;
        try {
          noiseSource.stop();
          noiseSource.disconnect();
          formant1.disconnect();
          formant2.disconnect();
          murmurMix.disconnect();
        } catch {}
      },
    };
  }

  /**
   * 4. FOREST & BIRDSONG:
   * Whispering leaf canopy breeze + delightful algorithmic procedural bird chirps
   */
  private createForestWithBirdsong(dest: GainNode) {
    if (!this.ctx) return { stop: () => {} };
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.setValueAtTime(650, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(dest);
    windSource.start();

    // Algorithmic Birdsong Generator (natural forest chirps)
    let isRunning = true;
    const triggerBirdsong = () => {
      if (!isRunning || !this.ctx) return;
      const now = this.ctx.currentTime;
      const numChirps = 2 + Math.floor(Math.random() * 3); // 2 to 4 sweet notes
      let chirpTime = now;

      const baseFreq = 2600 + Math.random() * 900;

      for (let c = 0; c < numChirps; c++) {
        const osc = this.ctx.createOscillator();
        const chirpGain = this.ctx.createGain();

        osc.type = "sine";
        const noteFreq = baseFreq + (Math.random() * 400 - 200);
        osc.frequency.setValueAtTime(noteFreq, chirpTime);
        // Sweet glissando chirp sweep
        osc.frequency.exponentialRampToValueAtTime(noteFreq * 1.35, chirpTime + 0.05);
        osc.frequency.exponentialRampToValueAtTime(noteFreq * 0.9, chirpTime + 0.1);

        chirpGain.gain.setValueAtTime(0.001, chirpTime);
        chirpGain.gain.linearRampToValueAtTime(0.07, chirpTime + 0.03);
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.11);

        osc.connect(chirpGain);
        chirpGain.connect(dest);

        osc.start(chirpTime);
        osc.stop(chirpTime + 0.12);

        chirpTime += 0.14 + Math.random() * 0.08;
      }

      // Next bird sings in 2.5 to 5.5 seconds
      const nextDelay = 2500 + Math.random() * 3000;
      setTimeout(triggerBirdsong, nextDelay);
    };

    setTimeout(triggerBirdsong, 1500);

    return {
      stop: () => {
        isRunning = false;
        try {
          windSource.stop();
          windSource.disconnect();
          windFilter.disconnect();
        } catch {}
      },
    };
  }

  /**
   * 5. CAMPFIRE & WOOD CRACKLES:
   * Low comforting hearth rumble + realistic dry wood crackle & snap impulse bursts
   */
  private createCampfireWithCrackles(dest: GainNode) {
    if (!this.ctx) return { stop: () => {} };
    const sampleRate = this.ctx.sampleRate;

    // Warm hearth base rumble
    const bufferSize = sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.03 * white) / 1.02;
      data[i] = last * 3.0;
    }

    const rumble = this.ctx.createBufferSource();
    rumble.buffer = buffer;
    rumble.loop = true;

    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = "lowpass";
    rumbleFilter.frequency.setValueAtTime(240, this.ctx.currentTime);

    rumble.connect(rumbleFilter);
    rumbleFilter.connect(dest);
    rumble.start();

    // Wood Crackle & Snap Impulse Generator
    let isRunning = true;
    const triggerCrackle = () => {
      if (!isRunning || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Create an instant sharp wood snap
      const snapBuffer = this.ctx.createBuffer(1, Math.floor(sampleRate * 0.025), sampleRate);
      const snapData = snapBuffer.getChannelData(0);
      for (let i = 0; i < snapData.length; i++) {
        // High frequency spike with fast decay
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.005));
      }

      const snapSource = this.ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      const snapFilter = this.ctx.createBiquadFilter();
      snapFilter.type = "bandpass";
      snapFilter.frequency.setValueAtTime(1800 + Math.random() * 2200, now);
      snapFilter.Q.setValueAtTime(3.0, now);

      const snapGain = this.ctx.createGain();
      const isLoudPop = Math.random() > 0.85;
      snapGain.gain.setValueAtTime(isLoudPop ? 0.35 : 0.12, now);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(dest);

      snapSource.start(now);

      // Random delay between wood crackles (natural sporadic cadence)
      const nextCrackle = 70 + Math.random() * 250;
      setTimeout(triggerCrackle, nextCrackle);
    };

    triggerCrackle();

    return {
      stop: () => {
        isRunning = false;
        try {
          rumble.stop();
          rumble.disconnect();
          rumbleFilter.disconnect();
        } catch {}
      },
    };
  }

  /**
   * 6. OCEAN WAVES:
   * Smooth slow-cresting swell (8-10 second cycle) with rolling wash and foam recession
   */
  private createOceanWaves(dest: GainNode) {
    if (!this.ctx) return { stop: () => {} };
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 7;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.8;
    }

    const surfSource = this.ctx.createBufferSource();
    surfSource.buffer = buffer;
    surfSource.loop = true;

    // Dynamic wave filter sweeping between deep rumble (180Hz) and crashing foam (1100Hz)
    const waveFilter = this.ctx.createBiquadFilter();
    waveFilter.type = "lowpass";
    waveFilter.frequency.setValueAtTime(300, this.ctx.currentTime);

    // Dynamic wave gain swell
    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    // LFO: 0.11 Hz (~9.1 second ocean surf period)
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.11, this.ctx.currentTime);

    // Filter cutoff depth modulation
    const lfoToFilter = this.ctx.createGain();
    lfoToFilter.gain.setValueAtTime(450, this.ctx.currentTime);
    lfo.connect(lfoToFilter);
    lfoToFilter.connect(waveFilter.frequency);

    // Volume swell modulation
    const lfoToGain = this.ctx.createGain();
    lfoToGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    lfo.connect(lfoToGain);
    lfoToGain.connect(waveGain.gain);

    lfo.start();

    surfSource.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(dest);
    surfSource.start();

    return {
      stop: () => {
        try {
          lfo.stop();
          lfo.disconnect();
          surfSource.stop();
          surfSource.disconnect();
          waveFilter.disconnect();
          waveGain.disconnect();
        } catch {}
      },
    };
  }

  /**
   * Soothing Tibetan singing bowl meditation chime (528Hz Solfeggio frequency + 1056Hz harmonic)
   */
  public playChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(528, now); // 528Hz calming tone
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1056, now); // 1056Hz harmonic

    chimeGain.gain.setValueAtTime(0.25, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    osc1.connect(chimeGain);
    osc2.connect(chimeGain);
    chimeGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 3.3);
    osc2.stop(now + 3.3);
  }
}

export const soundEngine = new SoundSynthesizer();
