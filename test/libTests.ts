// Contains all tests for running back end server function

import { assert } from "jsr:@std/assert";
import { expect } from "jsr:@std/expect";

import { rollDice, roll, loadData, getOracleContext, getItem, getMagicItem } from "../lib/lib.ts";
import { getOracleAnswer } from "../lib/lib.ts";

// utility for priting error
function logError(err: any) {
    if (err instanceof Error) {
        console.log(err.message);
    }
}

// roll dice
Deno.test("Rolling some dice", () => {
    const valid = [4, 6, 8, 10, 12, 20, 100];

    try {
        //   for each valid dice roll 100 to check randomness and range
        valid.forEach((n) => {
            const result = rollDice(n);
            const inRange = (number: number) => (number >= 1 && number <= n ? true : false);
            if (result == 20) console.log("I Got a Crit!");
            assert(inRange(result));
        });
    } catch (err) {
        if (err instanceof Error) {
            console.log("[Dice Roll] Test Error: ", err.message);
        }
    }
});

Deno.test("Rolling on the Tables", () => {
    try {
        for (let i = 1; i < 101; i++) {
            const r = roll(i);
            expect(r).toBeLessThanOrEqual(i);
            expect(r).toBeGreaterThanOrEqual(1);
        }
    } catch (err) {
        logError(err);
    }
});

interface JsonData {
    keywords: string[];
    items: string[];
}

Deno.test("Loading Data from JSON file from ../data.json...", async () => {
    try {
        const d: JsonData = await loadData("../data.json");
        expect(d).toBeDefined();
        expect(d["items"]);
        data = d;
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
});

Deno.test("Consulting the Oracle...", () => {
    try {
        const roll = rollDice(20);

        const r = getOracleAnswer(roll);
        // should return string
        const t = typeof r;
        expect(t).toBe("string");
        expect(r).toBeDefined();

        // should return bad roll on null arg
        const r2 = getOracleAnswer();
        expect(typeof r2).toBe("string");
        expect(r2).toBe("No, and...");

        // expect(r).toBeTruthy();
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
});

Deno.test.only("Oracle Table", () => {
    try {
        const r1 = getOracleAnswer(5);
        expect(r1).toBe("No");

        const r2 = getOracleAnswer(20);
        expect(r2).toBe("Yes, and...");

        const r3 = getOracleAnswer(10);
        expect(r3).toBe("Maybe [Skill Check]");

        const r4 = getOracleAnswer(14);
        expect(r4).toBe("Yes");

        const r5 = getOracleAnswer(12);
        expect(r5).toBe("Yes, but...");
    } catch (err) {
        logError(err);
    }
});

Deno.test("Oracle is Elaborating...", () => {
    try {
        const set = getOracleContext();
        expect(set).toBeDefined();
        expect(typeof set).toBe("object");
        expect(set.length).toBe(3);

        const set2 = getOracleContext(5);
        expect(set2.length).toBe(5);

        const set3 = getOracleContext(10);
        expect(set3.length).toBe(5);
    } catch (err) {
        logError(err);
    }
});

Deno.test.only("Finding Items", async (t) => {
    try {
        await t.step("Get Normal Item", () => {
            try {
                const item = getItem();

                expect(typeof item).toBe("object");

                expect(item).toHaveProperty("name");
                expect(item).toHaveProperty("title");
                expect(item).toHaveProperty("value");
                expect(item).toHaveProperty("currency");

                const { name, title, value, currency } = item;

                expect(typeof name).toBe("string");
                expect(typeof title).toBe("string");
                expect(typeof value).toBe("number");
                expect(typeof name).toBe("string");
            } catch (err) {
                logError(err);
            }
        });

        await t.step("Getting 20 items", () => {
            try {
                for (let i = 0; i < 20; i++) {
                    const item = getItem();
                    expect(item).toHaveProperty("name");
                }
            } catch (err) {
                logError(err);
            }
        });

        await t.step("Get Magic Item", () => {
            const item = getMagicItem();

            expect(typeof item).toBe("object");

            expect(item).toHaveProperty("name");
            expect(item).toHaveProperty("title");
            expect(item).toHaveProperty("effect");
            expect(item).toHaveProperty("value");
            expect(item).toHaveProperty("currency");

            const { name, title, effect, value, currency } = item;

            expect(typeof name).toBe("string");
            expect(typeof title).toBe("string");
            expect(typeof effect).toBe("string");
            expect(typeof value).toBe("number");
            expect(typeof name).toBe("string");
        });
    } catch (err) {
        console.log(err);
    }
});
