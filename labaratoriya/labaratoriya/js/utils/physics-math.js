/**
 * Virtual Fizika Laboratoriyasi - Fizik va Matematik Hisoblashlar moduli
 */

const PhysicsMath = {
  // Fundamental konstantalar
  CONSTANTS: {
    g_earth: 9.80665,     // m/s²
    g_moon: 1.62,         // m/s²
    g_mars: 3.71,         // m/s²
    g_jupiter: 24.79,     // m/s²
    c: 299792458,         // m/s (yorug'lik tezligi)
    h: 6.62607015e-34,    // J·s (Plank doimiysi)
    h_eV: 4.135667696e-15,// eV·s
    e: 1.602176634e-19,   // C (elementar zaryad)
    R: 8.314462618,       // J/(mol·K) (universal gaz doimiysi)
    k_B: 1.380649e-23,    // J/K (Bolsman doimiysi)
    N_A: 6.02214076e23    // mol⁻¹ (Avogadro soni)
  },

  // 1.1 Matematik mayatnik
  pendulumPeriod: function(length, gravity) {
    if (gravity <= 0 || length <= 0) return 0;
    return 2 * Math.PI * Math.sqrt(length / gravity);
  },

  // Prujinali mayatnik
  springPeriod: function(mass, stiffness) {
    if (stiffness <= 0 || mass <= 0) return 0;
    return 2 * Math.PI * Math.sqrt(mass / stiffness);
  },

  // 1.2 Ballistika hisoblashlari
  projectileTrajectory: function(v0, angleDeg, h0, gravity, airDrag = 0, dt = 0.01) {
    const angleRad = (angleDeg * Math.PI) / 180;
    let vx = v0 * Math.cos(angleRad);
    let vy = v0 * Math.sin(angleRad);
    let x = 0;
    let y = h0;
    let t = 0;

    const points = [{ x, y, vx, vy, t }];
    let maxHeight = h0;

    while (y >= 0 && points.length < 5000) {
      if (airDrag > 0) {
        const v = Math.sqrt(vx * vx + vy * vy);
        const dragAccX = -airDrag * v * vx;
        const dragAccY = -gravity - airDrag * v * vy;
        vx += dragAccX * dt;
        vy += dragAccY * dt;
      } else {
        vy -= gravity * dt;
      }

      x += vx * dt;
      y += vy * dt;
      t += dt;

      if (y > maxHeight) maxHeight = y;
      points.push({ x: Math.max(0, x), y: Math.max(0, y), vx, vy, t });
    }

    return {
      points,
      totalDistance: x,
      flightTime: t,
      maxHeight
    };
  },

  // Nazariy balandlik va masofa (havo qarshiligisiz)
  projectileTheory: function(v0, angleDeg, h0, gravity) {
    const rad = (angleDeg * Math.PI) / 180;
    const vy0 = v0 * Math.sin(rad);
    const vx0 = v0 * Math.cos(rad);
    const hMax = h0 + (vy0 * vy0) / (2 * gravity);
    // 0 = h0 + vy0*t - 0.5*g*t^2
    const disc = vy0 * vy0 + 2 * gravity * h0;
    const tFlight = (vy0 + Math.sqrt(disc)) / gravity;
    const range = vx0 * tFlight;
    return { hMax, range, tFlight };
  },

  // 2.1 Snellius qonuni
  snellRefraction: function(n1, n2, alphaDeg) {
    const alphaRad = (alphaDeg * Math.PI) / 180;
    const sinBeta = (n1 / n2) * Math.sin(alphaRad);
    let isTIR = false;
    let betaDeg = 0;
    let critAngleDeg = null;

    if (n1 > n2) {
      critAngleDeg = (Math.asin(n2 / n1) * 180) / Math.PI;
    }

    if (sinBeta > 1.0) {
      isTIR = true; // To'la ichki qaytish
      betaDeg = null;
    } else {
      betaDeg = (Math.asin(sinBeta) * 180) / Math.PI;
    }

    return {
      isTIR,
      betaDeg,
      critAngleDeg,
      reflAngleDeg: alphaDeg
    };
  },

  // 2.2 Yupqa linza formulasi
  thinLens: function(F, d, h) {
    // 1/F = 1/d + 1/f => 1/f = 1/F - 1/d = (d - F) / (F * d) => f = (F * d) / (d - F)
    if (Math.abs(d - F) < 0.001) {
      return {
        f: Infinity,
        H: Infinity,
        k: Infinity,
        isReal: false,
        isAtInfinity: true,
        typeStr: "Tasvir cheksizlikda hosil bo'ladi (nur parallel)"
      };
    }

    const f = (F * d) / (d - F);
    const k = Math.abs(f / d);
    const H = (f / d) * h;
    const isReal = f > 0;
    const isInverted = isReal;

    let desc = "";
    if (isReal) {
      desc = `Haqiqiy, ${H > h ? "kattalashtirilgan" : (Math.abs(H - h) < 0.01 ? "teng o'lchamli" : "kichraytirilgan")}, to'ntarilgan`;
    } else {
      desc = `Mavhum, ${Math.abs(H) > h ? "kattalashtirilgan" : "kichraytirilgan"}, to'g'ri`;
    }

    return {
      f,
      H,
      k,
      isReal,
      isInverted,
      isAtInfinity: false,
      typeStr: desc
    };
  },

  // 3.1 Ideal gaz tenglamalari
  idealGasPressure: function(volumeLiters, tempK, moles = 1.0) {
    // P = n R T / V
    // V litrda bo'lsa: 1 L = 0.001 m3 => P (Pa) = n * 8.314 * T / (V * 1e-3) = n * 8314 * T / V (Pa) = n * 8.314 * T / V (kPa)
    const p_kPa = (moles * this.CONSTANTS.R * tempK) / volumeLiters;
    return p_kPa;
  },

  // 3.2 Karno FIKi va ish
  carnotEfficiency: function(T1, T2) {
    if (T1 <= 0 || T2 <= 0 || T1 <= T2) return 0;
    const eta = (T1 - T2) / T1;
    return eta;
  },

  // 4.1 Fotoeffekt hisoblashlari
  photoelectricEffect: function(lambdaNm, workFuncEV, voltageV) {
    // lambda nm -> m
    const lambdaM = lambdaNm * 1e-9;
    const freqHz = this.CONSTANTS.c / lambdaM;
    const photonEnergyEV = (this.CONSTANTS.h_eV * this.CONSTANTS.c) / lambdaM;
    
    // Qizil chegara
    const lambdaMaxNm = (this.CONSTANTS.h_eV * this.CONSTANTS.c / workFuncEV) * 1e9;
    const freq0Hz = (workFuncEV * this.CONSTANTS.e) / this.CONSTANTS.h;

    let kineticMaxEV = photonEnergyEV - workFuncEV;
    let hasEmission = kineticMaxEV > 0;

    let stoppingVoltageV = hasEmission ? kineticMaxEV : 0;
    if (kineticMaxEV < 0) kineticMaxEV = 0;

    // Maksimal tezlik
    const m_e = 9.1093837e-31; // kg
    const kineticMaxJoules = kineticMaxEV * this.CONSTANTS.e;
    const vMax = Math.sqrt((2 * kineticMaxJoules) / m_e);

    // Kuchlanish ta'siridagi tok ko'rsatkichi (modellashtirilgan)
    let currentFactor = 0;
    if (hasEmission) {
      if (voltageV < -stoppingVoltageV) {
        currentFactor = 0;
      } else {
        const uDiff = voltageV + stoppingVoltageV;
        currentFactor = Math.min(1.0, Math.sqrt(uDiff) / 2 + 0.1);
      }
    }

    return {
      freqHz,
      photonEnergyEV,
      lambdaMaxNm,
      freq0Hz,
      kineticMaxEV,
      hasEmission,
      stoppingVoltageV,
      vMax,
      currentFactor
    };
  },

  // 4.2 Radioaktiv yemirilish
  radioactiveDecay: function(N0, halfLife, timeElapsed) {
    const remaining = N0 * Math.pow(0.5, timeElapsed / halfLife);
    const decayed = N0 - remaining;
    const percent = (remaining / N0) * 100;
    const lambda = Math.LN2 / halfLife;
    const activity = lambda * remaining;
    return {
      remaining: Math.round(remaining),
      decayed: Math.round(decayed),
      percent: percent.toFixed(2),
      activity
    };
  },

  // Oddiy ovoz effektlari (Web Audio API)
  playSound: function(type) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click' || type === 'geiger') {
        // Geyger chertishi
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
      } else if (type === 'cannon') {
        // To'p otilishi
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'ping') {
        // Belgilash / tugatish
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Audio autoplay may be blocked until user interacts
    }
  },

  // LaTeX formatini chiroyli HTML formatga o'tkazish
  renderMathToHtml: function(latex) {
    if (!latex) return "";
    let html = latex
      .replace(/\\pi/g, "π")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\nu/g, "ν")
      .replace(/\\lambda/g, "λ")
      .replace(/\\eta/g, "η")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\Phi/g, "Φ")
      .replace(/\\cdot/g, "·")
      .replace(/\\pm/g, "±")
      .replace(/\\sim/g, "∝")
      .replace(/\\Rightarrow/g, "⇒")
      .replace(/\\Leftrightarrow/g, "⇔")
      .replace(/\\text\{([^}]+)\}/g, "$1")
      .replace(/\\quad/g, " &nbsp; ");

    // Kasrlarni almashtirish \frac{a}{b} -> (a / b)
    html = html.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="inline-fraction"><span class="numerator">$1</span><span class="denominator">$2</span></span>');
    // Ildiz \sqrt{x}
    html = html.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
    // Indekslar
    html = html.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    html = html.replace(/_([a-zA-Z0-9])/g, '<sub>$1</sub>');
    // Darajalar
    html = html.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
    html = html.replace(/\^([a-zA-Z0-9])/g, '<sup>$1</sup>');

    return html;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhysicsMath;
}
