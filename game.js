// 1. Shuffle a deck without changing the original card array
function shuffleCards(cards) {
    const shuffled = [...cards];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}


// 2. Store everything needed for one game

const gameState = {
    playerDeck: shuffleCards(redCards),
    computerDeck: shuffleCards(blueCards),

    // Each player receives one complete set of five ranks.
    playerPowerDeck: shuffleCards(
        powerCards.filter(card => card.copy === 1)
    ),

    computerPowerDeck: shuffleCards(
        powerCards.filter(card => card.copy === 2)
    ),

    playerKnownPower: null,
    computerKnownPower: null,

    playerResting: [],
    playerDead: [],
    computerResting: [],
    computerDead: [],

    playerCard: null,
    computerCard: null,

    playerPowerCard: null,
    computerPowerCard: null,

    tutorialLanguage: 'en',

    firstPowerPlayer: null,
    isSuddenDeath: false,
    phase: "computer-selecting"
};

const tutorialSteps = [
    {
        en: {
            title: "The Objective",
            description:
                "Win battles and collect Combat Cards in your Resting pile. After all 15 Combat Cards have been played, the player with the most Resting Cards wins!"
        },
        ml: {
            title: "ലക്ഷ്യം (The Objective)",
            description:
                "പോരാട്ടങ്ങൾ ജയിച്ച് Combat Cards നിങ്ങളുടെ Resting pile-ൽ ശേഖരിക്കുക. 15 Combat Cards-ഉം കളിച്ചു കഴിയുമ്പോൾ, ഏറ്റവും കൂടുതൽ Resting Cards ഉള്ള കളിക്കാരൻ വിജയിക്കും!"
        }
    },
    {
        en: {
            title: "Choose Your Secret Power Card",
            description:
                "You have five Power Cards. Inspect one card and remember its rank. The computer secretly selects one too. Your selected card stays in your row until you use it."
        },
        ml: {
            title: "രഹസ്യ Power Card തിരഞ്ഞെടുക്കുക (Choose Secret Power Card)",
            description:
                "നിങ്ങളുടെ പക്കൽ അഞ്ച് Power Cards ഉണ്ട്. ഒരു കാർഡ് പരിശോധിച്ച് അതിന്റെ റാങ്ക് ഓർത്തുവെക്കുക. കമ്പ്യൂട്ടറും ഒരെണ്ണം രഹസ്യമായി തിരഞ്ഞെടുക്കും. നിങ്ങൾ തിരഞ്ഞെടുത്ത കാർഡ് ഉപയോഗിക്കുന്നതുവരെ അത് നിങ്ങളുടെ നിരയിൽ തന്നെ നിൽക്കും."
        }
    },
    {
        en: {
            title: "Start a Battle",
            description:
                "Tap your Combat Card deck. Your card and the computer's card are revealed together. Normal Combat Cards are compared by value. The higher value wins."
        },
        ml: {
            title: "പോരാട്ടം ആരംഭിക്കുക (Start a Battle)",
            description:
                "നിങ്ങളുടെ Combat Card deck-ൽ ടാപ്പ് ചെയ്യുക. നിങ്ങളുടെ കാർഡും കമ്പ്യൂട്ടറിന്റെ കാർഡും ഒന്നിച്ച് വെളിപ്പെടുത്തും. സാധാരണ Combat Cards-ന്റെ മൂല്യം താരതമ്യം ചെയ്യും. ഉയർന്ന മൂല്യമുള്ള കാർഡ് ജയിക്കും."
        }
    },
    {
        en: {
            title: "Power Attacks",
            description:
                "Lightning Cards can trigger Power Attacks. When a Power Attack happens, reveal one of your remaining Power Cards. The lower rank number is stronger. The winner collects both Combat Cards. A tied Power Attack destroys all four cards."
        },
        ml: {
            title: "Power Attacks",
            description:
                "Lightning Cards-ന് Power Attacks ആരംഭിക്കാൻ കഴിയും. ഒരു Power Attack നടക്കുമ്പോൾ, നിങ്ങളുടെ ബാക്കിയുള്ള Power Cards-ൽ ഒരെണ്ണം വെളിപ്പെടുത്തുക. കുറഞ്ഞ റാങ്ക് നമ്പറുള്ള കാർഡാണ് കൂടുതൽ ശക്തം. വിജയിക്ക് രണ്ട് Combat Cards-ഉം ലഭിക്കും. Power Attack സമനിലയിലായാൽ നാല് കാർഡുകളും നശിക്കും."
        }
    },
    {
        en: {
            title: "Remember to Call GO!",
            description:
                "When your Lightning Card has a lower value than the opponent's Normal Card, you may launch an optional Power Attack. Press GO before touching your Power Cards! Touching a Power Card without calling GO results in a penalty: the computer collects both Combat Cards."
        },
        ml: {
            title: "GO എന്ന് പറയാൻ ഓർക്കുക! (Remember to Call GO!)",
            description:
                "നിങ്ങളുടെ Lightning Card-ന്റെ മൂല്യം എതിരാളിയുടെ Normal Card-നേക്കാൾ കുറവാണെങ്കിൽ, നിങ്ങൾക്ക് വേണമെങ്കിൽ ഒരു Power Attack ആരംഭിക്കാം. Power Cards തൊടുന്നതിന് മുൻപ് GO അമർത്തുക! GO പറയാതെ Power Card തൊട്ടാൽ പിഴ ലഭിക്കും: കമ്പ്യൂട്ടർ രണ്ട് Combat Cards-ഉം കൈക്കലാക്കും."
        }
    },
    {
        en: {
            title: "Call NO!",
            description:
                "When you are eligible for an optional Power Attack and if you don't want to play a Power Attack, press “NO!” to decline. The battle will then be decided by the Combat Cards' values."
        },
        ml: {
            title: "NO പറയുക! (Call NO!)",
            description:
                "നിങ്ങൾക്ക് ഓപ്ഷണൽ ആയ ഒരു Power Attack ചെയ്യാൻ അവസരമുണ്ടായിട്ടും അത് കളിക്കാൻ താത്പര്യമില്ലെങ്കിൽ, നിരസിക്കാൻ “NO!” അമർത്തുക. തുടർന്ന് Combat Cards-ന്റെ മൂല്യങ്ങൾ വെച്ചായിരിക്കും പോരാട്ടം തീരുമാനിക്കുന്നത്."
        }
    },
    {
        en: {
            title: "Special Cards and Winning",
            description:
                "A Destructor destroys both Combat Cards. When all Combat Cards have been played, the player with more Resting Cards wins. If scores are tied, Sudden Death begins!"
        },
        ml: {
            title: "പ്രത്യേക കാർഡുകളും വിജയവും (Special Cards and Winning)",
            description:
                "ഒരു Destructor രണ്ട് Combat Cards-നെയും നശിപ്പിക്കുന്നു. എല്ലാ Combat Cards-ഉം കളിച്ചു കഴിയുമ്പോൾ, കൂടുതൽ Resting Cards ഉള്ള കളിക്കാരൻ വിജയിക്കും. സ്കോറുകൾ സമനിലയിലായാൽ, Sudden Death ആരംഭിക്കും!"
        }
    }
];


// Assign permanent positions after shuffling.
gameState.playerPowerDeck.forEach((card, index) => {
    card.position = index;
});

gameState.computerPowerDeck.forEach((card, index) => {
    card.position = index;
});

let currentTutorialStep = 0;

function showTutorialStep() {
    const step = tutorialSteps[currentTutorialStep];
    const lang = gameState.tutorialLanguage;

    document.getElementById("tutorial-title").textContent =
        step[lang].title;

    document.getElementById("tutorial-description").textContent =
        step[lang].description;

    document.getElementById("tutorial-step-count").textContent =
        `STEP ${currentTutorialStep + 1} OF ${tutorialSteps.length}`;

    document.getElementById("tutorial-progress-fill").style.width =
        `${((currentTutorialStep + 1) / tutorialSteps.length) * 100}%`;

    document.getElementById("tutorial-back-button").disabled =
        currentTutorialStep === 0;

    document.getElementById("tutorial-next-button").textContent =
        currentTutorialStep === tutorialSteps.length - 1
            ? "CONTINUE"
            : "NEXT";
}

function showTutorial() {
    currentTutorialStep = 0;

    document.getElementById("tutorial-modal")
        .classList.remove("hidden");

    showTutorialStep();
}

function closeTutorialAndStart() {
    document.getElementById("tutorial-modal")
        .classList.add("hidden");

    initializePowerCards();
}

function renderPowerRows() {

    const computerRow =
        document.getElementById("computer-power-cards");

    const playerRow =
        document.getElementById("player-power-cards");

    computerRow.innerHTML = "";
    playerRow.innerHTML = "";

    // Render five fixed positions for the computer.
    for (let i = 0; i < 5; i++) {

        const card = gameState.computerPowerDeck.find(
            card => card.position === i
        );

        const element = document.createElement("div");

        if (card) {
            element.className = "power-row-card";
            element.textContent = "POWER CARD";
            element.dataset.powerId = card.id;
        } else {
            element.className = "power-row-card empty";
        }

        computerRow.appendChild(element);
    }

    // Render five fixed positions for the player.
    for (let i = 0; i < 5; i++) {

        const card = gameState.playerPowerDeck.find(
            card => card.position === i
        );

        const element = document.createElement("div");

        if (card) {
            element.className = "power-row-card";
            element.textContent = "POWER CARD";
            element.dataset.powerId = card.id;
        } else {
            element.className = "power-row-card empty";
        }

        playerRow.appendChild(element);
    }
}


function computerSelectsKnownPower() {
    gameState.computerKnownPower =
        gameState.computerPowerDeck[
        Math.floor(
            Math.random() * gameState.computerPowerDeck.length
        )
        ];
}

function showPlayerPowerSelection() {
    const modal =
        document.getElementById("power-selection-modal");

    const container =
        document.getElementById("power-selection-cards");

    const closeButton =
        document.getElementById("power-selection-close-button");

    container.innerHTML = "";
    closeButton.disabled = true;

    gameState.playerPowerDeck.forEach(card => {
        const element = document.createElement("div");

        element.className = "power-choice-card";
        element.textContent = "POWER";

        element.addEventListener("click", () => {
            if (gameState.playerKnownPower) return;

            gameState.playerKnownPower = card;

            element.textContent =
                `#${card.rank} ${card.name}`;

            element.classList.add("revealed");

            container.querySelectorAll(".power-choice-card")
                .forEach(otherCard => {
                    if (otherCard !== element) {
                        otherCard.classList.add("disabled");
                    }
                });

            closeButton.disabled = false;
        });

        container.appendChild(element);
    });

    modal.classList.remove("hidden");
}

function initializePowerCards() {

    renderPowerRows();

    document.getElementById("game-status").textContent =
        "Computer is thinking and selecting a Power Card...";

    setTimeout(() => {
        computerSelectsKnownPower();

        document.getElementById("game-status").textContent =
            "Choose one Power Card to inspect.";

        showPlayerPowerSelection();
    }, 2500);
}


// 3. Update all deck and pile counters
function updateCounts() {
    document.getElementById("player-count").textContent =
        gameState.playerDeck.length;

    document.getElementById("computer-count").textContent =
        gameState.computerDeck.length;

    document.getElementById("player-power-count").textContent =
        gameState.playerPowerDeck.length;

    document.getElementById("computer-power-count").textContent =
        gameState.computerPowerDeck.length;

    document.getElementById("player-resting-count").textContent =
        gameState.playerResting.length;

    document.getElementById("player-dead-count").textContent =
        gameState.playerDead.length;

    document.getElementById("computer-resting-count").textContent =
        gameState.computerResting.length;

    document.getElementById("computer-dead-count").textContent =
        gameState.computerDead.length;

    renderPile("computer-resting", gameState.computerResting);
    renderPile("computer-dead", gameState.computerDead);

    renderPile("player-resting", gameState.playerResting);
    renderPile("player-dead", gameState.playerDead);
}


function findPowerCard(deck, cardId) {
    return deck.find(card => card.id === cardId);
}

function animateCardToPile(cardSlotId, pileId) {
    return new Promise(resolve => {
        const slot = document.getElementById(cardSlotId);
        const pile = document.getElementById(pileId);
        const originalCard = slot.querySelector(".game-card");

        if (!originalCard || !pile) {
            resolve();
            return;
        }

        const start = originalCard.getBoundingClientRect();
        const end = pile.getBoundingClientRect();

        const movingCard = originalCard.cloneNode(true);

        movingCard.classList.remove("reveal-animation");
        movingCard.classList.add("moving-card");

        movingCard.style.left = `${start.left}px`;
        movingCard.style.top = `${start.top}px`;
        movingCard.style.width = `${start.width}px`;
        movingCard.style.height = `${start.height}px`;

        document.body.appendChild(movingCard);

        // Trigger the starting position.
        movingCard.getBoundingClientRect();

        movingCard.style.left =
            `${end.left + end.width / 2 - start.width / 2}px`;

        movingCard.style.top =
            `${end.top + end.height / 2 - start.height / 2}px`;

        movingCard.style.width = "40px";
        movingCard.style.height = "55px";

        movingCard.addEventListener("transitionend", function handler(event) {
            if (event.propertyName !== "top") return;

            movingCard.removeEventListener("transitionend", handler);
            movingCard.remove();
            resolve();
        });
    });
}

function animateCardFromDeck(deckId, slotId) {

    return new Promise(resolve => {

        const deck = document.getElementById(deckId);
        const slot = document.getElementById(slotId);

        const originalCard = deck.querySelector(".card-back");

        if (!originalCard || !slot) {
            resolve();
            return;
        }

        const start = originalCard.getBoundingClientRect();
        const end = slot.getBoundingClientRect();

        const movingCard = originalCard.cloneNode(true);

        movingCard.classList.add("moving-deck-card");

        movingCard.style.left = `${start.left}px`;
        movingCard.style.top = `${start.top}px`;
        movingCard.style.width = `${start.width}px`;
        movingCard.style.height = `${start.height}px`;

        document.body.appendChild(movingCard);

        // Establish the starting position.
        movingCard.getBoundingClientRect();

        // Move towards the battlefield slot.
        movingCard.style.left =
            `${end.left + end.width / 2 - start.width / 2}px`;

        movingCard.style.top =
            `${end.top + end.height / 2 - start.height / 2}px`;

        let completed = false;

        function completeAnimation() {
            if (completed) return;

            completed = true;
            movingCard.remove();
            resolve();
        }

        movingCard.addEventListener("transitionend", function (event) {
            if (
                event.target === movingCard &&
                event.propertyName === "top"
            ) {
                completeAnimation();
            }
        });

        // Safety fallback in case transitionend doesn't fire.
        setTimeout(completeAnimation, 1000);
    });
}


function animatePowerCardToSlot(cardElement, slotId) {

    return new Promise(resolve => {

        const slot = document.getElementById(slotId);

        if (!cardElement || !slot) {
            resolve();
            return;
        }

        const start = cardElement.getBoundingClientRect();
        const end = slot.getBoundingClientRect();

        const movingCard = cardElement.cloneNode(true);

        movingCard.classList.add("moving-deck-card");

        movingCard.style.left = `${start.left}px`;
        movingCard.style.top = `${start.top}px`;
        movingCard.style.width = `${start.width}px`;
        movingCard.style.height = `${start.height}px`;

        document.body.appendChild(movingCard);

        movingCard.getBoundingClientRect();

        movingCard.style.left =
            `${end.left + end.width / 2 - start.width / 2}px`;

        movingCard.style.top =
            `${end.top + end.height / 2 - start.height / 2}px`;

        let completed = false;

        function completeAnimation() {
            if (completed) return;
            completed = true;
            movingCard.remove();
            resolve();
        }

        movingCard.addEventListener("transitionend", function (event) {
            if (event.propertyName === "top") {
                completeAnimation();
            }
        });

        setTimeout(completeAnimation, 1000);
    });
}




async function selectPlayerPowerCard(cardId) {

    if (gameState.phase !== "waiting-player-power") return;

    const card = findPowerCard(
        gameState.playerPowerDeck,
        cardId
    );

    if (!card) return;

    // Find the selected card in the player's row.
    const cardElement = Array.from(
        document.getElementById("player-power-cards").children
    ).find(element =>
        element.dataset.powerId === String(card.id)
    );

    gameState.phase = "player-power-moving";

    // Animate the selected card into the battlefield.
    await animatePowerCardToSlot(
        cardElement,
        "player-power-slot"
    );

    // Store and reveal the selected Power Card.
    gameState.playerPowerCard = card;

    revealPowerCard(
        card,
        document.getElementById("player-power-slot")
    );

    // Remove the used card from the available deck.
    gameState.playerPowerDeck =
        gameState.playerPowerDeck.filter(
            item => item.id !== card.id
        );

    renderPowerRows();
    updateCounts();

    // Computer thinks before responding.
    gameState.phase = "computer-thinking";

    document.getElementById("game-status").textContent =
        "Computer is thinking...";

    if (gameState.computerPowerCard) {

        // Computer already revealed its card.
        setTimeout(() => {
            resolvePowerAttack();
        }, 1000);

    } else {

        // Computer must reveal its card.
        setTimeout(() => {
            computerChoosePowerCard();
        }, 1800);
    }
}


function renderPile(containerId, cards) {
    const pile = document.getElementById(containerId);

    pile.innerHTML = "";

    cards.forEach(card => {
        const cardElement = document.createElement("div");

        cardElement.classList.add("pile-card");
        cardElement.classList.add(card.colour + "-back");

        cardElement.innerHTML = `
            <div class="card-back-pattern">
                <img src="./public/ranamgo_logo_v3.0.png" alt="Card back">
            </div>
        `;

        pile.appendChild(cardElement);
    });
}


async function computerChoosePowerCard() {

    const deck = gameState.computerPowerDeck;

    if (deck.length === 0) return;

    let chosenCard = null;

    const knownCard = gameState.computerKnownPower;

    // Use its known card if it can beat the player's card.
    if (
        knownCard &&
        deck.some(card => card.id === knownCard.id) &&
        knownCard.rank < gameState.playerPowerCard.rank
    ) {
        chosenCard = knownCard;
    } else {
        // Otherwise, choose randomly from its remaining cards.
        chosenCard = deck[
            Math.floor(Math.random() * deck.length)
        ];
    }

    // Find the selected card in the computer's row.
    const cardElement = Array.from(
        document.getElementById("computer-power-cards").children
    ).find(element =>
        element.dataset.powerId === String(chosenCard.id)
    );

    gameState.phase = "computer-power-moving";

    // Animate the computer's card to its battlefield slot.
    await animatePowerCardToSlot(
        cardElement,
        "computer-power-slot"
    );

    gameState.computerPowerCard = chosenCard;

    revealPowerCard(
        chosenCard,
        document.getElementById("computer-power-slot")
    );

    gameState.computerPowerDeck =
        deck.filter(card => card.id !== chosenCard.id);

    renderPowerRows();
    updateCounts();

    // Allow the player to see both revealed Power Cards.
    setTimeout(() => {
        resolvePowerAttack();
    }, 1000);
}





// 4. Display a revealed Combat Card
function revealCard(card, slot) {
    slot.innerHTML = "";

    const cardElement = document.createElement("div");

    cardElement.classList.add("game-card");
    cardElement.classList.add(card.colour + "-card");

    if (card.type === "destructor") {
        cardElement.innerHTML = `
            <div class="card-type">DESTRUCTOR</div>
            <div class="card-number">⚔</div>
        `;
    } else {
        cardElement.innerHTML = `
            <div class="card-number">${card.value}</div>
            <div class="card-type">${card.type.toUpperCase()}</div>
        `;
    }

    cardElement.classList.add("reveal-animation");

    slot.appendChild(cardElement);
}


// 5. Hide an empty draw deck
function hideEmptyDeck(deck, selector) {
    if (deck.length === 0) {
        document.querySelector(selector)
            .classList.add("deck-empty");
    }
}


// 6. Draw and reveal both Combat Cards
async function drawBattle() {

    if (gameState.phase !== "ready") {
        return;
    }

    if (
        gameState.playerDeck.length === 0 ||
        gameState.computerDeck.length === 0
    ) {
        document.getElementById("game-status").textContent =
            "No more Combat Cards to draw.";

        return;
    }

    gameState.phase = "dealing";

    gameState.playerCard = gameState.playerDeck.pop();
    gameState.computerCard = gameState.computerDeck.pop();

    // Update deck counts.
    updateCounts();

    // Animate both cards towards the battlefield.
    await Promise.all([
        animateCardFromDeck("player-cards", "player-slot"),
        animateCardFromDeck("computer-cards", "computer-slot")
    ]);

    // Reveal both Combat Cards after they arrive.
    revealCard(
        gameState.computerCard,
        document.getElementById("computer-slot")
    );

    revealCard(
        gameState.playerCard,
        document.getElementById("player-slot")
    );

    gameState.phase = "revealed";

    // Hide deck backs if the decks are empty.
    hideEmptyDeck(gameState.playerDeck, "#player-cards .card-back");
    hideEmptyDeck(gameState.computerDeck, "#computer-cards .card-back");

    // Resolve the battle.
    resolveBattle();
}

async function resolveBattle() {

    const player = gameState.playerCard;
    const computer = gameState.computerCard;

    // Disable GO unless the current battle allows it
    document.getElementById("go-button").disabled = true;

    // Destructor destroys both cards
    if (
        player.type === "destructor" ||
        computer.type === "destructor"
    ) {
        gameState.playerDead.push(player);
        gameState.computerDead.push(computer);

        document.getElementById("game-status").textContent =
            "Destructor! Both cards are destroyed.";

        updateCounts();

        // Let players see the Destructor battle first.
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Move both cards to their owners' Dead piles.
        await Promise.all([
            animateCardToPile("player-slot", "player-dead"),
            animateCardToPile("computer-slot", "computer-dead")
        ]);

        finishBattle();
        return;
    }

    // Normal vs Normal
    if (
        player.type === "normal" &&
        computer.type === "normal"
    ) {
        resolveByValue(player, computer);
        return;
    }

    // Lightning vs Lightning: mandatory Power Attack
    if (
        player.type === "lightning" &&
        computer.type === "lightning"
    ) {
        if (gameState.playerPowerDeck.length >= 1 && gameState.computerPowerDeck.length >= 1) {

            // Higher-valued Lightning draws first
            const firstPlayer =
                player.value > computer.value ? "player" : "computer";

            startPowerAttack(firstPlayer);
            return;
        }

        // No Power Attack available
        if (gameState.isSuddenDeath) {

            // During Sudden Death, resolve by Lightning Card value
            resolveByValue(player, computer);

        } else {

            // During the main game, both Lightning Cards go to Resting
            gameState.playerResting.push(player);
            gameState.computerResting.push(computer);

            document.getElementById("game-status").textContent =
                "No Power Attack available. Both Lightning cards rest.";

            finishBattle();
        }
        return;
    }

    // Identify the Lightning card
    const lightning =
        player.type === "lightning" ? player : computer;

    const normal =
        player.type === "normal" ? player : computer;

    // Lightning is lower: optional Power Attack
    if (lightning.value < normal.value) {

        if (gameState.playerPowerDeck.length >= 1 && gameState.computerPowerDeck.length >= 1) {

            if (player.type === "lightning") {

                document.getElementById("go-button").disabled = false;
                document.getElementById("no-button").disabled = false;

                gameState.phase = "optional-power-attack";

                document.getElementById("game-status").textContent =
                    "Your Lightning is lower. Tap GO to use a Power Attack, or skip it.";

            } else {

                // Computer chooses to use its optional Power Attack
                document.getElementById("game-status").textContent =
                    "Computer calls a Power Attack!";

                startPowerAttack("computer");
            }

            return;
        }

        // Not enough Power Cards
        resolveByValue(player, computer);
        return;
    }

    // Lightning is higher: resolve by Combat Card value
    resolveByValue(player, computer);
}


async function startPowerAttack(firstPlayer) {
    gameState.firstPowerPlayer = firstPlayer;

    if (
        gameState.playerPowerDeck.length < 1 ||
        gameState.computerPowerDeck.length < 1
    ) {
        resolveByValue(
            gameState.playerCard,
            gameState.computerCard
        );
        return;
    }

    if (firstPlayer === "player") {
        gameState.phase = "waiting-player-power";

        document.getElementById("game-status").textContent =
            "Choose your Power Card!";

        return;
    }

    const deck = gameState.computerPowerDeck;
    const knownCard = gameState.computerKnownPower;

    const chosenCard =
        knownCard && deck.some(card => card.id === knownCard.id)
            ? knownCard
            : deck[Math.floor(Math.random() * deck.length)];

    // Find its current position in the computer's row.
    const cardElement = Array.from(
        document.getElementById("computer-power-cards").children
    ).find(element => element.dataset.powerId === String(chosenCard.id));

    gameState.phase = "computer-power-moving";

    // Move the selected card to the battlefield.
    await animatePowerCardToSlot(
        cardElement,
        "computer-power-slot"
    );

    gameState.computerPowerCard = chosenCard;

    gameState.computerPowerDeck = deck.filter(
        card => card.id !== chosenCard.id
    );

    revealPowerCard(
        chosenCard,
        document.getElementById("computer-power-slot")
    );

    renderPowerRows();
    updateCounts();

    gameState.phase = "waiting-player-power";

    document.getElementById("game-status").textContent =
        "Computer has revealed its Power Card. Choose yours!";
}


function applyGoPenalty() {

    if (gameState.phase !== "optional-power-attack") {
        return;
    }

    // Both Combat Cards go to the computer's Resting pile.
    gameState.computerResting.push(gameState.computerCard);
    gameState.computerResting.push(gameState.playerCard);

    // Prevent further actions during the penalty.
    gameState.phase = "penalty";

    document.getElementById("go-button").disabled = true;

    updateCounts();

    document.getElementById("game-status").textContent =
        "GO penalty! Computer wins both Combat Cards.";

    // Display the penalty pop-up.
    document.getElementById("penalty-modal").classList.remove("hidden");
}


// Human taps the shared Power deck

function drawPlayerPowerCard() {

    if (gameState.phase !== "waiting-player-power") return;

    if (gameState.powerDeck.length === 0) return;

    // Draw your Power Card
    gameState.playerPowerCard = gameState.powerDeck.pop();

    gameState.phase = "power-attack";

    const modal = document.getElementById("power-modal");

    // Show your card in the modal
    revealPowerCard(
        gameState.playerPowerCard,
        document.getElementById("modal-player-power")
    );

    // Now open the modal
    modal.classList.remove("hidden");

    document.getElementById("power-play-button").style.display =
        "none";

    document.getElementById("power-message").textContent =
        "Your Power Card played! Computer is choosing its card...";

    updateCounts();

    // Computer draws after a short delay
    setTimeout(function () {

        if (gameState.phase !== "power-attack") return;

        gameState.computerPowerCard = gameState.powerDeck.pop();

        revealPowerCard(
            gameState.computerPowerCard,
            document.getElementById("modal-computer-power")
        );

        document.getElementById("power-message").textContent =
            "Both Power Cards revealed!";

        updateCounts();

        resolvePowerAttack();

    }, 1500);
}


// Human clicks PLAY when computer has drawn first

function playSecondPowerCard() {

    if (gameState.phase !== "power-attack") return;

    if (gameState.firstPowerPlayer !== "computer") return;

    if (gameState.playerPowerCard !== null) return;

    if (gameState.powerDeck.length === 0) return;

    gameState.playerPowerCard = gameState.powerDeck.pop();

    revealPowerCard(
        gameState.playerPowerCard,
        document.getElementById("modal-player-power")
    );

    document.getElementById("power-message").textContent =
        "Both Power Cards revealed!";

    updateCounts();

    resolvePowerAttack();
}


// Compare Power Cards and resolve the battle
async function resolvePowerAttack() {
    const playerPower = gameState.playerPowerCard;
    const computerPower = gameState.computerPowerCard;

    if (!playerPower || !computerPower) return;

    // Both Power Cards go to their owners' Dead piles.
    gameState.playerDead.push(playerPower);
    gameState.computerDead.push(computerPower);

    const animations = [
        animateCardToPile("player-power-slot", "player-dead"),
        animateCardToPile("computer-power-slot", "computer-dead")
    ];

    if (playerPower.rank < computerPower.rank) {

        gameState.playerResting.push(gameState.playerCard);
        gameState.playerResting.push(gameState.computerCard);

        document.getElementById("game-status").textContent =
            "Your Power Card wins! You collect both Combat Cards.";

        animations.push(
            animateCardToPile("player-slot", "player-resting"),
            animateCardToPile("computer-slot", "player-resting")
        );

    } else if (computerPower.rank < playerPower.rank) {

        gameState.computerResting.push(gameState.computerCard);
        gameState.computerResting.push(gameState.playerCard);

        document.getElementById("game-status").textContent =
            "Computer wins the Power Attack and collects both Combat Cards.";

        animations.push(
            animateCardToPile("player-slot", "computer-resting"),
            animateCardToPile("computer-slot", "computer-resting")
        );

    } else {

        gameState.playerDead.push(gameState.playerCard);
        gameState.computerDead.push(gameState.computerCard);

        document.getElementById("game-status").textContent =
            "Power Attack tied! All four cards are destroyed.";

        animations.push(
            animateCardToPile("player-slot", "player-dead"),
            animateCardToPile("computer-slot", "computer-dead")
        );
    }

    updateCounts();

    // Wait until all cards finish moving.
    await Promise.all(animations);

    gameState.playerPowerCard = null;
    gameState.computerPowerCard = null;

    finishBattle();
}


// Resolve a battle using Combat Card values
async function resolveByValue(player, computer) {

    let winner = null;
    const animations = [];

    if (player.value > computer.value) {

        gameState.playerResting.push(player);
        gameState.computerDead.push(computer);

        winner = "player";

        document.getElementById("game-status").textContent =
            "You win this battle!";

        animations.push(
            () => animateCardToPile("player-slot", "player-resting"),
            () => animateCardToPile("computer-slot", "computer-dead")
        )

    } else if (computer.value > player.value) {

        gameState.computerResting.push(computer);
        gameState.playerDead.push(player);

        winner = "computer";

        document.getElementById("game-status").textContent =
            "Computer wins this battle!";

        animations.push(
            () => animateCardToPile("computer-slot", "computer-resting"),
            () => animateCardToPile("player-slot", "player-dead")
        )
    }

    await new Promise(resolve => setTimeout(resolve, 1200));
    await Promise.all(animations.map(animation => animation()));

    updateCounts();

    // Sudden Death: first battle winner wins the game.
    if (gameState.isSuddenDeath && winner !== null) {

        gameState.phase = "game-over";

        await Promise.all(animations);

        setTimeout(() => {
            showGameOver(winner);
        }, 500);

        return;
    }

    finishBattle();
}




function revealPowerCard(card, slot) {

    slot.innerHTML = "";

    const cardElement = document.createElement("div");

    cardElement.classList.add("game-card", "power-card");

    cardElement.innerHTML = `
        <div class="card-number">#${card.rank}</div>
        <div class="card-type">${card.name}</div>
        <div class="card-type">${card.element}</div>
    `;

    slot.appendChild(cardElement);
}

// SHOW FINAL GAME RESULTS
function showGameOver(winner) {

    const winnerElement =
        document.getElementById("final-winner");

    if (winner === "player") {
        winnerElement.textContent = "YOU WIN!";
    } else if (winner === "computer") {
        winnerElement.textContent = "COMPUTER WINS!";
    } else {
        winnerElement.textContent = "IT'S A DRAW!";
    }

    document.getElementById("final-player-resting")
        .textContent = gameState.playerResting.length;

    document.getElementById("final-player-dead")
        .textContent = gameState.playerDead.length;

    document.getElementById("final-computer-resting")
        .textContent = gameState.computerResting.length;

    document.getElementById("final-computer-dead")
        .textContent = gameState.computerDead.length;

    // Both players have independent Power Card sets.
    document.getElementById("final-power-count")
        .textContent =
        gameState.playerPowerDeck.length +
        gameState.computerPowerDeck.length;

    document.getElementById("game-over-modal")
        .classList.remove("hidden");

    document.getElementById("game-status").textContent =
        "Game over!";
}


// CHECK WHETHER THE REGULAR GAME HAS ENDED
function checkRegularGameEnd() {

    if (
        gameState.playerDeck.length !== 0 ||
        gameState.computerDeck.length !== 0
    ) {
        return false;
    }

    const playerScore = gameState.playerResting.length;
    const computerScore = gameState.computerResting.length;

    if (playerScore > computerScore) {
        gameState.phase = "game-over";
        showGameOver("player");

    } else if (computerScore > playerScore) {
        gameState.phase = "game-over";
        showGameOver("computer");

    } else {
        document.getElementById("game-status").textContent =
            "The scores are tied! Sudden Death is required.";

        startSuddenDeath();
    }

    return true;
}


// Finish the current battle
function finishBattle() {

    // Prevent another battle from starting during resolution.
    if (gameState.phase === "finishing") {
        return;
    }

    gameState.phase = "finishing";

    document.getElementById("go-button").disabled = true;
    document.getElementById("no-button").disabled = true;

    // Keep the revealed cards visible for 1.5 seconds.
    setTimeout(() => {

        // Clear all four battlefield slots.
        document.getElementById("computer-power-slot").innerHTML = "COMPUTER POWER CARD SLOT";
        document.getElementById("computer-slot").innerHTML = "COMPUTER COMBAT CARD SLOT";
        document.getElementById("player-slot").innerHTML = "YOUR POWER CARD SLOT";
        document.getElementById("player-power-slot").innerHTML = "YOUR POWER CARD SLOT";

        // Reset the cards used in this battle.
        gameState.playerCard = null;
        gameState.computerCard = null;
        gameState.playerPowerCard = null;
        gameState.computerPowerCard = null;

        // Prepare for the next battle.
        gameState.phase = "ready";

        updateCounts();

        const gameEnded = checkRegularGameEnd();

        if (!gameEnded && gameState.phase === "ready") {
            document.getElementById("game-status").textContent =
                "Ready for the next battle. Tap your Combat Card deck.";
        }

    }, 1500);
}


function startSuddenDeath() {

    // Take copies of both players' Resting Cards
    const playerSuddenDeck = [...gameState.playerResting];
    const computerSuddenDeck = [...gameState.computerResting];

    // The opponent shuffles and returns each player's deck.
    // Shuffling the decks independently gives the same result.
    gameState.playerDeck = shuffleCards(playerSuddenDeck);
    gameState.computerDeck = shuffleCards(computerSuddenDeck);

    // Restore both draw deck visuals
    document.querySelector("#player-cards .card-back")
        .classList.remove("deck-empty");

    document.querySelector("#computer-cards .card-back")
        .classList.remove("deck-empty");


    // Clear the Resting piles for the Sudden Death battle.
    // Their cards are now in the new Combat decks.
    gameState.playerResting = [];
    gameState.computerResting = [];

    // Mark the game as Sudden Death
    gameState.isSuddenDeath = true;

    gameState.phase = "ready";

    // Update the displayed deck and pile counts
    updateCounts();

    // Update the game message
    document.getElementById("game-status").textContent =
        "SUDDEN DEATH! First player to win a battle wins the game!";
}


function setLanguage(lang) {
    gameState.tutorialLanguage = lang;
    document.getElementById("btn-en").classList.toggle("active", lang === "en");
    document.getElementById("btn-ml").classList.toggle("active", lang === "ml");
    showTutorialStep();
}

document
    .getElementById("power-selection-close-button")
    .addEventListener("click", () => {

        if (!gameState.playerKnownPower) return;

        document
            .getElementById("power-selection-modal")
            .classList.add("hidden");

        gameState.phase = "ready";

        document.getElementById("game-status").textContent =
            "Game started! Tap your Combat Card deck.";

    });

// Close penalty modal and continue
document.getElementById("penalty-close-button")
    .addEventListener("click", function () {

        document.getElementById("penalty-modal")
            .classList.add("hidden");

        finishBattle();

    });

// PLAY AGAIN BUTTON
document.getElementById("play-again-button")
    .addEventListener("click", function () {

        // Reload the game and create fresh shuffled decks
        window.location.reload();

    });

// 7. Connect the player's draw deck to the click action
document.querySelector("#player-cards .card-back")
    .addEventListener("click", drawBattle);


// GO button
document.getElementById("go-button")
    .addEventListener("click", function () {

        if (gameState.phase !== "optional-power-attack") return;

        document.getElementById("go-button").disabled = true;

        // Activate the shared Power deck.
        // Do not open the modal yet.
        startPowerAttack("player");

    });


document.getElementById("no-button")
    .addEventListener("click", function () {

        if (gameState.phase !== "optional-power-attack") return;

        document.getElementById("go-button").disabled = true;
        document.getElementById("no-button").disabled = true;

        document.getElementById("game-status").textContent =
            "You declined the Power Attack.";

        resolveByValue(
            gameState.playerCard,
            gameState.computerCard
        );

    });

document
    .getElementById("player-power-cards")
    .addEventListener("click", event => {

        const cardElement =
            event.target.closest(".power-row-card");

        if (!cardElement) return;

        // Clicking a Power Card without GO triggers the penalty.
        if (gameState.phase === "optional-power-attack") {
            applyGoPenalty();
            return;
        }

        const cardId = cardElement.dataset.powerId;

        if (!cardId) return;

        selectPlayerPowerCard(cardId);
    });

// BACK button
document.getElementById("tutorial-back-button")
    .addEventListener("click", () => {

        if (currentTutorialStep > 0) {
            currentTutorialStep--;
            showTutorialStep();
        }
    });

// NEXT button
document.getElementById("tutorial-next-button")
    .addEventListener("click", () => {

        if (currentTutorialStep < tutorialSteps.length - 1) {
            currentTutorialStep++;
            showTutorialStep();
        } else {
            closeTutorialAndStart();
        }
    });

// SKIP button
document.getElementById("tutorial-skip-button")
    .addEventListener("click", () => {
        closeTutorialAndStart();
    });


document.getElementById("btn-en").addEventListener("click", () => setLanguage("en"));
document.getElementById("btn-ml").addEventListener("click", () => setLanguage("ml"));

// PLAY button in the modal
document.getElementById("power-play-button")
    .addEventListener("click", playSecondPowerCard);

// initializePowerCards();
showTutorial();

// 8. Show the initial counts
updateCounts();
