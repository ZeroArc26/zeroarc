import { Svg, Rect } from "@react-pdf/renderer";

interface PseudoBarcodeProps {
  value: string;
  width?: number;
  height?: number;
}

/**
 * Renders a deterministic, visually barcode-like pattern of vertical
 * bars derived from `value`. This is NOT a real, scannable barcode
 * (that would need a canvas-based library like jsbarcode, which is
 * awkward to run server-side on Windows). It's purely decorative,
 * matching the look of the reference design.
 */
export default function PseudoBarcode({
  value,
  width = 260,
  height = 50,
}: PseudoBarcodeProps) {
  const chars = value.split("");
  const barCount = Math.max(chars.length * 3, 40);
  const barWidth = width / barCount;

  const bars = Array.from({ length: barCount }).map((_, i) => {
    const charCode = value.charCodeAt(i % value.length) || 1;
    const seed = (charCode * (i + 7)) % 5;
    const isWide = seed > 2;
    return isWide;
  });

  let x = 0;

  return (
    <Svg width={width} height={height}>
      {bars.map((isWide, i) => {
        const w = isWide ? barWidth * 0.9 : barWidth * 0.4;
        const rect = (
          <Rect
            key={i}
            x={x}
            y={0}
            width={w}
            height={height}
            fill="#000000"
          />
        );
        x += barWidth;
        return rect;
      })}
    </Svg>
  );
}