import { Hono } from "hono";

const api = new Hono().basePath("/api");
import { getOracleAnswer, rollDice, getOracleContext } from "./lib/lib.ts";

// rolls any of the standard dice and return the value - d4,d6,d8,d10,d12,d20,d100
api.get("/roll/:dice", (c) => {
  const dice = c.req.param("dice");

  const n = rollDice(Number(dice));

  return c.json({ data: { roll: n } });
});

// ---Oracle Rolls----
// d20 Result
// 1-2 No, and
// 3-7 No
// 8-9 No, but
// 10 Maybe (skill check or reroll)
// 11-12 Yes, but
// 13-18 Yes
// 19-20 Yes, and

const contextMap = [1, 2, 8, 9, 11, 12, 19, 20];

// oracle questions and awnsers
api.get("/oracle", async (c) => {
  try {
    const r = rollDice(20);

    const o = getOracleAnswer(r);

    let words = ["No Context"];

    // if the roll  is 1-2-8-9-11-12-19-20 - get context
    if (contextMap.includes(r)) {
      words = getOracleContext(3);
    }

    c.header("Content-Type", "application/json");
    c.status(200);

    return c.json({ data: { oracleAwnser: o, context: words } });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      return c.status(500);
    }
  }
});

api.get("/context", (c) => {
  const words = getOracleContext(3);

  return c.json({ data: { conext: words } });
});

export default api;
