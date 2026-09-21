/**
 * Virtual Fizika Laboratoriyasi - 3.2 Karno sikli va Termodinamikaning 1-qonuni
 */

class CarnotSimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.T1 = 600; // Qizdirgich harorati (K)
    this.T2 = 300; // Sovitkich harorati (K)

    this.currentStage = 0; // 0: 1->2 (Izoterma 1), 1: 2->3 (Adiabata 1), 2: 3->4 (Izoterma 2), 3: 4->1 (Adiabata 2)
    this.stageProgress = 0.0; // 0 dan 1 gacha
    this.isAutoRunning = false;
    this.animId = null;

    // Karno sikli parametrlari
    this.gamma = 1.4; // Adiabata ko'rsatkichi (havo/ikki atomli gaz)
    this.Q1 = 0;
    this.Q2 = 0;
    this.work = 0;
    this.eta = 0;

    this.cyclePoints = [];
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-canvas-area relative">
          <canvas id="carnot-canvas" class="w-full h-[380px] rounded-xl bg-slate-900 border border-slate-800 shadow-inner"></canvas>
          
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-rose-400 font-mono border border-slate-700">
              Qizdirgich T₁: <span id="carnot-t1-val">600</span> K
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-cyan-400 font-mono border border-slate-700">
              Sovitkich T₂: <span id="carnot-t2-val">300</span> K
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-emerald-400 font-mono border border-slate-700">
              FIK η: <span id="carnot-eta-val">50.0%</span>
            </span>
          </div>

          <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 w-64">
            <div class="flex justify-between"><span class="text-slate-400">Joriy bosqich:</span> <span id="carnot-stage-name" class="text-cyan-300 font-bold">1-2: Izotermik kengayish</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Q₁ (olingan issiqlik):</span> <span id="carnot-q1-val" class="text-rose-400 font-bold">1200 J</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Q₂ (berilgan issiqlik):</span> <span id="carnot-q2-val" class="text-blue-400">600 J</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Sof foydali ish A:</span> <span id="carnot-work-val" class="text-emerald-400 font-bold">600 J</span></div>
          </div>
        </div>

        <!-- Boshqaruv paneli -->
        <div class="sim-controls grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Qizdirgich harorati T₁:</span>
              <span id="slider-carnot-t1-val" class="text-rose-400 font-mono">600 K</span>
            </div>
            <input type="range" id="slider-carnot-t1" min="400" max="900" step="10" value="600" class="w-full h-1.5 bg-slate-700 rounded-lg accent-rose-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Sovitkich harorati T₂:</span>
              <span id="slider-carnot-t2-val" class="text-cyan-400 font-mono">300 K</span>
            </div>
            <input type="range" id="slider-carnot-t2" min="150" max="380" step="10" value="300" class="w-full h-1.5 bg-slate-700 rounded-lg accent-cyan-500 cursor-pointer">
          </div>

          <div class="space-y-2 col-span-2">
            <label class="text-xs font-semibold text-slate-300">Siklni boshqarish</label>
            <div class="flex gap-2">
              <button id="btn-carnot-step" class="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow">
                Keyingi bosqich ▶
              </button>
              <button id="btn-carnot-auto" class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow">
                Avtomatik sikl ⟳
              </button>
              <button id="btn-carnot-reset" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition">
                Boshiga
              </button>
            </div>
          </div>
        </div>

        <!-- Tugmalar va ma'lumot -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div class="text-xs text-slate-400">
            <span>Sikl bosqichlari: 1-2 (T₁ da Izoterma) ➔ 2-3 (Adiabata) ➔ 3-4 (T₂ da Izoterma) ➔ 4-1 (Adiabata)</span>
          </div>

          <button id="btn-carnot-record" class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/30">
            <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg> O'lchovni qayd qilish
          </button>
        </div>

        <!-- P-V Karno grafigi -->
        <div class="mt-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="text-xs font-semibold text-slate-300 mb-2">Karno sikli P-V diagrammasi (Soha yuzasi = Foydali ish A)</div>
          <canvas id="carnot-graph" class="w-full h-[180px] rounded-lg"></canvas>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('carnot-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.graphCanvas = document.getElementById('carnot-graph');

    this.graph = new PhysicsGraph(this.graphCanvas, {
      title: "Karno P - V Sikli",
      xLabel: "Hajm V",
      yLabel: "Bosim P",
      xUnit: "L",
      yUnit: "kPa",
      minX: 1,
      maxX: 12,
      minY: 0,
      maxY: 350
    });
    this.graph.addSeries("Karno Sikli", "#10b981", true);

    this.bindEvents();
    this.updateCalculations();
    this.render();
  }

  bindEvents() {
    const sliderT1 = document.getElementById('slider-carnot-t1');
    const sliderT2 = document.getElementById('slider-carnot-t2');
    const btnStep = document.getElementById('btn-carnot-step');
    const btnAuto = document.getElementById('btn-carnot-auto');
    const btnReset = document.getElementById('btn-carnot-reset');

    sliderT1.addEventListener('input', (e) => {
      this.T1 = parseFloat(e.target.value);
      if (this.T1 <= this.T2 + 20) {
        this.T1 = this.T2 + 20;
        e.target.value = this.T1;
      }
      document.getElementById('slider-carnot-t1-val').innerText = `${this.T1} K`;
      this.updateCalculations();
      this.render();
    });

    sliderT2.addEventListener('input', (e) => {
      this.T2 = parseFloat(e.target.value);
      if (this.T2 >= this.T1 - 20) {
        this.T2 = this.T1 - 20;
        e.target.value = this.T2;
      }
      document.getElementById('slider-carnot-t2-val').innerText = `${this.T2} K`;
      this.updateCalculations();
      this.render();
    });

    btnStep.addEventListener('click', () => {
      this.currentStage = (this.currentStage + 1) % 4;
      this.stageProgress = 0;
      this.updateCalculations();
      this.render();
      PhysicsMath.playSound('click');
    });

    btnAuto.addEventListener('click', () => {
      this.isAutoRunning = !this.isAutoRunning;
      btnAuto.innerText = this.isAutoRunning ? "To'xtatish ⏸" : "Avtomatik sikl ⟳";
      btnAuto.className = this.isAutoRunning
        ? "flex-1 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium transition shadow"
        : "flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow";

      if (this.isAutoRunning) {
        this.runAutoLoop();
      }
    });

    btnReset.addEventListener('click', () => {
      this.isAutoRunning = false;
      this.currentStage = 0;
      this.stageProgress = 0;
      btnAuto.innerText = "Avtomatik sikl ⟳";
      btnAuto.className = "flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow";
      this.updateCalculations();
      this.render();
    });
  }

  runAutoLoop() {
    let lastTime = performance.now();

    const loop = (now) => {
      if (!this.isAutoRunning) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      this.stageProgress += dt * 0.75;
      if (this.stageProgress >= 1.0) {
        this.stageProgress = 0;
        this.currentStage = (this.currentStage + 1) % 4;
        PhysicsMath.playSound('click');
      }

      this.updateCalculations();
      this.render();

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  updateCalculations() {
    // Nazariy FIK: eta = (T1 - T2) / T1
    this.eta = (this.T1 - this.T2) / this.T1;
    this.Q1 = Math.round(this.T1 * 2);
    this.work = Math.round(this.Q1 * this.eta);
    this.Q2 = this.Q1 - this.work;

    document.getElementById('carnot-t1-val').innerText = Math.round(this.T1);
    document.getElementById('carnot-t2-val').innerText = Math.round(this.T2);
    document.getElementById('carnot-eta-val').innerText = `${(this.eta * 100).toFixed(1)}%`;
    document.getElementById('carnot-q1-val').innerText = `${this.Q1} J`;
    document.getElementById('carnot-q2-val').innerText = `${this.Q2} J`;
    document.getElementById('carnot-work-val').innerText = `${this.work} J`;

    const stageNames = [
      "1-2: Qizdirgichdan Izotermik kengayish (T₁)",
      "2-3: Izolyatsiyalangan Adiabatik kengayish",
      "3-4: Sovitkichga Izotermik siqilish (T₂)",
      "4-1: Izolyatsiyalangan Adiabatik siqilish"
    ];
    document.getElementById('carnot-stage-name').innerText = stageNames[this.currentStage];

    // Grafik uchun 4 ta nuqta va egri chiziqlar
    const v1 = 2.0;
    const v2 = 4.5;
    const v3 = 9.0;
    const v4 = 4.0;

    const p1 = (this.T1 / 600) * 280;
    const p2 = p1 * (v1 / v2);
    const p3 = p2 * Math.pow(v2 / v3, this.gamma);
    const p4 = p3 * (v3 / v4);

    const pts = [
      { x: v1, y: p1 },
      { x: v2, y: p2 },
      { x: v3, y: p3 },
      { x: v4, y: p4 },
      { x: v1, y: p1 }
    ];

    this.graph.setSeriesData(0, pts);
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width = this.canvas.offsetWidth;
    const h = this.canvas.height = this.canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    const cylX = 60;
    const cylY = 60;
    const cylW = 280;
    const cylH = 140;

    // Joriy hajm bosqichga qarab o'zgaradi
    let vNorm = 0.2;
    if (this.currentStage === 0) {
      vNorm = 0.2 + this.stageProgress * 0.3; // 1-2
    } else if (this.currentStage === 1) {
      vNorm = 0.5 + this.stageProgress * 0.35; // 2-3
    } else if (this.currentStage === 2) {
      vNorm = 0.85 - this.stageProgress * 0.45; // 3-4
    } else {
      vNorm = 0.4 - this.stageProgress * 0.2; // 4-1
    }

    const pistonX = cylX + 40 + vNorm * (cylW - 80);

    // Silindr foni
    ctx.fillStyle = this.currentStage === 0 ? 'rgba(239, 68, 68, 0.15)' :
                    (this.currentStage === 2 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.8)');
    ctx.fillRect(cylX, cylY, pistonX - cylX, cylH);

    // Silindr devorlari
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cylX + cylW, cylY);
    ctx.lineTo(cylX, cylY);
    ctx.lineTo(cylX, cylY + cylH);
    ctx.lineTo(cylX + cylW, cylY + cylH);
    ctx.stroke();

    // Porshen
    ctx.fillStyle = '#64748b';
    ctx.fillRect(pistonX - 10, cylY + 2, 16, cylH - 4);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(pistonX - 10, cylY + 2, 16, cylH - 4);

    // Shtok
    ctx.fillStyle = '#475569';
    ctx.fillRect(pistonX + 6, cylY + cylH / 2 - 8, cylW - (pistonX - cylX), 16);

    // Pastdagi rezervuar (Issiqlik almashinuvchi sirt)
    const baseH = 45;
    const baseY = cylY + cylH + 10;

    let resColor = '#334155';
    let resLabel = 'Adiabatik izolyatsiya (Q = 0)';

    if (this.currentStage === 0) {
      resColor = '#ef4444';
      resLabel = `Qizdirgich T₁ = ${Math.round(this.T1)} K (Issiqlik olinmoqda Q₁)`;
    } else if (this.currentStage === 2) {
      resColor = '#0284c7';
      resLabel = `Sovitkich T₂ = ${Math.round(this.T2)} K (Issiqlik berilmoqda Q₂)`;
    }

    ctx.fillStyle = resColor;
    ctx.fillRect(cylX, baseY, cylW - 40, baseH);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(cylX, baseY, cylW - 40, baseH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(resLabel, cylX + (cylW - 40) / 2, baseY + 28);

    // Issiqlik oqimi strelkalari
    if (this.currentStage === 0) {
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 2.5;
      for (let ax = cylX + 40; ax < pistonX - 20; ax += 30) {
        ctx.beginPath();
        ctx.moveTo(ax, baseY - 2);
        ctx.lineTo(ax, baseY - 14);
        ctx.stroke();
      }
    } else if (this.currentStage === 2) {
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 2.5;
      for (let ax = cylX + 40; ax < pistonX - 20; ax += 30) {
        ctx.beginPath();
        ctx.moveTo(ax, baseY - 14);
        ctx.lineTo(ax, baseY - 2);
        ctx.stroke();
      }
    }
  }

  getMeasurements() {
    PhysicsMath.playSound('ping');
    return {
      T1: `${Math.round(this.T1)} K`,
      T2: `${Math.round(this.T2)} K`,
      Q1: `${this.Q1} J`,
      Q2: `${this.Q2} J`,
      A: `${this.work} J`,
      eta: `${(this.eta * 100).toFixed(1)}%`
    };
  }

  destroy() {
    this.isAutoRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CarnotSimulation;
}
