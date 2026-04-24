import styled from 'styled-components';
import {
  templateCardGradient,
  templateCardShadow,
  templateCardShadowHover,
  templateCardBorder,
  templateCardBorderHover,
  templateCardSizeTokens,
  type TemplateCardSize,
} from '@/presentation/themes/templateCardTokens';

/**
 * TemplateMockupCard — the cloudy-white backdrop + centered product image
 * shown on the landing marquee, /templates grid, /templates/:id carousel,
 * and related-templates rail. A single primitive so the gradient, image
 * scale, and drop-shadow all move together when design tweaks the look.
 *
 * Usage:
 *   <TemplateMockupCard $size="grid" $interactive>
 *     <TemplateMockupImage src={t.image} alt={t.title} />
 *   </TemplateMockupCard>
 *
 * Size presets live in `themes/templateCardTokens.ts`.
 */

interface TemplateMockupCardProps {
  $size?: TemplateCardSize;
  /** Whether to lift/scale on hover. Off for static carousel slides. */
  $interactive?: boolean;
}

export const TemplateMockupCard = styled.div<TemplateMockupCardProps>`
  position: relative;
  width: 100%;
  overflow: hidden;
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  background: ${templateCardGradient};
  border: ${templateCardBorder};
  box-shadow: ${templateCardShadow};
  transition: box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease;

  aspect-ratio: ${({ $size = 'grid' }) => templateCardSizeTokens[$size].aspect};
  border-radius: ${({ $size = 'grid', theme }) =>
    theme.radii[templateCardSizeTokens[$size].radius]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    aspect-ratio: ${({ $size = 'grid' }) =>
      templateCardSizeTokens[$size].aspectMobile ??
      templateCardSizeTokens[$size].aspect};
    border-radius: ${({ $size = 'grid', theme }) => {
      const r = templateCardSizeTokens[$size].radiusMobile ??
        templateCardSizeTokens[$size].radius;
      return theme.radii[r];
    }};
  }

  ${({ $interactive }) =>
    $interactive &&
    `
    &:hover {
      border: ${templateCardBorderHover};
      box-shadow: ${templateCardShadowHover};
    }
  `}
`;

/** Centered product/mockup image — 70/80% of the card, absolute-centered,
    with a soft drop-shadow. Use inside <TemplateMockupCard>. Pass
    `$hoverZoom` to scale the image when the parent card is hovered —
    default on, off for static carousel slides. */
export const TemplateMockupImage = styled.img<{
  $size?: TemplateCardSize;
  $hoverZoom?: boolean;
}>`
  position: absolute;
  inset: 0;
  margin: auto;
  object-fit: contain;
  display: block;
  width: ${({ $size = 'grid' }) => templateCardSizeTokens[$size].imageScale};
  height: ${({ $size = 'grid' }) => templateCardSizeTokens[$size].imageScale};
  filter: ${({ $size = 'grid' }) => templateCardSizeTokens[$size].imageShadow};
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${({ $hoverZoom = true }) =>
    $hoverZoom &&
    `${TemplateMockupCard}:hover & { transform: scale(1.06); }`}
`;
