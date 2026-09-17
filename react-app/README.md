# Staged React migration

Phase 1 is complete on this branch:

- Shared constants moved to `src/utils/constants.js`.
- Formatting and tag logic moved to `src/utils/formatting.js`.
- Gemini request helpers moved to `src/utils/api.js`.
- Audio feedback moved to `src/utils/audio.js`.
- Error handling has a dedicated component.

The original HTML app remains untouched. The next phase should extract `PersonaEditor`, `InlineBitEditor`, `ExportModal`, `ImportAndDataModal`, and `AutoSetModal`, followed by the main `App` state and views.
