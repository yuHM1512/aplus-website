---
name: APLUS Admin Interface
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#454653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
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
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  deep-blue: '#102590'
  ocean-blue: '#006EF5'
  surface-gray: '#F8FAFC'
  border-gray: '#E2E8F0'
  success-green: '#10B981'
  warning-amber: '#F59E0B'
  error-red: '#EF4444'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: Courier Prime
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 260px
  container-padding: 2rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 1.5rem
---

## Brand & Style

The design system for the APLUS Technologies Admin Panel is built on a **Corporate / Modern** aesthetic, prioritizing data density, high legibility, and operational efficiency. While the consumer-facing site is expressive and brochure-like, this admin interface is a high-performance workspace designed for internal management and AI-assisted content creation.

The personality is professional, systematic, and reliable. It utilizes a **Flat Design** approach to minimize cognitive load, using subtle depth cues only where necessary to indicate hierarchy or interaction. The interface should evoke a sense of precision and control, reflecting APLUS's status as a technical solution provider in water filtration.

Key style attributes include:
- **Clean Lines:** Sharp definition between navigation and content areas.
- **Data-First Layouts:** Wide tables and structured forms that maximize screen real estate.
- **Subtle Interactions:** Hover states and transitions are swift and functional rather than decorative.

## Colors

The palette is anchored by **Deep Blue (#102590)** for structural brand elements and **Ocean Blue (#006EF5)** for interactive components. Unlike the marketing site, the admin panel uses a foundation of **Slate and Zinc neutrals** to maintain a calm, non-distracting work environment.

- **Primary (Deep Blue):** Reserved for sidebar backgrounds, primary navigation headers, and core brand identifiers.
- **Secondary (Ocean Blue):** Used for primary buttons, active tab indicators, checkboxes, and focus rings.
- **Neutral (Slate):** A range of grays used for text, borders, and subtle background shading. 
- **Functional Colors:** Standardized semantic colors for status indicators (Success, Warning, Error) to ensure immediate recognition of system states and validation.

The default mode is **Light**, optimized for day-long productivity with high contrast between text and the white/off-white background surfaces.

## Typography

This design system exclusively uses **Inter** for all UI elements to ensure maximum readability and a clean, systematic appearance. For technical areas, such as API keys or token logs, **Courier Prime** is used as a secondary monospace font.

Typography is scaled to handle complex data visualizations. `Label-sm` is utilized for table headers and section subtitles to provide clear categorization without occupying excessive space. `Body-md` is the standard size for all data entries and form inputs. For the AI Writing Tab, `Body-lg` is preferred to provide a more comfortable reading experience for long-form content editing.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains fixed at 260px, while the main content area expands to fill the remaining viewport width, capped at 1600px for optimal readability on ultra-wide monitors.

A strict **8px spacing grid** governs all margins and paddings. 
- **Margins:** 2rem (32px) padding for main page containers.
- **Gutters:** 1.5rem (24px) spacing between cards and grid items.
- **Forms:** Labels and inputs are separated by 0.5rem (8px), with 1.5rem (24px) vertical spacing between form groups.

For the **Data Tables**, a condensed vertical rhythm is used (12px padding per row) to allow more information to be visible above the fold.

## Elevation & Depth

This system utilizes **Tonal Layers** rather than heavy shadows to convey hierarchy, maintaining a crisp, flat aesthetic.

- **Level 0 (Background):** The base page background uses `surface-gray` (#F8FAFC) to distinguish from white interactive elements.
- **Level 1 (Cards/Surface):** Main content containers, data tables, and forms are pure white with a 1px `border-gray` (#E2E8F0) outline.
- **Shadow-sm:** A very subtle, neutral shadow (0 1px 2px 0 rgba(0, 0, 0, 0.05)) is applied only to primary cards and floating menus to provide just enough separation from the background.
- **Focus States:** Focused inputs and active buttons utilize a 2px outer glow in `ocean-blue` at 20% opacity.

## Shapes

The shape language is geometric and balanced. To create a distinction between structural layout elements and interactive components:
- **Cards and Containers:** Use an 8px (rounded-lg) corner radius for a soft but professional feel.
- **Buttons and Inputs:** Use a 6px corner radius to feel slightly more precise and actionable.
- **Status Badges:** Use a fully rounded (pill) shape to differentiate them from interactive buttons.
- **Images:** Product thumbnails use a 4px radius to maintain structure within table rows.

## Components

### Sidebar Navigation
- **Background:** Deep Blue (#102590).
- **Active State:** A vertical Ocean Blue strip on the left edge with a subtle background highlight (10% opacity white).
- **Icons:** Minimalist 20px stroke icons in white/light gray.

### Data Tables
- **Header:** Light gray background (#F1F5F9), uppercase labels, bold 1px bottom border.
- **Rows:** Alternating zebra stripes are not used; instead, use thin 1px separators and a light gray hover state for the entire row.

### Buttons
- **Primary:** Ocean Blue background, white text, 6px radius.
- **Secondary:** White background, 1px gray border, Slate text.
- **AI Action:** Use a subtle gradient from Ocean Blue to Deep Blue to signify "special" AI functionality.

### Form Inputs
- **Default:** White background, 1px Slate-200 border, 6px radius.
- **Focus:** 1px Ocean Blue border with a soft focus ring.
- **Rich Text Editor (TipTap):** Toolbar should be "sticky" at the top of the viewport when scrolling long AI-generated articles.

### Stat Cards
- Simple white containers with a prominent numeric value (Headline-lg) and a secondary label. Include a small sparkline or percentage change indicator in the top right corner.

### Tabs
- **Underline Style:** Active tab indicated by a 2px Ocean Blue bottom border and bold text. Transition between "Manual" and "AI" modes should be instantaneous with no layout shift.