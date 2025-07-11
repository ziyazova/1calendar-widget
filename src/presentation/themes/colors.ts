// Более современная и комплементарная палитра цветов
export const widgetColors = [
  '#667EEA', // Soft Blue
  '#764BA2', // Deep Purple
  '#F093FB', // Pink Gradient
  '#F8BBD9', // Light Pink
  '#4FACFE', // Bright Blue
  '#43E97B', // Green
  '#FA709A', // Coral
  '#FEE140', // Yellow
  '#A8E6CF', // Mint
  '#FFB199', // Peach
] as const;

export const colorNames = [
  'Ocean',
  'Purple',
  'Magenta',
  'Rose',
  'Sky',
  'Emerald',
  'Coral',
  'Sunshine',
  'Mint',
  'Peach',
] as const;

// Дополнительные нейтральные цвета для фона
export const backgroundColors = [
  '#FFFFFF', // Pure White
  '#F8FAFC', // Snow
  '#F1F5F9', // Light Gray
  '#E2E8F0', // Soft Gray
  '#1E293B', // Dark Blue
  '#0F172A', // Deep Dark
] as const;

export const backgroundNames = [
  'White',
  'Snow',
  'Light',
  'Gray',
  'Dark',
  'Black',
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

// Get contrasting text color (black or white)
export const getContrastColor = (backgroundColor: string): string => {
  // Handle gradients - use the first color
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

// Get suggested colors based on background
export const getSuggestedColors = (backgroundColor: string) => {
  const isLight = getContrastColor(backgroundColor) === '#000000';

  if (isLight) {
    // For light backgrounds, suggest darker colors
    return colors.complementary.filter((_, index) => [0, 1, 4, 6].includes(index));
  } else {
    // For dark backgrounds, suggest lighter colors
    return colors.complementary.filter((_, index) => [2, 3, 5, 7, 8, 9].includes(index));
  }
};

// Color palette mapping
export const getColorName = (hex: string): ColorName | 'Unknown' => {
  const index = widgetColors.indexOf(hex as WidgetColor);
  return index >= 0 ? colorNames[index] : 'Unknown';
}; 