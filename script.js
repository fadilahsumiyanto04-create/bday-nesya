// ============ background stars (canvas) ============
const bg = document.getElementById('bg');
const bgCtx = bg.getContext('2d');
let stars = [];

function resizeBg() {
  bg.width = window.innerWidth;
  bg.height = window.innerHeight;
  const count = Math.floor((bg.width * bg.height) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * bg.width,
    y: Math.random() * bg.height,
    r: Math.random() * 1.4 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.015 + 0.005
  }));
}
window.addEventListener('resize', resizeBg);
resizeBg();

function drawStars(t) {
  bgCtx.clearRect(0, 0, bg.width, bg.height);
  stars.forEach(s => {
    const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * s.speed + s.phase));
    bgCtx.beginPath();
    bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255,255,255,${twinkle * 0.85})`;
    bgCtx.fill();
  });
  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

// ============ floating ambient hearts ============
const heartsWrap = document.getElementById('floatingHearts');
function spawnHeart() {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > 0.5 ? '♥' : '♡';
  const size = Math.random() * 14 + 10;
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = size + 'px';
  heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
  heart.style.animationDuration = (Math.random() * 6 + 8) + 's';
  heartsWrap.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}
setInterval(spawnHeart, 1800);
spawnHeart();

// ============ music toggle ============
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let musicPlaying = false;
musicToggle.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
  } else {
    bgMusic.play().catch(() => {});
    musicToggle.classList.add('playing');
  }
  musicPlaying = !musicPlaying;
});

// ============ act navigation ============
const acts = {
  hero: document.getElementById('actHero'),
  letter: document.getElementById('actLetter'),
  gallery: document.getElementById('actGallery'),
  cake: document.getElementById('actCake'),
  closing: document.getElementById('actClosing')
};

function showAct(name) {
  Object.values(acts).forEach(a => a.classList.add('hidden'));
  acts[name].classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ envelope -> letter ============
const envelopeBtn = document.getElementById('envelopeBtn');
const letterBody = document.getElementById('letterBody');
const toGalleryBtn = document.getElementById('toGallery');

const letterText = `Selamat ulang tahun, Nesya sayang.

Di hari spesial ini aku cuma mau bilang makasih udah jadi kamu yang selalu ada, yang bikin hari-hariku lebih berwarna. Setiap senyum, tawa, bahkan drama kecil kita, semuanya jadi kenangan yang aku syukurin banget.

Semoga di umur yang baru ini semua hal baik dateng ke hidup kamu, kesehatan, rezeki, dan kebahagiaan yang gak putus-putus. Semoga cita-cita kamu satu-satu kewujud, dan semoga aku selalu bisa jadi orang yang berdiri di samping kamu buat liat itu semua terjadi.

Makasih udah sabar sama aku, makasih udah mau sayang sama aku.
I love you so much, happy birthday, sayangku.`;

let typingDone = false;

function typeLetter() {
  toGalleryBtn.disabled = true;
  letterBody.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  let i = 0;
  const speed = 22;

  function step() {
    if (i < letterText.length) {
      letterBody.textContent += letterText[i];
      i++;
      setTimeout(step, speed);
    } else {
      typingDone = true;
      toGalleryBtn.disabled = false;
    }
  }
  step();
}

envelopeBtn.addEventListener('click', () => {
  envelopeBtn.classList.add('opened');
  envelopeBtn.disabled = true;
  setTimeout(() => {
    showAct('letter');
    typeLetter();
  }, 650);
});

toGalleryBtn.addEventListener('click', () => {
  if (!typingDone) {
    // skip typing animation if clicked mid-type
    letterBody.textContent = letterText;
    typingDone = true;
    return;
  }
  showAct('gallery');
});

// ============ gallery lightbox ============
const polaroids = document.querySelectorAll('.polaroid');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Tutup">✕</button>
  <img src="" alt="">
  <p class="lightbox-caption"></p>
`;
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');

polaroids.forEach(p => {
  p.addEventListener('click', () => {
    const img = p.querySelector('img');
    const caption = p.querySelector('figcaption');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
  });
});
function closeLightbox() { lightbox.classList.remove('open'); }
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.getElementById('toCake').addEventListener('click', () => showAct('cake'));

// ============ cake blow ============
const cakeBtn = document.getElementById('cakeBtn');
const cakeCaption = document.getElementById('cakeCaption');
let blown = false;

cakeBtn.addEventListener('click', () => {
  if (blown) return;
  blown = true;
  cakeBtn.classList.add('blown');
  cakeCaption.textContent = 'semoga semua harapanmu terkabul 🤍';
  launchConfetti();
  setTimeout(() => showAct('closing'), 1600);
});

document.getElementById('replayBtn').addEventListener('click', () => {
  envelopeBtn.classList.remove('opened');
  envelopeBtn.disabled = false;
  cakeBtn.classList.remove('blown');
  blown = false;
  typingDone = false;
  letterBody.textContent = '';
  showAct('hero');
});

// ============ confetti ============
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const colors = ['#ff8fab', '#ffc2d1', '#f2c879', '#b79fd1', '#fbf3ec'];
let particles = [];

function launchConfetti() {
  for (let i = 0; i < 140; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2.4,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 13,
      vy: Math.random() * -11 - 4,
      gravity: 0.35,
      life: 110
    });
  }
  if (!animating) animate();
}

let animating = false;
function animate() {
  animating = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.r, p.r);
  });
  particles = particles.filter(p => p.life > 0 && p.y < canvas.height);
  if (particles.length > 0) {
    requestAnimationFrame(animate);
  } else {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
