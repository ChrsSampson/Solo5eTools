// Back end function library for the api - basically all of rolls and conversion tables

import { getItem, getMagicItem } from "./items.ts";

type DataFormat = {
    items: string[];
    magic_titles: MagicTitles[];
    keywords: string[];
    weapons: Weapon[];
};

type Weapon = {
    name: string;
    type: string;
    rarity: string;
    damage: string;
    damage_type: string;
    properties: string[];
};

type MagicTitles = {
    title: string;
    effect: string;
};

type NPC_Traits = {
    races: string[];
    class: "wizard" | "warlock" | "paladin" | "rouge" | "fighter" | "barbarian" | "sorcerer";
    mood: string;
};

const data: DataFormat = await loadData("./data.json");

// load json data into memory
async function loadData(path: string = "../.../data.json") {
    try {
        if (path) {
            const file = await Deno.readTextFile(path);
            return JSON.parse(file);
        } else {
            throw new Error("Something went wrong");
        }
    } catch (err) {
        console.log("Fatal: could not load json data: ", err);
        Deno.exit(1);
    }
}

// --------------Dicer Rollers and Random Numbers------------------

// roll any of the standard dice
function rollDice(dice: number = 20): number {
    // valid dice
    const valid = [4, 6, 8, 10, 12, 20, 100];

    if (valid.includes(Number(dice))) {
        const n = Math.floor(Math.random() * dice + 1);

        return n;
    } else {
        return 1;
    }
}

// roll a random number base on the max - 1- [max]
function roll(max: number = 100): number {
    const n = Math.floor(Math.random() * max + 1) + 1;
    // this is me being very lazy - Clamp range
    if (n < 1) {
        return 1;
    } else if (n > max) {
        return max;
    }

    return n;
}

// -------------Oracle Functions-------------------

// oracle response table
function getOracleAnswer(roll: number = 1): string {
    if (roll <= 1 || roll == 2) {
        return "No, and...";
    } else if (roll >= 3 && roll <= 7) {
        return "No";
    } else if (roll == 10) {
        return "Maybe [Skill Check]";
    } else if (roll == 11 || roll == 12) {
        return "Yes, but...";
    } else if (roll >= 13 && roll <= 18) {
        return "Yes";
    } else if (roll == 19 || roll >= 20) {
        return "Yes, and...";
    }

    return "No, and...";
}

//return 3-5 words from keywords table
function getOracleContext(words: number = 3): string[] {
    try {
        if (words > 5) words = 5;
        const max = data["keywords"].length;

        const out = [];

        for (let i = 0; i < words; i++) {
            const r = roll(max);

            out.push(data["keywords"][r]);
        }

        return out;
    } catch (err) {
        console.log(err);
        return [String(err)];
    }
}

export { rollDice, roll, getOracleAnswer, data, loadData, getOracleContext, getItem, getMagicItem };
