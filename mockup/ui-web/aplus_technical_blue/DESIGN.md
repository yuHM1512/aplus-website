---
name: Aplus Technical Blue
colors:
  surface: '#fbf8ff'
  surface-dim: '#dbd9e2'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fc'
  surface-container: '#efedf6'
  surface-container-high: '#e9e7f0'
  surface-container-highest: '#e3e1eb'
  on-surface: '#1b1b22'
  on-surface-variant: '#454653'
  inverse-surface: '#2f3037'
  inverse-on-surface: '#f2eff9'
  outline: '#757684'
  outline-variant: '#c5c5d5'
  surface-tint: '#4454bc'
  primary: '#001167'
  on-primary: '#ffffff'
  primary-container: '#102590'
  on-primary-container: '#8495ff'
  inverse-primary: '#bbc3ff'
  secondary: '#0056c3'
  on-secondary: '#ffffff'
  secondary-container: '#006ef4'
  on-secondary-container: '#fefcff'
  tertiary: '#420a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#681500'
  on-tertiary-container: '#f27a5b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#000e5e'
  on-primary-fixed-variant: '#293ba3'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#afc6ff'
  on-secondary-fixed: '#001944'
  on-secondary-fixed-variant: '#004299'
  tertiary-fixed: '#ffdbd2'
  tertiary-fixed-dim: '#ffb4a1'
  on-tertiary-fixed: '#3c0800'
  on-tertiary-fixed-variant: '#82270f'
  background: '#fbf8ff'
  on-background: '#1b1b22'
  surface-variant: '#e3e1eb'
typography:
  h1:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.3'
  h2-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  section-gap: 5rem
  container-padding: 1.5rem
  gutter: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

This design system centers on a professional, high-trust industrial aesthetic tailored for water technology and engineering. The brand personality is authoritative yet refreshing, emphasizing purity, precision, and technological advancement.

The design style is **Modern Flat**. By prioritizing crisp edges, substantial vertical breathing room, and a palette of cooling blues, the UI achieves a sense of "technological flow." We avoid heavy shadows and complex gradients in favor of structural clarity and solid color blocks. Decorative elements are limited to thin, light-blue "wave" lines that evoke fluid dynamics without compromising the technical integrity of the layout. All communication is optimized for a Vietnamese-speaking audience, requiring a typography system that handles diacritics with grace and legibility.

## Colors

The palette is a tiered monochromatic exploration of blue, structured for maximum functional hierarchy.

- **Primary (#102590):** Used for critical brand moments including the navigation bar, primary headings, and high-priority action buttons.
- **Secondary (#006EF5):** Dedicated to interactive elements like inline links and secondary calls-to-action.
- **Background & Footer (#020035):** A deep, near-black blue used to anchor the page in the footer and for high-impact section overlays.
- **Highlight (#36D1FF):** Reserved for hover states and decorative line-work to represent "activated" water or technology.
- **Surface (#B5DBFF):** A soft powder blue used for card backgrounds to differentiate content modules from the main off-white page background.
- **Neutrals:** Off-white is the default page canvas, while pure white is used for card interiors or input fields to provide a clean, "sanitary" feel.

## Typography

The design system utilizes **Inter** as the universal typeface to ensure maximum clarity and full support for Vietnamese characters. 

Headings are rendered in Bold (700) to provide a heavy, "Gilroy-like" presence that commands attention. Line heights are kept tight for headings to maintain impact, while body text uses a generous 1.5–1.6 scale to enhance readability in technical descriptions. For mobile screens, H1 and H2 levels scale down to prevent awkward word breaks in long Vietnamese compound words.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a max-width container of 1280px.

- **Vertical Rhythm:** Sections are separated by a strict `py-20` (80px or 5rem) padding to create a premium, unhurried browsing experience. 
- **Internal Spacing:** Content within cards should follow the `stack-md` (16px) rule for consistent breathing room.
- **Breakpoints:**
  - **Mobile (<768px):** 1-column layout, 24px horizontal margins.
  - **Tablet (768px - 1024px):** 2-column layout for cards, 40px horizontal margins.
  - **Desktop (>1024px):** 12-column grid, 16px gutters, 80px vertical section gaps.

## Elevation & Depth

True to a **Flat Design** philosophy, this system eschews shadows and depth cues. Instead, hierarchy is established through:

1.  **Color Blocking:** Darker backgrounds (Background/Footer) for primary navigation and information-heavy footers.
2.  **Surface Tiers:** Using "Powder Blue" (#B5DBFF) for card surfaces to lift them visually against the "Off-White" (#F2F3F4) background.
3.  **Flat Outlines:** Interactive elements may use a 1px solid border in the Primary or Secondary color to define boundaries without adding "weight."
4.  **Zero-Shadows:** No drop shadows are permitted on buttons or cards. Depth is purely a matter of color contrast.

## Shapes

The shape language is structured and precise, with specific radii assigned to different element classes to create a subtle hierarchy of softness:

- **Interactive Elements (Buttons/Inputs):** 6px radius for a sharp, technical feel.
- **Structural Containers (Cards):** 8px radius for a slightly softer approach to content framing.
- **Media (Images/Videos):** 12px radius to give photography a modern, finished look that contrasts with the sharper UI elements.

## Components

### Buttons
- **Primary:** Solid #102590 background, White text, 6px radius. No shadow. Hover: #36D1FF background with Primary text.
- **Secondary:** Solid #006EF5 background, White text, 6px radius. Hover: Background color lightens by 10%.

### Cards
- **Background:** #B5DBFF (Powder Blue).
- **Radius:** 8px.
- **Padding:** 24px (1.5rem) uniform.
- **Style:** Flat, no border or shadow. Text should be Primary #111827.

### Input Fields
- **Background:** #FFFFFF (Pure White).
- **Border:** 1px solid #B5DBFF.
- **Focus State:** 1px solid #006EF5. 
- **Radius:** 6px.

### Icons
- **Style:** Lucide (Line-style) only.
- **Stroke Width:** 2px for standard icons, 1.5px for large display icons.
- **Color:** Use Secondary #006EF5 for feature icons to draw the eye.

### Lists & Tables
- **Lists:** Use a small 8px solid square or a "wave" line icon as a bullet point in Secondary Blue.
- **Tables:** Header row should be Primary Blue (#102590) with White text. Rows use alternating Pure White and Off-White backgrounds.