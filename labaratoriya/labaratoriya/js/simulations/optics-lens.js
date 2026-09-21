/**
 * Virtual Fizika Laboratoriyasi - 2.2 Yupqa linzada tasvir hosil bo'lishi
 */

class LensSimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lensType = 'converging'; // 'converging' (yig'uvchi) yoki 'diverging' (sochuvchi)
    this.F = 15; // sm (fokus masofasi)
    this.d = 30; // sm (jismdan linzagacha masofa)
    this.h = 10; // sm (jism balandligi)

    this.isDraggingObject = false;
    this.pixelsPerCm = 6;
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-canvas-area relative">
          <canvas id="lens-canvas" class="w-full h-[400px] rounded-xl bg-slate-900 border border-slate-800 shadow-inner"></canvas>
          
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-amber-400 font-mono border border-slate-700">
              Jism d: <span id="lens-val-d">30.0 sm</span>
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-cyan-400 font-mono border border-slate-700">
              Tasvir f: <span id="lens-val-f">30.0 sm</span>
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-emerald-400 font-mono border border-slate-700">
              Optik kuch D: <span id="lens-val-dptr">+6.67 dptr</span>
            </span>
          </div>

          <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 w-64">
            <div class="flex justify-between"><span class="text-slate-400">Tasvir xususiyati:</span> <span id="lens-type-str" class="text-indigo-300 font-bold">Haqiqiy, teng</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Kattalashtirish k:</span> <span id="lens-val-k" class="text-amber-400 font-bold">1.00</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Tasvir balandligi H:</span> <span id="lens-val-h-img" class="text-cyan-300">10.0 sm</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Linza formulasi:</span> <span class="text-slate-300">1/F = 1/d + 1/f</span></div>
          </div>
        </div>

        <!-- Boshqaruv elementlari -->
        <div class="sim-controls grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-300">Linza turi</label>
            <div class="grid grid-cols-2 gap-2">
              <button id="btn-lens-conv" class="px-3 py-1.5 rounded-lg text-xs font-medium transition ${this.lensType === 'converging' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}">Yig'uvchi (+)</button>
              <button id="btn-lens-div" class="px-3 py-1.5 rounded-lg text-xs font-medium transition ${this.lensType === 'diverging' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}">Sochuvchi (-)</button>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Fokus masofasi F:</span>
              <span id="slider-f-val" class="text-blue-400 font-mono">15 sm</span>
            </div>
            <input type="range" id="slider-f" min="8" max="25" step="1" value="15" class="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Jism masofasi d:</span>
              <span id="slider-d-val" class="text-amber-400 font-mono">30 sm</span>
            </div>
            <input type="range" id="slider-d" min="5" max="55" step="1" value="30" class="w-full h-1.5 bg-slate-700 rounded-lg accent-amber-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Jism balandligi h:</span>
              <span id="slider-h-val" class="text-cyan-400 font-mono">10 sm</span>
            </div>
            <input type="range" id="slider-h" min="4" max="18" step="1" value="10" class="w-full h-1.5 bg-slate-700 rounded-lg accent-cyan-500 cursor-pointer">
          </div>
        </div>

        <!-- Tugmalar -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <span>💡 Ko'rsatma: Jismni (shamni) sichqoncha bilan ushlab ham siljitishingiz mumkin</span>
          </div>

          <button id="btn-lens-record" class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/30">
            <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg> O'lchovni qayd qilish
          </button>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('lens-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.bindEvents();
    this.updateCalculations();
    this.render();
  }

  bindEvents() {
    const btnConv = document.getElementById('btn-lens-conv');
    const btnDiv = document.getElementById('btn-lens-div');
    const sliderF = document.getElementById('slider-f');
    const sliderD = document.getElementById('slider-d');
    const sliderH = document.getElementById('slider-h');

    btnConv.addEventListener('click', () => {
      this.lensType = 'converging';
      btnConv.className = "px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-600 text-white";
      btnDiv.className = "px-3 py-1.5 rounded-lg text-xs font-medium transition bg-slate-700 text-slate-300";
      this.updateCalculations();
      this.render();
    });

    btnDiv.addEventListener('click', () => {
      this.lensType = 'diverging';
      btnDiv.className = "px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-600 text-white";
      btnConv.className = "px-3 py-1.5 rounded-lg text-xs font-medium transition bg-slate-700 text-slate-300";
      this.updateCalculations();
      this.render();
    });

    sliderF.addEventListener('input', (e) => {
      this.F = parseFloat(e.target.value);
      document.getElementById('slider-f-val').innerText = `${this.F} sm`;
      this.updateCalculations();
      this.render();
    });

    sliderD.addEventListener('input', (e) => {
      this.d = parseFloat(e.target.value);
      document.getElementById('slider-d-val').innerText = `${this.d} sm`;
      this.updateCalculations();
      this.render();
    });

    sliderH.addEventListener('input', (e) => {
      this.h = parseFloat(e.target.value);
      document.getElementById('slider-h-val').innerText = `${this.h} sm`;
      this.updateCalculations();
      this.render();
    });

    // Drag object on canvas
    this.canvas.addEventListener('mousedown', (e) => this.handleDragStart(e));
    window.addEventListener('mousemove', (e) => this.handleDragMove(e));
    window.addEventListener('mouseup', () => { this.isDraggingObject = false; });
  }

  handleDragStart(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const objX = cx - this.d * this.pixelsPerCm;
    const objY = cy - this.h * this.pixelsPerCm;

    if (Math.hypot(mx - objX, my - objY) < 35 || Math.abs(mx - objX) < 20) {
      this.isDraggingObject = true;
    }
  }

  handleDragMove(e) {
    if (!this.isDraggingObject) return;
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const cx = this.canvas.width / 2;

    const newD = Math.max(5, Math.min(55, (cx - mx) / this.pixelsPerCm));
    this.d = Math.round(newD);
    document.getElementById('slider-d').value = this.d;
    document.getElementById('slider-d-val').innerText = `${this.d} sm`;

    this.updateCalculations();
    this.render();
  }

  updateCalculations() {
    const signF = this.lensType === 'converging' ? this.F : -this.F;
    const res = PhysicsMath.thinLens(signF, this.d, this.h);

    const dptr = (100 / signF).toFixed(2);
    document.getElementById('lens-val-dptr').innerText = `${dptr > 0 ? '+' : ''}${dptr} dptr`;
    document.getElementById('lens-val-d').innerText = `${this.d.toFixed(1)} sm`;

    if (res.isAtInfinity) {
      document.getElementById('lens-val-f').innerText = "∞ (Cheksizlik)";
      document.getElementById('lens-val-k').innerText = "---";
      document.getElementById('lens-val-h-img').innerText = "---";
      document.getElementById('lens-type-str').innerText = "Tasvir cheksizlikda";
    } else {
      document.getElementById('lens-val-f').innerText = `${Math.abs(res.f).toFixed(1)} sm`;
      document.getElementById('lens-val-k').innerText = res.k.toFixed(2);
      document.getElementById('lens-val-h-img').innerText = `${Math.abs(res.H).toFixed(1)} sm`;
      document.getElementById('lens-type-str').innerText = res.typeStr;
    }
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width = this.canvas.offsetWidth;
    const h = this.canvas.height = this.canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = this.pixelsPerCm;

    // Asosiy optik o'q
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, cy);
    ctx.lineTo(w - 10, cy);
    ctx.stroke();

    // Fokus va 2F nuqtalari
    const fPx = this.F * scale;
    const points = [
      { x: cx - 2 * fPx, label: "-2F" },
      { x: cx - fPx, label: "-F" },
      { x: cx + fPx, label: "+F" },
      { x: cx + 2 * fPx, label: "+2F" },
      { x: cx, label: "O" }
    ];

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';

    points.forEach(pt => {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(pt.x, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(pt.label, pt.x, cy + 18);
    });

    // Linza chizish
    const lensH = 150;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - lensH);
    ctx.lineTo(cx, cy + lensH);
    ctx.stroke();

    // Linza strelkalari (yig'uvchi yoki sochuvchi)
    const arrowSize = 10;
    ctx.beginPath();
    if (this.lensType === 'converging') {
      // Yig'uvchi: tashqariga strelka ^
      ctx.moveTo(cx - arrowSize, cy - lensH + arrowSize);
      ctx.lineTo(cx, cy - lensH);
      ctx.lineTo(cx + arrowSize, cy - lensH + arrowSize);

      ctx.moveTo(cx - arrowSize, cy + lensH - arrowSize);
      ctx.lineTo(cx, cy + lensH);
      ctx.lineTo(cx + arrowSize, cy + lensH - arrowSize);
    } else {
      // Sochuvchi: ichkariga strelka v
      ctx.moveTo(cx - arrowSize, cy - lensH);
      ctx.lineTo(cx, cy - lensH + arrowSize);
      ctx.lineTo(cx + arrowSize, cy - lensH);

      ctx.moveTo(cx - arrowSize, cy + lensH);
      ctx.lineTo(cx, cy + lensH - arrowSize);
      ctx.lineTo(cx + arrowSize, cy + lensH);
    }
    ctx.stroke();

    // Predmet (Jism / Sham)
    const objX = cx - this.d * scale;
    const objY = cy - this.h * scale;

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, objY);
    ctx.stroke();

    // Sham alanga uchi
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(objX, objY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(objX, objY - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText("Predmet (h)", objX, cy - this.h * scale - 12);

    // Hisob-kitoblar va tasvir
    const signF = this.lensType === 'converging' ? this.F : -this.F;
    const res = PhysicsMath.thinLens(signF, this.d, this.h);

    if (!res.isAtInfinity && Math.abs(res.f) < 150) {
      const imgX = cx + res.f * scale;
      const imgY = cy + res.H * scale;

      // Tasvir strelkasi
      ctx.strokeStyle = res.isReal ? '#10b981' : '#a855f7';
      ctx.lineWidth = 3;
      if (!res.isReal) ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(imgX, cy);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = res.isReal ? '#10b981' : '#a855f7';
      ctx.beginPath();
      ctx.arc(imgX, imgY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`Tasvir (H)`, imgX, imgY + (res.isInverted ? 15 : -10));

      // Asosiy optik nurlar
      // 1-nur: Parallel o'qqa -> linzagacha -> fokus orqali
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(cx, objY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();

      // 2-nur: Markaz O orqali to'g'ri o'tuvchi
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();

      // Mavhum bo'lsa punktir davomi
      if (!res.isReal) {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, objY);
        ctx.lineTo(imgX, imgY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  getMeasurements() {
    PhysicsMath.playSound('ping');
    const signF = this.lensType === 'converging' ? this.F : -this.F;
    const res = PhysicsMath.thinLens(signF, this.d, this.h);

    return {
      type: this.lensType === 'converging' ? "Yig'uvchi" : "Sochuvchi",
      F: `${this.F} sm`,
      d: `${this.d} sm`,
      fExp: res.isAtInfinity ? "∞" : `${Math.abs(res.f).toFixed(1)} sm`,
      mag: res.isAtInfinity ? "∞" : `${res.k.toFixed(2)}x`,
      nature: res.isAtInfinity ? "Cheksizlikda" : res.typeStr
    };
  }

  destroy() {}
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LensSimulation;
}
