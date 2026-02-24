# Specification

## Summary
**Goal:** Build CarForge, a premium car customisation website with a 3D live preview, configuration persistence, and a dark automotive showroom theme.

**Planned changes:**
- Backend Motoko actor with `saveConfig`, `getMyConfig`, and `listConfigs` functions using stable storage; stores car model, body color, wheel style, interior color, and accessories per user principal
- Frontend customisation page with a split layout: a 3D preview panel (React Three Fiber) and a controls sidebar
- 3D car model rendered with spotlight/stage lighting, updating in real-time as options change
- Controls sidebar with: car model selector (3+ options), body color picker, wheel style selector (3+ options), interior color picker
- "Save Configuration" button that calls the backend and shows a success/error notification
- "Load My Configuration" button that fetches and applies the saved config to the UI and 3D preview
- Dark charcoal/matte black theme with metallic silver and amber accents, bold modern sans-serif typography, applied consistently across all components
- Hero banner image displayed in the header/landing section loaded from static assets

**User-visible outcome:** Users can visit CarForge, customise a 3D car in real time by selecting models, colors, and wheel styles, save their configuration to the backend, and reload it later — all within a sleek premium automotive showroom interface.
