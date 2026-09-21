/**
 * Virtual Fizika Laboratoriyasi - 3.1 Ideal gaz izojarayonlari va turli gazlar kinetikasi
 * Heliy (He), Azot (N₂), Kislorod (O₂), Karbonat angidrid (CO₂), Vodorod (H₂)
 */

class GasLawsSimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.processMode = 'isothermal'; // 'isothermal', 'isobaric', 'isochoric'

    // Gazlar ma'lumotlar bazasi
    this.gases = {
      He: {
        name: "Heliy (He)",
        formula: "He",
        molarMassG: 4.0, // g/mol
        molarMassKg: 0.004, // kg/mol
        typeStr: "Bir atomli inert gaz",
        atoms: 1,
        color: "#facc15", // Oltin-sariq
        radius: 3.5,
        desc: "Juda yengil va tezkor atomlar"
      },
      N2: {
        name: "Azot (N₂)",
        formula: "N₂",
        molarMassG: 28.0,
        molarMassKg: 0.028,
        typeStr: "Ikki atomli gaz (havo 78%)",
        atoms: 2,
        color: "#38bdf8", // Zangori
        radius: 4.5,
        desc: "Havoning asosiy komponenti"
      },
      O2: {
        name: "Kislorod (O₂)",
        formula: "O₂",
        molarMassG: 32.0,
        molarMassKg: 0.032,
        typeStr: "Ikki atomli gaz (havo 21%)",
        atoms: 2,
        color: "#f87171", // Qizil
        radius: 4.8,
        desc: "Oksidlovchi hayotiy gaz"
      },
      CO2: {
        name: "Karbonat angidrid (CO₂)",
        formula: "CO₂",
        molarMassG: 44.0,
        molarMassKg: 0.044,
        typeStr: "Uch atomli og'ir gaz",
        atoms: 3,
        color: "#34d399", // Yashil-kulrang
        radius: 5.2,
        desc: "Og'ir va sekin molekulalar"
      },
      H2: {
        name: "Vodorod (H₂)",
        formula: "H₂",
        molarMassG: 2.0,
        molarMassKg: 0.002,
        typeStr: "Eng yengil ikki atomli gaz",
        atoms: 2,
        color: "#e0e7ff", // Oqish-binafsha
        radius: 3.0,
        desc: "Olamdagi eng yengil va eng tez gaz"
      }
    };

    this.selectedGasKey = "He"; // Boshlang'ich gaz - Heliy

    // Holat parametrlari
    this.P = 101.3; // kPa
    this.V = 10.0;  // Litr (porshen holati)
    this.T = 300;   // Kelvin
    this.n = 0.406; // mol

    // Zarrachalar (molekulalar)
    this.molecules = [];
    this.numMolecules = 55;
    this.animId = null;
    this.isRunning = true;
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-canvas-area relative">
          <canvas id="gas-canvas" class="w-full h-[390px] rounded-xl bg-slate-900 border border-slate-800 shadow-inner"></canvas>
          
          <div class="absolute top-4 left-4 flex flex-wrap gap-2">
            <span class="px-2.5 py-1 bg-slate-800/90 backdrop-blur rounded text-xs text-amber-300 font-mono border border-slate-700 font-semibold" id="gas-badge-name">
              Gaz: Heliy (He) [M = 4 g/mol]
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-rose-400 font-mono border border-slate-700">
              Bosim P: <span id="gas-p-val">101.3</span> kPa
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-cyan-400 font-mono border border-slate-700">
              Hajm V: <span id="gas-v-val">10.0</span> L
            </span>
            <span class="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded text-xs text-amber-400 font-mono border border-slate-700">
              Harorat T: <span id="gas-t-val">300</span> K (<span id="gas-c-val">27°C</span>)
            </span>
          </div>

          <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 w-72">
            <div class="flex justify-between"><span class="text-slate-400">Jarayon:</span> <span id="gas-proc-title" class="text-cyan-300 font-bold">Boyl-Mariott (T=const)</span></div>
            <div class="flex justify-between"><span class="text-slate-400">O'rtacha tezlik v_kv:</span> <span id="gas-speed-val" class="text-emerald-400 font-bold">1367 m/s</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Gaz zichligi ρ:</span> <span id="gas-density-val" class="text-indigo-300 font-bold">0.16 g/L</span></div>
            <div class="flex justify-between"><span class="text-slate-400">P·V ko'paytma:</span> <span id="gas-pv-val" class="text-slate-300">1013.0 kPa·L</span></div>
            <div class="flex justify-between"><span class="text-slate-400">PV / T nisbat:</span> <span id="gas-pvt-val" class="text-blue-300">3.377 J/K</span></div>
          </div>
        </div>

        <!-- Boshqaruv paneli -->
        <div class="sim-controls grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          
          <!-- Gaz turini tanlash -->
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <span>🧪 Gaz turi</span>
            </label>
            <select id="select-gas-type" class="w-full px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-medium">
              <option value="He" selected>Heliy (He) - 4 g/mol</option>
              <option value="N2">Azot (N₂) - 28 g/mol</option>
              <option value="O2">Kislorod (O₂) - 32 g/mol</option>
              <option value="CO2">Karbonat angidrid (CO₂) - 44 g/mol</option>
              <option value="H2">Vodorod (H₂) - 2 g/mol</option>
            </select>
            <div id="gas-desc-info" class="text-[10px] text-slate-400 pt-0.5 leading-tight">Bir atomli inert gaz</div>
          </div>

          <!-- Izojarayon tanlash -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-300">Izojarayon turi</label>
            <div class="flex flex-col gap-1">
              <button id="btn-proc-iso-t" class="px-2 py-1 rounded text-xs font-medium text-left transition ${this.processMode === 'isothermal' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}">1. Izotermik (T = const)</button>
              <button id="btn-proc-iso-p" class="px-2 py-1 rounded text-xs font-medium text-left transition ${this.processMode === 'isobaric' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}">2. Izobarik (P = const)</button>
              <button id="btn-proc-iso-v" class="px-2 py-1 rounded text-xs font-medium text-left transition ${this.processMode === 'isochoric' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}">3. Izoxorik (V = const)</button>
            </div>
          </div>

          <!-- Hajm V boshqaruvi -->
          <div class="space-y-1" id="ctrl-v-wrap">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Hajm V (Porshen):</span>
              <span id="slider-gas-v-val" class="text-cyan-400 font-mono">10.0 L</span>
            </div>
            <input type="range" id="slider-gas-v" min="4" max="20" step="0.5" value="10" class="w-full h-1.5 bg-slate-700 rounded-lg accent-cyan-500 cursor-pointer">
            <div class="text-[10px] text-slate-500">Silindr hajmini o'zgartirish</div>
          </div>

          <!-- Harorat T boshqaruvi -->
          <div class="space-y-1" id="ctrl-t-wrap">
            <div class="flex justify-between text-xs text-slate-300">
              <span>Harorat T:</span>
              <span id="slider-gas-t-val" class="text-amber-400 font-mono">300 K</span>
            </div>
            <input type="range" id="slider-gas-t" min="150" max="600" step="10" value="300" class="w-full h-1.5 bg-slate-700 rounded-lg accent-amber-500 cursor-pointer">
            <div class="text-[10px] text-slate-500">Mutlaq harorat (Kelvin)</div>
          </div>

          <!-- Qizdirish va Muzlatish -->
          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-300">Isitgich / Muzlagich</label>
            <div class="flex flex-col gap-1.5">
              <button id="btn-heat-add" class="py-1 px-2 bg-rose-600/30 hover:bg-rose-600 border border-rose-500 text-rose-300 hover:text-white rounded text-xs font-medium transition flex items-center justify-center gap-1">
                🔥 Isitish (+25 K)
              </button>
              <button id="btn-heat-cool" class="py-1 px-2 bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500 text-cyan-300 hover:text-white rounded text-xs font-medium transition flex items-center justify-center gap-1">
                ❄️ Sovutish (-25 K)
              </button>
            </div>
          </div>
        </div>

        <!-- Qo'shimcha boshqaruv va grafik -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div class="text-xs text-slate-400">
            <span>💡 Eslatma: Heliy molekulalari (M=4) Kislorodga (M=32) qaraganda deyarli <strong>3 marta tezroq</strong> harakatlanadi!</span>
          </div>

          <button id="btn-gas-record" class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/30">
            <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg> O'lchovni qayd qilish
          </button>
        </div>

        <!-- P-V diagrammasi -->
        <div class="mt-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="text-xs font-semibold text-slate-300 mb-2">Holat diagrammasi (P - V grafigi)</div>
          <canvas id="gas-graph" class="w-full h-[180px] rounded-lg"></canvas>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('gas-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.graphCanvas = document.getElementById('gas-graph');

    this.graph = new PhysicsGraph(this.graphCanvas, {
      title: "P - V Holat Diagrammasi",
      xLabel: "Hajm V",
      yLabel: "Bosim P",
      xUnit: "L",
      yUnit: "kPa",
      minX: 0,
      maxX: 22,
      minY: 0,
      maxY: 300
    });
    this.graph.addSeries("Holat nuqtasi", "#38bdf8");

    this.initMolecules();
    this.bindEvents();
    this.updateCalculations();
    this.startSimulation();
  }

  initMolecules() {
    this.molecules = [];
    for (let i = 0; i < this.numMolecules; i++) {
      this.molecules.push({
        x: Math.random() * 0.85 + 0.05,
        y: Math.random() * 0.85 + 0.05,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 4
      });
    }
  }

  bindEvents() {
    const selGas = document.getElementById('select-gas-type');
    const btnIsoT = document.getElementById('btn-proc-iso-t');
    const btnIsoP = document.getElementById('btn-proc-iso-p');
    const btnIsoV = document.getElementById('btn-proc-iso-v');

    const sliderV = document.getElementById('slider-gas-v');
    const sliderT = document.getElementById('slider-gas-t');
    const btnHeat = document.getElementById('btn-heat-add');
    const btnCool = document.getElementById('btn-heat-cool');

    // Gaz turini almashtirish
    selGas.addEventListener('change', (e) => {
      this.selectedGasKey = e.target.value;
      const gas = this.gases[this.selectedGasKey];
      document.getElementById('gas-desc-info').innerText = `${gas.typeStr} (${gas.desc})`;
      document.getElementById('gas-badge-name').innerText = `Gaz: ${gas.name} [M = ${gas.molarMassG} g/mol]`;
      PhysicsMath.playSound('click');
      this.updateCalculations();
    });

    const setMode = (mode) => {
      this.processMode = mode;
      btnIsoT.className = `px-2 py-1 rounded text-xs font-medium text-left transition ${mode === 'isothermal' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`;
      btnIsoP.className = `px-2 py-1 rounded text-xs font-medium text-left transition ${mode === 'isobaric' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`;
      btnIsoV.className = `px-2 py-1 rounded text-xs font-medium text-left transition ${mode === 'isochoric' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`;

      if (mode === 'isothermal') {
        document.getElementById('gas-proc-title').innerText = "Boyl-Mariott (T=const)";
        sliderV.disabled = false;
        sliderT.disabled = true;
      } else if (mode === 'isobaric') {
        document.getElementById('gas-proc-title').innerText = "Gey-Lyussak (P=const)";
        sliderV.disabled = true;
        sliderT.disabled = false;
      } else {
        document.getElementById('gas-proc-title').innerText = "Sharl qonuni (V=const)";
        sliderV.disabled = true;
        sliderT.disabled = false;
      }

      this.updateCalculations();
    };

    btnIsoT.addEventListener('click', () => setMode('isothermal'));
    btnIsoP.addEventListener('click', () => setMode('isobaric'));
    btnIsoV.addEventListener('click', () => setMode('isochoric'));

    sliderV.addEventListener('input', (e) => {
      this.V = parseFloat(e.target.value);
      document.getElementById('slider-gas-v-val').innerText = `${this.V.toFixed(1)} L`;
      this.updateCalculations();
    });

    sliderT.addEventListener('input', (e) => {
      this.T = parseFloat(e.target.value);
      document.getElementById('slider-gas-t-val').innerText = `${this.T} K`;
      this.updateCalculations();
    });

    btnHeat.addEventListener('click', () => {
      if (this.processMode !== 'isothermal') {
        this.T = Math.min(600, this.T + 25);
        sliderT.value = this.T;
        document.getElementById('slider-gas-t-val').innerText = `${this.T} K`;
        this.updateCalculations();
      }
    });

    btnCool.addEventListener('click', () => {
      if (this.processMode !== 'isothermal') {
        this.T = Math.max(150, this.T - 25);
        sliderT.value = this.T;
        document.getElementById('slider-gas-t-val').innerText = `${this.T} K`;
        this.updateCalculations();
      }
    });
  }

  updateCalculations() {
    const gas = this.gases[this.selectedGasKey];

    // Jarayonga mos parametrlarni yangilash
    if (this.processMode === 'isothermal') {
      this.P = (this.n * 8.314 * this.T) / this.V * 10; // Masshtablangan kPa
    } else if (this.processMode === 'isobaric') {
      this.P = 101.3;
      this.V = (this.n * 8.314 * this.T) / (this.P / 10);
      document.getElementById('slider-gas-v').value = this.V;
      document.getElementById('slider-gas-v-val').innerText = `${this.V.toFixed(1)} L`;
    } else if (this.processMode === 'isochoric') {
      this.P = (this.n * 8.314 * this.T) / this.V * 10;
    }

    // O'rtacha kvadratik tezlik: v_kv = sqrt(3 R T / M_kg)
    const vSpeed = Math.sqrt((3 * 8.314 * this.T) / gas.molarMassKg);

    // Zichlik: rho = P * M / (R * T) [g/L yoki kg/m³]
    // P (kPa) * M (g/mol) / (8.314 * T)
    const density = (this.P * gas.molarMassG) / (8.314 * this.T);

    document.getElementById('gas-p-val').innerText = this.P.toFixed(1);
    document.getElementById('gas-v-val').innerText = this.V.toFixed(1);
    document.getElementById('gas-t-val').innerText = Math.round(this.T);
    document.getElementById('gas-c-val').innerText = `${Math.round(this.T - 273.15)}°C`;
    document.getElementById('gas-speed-val').innerText = `${Math.round(vSpeed)} m/s`;
    document.getElementById('gas-density-val').innerText = `${density.toFixed(2)} g/L`;

    const pv = this.P * this.V;
    const pvt = pv / this.T;
    document.getElementById('gas-pv-val').innerText = `${pv.toFixed(1)} kPa·L`;
    document.getElementById('gas-pvt-val').innerText = `${pvt.toFixed(3)} J/K`;

    // Grafik nuqtasini qo'shish
    this.graph.addDataPoint(0, this.V, this.P, 80);
  }

  startSimulation() {
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const gas = this.gases[this.selectedGasKey];

      // Molyar massaga teskari va haroratga to'g'ri proportsional tezlik:
      // sqrt(T / 300) * sqrt(28 / M)
      const speedMultiplier = Math.sqrt(this.T / 300) * Math.sqrt(28.0 / gas.molarMassG);

      this.molecules.forEach(m => {
        m.x += m.vx * speedMultiplier * dt * 0.7;
        m.y += m.vy * speedMultiplier * dt * 0.7;
        m.angle += m.angularSpeed * speedMultiplier * dt;

        // Chegaralardan qaytish
        if (m.x < 0.03) { m.x = 0.03; m.vx *= -1; }
        if (m.x > 0.97) { m.x = 0.97; m.vx *= -1; }
        if (m.y < 0.03) { m.y = 0.03; m.vy *= -1; }
        if (m.y > 0.97) { m.y = 0.97; m.vy *= -1; }
      });

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

    const gas = this.gases[this.selectedGasKey];

    // Silindr o'lchamlari
    const cylX = 60;
    const cylY = 55;
    const cylMaxW = w - 240;
    const cylH = h - 125;

    // Porshen gorizontal siljishi hajm V ga bog'liq (4L -> 20L)
    const vFrac = (this.V - 4) / 16;
    const pistonX = cylX + 80 + vFrac * (cylMaxW - 100);

    // Silindr foni
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(cylX, cylY, pistonX - cylX, cylH);

    // Silindr devorlari
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(pistonX + 50, cylY);
    ctx.lineTo(cylX, cylY);
    ctx.lineTo(cylX, cylY + cylH);
    ctx.lineTo(pistonX + 50, cylY + cylH);
    ctx.stroke();

    // Molekulalarni chizish
    const gasW = pistonX - cylX - 16;
    const gasH = cylH - 16;

    this.molecules.forEach(m => {
      const mx = cylX + 8 + m.x * gasW;
      const my = cylY + 8 + m.y * gasH;

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(m.angle);

      ctx.fillStyle = gas.color;
      ctx.strokeStyle = '#ffffff';

      if (gas.atoms === 1) {
        // Bir atomli gaz (Heliy): bitta shar
        ctx.beginPath();
        ctx.arc(0, 0, gas.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (gas.atoms === 2) {
        // Ikki atomli gaz (Azot N2, Kislorod O2, Vodorod H2): gantel
        const dist = gas.radius * 0.9;
        ctx.beginPath();
        ctx.arc(-dist, 0, gas.radius * 0.75, 0, Math.PI * 2);
        ctx.arc(dist, 0, gas.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();

        // Bog'lovchi chiziqcha
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-dist, 0);
        ctx.lineTo(dist, 0);
        ctx.stroke();
      } else if (gas.atoms === 3) {
        // Uch atomli gaz (CO2): markazda Uglerod C, chekkada 2 ta Kislorod O
        const dist = gas.radius * 1.1;
        // Markaziy C atomi
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(0, 0, gas.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Ikkita O atomi
        ctx.fillStyle = gas.color;
        ctx.beginPath();
        ctx.arc(-dist, 0, gas.radius * 0.65, 0, Math.PI * 2);
        ctx.arc(dist, 0, gas.radius * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Porshen (Piston)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(pistonX - 12, cylY + 2, 20, cylH - 4);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(pistonX - 12, cylY + 2, 20, cylH - 4);

    // Porshen dastagi (Shtok)
    ctx.fillStyle = '#475569';
    ctx.fillRect(pistonX + 8, cylY + cylH / 2 - 10, w - pistonX - 40, 20);

    // Manometr (Bosim o'lchagich - tepada silindrga ulangan)
    const manoX = cylX + 60;
    const manoY = cylY - 20;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(manoX, cylY);
    ctx.lineTo(manoX, manoY);
    ctx.stroke();

    // Manometr diski
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(manoX, manoY - 20, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Manometr mili (burchagi P ga bog'liq)
    const pFrac = Math.min(1.0, this.P / 250);
    const pAngle = -Math.PI * 0.75 + pFrac * Math.PI * 1.5;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(manoX, manoY - 20);
    ctx.lineTo(manoX + Math.cos(pAngle) * 16, manoY - 20 + Math.sin(pAngle) * 16);
    ctx.stroke();

    // Isitgich alangasi / sovutgich muzi (pastda)
    if (this.T > 320) {
      // Olov animatsiyasi
      ctx.fillStyle = '#f97316';
      for (let fx = cylX + 20; fx < pistonX - 20; fx += 25) {
        ctx.beginPath();
        ctx.moveTo(fx, cylY + cylH + 18);
        ctx.lineTo(fx + 10, cylY + cylH + 4);
        ctx.lineTo(fx + 20, cylY + cylH + 18);
        ctx.fill();
      }
    } else if (this.T < 270) {
      // Muz belgilari
      ctx.fillStyle = '#38bdf8';
      for (let fx = cylX + 20; fx < pistonX - 20; fx += 30) {
        ctx.fillRect(fx, cylY + cylH + 6, 16, 8);
      }
    }
  }

  getMeasurements() {
    PhysicsMath.playSound('ping');
    const gas = this.gases[this.selectedGasKey];
    const procNames = {
      isothermal: "Izotermik (T=const)",
      isobaric: "Izobarik (P=const)",
      isochoric: "Izoxorik (V=const)"
    };

    const vSpeed = Math.sqrt((3 * 8.314 * this.T) / gas.molarMassKg);

    return {
      gas: gas.name,
      molarMass: `${gas.molarMassG}`,
      process: procNames[this.processMode],
      P: `${this.P.toFixed(1)} kPa`,
      V: `${this.V.toFixed(1)} L`,
      T: `${Math.round(this.T)} K`,
      vSpeed: `${Math.round(vSpeed)} m/s`,
      constVal: `${(this.P * this.V / this.T).toFixed(3)}`
    };
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GasLawsSimulation;
}
