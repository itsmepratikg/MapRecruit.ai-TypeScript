# MapRecruit Design System & Branding Guidelines

**Version:** 1.3.0  
**Target Audience:** Frontend Engineers, UI/UX Designers  
**Framework:** React + Tailwind CSS

---

## 1. Design Philosophy
The MapRecruit interface is designed to be **Data-Dense yet Breathable**. It balances high-volume information display (candidate lists, analytics) with modern, clean aesthetics.

*   **Primary Aesthetic:** "Clean Corporate SaaS" with "AI Modernism".
*   **Core Principles:**
    *   **Visual Hierarchy:** Use color weight and typography to distinguish between navigation, content, and actions.
    *   **Contextual AI:** AI features (Source, Match, Engage) are highlighted with distinct colors (Indigo/Purple) to differentiate them from CRUD operations.
    *   **Accessibility:** High contrast text, focus states, and full Dark Mode support.

---

## 2. Color System

The application uses **Tailwind CSS** colors. The palette is defined in `index.html` via CSS variables and mapped in `tailwind.config`.

### 2.1 Primary Brand Color (Emerald)
Used for primary actions, active states, success indicators, and branding logos.
*   **Base:** `emerald-600` (#059669) - Primary Buttons / Active Links
*   **Hover:** `emerald-700` (#047857) - Hover States
*   **Backgrounds:** `emerald-50` (#ecfdf5) - Active Nav Items / Subtle Badges
*   **Dark Mode Text:** `emerald-400` (#34d399)

### 2.2 Semantic Colors
*   **AI / Intelligence:** `indigo-600` / `purple-600`. Used for "Smart" features (Match AI, Workflows).
*   **Info / Links:** `blue-600`.
*   **Warning / Pending:** `amber-500` or `yellow-500`.
*   **Error / Destructive:** `red-600` (Light) / `red-400` (Dark).
*   **Text (Light Mode):**
    *   Headings: `slate-800`
    *   Body: `slate-600`
    *   Muted: `slate-400` or `slate-500`
*   **Text (Dark Mode):**
    *   Headings: `slate-100`
    *   Body: `slate-300`
    *   Muted: `slate-500`

### 2.3 Backgrounds (The "Slate" System)
We do **not** use pure black/white for dark mode. We use the Slate scale.
*   **Light Mode:**
    *   App Background: `bg-slate-50` (or `bg-slate-50/50`)
    *   Card/Panel Background: `bg-white`
    *   Borders: `border-slate-200`
*   **Dark Mode:**
    *   App Background: `bg-slate-900`
    *   Card/Panel Background: `bg-slate-800`
    *   Borders: `border-slate-700`

---

## 3. Typography

*   **Font Family:** `Inter`, sans-serif.
*   **Scale:**
    *   **Page Titles:** `text-2xl font-bold`
    *   **Section Headers:** `text-lg font-bold` or `text-sm font-bold uppercase tracking-wider` (for sidebar headers/labels).
    *   **Body:** `text-sm` (Default for almost all UI elements).
    *   **Meta/Captions:** `text-xs`.
    *   **Micro/Badges:** `text-[10px] uppercase font-bold`.
*   **Monospace:** Used for IDs (e.g., Job ID, User ID) -> `font-mono`.

---

## 4. UI Components & Patterns

### 4.1 Buttons
*   **Primary:** `bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm font-bold text-sm px-4 py-2 transition-colors`.
*   **Secondary/Outline:** `border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg`.
*   **Ghost/Icon:** `p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded`.
*   **AI Action:** `bg-indigo-600 text-white hover:bg-indigo-700` (Used in Engage AI/Workflows).

### 4.2 Cards & Containers
*   **Structure:** `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm`.
*   **Header:** Often distinct with `border-b border-slate-100 dark:border-slate-700`.
*   **Hover Effects:** `hover:shadow-md transition-shadow duration-200` (for clickable cards like Profiles/Campaigns).

### 4.3 Inputs & Forms
*   **Base Style:** `bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none`.
*   **Focus State:** `focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`.
*   **Search Bars:** Often include a search icon absolutely positioned left (`pl-9`).

### 4.4 Badges & Status Indicators
*   **Shape:** `rounded` (square-ish) or `rounded-full` (pill).
*   **Style:** Subtle pastel background with dark text.
    *   *Example:* `bg-green-100 text-green-800 border border-green-200`.
*   **Status Map:**
    *   Active/Success: Green/Emerald.
    *   Pending/Warning: Yellow/Amber.
    *   Closed/Error: Red.
    *   Neutral/Archived: Slate.
    *   AI/Smart: Indigo/Purple.

### 4.5 Modals & Dialogs
*   **Overlay:** `fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]`.
*   **Container:** `bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700`.
*   **Animation:** `animate-in fade-in zoom-in-95 duration-200`.

---

## 5. Layout & Spacing Details

### 5.1 Sidebar Navigation
*   **Widths:**
    *   Expanded: `w-64`.
    *   Collapsed: `w-16` (Icon only).
*   **Mobile:** Uses a fixed overlay (`fixed inset-0 z-50`).
*   **Menu Items:**
    *   `px-3 py-2.5 rounded-md`.
    *   Active: `bg-emerald-100 text-emerald-900`.
    *   Inactive: `text-slate-600 hover:bg-slate-50`.
*   **Flyouts:** When collapsed, hovering a parent item shows a `absolute left-full` menu.

### 5.2 Dashboard Grid (GridStack)
*   **Padding:** Main content usually has `p-6` or `p-8`.
*   **Gaps:** `gap-4` or `gap-6` between cards.
*   **Max Width:** `max-w-[1600px]` for dashboard, `max-w-5xl` for settings forms to prevent stretching on ultrawide monitors.

### 5.3 Scrollbars
*   Custom scrollbar implementation required (see `index.html` CSS).
*   **Class:** `custom-scrollbar`.
*   **Style:** Thin, Slate-300 thumb, transparent track.

---

## 6. Iconography
*   **Library:** `lucide-react`.
*   **Sizing:**
    *   Standard Actions: `size={16}` or `size={18}`.
    *   Navigation Icons: `size={20}`.
    *   Empty States / Placeholders: `size={40}` or `size={48}`.
*   **Stroke:** Default (2px).

---

## 7. Interactive Behaviors (Minute Details)

1.  **Transitions:** Almost all interactive elements should have `transition-colors` or `transition-all` with `duration-200` or `300`.
2.  **Empty States:** Never leave a blank container. Use `EmptyView` or `PlaceholderPage` components with a centered icon and grey text.
3.  **Toasts:** Use `react-hot-toast` for async feedback. Position: `top-right`.
4.  **Loading:** Use skeleton loaders (gray pulsing blocks) or `Loader2` spinner icon for async actions.
5.  **Hover Cards:** Complex lists (Campaigns/Candidates) often reveal action buttons (Edit/Delete) only on group hover (`group-hover:opacity-100`).

---

## 8. Directory Structure Guidelines

For consistency, any new feature should follow this structure:

```
src/
├── components/          # Shared atomic components (Icons, Buttons, Modal)
├── pages/
│   ├── FeatureName/     # Feature Module
│   │   ├── index.tsx    # Entry/Router for the feature
│   │   ├── components/  # Feature-specific components
│   │   ├── SubPage.tsx  # Specific views
├── hooks/               # React Context/Hooks (useUserPreferences)
├── data/                # Mock data / Types / Constants
└── types.ts             # Global TS Interfaces
```

## 9. Developer Checklist for New Features

1.  [ ] Does it support **Dark Mode**? (Check `dark:` classes).
2.  [ ] Are texts using the correct **Slate scale**?
3.  [ ] Do interactive elements have **Hover/Focus states**?
4.  [ ] Is the layout **Responsive** (check `flex-col` on mobile vs `flex-row` on desktop)?
5.  [ ] Are icons consistent with **Lucide React**?
6.  [ ] Is user feedback provided via **Toasts**?
