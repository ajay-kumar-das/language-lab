# LinguaLeap UI Design System & Mockups

## Design System Foundation

### Color Palette

#### Primary Colors
- **Primary Blue**: #2563EB (primary-600)
  - Light: #DBEAFE (primary-100) 
  - Medium: #3B82F6 (primary-500)
  - Dark: #1D4ED8 (primary-700)
  - Used for: Primary actions, links, focus states

#### Secondary Colors  
- **Success Green**: #10B981 (emerald-500)
  - Light: #D1FAE5 (emerald-100)
  - Dark: #059669 (emerald-600)
  - Used for: Success states, achievements, positive feedback

- **Warning Orange**: #F59E0B (amber-500)
  - Light: #FEF3C7 (amber-100)
  - Dark: #D97706 (amber-600)
  - Used for: Warnings, streaks, motivation elements

- **Error Red**: #EF4444 (red-500)
  - Light: #FEE2E2 (red-100)
  - Dark: #DC2626 (red-600)
  - Used for: Errors, incorrect answers

- **Accent Coral**: #F43F5E (rose-500)
  - Light: #FCE7F3 (rose-100)
  - Dark: #E11D48 (rose-600)
  - Used for: Special highlights, gamification elements

#### Neutral Colors
- **Text Primary**: #111827 (gray-900)
- **Text Secondary**: #6B7280 (gray-500)
- **Text Muted**: #9CA3AF (gray-400)
- **Background**: #F9FAFB (gray-50)
- **Surface**: #FFFFFF (white)
- **Border**: #E5E7EB (gray-200)
- **Divider**: #F3F4F6 (gray-100)

#### Accessibility Colors
- **High Contrast Background**: #000000
- **High Contrast Text**: #FFFFFF
- **Focus Ring**: #2563EB with 20% opacity
- **Skip Link**: #2563EB

### Typography Scale

#### Font Families
- **Primary**: "Inter", system-ui, -apple-system, sans-serif
- **Heading**: "Inter", system-ui, -apple-system, sans-serif
- **Monospace**: "SF Mono", "Monaco", "Inconsolata", monospace

#### Font Sizes (with line heights)
- **xs**: 0.75rem / 1rem (12px / 16px)
- **sm**: 0.875rem / 1.25rem (14px / 20px)
- **base**: 1rem / 1.5rem (16px / 24px)
- **lg**: 1.125rem / 1.75rem (18px / 28px)
- **xl**: 1.25rem / 1.75rem (20px / 28px)
- **2xl**: 1.5rem / 2rem (24px / 32px)
- **3xl**: 1.875rem / 2.25rem (30px / 36px)
- **4xl**: 2.25rem / 2.5rem (36px / 40px)
- **5xl**: 3rem / 1 (48px / 48px)
- **6xl**: 3.75rem / 1 (60px / 60px)

#### Font Weights
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

### Spacing System (8px base unit)

- **0**: 0px
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

### Border Radius

- **None**: 0px
- **SM**: 0.125rem (2px)
- **Default**: 0.25rem (4px)
- **MD**: 0.375rem (6px)
- **LG**: 0.5rem (8px)
- **XL**: 0.75rem (12px)
- **2XL**: 1rem (16px)
- **3XL**: 1.5rem (24px)
- **Full**: 9999px

### Shadows

- **SM**: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- **Default**: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
- **MD**: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- **LG**: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
- **XL**: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
- **2XL**: 0 25px 50px -12px rgb(0 0 0 / 0.25)
- **Inner**: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)

---

## Responsive Breakpoints

- **Mobile**: 320px - 767px (sm)
- **Tablet**: 768px - 1023px (md)  
- **Desktop**: 1024px - 1279px (lg)
- **Large Desktop**: 1280px+ (xl)

### Touch Target Guidelines
- **Minimum**: 44px x 44px (iOS) / 48dp (Android)
- **Recommended**: 48px x 48px
- **Spacing**: 8px minimum between touch targets

---

## Animation & Transitions

### Duration
- **Fast**: 150ms (micro-interactions)
- **Normal**: 200ms (standard transitions)
- **Slow**: 300ms (complex animations)
- **Slower**: 500ms (page transitions)

### Easing
- **Ease-in**: cubic-bezier(0.4, 0, 1, 1)
- **Ease-out**: cubic-bezier(0, 0, 0.2, 1) (recommended)
- **Ease-in-out**: cubic-bezier(0.4, 0, 0.2, 1)
- **Bounce**: cubic-bezier(0.68, -0.55, 0.265, 1.55)

---

## Accessibility Standards

### WCAG 2.1 AA Requirements
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Semantic HTML and ARIA labels
- **Motion**: Respect prefers-reduced-motion setting

### High Contrast Mode
- **Background**: #000000
- **Text**: #FFFFFF  
- **Primary**: #00FFFF (cyan)
- **Success**: #00FF00 (lime)
- **Warning**: #FFFF00 (yellow)
- **Error**: #FF0000 (red)

---

## Component Specifications

### Buttons

#### Primary Button
```
Background: primary-600 (#2563EB)
Text: white
Hover: primary-700 (#1D4ED8)
Focus: primary-600 with focus ring
Disabled: gray-300 background, gray-500 text
Padding: 12px 24px (py-3 px-6)
Border Radius: 8px (rounded-lg)
Font: medium weight, base size
Min Height: 44px
```

#### Secondary Button  
```
Background: white
Border: 1px solid gray-300
Text: gray-700
Hover: gray-50 background
Focus: gray-300 border with focus ring
Disabled: gray-100 background, gray-400 text
Padding: 12px 24px (py-3 px-6)
Border Radius: 8px (rounded-lg)
Font: medium weight, base size
Min Height: 44px
```

#### Icon Button
```
Size: 44px x 44px minimum
Background: transparent
Hover: gray-100 background
Focus: gray-200 background with focus ring
Border Radius: 8px (rounded-lg)
Icon Size: 20px (h-5 w-5)
```

### Form Elements

#### Input Field
```
Background: white
Border: 1px solid gray-300
Focus: primary-600 border with focus ring
Error: red-500 border
Padding: 12px 16px (py-3 px-4)
Border Radius: 6px (rounded-md)
Font: base size
Min Height: 44px
Placeholder: gray-400
```

#### Textarea
```
Same as input field
Min Height: 120px
Resize: vertical only
```

#### Select Dropdown
```
Same as input field
Arrow Icon: 20px gray-400
```

### Cards

#### Basic Card
```
Background: white
Border: 1px solid gray-200
Border Radius: 12px (rounded-xl)
Shadow: default shadow
Padding: 24px (p-6)
```

#### Elevated Card
```
Same as basic card
Shadow: lg shadow
Hover: xl shadow (subtle lift)
```

#### Interactive Card
```
Same as elevated card  
Hover: transform scale(1.02)
Transition: 200ms ease-out
Cursor: pointer
```

### Progress Indicators

#### Progress Bar
```
Background: gray-200
Fill: primary-600
Height: 8px
Border Radius: full (rounded-full)
Animation: smooth fill transition
```

#### Circular Progress
```
Stroke: gray-200 (background)
Fill: primary-600
Stroke Width: 8px
Size: 64px standard, 32px small
Animation: smooth arc fill
```

### Badges & Pills

#### Badge
```
Background: primary-100
Text: primary-800
Padding: 4px 8px (py-1 px-2)
Border Radius: 6px (rounded-md)
Font: xs size, medium weight
```

#### Status Pills
```
Success: emerald-100 background, emerald-800 text
Warning: amber-100 background, amber-800 text
Error: red-100 background, red-800 text
Info: blue-100 background, blue-800 text
Padding: 4px 12px (py-1 px-3)
Border Radius: full (rounded-full)
Font: sm size, medium weight
```

### Navigation

#### Sidebar Navigation Item
```
Padding: 12px 16px (py-3 px-4)
Border Radius: 8px (rounded-lg)
Font: medium weight, base size
Min Height: 44px

Active State:
- Background: primary-50
- Text: primary-700
- Icon: primary-600

Hover State:
- Background: gray-50
- Text: gray-900
```

#### Tab Navigation
```
Padding: 12px 16px (py-3 px-4)
Border Bottom: 2px transparent
Font: medium weight, sm size
Min Height: 44px

Active State:
- Border Bottom: 2px primary-600
- Text: primary-600

Hover State:
- Text: gray-700
```

---
