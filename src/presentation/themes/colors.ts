// Более современная и комплементарная палитра цветов
export const widgetColors = [
  '#37352F', // Default
  '#2F80ED', // Blue
  '#EB5757', // Red
] as const;

export const colorNames = [
  'Default',
  'Blue',
  'Red',
] as const;

// Background presets — soft Notion-like tints
export const backgroundColors = [
  '#FFFFFF', // White
  '#F7F6F3', // Notion Light
  '#191919', // Notion Dark
] as const;

export const backgroundNames = [
  'White',
  'Light',
  'Dark',
] as const;

// Accent presets — soft transparent Notion-like
export const accentColors = [
  '#EDF3EC', // Light Green
  '#E8EDFF', // Light Blue
  '#FDEBEC', // Light Pink
] as const;

export const accentNames = [
  'Green',
  'Blue',
  'Pink',
] as const;

// Apple-style градиенты для фонов
export const gradientBackgrounds = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Blue Purple
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink Red
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue Cyan
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green Mint
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Coral Yellow
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Mint Pink
] as const;

export const gradientNames = [
  'Ocean Wave',
  'Sunset',
  'Arctic',
  'Forest',
  'Dawn',
  'Cotton Candy',
] as const;

export type WidgetColor = typeof widgetColors[number];
export type ColorName = typeof colorNames[number];
export type BackgroundColor = typeof backgroundColors[number];
export type GradientBackground = typeof gradientBackgrounds[number];

// Color structure for ColorPicker
export const colors = {
  complementary: widgetColors.map((color, index) => ({
    name: colorNames[index],
    value: color,
  })),
  backgrounds: backgroundColors.map((color, index) => ({
    name: backgroundNames[index],
    value: color,
  })),
  accents: accentColors.map((color, index) => ({
    name: accentNames[index],
    value: color,
  })),
  gradients: gradientBackgrounds.map((gradient, index) => ({
    name: gradientNames[index],
    value: gradient,
  })),
};

// Helper to get RGB values from hex
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
};

// Helper to create rgba string
export const createRgba = (hex: string, opacity: number) => {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : hex;
};

// Calculate luminance for contrast checking
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const sRGB = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
};


export const getContrastColor = (backgroundColor: string): string => {
  if (backgroundColor.includes('gradient')) {
    const colorMatch = backgroundColor.match(/#[a-fA-F0-9]{6}/);
    if (colorMatch) {
      backgroundColor = colorMatch[0];
    } else {
      return '#000000'; // fallback
    }
  }

  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Returns primaryColor for text, but swaps to contrast color if primary ≈ background.
// Set enforce=false to disable and always return primaryColor as-is.
export const getEffectiveTextColor = (
  primaryColor: string,
  backgroundColor: string,
  enforce: boolean = true,
): string => {
  if (!enforce) return primaryColor;
  const primaryLum = getLuminance(primaryColor);
  const bgLum = getLuminance(backgroundColor);
  if (Math.abs(primaryLum - bgLum) < 0.15) {
    return getContrastColor(backgroundColor);
  }
  return primaryColor;
};

// Get suggested colors based on background
export const getSuggestedColors = (backgroundColor: string) => {
  const isLight = getContrastColor(backgroundColor) === '#000000';

  if (isLight) {
    return colors.complementary.filter((_, index) => [0, 1].includes(index));
  } else {
    return colors.complementary.filter((_, index) => [2].includes(index));
  }
};

// Color palette mapping
export const getColorName = (hex: string): ColorName | 'Unknown' => {
  const index = widgetColors.indexOf(hex as WidgetColor);
  return index >= 0 ? colorNames[index] : 'Unknown';
}; 