/**
 * Virtual Fizika Laboratoriyasi - Asosiy Dastur Boshqaruvchisi (App Controller)
 */

class PhysicsLabApp {
  constructor() {
    this.currentView = 'dashboard';
    this.currentSectionId = null;
    this.currentLabId = null;
    this.activeSimulation = null;

    // Laboratoriya daftari (o'lchovlar) xotirasi
    this.measurements = JSON.parse(localStorage.getItem('phys_measurements') || '{}');

    // Test natijalari
    this.quizAnswers = {};
  }

  init() {
    this.bindGlobalEvents();
    this.handleRoute();
  }

  bindGlobalEvents() {
    window.addEventListener('hashchange', () => this.handleRoute());

    // Qidiruv maydoni
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    // Mobil menyu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  handleRoute() {
    const hash = window.location.hash.slice(1);
    if (!hash || hash === 'dashboard') {
      this.showDashboard();
    } else if (hash.startsWith('section/')) {
      const secId = hash.split('/')[1];
      this.showSection(secId);
    } else if (hash.startsWith('lab/')) {
      const labId = hash.split('/')[1];
      this.showLab(labId);
    } else {
      this.showDashboard();
    }
  }

  navigate(hash) {
    window.location.hash = hash;
  }

  destroyActiveSimulation() {
    if (this.activeSimulation && typeof this.activeSimulation.destroy === 'function') {
      this.activeSimulation.destroy();
      this.activeSimulation = null;
    }
  }

  // 1. BOSH SAHIFA (DASHBOARD)
  showDashboard() {
    this.destroyActiveSimulation();
    this.currentView = 'dashboard';
    this.currentSectionId = null;
    this.currentLabId = null;

    const mainContainer = document.getElementById('app-main');
    if (!mainContainer) return;

    let sectionsHtml = PHYSICS_DATA.sections.map(sec => {
      const labCount = sec.labs.length;
      return `
        <div class="section-card cursor-pointer group" onclick="app.navigate('section/${sec.id}')" style="--card-accent: ${sec.accentColor};">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg bg-gradient-to-br ${sec.color}">
              <span class="text-2xl">${this.getSectionEmoji(sec.id)}</span>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              ${labCount} ta laboratoriya
            </span>
          </div>

          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
            ${sec.title}
          </h3>
          <p class="text-sm text-slate-400 mb-4 line-clamp-2">
            ${sec.shortDesc}
          </p>

          <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span class="text-xs text-slate-400">Asosiy qonunlar: <strong>${sec.coreLaws.length} ta</strong></span>
            <span class="text-sm font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              Bo'limga kirish →
            </span>
          </div>
        </div>
      `;
    }).join('');

    mainContainer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Hero banner -->
        <div class="glass-panel p-8 md:p-12 mb-10 relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="max-w-3xl">
            <span class="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
              Interaktiv Ilmiy Platforma
            </span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Virtual Fizika <span class="text-gradient">Laboratoriyasi</span>
            </h1>
            <p class="text-base md:text-lg text-slate-300 mb-6 leading-relaxed">
              Fizika fanining 4 ta fundamental bo'limi bo'yicha interaktiv simulyatsiyalar, qat'iy fizik qonunlar, real vaqtli hisoblashlar va tajriba daftarlari.
            </p>
            <div class="flex flex-wrap gap-3">
              <a href="#section/mechanics" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-900/30 flex items-center gap-2">
                Laboratoriyalarni boshlash →
              </a>
              <a href="#section/thermodynamics" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition">
                Gaz qonunlari & Karno
              </a>
            </div>
          </div>
        </div>

        <!-- 4 ta Bo'limlar to'plami -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white">Fizika Bo'limlari</h2>
            <p class="text-sm text-slate-400">O'zingizga kerakli bo'limni tanlang va laboratoriyalarga o'ting</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          ${sectionsHtml}
        </div>

        <!-- Xususiyatlar / Qulayliklar -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-panel p-6">
            <div class="text-blue-400 text-2xl mb-3">📐</div>
            <h3 class="text-lg font-bold text-white mb-2">Qat'iy Fizik Qonunlar</h3>
            <p class="text-sm text-slate-400">Har bir laboratoriya Nyuton, Snellius, Mendeleyev-Klapeyron, Karno va Eynshteyn formulalari asosida aniq hisoblanadi.</p>
          </div>
          <div class="glass-panel p-6">
            <div class="text-emerald-400 text-2xl mb-3">📊</div>
            <h3 class="text-lg font-bold text-white mb-2">Jonli O'lchov Daftari</h3>
            <p class="text-sm text-slate-400">Tajriba natijalarini jadvalga saqlang, xatoliklarni aniqlang va tayyor laboratoriya hisobotini chop eting.</p>
          </div>
          <div class="glass-panel p-6">
            <div class="text-purple-400 text-2xl mb-3">🧠</div>
            <h3 class="text-lg font-bold text-white mb-2">Test va Viktorinalar</h3>
            <p class="text-sm text-slate-400">Har bir tajriba yakunida olingan bilimlarni mustahkamlash uchun interaktiv test savollarini yeching.</p>
          </div>
        </div>
      </div>
    `;

    this.updateActiveNavLink('dashboard');
  }

  // 2. BO'LIM SAHIFASI (SECTION VIEW)
  showSection(sectionId) {
    this.destroyActiveSimulation();
    this.currentView = 'section';
    this.currentSectionId = sectionId;
    this.currentLabId = null;

    const sec = PHYSICS_DATA.sections.find(s => s.id === sectionId);
    if (!sec) {
      this.showDashboard();
      return;
    }

    const mainContainer = document.getElementById('app-main');
    if (!mainContainer) return;

    const labsHtml = sec.labs.map(labId => {
      const lab = PHYSICS_DATA.labs[labId];
      if (!lab) return '';
      return `
        <div class="lab-card flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Laboratoriya ishi
              </span>
              <span class="text-xs text-slate-400">⏱ ${lab.duration}</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition">
              ${lab.title}
            </h3>
            <p class="text-xs text-slate-400 mb-4 line-clamp-2">
              ${lab.subtitle}
            </p>
            <div class="mb-4 space-y-1">
              <span class="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Asosiy qonun:</span>
              <div class="text-xs text-slate-300 font-mono bg-slate-900/60 p-2 rounded border border-slate-800">
                ${lab.lawsApplied[0] ? lab.lawsApplied[0].name : ''}
              </div>
            </div>
          </div>
          <button onclick="app.navigate('lab/${lab.id}')" class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
            Laboratoriyani ochish →
          </button>
        </div>
      `;
    }).join('');

    const lawsListHtml = sec.coreLaws.map(law => `
      <li class="flex items-center gap-2 text-sm text-slate-300">
        <span class="text-blue-400">✓</span> ${law}
      </li>
    `).join('');

    mainContainer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Bo'lim bosh sarlavhasi -->
        <div class="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <a href="#dashboard" class="hover:text-white transition">Bosh sahifa</a>
          <span>/</span>
          <span class="text-white font-medium">${sec.title}</span>
        </div>

        <div class="glass-panel p-6 md:p-8 mb-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">${this.getSectionEmoji(sec.id)}</span>
                <h1 class="text-3xl font-extrabold text-white">${sec.title}</h1>
              </div>
              <p class="text-slate-300 max-w-3xl leading-relaxed">
                ${sec.overview}
              </p>
            </div>
            <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shrink-0">
              <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fundamental Qonuniyatlar</h4>
              <ul class="space-y-1.5">
                ${lawsListHtml}
              </ul>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-bold text-white">Ushbu bo'limdagi laboratoriya ishlari</h2>
          <p class="text-sm text-slate-400">Tadqiqotni boshlash uchun laboratoriya ishini tanlang</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          ${labsHtml}
        </div>
      </div>
    `;

    this.updateActiveNavLink(sectionId);
  }

  // 3. LABORATORIYA ISH MAYDONI (LAB WORKSPACE)
  showLab(labId) {
    this.destroyActiveSimulation();
    this.currentView = 'lab';
    this.currentLabId = labId;

    const lab = PHYSICS_DATA.labs[labId];
    if (!lab) {
      this.showDashboard();
      return;
    }

    const sec = PHYSICS_DATA.sections.find(s => s.id === lab.sectionId);
    this.currentSectionId = lab.sectionId;

    const mainContainer = document.getElementById('app-main');
    if (!mainContainer) return;

    // Qonunlar kartalari HTML
    const lawsCardsHtml = lab.lawsApplied.map((law, idx) => `
      <div class="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">${idx + 1}-qonun</span>
          <span class="text-[11px] text-slate-400 italic">${law.author || ''}</span>
        </div>
        <h4 class="text-sm font-bold text-white">${law.name}</h4>
        <div class="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 font-mono text-cyan-300 text-sm overflow-x-auto text-center">
          ${PhysicsMath.renderMathToHtml(law.formula)}
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${law.explanation}</p>
        ${law.units ? `<div class="text-[11px] text-slate-400 pt-1 border-t border-slate-800"><strong>O'lchov birliklari:</strong> ${law.units}</div>` : ''}
      </div>
    `).join('');

    // Ko'rsatmalar ro'yxati
    const instructionsHtml = lab.instructions.map(inst => `
      <li class="text-xs text-slate-300 leading-relaxed">${inst}</li>
    `).join('');

    // Jihozlar ro'yxati
    const equipHtml = lab.equipment.map(eq => `
      <li class="flex items-center gap-2 text-xs text-slate-300">
        <span class="text-emerald-400">▪</span> ${eq}
      </li>
    `).join('');

    // Jadval sarlavhasi
    const tableHeaderHtml = lab.tableColumns.map(col => `
      <th>${col.label}</th>
    `).join('') + `<th>Amallar</th>`;

    // Jadval saqlangan qatorlari
    const savedRows = this.measurements[labId] || [];
    const tableBodyHtml = this.renderTableRows(labId, savedRows);

    // Test savollari HTML
    const quizHtml = this.renderQuizQuestions(lab);

    mainContainer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Breadcrumbs -->
        <div class="mb-4 flex items-center gap-2 text-sm text-slate-400">
          <a href="#dashboard" class="hover:text-white transition">Bosh sahifa</a>
          <span>/</span>
          <a href="#section/${sec.id}" class="hover:text-white transition">${sec.title}</a>
          <span>/</span>
          <span class="text-white font-medium truncate">${lab.title}</span>
        </div>

        <!-- Laboratoriya Sarlavhasi -->
        <div class="glass-panel p-6 mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="px-2.5 py-1 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2 inline-block">
                ${sec.title} bo'limi laboratoriyasi
              </span>
              <h1 class="text-2xl md:text-3xl font-extrabold text-white mb-1">${lab.title}</h1>
              <p class="text-sm text-slate-300">${lab.subtitle}</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="app.printReport('${labId}')" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1.5">
                🖨️ Chop etish / Hisobot
              </button>
            </div>
          </div>

          <!-- Maqsad -->
          <div class="mt-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
            <strong class="text-white">Laboratoriya maqsadi:</strong> ${lab.objective}
          </div>
        </div>

        <!-- Ikki ustun: Qonunlar + Ko'rsatmalar -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="lg:col-span-2 space-y-4">
            <div class="glass-panel p-5">
              <h3 class="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-blue-400">📜</span> Laboratoriyada qo'llaniladigan fizik qonunlar va formulalar
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${lawsCardsHtml}
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="glass-panel p-5">
              <h3 class="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-emerald-400">🛠</span> Asbob-uskunalar
              </h3>
              <ul class="space-y-1.5 mb-4">
                ${equipHtml}
              </ul>

              <h3 class="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span class="text-amber-400">📋</span> Ishni bajarish tartibi
              </h3>
              <ol class="space-y-1.5 list-none">
                ${instructionsHtml}
              </ol>
            </div>
          </div>
        </div>

        <!-- SIMULYATOR MAYDONI -->
        <div class="glass-panel p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span class="text-cyan-400">⚡</span> Interaktiv Simulyator
            </h3>
            <span class="text-xs text-slate-400">Parametrlarni o'zgartiring va o'lchov natijalarini qayd qiling</span>
          </div>

          <!-- Simulyatsiya konteyneri -->
          <div id="sim-host"></div>
        </div>

        <!-- TAJRIBA O'LCHOV DAFTARI (JADVAL) -->
        <div class="glass-panel p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <span class="text-amber-400">📝</span> Laboratoriya Daftari (O'lchovlar Jadvali)
              </h3>
              <p class="text-xs text-slate-400">Simulyatordagi "O'lchovni qayd qilish" tugmasini bosganingizda joriy natijalar jadvalga yoziladi</p>
            </div>
            <div class="flex gap-2">
              <button onclick="app.clearMeasurements('${labId}')" class="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700 rounded-lg text-xs font-medium transition">
                Jadvalni tozalash
              </button>
            </div>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-800">
            <table class="lab-table">
              <thead>
                <tr>
                  ${tableHeaderHtml}
                </tr>
              </thead>
              <tbody id="lab-table-body">
                ${tableBodyHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- BILIMNI TEKSHIRISH (TEST VIKTORINA) -->
        <div class="glass-panel p-6 mb-8">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span class="text-purple-400">🧠</span> Olingan bilimlarni tekshirish (Test)
            </h3>
            <p class="text-xs text-slate-400">Laboratoriya xulosasini mustahkamlash uchun quyidagi test savollariga javob bering</p>
          </div>
          <div class="space-y-6">
            ${quizHtml}
          </div>
        </div>
      </div>
    `;

    // Simulyatsiyani ishga tushirish
    this.launchSimulation(labId);
    this.updateActiveNavLink(sec.id);
  }

  launchSimulation(labId) {
    const host = document.getElementById('sim-host');
    if (!host) return;

    if (labId === 'mechanics-pendulum') {
      this.activeSimulation = new PendulumSimulation('sim-host');
    } else if (labId === 'mechanics-projectile') {
      this.activeSimulation = new ProjectileSimulation('sim-host');
    } else if (labId === 'optics-refraction') {
      this.activeSimulation = new RefractionSimulation('sim-host');
    } else if (labId === 'optics-lens') {
      this.activeSimulation = new LensSimulation('sim-host');
    } else if (labId === 'thermo-gas-laws') {
      this.activeSimulation = new GasLawsSimulation('sim-host');
    } else if (labId === 'thermo-carnot') {
      this.activeSimulation = new CarnotSimulation('sim-host');
    } else if (labId === 'nuclear-photoelectric') {
      this.activeSimulation = new PhotoelectricSimulation('sim-host');
    } else if (labId === 'nuclear-decay') {
      this.activeSimulation = new DecaySimulation('sim-host');
    }

    if (this.activeSimulation) {
      this.activeSimulation.init();

      // "O'lchovni qayd qilish" tugmasini bog'lash
      const recordBtn = host.querySelector('[id$="-record"]');
      if (recordBtn) {
        recordBtn.addEventListener('click', () => {
          this.recordMeasurement(labId);
        });
      }
    }
  }

  recordMeasurement(labId) {
    if (!this.activeSimulation || typeof this.activeSimulation.getMeasurements !== 'function') return;
    const data = this.activeSimulation.getMeasurements();

    if (!this.measurements[labId]) {
      this.measurements[labId] = [];
    }

    const rowNum = this.measurements[labId].length + 1;
    data.num = rowNum;

    this.measurements[labId].push(data);
    localStorage.setItem('phys_measurements', JSON.stringify(this.measurements));

    // Jadvalni yangilash
    const tbody = document.getElementById('lab-table-body');
    if (tbody) {
      tbody.innerHTML = this.renderTableRows(labId, this.measurements[labId]);
    }
  }

  renderTableRows(labId, rows) {
    const lab = PHYSICS_DATA.labs[labId];
    if (!lab) return '';

    if (!rows || rows.length === 0) {
      return `
        <tr>
          <td colspan="${lab.tableColumns.length + 1}" class="text-center text-slate-500 py-6 font-sans">
            Hozircha hech qanday o'lchov saqlanmadi. Simulyatordan foydalanib "O'lchovni qayd qilish" tugmasini bosing.
          </td>
        </tr>
      `;
    }

    return rows.map((r, rIdx) => {
      const cells = lab.tableColumns.map(col => `<td>${r[col.key] !== undefined ? r[col.key] : ''}</td>`).join('');
      return `
        <tr>
          ${cells}
          <td>
            <button onclick="app.deleteMeasurementRow('${labId}', ${rIdx})" class="text-rose-400 hover:text-rose-300 font-sans text-xs">
              O'chirish
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  deleteMeasurementRow(labId, index) {
    if (this.measurements[labId]) {
      this.measurements[labId].splice(index, 1);
      // Qayta raqamlash
      this.measurements[labId].forEach((r, i) => r.num = i + 1);
      localStorage.setItem('phys_measurements', JSON.stringify(this.measurements));

      const tbody = document.getElementById('lab-table-body');
      if (tbody) {
        tbody.innerHTML = this.renderTableRows(labId, this.measurements[labId]);
      }
    }
  }

  clearMeasurements(labId) {
    if (confirm("Haqiqatan ham barcha o'lchovlarni o'chirmoqchimisiz?")) {
      this.measurements[labId] = [];
      localStorage.setItem('phys_measurements', JSON.stringify(this.measurements));
      const tbody = document.getElementById('lab-table-body');
      if (tbody) {
        tbody.innerHTML = this.renderTableRows(labId, []);
      }
    }
  }

  // 4. TEST VIKTORINALAR
  renderQuizQuestions(lab) {
    if (!lab.quiz || lab.quiz.length === 0) return '<div class="text-xs text-slate-400">Test savollari mavjud emas</div>';

    return lab.quiz.map((q, qIdx) => {
      const optionsHtml = q.options.map((opt, oIdx) => `
        <div class="quiz-option" id="quiz-${lab.id}-${qIdx}-${oIdx}" onclick="app.selectQuizAnswer('${lab.id}', ${qIdx}, ${oIdx})">
          <span class="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-xs font-semibold font-mono">
            ${String.fromCharCode(65 + oIdx)}
          </span>
          <span class="text-sm">${opt}</span>
        </div>
      `).join('');

      return `
        <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
          <div class="font-bold text-white text-sm">
            ${qIdx + 1}. ${q.question}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            ${optionsHtml}
          </div>
          <div id="quiz-exp-${lab.id}-${qIdx}" class="hidden p-3 rounded-lg text-xs leading-relaxed"></div>
        </div>
      `;
    }).join('');
  }

  selectQuizAnswer(labId, qIdx, oIdx) {
    const lab = PHYSICS_DATA.labs[labId];
    if (!lab || !lab.quiz[qIdx]) return;

    const q = lab.quiz[qIdx];
    const isCorrect = oIdx === q.correct;

    // Barcha variantlarni belgilash
    q.options.forEach((_, idx) => {
      const el = document.getElementById(`quiz-${labId}-${qIdx}-${idx}`);
      if (!el) return;
      el.classList.remove('selected', 'correct', 'incorrect');
      if (idx === q.correct) {
        el.classList.add('correct');
      } else if (idx === oIdx && !isCorrect) {
        el.classList.add('incorrect');
      }
    });

    // Izoh (Explanation) ko'rsatish
    const expEl = document.getElementById(`quiz-exp-${labId}-${qIdx}`);
    if (expEl) {
      expEl.classList.remove('hidden', 'bg-emerald-950/60', 'border-emerald-800', 'text-emerald-300', 'bg-rose-950/60', 'border-rose-800', 'text-rose-300');
      if (isCorrect) {
        expEl.classList.add('bg-emerald-950/60', 'border', 'border-emerald-800', 'text-emerald-300');
        expEl.innerHTML = `<strong>To'g'ri javob!</strong> ${q.explanation}`;
        PhysicsMath.playSound('ping');
      } else {
        expEl.classList.add('bg-rose-950/60', 'border', 'border-rose-800', 'text-rose-300');
        expEl.innerHTML = `<strong>Noto'g'ri!</strong> To'g'ri javob: ${String.fromCharCode(65 + q.correct)}. ${q.explanation}`;
        PhysicsMath.playSound('click');
      }
    }
  }

  // 5. CHOP ETISH / HISOBOT (PRINT REPORT)
  printReport(labId) {
    const lab = PHYSICS_DATA.labs[labId];
    if (!lab) return;

    const sec = PHYSICS_DATA.sections.find(s => s.id === lab.sectionId);
    const rows = this.measurements[labId] || [];

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Iltimos, qalqib chiquvchi oynalarga ruxsat bering!");
      return;
    }

    const tableRowsHtml = rows.map(r => {
      const cells = lab.tableColumns.map(col => `<td>${r[col.key] || ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laboratoriya Hisoboti - ${lab.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #111; line-height: 1.5; }
          h1 { font-size: 22px; margin-bottom: 5px; color: #1e3a8a; }
          h2 { font-size: 16px; color: #4b5563; margin-top: 0; }
          .header-box { border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 20px; }
          .meta { font-size: 13px; color: #4b5563; margin-bottom: 15px; }
          .section-title { font-weight: bold; font-size: 15px; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
          th { background: #f3f4f6; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 13px; }
          .sign-line { border-bottom: 1px solid #000; width: 200px; display: inline-block; margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h1>VIRTUAL FIZIKA LABORATORIYASI HISOBOTI</h1>
          <h2>${sec.title} — ${lab.title}</h2>
          <div class="meta">
            Sana: ${new Date().toLocaleDateString('uz-UZ')} | O'quvchi / Talaba: ____________________ | Guruh: _________
          </div>
        </div>

        <div class="section-title">1. Ishning maqsadi</div>
        <p>${lab.objective}</p>

        <div class="section-title">2. Asosiy fizik qonunlar va formulalar</div>
        <ul>
          ${lab.lawsApplied.map(l => `<li><strong>${l.name}:</strong> ${l.formula} (${l.explanation})</li>`).join('')}
        </ul>

        <div class="section-title">3. Tajriba o'lchov natijalari</div>
        <table>
          <thead>
            <tr>
              ${lab.tableColumns.map(c => `<th>${c.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml || '<tr><td colspan="' + lab.tableColumns.length + '">O\'lchovlar mavjud emas</td></tr>'}
          </tbody>
        </table>

        <div class="section-title">4. Xulosa</div>
        <p>Tajriba davomida fizik qonuniyatlar amalda tekshirildi va nazariy qiymatlar bilan solishtirildi.</p>

        <div class="footer">
          <div>O'quvchi imzosi: <span class="sign-line"></span></div>
          <div>O'qituvchi tekshirdi: <span class="sign-line"></span> Baho: _____</div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  // 6. QIDIRUV (SEARCH)
  handleSearch(query) {
    if (!query || query.trim() === '') {
      if (this.currentView === 'dashboard') this.showDashboard();
      return;
    }

    const q = query.toLowerCase().trim();
    const results = [];

    Object.values(PHYSICS_DATA.labs).forEach(lab => {
      const titleMatch = lab.title.toLowerCase().includes(q);
      const subMatch = lab.subtitle.toLowerCase().includes(q);
      const lawMatch = lab.lawsApplied.some(l => l.name.toLowerCase().includes(q) || l.explanation.toLowerCase().includes(q));

      if (titleMatch || subMatch || lawMatch) {
        results.push(lab);
      }
    });

    const mainContainer = document.getElementById('app-main');
    if (!mainContainer) return;

    if (results.length === 0) {
      mainContainer.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-16 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h2 class="text-xl font-bold text-white mb-2">Qidiruv bo'yicha natija topilmadi</h2>
          <p class="text-sm text-slate-400 mb-6">"${query}" so'zi bo'yicha hech qanday laboratoriya yoki qonun topilmadi.</p>
          <button onclick="app.showDashboard()" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
            Bosh sahifaga qaytish
          </button>
        </div>
      `;
      return;
    }

    const cardsHtml = results.map(lab => {
      const sec = PHYSICS_DATA.sections.find(s => s.id === lab.sectionId);
      return `
        <div class="lab-card flex flex-col justify-between">
          <div>
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 mb-2 inline-block">
              ${sec.title}
            </span>
            <h3 class="text-lg font-bold text-white mb-1">${lab.title}</h3>
            <p class="text-xs text-slate-400 mb-4">${lab.subtitle}</p>
          </div>
          <button onclick="app.navigate('lab/${lab.id}')" class="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition">
            Laboratoriyani ochish →
          </button>
        </div>
      `;
    }).join('');

    mainContainer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h2 class="text-xl font-bold text-white mb-2">Qidiruv natijalari: "${query}"</h2>
        <p class="text-xs text-slate-400 mb-6">${results.length} ta laboratoriya topildi</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  getSectionEmoji(secId) {
    const emojis = {
      mechanics: "⚙️",
      optics: "🌈",
      thermodynamics: "🔥",
      nuclear: "☢️"
    };
    return emojis[secId] || "🔬";
  }

  updateActiveNavLink(id) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => {
      const target = l.getAttribute('data-nav');
      if (target === id) {
        l.classList.add('text-blue-400', 'border-b-2', 'border-blue-500');
        l.classList.remove('text-slate-400');
      } else {
        l.classList.remove('text-blue-400', 'border-b-2', 'border-blue-500');
        l.classList.add('text-slate-400');
      }
    });
  }
}

// Global App instansiyasi
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new PhysicsLabApp();
  app.init();
});
