// Theme constants for consistent styling across the app
// These match the values defined in theme.ts

export const COLORS = {
  primary: {
    main: '#e91e63',
    light: '#ffc1cc',
    dark: '#c2185b',
  },
  secondary: {
    main: '#ff4081',
    light: '#ff79b0',
    dark: '#c60055',
  },
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
  },
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
  },
  error: {
    main: '#e74c3c',
  },
  success: {
    main: '#27ae60',
  },
  warning: {
    main: '#f39c12',
  },
} as const;

// Common gradient patterns used across the app
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.secondary.main} 100%)`,
  primaryHover: `linear-gradient(135deg, ${COLORS.primary.dark} 0%, ${COLORS.primary.main} 100%)`,
  primaryAlt: `linear-gradient(45deg, ${COLORS.primary.main}, ${COLORS.secondary.main})`,
  primaryAltHover: `linear-gradient(45deg, ${COLORS.primary.dark}, ${COLORS.primary.main})`,
  progress: `linear-gradient(90deg, ${COLORS.secondary.main}, ${COLORS.primary.main})`,
} as const;

// Font family constant to ensure consistency
export const FONT_FAMILY = '"Poppins", "Roboto", "Helvetica Neue", Arial, sans-serif';

// Common spacing and sizing constants
export const SPACING = {
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
} as const;