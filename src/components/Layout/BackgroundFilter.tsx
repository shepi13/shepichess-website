/**
 * SVG filter with turbulence to create a grainy effect.
 * Used in the main background of the website.
 *
 * @returns Grainy background filter
 */
export function SVGGrainyFilter() {
  return (
    <svg role="img" aria-label="Background filter" width="0" height="0">
      <filter id="grainy" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".537"></feTurbulence>
        <feColorMatrix type="saturate" values="0.5"></feColorMatrix>
        <feBlend mode="multiply" in="SourceGraphic"></feBlend>
      </filter>
    </svg>
  );
}
