/**
 * Virtual Fizika Laboratoriyasi - 1.1 Matematik va Prujinali Mayatnik Simulyatsiyasi
 */

class PendulumSimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mode = 'pendulum'; // 'pendulum' yoki 'spring'
    this.isRunning = false;
    this.animId = null;

    // Parametrlar
    this.length = 1.0; // metr
    this.mass = 0.5;   // kg
    this.stiffness = 25; // N/m (prujina)
    this.gravity = 9.81; // m/s²
    this.damping = 0.002; // so'nish

    // Holat (Matematik mayatnik: burchak theta va burchak tezlik omega)
    this.theta = 0.35; // rad (taxminan 20 gradus)
    this.omega = 0.0;
    this.alpha = 0.0;

    // Holat (Prujina: siljish y va tezlik vy)
    this.springY = 0.15; // metr cho'zilish
    this.springVy = 0.0;

    // O'lchovlar va hisoblagich
    this.time = 0;
    this.oscillations = 0;
    this.lastZeroCross = 0;
    this.measuredPeriod = 0;
    this.history = []; // grafik uchun

    // Drag holati
    this.isDragging = false;
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-canvas-area relative">
          <canvas id="pendulum-canvas" class="w-full h-[400px] rounded-xl bg-slate-900 border border-slate-800 shadow-inner"></canvas>
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-blue-400 font-mono border border-slate-700">
              Vaqt t: <span id="pend-timer">0.00</span> s
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-emerald-400 font-mono border border-slate-700">
              Tebranishlar N: <span id="pend-osc-count">0</span>
            </span>
          </div>
          <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 w-52">
            <div class="flex justify-between"><span class="text-slate-400">Nazariy davr T_naz:</span> <span id="pend-t-theo" class="text-cyan-300 font-bold">2.01 s</span></div>
            <div class="flex justify-between"><span class="text-slate-400">O'lchangan davr T_taj:</span> <span id="pend-t-exp" class="text-emerald-400 font-bold">---</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Tezlik v:</span> <span id="pend-vel" class="text-amber-400">0.00 m/s</span></div>
            <div class="flex justify-between"><span class="text-slate-400">To'la energiya E:</span> <span id="pend-energy" class="text-indigo-400">0.00 J</span></div>
          </div>
        </div>

        <!-- Boshqaruv paneli -->
        <div class="sim-controls grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Mayatnik turi</span>
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button id="btn-mode-pendulum" class="px-3 py-1.5 rounded-lg text-xs font-medium transition ${this.mode === 'pendulum' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}">Matematik</button>
              <button id="btn-mode-spring" class="px-3 py-1.5 rounded-lg text-xs font-medium transition ${this.mode === 'spring' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}">Prujinali</button>
            </div>
          </div>

          <div class="space-y-1" id="ctrl-length-wrap">
            <div class="flex justify-between text-xs text-slate-300">
              <span id="label-len-stiff">Ip uzunligi l:</span>
              <span id="val-len-stiff" class="text-blue-400 font-mono">1.00 m</span>
            </div>
            <input type="range" id="slider-len-stiff" min="0.2" max="2.5" step="0.05" value="1.0" class="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Massa m:</span>
              <span id="val-mass" class="text-blue-400 font-mono">0.50 kg</span>
            </div>
            <input type="range" id="slider-mass" min="0.1" max="2.0" step="0.05" value="0.5" class="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer">
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Gravitatsiya (Sayyora)</label>
            <select id="select-gravity" class="w-full px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="9.81">Yer (g = 9.81 m/s²)</option>
              <option value="1.62">Oy (g = 1.62 m/s²)</option>
              <option value="3.71">Mars (g = 3.71 m/s²)</option>
              <option value="24.79">Yupiter (g = 24.79 m/s²)</option>
              <option value="0.0">Vaznsizlik (g = 0)</option>
            </select>
          </div>
        </div>

        <!-- Tugmalar paneli -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div class="flex gap-2">
            <button id="btn-pend-play" class="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-emerald-900/30">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Boshlash
            </button>
            <button id="btn-pend-pause" class="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Pauza
            </button>
            <button id="btn-pend-reset" class="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg> Qayta o'rnatish
            </button>
          </div>

          <div class="flex gap-2">
            <button id="btn-pend-record" class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/30">
              <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg> O'lchovni qayd qilish
            </button>
          </div>
        </div>

        <!-- Real-vaqtli tebranish grafigi -->
        <div class="mt-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Tebranish osiloskopi (Siljish - Vaqt grafigi x(t))</span>
            <span class="text-[11px] text-slate-400">Ko'k: siljish | To'q sariq: kinetik energiya</span>
          </div>
          <canvas id="pendulum-graph" class="w-full h-[180px] rounded-lg"></canvas>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('pendulum-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.graphCanvas = document.getElementById('pendulum-graph');
    this.graph = new PhysicsGraph(this.graphCanvas, {
      title: "x(t) Siljish va Energiya tebranishi",
      xLabel: "Vaqt t",
      yLabel: "Siljish x",
      xUnit: "s",
      yUnit: "m",
      minX: 0,
      maxX: 10,
      minY: -0.5,
      maxY: 0.5
    });
    this.graph.addSeries("Siljish x(t)", "#38bdf8");
    this.graph.addSeries("Kinetik energiya Ek(t)", "#fb923c");

    this.bindEvents();
    this.updateTheoreticalPeriod();
    this.render();
  }

  bindEvents() {
    const btnPlay = document.getElementById('btn-pend-play');
    const btnPause = document.getElementById('btn-pend-pause');
    const btnReset = document.getElementById('btn-pend-reset');
    const btnModePend = document.getElementById('btn-mode-pendulum');
    const btnModeSpring = document.getElementById('btn-mode-spring');

    const sliderLenStiff = document.getElementById('slider-len-stiff');
    const sliderMass = document.getElementById('slider-mass');
    const selectGrav = document.getElementById('select-gravity');

    btnPlay.addEventListener('click', () => this.start());
    btnPause.addEventListener('click', () => this.pause());
    btnReset.addEventListener('click', () => this.reset());

    btnModePend.addEventListener('click', () => {
      this.mode = 'pendulum';
      btnModePend.className = "px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-600 text-white";
      btnModeSpring.className = "px-3 py-1.5 rounded-lg text-xs font-medium transition bg-slate-700 text-slate-300 hover:bg-slate-600";
      document.getElementById('label-len-stiff').innerText = "Ip uzunligi l:";
      sliderLenStiff.min = "0.2";
      sliderLenStiff.max = "2.5";
      sliderLenStiff.step = "0.05";
      sliderLenStiff.value = this.length;
      document.getElementById('val-len-stiff').innerText = `${Number(this.length).toFixed(2)} m`;
      this.reset();
    });

    btnModeSpring.addEventListener('click', () => {
      this.mode = 'spring';
      btnModeSpring.className = "px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-600 text-white";
      btnModePend.className = "px-3 py-1.5 rounded-lg text-xs font-medium transition bg-slate-700 text-slate-300 hover:bg-slate-600";
      document.getElementById('label-len-stiff').innerText = "Prujina bikrligi k:";
      sliderLenStiff.min = "5";
      sliderLenStiff.max = "80";
      sliderLenStiff.step = "1";
      sliderLenStiff.value = this.stiffness;
      document.getElementById('val-len-stiff').innerText = `${this.stiffness} N/m`;
      this.reset();
    });

    sliderLenStiff.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (this.mode === 'pendulum') {
        this.length = val;
        document.getElementById('val-len-stiff').innerText = `${val.toFixed(2)} m`;
      } else {
        this.stiffness = val;
        document.getElementById('val-len-stiff').innerText = `${val} N/m`;
      }
      this.updateTheoreticalPeriod();
      this.render();
    });

    sliderMass.addEventListener('input', (e) => {
      this.mass = parseFloat(e.target.value);
      document.getElementById('val-mass').innerText = `${this.mass.toFixed(2)} kg`;
      this.updateTheoreticalPeriod();
      this.render();
    });

    selectGrav.addEventListener('change', (e) => {
      this.gravity = parseFloat(e.target.value);
      this.updateTheoreticalPeriod();
      this.render();
    });

    // Canvasda sichqoncha bilan mayatnikni ushlab tortish (Drag and drop)
    this.canvas.addEventListener('mousedown', (e) => this.handleDragStart(e));
    window.addEventListener('mousemove', (e) => this.handleDragMove(e));
    window.addEventListener('mouseup', () => this.handleDragEnd());

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => this.handleDragStart(e.touches[0]), { passive: false });
    window.addEventListener('touchmove', (e) => { if (this.isDragging) this.handleDragMove(e.touches[0]); }, { passive: false });
    window.addEventListener('touchend', () => this.handleDragEnd());
  }

  handleDragStart(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Bob pozitsiyasini hisoblash
    const originX = this.canvas.width / 2;
    const originY = 60;
    const pixelsPerMeter = 140;

    let bobX, bobY;
    if (this.mode === 'pendulum') {
      bobX = originX + Math.sin(this.theta) * this.length * pixelsPerMeter;
      bobY = originY + Math.cos(this.theta) * this.length * pixelsPerMeter;
    } else {
      bobX = originX;
      bobY = originY + (1.2 + this.springY) * pixelsPerMeter;
    }

    const dist = Math.hypot(mx - bobX, my - bobY);
    if (dist < 40) {
      this.isDragging = true;
      this.pause();
    }
  }

  handleDragMove(e) {
    if (!this.isDragging) return;
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const originX = this.canvas.width / 2;
    const originY = 60;
    const pixelsPerMeter = 140;

    if (this.mode === 'pendulum') {
      const dx = mx - originX;
      const dy = Math.max(10, my - originY);
      this.theta = Math.atan2(dx, dy);
      // Cheklov: max +- 70 gradus (1.2 rad)
      this.theta = Math.max(-1.2, Math.min(1.2, this.theta));
      this.omega = 0;
    } else {
      const curLen = (my - originY) / pixelsPerMeter;
      this.springY = curLen - 1.2;
      this.springY = Math.max(-0.4, Math.min(0.5, this.springY));
      this.springVy = 0;
    }

    this.render();
  }

  handleDragEnd() {
    if (this.isDragging) {
      this.isDragging = false;
      this.start();
    }
  }

  updateTheoreticalPeriod() {
    let tTheo = 0;
    if (this.mode === 'pendulum') {
      tTheo = PhysicsMath.pendulumPeriod(this.length, this.gravity);
    } else {
      tTheo = PhysicsMath.springPeriod(this.mass, this.stiffness);
    }
    const el = document.getElementById('pend-t-theo');
    if (el) el.innerText = tTheo > 0 ? `${tTheo.toFixed(2)} s` : "∞";
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (now) => {
      if (!this.isRunning) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      this.step(dt);
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
    this.time = 0;
    this.oscillations = 0;
    this.lastZeroCross = 0;
    this.measuredPeriod = 0;

    if (this.mode === 'pendulum') {
      this.theta = 0.35;
      this.omega = 0.0;
    } else {
      this.springY = 0.15;
      this.springVy = 0.0;
    }

    document.getElementById('pend-timer').innerText = "0.00";
    document.getElementById('pend-osc-count').innerText = "0";
    document.getElementById('pend-t-exp').innerText = "---";
    document.getElementById('pend-vel').innerText = "0.00 m/s";
    document.getElementById('pend-energy').innerText = "0.00 J";

    this.graph.clearData();
    this.updateTheoreticalPeriod();
    this.render();
  }

  step(dt) {
    this.time += dt;

    if (this.mode === 'pendulum') {
      // Tenglama: d^2 theta / dt^2 = - (g / l) * sin(theta) - damping * omega
      const prevTheta = this.theta;
      const subSteps = 5;
      const subDt = dt / subSteps;

      for (let i = 0; i < subSteps; i++) {
        const acc = -(this.gravity / this.length) * Math.sin(this.theta) - (this.damping * this.omega);
        this.omega += acc * subDt;
        this.theta += this.omega * subDt;
      }

      // Tebranishlar sonini hisoblash (nol chizig'ini kesib o'tish)
      if (prevTheta * this.theta < 0 && this.omega > 0) {
        this.oscillations++;
        if (this.oscillations >= 2) {
          const dtOsc = this.time - this.lastZeroCross;
          this.measuredPeriod = dtOsc;
          document.getElementById('pend-t-exp').innerText = `${this.measuredPeriod.toFixed(2)} s`;
        }
        this.lastZeroCross = this.time;
        PhysicsMath.playSound('click');
      }

      // Hozirgi chiziqli siljish x, tezlik v va energiya
      const x = this.length * this.theta;
      const v = this.length * this.omega;
      const h = this.length * (1 - Math.cos(this.theta));
      const ep = this.mass * this.gravity * h;
      const ek = 0.5 * this.mass * v * v;
      const eTotal = ep + ek;

      document.getElementById('pend-vel').innerText = `${Math.abs(v).toFixed(2)} m/s`;
      document.getElementById('pend-energy').innerText = `${eTotal.toFixed(3)} J`;

      // Grafik yangilash
      this.graph.addDataPoint(0, this.time, x);
      this.graph.addDataPoint(1, this.time, ek);
    } else {
      // Prujinali mayatnik: d^2 y / dt^2 = - (k / m) * y - damping * vy
      const prevY = this.springY;
      const subSteps = 5;
      const subDt = dt / subSteps;

      for (let i = 0; i < subSteps; i++) {
        const acc = -(this.stiffness / this.mass) * this.springY - (this.damping * 4 * this.springVy);
        this.springVy += acc * subDt;
        this.springY += this.springVy * subDt;
      }

      if (prevY * this.springY < 0 && this.springVy > 0) {
        this.oscillations++;
        if (this.oscillations >= 2) {
          this.measuredPeriod = this.time - this.lastZeroCross;
          document.getElementById('pend-t-exp').innerText = `${this.measuredPeriod.toFixed(2)} s`;
        }
        this.lastZeroCross = this.time;
        PhysicsMath.playSound('click');
      }

      const v = this.springVy;
      const ep = 0.5 * this.stiffness * this.springY * this.springY;
      const ek = 0.5 * this.mass * v * v;
      const eTotal = ep + ek;

      document.getElementById('pend-vel').innerText = `${Math.abs(v).toFixed(2)} m/s`;
      document.getElementById('pend-energy').innerText = `${eTotal.toFixed(3)} J`;

      this.graph.addDataPoint(0, this.time, this.springY);
      this.graph.addDataPoint(1, this.time, ek);
    }

    document.getElementById('pend-timer').innerText = this.time.toFixed(2);
    document.getElementById('pend-osc-count').innerText = this.oscillations;
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width = this.canvas.offsetWidth;
    const h = this.canvas.height = this.canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = 50;
    const pixelsPerMeter = 130;

    // Shtativ ustuni
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(originX - 70, originY);
    ctx.lineTo(originX + 70, originY);
    ctx.stroke();

    // Muvozanat chizig'i (vertikal punktir)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY + 280);
    ctx.stroke();
    ctx.setLineDash([]);

    if (this.mode === 'pendulum') {
      const bobX = originX + Math.sin(this.theta) * this.length * pixelsPerMeter;
      const bobY = originY + Math.cos(this.theta) * this.length * pixelsPerMeter;
      const bobRadius = 14 + this.mass * 8;

      // Burchak yoyi
      if (Math.abs(this.theta) > 0.05) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const startAng = Math.PI / 2;
        const endAng = Math.PI / 2 + this.theta;
        ctx.arc(originX, originY, 40, Math.min(startAng, endAng), Math.max(startAng, endAng));
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Inter, sans-serif';
        const deg = ((this.theta * 180) / Math.PI).toFixed(1);
        ctx.fillText(`θ = ${deg}°`, originX + (this.theta > 0 ? 45 : -70), originY + 35);
      }

      // Ip
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Sharcha (Bob)
      const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
      grad.addColorStop(0, '#60a5fa');
      grad.addColorStop(0.7, '#2563eb');
      grad.addColorStop(1, '#1d4ed8');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fill();

      // Yorug'lik nuri
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tezlik vektori
      if (Math.abs(this.omega) > 0.1) {
        const vLen = this.length * this.omega * 30;
        const vx = -Math.cos(this.theta) * vLen;
        const vy = Math.sin(this.theta) * vLen;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX + vx, bobY + vy);
        ctx.stroke();
      }
    } else {
      // Prujina simulyatsiyasi
      const eqLen = 1.1; // metr
      const curLen = eqLen + this.springY;
      const totalPixels = curLen * pixelsPerMeter;
      const bobY = originY + totalPixels;
      const bobRadius = 14 + this.mass * 8;

      // Prujina chizish (zig-zag)
      const coils = 16;
      const springWidth = 18;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);

      const coilHeight = totalPixels / (coils + 2);
      ctx.lineTo(originX, originY + coilHeight);

      for (let i = 0; i < coils; i++) {
        const cy = originY + coilHeight * (i + 1);
        const cx = originX + (i % 2 === 0 ? springWidth : -springWidth);
        ctx.lineTo(cx, cy);
      }
      ctx.lineTo(originX, bobY);
      ctx.stroke();

      // Prujina jism yukchasi
      const grad = ctx.createRadialGradient(originX - 4, bobY - 4, 2, originX, bobY, bobRadius);
      grad.addColorStop(0, '#f472b6');
      grad.addColorStop(0.7, '#db2777');
      grad.addColorStop(1, '#9d174d');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(originX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tezlik vektori
      if (Math.abs(this.springVy) > 0.05) {
        const vyLen = -this.springVy * 40;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX, bobY);
        ctx.lineTo(originX, bobY + vyLen);
        ctx.stroke();
      }
    }

    // Markaziy tayanch nuqtasi
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(originX, originY, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  getMeasurements() {
    let tTheo = 0;
    if (this.mode === 'pendulum') {
      tTheo = PhysicsMath.pendulumPeriod(this.length, this.gravity);
    } else {
      tTheo = PhysicsMath.springPeriod(this.mass, this.stiffness);
    }

    const tExp = this.measuredPeriod > 0 ? this.measuredPeriod : (this.oscillations > 0 ? (this.time / this.oscillations) : tTheo);
    let relError = 0;
    if (tTheo > 0 && tExp > 0) {
      relError = Math.abs((tExp - tTheo) / tTheo) * 100;
    }

    PhysicsMath.playSound('ping');

    return {
      type: this.mode === 'pendulum' ? 'Matematik' : 'Prujinali',
      param1: this.mode === 'pendulum' ? `${this.length.toFixed(2)} m` : `${this.stiffness} N/m`,
      mass: `${this.mass.toFixed(2)} kg`,
      gravity: `${this.gravity.toFixed(2)}`,
      tExp: `${tExp.toFixed(2)} s`,
      tTheo: `${tTheo.toFixed(2)} s`,
      error: `${relError.toFixed(1)}%`
    };
  }

  destroy() {
    this.pause();
    window.removeEventListener('mousemove', this.handleDragMove);
    window.removeEventListener('mouseup', this.handleDragEnd);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PendulumSimulation;
}
