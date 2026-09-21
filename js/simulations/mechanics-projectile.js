/**
 * Virtual Fizika Laboratoriyasi - 1.2 Gorizontga burchak ostida otilgan jism (Ballistika)
 */

class ProjectileSimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isRunning = false;
    this.animId = null;

    // Parametrlar
    this.v0 = 25; // m/s
    this.angleDeg = 45; // gradus
    this.h0 = 2; // m
    this.gravity = 9.81; // m/s²
    this.useAirDrag = false;
    this.dragCoeff = 0.05;

    // Nishon
    this.targetX = 55; // metr masofa
    this.targetRadius = 3.5;
    this.isTargetHit = false;

    // Harakat holati
    this.t = 0;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.trajectory = [];
    this.maxHeightRecorded = 0;
    this.totalDistanceRecorded = 0;
    this.flightTimeRecorded = 0;
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-canvas-area relative">
          <canvas id="projectile-canvas" class="w-full h-[400px] rounded-xl bg-slate-900 border border-slate-800 shadow-inner"></canvas>
          
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-amber-400 font-mono border border-slate-700">
              Vaqt t: <span id="proj-time">0.00</span> s
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-cyan-400 font-mono border border-slate-700">
              x: <span id="proj-pos-x">0.0</span> m | y: <span id="proj-pos-y">0.0</span> m
            </span>
            <span id="proj-hit-badge" class="hidden px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-xs font-semibold animate-bounce">
              🎯 Nishon urildi!
            </span>
          </div>

          <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 w-56">
            <div class="flex justify-between"><span class="text-slate-400">H_max:</span> <span id="proj-hmax" class="text-cyan-300 font-bold">0.00 m</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Masofa L:</span> <span id="proj-range" class="text-emerald-400 font-bold">0.00 m</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Uchish vaqti:</span> <span id="proj-ftime" class="text-blue-400">0.00 s</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Nishon masofasi:</span> <span id="proj-target-dist" class="text-amber-400">55.0 m</span></div>
          </div>
        </div>

        <!-- Boshqaruv elementlari -->
        <div class="sim-controls grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Boshlang'ich tezlik v₀:</span>
              <span id="val-proj-v0" class="text-blue-400 font-mono">25 m/s</span>
            </div>
            <input type="range" id="slider-proj-v0" min="5" max="50" step="1" value="25" class="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Otilish burchagi α:</span>
              <span id="val-proj-angle" class="text-amber-400 font-mono">45°</span>
            </div>
            <input type="range" id="slider-proj-angle" min="5" max="85" step="1" value="45" class="w-full h-1.5 bg-slate-700 rounded-lg accent-amber-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Boshlang'ich balandlik h₀:</span>
              <span id="val-proj-h0" class="text-cyan-400 font-mono">2 m</span>
            </div>
            <input type="range" id="slider-proj-h0" min="0" max="25" step="1" value="2" class="w-full h-1.5 bg-slate-700 rounded-lg accent-cyan-500 cursor-pointer">
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-300">Havo qarshiligi</label>
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="check-air-drag" class="sr-only peer">
                <div class="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-2 text-xs text-slate-300" id="label-air-drag">O'chirilgan</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Tugmalar -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div class="flex gap-2">
            <button id="btn-proj-fire" class="flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-rose-900/30">
              💥 O't ochish (Otish)
            </button>
            <button id="btn-proj-clear" class="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition">
              Tozalash
            </button>
            <button id="btn-proj-random-target" class="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium transition">
              🎯 Yangi nishon
            </button>
          </div>

          <button id="btn-proj-record" class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/30">
            <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg> O'lchovni qayd qilish
          </button>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('projectile-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const sliderV0 = document.getElementById('slider-proj-v0');
    const sliderAngle = document.getElementById('slider-proj-angle');
    const sliderH0 = document.getElementById('slider-proj-h0');
    const checkDrag = document.getElementById('check-air-drag');
    const labelDrag = document.getElementById('label-air-drag');

    const btnFire = document.getElementById('btn-proj-fire');
    const btnClear = document.getElementById('btn-proj-clear');
    const btnRandomTarget = document.getElementById('btn-proj-random-target');

    sliderV0.addEventListener('input', (e) => {
      this.v0 = parseFloat(e.target.value);
      document.getElementById('val-proj-v0').innerText = `${this.v0} m/s`;
      this.render();
    });

    sliderAngle.addEventListener('input', (e) => {
      this.angleDeg = parseFloat(e.target.value);
      document.getElementById('val-proj-angle').innerText = `${this.angleDeg}°`;
      this.render();
    });

    sliderH0.addEventListener('input', (e) => {
      this.h0 = parseFloat(e.target.value);
      document.getElementById('val-proj-h0').innerText = `${this.h0} m`;
      this.render();
    });

    checkDrag.addEventListener('change', (e) => {
      this.useAirDrag = e.target.checked;
      labelDrag.innerText = this.useAirDrag ? "Yoqilgan (Havoning qarshiligi bor)" : "O'chirilgan";
    });

    btnFire.addEventListener('click', () => this.fire());
    btnClear.addEventListener('click', () => this.clear());
    btnRandomTarget.addEventListener('click', () => {
      this.targetX = Math.round(30 + Math.random() * 55);
      document.getElementById('proj-target-dist').innerText = `${this.targetX.toFixed(1)} m`;
      this.render();
    });
  }

  fire() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.trajectory = [];
    this.isTargetHit = false;
    document.getElementById('proj-hit-badge').classList.add('hidden');

    PhysicsMath.playSound('cannon');

    const rad = (this.angleDeg * Math.PI) / 180;
    this.x = 0;
    this.y = this.h0;
    this.vx = this.v0 * Math.cos(rad);
    this.vy = this.v0 * Math.sin(rad);
    this.t = 0;
    this.maxHeightRecorded = this.h0;

    let lastTime = performance.now();

    const loop = (now) => {
      if (!this.isRunning) return;
      const realDt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Simulyatsiya tezligi (1.5x)
      const simDt = realDt * 1.5;

      const subSteps = 6;
      const dt = simDt / subSteps;

      for (let s = 0; s < subSteps; s++) {
        if (this.useAirDrag) {
          const v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          const ax = -this.dragCoeff * v * this.vx;
          const ay = -this.gravity - this.dragCoeff * v * this.vy;
          this.vx += ax * dt;
          this.vy += ay * dt;
        } else {
          this.vy -= this.gravity * dt;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.t += dt;

        if (this.y > this.maxHeightRecorded) {
          this.maxHeightRecorded = this.y;
        }

        this.trajectory.push({ x: this.x, y: this.y });

        // Yerga tushish tekshiruvi
        if (this.y <= 0) {
          this.y = 0;
          this.isRunning = false;
          break;
        }
      }

      // Nishonga urilganini tekshirish
      if (Math.abs(this.x - this.targetX) < this.targetRadius && this.y <= 2.0) {
        this.isTargetHit = true;
        document.getElementById('proj-hit-badge').classList.remove('hidden');
        PhysicsMath.playSound('ping');
      }

      this.totalDistanceRecorded = this.x;
      this.flightTimeRecorded = this.t;

      // UI yangilash
      document.getElementById('proj-time').innerText = this.t.toFixed(2);
      document.getElementById('proj-pos-x').innerText = this.x.toFixed(1);
      document.getElementById('proj-pos-y').innerText = this.y.toFixed(1);
      document.getElementById('proj-hmax').innerText = `${this.maxHeightRecorded.toFixed(2)} m`;
      document.getElementById('proj-range').innerText = `${this.totalDistanceRecorded.toFixed(2)} m`;
      document.getElementById('proj-ftime').innerText = `${this.flightTimeRecorded.toFixed(2)} s`;

      this.render();

      if (this.isRunning) {
        this.animId = requestAnimationFrame(loop);
      }
    };

    this.animId = requestAnimationFrame(loop);
  }

  clear() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    this.trajectory = [];
    this.t = 0;
    this.x = 0;
    this.y = this.h0;
    this.maxHeightRecorded = 0;
    this.totalDistanceRecorded = 0;
    this.flightTimeRecorded = 0;
    document.getElementById('proj-time').innerText = "0.00";
    document.getElementById('proj-pos-x').innerText = "0.0";
    document.getElementById('proj-pos-y').innerText = "0.0";
    document.getElementById('proj-hmax').innerText = "0.00 m";
    document.getElementById('proj-range').innerText = "0.00 m";
    document.getElementById('proj-ftime').innerText = "0.00 s";
    document.getElementById('proj-hit-badge').classList.add('hidden');
    this.render();
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width = this.canvas.offsetWidth;
    const h = this.canvas.height = this.canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    // Masshtab: maksimal 100 metr gorizontal
    const scale = (w - 120) / 100;
    const originX = 60;
    const groundY = h - 60;

    // Osmon va fon gradienti
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, '#090d16');
    skyGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, groundY);

    // Yer sathi
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Masofa shkalasi (belgilar)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let m = 0; m <= 100; m += 10) {
      const markX = originX + m * scale;
      ctx.beginPath();
      ctx.moveTo(markX, groundY);
      ctx.lineTo(markX, groundY + 6);
      ctx.strokeStyle = '#475569';
      ctx.stroke();
      ctx.fillText(`${m}m`, markX, groundY + 18);
    }

    // Balandlik shkalasi (vertikal)
    ctx.textAlign = 'right';
    for (let hm = 0; hm <= 30; hm += 5) {
      const markY = groundY - hm * scale;
      if (markY < 10) continue;
      ctx.beginPath();
      ctx.moveTo(originX - 6, markY);
      ctx.lineTo(originX, markY);
      ctx.strokeStyle = '#475569';
      ctx.stroke();
      ctx.fillText(`${hm}m`, originX - 10, markY + 3);
    }

    // Nishon (Target)
    const targetPxX = originX + this.targetX * scale;
    const targetPxR = this.targetRadius * scale;

    ctx.fillStyle = this.isTargetHit ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.ellipse(targetPxX, groundY, targetPxR, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nishon bayrog'i
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(targetPxX, groundY);
    ctx.lineTo(targetPxX, groundY - 35);
    ctx.stroke();

    ctx.fillStyle = this.isTargetHit ? '#34d399' : '#f87171';
    ctx.beginPath();
    ctx.moveTo(targetPxX, groundY - 35);
    ctx.lineTo(targetPxX + 16, groundY - 26);
    ctx.lineTo(targetPxX, groundY - 17);
    ctx.closePath();
    ctx.fill();

    // Traektoriya chizig'i
    if (this.trajectory.length > 1) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      this.trajectory.forEach((p, idx) => {
        const px = originX + p.x * scale;
        const py = groundY - p.y * scale;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // To'p (Cannon) tagligi va stvoli
    const cannonY = groundY - this.h0 * scale;
    if (this.h0 > 0) {
      // Minora
      ctx.fillStyle = '#334155';
      ctx.fillRect(originX - 15, cannonY, 30, this.h0 * scale);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(originX - 15, cannonY, 30, this.h0 * scale);
    }

    // To'p stvoli burchagi
    const rad = (this.angleDeg * Math.PI) / 180;
    const barrelLen = 32;
    const barrelEndX = originX + Math.cos(rad) * barrelLen;
    const barrelEndY = cannonY - Math.sin(rad) * barrelLen;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(originX, cannonY);
    ctx.lineTo(barrelEndX, barrelEndY);
    ctx.stroke();

    // To'p tayanchi
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(originX, cannonY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Snaryad jism
    const curBallX = originX + this.x * scale;
    const curBallY = groundY - this.y * scale;

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(curBallX, curBallY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tezlik vektori
    if (this.isRunning) {
      const vScale = 1.5;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(curBallX, curBallY);
      ctx.lineTo(curBallX + this.vx * vScale, curBallY - this.vy * vScale);
      ctx.stroke();
    }
  }

  getMeasurements() {
    PhysicsMath.playSound('ping');
    return {
      v0: `${this.v0} m/s`,
      angle: `${this.angleDeg}°`,
      h0: `${this.h0} m`,
      drag: this.useAirDrag ? "Ha" : "Yo'q",
      hMax: `${this.maxHeightRecorded.toFixed(2)} m`,
      range: `${this.totalDistanceRecorded.toFixed(2)} m`,
      time: `${this.flightTimeRecorded.toFixed(2)} s`
    };
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectileSimulation;
}
