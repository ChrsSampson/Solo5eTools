import { Hono } from "hono";

const api = new Hono().basePath("/api");
import { rollDice } from "./lib/lib.ts";

// rolls any of the standard dice and return the value - d4,d6,d8,d10,d12,d20,d100
api.get("/roll/:dice", (c) => {
  const dice = c.req.param("dice");

  const n = rollDice(Number(dice));

  return c.json({ roll: n });
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

api.get("/oracle", (c) => {});

api.get("/context", (c) => {
  return c.text("kewords");
});

export default api;
