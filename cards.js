
// RED COMBAT CARDS
const redCards = [
    { value: 1, type: "normal" },
    { value: 4, type: "lightning" },
    { value: 5, type: "normal" },
    { value: 8, type: "normal" },
    { value: 9, type: "lightning" },
    { value: 12, type: "normal" },
    { value: 13, type: "normal" },
    { value: 16, type: "normal" },
    { value: 17, type: "lightning" },
    { value: 20, type: "normal" },
    { value: 21, type: "lightning" },
    { value: 24, type: "normal" },

    { type: "destructor" },
    { type: "destructor" },
    { type: "destructor" }
].map((card, index) => ({
    ...card,
    id: `red-${index + 1}`,
    colour: "red"
}));


// BLUE COMBAT CARDS
const blueCards = [
    { value: 2, type: "normal" },
    { value: 3, type: "lightning" },
    { value: 6, type: "normal" },
    { value: 7, type: "normal" },
    { value: 10, type: "lightning" },
    { value: 11, type: "normal" },
    { value: 14, type: "normal" },
    { value: 15, type: "lightning" },
    { value: 18, type: "normal" },
    { value: 19, type: "normal" },
    { value: 22, type: "normal" },
    { value: 23, type: "lightning" },

    { type: "destructor" },
    { type: "destructor" },
    { type: "destructor" }
].map((card, index) => ({
    ...card,
    id: `blue-${index + 1}`,
    colour: "blue"
}));


// POWER CARD RANKS
const powerRanks = [
    { rank: 1, name: "Akasha", element: "Space" },
    { rank: 2, name: "Vayu", element: "Air" },
    { rank: 3, name: "Agni", element: "Fire" },
    { rank: 4, name: "Jalam", element: "Water" },
    { rank: 5, name: "Prithvi", element: "Earth" }
];


// CREATE TWO IDENTICAL POWER SETS
const powerCards = [1, 2].flatMap(copy =>
    powerRanks.map(power => ({
        id: `power-${copy}-${power.rank}`,
        rank: power.rank,
        name: power.name,
        element: power.element,
        copy: copy,
        type: "power",
        colour: "gold"
    }))
);


// COMPLETE GAME CARD INVENTORY
const allCards = [
    ...redCards,
    ...blueCards,
    ...powerCards
];

console.log("Total cards: ", allCards.length);
console.log("Red cards: ", redCards.length);
console.log("Blue cards: ", blueCards.length);
console.log("Power cards", powerCards.length);
console.table(powerCards)