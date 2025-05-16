// === PRESTIGE (Collapse) SYSTEM ===

const PRESTIGE_THRESHOLD = 1e15; // 1 Petagram (adjust for balance)

function canPrestige() {
  return gameState.mass >= PRESTIGE_THRESHOLD;
}

function openPrestigeModal() {
  const modal = document.createElement('div');
  modal.className = 'prestige-modal';

  modal.innerHTML = `
    <div class="modal-content">
      <h2>Collapse Your Atom?</h2>
      <p>By collapsing your atom, you’ll reset all progress but gain <strong>Dark Energy</strong>, which boosts your mass gain permanently.</p>
      <p>You’ll earn <strong>${calculateDarkEnergyGain()} Dark Energy</strong>.</p>
      <button id="confirm-prestige">Collapse</button>
      <button id="cancel-prestige">Cancel</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('confirm-prestige').onclick = () => {
    performPrestige();
    modal.remove();
  };

  document.getElementById('cancel-prestige').onclick = () => {
    modal.remove();
  };
}

function calculateDarkEnergyGain() {
  return Math.floor(Math.sqrt(gameState.mass / PRESTIGE_THRESHOLD));
}

function performPrestige() {
  const gained = calculateDarkEnergyGain();
  gameState.darkEnergy += gained;
  gameState.mass = 0;
  gameState.upgrades = {};
  gameState.particles = [];

  updateMassDisplay();
  renderUpgrades();
  saveGame();
}

// Hook prestige button (or trigger)
function setupPrestigeButton() {
  const footer = document.getElementById('footer');
  const btn = document.createElement('button');
  btn.textContent = 'Collapse';
  btn.id = 'prestige-btn';
  btn.onclick = () => {
    if (canPrestige()) openPrestigeModal();
    else alert('Not enough mass to collapse yet.');
  };
  footer.appendChild(btn);
}

window.setupPrestigeButton = setupPrestigeButton;
