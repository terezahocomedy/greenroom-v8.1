import React, { useState } from 'react';
import { Save, Trash2, UserCircle, X } from 'lucide-react';
import { playSound } from '../utils/audio.js';

export default function PersonaEditor({ persona, onClose, onSave, onDelete, personas = [] }) {
  const [localPersona, setLocalPersona] = useState(persona || { id: null, name: '', prompt: '' });
  const isDefault = localPersona.id === '1' || localPersona.id === '2';

  const handleSave = () => {
    onSave(localPersona);
    playSound('success');
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Persona editor">
      <div className="glass-panel modal-card persona-editor">
        <header className="modal-header">
          <h2><UserCircle className="text-purple-500" /> {persona?.id ? 'Edit Persona' : 'New Persona'}</h2>
          <button onClick={onClose} className="icon-button" title="Close"><X size={20} /></button>
        </header>
        <div className="form-stack">
          <label>Persona Name
            <input value={localPersona.name} onChange={(e) => setLocalPersona({ ...localPersona, name: e.target.value })} placeholder="e.g. Roast Master" />
          </label>
          <label>AI System Prompt
            <textarea value={localPersona.prompt} onChange={(e) => setLocalPersona({ ...localPersona, prompt: e.target.value })} placeholder="You are a stand-up comedy consultant..." />
          </label>
        </div>
        <footer className="modal-footer">
          <button onClick={() => { onDelete?.(localPersona.id); onClose(); }} disabled={personas.length <= 1 || isDefault} className="danger-button">
            <Trash2 size={16} /> Delete
          </button>
          <div className="button-row">
            <button onClick={onClose} className="secondary-button">Cancel</button>
            <button onClick={handleSave} disabled={!localPersona.name.trim() || !localPersona.prompt.trim()} className="primary-button purple">
              <Save size={16} /> Save Persona
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
