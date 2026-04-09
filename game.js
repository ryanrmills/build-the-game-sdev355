let score = 0;
let pointsPerClick = 1;

let upgrades = [
  {
    name: "Plus 1",
    id: 1,
    cost: 5,
    bonus: 3,
    purchases: 0,
  },
  {
    name: "Plus 2",
    id: 2,
    cost: 7,
    bonus: 4,
    purchases: 0,
  },
  {
    name: "Plus 3",
    id: 3,
    cost: 9,
    bonus: 5,
    purchases: 0,
  },
];

const COST_SCALING_FACTOR = 1.45;
const COST_SCALING_FLAT = 3;
const MAX_PREMIUM_TIER = 5;

const clickButton = document.getElementById("click-btn");
const particleLayer = document.getElementById("duck-particles");

const updateDisplay = () => {
  document.getElementById("score-display").textContent = "Score: " + score;
  document.getElementById("rate-display").textContent =
    "Points per click: " + pointsPerClick;
  checkCost();
};

const getUpgradeTier = (upgrade) =>
  String(Math.min(MAX_PREMIUM_TIER, upgrade.purchases));

const getUpgradeCopy = (upgrade) => {
  const level = upgrade.purchases + 1;
  return `${upgrade.name} Lv.${level} Cost: ${upgrade.cost} Bonus: +${upgrade.bonus} Purchased: ${upgrade.purchases}`;
};

const animateDuckClick = () => {
  clickButton.classList.remove("duck-jump");
  void clickButton.offsetWidth;
  clickButton.classList.add("duck-jump");
};

const spawnDuckParticles = () => {
  const buttonRect = clickButton.getBoundingClientRect();
  const layerRect = particleLayer.getBoundingClientRect();
  const originX = buttonRect.left + buttonRect.width / 2 - layerRect.left;
  const originY = buttonRect.top + buttonRect.height / 2 - layerRect.top;

  const burstCount = 12;

  for (let i = 0; i < burstCount; i++) {
    const duckParticle = document.createElement("img");
    duckParticle.src = "assets/babyduck.png";
    duckParticle.alt = "";
    duckParticle.className = "duck-particle";

    const angle = Math.random() * Math.PI * 2;
    const distance = 65 + Math.random() * 125;
    const driftX = Math.cos(angle) * distance;
    const driftY = Math.sin(angle) * distance - 18;
    const spin = Math.floor(Math.random() * 180 - 90);
    const size = 0.2 + Math.random() * 0.26;
    const duration = Math.floor(550 + Math.random() * 350);

    duckParticle.style.left = `${originX}px`;
    duckParticle.style.top = `${originY}px`;
    duckParticle.style.setProperty("--dx", `${driftX}px`);
    duckParticle.style.setProperty("--dy", `${driftY}px`);
    duckParticle.style.setProperty("--spin", `${spin}deg`);
    duckParticle.style.setProperty("--start-scale", `${size}`);
    duckParticle.style.animationDuration = `${duration}ms`;

    duckParticle.addEventListener("animationend", () => {
      duckParticle.remove();
    });

    particleLayer.appendChild(duckParticle);
  }
};

clickButton.addEventListener("click", () => {
  score += pointsPerClick;
  animateDuckClick();
  spawnDuckParticles();
  updateDisplay();
});

const renderUpgrades = () => {
  upgrades.forEach((upgrade) => {
    const upgradeDiv = document.createElement("div");
    const buyButton = document.createElement("button");

    upgradeDiv.setAttribute("id", `upgrade-item-${upgrade.id}`);
    upgradeDiv.className = "upgrade-item";
    upgradeDiv.dataset.tier = getUpgradeTier(upgrade);

    buyButton.textContent = "Buy";
    buyButton.className = "upgrade-buy";
    buyButton.setAttribute("onclick", `buyUpgrades(${upgrade.id})`);
    buyButton.setAttribute("id", `upgrade-${upgrade.id}`);

    const name = document.createElement("p");
    name.className = "upgrade-copy";
    name.setAttribute("id", `upgrade-info-${upgrade.id}`);
    name.textContent = getUpgradeCopy(upgrade);

    upgradeDiv.appendChild(name);
    upgradeDiv.appendChild(buyButton);

    document.getElementById("upgrades").appendChild(upgradeDiv);
  });
};

const increaseUpgradeCost = (upgrade) => {
  upgrade.cost = Math.ceil(upgrade.cost * COST_SCALING_FACTOR + COST_SCALING_FLAT);
};

const updateUpgradeDisplay = (upgrade) => {
  document.getElementById(
    `upgrade-info-${upgrade.id}`
  ).textContent = getUpgradeCopy(upgrade);

  document.getElementById(`upgrade-item-${upgrade.id}`).dataset.tier =
    getUpgradeTier(upgrade);
};

renderUpgrades();

function buyUpgrades(id) {
  for (let i = 0; i < upgrades.length; i++) {
    if (upgrades[i].id === id) {
      if (score >= upgrades[i].cost) {
        score -= upgrades[i].cost;
        upgrades[i].purchases += 1;
        pointsPerClick += upgrades[i].bonus;
        increaseUpgradeCost(upgrades[i]);
        updateUpgradeDisplay(upgrades[i]);
        updateDisplay();
        return;
      }
    }
  }
}

const checkCost = () => {
  upgrades.forEach((upgrade) => {
    if (score < upgrade.cost) {
      document.getElementById(`upgrade-${upgrade.id}`).disabled = true;
    } else {
      document.getElementById(`upgrade-${upgrade.id}`).disabled = false;
    }
  });
};

checkCost();
