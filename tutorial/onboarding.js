// === COLLIDLE TUTORIAL / ONBOARDING ===

const tutorialSteps = [
  {
    id: "welcome",
    message: "Welcome to Collidle! You're a tiny atom in space...",
    anchor: "#game-space",
  },
  {
    id: "tap-fire",
    message: "Tap the blue button to launch a particle toward your core.",
    anchor: "#fire-btn",
    condition: () => gameState.mass >= 10,
  },
  {
    id: "mass-counter",
    message: "Each collision increases your mass. This is your growth and currency.",
    anchor: "#mass-display",
  },
  {
    id: "upgrade-panel",
    message: "Spend mass here to upgrade and automate your growth.",
    anchor: "#upgrade-panel",
  },
  {
    id: "good-luck",
    message: "You're ready now. Let your atom evolve. Good luck!",
    anchor: "#hud",
    end: true,
  },
];

let currentStep = 0;

function startTutorial() {
  if (localStorage.getItem("collidle-tutorial-complete")) return;

  showStep(currentStep);
}

function showStep(index) {
  const step = tutorialSteps[index];
  if (!step) return;

  const anchor = document.querySelector(step.anchor);
  if (!anchor) return;

  const box = document.createElement("div");
  box.className = "tutorial-box";
  box.innerHTML = `
    <p>${step.message}</p>
    <button id="next-tutorial">Next</button>
    <button id="skip-tutorial">Skip</button>
  `;

  document.body.appendChild(box);
  positionBox(box, anchor);

  document.getElementById("next-tutorial").onclick = () => {
    box.remove();
    if (step.end) completeTutorial();
    else waitForNextStep();
  };

  document.getElementById("skip-tutorial").onclick = () => {
    box.remove();
    completeTutorial();
  };
}

function waitForNextStep() {
  const step = tutorialSteps[++currentStep];
  if (!step) return;

  if (step.condition) {
    const interval = setInterval(() => {
      if (step.condition()) {
        clearInterval(interval);
        showStep(currentStep);
      }
    }, 500);
  } else {
    showStep(currentStep);
  }
}

function positionBox(box, anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  box.style.position = "absolute";
  box.style.left = `${rect.left + window.scrollX}px`;
  box.style.top = `${rect.bottom + 10 + window.scrollY}px`;
  box.style.zIndex = 999;
}

// Marks tutorial as complete
function completeTutorial() {
  localStorage.setItem("collidle-tutorial-complete", "true");
}

window.startTutorial = startTutorial;
