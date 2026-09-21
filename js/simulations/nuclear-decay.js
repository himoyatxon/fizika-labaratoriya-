/**
 * Virtual Fizika Laboratoriyasi - 4.2 Radioaktiv yemirilish qonuni va yarim yemirilish davri
 */

class DecaySimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    this.isotopes = {
      custom: { name: "Model namuna (T = 5 s)", halfLifeSec: 5, unit: "sekund" },
      I131: { name: "Yod-131 (T = 8 kun)", halfLifeSec: 8, unit: "kun" },
      C14: { name: "Uglerod-14 (T = 5730 yil)", halfLifeSec: 10, unit: "yil (masshtab)" },
      Po218: { name: "Poloniy-218 (T = 3.1 daq)", halfLifeSec: 4, unit: "daqiqa" }
    };

    this.selectedIsotope = "custom";
    this.initialCount = 400; // Yadrolar soni
    this.halfLife = 5; // soniya
    this.timeElapsed = 0;
    this.isRunning = false;
    this.animId = null;

    this.nuclei = []; // { x, y, isDecayed, decayTime }
    this.soundEnabled = true;
    this.bursts = []; // chaqnash animatsiyasi
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-canvas-area relative">
          <canvas id="decay-canvas" class="w-full h-[380px] rounded-xl bg-slate-900 border border-slate-800 shadow-inner"></canvas>
          
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-amber-400 font-mono border border-slate-700">
              Vaqt t: <span id="decay-time-val">0.00</span> s
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-emerald-400 font-mono border border-slate-700">
              Qolgan N: <span id="decay-remain-val">400</span> (<span id="decay-percent-val">100%</span>)
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-rose-400 font-mono border border-slate-700">
              Yemirildi ΔN: <span id="decay-count-val">0</span>
            </span>
          </div>

          <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 w-64">
            <div class="flex justify-between"><span class="text-slate-400">Yarim davr T₁/₂:</span> <span id="decay-halflife-val" class="text-cyan-300 font-bold">5.00 s</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Nazariy N(t):</span> <span id="decay-theo-val" class="text-indigo-300">400 ta</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Faollik A (Bq):</span> <span id="decay-activity-val" class="text-amber-400 font-bold">55.45 Bq</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Qonun:</span> <span class="text-slate-400">N = N₀ · 2^(-t/T)</span></div>
          </div>
        </div>

        <!-- Boshqaruv paneli -->
        <div class="sim-controls grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Radioaktiv izotop</label>
            <select id="select-isotope" class="w-full px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="custom" selected>Model namuna (T = 5 s)</option>
              <option value="I131">Yod-131 (T = 8 s)</option>
              <option value="C14">Uglerod-14 (T = 10 s)</option>
              <option value="Po218">Poloniy-218 (T = 4 s)</option>
            </select>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Boshlang'ich yadrolar N₀:</span>
              <span id="slider-n0-val" class="text-blue-400 font-mono">400</span>
            </div>
            <input type="range" id="slider-n0" min="100" max="600" step="50" value="400" class="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Yarim yemirilish T₁/₂:</span>
              <span id="slider-t-half-val" class="text-cyan-400 font-mono">5.0 s</span>
            </div>
            <input type="range" id="slider-t-half" min="2" max="15" step="0.5" value="5" class="w-full h-1.5 bg-slate-700 rounded-lg accent-cyan-500 cursor-pointer">
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-300">Geyger hisoblagichi</label>
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="check-geiger-sound" checked class="sr-only peer">
                <div class="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                <span class="ml-2 text-xs text-slate-300">Ovozli chertish</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Tugmalar -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div class="flex gap-2">
            <button id="btn-decay-start" class="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-emerald-900/30">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Boshlash
            </button>
            <button id="btn-decay-pause" class="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Pauza
            </button>
            <button id="btn-decay-reset" class="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition">
              Qayta o'rnatish
            </button>
          </div>

          <button id="btn-decay-record" class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/30">
            <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg> O'lchovni qayd qilish
          </button>
        </div>

        <!-- Eksponentsial grafik -->
        <div class="mt-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="text-xs font-semibold text-slate-300 mb-2">Eksponentsial yemirilish egri chizig'i N(t)</div>
          <canvas id="decay-graph" class="w-full h-[180px] rounded-lg"></canvas>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('decay-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.graphCanvas = document.getElementById('decay-graph');

    this.graph = new PhysicsGraph(this.graphCanvas, {
      title: "Yadrolar sonining vaqt bo'yicha kamayishi N(t)",
      xLabel: "Vaqt t",
      yLabel: "Yadrolar N",
      xUnit: "s",
      yUnit: "ta",
      minX: 0,
      maxX: 25,
      minY: 0,
      maxY: this.initialCount
    });
    this.graph.addSeries("Tajribaviy N", "#38bdf8");
    this.graph.addSeries("Nazariy N(t)", "#fb923c");

    this.initNuclei();
    this.bindEvents();
    this.updateCalculations();
    this.render();
  }

  initNuclei() {
    this.nuclei = [];
    this.timeElapsed = 0;
    this.bursts = [];

    const cols = 25;
    const rows = Math.ceil(this.initialCount / cols);

    for (let i = 0; i < this.initialCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      this.nuclei.push({
        col,
        row,
        isDecayed: false,
        decayTime: null
      });
    }

    if (this.graph) {
      this.graph.setRanges(0, this.halfLife * 4, 0, this.initialCount);
      this.graph.clearData();
    }
  }

  bindEvents() {
    const selIso = document.getElementById('select-isotope');
    const sliderN0 = document.getElementById('slider-n0');
    const sliderThalf = document.getElementById('slider-t-half');
    const checkSound = document.getElementById('check-geiger-sound');

    const btnStart = document.getElementById('btn-decay-start');
    const btnPause = document.getElementById('btn-decay-pause');
    const btnReset = document.getElementById('btn-decay-reset');

    selIso.addEventListener('change', (e) => {
      this.selectedIsotope = e.target.value;
      this.halfLife = this.isotopes[this.selectedIsotope].halfLifeSec;
      sliderThalf.value = this.halfLife;
      document.getElementById('slider-t-half-val').innerText = `${this.halfLife.toFixed(1)} s`;
      this.reset();
    });

    sliderN0.addEventListener('input', (e) => {
      this.initialCount = parseInt(e.target.value);
      document.getElementById('slider-n0-val').innerText = this.initialCount;
      this.reset();
    });

    sliderThalf.addEventListener('input', (e) => {
      this.halfLife = parseFloat(e.target.value);
      document.getElementById('slider-t-half-val').innerText = `${this.halfLife.toFixed(1)} s`;
      this.updateCalculations();
    });

    checkSound.addEventListener('change', (e) => {
      this.soundEnabled = e.target.checked;
    });

    btnStart.addEventListener('click', () => this.start());
    btnPause.addEventListener('click', () => this.pause());
    btnReset.addEventListener('click', () => this.reset());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (now) => {
      if (!this.isRunning) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      this.timeElapsed += dt;

      // Har bir yadro uchun yemirilish ehtimoli
      // p = 1 - 2^(-dt / T)
      const pDecay = 1 - Math.pow(2, -dt / this.halfLife);
      let newlyDecayed = 0;

      this.nuclei.forEach(n => {
        if (!n.isDecayed && Math.random() < pDecay) {
          n.isDecayed = true;
          n.decayTime = this.timeElapsed;
          newlyDecayed++;

          // Chaqnash effekti
          this.bursts.push({ col: n.col, row: n.row, alpha: 1.0 });
        }
      });

      if (newlyDecayed > 0 && this.soundEnabled) {
        PhysicsMath.playSound('geiger');
      }

      // Chaqnashlarni so'ndirish
      for (let b = this.bursts.length - 1; b >= 0; b--) {
        this.bursts[b].alpha -= dt * 3;
        if (this.bursts[b].alpha <= 0) this.bursts.splice(b, 1);
      }

      this.updateCalculations();
      this.render();

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  pause() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  reset() {
    this.pause();
    this.initNuclei();
    this.updateCalculations();
    this.render();
  }

  updateCalculations() {
    const remaining = this.nuclei.filter(n => !n.isDecayed).length;
    const decayed = this.initialCount - remaining;
    const percent = (remaining / this.initialCount) * 100;

    const theo = PhysicsMath.radioactiveDecay(this.initialCount, this.halfLife, this.timeElapsed);

    document.getElementById('decay-time-val').innerText = this.timeElapsed.toFixed(2);
    document.getElementById('decay-remain-val').innerText = remaining;
    document.getElementById('decay-percent-val').innerText = `${percent.toFixed(1)}%`;
    document.getElementById('decay-count-val').innerText = decayed;
    document.getElementById('decay-halflife-val').innerText = `${this.halfLife.toFixed(1)} s`;
    document.getElementById('decay-theo-val').innerText = `${theo.remaining} ta`;
    document.getElementById('decay-activity-val').innerText = `${theo.activity.toFixed(1)} Bq`;

    // Grafik
    this.graph.addDataPoint(0, this.timeElapsed, remaining);
    this.graph.addDataPoint(1, this.timeElapsed, theo.remaining);
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width = this.canvas.offsetWidth;
    const h = this.canvas.height = this.canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    // Panjara parametrlarini hisoblash
    const cols = 25;
    const rows = Math.ceil(this.initialCount / cols);
    const cellW = (w - 120) / cols;
    const cellH = (h - 100) / rows;
    const startX = 60;
    const startY = 50;

    // Radioaktiv kameraning foni
    ctx.fillStyle = '#060d1b';
    ctx.fillRect(startX - 15, startY - 15, cols * cellW + 30, rows * cellH + 30);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 15, startY - 15, cols * cellW + 30, rows * cellH + 30);

    // Yadrolar to'plamini chizish
    this.nuclei.forEach(n => {
      const cx = startX + n.col * cellW + cellW / 2;
      const cy = startY + n.row * cellH + cellH / 2;

      ctx.beginPath();
      if (n.isDecayed) {
        // Yemirilgan yadro (barqaror qoldiq - to'q kulrang)
        ctx.fillStyle = '#334155';
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Radioaktiv faol yadro (yorqin qizil/zangori)
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#f87171';
        ctx.shadowBlur = 4;
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Chaqnash animatsiyalari
    this.bursts.forEach(b => {
      const bx = startX + b.col * cellW + cellW / 2;
      const by = startY + b.row * cellH + cellH / 2;

      ctx.fillStyle = `rgba(250, 204, 21, ${b.alpha})`;
      ctx.beginPath();
      ctx.arc(bx, by, 10 * (1 - b.alpha * 0.5), 0, Math.PI * 2);
      ctx.fill();
    });

    // Geyger hisoblagich datchigi (o'ng tomonda)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(w - 50, startY, 35, 70);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(w - 50, startY, 35, 70);

    ctx.fillStyle = this.soundEnabled ? '#10b981' : '#64748b';
    ctx.beginPath();
    ctx.arc(w - 32, startY + 25, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("SENSOR", w - 32, startY + 55);
  }

  getMeasurements() {
    PhysicsMath.playSound('ping');
    const remaining = this.nuclei.filter(n => !n.isDecayed).length;
    const decayed = this.initialCount - remaining;
    const percent = ((remaining / this.initialCount) * 100).toFixed(1);
    const theo = PhysicsMath.radioactiveDecay(this.initialCount, this.halfLife, this.timeElapsed);

    return {
      time: `${this.timeElapsed.toFixed(2)} s`,
      nRemaining: `${remaining} ta`,
      nDecayed: `${decayed} ta`,
      percent: `${percent}%`,
      theoN: `${theo.remaining} ta`
    };
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DecaySimulation;
}
