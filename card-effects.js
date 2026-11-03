const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".card").forEach((card, index) => {
  const contour = card.querySelector(".card-shine");
  const lightId = `card-light-${index}`;
  const bloomId = `card-bloom-${index}`;
  const auraId = `card-aura-${index}`;
  const refractionId = `card-refraction-${index}`;
  const blueId = `card-blue-${index}`;
  const surfaceId = `card-surface-${index}`;
  const clipId = `card-surface-clip-${index}`;
  // The edge reflection and blue scattering have separate color profiles.
  // Adding their light preserves a crisp cyan-white rim with saturated blue bloom.
  contour.innerHTML = `
    <defs>
      <radialGradient id="${lightId}" class="shine-light" gradientUnits="userSpaceOnUse" color-interpolation="sRGB">
        <stop offset="0" stop-color="#f2feff"/>
        <stop offset=".35" stop-color="#edfcff"/>
        <stop offset=".5" stop-color="#e5f9ff"/>
        <stop offset=".65" stop-color="#a9e4ff" stop-opacity=".95"/>
        <stop offset=".8" stop-color="#4ebbef" stop-opacity=".7"/>
        <stop offset=".96" stop-color="#1687bd" stop-opacity=".15"/>
        <stop offset="1" stop-color="#1687bd" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${blueId}" class="shine-light" gradientUnits="userSpaceOnUse" color-interpolation="sRGB">
        <stop offset="0" stop-color="#00baff"/>
        <stop offset=".3" stop-color="#00aaff" stop-opacity=".9"/>
        <stop offset=".65" stop-color="#008bf5" stop-opacity=".45"/>
        <stop offset="1" stop-color="#0078e0" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${surfaceId}" class="shine-light" gradientUnits="userSpaceOnUse" color-interpolation="sRGB">
        <stop offset="0" stop-color="#078bcb" stop-opacity=".11"/>
        <stop offset=".4" stop-color="#0677b7" stop-opacity=".06"/>
        <stop offset="1" stop-color="#02517a" stop-opacity="0"/>
      </radialGradient>
      <filter id="${bloomId}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="4"/>
      </filter>
      <filter id="${auraId}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="12"/>
      </filter>
      <filter id="${refractionId}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1.4"/>
      </filter>
      <clipPath id="${clipId}"><rect/></clipPath>
    </defs>
    <rect class="shine-surface" fill="url(#${surfaceId})" clip-path="url(#${clipId})"/>
    <rect class="shine-rim" fill="none" stroke="#50b8e8"/>
    <rect class="shine-aura" fill="none" stroke="url(#${blueId})" filter="url(#${auraId})"/>
    <rect class="shine-bloom" fill="none" stroke="url(#${blueId})" filter="url(#${bloomId})"/>
    <rect class="shine-caustic" fill="none" stroke="url(#${blueId})" filter="url(#${refractionId})"/>
    <g class="shine-edge-light">
      <rect class="shine-refraction" fill="none" stroke="url(#${lightId})" filter="url(#${refractionId})"/>
      <rect class="shine-core" fill="none" stroke="url(#${lightId})"/>
    </g>
  `;
  const light = contour.querySelector("radialGradient");
  const lights = contour.querySelectorAll(".shine-light");
  const core = contour.querySelector(".shine-core");
  let distance = 0;
  let perimeter = 0;
  let frame = 0;
  let previousTime = 0;
  let fadeUntil = 0;
  let active = false;

  function positionLight() {
    const point = core.getPointAtLength(distance);
    for (const source of lights) {
      source.setAttribute("cx", point.x);
      source.setAttribute("cy", point.y);
    }
  }

  function animate(time) {
    frame = 0;
    if (reducedMotion.matches || (!active && time >= fadeUntil)) return;
    if (previousTime) {
      // SVG rectangles run clockwise. Decreasing distance reverses the orbit.
      distance = (distance - ((time - previousTime) * 160) / 1000) % perimeter;
      if (distance < 0) distance += perimeter;
    }
    previousTime = time;
    positionLight();
    frame = requestAnimationFrame(animate);
  }

  function updateActivity() {
    const nextActive = card.matches(":hover, :focus-within");
    if (active && !nextActive) fadeUntil = performance.now() + 400;
    active = nextActive;
    if (!frame && active && !reducedMotion.matches) {
      previousTime = 0;
      frame = requestAnimationFrame(animate);
    }
  }

  const observer = new ResizeObserver(() => {
    const width = card.offsetWidth;
    const height = card.offsetHeight;
    const radius = Math.max(
      0,
      parseFloat(getComputedStyle(card).borderTopLeftRadius) - 0.5,
    );
    contour.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const reflectionRadius = Math.min(340, width * 0.52);
    light.setAttribute("r", reflectionRadius);
    contour
      .querySelector(`#${blueId}`)
      .setAttribute("r", reflectionRadius * 0.9);
    contour.querySelector(`#${surfaceId}`).setAttribute("r", reflectionRadius);
    for (const rect of contour.querySelectorAll("rect")) {
      rect.setAttribute("x", "0.5");
      rect.setAttribute("y", "0.5");
      rect.setAttribute("width", width - 1);
      rect.setAttribute("height", height - 1);
      rect.setAttribute("rx", radius);
    }
    // Extend filter bounds so the halo remains intact around every corner.
    for (const filter of contour.querySelectorAll("filter")) {
      filter.setAttribute("x", -48);
      filter.setAttribute("y", -48);
      filter.setAttribute("width", width + 96);
      filter.setAttribute("height", height + 96);
    }
    const progress = perimeter ? distance / perimeter : null;
    perimeter = core.getTotalLength();
    distance =
      progress === null ? width / 2 - radius - 0.5 : progress * perimeter;
    positionLight();
  });
  observer.observe(card);
  card.addEventListener("pointerenter", updateActivity);
  card.addEventListener("pointerleave", updateActivity);
  card.addEventListener("focusin", updateActivity);
  card.addEventListener("focusout", () => queueMicrotask(updateActivity));
  reducedMotion.addEventListener("change", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    updateActivity();
  });
});
