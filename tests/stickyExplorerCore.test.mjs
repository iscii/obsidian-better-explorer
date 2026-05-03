import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldEnhanceFolder,
  getStickyHeaderStyle,
  normalizeDepth,
} from "../src/stickyExplorerCore.mjs";

describe("sticky explorer core", () => {
  it("enhances only non-root open folders that have a title", () => {
    assert.equal(shouldEnhanceFolder({ isRoot: false, isCollapsed: false, hasTitle: true }), true);
    assert.equal(shouldEnhanceFolder({ isRoot: true, isCollapsed: false, hasTitle: true }), false);
    assert.equal(shouldEnhanceFolder({ isRoot: false, isCollapsed: true, hasTitle: true }), false);
    assert.equal(shouldEnhanceFolder({ isRoot: false, isCollapsed: false, hasTitle: false }), false);
  });

  it("normalizes root-relative folder depth", () => {
    assert.equal(normalizeDepth(1), 0);
    assert.equal(normalizeDepth(2), 1);
    assert.equal(normalizeDepth(4), 3);
    assert.equal(normalizeDepth(0), 0);
    assert.equal(normalizeDepth(-3), 0);
  });

  it("stacks nested sticky folder titles by header height", () => {
    assert.deepEqual(getStickyHeaderStyle({ depth: 0, headerHeight: 24 }), {
      top: "0px",
      zIndex: "1000",
    });
    assert.deepEqual(getStickyHeaderStyle({ depth: 2, headerHeight: 24 }), {
      top: "48px",
      zIndex: "998",
    });
  });
});
