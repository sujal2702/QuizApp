// PixelBlast Quick Presets for Different Screens
// Copy and paste these configurations as needed

// 1. QUIZ SCREEN - High Energy
export const quizScreenConfig = {
  variant: "circle" as const,
  pixelSize: 5,
  color: "#A855F7", // Purple-500
  patternScale: 3.5,
  patternDensity: 1.3,
  pixelSizeJitter: 0.6,
  enableRipples: true,
  rippleSpeed: 0.6,
  rippleThickness: 0.1,
  rippleIntensityScale: 2,
  liquid: true,
  liquidStrength: 0.15,
  liquidRadius: 1.3,
  liquidWobbleSpeed: 6,
  speed: 0.7,
  edgeFade: 0.2,
  transparent: true
};

// 2. LOBBY SCREEN - Calm Waiting
export const lobbyScreenConfig = {
  variant: "diamond" as const,
  pixelSize: 7,
  color: "#8B5CF6", // Violet-500
  patternScale: 2,
  patternDensity: 0.9,
  pixelSizeJitter: 0.3,
  enableRipples: true,
  rippleSpeed: 0.3,
  rippleThickness: 0.15,
  rippleIntensityScale: 1.2,
  liquid: false,
  speed: 0.4,
  edgeFade: 0.4,
  transparent: true
};

// 3. RESULTS SCREEN - Celebration
export const resultsScreenConfig = {
  variant: "circle" as const,
  pixelSize: 4,
  color: "#C084FC", // Purple-400
  patternScale: 4,
  patternDensity: 1.5,
  pixelSizeJitter: 0.8,
  enableRipples: true,
  rippleSpeed: 0.5,
  rippleThickness: 0.08,
  rippleIntensityScale: 2.5,
  liquid: true,
  liquidStrength: 0.18,
  liquidRadius: 1.5,
  liquidWobbleSpeed: 7,
  speed: 0.8,
  edgeFade: 0.15,
  transparent: true
};

// 4. AUTH SCREENS - Professional
export const authScreenConfig = {
  variant: "square" as const,
  pixelSize: 8,
  color: "#7C3AED", // Violet-600
  patternScale: 2.5,
  patternDensity: 0.8,
  pixelSizeJitter: 0.2,
  enableRipples: true,
  rippleSpeed: 0.35,
  rippleThickness: 0.12,
  rippleIntensityScale: 1,
  liquid: false,
  speed: 0.45,
  edgeFade: 0.5,
  transparent: true
};

// 5. LANDING PAGE - Eye-Catching
export const landingScreenConfig = {
  variant: "circle" as const,
  pixelSize: 5,
  color: "#A78BFA", // Violet-400
  patternScale: 2.5,
  patternDensity: 1.1,
  pixelSizeJitter: 0.4,
  enableRipples: true,
  rippleSpeed: 0.5,
  rippleThickness: 0.15,
  rippleIntensityScale: 1.8,
  liquid: true,
  liquidStrength: 0.15,
  liquidRadius: 1.5,
  liquidWobbleSpeed: 4,
  speed: 0.5,
  edgeFade: 0.3,
  transparent: true
};

// 6. MINIMAL - Best Performance
export const minimalConfig = {
  variant: "square" as const,
  pixelSize: 10,
  color: "#8B5CF6",
  patternScale: 2,
  patternDensity: 0.6,
  pixelSizeJitter: 0,
  enableRipples: false,
  liquid: false,
  speed: 0.3,
  edgeFade: 0.6,
  transparent: true
};

// 7. MAXIMUM IMPACT - High Performance Required
export const maximalConfig = {
  variant: "circle" as const,
  pixelSize: 3,
  color: "#A855F7",
  patternScale: 4,
  patternDensity: 1.8,
  pixelSizeJitter: 1,
  enableRipples: true,
  rippleSpeed: 0.8,
  rippleThickness: 0.05,
  rippleIntensityScale: 3,
  liquid: true,
  liquidStrength: 0.25,
  liquidRadius: 2,
  liquidWobbleSpeed: 8,
  speed: 1,
  edgeFade: 0.1,
  transparent: true
};

// HOW TO USE:
// Import the preset you want and spread it into the PixelBlast component:
// 
// import { quizScreenConfig } from './pixelblast-presets';
// 
// <PixelBlast {...quizScreenConfig} />
