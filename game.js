// === GLOBAL GAME STATE ===
let gameState = {
  mass: 0, // in attograms
  darkEnergy: 0,
  upgrades: {},
  particles: [],
  lastUpdate: Date.now()
};

const MASS_PER_CLICK = 10;
const CANVAS = document.getElementById('space-canvas');
const CTX = CANVAS.getContext('2d');
const CENTER = { x: CANVAS.width / 2, y: CANVAS.height / 2 };

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  updateMassDisplay();
  setupUI();
  startGameLoop();
});

// === PARTICLE CLASS ===
class Particle {
  constructor(x, y, dx, dy, passive = false) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = 4;
    this.passive = passive;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    CTX.beginPath();
    CTX.fillStyle = this.passive ? '#888' : '#00d8ff';
    CTX.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    CTX.fill();
  }

  checkCollision() {
    const dist = Math.hypot(this.x - CENTER.x, this.y - CENTER.y);
    if (dist < 15) {
      gameState.mass += MASS_PER_CLICK; // Later: scale by upgrades
      updateMassDisplay();
      return true;
    }
    return false;
  }
}

// === GAME LOOP ===
function startGameLoop() {
  setInterval(() => {
    const now = Date.now();
    const delta = now - gameState.lastUpdate;
    gameState.lastUpdate = now;

    clearCanvas();
    drawCore();
    spawnPassiveParticle();

    // Update and draw all particles
    gameState.particles = gameState.particles.filter(p => {
      p.move();
      if (p.checkCollision()) return false;
      p.draw();
      return true;
    });

  }, 1000 / 60); // 60 FPS
}

function clearCanvas() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

function drawCore() {
  CTX.beginPath();
  CTX.fillStyle = '#ffffff';
  CTX.arc(CENTER.x, CENTER.y, 15, 0, Math.PI * 2);
  CTX.fill();
}

// === UI INTERACTION ===
function setupUI() {
  document.getElementById('fire-btn').addEventListener('click', () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = CANVAS.width / 2 + 50;
    const x = CENTER.x + Math.cos(angle) * radius;
    const y = CENTER.y + Math.sin(angle) * radius;
    const dx = (CENTER.x - x) / 60;
    const dy = (CENTER.y - y) / 60;
    gameState.particles.push(new Particle(x, y, dx, dy));
  });
}

function updateMassDisplay() {
  document.getElementById('mass-display').textContent =
    formatMass(gameState.mass);
  document.getElementById('dark-energy-display').textContent =
    gameState.darkEnergy;
}

// === PASSIVE PARTICLE GENERATION ===
function spawnPassiveParticle() {
  if (Math.random() < 0.02) { // 2% chance per frame (~1/sec)
    const angle = Math.random() * Math.PI * 2;
    const radius = CANVAS.width / 2 + 80;
    const x = CENTER.x + Math.cos(angle) * radius;
    const y = CENTER.y + Math.sin(angle) * radius;
    const dx = (CENTER.x - x) / 180;
    const dy = (CENTER.y - y) / 180;
    gameState.particles.push(new Particle(x, y, dx, dy, true));
  }
}

// === SAVE/LOAD (to be completed in autosave.js) ===
function loadGame() {
  const save = JSON.parse(localStorage.getItem('collidle-save'));
  if (save) {
    Object.assign(gameState, save);
  }
}

function saveGame() {
  localStorage.setItem('collidle-save', JSON.stringify(gameState));
}

// Manual save for debug or future use
window.saveGame = saveGame;
