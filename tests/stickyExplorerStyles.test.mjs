import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

describe("sticky explorer styles", () => {
  it("offsets sticky headers upward to hide scroll bleed-through", () => {
    assert.match(css, /top:\s*calc\(var\(--better-explorer-sticky-top,\s*0px\)\s*-\s*8px\)/);
  });

  it("keeps an opaque base layer under hover and active states", () => {
    assert.match(css, /linear-gradient\(var\(--nav-item-background-hover[^)]*\)[\s\S]*var\(--background-primary\)/);
  });
});
