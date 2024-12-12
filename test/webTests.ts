import { assert } from "jsr:@std/assert";
import { expect } from "jsr:@std/expect";
import { delay } from "jsr:@std/async";
import { assertInstanceOf } from "https://deno.land/std@0.224.0/assert/assert_instance_of.ts";

import { app } from "../main.ts";

Deno.test("Roll Dice Endpoint", async () => {
  try {
    // roll 10 times for a D20
    for (let i = 0; i < 10; i++) {
      const r = await app.request("/api/roll/20");
      expect(r.status).toBe(200);
      expect(r.headers.get("content-type")).toBe(
        "application/json; charset=UTF-8"
      );

      const { data } = await r.json();

      expect(typeof data).toBe("object");
      expect(typeof data.roll).toBe("number");
      expect(data.roll).toBeLessThanOrEqual(20);
      expect(data.roll).toBeGreaterThanOrEqual(1);
    }

    // roll 10 times for a d8
    for (let i = 0; i < 10; i++) {
      const r = await app.request("/api/roll/8");
      expect(r.status).toBe(200);
      expect(r.headers.get("content-type")).toBe(
        "application/json; charset=UTF-8"
      );

      const { data } = await r.json();

      expect(typeof data).toBe("object");
      expect(typeof data.roll).toBe("number");
      expect(data.roll).toBeLessThanOrEqual(8);
      expect(data.roll).toBeGreaterThanOrEqual(1);
    }
  } catch (err) {
    console.log(err);
  }
});

Deno.test("Oracle Endpoint", async () => {
  // expect response to be json
  // { oracle: int, contexct: string[]}

  try {
    const r = await app.request("/api/oracle");

    const { data } = await r.json();

    expect(r.headers.get("content-type")).toBe(
      "application/json; charset=UTF-8"
    );

    expect(typeof data.oracleAwnser).toBe("string");
    expect(typeof data).toBe("object");

    expect(r.status).toBe(200);
  } catch (err) {
    console.log(err);
  }
});
