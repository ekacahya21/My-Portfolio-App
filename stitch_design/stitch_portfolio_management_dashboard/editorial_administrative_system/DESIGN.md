---
name: Editorial Administrative System
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#434844'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#747874'
  outline-variant: '#c4c7c3'
  surface-tint: '#59605b'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#161d19'
  on-primary-container: '#7e8680'
  inverse-primary: '#c1c8c2'
  secondary: '#a43d1e'
  on-secondary: '#ffffff'
  secondary-container: '#fd7f5a'
  on-secondary-container: '#6f1a00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191d15'
  on-tertiary-container: '#81857a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde4dd'
  primary-fixed-dim: '#c1c8c2'
  on-primary-fixed: '#161d19'
  on-primary-fixed-variant: '#414844'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#832608'
  tertiary-fixed: '#e0e4d7'
  tertiary-fixed-dim: '#c4c8bb'
  on-tertiary-fixed: '#191d15'
  on-tertiary-fixed-variant: '#44483f'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-xl:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: DM Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  data-ui:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The design system is built for a professional CMS dashboard that values clarity, authority, and high-end editorial aesthetics. It draws heavily from **Minimalism** and **Modern Editorial** movements, prioritizing content hierarchy and functional elegance over decorative elements. 

The personality is sophisticated and "senior," evoking the feeling of a well-typeset engineering journal or a high-end publishing tool. It avoids the typical "SaaS-blue" corporate look in favor of a warm, humanistic palette that remains highly legible and focused. The UI should feel intentional, structured, and calm, providing a "low-anxiety" environment for complex data management and content creation.

## Colors

The palette is anchored in warm neutrals and a deep "Ink" charcoal, moving away from sterile whites and harsh blacks.

*   **Primary (Ink):** `#121915` — Used for high-emphasis text, primary buttons, and deep footer backgrounds. It provides the necessary weight for an authoritative feel.
*   **Secondary (Terra):** `#E86F4C` — A muted, sophisticated orange used sparingly for accents, critical states, or high-level status indicators.
*   **Neutral (Canvas):** `#F8F7F3` — The base background color. It is a warm, off-white cream that reduces eye strain compared to pure white.
*   **Tertiary (Sage Mist):** `#D8DCCF` — A muted, desaturated green-grey used for subtle section separators, secondary background layers, or ghost elements.
*   **Success/Accent (Olive):** `#5D6B51` — Used for positive status indicators and success states, maintaining the organic, grounded feel of the system.

## Typography

The typography system utilizes a mix of geometric sans-serifs for structural clarity and a monospaced font for technical metadata.

*   **Headlines:** DM Sans provides a confident, slightly condensed geometric feel that works perfectly for bold headers. Use tight letter-spacing for large displays.
*   **Body:** Plus Jakarta Sans offers high readability with a friendly, modern touch. It excels in long-form CMS content and descriptions.
*   **Metadata & Labels:** JetBrains Mono is used for all "system" information, such as timestamps, technical specs, and status labels, reinforcing the "engineering" undercurrent of the dashboard.
*   **Hierarchy:** Maintain a clear distinction between "Editorial" content (using larger DM Sans) and "System" content (using JetBrains Mono).

## Layout & Spacing

This design system uses a **Fluid Grid** model with generous white space to prevent information density fatigue.

*   **Desktop:** 12-column grid with a max-width of 1440px for content containers. Left-aligned layouts are preferred to mimic editorial documents.
*   **Sidebars:** The CMS navigation should occupy a fixed 280px sidebar, using the Tertiary (Sage Mist) color for subtle separation.
*   **Spacing Rhythm:** A 4px baseline is used, but primary components should scale in 8px increments.
*   **Reflow:** On mobile, margins reduce to 20px and columns collapse to a single stack. Use "Section-gap" to define major vertical breaks between different functional areas of the dashboard.

## Elevation & Depth

Depth in this system is achieved through **Tonal Layers** rather than heavy shadows.

*   **Surface Hierarchy:** The base layer is Neutral (Canvas). Secondary containers (like cards or sidebars) use either a subtle border (`1px solid #D8DCCF`) or a slightly darker tonal shift.
*   **Outlines:** Use "Low-contrast outlines" for card containers. This keeps the interface flat and professional.
*   **Interaction Shadow:** Only use shadows on active "Floating" elements like dropdown menus or modals. Use an ambient, highly diffused shadow: `0 10px 30px rgba(18, 25, 21, 0.05)`.
*   **Focus States:** Use the Secondary (Terra) color for focus rings to ensure accessibility without breaking the neutral aesthetic.

## Shapes

The shape language is **Soft** and restrained.

*   **Corners:** All primary UI components (buttons, input fields, cards) use a `0.25rem` (4px) radius. This provides just enough softness to feel modern while maintaining the structural rigidity of a professional tool.
*   **Large Containers:** `rounded-lg` (8px) can be used for primary dashboard cards.
*   **Icons:** Use "Line" style icons with a 1.5px or 2px stroke weight to match the weight of the typography. Avoid filled icons unless indicating an "active" navigation state.

## Components

*   **Buttons:** 
    *   *Primary:* Solid Ink background, White text, 4px radius.
    *   *Secondary:* 1px solid Ink border, Ink text, transparent background.
    *   *Ghost:* No border, Ink text, subtle Grey-Tan hover state.
*   **Cards:** Use a white background against the Canvas base. Apply a 1px solid border in Sage Mist. Headers within cards should use the `label-caps` typography style for categorization.
*   **Input Fields:** Minimalist design with a 1px bottom border as the default state, shifting to a full 1px outline on focus. Labels should always be visible above the field in `data-ui` style.
*   **Chips/Status:** Use the JetBrains Mono font. Success states use Olive backgrounds with 10% opacity and solid Olive text. Warning states use Terra.
*   **Lists:** High-contrast rows with subtle dividers. Use a `16px` vertical padding for each list item to maintain the "airy" editorial feel.
*   **Data Tables:** Clean, no vertical lines. Use horizontal Sage Mist dividers and JetBrains Mono for all numeric data.