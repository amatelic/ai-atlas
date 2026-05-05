function parseOklchLightness(value) {
  const match = String(value).match(/oklch\(([\d.]+)%/);
  return match ? Number(match[1]) : 50;
}

export function collectPreviewMetrics(design) {
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const layers = Array.from(document.querySelectorAll("[data-layer]"));
  const buttons = Array.from(document.querySelectorAll("button, a[role='button'], .button"));
  const headings = Array.from(document.querySelectorAll("h1, h2, h3"));

  return {
    palette: design.palette,
    lightnessSpread: Math.abs(parseOklchLightness(design.palette.canvas) - parseOklchLightness(design.palette.ink)),
    sectionCount: sections.length,
    layerCount: layers.length,
    buttonCount: buttons.length,
    headingCount: headings.length,
    navItems: design.structure.navItems.length,
    componentTargets: design.structure.componentTargets.length
  };
}

export function comparePreviewToTarget(metrics, target) {
  const checks = [
    Math.min(metrics.sectionCount / target.sectionCount, 1),
    Math.min(metrics.layerCount / target.layerCount, 1),
    Math.min(metrics.buttonCount / target.buttonCount, 1),
    Math.min(metrics.headingCount / target.headingCount, 1),
    Math.min(metrics.navItems / target.navItems, 1),
    Math.min(metrics.componentTargets / target.componentTargets, 1),
    metrics.lightnessSpread >= target.minLightnessSpread ? 1 : metrics.lightnessSpread / target.minLightnessSpread
  ];

  return {
    total: Number((checks.reduce((sum, value) => sum + value, 0) / checks.length).toFixed(3)),
    checks
  };
}
