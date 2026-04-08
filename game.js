let score = 0;
let pointsPerClick = 1;

let upgrades = [
  {
    name: "Plus 1",
    id: 1,
    cost: 5,
    bonus: 3,
  },
  {
    name: "Plus 2",
    id: 2,
    cost: 7,
    bonus: 4,
  },
  {
    name: "Plus 3",
    id: 3,
    cost: 9,
    bonus: 5,
  },
];

const updateDisplay = () => {
  document.getElementById("score-display").textContent = "Score: " + score;
  document.getElementById("rate-display").textContent =
    "Points per click: " + pointsPerClick;
  checkCost();
};

document.getElementById("click-btn").addEventListener("click", () => {
  score += pointsPerClick;
  updateDisplay();
  playSound();
});

const playSound = () => {
  let audio = new Audio("quack.mp3");
  audio.play();
};

const renderUpgrades = () => {
  const upgradeContainer = document.getElementById("upgrades");
  upgradeContainer.innerHTML = ""; // Clear existing to prevent duplicates

  upgrades.forEach((upgrade) => {
    // Create Card
    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "upgrade-card";

    // Create Info Section (Left side)
    const infoDiv = document.createElement("div");
    infoDiv.className = "upgrade-info";

    const name = document.createElement("p");
    name.className = "upgrade-name";
    name.textContent = upgrade.name;

    const stats = document.createElement("p");
    stats.className = "upgrade-stats";
    stats.textContent = `Cost: ${upgrade.cost} | Bonus: +${upgrade.bonus}`;

    infoDiv.appendChild(name);
    infoDiv.appendChild(stats);

    // Create Button (Right side)
    const buyButton = document.createElement("button");
    buyButton.textContent = "BUY";
    buyButton.className = "buy-btn";
    buyButton.id = `upgrade-${upgrade.id}`;
    buyButton.onclick = () => buyUpgrades(upgrade.id);

    // Assemble
    upgradeDiv.appendChild(infoDiv);
    upgradeDiv.appendChild(buyButton);
    upgradeContainer.appendChild(upgradeDiv);
  });
};

renderUpgrades();

const buyUpgrades = (id) => {
  for (let i = 0; i < upgrades.length; i++) {
    if (upgrades[i].id === id) {
      if (score >= upgrades[i].cost) {
        score -= upgrades[i].cost;
        pointsPerClick += upgrades[i].bonus;
        updateDisplay();
        return;
      }
    }
  }
};

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
