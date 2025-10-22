// ArenaQuest Design System - Solid Colors for Black Background
// No gradients - professional, clean, AI-free aesthetic

export const COLORS = {
  // Primary Yellow Palette (Main brand color - inspired by modern design)
  yellow: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',  // Main yellow accent
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Cyan/Light Blue Palette (Secondary accent color)
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',  // Main cyan accent
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
  },
  
  // Neutral Grays (For backgrounds and text)
  gray: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },
  
  // Semantic Colors (Solid only)
  success: '#22C55E',    // Green-500
  error: '#EF4444',      // Red-500
  warning: '#FBBF24',    // Yellow-400 (matches primary)
  info: '#22D3EE',       // Cyan-400 (matches secondary)
  
  // Option Colors (for quiz buttons - solid colors)
  options: {
    red: '#DC2626',      // Red-600
    yellow: '#EAB308',   // Yellow-500
    green: '#16A34A',    // Green-600
    blue: '#2563EB',     // Blue-600
  },
  
  // Black background (PixelBlast compatible)
  background: {
    primary: '#000000',
    secondary: '#0A0A0A',
    tertiary: '#141414',
  },
} as const;

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export const SIZES = {
  // Button sizes
  button: {
    sm: { height: '2rem', px: '0.75rem', text: '0.875rem' },      // 32px height
    md: { height: '2.75rem', px: '1rem', text: '1rem' },          // 44px height (touch-friendly)
    lg: { height: '3.5rem', px: '1.5rem', text: '1.125rem' },     // 56px height
  },
  
  // Input sizes
  input: {
    sm: { height: '2rem', px: '0.75rem', text: '0.875rem' },
    md: { height: '2.75rem', px: '1rem', text: '1rem' },
    lg: { height: '3.5rem', px: '1.25rem', text: '1.125rem' },
  },
  
  // Card padding
  card: {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  },
  
  // Icon sizes
  icon: {
    xs: '1rem',    // 16px
    sm: '1.25rem', // 20px
    md: '1.5rem',  // 24px
    lg: '2rem',    // 32px
    xl: '2.5rem',  // 40px
  },
} as const;

export const TYPOGRAPHY = {
  // Font families
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
  
  // Font weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  
  // Font sizes
  size: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
} as const;

export const BORDERS = {
  radius: {
    none: '0',
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  width: {
    thin: '1px',
    normal: '2px',
    thick: '3px',
  },
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  none: 'none',
} as const;

export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',
} as const;

// Opacity levels for overlays and disabled states
export const OPACITY = {
  disabled: 0.5,
  hover: 0.8,
  overlay: 0.6,
  subtle: 0.3,
} as const;

// Z-index scale
export const Z_INDEX = {
  background: -1,
  base: 0,
  content: 10,
  sidebar: 40,
  header: 50,
  modal: 100,
  toast: 200,
} as const;

// Animation durations
export const ANIMATION = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
} as const;
