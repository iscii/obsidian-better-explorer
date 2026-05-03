import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

describe("sticky explorer styles", () => {
  it("paints an opaque backing above sticky headers to hide scroll bleed-through", () => {
    assert.match(css, /0\s+-8px\s+0\s+0\s+var\(--background-primary\)/);
  });

  it("keeps an opaque base layer under hover and active states", () => {
    assert.match(css, /linear-gradient\(var\(--nav-item-background-hover[^)]*\)[\s\S]*var\(--background-primary\)/);
  });
});
