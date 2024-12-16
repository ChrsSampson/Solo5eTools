// Back end function library for the api - basically all of rolls and conversion tables

interface JsonData {
    keywords: string[];
    items: string[];
    magic_titles: [{ title: string; effect: string }];
    npc_traits: NPC_Traits;
}

type NPC_Traits = {
    races: string[];
    class: "wizard" | "warlock" | "paladin" | "rouge" | "fighter" | "barbarian" | "sorcerer";
    mood: string;
};

const data: JsonData = await loadData("./data.json");

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

//----------------- item generators ------------------------

// item return spec JSON - {name:string, title?: string, effect?: string, value:number, price?: number}

type ItemOut = {
    name: string;
    title?: string;
    effect?: string;
    value: number;
    price?: number;
    currency: "cp" | "sp" | "gp" | "";
};

// gets item from table
function getItem(): ItemOut {
    try {
        const max_items: number = data.items.length;
        const r: number = roll(max_items);
        const name: string = data.items[r];

        const item_value = roll(10);

        const out: ItemOut = {
            name: name,
            title: "None",
            value: item_value,
            currency: item_value >= 5 ? "cp" : "sp",
            price: item_value * 3 + roll(9),
        };

        return out;
    } catch (err) {
        console.log(err);
        return { name: "Nothing", value: 0, price: 0, currency: "" };
    }
}

// get an item and add a magic title to it
function getMagicItem() {
    try {
        const item = getItem();

        const max_title = data["magic_titles"].length;

        const { title, effect } = data["magic_titles"][roll(max_title)];

        const out: ItemOut = {
            name: item.name,
            title,
            effect,
            value: item.value + 100,
            currency: "gp",
            price: (item.value + roll(9)) * 3 + roll(200),
        };

        return out;
    } catch (err) {
        console.log(err);
        return { name: "Nothing", value: 0, price: 0, currency: "" };
    }
}

// ----------The D12 System tables and rolls ---------------------

// Roll the 6D12 tables for a desciption of the surroundings
// This function will likely get complicated with all the rolls that trigger other rolls.
function getDMDescription(type: string) {
    const types = ["wilderness", "room", "passage", "special room", "special wilderness"];

    // PG - 22
    const result = {
        monsters: rollDice(12),
        clues: rollDice(12),
        npc: rollDice(12),
        event: rollDice(12),
        treasure: rollDice(12),
        enviroment: rollDice(12),
    };

    return result;
}

// PG - 27
function getDungeonFeature() {}

// PG - 25
function getWildernessFeature() {}

function getTrap() {}

function getWildernessEncouter() {}

function getUrbanEncounter() {}

function getUrbanSetting() {}

export { rollDice, roll, getOracleAnswer, data, loadData, getOracleContext, getItem, getMagicItem };
