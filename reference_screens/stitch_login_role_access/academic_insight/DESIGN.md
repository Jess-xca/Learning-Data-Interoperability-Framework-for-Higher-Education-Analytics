# Design System Document: Higher Education Analytics

## 1. Overview & Creative North Star: "The Academic Curator"

This design system moves away from the sterile, "dashboard-in-a-box" aesthetic common in SaaS. Instead, it adopts the persona of **The Academic Curator**. It is designed to feel like a high-end digital journal—authoritative, structured, and profoundly legible—while utilizing modern depth techniques to manage complex data.

The creative direction focuses on **Tonal Architecture**. Rather than using lines to box in data, we use "sheets" of color and light to create a sense of organized discovery. By leaning into intentional asymmetry and generous white space, we transform a data-heavy analytics platform into a premium editorial experience that honors the prestige of higher education.

---

## 2. Colors: Tonal Architecture

Our palette is anchored by the deep, institutional authority of "University Navy." However, to avoid a heavy or dated feel, we utilize a spectrum of light-interplay tokens.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1 px solid borders for sectioning or containment. Structural boundaries must be defined solely through background color shifts. If a section needs to be distinct, place a `surface-container-low` element against a `surface` background. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create "nested" depth:
- **Base Layer:** `surface` (#f9f9ff) – The expansive canvas.
- **Sectional Layer:** `surface-container-low` (#f0f3ff) – Large content blocks.
- **Priority Layer:** `surface-container-lowest` (#ffffff) – Used for primary cards or "active" data focus points to make them pop against the background.

### The "Glass & Gradient" Rule
While the aesthetic is "flat-plus," use **Glassmorphism** for floating elements (like hover tooltips or dropdowns). Apply `surface_variant` with a 70% opacity and a `20px` backdrop blur. 
*Signature Polish:* Main CTAs or Hero Metric cards may use a subtle linear gradient from `primary` (#002045) to `primary_container` (#1a365d) at a 135-degree angle to provide a "soul" and depth that a flat fill cannot achieve.

---

## 3. Typography: Editorial Authority

We use **Inter** as our typographic backbone. It provides the mathematical precision required for analytics while maintaining a humanist warmth.

*   **Display & Headline Scale:** Use `display-md` (2.75rem) for high-level institutional KPIs. These should feel like newspaper headlines—bold and inescapable.
*   **The Contrast Rule:** Pair `headline-sm` titles in `primary` with `body-md` descriptions in `secondary`. This high-contrast pairing creates an "editorial" hierarchy that guides the eye through complex datasets.
*   **Data Legibility:** For numerical data in tables, utilize `label-md` with tabular lining (tnum) to ensure columns of figures align perfectly for easy comparison.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows and borders create visual noise. This system uses **Atmospheric Depth**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-highest` navigation bar should sit atop a `surface` canvas. The change in hex value provides the "edge," not a line.
*   **Ambient Shadows:** For floating elements (Modals/Floating Action Buttons), use an extra-diffused shadow:
    *   *Offset:* 0px 8px | *Blur:* 24px | *Color:* `on_surface` (#111c2c) at **6% opacity**.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use the `outline_variant` token at **15% opacity**. Never use 100% opaque lines.
*   **Soft Transitions:** All transitions between surface tiers should be immediate, but transitions of state (hover/focus) should use a `200ms ease-out` to mimic the soft focus of a camera.

---

## 5. Components: The Building Blocks

### Cards & Lists
*   **The Rule of Space:** Forbid the use of divider lines between list items. Use the **Spacing Scale (3)** (1rem) to create separation.
*   **Card Styling:** Use `surface-container-lowest` (#ffffff) for card backgrounds with an `8px` (DEFAULT) corner radius. Cards should appear to "float" via color shift, not heavy shadows.

### Tables (Data Grids)
*   **Header:** `primary_container` background with `on_primary_container` text.
*   **Rows:** Alternate between `surface` and `surface-container-low`.
*   **Interaction:** On hover, a row should shift to `surface-container-high` to provide a clear focal anchor without adding a border.

### Buttons
*   **Primary:** Fill `primary`, Text `on_primary`. Use `xl` (1.5rem) roundedness for a modern, approachable feel.
*   **Secondary:** Fill `secondary_container`, Text `on_secondary_container`.
*   **Tertiary:** No fill. Text `primary`. Use for low-emphasis actions like "Cancel" or "View Details."

### Form Elements & Inputs
*   **Input Fields:** Use `surface_container_low` for the field fill. Instead of a 4-sided border, use a 2px bottom-accent in `outline_variant` that transitions to `primary` on focus.
*   **Validation:** Success states use `tertiary_container` (#003e28) text; warning states use `on_tertiary_container` (#00b47d) to maintain professional restraint.

### Specialized Component: The "Insight Rail"
A secondary, slim navigation or info rail using `surface-container-lowest`. This sits asymmetrically on the right side of the screen to provide "At-a-Glance" context for the main data view, breaking the traditional centered grid.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use the Spacing Scale (6 or 8) for margins between major content blocks. Air is luxury.
*   **Do** use `on_surface_variant` (#43474e) for secondary text to maintain a sophisticated grey-scale hierarchy.
*   **Do** apply `8px` (DEFAULT) rounding to almost everything to keep the "Academic" feel approachable.

### Don't:
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#111c2c).
*   **Don't** use "Drop Shadows" on cards sitting on the base surface. Let the tonal shift do the work.
*   **Don't** crowd charts. If a chart has more than 5 data points, use a "Focus Mode" that expands the chart into a `surface-container-highest` modal.