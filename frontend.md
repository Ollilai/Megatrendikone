---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Accessibility (WCAG 2.1)

### Critical (Must Fix)
- **Images**: All images MUST have descriptive `alt` text
- **Icon buttons**: Icon-only buttons MUST have `aria-label` attributes
- **Form inputs**: All inputs MUST have associated `<label>` elements
- **Semantic HTML**: Use `<button>` for actions, `<a>` for navigation - never `div onClick`
- **Links**: All `<a>` tags MUST have valid `href` attributes

### Serious (Should Fix)
- **Focus indicators**: Never remove `outline` without a visible replacement
- **Keyboard navigation**: All interactive elements must have keyboard handlers
- **Color-independent info**: Don't convey meaning through color alone
- **Touch targets**: Minimum 44×44px for all interactive elements

### Moderate (Nice to Fix)
- **Heading hierarchy**: Use proper h1 → h2 → h3 sequence, never skip levels
- **TabIndex**: Avoid positive `tabIndex` values; use `0` or `-1`
- **ARIA roles**: If using `role`, include all required ARIA attributes

## Visual Design Quality

### Layout & Spacing
- Use a consistent spacing scale (4, 8, 16, 24, 32, 48, 64, 96px)
- Check overflow on all screen sizes
- Avoid z-index conflicts - establish a z-index scale
- Test alignment at all breakpoints

### Typography
- Choose distinctive fonts - avoid Inter, Roboto, Arial, system fonts
- Use consistent font weights across the application
- Maintain readable line-height (1.4-1.6 for body, 1.1-1.3 for headings)
- Always specify font fallbacks

### Color & Contrast
- All text must meet WCAG AA contrast (4.5:1 for normal, 3:1 for large)
- Define hover, focus, active, and disabled states for all interactive elements
- Test dark mode for consistency and contrast

### Component States
- **Buttons**: default, hover, focus, active, disabled, loading
- **Forms**: default, focus, error, disabled, filled
- **Cards**: default, hover, selected (if applicable)
- Consistent border-radius, shadows, and transitions across components

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.