# 🌳 CreativePricing Component Architecture

## Component Structure

```
📦 Your QuizApp
│
├── 📂 components/
│   ├── 📂 ui/
│   │   ├── ✨ creative-pricing.tsx          [NEW] Main component
│   │   ├── 🎯 creative-pricing-demo.tsx     [NEW] Demo/example
│   │   ├── 🔘 button-shadcn.tsx            [NEW] Shadcn button
│   │   ├── 📜 button.tsx                    [EXISTING] Your button
│   │   ├── 📄 header-2.tsx
│   │   └── ...other components
│   │
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...other components
│
├── 📂 screens/
│   ├── ✨ CreativePricingScreen.tsx         [NEW] Ready screen
│   ├── 💰 PricingScreen.tsx                 [EXISTING] Original
│   ├── 🏠 HomeScreen.tsx
│   ├── 🎯 LandingScreen.tsx
│   └── ...other screens
│
├── 📂 lib/
│   └── 🛠️ utils.ts                          [UPDATED] Added clsx support
│
├── ⚙️ tailwind.config.cjs                   [UPDATED] Added handwritten font
├── 📦 package.json                          [UPDATED] New dependencies
└── 📖 CREATIVE_PRICING_*.md                 [NEW] Documentation
```

## Component Dependencies

```
CreativePricing Component
│
├── Depends On:
│   ├── ButtonShadcn (components/ui/button-shadcn.tsx)
│   ├── cn() utility (lib/utils.ts)
│   ├── lucide-react icons (Check, Pencil, Star, Sparkles)
│   └── React
│
├── Uses:
│   ├── Tailwind CSS classes
│   ├── font-handwritten (Comic Sans MS fallback)
│   ├── Dark mode support (dark: variants)
│   └── Responsive grid (md:grid-cols-3)
│
└── Exports:
    ├── CreativePricing (function component)
    └── PricingTier (TypeScript interface)
```

## Data Flow

```
Your App/Screen
     │
     │ passes
     │
     ├─→ tag?: string
     ├─→ title?: string
     ├─→ description?: string
     └─→ tiers: PricingTier[]
         │
         │ each tier contains:
         │
         ├─→ name: string
         ├─→ icon: React.ReactNode (lucide icon)
         ├─→ price: number
         ├─→ description: string
         ├─→ features: string[]
         ├─→ popular?: boolean
         └─→ color: string
              │
              ↓
         CreativePricing Component
              │
              │ renders
              │
              ├─→ Header section (tag, title, description)
              ├─→ Grid of pricing cards
              │   └─→ Each card:
              │       ├─→ Popular badge (if popular)
              │       ├─→ Icon
              │       ├─→ Name & description
              │       ├─→ Price (₹{price})
              │       ├─→ Feature list (with checkmarks)
              │       └─→ ButtonShadcn (Get Started)
              │
              └─→ Background decorations (✎ ✏️)
```

## Screen Hierarchy

### Option 1: Using CreativePricingScreen (Recommended)

```
App.tsx
  │
  └─→ CreativePricingScreen
        │
        ├─→ Header (with back button)
        │
        ├─→ CreativePricing Component
        │     │
        │     ├─→ Pricing header
        │     ├─→ 3 pricing cards
        │     │   └─→ ButtonShadcn (each)
        │     └─→ Background elements
        │
        ├─→ Additional info section
        ├─→ Features showcase (3 columns)
        │
        └─→ Footer
```

### Option 2: Using Component Directly

```
Your Custom Screen/Page
  │
  └─→ CreativePricing Component
        │ (you control everything around it)
        │
        ├─→ Pricing header
        ├─→ 3 pricing cards
        └─→ Background elements
```

## Styling Architecture

```
Tailwind Classes Used:
│
├── Layout
│   ├── Flexbox (flex, items-center, justify-center)
│   ├── Grid (grid, grid-cols-1, md:grid-cols-3)
│   └── Spacing (gap-8, mb-16, p-6)
│
├── Typography
│   ├── font-handwritten (custom font family)
│   ├── text-4xl, text-xl, text-lg
│   └── font-bold
│
├── Colors
│   ├── zinc-900 (dark backgrounds)
│   ├── zinc-50 (light backgrounds)
│   ├── amber-400 (popular badge, buttons)
│   ├── blue-500 (accents)
│   └── dark: variants (for dark mode)
│
├── Effects
│   ├── rotate-[-1deg], rotate-[1deg] (playful tilt)
│   ├── shadow-[4px_4px_0px_0px] (neobrutalism shadow)
│   ├── blur-sm (background underline)
│   └── transition-all (smooth animations)
│
└── Interactive
    ├── hover:shadow-[8px_8px_0px_0px]
    ├── hover:translate-x-[-4px]
    ├── group-hover: (parent-child interactions)
    └── active: states
```

## Integration Points

### Where to Import CreativePricing

```
✅ Landing Page
   └─→ Show pricing immediately to visitors

✅ Pricing Screen
   └─→ Dedicated pricing page (CreativePricingScreen.tsx)

✅ Dashboard
   └─→ Upgrade prompts for free users

✅ Modals
   └─→ Quick pricing comparison in popup

✅ Footer
   └─→ Link to pricing page

✅ Navigation
   └─→ Menu item for pricing
```

### How to Connect CTAs

```typescript
// In CreativePricingScreen.tsx or your custom screen

const handleGetStarted = (tierName: string) => {
  if (tierName === 'Free') {
    setScreen('student_join');  // Or 'admin_signup'
  } else {
    setScreen('admin_signup');  // Redirect to signup
  }
};

// Then modify the component to accept onGetStarted:
<CreativePricing
  tiers={tiers}
  onGetStarted={handleGetStarted}  // Pass handler
/>
```

## File Relationships

```
App.tsx
  │ imports
  ├─→ CreativePricingScreen.tsx
        │ imports
        ├─→ creative-pricing.tsx (component)
        │     │ imports
        │     ├─→ button-shadcn.tsx
        │     ├─→ lib/utils.ts (cn function)
        │     └─→ lucide-react (icons)
        │
        ├─→ Header.tsx
        └─→ Footer.tsx
```

## TypeScript Types

```typescript
// Exported from creative-pricing.tsx

interface PricingTier {
  name: string;           // Required
  icon: React.ReactNode;  // Required
  price: number;          // Required
  description: string;    // Required
  features: string[];     // Required
  popular?: boolean;      // Optional
  color: string;         // Required
}

interface CreativePricingProps {
  tag?: string;           // Optional, default: "Simple Pricing"
  title?: string;         // Optional, default: "Make Short Videos That Pop"
  description?: string;   // Optional, default: "Edit, enhance, and go viral in minutes"
  tiers: PricingTier[];   // Required
}
```

## Responsive Behavior

```
Mobile (< 768px)
├─→ Single column
├─→ Cards stack vertically
├─→ Full width cards
└─→ Reduced spacing

Tablet/Desktop (≥ 768px)
├─→ 3-column grid
├─→ Cards side-by-side
├─→ Playful rotations visible
└─→ Larger spacing
```

## Accessibility Features

```
✅ Semantic HTML
   └─→ Proper heading hierarchy (h2, h3)

✅ Keyboard Navigation
   └─→ All buttons are focusable

✅ Screen Reader Friendly
   └─→ Clear labels and descriptions

✅ Color Contrast
   └─→ WCAG AA compliant (dark text on light bg)

✅ Focus Indicators
   └─→ focus-visible:ring-2 on buttons
```

## Performance Considerations

```
✅ No heavy dependencies
   └─→ Only lucide-react icons (tree-shakeable)

✅ Static rendering
   └─→ No API calls or data fetching

✅ Optimized CSS
   └─→ Tailwind purges unused styles

✅ No images
   └─→ Uses text emojis and SVG icons

✅ Minimal JavaScript
   └─→ Only hover interactions
```

---

## Quick Reference: What's Where

| What | Where | Purpose |
|------|-------|---------|
| Main component | `components/ui/creative-pricing.tsx` | The pricing component |
| Demo | `components/ui/creative-pricing-demo.tsx` | Example usage |
| Button | `components/ui/button-shadcn.tsx` | Shadcn-style button |
| Screen | `screens/CreativePricingScreen.tsx` | Ready-to-use page |
| Utils | `lib/utils.ts` | cn() helper function |
| Docs | `CREATIVE_PRICING_*.md` | Integration guides |

---

**This architecture follows:**
- ✅ shadcn/ui patterns
- ✅ React best practices
- ✅ TypeScript strict typing
- ✅ Tailwind CSS conventions
- ✅ Responsive design principles
- ✅ Accessibility standards
