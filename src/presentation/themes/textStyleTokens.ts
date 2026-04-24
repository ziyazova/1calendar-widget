import { css } from 'styled-components';

/**
 * Typography presets — the semantic text styles of the app.
 *
 * Reach for a preset name (e.g. `h1`, `body`, `caption`) instead of
 * hand-picking `sizes.*`, `weights.*`, `lineHeights.*`, `letterSpacing.*`
 * every time. Editing one entry here updates every use-site — same
 * pattern as `buttonTokens.ts` for buttons.
 *
 * Two ways to use:
 *
 *   1. Inside a styled component:
 *      const Heading = styled.h1`
 *        ${textStyle('h1')}
 *        color: indigo;
 *      `;
 *
 *   2. The shared <Text> component (src/presentation/components/shared/Text.tsx):
 *      <Text $variant="h1">Welcome</Text>
 *      <Text $variant="body" as="p">Paragraph…</Text>
 */

export type TextStyle =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyL'
  | 'body'
  | 'button'
  | 'caption'
  | 'micro';

export type TypographySize =
  | '2xs' | 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl'
  | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';

export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TypographyLineHeight = 'tight' | 'snug' | 'normal' | 'relaxed';
export type TypographyLetterSpacing =
  | 'widest' | 'normal' | 'loose' | 'tight' | 'tighter' | 'tightest';

export interface TextStyleRecipe {
  size: TypographySize;
  weight: TypographyWeight;
  lineHeight: TypographyLineHeight;
  letterSpacing: TypographyLetterSpacing;
  uppercase?: boolean;
}

export const textStyleTokens: Record<TextStyle, TextStyleRecipe> = {
  display: {
    size: '8xl',
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tightest',
  },
  h1: {
    size: '7xl',
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'tightest',
  },
  h2: {
    size: '4xl',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tighter',
  },
  h3: {
    size: '2xl',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tight',
  },
  bodyL: {
    size: 'lg',
    weight: 'normal',
    lineHeight: 'relaxed',
    letterSpacing: 'normal',
  },
  body: {
    size: 'base',
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'loose',
  },
  button: {
    size: 'base',
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'loose',
  },
  caption: {
    size: 'sm',
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  micro: {
    size: 'xs',
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'widest',
    uppercase: true,
  },
};

/**
 * CSS fragment for a named text style. Drop inside a styled component:
 *
 *   const Title = styled.h2`
 *     ${textStyle('h2')}
 *     color: ${({ theme }) => theme.colors.text.primary};
 *   `;
 */
export const textStyle = (name: TextStyle) => {
  const t = textStyleTokens[name];
  return css`
    font-family: ${({ theme }) => theme.typography.fonts.primary};
    font-size: ${({ theme }) => theme.typography.sizes[t.size]};
    font-weight: ${({ theme }) => theme.typography.weights[t.weight]};
    line-height: ${({ theme }) => theme.typography.lineHeights[t.lineHeight]};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing[t.letterSpacing]};
    ${t.uppercase ? 'text-transform: uppercase;' : ''}
  `;
};
