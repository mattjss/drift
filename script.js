const grid = document.getElementById('grid');
const cursor = document.getElementById('cursor');

const CELL = 28; // px — grid cell size

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

      // Positional color gradient: blue (210°) → purple/pink (310°)
      // Slight per-cell noise so it doesn't look perfectly flat
      const baseHue = 210 + (col / cols) * 90 + (row / rows) * 15;
      const hue = (baseHue + (Math.random() * 16 - 8)).toFixed(1);

      // Random rotation destination (degrees)
      const r = (Math.random() * 360).toFixed(1);

      // Faint, varied resting opacity — gives slight texture at rest
      const o = (Math.random() * 0.07 + 0.04).toFixed(3);

      cell.style.cssText = `--r:${r};--hue:${hue};--o:${o}`;
      frag.appendChild(cell);
    }
  }

  grid.appendChild(frag);
}

// Custom cursor position
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
});

build();
window.addEventListener('resize', build);
