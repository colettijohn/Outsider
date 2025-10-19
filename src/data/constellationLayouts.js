// Constellation layouts for the Celestial Atlas
// Each category maps to a constellation shape with stars and connecting lines
export const constellationLayouts = {
    "Deep Thoughts": {
        name: "Lyra",
        stars: [
            { x: 50, y: 15 },
            { x: 25, y: 40 },
            { x: 75, y: 40 },
            { x: 25, y: 85 },
            { x: 75, y: 85 }
        ],
        lines: [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2]]
    },
    "Hypotheticals": {
        name: "Gemini",
        stars: [
            { x: 30, y: 20 },
            { x: 35, y: 50 },
            { x: 40, y: 80 },
            { x: 70, y: 20 },
            { x: 65, y: 50 },
            { x: 60, y: 80 }
        ],
        lines: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4]]
    },
    "Wild Cards": {
        name: "Supernova",
        stars: [
            { x: 50, y: 50 },
            { x: 20, y: 20 },
            { x: 80, y: 20 },
            { x: 20, y: 80 },
            { x: 80, y: 80 }
        ],
        lines: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 3], [2, 4]]
    },
    "Daily Routines": {
        name: "Cassiopeia",
        stars: [
            { x: 15, y: 70 },
            { x: 35, y: 40 },
            { x: 50, y: 60 },
            { x: 65, y: 40 },
            { x: 85, y: 70 }
        ],
        lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    "Objects & Places": {
        name: "Corona Borealis",
        stars: [
            { x: 20, y: 65 },
            { x: 30, y: 35 },
            { x: 50, y: 25 },
            { x: 70, y: 35 },
            { x: 80, y: 65 },
            { x: 50, y: 80 }
        ],
        lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
    },
    "History & Mythology": {
        name: "Hercules",
        stars: [
            { x: 25, y: 25 },
            { x: 75, y: 25 },
            { x: 50, y: 50 },
            { x: 20, y: 80 },
            { x: 80, y: 80 }
        ],
        lines: [[0, 2], [1, 2], [2, 3], [2, 4], [0, 1]]
    },
    "Science & Nature": {
        name: "Cygnus",
        stars: [
            { x: 50, y: 15 },
            { x: 50, y: 50 },
            { x: 25, y: 35 },
            { x: 75, y: 35 },
            { x: 50, y: 85 }
        ],
        lines: [[0, 1], [2, 3], [1, 4]]
    },
    "Arts & Literature": {
        name: "Aquila",
        stars: [
            { x: 50, y: 20 },
            { x: 50, y: 50 },
            { x: 25, y: 60 },
            { x: 75, y: 60 }
        ],
        lines: [[0, 1], [1, 2], [1, 3]]
    },
    "Food & Drink": {
        name: "Crater",
        stars: [
            { x: 25, y: 30 },
            { x: 75, y: 30 },
            { x: 20, y: 60 },
            { x: 80, y: 60 },
            { x: 50, y: 85 }
        ],
        lines: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]]
    },
    "Travel & Geography": {
        name: "Carina",
        stars: [
            { x: 20, y: 70 },
            { x: 40, y: 50 },
            { x: 60, y: 60 },
            { x: 55, y: 30 },
            { x: 80, y: 20 }
        ],
        lines: [[0, 1], [1, 2], [1, 3], [3, 4]]
    },
    "Technology & Future": {
        name: "Andromeda",
        stars: [
            { x: 20, y: 80 },
            { x: 40, y: 60 },
            { x: 60, y: 40 },
            { x: 80, y: 20 }
        ],
        lines: [[0, 1], [1, 2], [2, 3]]
    },
    "Personality & Psyche": {
        name: "Libra",
        stars: [
            { x: 20, y: 30 },
            { x: 80, y: 30 },
            { x: 50, y: 50 },
            { x: 20, y: 80 },
            { x: 80, y: 80 }
        ],
        lines: [[0, 1], [0, 3], [1, 4], [3, 4]]
    },
    "Default": {
        name: "Unknown",
        stars: [
            { x: 50, y: 50 },
            { x: 30, y: 30 },
            { x: 70, y: 30 },
            { x: 30, y: 70 },
            { x: 70, y: 70 }
        ],
        lines: []
    }
}

export default constellationLayouts
