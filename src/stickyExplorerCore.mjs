export function shouldEnhanceFolder({ isRoot, isCollapsed, hasTitle }) {
  return !isRoot && !isCollapsed && hasTitle;
}

export function normalizeDepth(rawDepth) {
  if (!Number.isFinite(rawDepth)) {
    return 0;
  }
  return Math.max(0, Math.floor(rawDepth) - 1);
}

export function getStickyHeaderStyle({ depth, headerHeight }) {
  const safeDepth = Math.max(0, Math.floor(depth));
  const safeHeight = Number.isFinite(headerHeight) && headerHeight > 0 ? headerHeight : 24;

  return {
    top: `${safeDepth * safeHeight}px`,
    zIndex: `${1000 - safeDepth}`,
  };
}
