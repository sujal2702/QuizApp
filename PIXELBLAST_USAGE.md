# PixelBlast Background - Usage Guide

## Overview
PixelBlast is an interactive WebGL-powered background component with liquid effects, ripples, and customizable patterns.

## Current Implementation

### App.tsx
The PixelBlast background is used on all screens except the landing page:
```tsx
<PixelBlast
  variant="circle"
  pixelSize={6}
  color="#8B5CF6"          // Violet-500
  patternScale={3}
  patternDensity={1.2}
  pixelSizeJitter={0.5}
  enableRipples
  rippleSpeed={0.4}
  rippleThickness={0.12}
  rippleIntensityScale={1.5}
  liquid
  liquidStrength={0.12}
  liquidRadius={1.2}
  liquidWobbleSpeed={5}
  speed={0.6}
  edgeFade={0.25}
  transparent
/>
```

### LandingScreen.tsx
A slightly different configuration for the landing page:
```tsx
<PixelBlast
  variant="circle"
  pixelSize={5}
  color="#A78BFA"          // Violet-400
  patternScale={2.5}
  patternDensity={1.1}
  pixelSizeJitter={0.4}
  enableRipples
  rippleSpeed={0.5}
  rippleThickness={0.15}
  rippleIntensityScale={1.8}
  liquid
  liquidStrength={0.15}
  liquidRadius={1.5}
  liquidWobbleSpeed={4}
  speed={0.5}
  edgeFade={0.3}
  transparent
/>
```

## Available Props

### Shape Variants
- `variant`: 'square' | 'circle' | 'triangle' | 'diamond'
  - Default: 'square'
  - Choose the shape of individual pixels

### Basic Styling
- `pixelSize`: number (default: 3)
  - Size of each pixel/shape in the pattern
- `color`: string (default: '#B19EEF')
  - Hex color for the pattern
- `transparent`: boolean (default: true)
  - Makes background transparent
- `edgeFade`: number (0-1, default: 0.5)
  - Fade effect at screen edges

### Pattern Controls
- `patternScale`: number (default: 2)
  - Scale of the underlying noise pattern
- `patternDensity`: number (default: 1)
  - Density of visible pixels
- `pixelSizeJitter`: number (0-1, default: 0)
  - Random size variation per pixel
- `speed`: number (default: 0.5)
  - Animation speed multiplier

### Ripple Effects
- `enableRipples`: boolean (default: true)
  - Enable click/touch ripple effects
- `rippleSpeed`: number (default: 0.3)
  - Speed of ripple expansion
- `rippleThickness`: number (default: 0.1)
  - Width of ripple rings
- `rippleIntensityScale`: number (default: 1)
  - Brightness/strength of ripples

### Liquid Effects
- `liquid`: boolean (default: false)
  - Enable liquid distortion effect
- `liquidStrength`: number (default: 0.1)
  - Intensity of liquid distortion
- `liquidRadius`: number (default: 1)
  - Radius of touch influence
- `liquidWobbleSpeed`: number (default: 4.5)
  - Speed of wobble animation

### Performance
- `antialias`: boolean (default: true)
  - WebGL antialiasing
- `autoPauseOffscreen`: boolean (default: true)
  - Pause when not visible
- `noiseAmount`: number (default: 0)
  - Add film grain effect

## Example Configurations

### Subtle Background (Low Performance Impact)
```tsx
<PixelBlast
  variant="square"
  pixelSize={8}
  color="#8B5CF6"
  patternScale={2}
  patternDensity={0.8}
  enableRipples={false}
  liquid={false}
  speed={0.3}
  edgeFade={0.4}
  transparent
/>
```

### Dynamic Interactive (High Performance Impact)
```tsx
<PixelBlast
  variant="circle"
  pixelSize={4}
  color="#A78BFA"
  patternScale={3}
  patternDensity={1.5}
  pixelSizeJitter={0.8}
  enableRipples
  rippleSpeed={0.5}
  rippleIntensityScale={2}
  liquid
  liquidStrength={0.2}
  liquidRadius={2}
  speed={0.8}
  edgeFade={0.2}
  transparent
/>
```

### Minimal Clean Look
```tsx
<PixelBlast
  variant="diamond"
  pixelSize={10}
  color="#6366F1"
  patternScale={1.5}
  patternDensity={0.6}
  pixelSizeJitter={0.2}
  enableRipples
  rippleSpeed={0.3}
  liquid={false}
  speed={0.4}
  edgeFade={0.5}
  transparent
/>
```

## Tips

1. **Performance**: Disable `liquid` and `enableRipples` for better performance on lower-end devices
2. **Color Match**: Use colors from your theme (#8B5CF6 = violet-500, #A78BFA = violet-400)
3. **Pixel Size**: Larger pixels (8-10) = better performance, smaller pixels (3-5) = more detail
4. **Edge Fade**: Use 0.2-0.4 for prominent backgrounds, 0.5-0.8 for subtle ones
5. **Pattern Density**: Values < 1 create sparse patterns, > 1 create dense patterns
6. **Z-Index**: Ensure the PixelBlast container has lower z-index than your content

## Integration Notes

- Three.js and postprocessing packages are required dependencies
- Component uses WebGL2 - falls back gracefully if not available
- Automatically resizes with container
- Touch/mouse interaction creates ripple effects
- Background is positioned with `fixed` positioning and `pointer-events-none`

## Troubleshooting

**Background not visible:**
- Check z-index hierarchy
- Ensure `transparent` prop is true
- Verify color isn't too dark (#000000 won't show on dark backgrounds)

**Performance issues:**
- Reduce `pixelSize` (larger = faster)
- Disable `liquid` effect
- Set `enableRipples={false}`
- Lower `patternScale` and `patternDensity`

**Interaction not working:**
- Remove `pointer-events-none` if you want clickable ripples
- Ensure `enableRipples` is true
