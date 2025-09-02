// Optional extras: create a few extra stars and add subtle parallax on mouse
const stars = document.getElementById('stars');

function addStar(x, y, size, opacity) {
  const s = document.createElement('span');
  s.style.position = 'absolute';
  s.style.left = x + '%';
  s.style.top = y + '%';
  s.style.width = size + 'px';
  s.style.height = size + 'px';
  s.style.background = `rgba(255,255,255,${opacity})`;
  s.style.borderRadius = '50%';
  s.style.boxShadow = `0 0 ${size * 2}px rgba(255,255,255,${opacity})`;
  s.style.filter = 'blur(0.2px)';
  stars.appendChild(s);
}

for (let i = 0; i < 40; i++) {
  addStar(Math.random() * 100, Math.random() * 100, Math.random() * 2 + 1, Math.random() * 0.7 + 0.2);
}

// Parallax effect
document.addEventListener('mousemove', (e) => {
  const { innerWidth: w, innerHeight: h } = window;
  const x = (e.clientX / w - 0.5) * 8; // -4 to 4
  const y = (e.clientY / h - 0.5) * 6; // -3 to 3
  stars.style.transform = `translate(${x}px, ${y}px)`;
});

// Speed boost on hover (fun!)
const walker = document.querySelector('.walker');
let fast = false;

walker.addEventListener('mouseenter', () => {
  if (fast) return;
  fast = true;
  walker.style.animationDuration = '9s';
  setTimeout(() => {
    walker.style.animationDuration = '16s';
    fast = false;
  }, 2000);
});
