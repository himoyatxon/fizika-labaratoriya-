/**
 * Virtual Fizika Laboratoriyasi - Ma'lumotlar Bazasi
 * Barcha bo'limlar, fizik qonunlar, formulalar, laboratoriya ishlari va testlar
 */

const PHYSICS_DATA = {
  sections: [
    {
      id: "mechanics",
      title: "Mexanika",
      shortDesc: "Moddiy nuqtalar va qattiq jismlarning harakati, ularning o'zaro ta'siri va muvozanat qonuniyatlari.",
      icon: "fa-atom", // yoki svg belgisi
      color: "from-blue-600 to-indigo-700",
      accentColor: "#3b82f6",
      bgGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      overview: "Mexanika — fizikaning jismlarning fazodagi o'rni vaqt o'tishi bilan o'zgarishi (mexanik harakat) hamda bu harakatni yuzaga keltiruvchi sabablarni o'rganuvchi bo'limidir. Klassik mexanika I. Nyuton qonunlariga asoslanadi.",
      coreLaws: [
        "Nyutonning dinamika qonunlari (I, II, III qonunlar)",
        "Guk qonuni (Elastiklik kuchi)",
        "Butun olam tortishish qonuni",
        "Mexanik energiyaning saqlanish qonuni",
        "Impulsning saqlanish qonuni"
      ],
      labs: ["mechanics-pendulum", "mechanics-projectile"]
    },
    {
      id: "optics",
      title: "Optika",
      shortDesc: "Yorug'likning tarqalishi, qaytishi, sinishi, dispersiyasi, interferensiyasi va difraksiyasi qonunlari.",
      icon: "fa-sun",
      color: "from-amber-500 to-yellow-600",
      accentColor: "#f59e0b",
      bgGradient: "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
      overview: "Optika — yorug'lik tabiati, uning moddalar bilan o'zaro ta'siri va elektromagnit to'lqin sifatida tarqalish qonunlarini o'rganadi. Geometrik optikada yorug'lik nurlari qonuniyatlari, to'lqin optikasida esa to'lqin xususiyatlari tahlil qilinadi.",
      coreLaws: [
        "Yorug'likning to'g'ri chiziq bo'ylab tarqalish qonuni",
        "Yorug'likning qaytish qonuni",
        "Snelliusning sinish qonuni",
        "To'la ichki qaytish hodisasi",
        "Yupqa linza formulasi va fokus qonuniyatlari"
      ],
      labs: ["optics-refraction", "optics-lens"]
    },
    {
      id: "thermodynamics",
      title: "Molekulyar fizika va termodinamika",
      shortDesc: "Moddalarning ichki tuzilishi, zarrachalar harakati, issiqlik hodisalari va energiya aylanishlari.",
      icon: "fa-fire-flame-curved",
      color: "from-rose-600 to-red-700",
      accentColor: "#ef4444",
      bgGradient: "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)",
      overview: "Ushbu bo'lim moddalarning mikroskopik tuzilishi (molekula va atomlar) asosida makroskopik xossalarini (bosim, hajm, harorat) va issiqlik energiyasining mexanik ishga aylanish prinsiplarini o'rganadi.",
      coreLaws: [
        "Mendeleyev-Klapeyron tenglamasi (Ideal gaz holat tenglamasi)",
        "Boyl-Mariott qonuni (Izotermik jarayon)",
        "Gey-Lyussak qonuni (Izobarik jarayon)",
        "Sharl qonuni (Izoxorik jarayon)",
        "Termodinamikaning I va II qonunlari",
        "Karno sikli va ideal issiqlik mashinasi FIKi"
      ],
      labs: ["thermo-gas-laws", "thermo-carnot"]
    },
    {
      id: "nuclear",
      title: "Atom va yadro fizikasi",
      shortDesc: "Atom tuzilishi, elektron pog'onalar, kvant hodisalari, fotoeffekt va radioaktiv yemirilish.",
      icon: "fa-radiation",
      color: "from-emerald-600 to-teal-700",
      accentColor: "#10b981",
      bgGradient: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
      overview: "Atom va yadro fizikasi mikrodunyoda — atom qobig'i va atom yadrosida yuz beradigan kvant mexanik jarayonlarni, elementar zarrachalarning o'zaro aylanishlarini va yadroviy reaksiyalarni o'rganadi.",
      coreLaws: [
        "Eynshteynning fotoeffekt tenglamasi",
        "Plankning kvant gipotezasi (E = hν)",
        "Rezerfordning atomning planetar modeli",
        "Radioaktiv yemirilish qonuni",
        "Eynshteynning massa va energiya bog'liqligi (E = mc²)"
      ],
      labs: ["nuclear-photoelectric", "nuclear-decay"]
    }
  ],

  labs: {
    "mechanics-pendulum": {
      id: "mechanics-pendulum",
      sectionId: "mechanics",
      title: "Matematik va prujinali mayatnik tebranishlari",
      subtitle: "Guk qonuni, Gyuigens formulasi va mexanik energiya saqlanishi",
      duration: "45 daqiqa",
      difficulty: "Boshlang'ich / O'rta",
      objective: "Matematik va prujinali mayatniklarning erkin garmonik tebranish qonuniyatlarini o'rganish, tebranish davrining uzunlik, massa va erkin tushish tezlanishiga bog'liqligini aniqlash hamda to'la mexanik energiyaning saqlanishini tekshirish.",
      lawsApplied: [
        {
          name: "Gyuigens formulasi (Matematik mayatnik davri)",
          author: "Xristian Gyuigens (1673)",
          formula: "T = 2\\pi \\sqrt{\\frac{l}{g}}",
          explanation: "Matematik mayatnikning kichik burchak ostidagi tebranish davri faqat ipning uzunligi (l) va erkin tushish tezlanishi (g) ga bog'liq bo'lib, mayatnik massasiga bog'liq emas.",
          units: "T — davr [soniya, s]; l — ip uzunligi [metr, m]; g — erkin tushish tezlanishi [m/s²]"
        },
        {
          name: "Guk qonuni va prujinali mayatnik davri",
          author: "Robert Guk (1660)",
          formula: "F_{el} = -k \\cdot x \\quad \\Rightarrow \\quad T = 2\\pi \\sqrt{\\frac{m}{k}}",
          explanation: "Prujinaning elastiklik kuchi uning cho'zilishiga to'g'ri mutanosib va qarama-qarshi yo'nalgan. Prujinali mayatnik davri jism massasi (m) ga to'g'ri, bikrligi (k) ga teskari proportsional.",
          units: "k — bikrlik [N/m]; m — massa [kg]; x — siljish [m]"
        },
        {
          name: "Mexanik energiyaning saqlanish qonuni",
          author: "Mixail Lomonosov, Yulius Mayer (1842)",
          formula: "E = E_k + E_p = \\frac{m v^2}{2} + mgh = \\text{const}",
          explanation: "Tashqi ishqalanish kuchlari bo'lmaganda, mayatnikning kinetik va potensial energiyalari yig'indisi o'zgarmas saqlanadi. Chekka nuqtada Ep = max, muvozanatda Ek = max bo'ladi."
        }
      ],
      equipment: [
        "Virtual shtativ va mahkamlash muftasi",
        "O'zgaruvchan uzunlikdagi cho'zilmas ip va sharcha",
        "Turli bikrlikka ega elastik prujina",
        "Elektron sekundomer va chizg'ich",
        "Gravitatsiya selektori (Yer: 9.81 m/s², Oy: 1.62 m/s², Mars: 3.71 m/s², Yupiter: 24.79 m/s²)"
      ],
      instructions: [
        "1. Mayatnik turini tanlang: 'Matematik mayatnik' yoki 'Prujinali mayatnik'.",
        "2. Slayderlar orqali kerakli parametrlarni (uzunlik l yoki bikrlik k, massa m) o'rnating.",
        "3. Sayyora gravitatsiyasini tanlang (masalan, Yer g = 9.8 m/s²).",
        "4. Mayatnikni sichqoncha bilan chetga tortib qo'yib yuboring yoki 'Boshlash' tugmasini bosing.",
        "5. Sekundomer va osiloskop yordamida to'liq 10 ta tebranish vaqtini o'lchang, so'ng T = t/N davrni hisoblang.",
        "6. 'O'lchovni qayd qilish' tugmasini bosib, tajriba natijalarini laboratoriya daftariga saqlang.",
        "7. Ip uzunligini 4 marta orttirib, davr 2 marta ortishini amalda tekshirib ko'ring."
      ],
      tableColumns: [
        { key: "num", label: "№" },
        { key: "type", label: "Turi" },
        { key: "param1", label: "Uzunlik l (m) / k (N/m)" },
        { key: "mass", label: "Massa m (kg)" },
        { key: "gravity", label: "g (m/s²)" },
        { key: "tExp", label: "Tajribaviy T (s)" },
        { key: "tTheo", label: "Nazariy T (s)" },
        { key: "error", label: "Nisbiy xato (%)" }
      ],
      quiz: [
        {
          question: "Matematik mayatnik ipining uzunligi 4 marta orttirilsa, uning tebranish davri qanday o'zgaradi?",
          options: [
            "2 marta ortadi",
            "4 marta ortadi",
            "2 marta kamayadi",
            "O'zgarmaydi"
          ],
          correct: 0,
          explanation: "Gyuigens formulasiga ko'ra T = 2π√(l/g). Uzunlik ildiz ostida bo'lgani uchun, l 4 marta ortsa, T davr √4 = 2 marta ortadi."
        },
        {
          question: "Prujinali mayatnik Oydagi laboratoriyaga olib borilsa, uning tebranish davri qanday o'zgaradi?",
          options: [
            "O'zgarmaydi",
            "Kamayadi",
            "Ortadi",
            "Nolga teng bo'ladi"
          ],
          correct: 0,
          explanation: "Prujinali mayatnik tebranish davri T = 2π√(m/k) formulasi bilan aniqlanadi va u erkin tushish tezlanishi g ga mutlaqo bog'liq emas. Shuning uchun Oydagi davr Yerdagisi bilan bir xil qoladi."
        },
        {
          question: "Mayatnik muvozanat vaziyatidan o'tayotgan paytda uning qaysi fizik kattaligi maksimal bo'ladi?",
          options: [
            "Kinetik energiya va tezlik",
            "Potensial energiya",
            "Tezlanish",
            "Qaytuvchi kuch"
          ],
          correct: 0,
          explanation: "Muvozanat vaziyatida h = 0 bo'lib, butun potensial energiya kinetik energiyaga aylanadi (Ek = max), shuning uchun tezlik ham maksimal qiymatga erishadi."
        }
      ]
    },

    "mechanics-projectile": {
      id: "mechanics-projectile",
      sectionId: "mechanics",
      title: "Gorizontga burchak ostida otilgan jism harakati (Ballistika)",
      subtitle: "Nyuton qonunlari, og'irlik kuchi ta'sirida ikki o'lchamli harakat kinematikasi",
      duration: "40 daqiqa",
      difficulty: "O'rta",
      objective: "Gorizontga burchak ostida otilgan jismning traektoriyasini, maksimal ko'tarilish balandligi, uchish uzoqligi va uchish vaqtini o'rganish. Boshlang'ich tezlik, otilish burchagi hamda havo qarshiligining harakatga ta'sirini tahlil qilish.",
      lawsApplied: [
        {
          name: "Gravitatsiya maydonidagi kinematik harakat tenglamalari",
          author: "Galileo Galiley (1638)",
          formula: "x(t) = v_0 \\cos\\alpha \\cdot t, \\quad y(t) = h_0 + v_0 \\sin\\alpha \\cdot t - \\frac{g t^2}{2}",
          explanation: "Jism gorizontal o'q (Ox) bo'ylab tekis to'g'ri chiziqli harakat qiladi, vertikal o'q (Oy) bo'ylab esa erkin tushish tezlanishi g ta'sirida tekis sekinlanuvchan (ko'tarilishda) va tekis tezlanuvchan (tushishda) harakat qiladi.",
          units: "v₀ — boshlang'ich tezlik [m/s]; α — otilish burchagi [gradus]; t — vaqt [s]"
        },
        {
          name: "Maksimal ko'tarilish balandligi va uchish uzoqligi",
          author: "Klassik ballistika qonuni",
          formula: "H_{max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}, \\quad L = \\frac{v_0^2 \\sin(2\\alpha)}{g}",
          explanation: "Maksimal uchish uzoqligi α = 45° burchak ostida otilganda kuzatiladi (chunki sin(2·45°) = sin(90°) = 1 bo'ladi). Havoning qarshiligi mavjud bo'lganda traektoriya nosimmetrik bo'lib, balandlik va masofa qisqaradi."
        }
      ],
      equipment: [
        "Artilleriya / To'p moslamasi (burchak va tezlik regulyatori)",
        "Nishon obyekti va masofa o'lchash lentasi",
        "Traektoriya chizg'ichi va tezlik vektorlari datchigi",
        "Havo qarshiligi simulyatori (aerodinamik koeffitsiyent)"
      ],
      instructions: [
        "1. To'pning balandligini (h₀) va boshlang'ich tezligini (v₀) belgilang.",
        "2. Burchakni (α) sozlang (masalan, 30°, 45°, 60°).",
        "3. 'O't ochish' tugmasini bosib to'p snaryadini uchiring.",
        "4. Ekranda chizilgan parabolik traektoriya parametrlarini (H_max va L) tekshiring.",
        "5. Nishonni urish uchun optimal burchakni hisoblab ko'ring.",
        "6. Havo qarshiligi (Air drag) tugmasini yoqib, havo qanday sekinlashtirishini kuzating.",
        "7. Olingan natijalarni jadvalga qayd qiling."
      ],
      tableColumns: [
        { key: "num", label: "№" },
        { key: "v0", label: "v₀ (m/s)" },
        { key: "angle", label: "Burchak α (°)" },
        { key: "h0", label: "Balandlik h₀ (m)" },
        { key: "drag", label: "Qarshilik" },
        { key: "hMax", label: "H_max (m)" },
        { key: "range", label: "Uzoqlik L (m)" },
        { key: "time", label: "Uchish vaqti t (s)" }
      ],
      quiz: [
        {
          question: "Havo qarshiligi hisobga olinmaganda, qaysi burchak ostida otilgan jism eng uzoq masofaga borib tushadi?",
          options: [
            "45°",
            "30°",
            "60°",
            "90°"
          ],
          correct: 0,
          explanation: "Uchish uzoqligi L = (v₀² · sin(2α)) / g formulasida sin(2α) ifoda 2α = 90°, ya'ni α = 45° bo'lganda o'zining maksimal qiymati 1 ga yetadi."
        },
        {
          question: "Snaryad traektoriyasining eng yuqori nuqtasida uning to'la tezlanishi nimaga teng?",
          options: [
            "g erkin tushish tezlanishiga",
            "Nolga teng",
            "Boshlang'ich tezlanishga",
            "Faqat tangensial tezlanishga"
          ],
          correct: 0,
          explanation: "Harakat davomida faqat og'irlik kuchi ta'sir etgani sababli, traektoriyaning barcha nuqtalarida, jumladan eng yuqori nuqtasida ham jism faqat g = 9.8 m/s² pastga yo'nalgan erkin tushish tezlanishiga ega bo'ladi."
        },
        {
          question: "Boshlang'ich tezlik 2 marta orttirilsa, maksimal ko'tarilish balandligi necha marta ortadi?",
          options: [
            "4 marta",
            "2 marta",
            "8 marta",
            "O'zgarmaydi"
          ],
          correct: 0,
          explanation: "Maksimal ko'tarilish balandligi H = (v₀² · sin²α) / (2g) formulasiga binoan, tezlik kvadratik bog'langan. Tezlik 2 marta ortsa, balandlik 2² = 4 marta ortadi."
        }
      ]
    },

    "optics-refraction": {
      id: "optics-refraction",
      sectionId: "optics",
      title: "Yorug'likning sinishi, qaytishi va to'la ichki qaytish",
      subtitle: "Snellius qonuni, sindirish ko'rsatkichi va optik chegaralar",
      duration: "40 daqiqa",
      difficulty: "Boshlang'ich",
      objective: "Yorug'lik nurining ikki muhit chegarasida sinish va qaytish qonuniyatlarini tekshirish, muhitlarning mutlaq sindirish ko'rsatkichlarini aniqlash hamda to'la ichki qaytish hodisasining chegaraviy burchagini o'lchash.",
      lawsApplied: [
        {
          name: "Snelliusning sinish qonuni",
          author: "Villebrord Snellius (1621)",
          formula: "n_1 \\sin\\alpha = n_2 \\sin\\beta \\quad \\Rightarrow \\quad \\frac{\\sin\\alpha}{\\sin\\beta} = \\frac{n_2}{n_1} = n_{21}",
          explanation: "Tushuvchi nur, singan nur va ikkala muhit chegarasiga tushish nuqtasida o'tkazilgan perpendikulyar (normal) bir tekislikda yotadi. Tushish burchagi sinusi singan burchak sinusiga nisbati o'zgarmas bo'lib, ikkinchi muhitning birinchisiga nisbatan sindirish ko'rsatkichiga teng.",
          units: "n₁, n₂ — o'lchovsiz mutlaq sindirish ko'rsatkichlari; α, β — burchaklar [gradus]"
        },
        {
          name: "To'la ichki qaytish hodisasi va chegaraviy burchak",
          author: "Pyer de Ferma (1662)",
          formula: "\\sin\\alpha_0 = \\frac{n_2}{n_1} \\quad (n_1 > n_2)",
          explanation: "Yorug'lik optik zichroq muhitdan (n₁) optik zichligi kamroq muhitga (n₂) o'tayotganda, tushish burchagi α₀ dan oshsa, nur ikkinchi muhitga kirmasdan to'liq birinchi muhitga qaytadi. Bu optik tolalarning (fiber optics) asosiy ishlash prinsipidir."
        }
      ],
      equipment: [
        "Monoxromatik lazer nuri manbai",
        "Optik disk (graduslarga bo'lingan transportir 360°)",
        "Turli moddalar bloki: Havo (n=1.00), Suv (n=1.33), Shisha (n=1.52), Olmos (n=2.42), Glitserin (n=1.47)",
        "Yorug'lik intensivligi sensori (fotodiod)"
      ],
      instructions: [
        "1. Birinchi muhit (Medium 1) va ikkinchi muhit (Medium 2) moddalarini tanlang.",
        "2. Lazer tushish burchagini (α) 0° dan 90° gacha o'zgartirib boring.",
        "3. Singan nurning burchagini (β) va qaytgan nurning burchagini optik diskda kuzating.",
        "4. Snellius formulasi orqali hisoblangan sinish burchagini tajribaviy burchak bilan solishtiring.",
        "5. Birinchi muhit qilib Shisha (1.50), ikkinchi muhit qilib Havo (1.00) ni o'rnating va burchakni asta-sekin oshirib, to'la ichki qaytish boshlangan burchakni (chegaraviy burchak α₀ ≈ 41.8°) aniqlang.",
        "6. Qiymatlarni laboratoriya jadvaliga yozing."
      ],
      tableColumns: [
        { key: "num", label: "№" },
        { key: "m1", label: "Muhit 1 (n₁)" },
        { key: "m2", label: "Muhit 2 (n₂)" },
        { key: "alpha", label: "Tushish burchagi α (°)" },
        { key: "betaExp", label: "O'lchangan β (°)" },
        { key: "betaTheo", label: "Nazariy β (°)" },
        { key: "tir", label: "To'la ichki qaytish" }
      ],
      quiz: [
        {
          question: "Yorug'lik nuri havoda suvga (n=1.33) burchak ostida tushsa, singan nur qanday yo'naladi?",
          options: [
            "Normalga tomon yaqinlashadi (sinish burchagi tushish burchagidan kichik bo'ladi)",
            "Normaldan uzoqlashadi",
            "Yo'nalishini o'zgartirmaydi",
            "Faqat to'la qaytadi"
          ],
          correct: 0,
          explanation: "Zichroq muhitga (n₂ > n₁) o'tganda Snellius qonuniga ko'ra sin β = (n₁/n₂)·sin α bo'lib, sin β < sin α, ya'ni nur perpendikulyarga tomon buriladi."
        },
        {
          question: "To'la ichki qaytish hodisasi yuz berishi uchun qaysi shart bajarilishi shart?",
          options: [
            "Nur optik zichroq muhitdan kamroq muhitga o'tishi va α ≥ α₀ bo'lishi",
            "Nur havodan olmosga o'tishi",
            "Tushish burchagi 90° bo'lishi",
            "Ikkala muhit sindirish ko'rsatkichi bir xil bo'lishi"
          ],
          correct: 0,
          explanation: "To'la ichki qaytish faqat yorug'lik nuri n₁ > n₂ bo'lgan sharoitda va tushish burchagi chegaraviy burchakdan katta yoki teng bo'lgandagina sodir bo'ladi."
        },
        {
          question: "Sindirish ko'rsatkichi n = 2 bo'lgan muhitda yorug'lik tezligi vakuumdagiga nisbatan qanday bo'ladi?",
          options: [
            "2 marta kichik (150 000 km/s)",
            "2 marta katta",
            "O'zgarmaydi",
            "4 marta kichik"
          ],
          correct: 0,
          explanation: "Mutlaq sindirish ko'rsatkichi n = c / v munosabat bilan aniqlanadi. Demak, v = c / n = 300 000 / 2 = 150 000 km/s bo'ladi."
        }
      ]
    },

    "optics-lens": {
      id: "optics-lens",
      sectionId: "optics",
      title: "Yupqa linzada tasvir hosil bo'lishi",
      subtitle: "Linza formulasi, optik kuch, fokal tekislik va kattalashtirish",
      duration: "45 daqiqa",
      difficulty: "O'rta",
      objective: "Yig'uvchi va sochuvchi yupqa linzalarda nurlarning o'tishini, jismning turli masofalarda joylashganda hosil bo'ladigan tasvir xususiyatlarini (haqiqiy/mavhum, to'g'ri/to'ntarilgan, kattalashtirilgan/kichraytirilgan) tajribada isbotlash va linza formulasini tekshirish.",
      lawsApplied: [
        {
          name: "Yupqa linza formulasi",
          author: "Iogann Kepler, Rene Dekart (1604-1637)",
          formula: "\\pm \\frac{1}{F} = \\frac{1}{d} \\pm \\frac{1}{f}",
          explanation: "Linzaning fokus masofasi (F), jismdan linzagacha masofa (d) va linzadan tasvirgacha masofa (f) orasidagi universal bog'lanish. Yig'uvchi linza uchun F > 0, sochuvchi linza uchun F < 0 olinadi. Haqiqiy tasvirda +f, mavhum tasvirda -f belgisi qo'yiladi.",
          units: "F, d, f — metr [m]; Optik kuch D = 1/F — dioptriya [dptr]"
        },
        {
          name: "Chiziqli kattalashtirish qonuni",
          author: "Geometrik optika qoidalari",
          formula: "k = \\frac{H}{h} = \\frac{f}{d}",
          explanation: "Tasvir balandligi (H) ning jism balandligi (h) ga nisbati chiziqli kattalashtirish deyiladi va u tasvir masofasining jism masofasiga nisbatiga tengdir."
        }
      ],
      equipment: [
        "Optik rels (skameyka) va millimetrli shkala",
        "Yorug'lik manbai (predmet/sham)",
        "Yig'uvchi (qavariq) va sochuvchi (botiq) linzalar to'plami",
        "Tasvir proyeksiyalanuvchi mat ekran",
        "Asosiy optik nurlar traektoriyasini ko'rsatuvchi nur manbai"
      ],
      instructions: [
        "1. Linza turini tanlang: 'Yig'uvchi linza' yoki 'Sochuvchi linza'.",
        "2. Linzaning fokus masofasini (F) va jism balandligini (h) slayderlar orqali o'rnating.",
        "3. Predmetni (shamni) optik o'q bo'ylab siljiting (d > 2F, d = 2F, F < d < 2F, d = F, d < F).",
        "4. Ekranda hosil bo'lgan 3 ta xarakterli nurni kuzating: parallel nur, optik markazdan o'tuvchi nur, fokusdan o'tuvchi nur.",
        "5. Tasvirning xarakteristikasini tekshiring (haqiqiy/mavhum, to'ntarilgan/to'g'ri).",
        "6. Formuladan f masofani hisoblab, o'lchov natijalari bilan solishtiring va jadvalga kiriting."
      ],
      tableColumns: [
        { key: "num", label: "№" },
        { key: "type", label: "Linza turi" },
        { key: "F", label: "Fokus F (sm)" },
        { key: "d", label: "Jism d (sm)" },
        { key: "fExp", label: "Tasvir f (sm)" },
        { key: "mag", label: "Kattalashtirish k" },
        { key: "nature", label: "Tasvir xususiyati" }
      ],
      quiz: [
        {
          question: "Jism yig'uvchi linzadan uning ikkilangan fokus masofasida (d = 2F) joylashsa, tasvir qayerda hosil bo'ladi?",
          options: [
            "Linzaning narigi tomonida 2F masofada, haqiqiy, to'ntarilgan va o'z o'lchamiga teng",
            "Fokusda (F da), kichraytirilgan",
            "Cheksizlikda, tasvir hosil bo'lmaydi",
            "Linza oldida mavhum tasvir"
          ],
          correct: 0,
          explanation: "1/F = 1/(2F) + 1/f => 1/f = 1/(2F) => f = 2F. Kattalashtirish k = f/d = 2F/2F = 1. Tasvir haqiqiy, to'ntarilgan va jism bilan teng o'lchamda bo'ladi."
        },
        {
          question: "Fokus masofasi F = 0.25 m bo'lgan ko'zoynak linzasining optik kuchi qancha dioptriya bo'ladi?",
          options: [
            "+4.0 dptr",
            "+0.25 dptr",
            "+2.5 dptr",
            "-4.0 dptr"
          ],
          correct: 0,
          explanation: "Optik kuch D = 1 / F = 1 / 0.25 = +4 dptr ga teng."
        },
        {
          question: "Sochuvchi linza qanday tasvir beradi?",
          options: [
            "Har doim mavhum, to'g'ri va kichraytirilgan",
            "Har doim haqiqiy va to'ntarilgan",
            "Jism masofasiga qarab haqiqiy yoki mavhum",
            "Faqat kattalashtirilgan tasvir"
          ],
          correct: 0,
          explanation: "Sochuvchi linza har qanday masofadagi jism uchun faqat mavhum, to'g'ri va kichraytirilgan tasvir hosil qiladi."
        }
      ]
    },

    "thermo-gas-laws": {
      id: "thermo-gas-laws",
      sectionId: "thermodynamics",
      title: "Ideal gaz izojarayonlari va turli gazlar kinetikasi",
      subtitle: "Mendeleyev-Klapeyron tenglamasi, gaz qonunlari va Maksvell taqsimoti (Heliy, Azot, Kislorod, CO₂)",
      duration: "50 daqiqa",
      difficulty: "O'rta",
      objective: "Turli gazlar (Heliy He, Azot N₂, Kislorod O₂, Karbonat angidrid CO₂, Vodorod H₂) misolida ideal gaz holat parametrlari (P, V, T), ularning molyar massasi (M) va molekulalar harakat tezligi (v_kv) orasidagi bog'lanishlarni o'rganish. Izotermik, izobarik va izoxorik jarayonlarni solishtirish.",
      lawsApplied: [
        {
          name: "Mendeleyev-Klapeyron tenglamasi",
          author: "Dmitriy Mendeleyev (1874), Emil Klapeyron (1834)",
          formula: "P \\cdot V = \\nu \\cdot R \\cdot T = \\frac{m}{M} R T",
          explanation: "Ideal gazning makroskopik holatini to'liq tavsiflovchi universal qonun. M — gazning molyar massasi (Heliyda 4 g/mol, Kislorodda 32 g/mol, Azotda 28 g/mol). R = 8.314 J/(mol·K) universal gaz doimiysi.",
          units: "P — bosim [kPa]; V — hajm [litr]; T — mutlaq harorat [Kelvin, K]; M — molyar massa [g/mol]"
        },
        {
          name: "Molekulalarning o'rtacha kvadratik tezligi (Maksvell)",
          author: "Jeyms Klerk Maksvell, Lyudvig Bolsman (1860)",
          formula: "v_{kv} = \\sqrt{\\frac{3RT}{M}} = \\sqrt{\\frac{3 k_B T}{m_0}}",
          explanation: "Bir xil haroratda yengil gaz molekulalari (masalan, Heliy He, M=4 g/mol) og'ir gaz molekulalariga (masalan, Kislorod O₂, M=32 g/mol) qaraganda ancha tez harakatlanadi: v(He) ≈ 2.83 · v(O₂).",
          units: "v_kv — o'rtacha kvadratik tezlik [m/s]; M — kg/mol; T — Kelvin"
        },
        {
          name: "Boyl-Mariott qonuni (Izotermik jarayon: T = const)",
          author: "Robert Boyl (1662), Edm Mariott (1676)",
          formula: "P \\cdot V = \\text{const} \\quad \\Rightarrow \\quad P_1 V_1 = P_2 V_2",
          explanation: "O'zgarmas massali gazning harorati o'zgarmaganda uning bosimi hajmiga teskari proportsional bo'ladi. P-V grafigida giperbola (izoterma) ko'rinishida tasvirlanadi."
        },
        {
          name: "Gey-Lyussak qonuni (Izobarik jarayon: P = const)",
          author: "Jozef Lui Gey-Lyussak (1802)",
          formula: "\\frac{V}{T} = \\text{const} \\quad \\Rightarrow \\quad \\frac{V_1}{T_1} = \\frac{V_2}{T_2}",
          explanation: "O'zgarmas bosimda gaz hajmi mutlaq haroratga to'g'ri mutanosib ravishda o'zgaradi."
        },
        {
          name: "Sharl qonuni (Izoxorik jarayon: V = const)",
          author: "Jak Sharl (1787)",
          formula: "\\frac{P}{T} = \\text{const} \\quad \\Rightarrow \\quad \\frac{P_1}{T_1} = \\frac{P_2}{T_2}",
          explanation: "O'zgarmas hajmda gaz bosimi mutlaq haroratga to'g'ri proportsional ravishda o'zgaradi."
        }
      ],
      equipment: [
        "Porshenli shaffof germetik silindr",
        "Gaz selektori: Heliy (He), Azot (N₂), Kislorod (O₂), Karbonat angidrid (CO₂), Vodorod (H₂)",
        "Elektron manometr (bosim datchigi)",
        "Raqamli termometr (harorat Kelvin va Selsiyda)",
        "Qizdirgich va muzlagich (issiqlik almashtirgich)",
        "Molekulalar tezligining Maksvell taqsimoti vizualizatori"
      ],
      instructions: [
        "1. Gaz turini tanlang: 'Heliy (He)', 'Azot (N₂)', 'Kislorod (O₂)' yoki 'Karbonat angidrid (CO₂)'.",
        "2. Tadqiq qilinadigan jarayon turini tanlang: 'Izotermik (T=const)', 'Izobarik (P=const)' yoki 'Izoxorik (V=const)'.",
        "3. Heliy va Kislorod molekulalari tezligini bir xil haroratda taqqoslang (Heliy molekulalari ancha tez uchadi!).",
        "4. Porshenni surish yoki isitish orqali bitta parametrni o'zgartiring va qolgan parametrlar qanday o'zgarishini qayd qiling.",
        "5. Dinamik chizilayotgan P-V, V-T va P-T grafiklarini tahlil qiling.",
        "6. O'lchov natijalarini jadvalga qo'shib, P·V / T = const ekanligini hisoblang."
      ],
      tableColumns: [
        { key: "num", label: "№" },
        { key: "gas", label: "Gaz turi" },
        { key: "molarMass", label: "M (g/mol)" },
        { key: "process", label: "Jarayon" },
        { key: "P", label: "Bosim P (kPa)" },
        { key: "V", label: "Hajm V (L)" },
        { key: "T", label: "Harorat T (K)" },
        { key: "vSpeed", label: "v_kv (m/s)" },
        { key: "constVal", label: "PV / T nisbat" }
      ],
      quiz: [
        {
          question: "Izotermik siqilishda gaz hajmi 3 marta kamaytirilsa, uning bosimi qanday o'zgaradi?",
          options: [
            "3 marta ortadi",
            "3 marta kamayadi",
            "9 marta ortadi",
            "O'zgarmaydi"
          ],
          correct: 0,
          explanation: "Boyl-Mariott qonuniga ko'ra P₁V₁ = P₂V₂. T = const bo'lgani sababli hajm 3 marta kamaysa, bosim 3 marta oshadi."
        },
        {
          question: "Mutlaq nol harorat (0 Kelvin) Selsiy shkalasida nimaga teng?",
          options: [
            "-273.15 °C",
            "0 °C",
            "-100 °C",
            "-373.15 °C"
          ],
          correct: 0,
          explanation: "T(K) = t(°C) + 273.15 formuladan, 0 K harorat -273.15 °C ga to'g'ri keladi. Bu moddadagi barcha molekulalarning issiqlik harakati to'xtaydigan eng past nazariy chegara."
        },
        {
          question: "Avtomobil shinasidagi havo haydash davomida qizisa (hajmi deyarli o'zgarmas bo'lsa), bosim nima sababdan ortadi?",
          options: [
            "Molekulalarning o'rtacha tezligi va urilish zarbi ortishi sababli (Sharl qonuni)",
            "Molekulalar soni ko'paygani sababli",
            "Tashqi atmosfera bosimi kamaygani uchun",
            "Molekulalar hajmi kengaygani uchun"
          ],
          correct: 0,
          explanation: "Izoxorik jarayonda (V = const) harorat oshganda gaz molekulalarining o'rtacha kinetik energiyasi ortadi, bu esa devorga urilish kuchini va demak, bosimni oshiradi."
        }
      ]
    },

    "thermo-carnot": {
      id: "thermo-carnot",
      sectionId: "thermodynamics",
      title: "Termodinamikaning 1-qonuni va Karno sikli (Issiqlik mashinasi)",
      subtitle: "Q = ΔU + A, Karno ideal sikli, foydali ish koeffitsiyenti (FIK)",
      duration: "45 daqiqa",
      difficulty: "Qiyin / Yuqori",
      objective: "Termodinamikaning 1- va 2-qonunlarini, issiqlik mashinasining ishlash prinsipini va maksimal mumkin bo'lgan Karno sikli foydali ish koeffitsiyenti (FIK) qizdirgich hamda sovitkich haroratiga bog'liqligini o'rganish.",
      lawsApplied: [
        {
          name: "Termodinamikaning 1-qonuni",
          author: "Yulius Mayer, Jeyms Joul (1845)",
          formula: "Q = \\Delta U + A \\quad \\Leftrightarrow \\quad \\Delta U = Q - A",
          explanation: "Tizimga berilgan issiqlik miqdori (Q) uning ichki energiyasini o'zgartirishga (ΔU) va tashqi kuchlarga qarshi ish bajarishga (A) sarflanadi. Yopiq siklda ΔU = 0 bo'lib, bajarilgan foydali ish A = Q₁ - Q₂ ga teng bo'ladi.",
          units: "Q, ΔU, A — Joul [J]"
        },
        {
          name: "Karno teoremasi va ideal issiqlik mashinasi FIKi",
          author: "Sadi Karno (1824)",
          formula: "\\eta_{Karno} = \\frac{T_1 - T_2}{T_1} = 1 - \\frac{T_2}{T_1} = \\frac{A}{Q_1} = \\frac{Q_1 - Q_2}{Q_1}",
          explanation: "Haroratlari T₁ bo'lgan qizdirgich va T₂ bo'lgan sovitkich orasida ishlovchi har qanday issiqlik mashinasining FIKi xuddi shu haroratlarda ishlovchi ideal Karno mashinasi FIKidan katta bo'lishi mumkin emas.",
          units: "η — FIK (0 dan 1 gacha yoki foizda %); T₁, T₂ — Kelvin [K]"
        }
      ],
      equipment: [
        "Karno silindri va porshen modeli",
        "Qizdirgich rezervuari (T₁ > 0)",
        "Sovitkich rezervuari (T₂ < T₁)",
        "Mukammal adiabatik (issiqlik o'tkazmaydigan) taglik",
        "P-V sikl grafigi ko'rsatkich ekrani"
      ],
      instructions: [
        "1. Qizdirgich haroratini (T₁) va Sovitkich haroratini (T₂) slayderlar orqali tanlang.",
        "2. Karno siklini 4 bosqichda bajaring:",
        "   - 1-2: Qizdirgich bilan aloqada Izotermik kengayish (Q₁ issiqlik olinadi)",
        "   - 2-3: Izolyatsiyalangan taglikda Adiabatik kengayish (temperatura T₂ gacha pasayadi)",
        "   - 3-4: Sovitkich bilan aloqada Izotermik siqilish (Q₂ issiqlik sovitkichga beriladi)",
        "   - 4-1: Izolyatsiyalangan taglikda Adiabatik siqilish (boshlang'ich holatga qaytish)",
        "3. P-V diagrammasida sikl ichidagi yopiq soha yuzasi (bajarilgan sof ish A) qanday o'zgarishini kuzating.",
        "4. Nazariy Karno FIKi bilan amaliy hisoblangan FIKni solishtiring.",
        "5. Olingan ma'lumotlarni laboratoriya jadvaliga kiritib boring."
      ],
      tableColumns: [
        { key: "num", label: "№" },
        { key: "T1", label: "Qizdirgich T₁ (K)" },
        { key: "T2", label: "Sovitkich T₂ (K)" },
        { key: "Q1", label: "Q₁ olingan (J)" },
        { key: "Q2", label: "Q₂ berilgan (J)" },
        { key: "A", label: "Bajarilgan ish A (J)" },
        { key: "eta", label: "FIK η (%)" }
      ],
      quiz: [
        {
          question: "Qizdirgich harorati 600 K, sovitkich harorati 300 K bo'lgan ideal Karno issiqlik mashinasining maksimal FIKi qancha?",
          options: [
            "50%",
            "100%",
            "25%",
            "75%"
          ],
          correct: 0,
          explanation: "η = (T₁ - T₂) / T₁ = (600 - 300) / 600 = 300 / 600 = 0.50 (yoki 50%)."
        },
        {
          question: "Issiqlik mashinasining FIKini oshirishning eng samarali yo'li nima?",
          options: [
            "Qizdirgich haroratini (T₁) oshirish yoki sovitkich haroratini (T₂) pasaytirish",
            "Faqat porshen hajmini kattalashtirish",
            "Gaz massasini kamaytirish",
            "Jarayonni tezroq bajarish"
          ],
          correct: 0,
          explanation: "η = 1 - (T₂ / T₁) formulasiga binoan, T₂/T₁ nisbat qanchalik kichik bo'lsa, FIK shunchalik 1 ga (100% ga) yaqinlashadi."
        },
        {
          question: "Adiabatik jarayonda tizim atrof-muhit bilan qanday issiqlik almashinadi?",
          options: [
            "Issiqlik almashinuvi bo'lmaydi (Q = 0)",
            "Doimiy issiqlik qabul qilinadi",
            "Harorat doimiy o'zgarmas qoladi",
            "Bosim doim nolga teng bo'ladi"
          ],
          correct: 0,
          explanation: "Adiabatik jarayon bu atrof-muhit bilan issiqlik almashinuvsiz kechadigan jarayondir, ya'ni Q = 0. Bunda ish ichki energiya kamayishi hisobiga bajariladi (A = -ΔU)."
        }
      ]
    },

    "nuclear-photoelectric": {
      id: "nuclear-photoelectric",
      sectionId: "nuclear",
      title: "Fotoeffekt hodisasi va Eynshteyn tenglamasi",
      subtitle: "Foton energiyasi, chiqish ishi, qizil chegara va to'xtatuvchi potensial",
      duration: "45 daqiqa",
      difficulty: "Yuqori",
      objective: "Tashqi fotoeffekt qonuniyatlarini tajribada o'rganish, yorug'lik to'lqin uzunligi va intensivligining fotoelektronlar energiyasi hamda fototok kuchiga ta'sirini tekshirish, turli metallarning chiqish ishini va Plank doimiysini aniqlash.",
      lawsApplied: [
        {
          name: "Eynshteynning fotoeffekt tenglamasi",
          author: "Albert Eynshteyn (1905, Nobel mukofoti 1921)",
          formula: "h \\nu = A_{chiq} + E_k = A_{chiq} + \\frac{m v_{max}^2}{2} = A_{chiq} + e \\cdot U_t",
          explanation: "Metallga tushayotgan foton energiyasi (hν) elektronni metalldan ajratib olish (chiqish ishi A_chiq) va unga maksimal kinetik energiya (Ek) berishga sarflanadi.",
          units: "h — Plank doimiysi (6.626·10⁻³⁴ J·s); ν — chastota [Gs]; A_chiq — chiqish ishi [eV yoki J]; U_t — to'xtatuvchi kuchlanish [V]"
        },
        {
          name: "Fotoeffektning qizil chegarasi (chegaraviy to'lqin uzunligi)",
          author: "Stoletov va Eynshteyn tadqiqotlari",
          formula: "\\nu_0 = \\frac{A_{chiq}}{h} \\quad \\Leftrightarrow \\quad \\lambda_{max} = \\frac{h \\cdot c}{A_{chiq}}",
          explanation: "Agar tushayotgan yorug'lik to'lqin uzunligi λ_max dan katta bo'lsa (ya'ni chastota ν_0 dan kichik bo'lsa), yorug'lik intensivligi qanchalik yuqori bo'lmasin, fotoeffekt umuman yuz bermaydi."
        },
        {
          name: "Stoletovning 1-qonuni (Fototok kuchi)",
          author: "Aleksandr Stoletov (1888)",
          formula: "I_{to'yinish} \\sim \\Phi \\quad (\\text{Yorug'lik oqimi})",
          explanation: "To'yinish fototoki katodga vaqt birligi ichida tushayotgan fotonlar soniga (yorug'lik intensivligiga) to'g'ri proportsionaldir."
        }
      ],
      equipment: [
        "Vakuumli fotoselement (katod va anod)",
        "Monoxromatik yorug'lik manbai (spektr: ultrabinafshadan qizilgacha 200 nm - 800 nm)",
        "Turli katod metallari (Seziy: 2.14 eV, Natriy: 2.28 eV, Rux: 4.3 eV, Mis: 4.7 eV, Platina: 5.65 eV)",
        "O'zgaruvchan kuchlanish manbai va voltmetr",
        "Sezgir mikroampermetr (tok datchigi)"
      ],
      instructions: [
        "1. Katod metallini tanlang (masalan, Seziy Cs yoki Natriy Na).",
        "2. Yorug'lik to'lqin uzunligini (λ) va yorug'lik intensivligini slayder orqali boshqaring.",
        "3. Ajralib chiqayotgan elektronlar oqimini va ampermetrdagi fototok ko'rsatkichini kuzating.",
        "4. To'lqin uzunligini asta-sekin oshirib, fototok nolga teng bo'ladigan 'qizil chegara'ni (λ_max) toping.",
        "5. Kuchlanishni teskari qutbga o'tkazing va tok to'xtaydigan to'xtatuvchi kuchlanishni (U_t) o'lchang.",
        "6. U_t ning chastotaga bog'liqlik grafigini chizib, Plank doimiysi h ni hisoblang.",
        "7. Natijalarni jadvalga qayd qiling."
      ],
      tableColumns: [
        { key: "num", label: "№" },
        { key: "metal", label: "Metall" },
        { key: "lambda", label: "To'lqin λ (nm)" },
        { key: "freq", label: "Chastota ν (10¹⁴ Gs)" },
        { key: "current", label: "Fototok I (µA)" },
        { key: "uStop", label: "To'xtatuvchi U_t (V)" },
        { key: "ekMax", label: "Ek_max (eV)" }
      ],
      quiz: [
        {
          question: "Nima uchun yorug'lik intensivligi oshirilganda uchib chiqayotgan elektronlarning maksimal kinetik energiyasi o'zgarmaydi?",
          options: [
            "Chunki bitta elektron faqat bitta foton energiyasini yutadi; kinetik energiya faqat foton chastotasiga bog'liq",
            "Chunki elektronlar massasi kamayadi",
            "Chunki metall qiziydi",
            "Chunki to'xtatuvchi kuchlanish ortadi"
          ],
          correct: 0,
          explanation: "Eynshteyn kvant nazariyasiga binoan har bir elektron bitta kvant (foton) yutadi. Intensivlik faqat fotonlar sonini oshiradi, har bir alohida foton energiyasi esa faqat chastotaga (hν) bog'liq."
        },
        {
          question: "Chiqish ishi 2.0 eV bo'lgan metallga 3.5 eV energiyali foton tushsa, elektronlarning maksimal kinetik energiyasi qancha bo'ladi?",
          options: [
            "1.5 eV",
            "5.5 eV",
            "2.0 eV",
            "0.75 eV"
          ],
          correct: 0,
          explanation: "Eynshteyn formulasiga ko'ra Ek = hν - A_chiq = 3.5 eV - 2.0 eV = 1.5 eV bo'ladi."
        },
        {
          question: "Fotoeffektning 'qizil chegarasi' nimani bildiradi?",
          options: [
            "Fotoeffekt yuz berishi mumkin bo'lgan maksimal to'lqin uzunligini (minimal chastotani)",
            "Yorug'likning qizil rangda bo'lishini",
            "Tok eng yuqori bo'lgan nuqtani",
            "Elektronlar tezligi yorug'lik tezligiga teng bo'lishini"
          ],
          correct: 0,
          explanation: "Qizil chegara foton energiyasi metallning chiqish ishiga teng bo'lgan holat (hν₀ = A_chiq). Undan past chastotada fotoeffekt mutlaqo yuz bermaydi."
        }
      ]
    },

    "nuclear-decay": {
      id: "nuclear-decay",
      sectionId: "nuclear",
      title: "Radioaktiv yemirilish qonuni va yarim yemirilish davri",
      subtitle: "Eksponentsial qonuniyat, yemirilish doimiysi, faollik va radioxronologiya",
      duration: "40 daqiqa",
      difficulty: "O'rta",
      objective: "Atom yadrolarining radioaktiv yemirilishining statistik xarakterini o'rganish, yarim yemirilish davri (T₁/₂) ning mohiyatini tushunish, eksponentsial kamayish qonunini va uglerod-14 orqali arxeologik yoshni aniqlash usulini amalda qo'llash.",
      lawsApplied: [
        {
          name: "Radioaktiv yemirilish qonuni",
          author: "Ernest Rezerford, Frederik Soddi (1902)",
          formula: "N(t) = N_0 \\cdot 2^{-\\frac{t}{T_{1/2}}} = N_0 \\cdot e^{-\\lambda t}",
          explanation: "Vaqt o'tishi bilan yemirilmay qolgan radioaktiv yadrolar soni (N) eksponentsial qonun bo'yicha kamayib boradi. Bu yerda N₀ — boshlang'ich yadrolar soni, T₁/₂ — yarim yemirilish davri, λ — yemirilish doimiysi.",
          units: "N — yadrolar soni; t, T₁/₂ — vaqt birliklari; λ = ln(2)/T₁/₂ [s⁻¹]"
        },
        {
          name: "Radioaktiv modda faolligi",
          author: "Anri Bekkerel (1896)",
          formula: "A(t) = -\\frac{dN}{dt} = \\lambda \\cdot N(t) = A_0 \\cdot 2^{-\\frac{t}{T_{1/2}}}",
          explanation: "Modda faolligi — vaqt birligi ichida sodir bo'ladigan yemirilishlar soni bo'lib, u bevosita qolgan radioaktiv yadrolar soniga proportsionaldir.",
          units: "Faollik A — Bekkerel [Bq] (1 Bq = 1 yemirilish/sekund) yoki Kyuri [Ci]"
        }
      ],
      equipment: [
        "Radioaktiv izotoplar konteyneri: C-14 (T=5730 yil), I-131 (T=8 kun), Po-218 (T=3.1 min), Ra-226 (T=1600 yil), U-238 (T=4.5 mlrd yil), Simulyatsiya uchun N₀=500 yadroli model",
        "Geyger-Myuller hisoblagichi (ovozli chertish effekti bilan)",
        "Sekundomer va eksponentsial so'nish grafik displeyi",
        "Qadimgi artefakt namunalari (Uglerodli datalash / Radiocarbon dating simulyatori)"
      ],
      instructions: [
        "1. Izotop turini tanlang yoki o'zboshimcha yarim yemirilish davrini (T₁/₂) sozlang.",
        "2. Boshlang'ich yadrolar sonini (N₀) o'rnating (masalan, 400 yoki 1000 ta yadro).",
        "3. 'Simulyatsiyani boshlash' tugmasini bosing va yadrolar tasodifiy ravishda yemirilayotganini (rangi o'zgarishini) kuzating.",
        "4. T = T₁/₂ vaqt o'tganda yadrolarning taxminan yarmi (50%), 2T₁/₂ da 25%, 3T₁/₂ da 12.5% qolganini grafikda tekshiring.",
        "5. Geyger hisoblagichi datchigi chertishlar soni vaqt o'tishi bilan kamayib borishini eshiting/kuzating.",
        "6. 'Artefakt yoshini aniqlash' rejimiga o'tib, qolgan C-14 miqdoriga qarab qadimiy eksponat yoshini hisoblab ko'ring."
      ],
      tableColumns: [
        { key: "num", label: "№" },
        { key: "time", label: "O'tgan vaqt t" },
        { key: "nRemaining", label: "Qolgan yadrolar N" },
        { key: "nDecayed", label: "Yemirildi ΔN" },
        { key: "percent", label: "Qolgan foiz (%)" },
        { key: "theoN", label: "Nazariy N(t)" }
      ],
      quiz: [
        {
          question: "Boshlang'ich 1000 ta radioaktiv yadrodan 2 ta yarim yemirilish davri (2·T₁/₂) o'tgandan keyin qancha yemirilmagan yadro qoladi?",
          options: [
            "250 ta",
            "500 ta",
            "125 ta",
            "0 ta"
          ],
          correct: 0,
          explanation: "1-davrda 1000/2 = 500 ta qoladi. 2-davr o'tgach, 500/2 = 250 ta qoladi (boshlang'ich miqdorning 25% qismi)."
        },
        {
          question: "Uglerod-14 (C-14) ning yarim yemirilish davri 5730 yil. Qazilma suyakdagi C-14 miqdori tirik organizmdagiga nisbatan 4 marta kam bo'lsa, suyakning yoshi qancha?",
          options: [
            "11 460 yil",
            "5 730 yil",
            "2 865 yil",
            "22 920 yil"
          ],
          correct: 0,
          explanation: "Miqdor 4 marta kamayishi uchun 2 ta yarim yemirilish davri o'tishi kerak: t = 2 · 5730 = 11 460 yil."
        },
        {
          question: "Radioaktiv yemirilish qonunining statistik xususiyati nimani anglatadi?",
          options: [
            "Aynan qaysi bitta aniq yadro qachon yemirilishini oldindan aytib bo'lmaydi, qonun faqat ko'p sonli yadrolar ansambli uchun o'rinli",
            "Barcha yadrolar bir vaqtda birdaniga yemiriladi",
            "Yemirilish tashqi bosim va haroratga kuchli bog'liq",
            "Yemirilish vaqt o'tishi bilan tezlashadi"
          ],
          correct: 0,
          explanation: "Radioaktiv yemirilish mutlaqo tasodifiy kvant hodisasi bo'lib, har bir yadro uchun vaqt birligidagi yemirilish ehtimoli o'zgarmasdir. Qonun faqat katta statistik to'plamlar uchun amal qiladi."
        }
      ]
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PHYSICS_DATA;
}
