/**
 * Virtual Fizika Laboratoriyasi - 2.1 Yorug'likning sinishi va Snellius qonuni
 */

class RefractionSimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.n1 = 1.00; // Havo
    this.n2 = 1.50; // Shisha
    this.medium1Name = "Havo";
    this.medium2Name = "Shisha";
    this.alphaDeg = 45; // Tushish burchagi
    this.laserColor = "#ef4444"; // Qizil lazer
    this.showProtractor = true;
    this.showNormal = true;
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-canvas-area relative">
          <canvas id="refraction-canvas" class="w-full h-[420px] rounded-xl bg-slate-900 border border-slate-800 shadow-inner"></canvas>
          
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-amber-400 font-mono border border-slate-700">
              Tushish burchagi α: <span id="opt-alpha-val">45.0°</span>
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-cyan-400 font-mono border border-slate-700">
              Sinish burchagi β: <span id="opt-beta-val">28.1°</span>
            </span>
            <span id="opt-tir-badge" class="hidden px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded text-xs font-semibold animate-pulse">
              ⚡ To'la ichki qaytish!
            </span>
          </div>

          <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 w-64">
            <div class="flex justify-between"><span class="text-slate-400">Snellius qonuni:</span> <span class="text-white">n₁·sinα = n₂·sinβ</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Nisbiy n₂₁ = n₂/n₁:</span> <span id="opt-n21" class="text-cyan-300 font-bold">1.50</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Chegaraviy burchak α₀:</span> <span id="opt-crit-angle" class="text-amber-400">---</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Qaytish burchagi α':</span> <span id="opt-refl-val" class="text-slate-300">45.0°</span></div>
          </div>
        </div>

        <!-- Boshqaruv paneli -->
        <div class="sim-controls grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">1-muhit (Yuqori qism)</label>
            <select id="select-medium-1" class="w-full px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="1.00|Havo" selected>Havo (n = 1.00)</option>
              <option value="1.33|Suv">Suv (n = 1.33)</option>
              <option value="1.50|Shisha">Shisha (n = 1.50)</option>
              <option value="2.42|Olmos">Olmos (n = 2.42)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">2-muhit (Quyi qism)</label>
            <select id="select-medium-2" class="w-full px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="1.00|Havo">Havo (n = 1.00)</option>
              <option value="1.33|Suv">Suv (n = 1.33)</option>
              <option value="1.50|Shisha" selected>Shisha (n = 1.50)</option>
              <option value="2.42|Olmos">Olmos (n = 2.42)</option>
            </select>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Tushish burchagi α:</span>
              <span id="slider-alpha-val" class="text-blue-400 font-mono">45°</span>
            </div>
            <input type="range" id="slider-alpha" min="0" max="89" step="0.5" value="45" class="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Lazer nuri rangi</label>
            <div class="flex gap-2">
              <button data-color="#ef4444" class="btn-laser-col px-3 py-1 bg-red-600/30 border border-red-500 text-red-400 rounded text-xs font-medium">Qizil</button>
              <button data-color="#22c55e" class="btn-laser-col px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium">Yashil</button>
              <button data-color="#a855f7" class="btn-laser-col px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium">Binafsha</button>
            </div>
          </div>
        </div>

        <!-- Qo'shimcha asboblar -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div class="flex items-center gap-4 text-xs text-slate-300">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" id="check-opt-prot" checked class="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-0">
              <span>Transportir (Optik disk)</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" id="check-opt-norm" checked class="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-0">
              <span>Normal (Perpendikulyar)</span>
            </label>
          </div>

          <button id="btn-opt-record" class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/30">
            <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg> O'lchovni qayd qilish
          </button>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('refraction-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.bindEvents();
    this.updateCalculations();
    this.render();
  }

  bindEvents() {
    const sel1 = document.getElementById('select-medium-1');
    const sel2 = document.getElementById('select-medium-2');
    const sliderAlpha = document.getElementById('slider-alpha');
    const checkProt = document.getElementById('check-opt-prot');
    const checkNorm = document.getElementById('check-opt-norm');
    const colBtns = this.container.querySelectorAll('.btn-laser-col');

    sel1.addEventListener('change', (e) => {
      const parts = e.target.value.split('|');
      this.n1 = parseFloat(parts[0]);
      this.medium1Name = parts[1];
      this.updateCalculations();
      this.render();
    });

    sel2.addEventListener('change', (e) => {
      const parts = e.target.value.split('|');
      this.n2 = parseFloat(parts[0]);
      this.medium2Name = parts[1];
      this.updateCalculations();
      this.render();
    });

    sliderAlpha.addEventListener('input', (e) => {
      this.alphaDeg = parseFloat(e.target.value);
      document.getElementById('slider-alpha-val').innerText = `${this.alphaDeg}°`;
      this.updateCalculations();
      this.render();
    });

    colBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        colBtns.forEach(b => {
          b.className = "btn-laser-col px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium";
        });
        const c = btn.getAttribute('data-color');
        btn.className = `btn-laser-col px-3 py-1 bg-${c === '#ef4444' ? 'red' : (c === '#22c55e' ? 'green' : 'purple')}-600/30 border border-current text-white rounded text-xs font-medium`;
        this.laserColor = c;
        this.render();
      });
    });

    checkProt.addEventListener('change', (e) => {
      this.showProtractor = e.target.checked;
      this.render();
    });

    checkNorm.addEventListener('change', (e) => {
      this.showNormal = e.target.checked;
      this.render();
    });
  }

  updateCalculations() {
    const res = PhysicsMath.snellRefraction(this.n1, this.n2, this.alphaDeg);
    const n21 = (this.n2 / this.n1).toFixed(2);
    document.getElementById('opt-n21').innerText = n21;

    document.getElementById('opt-alpha-val').innerText = `${this.alphaDeg.toFixed(1)}°`;
    document.getElementById('opt-refl-val').innerText = `${this.alphaDeg.toFixed(1)}°`;

    const tirBadge = document.getElementById('opt-tir-badge');
    if (res.isTIR) {
      document.getElementById('opt-beta-val').innerText = "To'la qaytish";
      tirBadge.classList.remove('hidden');
    } else {
      document.getElementById('opt-beta-val').innerText = `${res.betaDeg.toFixed(1)}°`;
      tirBadge.classList.add('hidden');
    }

    if (res.critAngleDeg) {
      document.getElementById('opt-crit-angle').innerText = `${res.critAngleDeg.toFixed(1)}°`;
    } else {
      document.getElementById('opt-crit-angle').innerText = "Mavjud emas (n₁ ≤ n₂)";
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
    const res = PhysicsMath.snellRefraction(this.n1, this.n2, this.alphaDeg);

    // 1-muhit foni (yuqori)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, cy);

    // 2-muhit foni (quyi)
    const m2Alpha = Math.min(0.7, 0.15 + (this.n2 - 1.0) * 0.3);
    ctx.fillStyle = `rgba(30, 58, 138, ${m2Alpha})`;
    ctx.fillRect(0, cy, w, h - cy);

    // Muhit chegarasi (gorizontal chiziq)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Muhit yozuvlari
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.medium1Name} (n₁ = ${this.n1.toFixed(2)})`, 20, 30);
    ctx.fillText(`${this.medium2Name} (n₂ = ${this.n2.toFixed(2)})`, 20, cy + 30);

    // Transportir (Optik disk)
    if (this.showProtractor) {
      const radius = 170;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Gradus bo'laklari
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let deg = 0; deg < 360; deg += 10) {
        const rad = (deg * Math.PI) / 180;
        const tickLen = deg % 30 === 0 ? 10 : 5;
        const x1 = cx + Math.cos(rad) * (radius - tickLen);
        const y1 = cy + Math.sin(rad) * (radius - tickLen);
        const x2 = cx + Math.cos(rad) * radius;
        const y2 = cy + Math.sin(rad) * radius;

        ctx.strokeStyle = deg % 30 === 0 ? 'rgba(148, 163, 184, 0.5)' : 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (deg % 30 === 0) {
          // Burchak yozuvi
          let labelDeg = deg <= 90 ? (90 - deg) : (deg <= 180 ? deg - 90 : (deg <= 270 ? 270 - deg : deg - 270));
          const tx = cx + Math.cos(rad) * (radius - 18);
          const ty = cy + Math.sin(rad) * (radius - 18);
          ctx.fillStyle = '#64748b';
          ctx.fillText(`${labelDeg}°`, tx, ty);
        }
      }
    }

    // Normal (perpendikulyar punktir)
    if (this.showNormal) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, 15);
      ctx.lineTo(cx, h - 15);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText("Normal (N)", cx + 6, 25);
    }

    // Nurlarni chizish
    const rayLen = 190;
    const aRad = (this.alphaDeg * Math.PI) / 180;

    // 1. Tushuvchi nur (Incident ray)
    const inX = cx - Math.sin(aRad) * rayLen;
    const inY = cy - Math.cos(aRad) * rayLen;

    ctx.strokeStyle = this.laserColor;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = this.laserColor;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(inX, inY);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Lazer korpusi
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#334155';
    ctx.save();
    ctx.translate(inX, inY);
    ctx.rotate(Math.PI / 2 - aRad);
    ctx.fillRect(-8, -12, 16, 24);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(-8, -12, 16, 24);
    ctx.restore();

    // 2. Qaytgan nur (Reflected ray)
    const reflX = cx + Math.sin(aRad) * rayLen;
    const reflY = cy - Math.cos(aRad) * rayLen;

    const reflIntensity = res.isTIR ? 1.0 : (0.15 + (this.alphaDeg / 90) * 0.4);
    ctx.strokeStyle = this.laserColor;
    ctx.lineWidth = res.isTIR ? 3.5 : 2;
    ctx.globalAlpha = reflIntensity;
    ctx.shadowColor = this.laserColor;
    ctx.shadowBlur = res.isTIR ? 12 : 4;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(reflX, reflY);
    ctx.stroke();

    // 3. Singan nur (Refracted ray)
    if (!res.isTIR) {
      const bRad = (res.betaDeg * Math.PI) / 180;
      const refrX = cx + Math.sin(bRad) * rayLen;
      const refrY = cy + Math.cos(bRad) * rayLen;

      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.85;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(refrX, refrY);
      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    // Markaziy nurning urilish chaqnashi
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  getMeasurements() {
    PhysicsMath.playSound('ping');
    const res = PhysicsMath.snellRefraction(this.n1, this.n2, this.alphaDeg);
    return {
      m1: `${this.medium1Name} (${this.n1.toFixed(2)})`,
      m2: `${this.medium2Name} (${this.n2.toFixed(2)})`,
      alpha: `${this.alphaDeg.toFixed(1)}°`,
      betaExp: res.isTIR ? "To'la qaytish" : `${res.betaDeg.toFixed(1)}°`,
      betaTheo: res.isTIR ? "Yo'q (TIR)" : `${res.betaDeg.toFixed(1)}°`,
      tir: res.isTIR ? "HA" : "Yo'q"
    };
  }

  destroy() {}
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RefractionSimulation;
}
