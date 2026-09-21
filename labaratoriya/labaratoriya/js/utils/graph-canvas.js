/**
 * Virtual Fizika Laboratoriyasi - Grafik Chizish Moduli (Canvas 2D)
 * Tashqi kutubxonalarga bog'lanmagan, 60fps tezlikdagi grafik chizuvchi
 */

class PhysicsGraph {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.title = options.title || "";
    this.xLabel = options.xLabel || "x";
    this.yLabel = options.yLabel || "y";
    this.xUnit = options.xUnit || "";
    this.yUnit = options.yUnit || "";

    this.minX = options.minX !== undefined ? options.minX : 0;
    this.maxX = options.maxX !== undefined ? options.maxX : 10;
    this.minY = options.minY !== undefined ? options.minY : -10;
    this.maxY = options.maxY !== undefined ? options.maxY : 10;
    this.autoScale = options.autoScale !== undefined ? options.autoScale : false;

    this.series = []; // { name: "Series 1", color: "#3b82f6", data: [{x, y}], fill: false }
    this.padding = { top: 35, right: 30, bottom: 40, left: 55 };

    this.initCanvasSize();
    window.addEventListener('resize', () => this.handleResize());
  }

  initCanvasSize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || this.canvas.width || 400;
    this.height = rect.height || this.canvas.height || 220;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.draw();
  }

  handleResize() {
    this.initCanvasSize();
  }

  setRanges(minX, maxX, minY, maxY) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }

  addSeries(name, color, fill = false) {
    const s = { name, color, data: [], fill };
    this.series.push(s);
    return this.series.length - 1;
  }

  clearData() {
    this.series.forEach(s => s.data = []);
    this.draw();
  }

  addDataPoint(seriesIndex, x, y, maxPoints = 500) {
    if (!this.series[seriesIndex]) return;
    const s = this.series[seriesIndex];
    s.data.push({ x, y });
    if (s.data.length > maxPoints) {
      s.data.shift();
    }

    if (this.autoScale) {
      if (x > this.maxX) this.maxX = x * 1.1;
      if (y > this.maxY) this.maxY = y * 1.1;
      if (y < this.minY) this.minY = y * 1.1;
    }

    this.draw();
  }

  setSeriesData(seriesIndex, points) {
    if (!this.series[seriesIndex]) return;
    this.series[seriesIndex].data = points;
    this.draw();
  }

  mapX(x) {
    const plotWidth = this.width - this.padding.left - this.padding.right;
    const rangeX = this.maxX - this.minX || 1;
    return this.padding.left + ((x - this.minX) / rangeX) * plotWidth;
  }

  mapY(y) {
    const plotHeight = this.height - this.padding.top - this.padding.bottom;
    const rangeY = this.maxY - this.minY || 1;
    return this.height - this.padding.bottom - ((y - this.minY) / rangeY) * plotHeight;
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const pad = this.padding;

    ctx.clearRect(0, 0, w, h);

    // Fon
    ctx.fillStyle = '#0f172a'; // To'q fon
    ctx.fillRect(0, 0, w, h);

    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // To'r (Grid)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    const xSteps = 5;
    for (let i = 0; i <= xSteps; i++) {
      const gx = pad.left + (plotW / xSteps) * i;
      ctx.beginPath();
      ctx.moveTo(gx, pad.top);
      ctx.lineTo(gx, h - pad.bottom);
      ctx.stroke();

      // X o'qi qiymatlari
      const valX = this.minX + ((this.maxX - this.minX) / xSteps) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(valX.toFixed(valX >= 10 ? 0 : 1), gx, h - pad.bottom + 15);
    }

    const ySteps = 4;
    for (let j = 0; j <= ySteps; j++) {
      const gy = pad.top + (plotH / ySteps) * j;
      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(w - pad.right, gy);
      ctx.stroke();

      // Y o'qi qiymatlari
      const valY = this.maxY - ((this.maxY - this.minY) / ySteps) * j;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(valY.toFixed(Math.abs(valY) >= 10 ? 0 : 1), pad.left - 8, gy + 3);
    }

    // Nol chizig'i (agar ko'rinadigan bo'lsa)
    if (this.minY < 0 && this.maxY > 0) {
      const zeroY = this.mapY(0);
      ctx.strokeStyle = '#475569';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.left, zeroY);
      ctx.lineTo(w - pad.right, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Grafik o'qlari
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.lineTo(w - pad.right, h - pad.bottom);
    ctx.stroke();

    // Sarlavha va O'q nomlari
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.title}`, pad.left, 18);

    ctx.textAlign = 'right';
    ctx.fillText(`${this.xLabel} ${this.xUnit ? `(${this.xUnit})` : ''}`, w - pad.right, h - 8);

    ctx.save();
    ctx.translate(14, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(`${this.yLabel} ${this.yUnit ? `(${this.yUnit})` : ''}`, 0, 0);
    ctx.restore();

    // Ma'lumotlar chiziqlarini chizish
    this.series.forEach(s => {
      if (!s.data || s.data.length === 0) return;

      ctx.strokeStyle = s.color || '#38bdf8';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      s.data.forEach((p, idx) => {
        const px = this.mapX(p.x);
        const py = this.mapY(p.y);
        if (idx === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      });
      ctx.stroke();

      // Agar soha to'ldirilishi kerak bo'lsa
      if (s.fill && s.data.length > 1) {
        ctx.lineTo(this.mapX(s.data[s.data.length - 1].x), this.mapY(0));
        ctx.lineTo(this.mapX(s.data[0].x), this.mapY(0));
        ctx.closePath();
        ctx.fillStyle = s.color.replace(')', ', 0.15)').replace('rgb', 'rgba');
        ctx.fill();
      }

      // Oxirgi nuqtani belgilash
      if (s.data.length > 0) {
        const last = s.data[s.data.length - 1];
        const lx = this.mapX(last.x);
        const ly = this.mapY(last.y);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Legenda (agar bir nechta bo'lsa)
    if (this.series.length > 1) {
      let legX = pad.left + 150;
      this.series.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.fillRect(legX, 10, 10, 10);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(s.name, legX + 14, 18);
        legX += ctx.measureText(s.name).width + 30;
      });
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhysicsGraph;
}
