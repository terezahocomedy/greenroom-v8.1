import React, { useState } from 'react';
import { LayoutDashboard, Plus, X } from 'lucide-react';
import { playSound } from '../utils/audio.js';

export default function SetBuilder({ sets = [], bitIds = [], bits = [], activeSetId, onCreateSet, onAddBits, onRemoveBit, onClose }) {
  const [newSetName, setNewSetName] = useState('');
  const activeSet = sets.find((s) => s.id === activeSetId);
  const activeBits = bitIds.map((id) => bits.find((b) => b.id === id)).filter(Boolean);
  const totalTime = activeBits.reduce((sum, bit) => sum + (bit.duration || 0), 0);

  const createSet = () => {
    if (!newSetName.trim()) return;
    playSound('pop');
    onCreateSet?.({ id: `set_${Date.now()}`, name: newSetName, bitIds: [] });
    setNewSetName('');
  };

  return (
    <div className="set-builder-panel">
      <header className="set-header">
        <h2><LayoutDashboard size={20} /> Set Builder</h2>
        <button onClick={onClose} className="icon-button"><X size={18} /></button>
      </header>

      <div className="set-controls">
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <input
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createSet()}
            placeholder="New set name"
            className="glass-input"
            style={{ flex: 1 }}
          />
          <button onClick={createSet} className="primary-button"><Plus size={16} /> New</button>
        </div>
      </div>

      {activeSet && (
        <div className="set-view">
          <div className="set-title">
            <strong>{activeSet.name}</strong>
            <span>{activeBits.length} bits • {totalTime.toFixed(1)} min</span>
          </div>
          <div className="set-list">
            {activeBits.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 1rem' }}>No bits in this set</p>}
            {activeBits.map((bit, index) => (
              <div key={bit.id} className="set-list-item">
                <div>
                  <strong>{index + 1}. {bit.title}</strong>
                  <span>{bit.duration || 0} min • {(bit.tags || []).join(' • ')}</span>
                </div>
                <button onClick={() => onRemoveBit?.(bit.id)} className="danger-button" style={{ padding: '.35rem .5rem' }}><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
