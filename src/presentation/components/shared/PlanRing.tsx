import styled from 'styled-components';

/**
 * PlanRing — circular progress indicator used on plan/usage cards.
 *
 * SVG-based (not CSS conic-gradient) for crisper rendering and stroke control.
 * Renders a track + progress arc + optional label in the center.
 *
 * Sizes: sm (40) / md (56) / lg (80) / xl (120)
 * Accepts `percent` (0-100). Color is picked up from `$color` prop or theme.accent.
 */

interface PlanRingProps {
  percent: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  track?: string;
  /** Content rendered in the center (a number, label, icon) */
  children?: React.ReactNode;
  /** Stroke width override */
  stroke?: number;
}

const sizeMap = {
  sm: { size: 40, stroke: 4, fontSize: 10 },
  md: { size: 56, stroke: 5, fontSize: 12 },
  lg: { size: 80, stroke: 6, fontSize: 14 },
  xl: { size: 120, stroke: 8, fontSize: 18 },
};

const Wrap = styled.div<{ $size: number }>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
`;

const Center = styled.div<{ $fontSize: number }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $fontSize }) => $fontSize}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

export function PlanRing({
  percent,
  size = 'md',
  color,
  track,
  children,
  stroke: strokeOverride,
}: PlanRingProps) {
  const cfg = sizeMap[size];
  const stroke = strokeOverride ?? cfg.stroke;
  const radius = (cfg.size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;
  const center = cfg.size / 2;

  return (
    <Wrap $size={cfg.size}>
      <svg width={cfg.size} height={cfg.size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={track ?? 'rgba(0, 0, 0, 0.08)'}
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color ?? '#6366F1'}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.2, 0.9, 0.3, 1)' }}
        />
      </svg>
      {children && <Center $fontSize={cfg.fontSize}>{children}</Center>}
    </Wrap>
  );
}
