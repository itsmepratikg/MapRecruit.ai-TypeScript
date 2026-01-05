export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export const mixColors = (color1: {r: number, g: number, b: number}, color2: {r: number, g: number, b: number}, weight: number) => {
  const w = weight / 100;
  return {
    r: Math.round(color1.r * (1 - w) + color2.r * w),
    g: Math.round(color1.g * (1 - w) + color2.g * w),
    b: Math.round(color1.b * (1 - w) + color2.b * w)
  };
}

export const generatePalette = (baseHex: string) => {
  const base = hexToRgb(baseHex);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  // Improved mixing strategy for better "accent" visibility on light shades
  return {
    50: rgbToHex(mixColors(base, white, 95).r, mixColors(base, white, 95).g, mixColors(base, white, 95).b),
    100: rgbToHex(mixColors(base, white, 85).r, mixColors(base, white, 85).g, mixColors(base, white, 85).b), // Slightly darker for visibility
    200: rgbToHex(mixColors(base, white, 70).r, mixColors(base, white, 70).g, mixColors(base, white, 70).b),
    300: rgbToHex(mixColors(base, white, 50).r, mixColors(base, white, 50).g, mixColors(base, white, 50).b),
    400: rgbToHex(mixColors(base, white, 30).r, mixColors(base, white, 30).g, mixColors(base, white, 30).b),
    500: baseHex, // Base
    600: rgbToHex(mixColors(base, black, 10).r, mixColors(base, black, 10).g, mixColors(base, black, 10).b),
    700: rgbToHex(mixColors(base, black, 30).r, mixColors(base, black, 30).g, mixColors(base, black, 30).b),
    800: rgbToHex(mixColors(base, black, 50).r, mixColors(base, black, 50).g, mixColors(base, black, 50).b),
    900: rgbToHex(mixColors(base, black, 70).r, mixColors(base, black, 70).g, mixColors(base, black, 70).b),
    950: rgbToHex(mixColors(base, black, 80).r, mixColors(base, black, 80).g, mixColors(base, black, 80).b),
  };
}

export const applyTheme = (baseHex: string) => {
  const palette = generatePalette(baseHex);
  const root = document.documentElement;
  
  Object.entries(palette).forEach(([key, value]) => {
    root.style.setProperty(`--color-primary-${key}`, value);
  });
}
