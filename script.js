const grid   = document.getElementById('grid');
const cursor = document.getElementById('cursor');

const CELL = 28;

// ── Audio ────────────────────────────────────────────────────
let AC;
function ac() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

function playHover(hue) {
  try {
    const a = ac();
    const t = a.currentTime;
    // Pitch derived from hue (blue → purple = 210°→310°, mapped to 600–1400Hz)
    const freq = 600 + ((hue - 210) / 100) * 800;
    const o = a.createOscillator(), g = a.createGain();
    o.connect(g); g.connect(a.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.05);
    g.gain.setValueAtTime(0.04, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
    o.start(t); o.stop(t + 0.06);
  } catch (_) {}
}

// ── Build grid ───────────────────────────────────────────────
function build() {
  grid.innerHTML = '';

  const W = window.innerWidth + 48;
  const H = window.innerHeight + 48;
  const cols = Math.ceil(W / CELL);
  const rows = Math.ceil(H / CELL);

  grid.style.setProperty('--cols', cols);
  grid.style.setProperty('--size', CELL + 'px');

  const frag = document.createDocumentFragment();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      const baseHue = 210 + (col / cols) * 90 + (row / rows) * 15;
      const hue = (baseHue + (Math.random() * 16 - 8)).toFixed(1);
      const r   = (Math.random() * 360).toFixed(1);
      const o   = (Math.random() * 0.07 + 0.04).toFixed(3);

      cell.style.cssText = `--r:${r};--hue:${hue};--o:${o}`;

      // Sound on hover (CSS :hover fires, we use pointerenter)
      cell.addEventListener('pointerenter', () => playHover(parseFloat(hue)), { passive: true });

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
window.addEventListener('resize', build);
