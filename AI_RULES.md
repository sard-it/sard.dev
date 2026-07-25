# AI Development Rules & Guidelines

## Tech Stack Overview

- **Framework & Build Tool:** React 19 with Vite (Fast Refresh enabled).
- **Routing:** `react-router-dom` (v7) for client-side navigation.
- **Styling & Layout:** Tailwind CSS (v3) with custom theme color extensions (`brand-orange`).
- **Internationalization (i18n):** `i18next`, `react-i18next`, and `i18next-browser-languagedetector` supporting English (LTR) and Arabic (RTL).
- **Icons:** `lucide-react` for UI icons.
- **3D Renderings & Shader Visuals:** Three.js with `@react-three/fiber` and `@react-three/drei` for interactive 3D elements.
- **Animations:** `framer-motion` for UI component transitions and `gsap` (`@gsap/react`, `GSAPSplitText`, `ScrollTrigger`) for text splits and scroll animations.
- **Typography & Font Management:** Google Fonts (`Cairo` for Arabic RTL, `Inter` for English LTR) configured dynamically via CSS direction selectors.

---

## Library Usage Rules

### 1. Styling & Design System
- **Tailwind CSS:** Use Tailwind classes exclusively for layout, spacing, typography, and colors. Avoid raw CSS unless handling global direction overrides or specialized keyframe rules in `src/index.css`.
- **Brand Colors:** Use `bg-brand-orange`, `text-brand-orange`, or defined shade utilities (`brand-orange-400`, `brand-orange-500`, etc.) for consistency.
- **RTL / LTR Handling:** Ensure components respect dynamic document direction (`dir="rtl"` or `dir="ltr"`). Use directional margins/padding or dynamic alignment classes when needed.

### 2. Animations & Interactivity
- **Framer Motion:** Use `framer-motion` for micro-interactions, modal overlays, page transitions, hovering effects, and standard entrance/exit animations.
- **GSAP:** Use GSAP (`gsap`, `@gsap/react`, `SplitText`, `ScrollTrigger`) specifically for text-splitting, complex timeline sequences, or advanced scroll-driven text reveals.

### 3. 3D Graphics & Visual Effects
- **React Three Fiber / Drei:** Keep complex 3D meshes (like `AnimatedBlob`) isolated in dedicated components under `src/components/`. Use proper Canvas bounds, lighting setup, and performance optimizations.

### 4. Routing
- **React Router DOM:** Define all routes in `src/App.jsx`. Keep top-level views inside `src/components/` or dedicated page files.

### 5. Localization & Translation
- **i18next:** Always place new static user-facing text into `src/locales/en/translation.json` and `src/locales/ar/translation.json`.
- Use the `useTranslation()` hook across components to retrieve translated strings via `t('key.path')`.

### 6. Component Architecture & Structure
- Keep components modular, self-contained, and ideally under 100 lines of code where possible.
- Store reusable components inside `src/components/`.