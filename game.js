// === GLOBAL GAME STATE ===
let gameState = {
  mass: 0,
  darkEnergy: 0,
  upgrades: {},
  availableUpgrades: [],
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

  fetch('data/upgrades.json')
    .then(response => response.json())
    .then(data => {
      gameState.availableUpgrades = data;
      renderUpgrades();
    });

  startTutorial();
  setupPrestigeButton();
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
      const multiplier =
        1 +
        (getUpgradeLevel('density') * 0.1) +
        (gameState.darkEnergy * 0.05);
      gameState.mass += MASS_PER_CLICK * multiplier;
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

    gameState.particles = gameState.particles.filter(p => {
      p.move();
      if (p.checkCollision()) return false;
      p.draw();
      return true;
    });
  }, 1000 / 60);
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

// === UI ===
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

// === PASSIVE PARTICLE SPAWN ===
function spawnPassiveParticle() {
  let spawnRate = 0.02 + getUpgradeLevel('magnetism') * 0.002;
  if (Math.random() < spawnRate) {
    const angle = Math.random() * Math.PI * 2;
    const radius = CANVAS.width / 2 + 80;
    const x = CENTER.x + Math.cos(angle) * radius;
    const y = CENTER.y + Math.sin(angle) * radius;
    const speedMod = 180 - getUpgradeLevel('spin') * 5;
    const dx = (CENTER.x - x) / speedMod;
    const dy = (CENTER.y - y) / speedMod;
    gameState.particles.push(new Particle(x, y, dx, dy, true));
  }
}

// === UPGRADE SYSTEM ===
function renderUpgrades() {
  const list = document.getElementById('upgrade-list');
  list.innerHTML = '';

  gameState.availableUpgrades.forEach(upg => {
    const level = getUpgradeLevel(upg.id);
    const cost = calculateUpgradeCost(upg, level);

    const li = document.createElement('li');
    li.className = 'upgrade-item';
    li.dataset.id = upg.id;

    li.innerHTML = `
      <div class="upgrade-name">${upg.name} (Lv ${level})</div>
      <div class="upgrade-cost">Cost: ${formatMass(cost)}</div>
      <div class="upgrade-desc">${upg.description}</div>
    `;

    if (gameState.mass < cost || level >= upg.maxLevel) {
      li.style.opacity = 0.5;
    } else {
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => purchaseUpgrade(upg));
    }

    list.appendChild(li);
  });
}

function purchaseUpgrade(upg) {
  const level = getUpgradeLevel(upg.id);
  const cost = calculateUpgradeCost(upg, level);
  if (gameState.mass >= cost && level < upg.maxLevel) {
    gameState.mass -= cost;
    gameState.upgrades[upg.id] = level + 1;
    updateMassDisplay();
    renderUpgrades();
    saveGame();
  }
}

function calculateUpgradeCost(upg, level) {
  return Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, level));
}

function getUpgradeLevel(id) {
  return gameState.upgrades[id] || 0;
}

// === SAVE SYSTEM ===
function loadGame() {
  const save = JSON.parse(localStorage.getItem('collidle-save'));
  if (save) {
    Object.assign(gameState, save);
  }

  handleOfflineProgress();
  updateMassDisplay();
}

function saveGame() {
  localStorage.setItem('collidle-save', JSON.stringify(gameState));
}

window.saveGame = saveGame;
