# Design System: Academic Curator

## 1. Overview & Creative North Star: "The Digital Curator"
The design system for **Academic Curator** transcends the typical "dashboard" aesthetic. Our Creative North Star is **The Digital Curator**—an editorial-first approach to data management. In a sector often cluttered with rigid grids and heavy borders, we prioritize clarity, intellectual rigor, and premium "breathing room."

We break the standard SaaS "template" look by treating the **Unified Student Record** not as a spreadsheet, but as a prestigious dossier. This is achieved through:
*   **Intentional Asymmetry:** Off-setting sidebars and content blocks to guide the eye naturally.
*   **The Editorial Mix:** Pairing the scholarly authority of `newsreader` (Serif) with the modern precision of `inter` (Sans-Serif).
*   **Depth through Tone:** Moving away from 1px lines toward a sophisticated layering of surfaces that mimic high-end stationery and frosted architectural glass.

---

## 2. Colors & Surface Philosophy
The palette is rooted in academic tradition (Navy & Slate) but executed with a modern, translucent touch.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit directly on a `surface` background to create a "soft-edge" distinction.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create "nested" importance:
*   **Base:** `surface` (#f8f9ff) for the main canvas.
*   **Sectioning:** `surface-container-low` (#eff4ff) for sidebar backgrounds or secondary content areas.
*   **Focus:** `surface-container-lowest` (#ffffff) for the primary "Unified Student Record" cards to provide maximum contrast and "pop."
*   **Interaction:** `surface-container-high` (#dce9ff) for hover states or active contextual menus.

### The "Glass & Gradient" Rule
To elevate the experience, use **Glassmorphism** for floating elements (like command palettes or dropdowns). Use a `surface-container` color at 80% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** Main Action CTAs should utilize a subtle linear gradient from `primary` (#002045) to `primary_container` (#1a365d) at a 135-degree angle to provide a "soulful" depth that flat color cannot replicate.

---

## 3. Typography: The Scholarly Voice
We utilize a high-contrast scale to separate "Information" from "Insight."

*   **Display & Headlines (`newsreader`):** Used for student names, page titles, and high-level academic metrics. The serif font provides the "Curator" feel—authoritative and established.
*   **Titles & Body (`inter`):** Used for data labels, record entries, and navigation. The sans-serif provides the "Digital" feel—clean, readable, and functional.
*   **Scale Tip:** Always use `display-md` for the "Unified Student Record" header to give it the weight of a title page in a prestigious journal.

---

## 4. Elevation & Depth
In this system, depth is felt, not seen. We reject heavy drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural lift.
*   **Ambient Shadows:** If an element must float (e.g., a modal), use an ultra-diffused shadow: `box-shadow: 0 12px 40px rgba(13, 28, 46, 0.06);`. The shadow is tinted with `on_surface` (#0d1c2e) to ensure it looks like a natural occlusion of light.
*   **The "Ghost Border":** If a border is required for accessibility, it must be the `outline_variant` token at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

### The Unified Student Record (Primary Component)
*   **Structure:** A multi-layered card using `surface-container-lowest`. 
*   **Detailing:** Forbid dividers. Use `spacing-8` (2rem) of vertical whitespace to separate semesters or years. Use `surface-container-low` as a subtle "pill" background for GPA highlights.

### Buttons & Chips
*   **Primary Button:** Gradient-filled (`primary` to `primary_container`) with `rounded-md` (0.375rem). 
*   **Secondary/Ghost:** No background. Use `title-sm` typography in `primary` color.
*   **Chips:** Use `secondary_container` (#d9e3f8) with `label-md` text. The `rounded-full` setting is mandatory for chips to contrast against the more architectural `md` corners of cards.

### Input Fields & Search
*   **Visual Style:** Subtle `surface-variant` backgrounds with a `ghost-border` on focus. No heavy outlines.
*   **Search:** The global search for student records should be a floating "Glass" element at the top of the viewport.

### Lists & Tooltips
*   **Lists:** Forbid divider lines. Use alternating row colors (Zebra striping) using `surface` and `surface-container-low` at a very low contrast ratio.
*   **Tooltips:** High-contrast `inverse_surface` (#233144) with `on_inverse_surface` text for maximum legibility against the light UI.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `display-lg` typography for empty states to make them feel like intentional editorial moments.
*   **Do** embrace whitespace. If a layout feels "crowded," increase spacing using the `12` (3rem) or `16` (4rem) tokens.
*   **Do** use tonal shifts to indicate "Selected" states (e.g., a side-nav item moving from `surface` to `surface-container-high`).

### Don’t:
*   **Don't** use 1px black or dark grey lines to separate content. Use the spacing scale.
*   **Don't** use standard "Drop Shadows." Use tonal nesting or Ambient Shadows only.
*   **Don't** use pure white (#ffffff) for the background; use `surface` (#f8f9ff) to reduce eye strain and maintain the "premium" tinted feel.
*   **Don't** use vibrant "Action" colors for success states; stick to the curated palette to maintain the professional, academic tone.