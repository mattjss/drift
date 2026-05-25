const grid   = document.getElementById('grid');
const cursor = document.getElementById('cursor');

const COLS = 24; // 24×24 = 576 cells

// ── Audio ────────────────────────────────────────────────────
let AC;
function ac() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

// Pitch mapped to x-position in grid (left = low, right = high)
// Range: 300Hz – 1200Hz
function playHover(xFraction) {
  try {
    const a  = ac();
    const t  = a.currentTime;
    const freq = 300 * Math.pow(4, xFraction); // exponential 300→1200Hz
    const o  = a.createOscillator();
    const g  = a.createGain();
    o.connect(g); g.connect(a.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.75, t + 0.06);
    g.gain.setValueAtTime(0.045, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    o.start(t); o.stop(t + 0.08);
  } catch (_) {}
}

// ── Build grid ───────────────────────────────────────────────
function build() {
  grid.innerHTML = '';
  grid.style.setProperty('--cols', COLS);

  const frag = document.createDocumentFragment();

  for (let row = 0; row < COLS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      // Random scale destination per cell (2x – 4x)
      const s = (2.0 + Math.random() * 2.0).toFixed(2);
      // Varied resting opacity — gives the grid subtle texture
      const o = (0.06 + Math.random() * 0.09).toFixed(3);

      cell.style.cssText = `--s:${s};--o:${o}`;

      // Sound pitch from column position
      const xFrac = col / (COLS - 1);
      cell.addEventListener('pointerenter', () => playHover(xFrac), { passive: true });

      frag.appendChild(cell);
    }
  }

  grid.appendChild(frag);
}

// ── Cursor ───────────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

build();
