import React, { useState, useEffect, useCallback } from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import BitLibrary from './components/BitLibrary.jsx';
import SetBuilder from './components/SetBuilder.jsx';
import InlineBitEditor from './components/InlineBitEditor.jsx';
import PersonaEditor from './components/PersonaEditor.jsx';
import ExportModal from './components/ExportModal.jsx';
import DataModal from './components/DataModal.jsx';
import { loadState, saveState } from './utils/storage.js';
import { INITIAL_TAGS, DEFAULT_PERSONAS } from './utils/constants.js';
import './components/components.css';
import './components/editor.css';
import './components/panels.css';
import './styles.css';

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [selectedBitId, setSelectedBitId] = useState(null);
  const [activeSetId, setActiveSetId] = useState(state.sets[0]?.id || 'main');
  const [showLibrary, setShowLibrary] = useState(true);
  const [showSetBuilder, setShowSetBuilder] = useState(true);
  const [showEditor, setShowEditor] = useState(!!selectedBitId);
  const [showPersonaEditor, setShowPersonaEditor] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => saveState(state), [state]);

  const selectedBit = state.bits.find((b) => b.id === selectedBitId);
  const activeSet = state.sets.find((s) => s.id === activeSetId);
  const activeBitIds = activeSet?.bitIds || [];
  const totalSetTime = activeBitIds.reduce((sum, id) => {
    const bit = state.bits.find((b) => b.id === id);
    return sum + (bit?.duration || 0);
  }, 0);

  const updateBit = useCallback((id, updates) => {
    setState((prev) => ({
      ...prev,
      bits: prev.bits.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const createBit = useCallback((newBit) => {
    setState((prev) => ({ ...prev, bits: [...prev.bits, newBit] }));
    setSelectedBitId(newBit.id);
  }, []);

  const createSet = useCallback((newSet) => {
    setState((prev) => ({ ...prev, sets: [...prev.sets, newSet] }));
    setActiveSetId(newSet.id);
  }, []);

  const addBitToSet = useCallback((bitId) => {
    setState((prev) => ({
      ...prev,
      sets: prev.sets.map((s) =>
        s.id === activeSetId && !s.bitIds.includes(bitId)
          ? { ...s, bitIds: [...s.bitIds, bitId] }
          : s
      ),
    }));
  }, [activeSetId]);

  const removeBitFromSet = useCallback((bitId) => {
    setState((prev) => ({
      ...prev,
      sets: prev.sets.map((s) =>
        s.id === activeSetId
          ? { ...s, bitIds: s.bitIds.filter((id) => id !== bitId) }
          : s
      ),
    }));
  }, [activeSetId]);

  const deleteBit = useCallback((bitId) => {
    setState((prev) => ({
      ...prev,
      bits: prev.bits.filter((b) => b.id !== bitId),
      sets: prev.sets.map((s) => ({
        ...s,
        bitIds: s.bitIds.filter((id) => id !== bitId),
      })),
    }));
    if (selectedBitId === bitId) setSelectedBitId(null);
  }, [selectedBitId]);

  const addTag = useCallback((tag) => {
    setState((prev) => ({
      ...prev,
      allTags: [...new Set([...prev.allTags, tag])],
    }));
  }, []);

  const savePersona = useCallback((persona) => {
    setState((prev) => ({
      ...prev,
      personas: persona.id
        ? prev.personas.map((p) => (p.id === persona.id ? persona : p))
        : [...prev.personas, { ...persona, id: `persona_${Date.now()}` }],
    }));
    setShowPersonaEditor(false);
    setEditingPersona(null);
  }, []);

  const deletePersona = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      personas: prev.personas.filter((p) => p.id !== id),
    }));
  }, []);

  const handleImport = useCallback((data) => {
    setState((prev) => ({
      ...prev,
      bits: data.bits || [],
      sets: data.sets || prev.sets,
    }));
    setShowDataModal(false);
  }, []);

  return (
    <ErrorBoundary>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">GreenRoom Mobile</p>
            <h1>v3.0 — React Edition</h1>
          </div>
          <div className="header-actions">
            <button onClick={() => setShowDataModal(true)} className="secondary-button" title="Import/Export"><RotateCcw size={18} /></button>
            <button onClick={() => { setEditingPersona(null); setShowPersonaEditor(true); }} className="secondary-button" title="Settings"><Settings size={18} /></button>
          </div>
        </header>

        <div className="app-grid">
          {showLibrary && (
            <BitLibrary
              bits={state.bits}
              allTags={state.allTags}
              selectedBitId={selectedBitId}
              onSelectBit={(id) => { setSelectedBitId(id); setShowEditor(true); }}
              onCreateBit={createBit}
              onClose={() => setShowLibrary(false)}
            />
          )}

          {selectedBit && showEditor && (
            <InlineBitEditor
              bit={selectedBit}
              onChange={(updates) => updateBit(selectedBitId, updates)}
              allTags={state.allTags}
              personas={state.personas}
              defaultPersonaId={state.personas[0]?.id}
              geminiApiKey={state.geminiApiKey || ''}
              onClose={() => { setShowEditor(false); setSelectedBitId(null); }}
              onSave={() => { /* Already saved via onChange */ }}
              onTrash={() => deleteBit(selectedBitId)}
              onAddToSet={() => addBitToSet(selectedBitId)}
              onAddTag={addTag}
              onDuplicate={(clone) => createBit(clone)}
              onNewBit={() => createBit({ id: `bit_${Date.now()}`, title: 'Untitled Bit', content: '', duration: 0, performanceCount: 0, status: 'Raw', tags: [], punchlines: [], createdAt: Date.now() })}
            />
          )}

          {showSetBuilder && (
            <SetBuilder
              sets={state.sets}
              bitIds={activeBitIds}
              bits={state.bits}
              activeSetId={activeSetId}
              onCreateSet={createSet}
              onAddBits={addBitToSet}
              onRemoveBit={removeBitFromSet}
              onClose={() => setShowSetBuilder(false)}
            />
          )}
        </div>

        {showPersonaEditor && (
          <PersonaEditor
            persona={editingPersona}
            personas={state.personas}
            onClose={() => { setShowPersonaEditor(false); setEditingPersona(null); }}
            onSave={savePersona}
            onDelete={deletePersona}
          />
        )}

        {showExportModal && activeSet && (
          <ExportModal
            activeSet={activeSet}
            bits={state.bits}
            totalSetTime={totalSetTime}
            onClose={() => setShowExportModal(false)}
          />
        )}

        {showDataModal && (
          <DataModal
            bits={state.bits}
            sets={state.sets}
            onImport={handleImport}
            onClose={() => setShowDataModal(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
