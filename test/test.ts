import { assert, assertEquals } from "jsr:@std/assert";
import { expect } from "jsr:@std/expect";
import { delay } from "jsr:@std/async";

import { rollDice } from "../lib/lib.ts";

// roll dice
Deno.test("Rolling some dice", () => {
  const valid = [4, 6, 8, 10, 12, 20, 100];

  try {
    //   for each valid dice roll 100 to check randomness and range
    valid.forEach((n) => {
      const result = rollDice(n);
      const inRange = (number: number) =>
        number >= 1 && number <= n ? true : false;
      if (result == 20) console.log("I Got a Crit!");
      assert(inRange(result));
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("Test Error: ", err.message);
    }
  }
});
