# Staged React migration

Phase 2 is complete:

- Added `PersonaEditor` as a controlled React component.
- Added `ExportModal` with script, notes, and punchline toggles.
- Added shared modal/component styles.
- Preserved the legacy app and localStorage data format.

The components are intentionally not mounted in `App.jsx` yet. The next phase will extract and mount `InlineBitEditor`, then connect the main application state and modal callbacks.
