import React, { useState, useCallback } from 'react';
import { Download, Upload, X } from 'lucide-react';
import { exportBits, importBits } from '../utils/storage.js';
import { playSound } from '../utils/audio.js';

export default function DataModal({ bits = [], sets = [], onImport, onClose }) {
  const [importError, setImportError] = useState('');

  const handleExport = useCallback(() => {
    playSound('success');
    exportBits(bits, sets);
  }, [bits, sets]);

  const handleImport = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await importBits(file);
      playSound('success');
      setImportError('');
      onImport?.(data);
    } catch (error) {
      setImportError(error.message);
      playSound('delete');
    }
  }, [onImport]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Data management">
      <div className="glass-panel modal-card">
        <header className="modal-header">
          <h2>Data Management</h2>
          <button onClick={onClose} className="icon-button" title="Close"><X size={20} /></button>
        </header>
        <div className="form-stack">
          <button onClick={handleExport} className="primary-button green" style={{ justifyContent: 'center' }}>
            <Download size={18} /> Export Bits & Sets
          </button>
          <label style={{ cursor: 'pointer', justifyContent: 'center' }} className="primary-button blue">
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            <Upload size={18} /> Import Backup
          </label>
          {importError && <div style={{ color: '#f87171', padding: '.75rem', background: 'rgb(127 29 29 / .3)', borderRadius: '.75rem' }}>{importError}</div>}
          <p style={{ fontSize: '.85rem', color: '#94a3b8', margin: '1rem 0 0' }}>
            Your data is saved locally. Export regularly to keep backups safe.
          </p>
        </div>
      </div>
    </div>
  );
}
