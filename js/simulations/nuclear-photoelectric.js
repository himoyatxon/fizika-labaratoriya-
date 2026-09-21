/**
 * Virtual Fizika Laboratoriyasi - 4.1 Fotoeffekt hodisasi va Eynshteyn tenglamasi
 */

class PhotoelectricSimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    
    // Metallar ro'yxati va ularning chiqish ishi (eV)
    this.metals = {
      Cs: { name: "Seziy (Cs)", workFuncEV: 2.14 },
      Na: { name: "Natriy (Na)", workFuncEV: 2.28 },
      Zn: { name: "Rux (Zn)", workFuncEV: 4.31 },
      Cu: { name: "Mis (Cu)", workFuncEV: 4.70 },
      Pt: { name: "Platina (Pt)", workFuncEV: 5.65 }
    };

    this.selectedMetalKey = "Cs";
    this.lambdaNm = 400; // nm (binafsha)
    this.intensity = 60; // %
    this.voltageV = 0.0; // V

    // Zarrachalar (elektronlar va fotonlar)
    this.electrons = [];
    this.photons = [];
    this.animId = null;
    this.isRunning = true;
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-canvas-area relative">
          <canvas id="photo-canvas" class="w-full h-[390px] rounded-xl bg-slate-900 border border-slate-800 shadow-inner"></canvas>
          
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-cyan-400 font-mono border border-slate-700">
              To'lqin λ: <span id="photo-lambda-val">400</span> nm
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-amber-400 font-mono border border-slate-700">
              Fototok I: <span id="photo-current-val">12.4</span> µA
            </span>
            <span id="photo-red-limit-badge" class="hidden px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded text-xs font-semibold">
              ⛔ Qizil chegara: Fotoeffekt yo'q (λ > λ_max)
            </span>
          </div>

          <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 w-64">
            <div class="flex justify-between"><span class="text-slate-400">Foton energiyasi hν:</span> <span id="photo-e-photon" class="text-indigo-300 font-bold">3.10 eV</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Chiqish ishi A_chiq:</span> <span id="photo-work-func" class="text-amber-400 font-bold">2.14 eV</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Ek_max (elektron):</span> <span id="photo-ek-max" class="text-emerald-400 font-bold">0.96 eV</span></div>
            <div class="flex justify-between"><span class="text-slate-400">To'xtatuvchi U_t:</span> <span id="photo-u-stop" class="text-rose-400 font-bold">0.96 V</span></div>
          </div>
        </div>

        <!-- Boshqaruv elementlari -->
        <div class="sim-controls grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Katod metalli</label>
            <select id="select-photo-metal" class="w-full px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="Cs" selected>Seziy (Cs) - 2.14 eV</option>
              <option value="Na">Natriy (Na) - 2.28 eV</option>
              <option value="Zn">Rux (Zn) - 4.31 eV</option>
              <option value="Cu">Mis (Cu) - 4.70 eV</option>
              <option value="Pt">Platina (Pt) - 5.65 eV</option>
            </select>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>To'lqin uzunligi λ:</span>
              <span id="slider-photo-lambda-val" class="text-cyan-400 font-mono">400 nm</span>
            </div>
            <input type="range" id="slider-photo-lambda" min="200" max="800" step="5" value="400" class="w-full h-1.5 bg-gradient-to-r from-purple-500 via-green-500 to-red-500 rounded-lg cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Yorug'lik intensivligi:</span>
              <span id="slider-photo-int-val" class="text-amber-400 font-mono">60%</span>
            </div>
            <input type="range" id="slider-photo-int" min="0" max="100" step="5" value="60" class="w-full h-1.5 bg-slate-700 rounded-lg accent-amber-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Kuchlanish U:</span>
              <span id="slider-photo-volt-val" class="text-blue-400 font-mono">0.00 V</span>
            </div>
            <input type="range" id="slider-photo-volt" min="-4.0" max="4.0" step="0.1" value="0.0" class="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer">
          </div>
        </div>

        <!-- Tugmalar va jadval -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div class="text-xs text-slate-400">
            <span>Formula: hν = A_chiq + e·U_t = A_chiq + Ek_max</span>
          </div>

          <button id="btn-photo-record" class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/30">
            <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg> O'lchovni qayd qilish
          </button>
        </div>

        <!-- I-U Voltamper xarakteristikasi grafigi -->
        <div class="mt-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="text-xs font-semibold text-slate-300 mb-2">Voltamper xarakteristikasi I(U)</div>
          <canvas id="photo-graph" class="w-full h-[180px] rounded-lg"></canvas>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('photo-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.graphCanvas = document.getElementById('photo-graph');

    this.graph = new PhysicsGraph(this.graphCanvas, {
      title: "Fototokning kuchlanishga bog'liqligi I(U)",
      xLabel: "Kuchlanish U",
      yLabel: "Tok I",
      xUnit: "V",
      yUnit: "µA",
      minX: -4,
      maxX: 4,
      minY: 0,
      maxY: 30
    });
    this.graph.addSeries("I(U)", "#38bdf8");

    this.bindEvents();
    this.updateCalculations();
    this.startSimulation();
  }

  bindEvents() {
    const selMetal = document.getElementById('select-photo-metal');
    const sliderLambda = document.getElementById('slider-photo-lambda');
    const sliderInt = document.getElementById('slider-photo-int');
    const sliderVolt = document.getElementById('slider-photo-volt');

    selMetal.addEventListener('change', (e) => {
      this.selectedMetalKey = e.target.value;
      this.updateCalculations();
    });

    sliderLambda.addEventListener('input', (e) => {
      this.lambdaNm = parseFloat(e.target.value);
      document.getElementById('slider-photo-lambda-val').innerText = `${this.lambdaNm} nm`;
      this.updateCalculations();
    });

    sliderInt.addEventListener('input', (e) => {
      this.intensity = parseFloat(e.target.value);
      document.getElementById('slider-photo-int-val').innerText = `${this.intensity}%`;
      this.updateCalculations();
    });

    sliderVolt.addEventListener('input', (e) => {
      this.voltageV = parseFloat(e.target.value);
      document.getElementById('slider-photo-volt-val').innerText = `${this.voltageV > 0 ? '+' : ''}${this.voltageV.toFixed(2)} V`;
      this.updateCalculations();
    });
  }

  getWavelengthColor(nm) {
    if (nm < 380) return '#c084fc'; // UV
    if (nm < 440) return '#818cf8'; // Binafsha
    if (nm < 490) return '#38bdf8'; // Ko'k
    if (nm < 560) return '#4ade80'; // Yashil
    if (nm < 590) return '#facc15'; // Sariq
    if (nm < 635) return '#fb923c'; // To'q sariq
    if (nm < 750) return '#f87171'; // Qizil
    return '#991b1b'; // IR
  }

  updateCalculations() {
    const metal = this.metals[this.selectedMetalKey];
    const res = PhysicsMath.photoelectricEffect(this.lambdaNm, metal.workFuncEV, this.voltageV);

    const badge = document.getElementById('photo-red-limit-badge');
    const maxCurrent = (this.intensity / 100) * 25; // max 25 uA
    let current = res.hasEmission ? maxCurrent * res.currentFactor : 0;

    if (!res.hasEmission) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }

    document.getElementById('photo-lambda-val').innerText = this.lambdaNm;
    document.getElementById('photo-current-val').innerText = current.toFixed(1);
    document.getElementById('photo-e-photon').innerText = `${res.photonEnergyEV.toFixed(2)} eV`;
    document.getElementById('photo-work-func').innerText = `${metal.workFuncEV.toFixed(2)} eV`;
    document.getElementById('photo-ek-max').innerText = `${res.kineticMaxEV.toFixed(2)} eV`;
    document.getElementById('photo-u-stop').innerText = `${res.stoppingVoltageV.toFixed(2)} V`;

    // Grafik chizish: I(U) egri chizig'i
    const pts = [];
    for (let u = -4; u <= 4; u += 0.2) {
      const uRes = PhysicsMath.photoelectricEffect(this.lambdaNm, metal.workFuncEV, u);
      const cur = uRes.hasEmission ? maxCurrent * uRes.currentFactor : 0;
      pts.push({ x: u, y: cur });
    }
    this.graph.setSeriesData(0, pts);
  }

  startSimulation() {
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const metal = this.metals[this.selectedMetalKey];
      const res = PhysicsMath.photoelectricEffect(this.lambdaNm, metal.workFuncEV, this.voltageV);

      // Fotonlarni hosil qilish (intensivlikka bog'liq)
      if (this.intensity > 0 && Math.random() < (this.intensity / 100) * 0.4) {
        this.photons.push({
          x: 90,
          y: 80 + Math.random() * 140,
          vx: 180,
          vy: 60,
          color: this.getWavelengthColor(this.lambdaNm)
        });
      }

      // Fotonlar harakati
      for (let i = this.photons.length - 1; i >= 0; i--) {
        const p = this.photons[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Katodga urilish tekshiruvi (katod x = 160 atrofida)
        if (p.x >= 160 && p.x <= 180 && p.y >= 100 && p.y <= 240) {
          this.photons.splice(i, 1);

          // Agar energiya yetarli bo'lsa, elektron uchib chiqadi!
          if (res.hasEmission) {
            const v0 = Math.sqrt(res.kineticMaxEV) * 120 + 20;
            this.electrons.push({
              x: 180,
              y: p.y,
              vx: v0 * (0.8 + Math.random() * 0.4),
              vy: (Math.random() - 0.5) * 40
            });
          }
        } else if (p.x > 500 || p.y > 350) {
          this.photons.splice(i, 1);
        }
      }

      // Elektronlar harakati (kuchlanish ta'sirida tezlanish yoki tormozlanish)
      // a = e * U / (m * d)
      const eAcc = this.voltageV * 60; // tezlanish koeffitsiyenti

      for (let j = this.electrons.length - 1; j >= 0; j--) {
        const el = this.electrons[j];
        el.vx += eAcc * dt;
        el.x += el.vx * dt;
        el.y += el.vy * dt;

        // Anodga yetib bordi (x = 360)
        if (el.x >= 360) {
          this.electrons.splice(j, 1);
        } else if (el.x < 175) {
          // Qaytib katodga tushdi (tormozlandi)
          this.electrons.splice(j, 1);
        } else if (el.y < 80 || el.y > 260) {
          this.electrons.splice(j, 1);
        }
      }

      this.render();
      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width = this.canvas.offsetWidth;
    const h = this.canvas.height = this.canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    // Vakuum kolbasi (shisha balon)
    ctx.fillStyle = '#0b1329';
    ctx.beginPath();
    ctx.ellipse(270, 170, 150, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Katod (K) - metall plastina
    ctx.fillStyle = '#64748b';
    ctx.fillRect(160, 100, 14, 140);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(160, 100, 14, 140);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Katod (K)", 167, 90);
    ctx.fillText(this.selectedMetalKey, 167, 175);

    // Anod (A) - o'ng plastina / to'r
    ctx.fillStyle = '#475569';
    ctx.fillRect(360, 100, 12, 140);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(360, 100, 12, 140);
    ctx.fillText("Anod (A)", 366, 90);

    // Chiroq (Yorug'lik manbai)
    const lampColor = this.getWavelengthColor(this.lambdaNm);
    ctx.fillStyle = lampColor;
    ctx.shadowColor = lampColor;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(80, 80, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Fotonlarni chizish (to'lqinsimon zarrachalar)
    this.photons.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Elektronlarni chizish (ko'k nuqtalar)
    this.electrons.forEach(el => {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(el.x, el.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Elektr zanjiri va asboblar (Ampermetr va Voltmetr)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(167, 240);
    ctx.lineTo(167, 320);
    ctx.lineTo(240, 320);
    ctx.moveTo(300, 320);
    ctx.lineTo(366, 320);
    ctx.lineTo(366, 240);
    ctx.stroke();

    // Mikroampermetr (µA)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(270, 320, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("µA", 270, 320);
  }

  getMeasurements() {
    PhysicsMath.playSound('ping');
    const metal = this.metals[this.selectedMetalKey];
    const res = PhysicsMath.photoelectricEffect(this.lambdaNm, metal.workFuncEV, this.voltageV);
    const maxCurrent = (this.intensity / 100) * 25;
    const current = res.hasEmission ? maxCurrent * res.currentFactor : 0;

    return {
      metal: metal.name,
      lambda: `${this.lambdaNm} nm`,
      freq: `${(res.freqHz / 1e14).toFixed(2)}`,
      current: `${current.toFixed(1)} µA`,
      uStop: `${res.stoppingVoltageV.toFixed(2)} V`,
      ekMax: `${res.kineticMaxEV.toFixed(2)} eV`
    };
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhotoelectricSimulation;
}
