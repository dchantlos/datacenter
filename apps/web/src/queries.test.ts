import { test } from "node:test";
import assert from "node:assert/strict";
import { httpStatusOf, retrying } from "./queries.ts";

const serverError = (status: number) => Object.assign(new Error("Unable to load"), { details: { httpStatus: status } });

/** A request that fails with the given errors in turn, then answers. */
function flaky(...errors: Error[]) {
  let calls = 0;
  const request = async () => {
    calls++;
    const error = errors.shift();
    if (error) throw error;
    return "ok";
  };
  return { request, calls: () => calls };
}

test("reads the HTTP status from details or, for errors passed on by layers, the message", () => {
  assert.equal(httpStatusOf(serverError(504)), 504);
  assert.equal(httpStatusOf(new Error("[request:server]: Unable to load https://x/query?f=pbf status: 504")), 504);
  assert.equal(httpStatusOf(new Error("Failed to fetch")), 0);
});

test("retries server errors and dropped connections until one answers", async () => {
  const r = flaky(serverError(504), new Error("Failed to fetch"));
  assert.equal(await retrying(r.request, new AbortController().signal, [0, 0]), "ok");
  assert.equal(r.calls(), 3);
});

test("gives up after the last retry", async () => {
  const r = flaky(serverError(503), serverError(503), serverError(503));
  await assert.rejects(retrying(r.request, new AbortController().signal, [0, 0]), /Unable to load/);
  assert.equal(r.calls(), 3);
});

test("does not retry bad requests or timeouts", async () => {
  for (const error of [serverError(400), new Error("Timeout exceeded")]) {
    const r = flaky(error);
    await assert.rejects(retrying(r.request, new AbortController().signal, [0, 0]));
    assert.equal(r.calls(), 1);
  }
});

test("stops waiting when the run is cancelled", async () => {
  const controller = new AbortController();
  const r = flaky(serverError(504));
  const pending = retrying(r.request, controller.signal, [60_000]);
  setTimeout(() => controller.abort(), 10);
  await assert.rejects(pending, { name: "AbortError" });
  assert.equal(r.calls(), 1);
});
