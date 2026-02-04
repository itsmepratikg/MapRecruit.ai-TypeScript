# Non-Functional Test Cases
**Module:** Performance & UX
**Date:** 2025-05-20

## 1. Responsiveness

| ID | Device/Size | Check | Expected Result |
|----|-------------|-------|-----------------|
| NFT-01 | Mobile (375px) | Sidebar | Sidebar is hidden by default. Hamburger menu visible. Opens as overlay. |
| NFT-02 | Tablet (768px) | Dashboard Grid | GridStack widgets stack vertically or 2-column layout depending on space. |
| NFT-03 | Desktop (1440px) | Campaign Table | All columns visible without horizontal scroll (unless data is extensive). |

## 2. Performance

| ID | Area | Load | Threshold |
|----|------|------|-----------|
| NFT-04 | Profile Search | 1000 items in mock data | Filter operation < 200ms. |
| NFT-05 | Workflow Builder | 50 nodes graph | Dragging canvas maintains 60fps. |
| NFT-06 | Initial Load | App Bundle | First Contentful Paint < 1.5s. |

## 3. Accessibility

| ID | Check | Element | Expected Result |
|----|-------|---------|-----------------|
| NFT-07 | Color Contrast | Status Badges | Text/Bg contrast ratio > 4.5:1 (WCAG AA). |
| NFT-08 | Keyboard Nav | Sidebar | Can tab through navigation items. Enter key activates route. |
