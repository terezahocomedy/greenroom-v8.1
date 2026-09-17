import React, { useMemo, useState } from 'react';
import { Copy, X } from 'lucide-react';
import { playSound } from '../utils/audio.js';

export default function ExportModal({ activeSet, bits, totalSetTime, onClose }) {
  const [includeScript, setIncludeScript] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includePunchlines, setIncludePunchlines] = useState(true);

  const generatedText = useMemo(() => {
    if (!activeSet) return '';
    let text = `${activeSet.name}\nTotal Time: ${Number(totalSetTime || 0).toFixed(1)} mins\n\n`;
    activeSet.bitIds.forEach((id, index) => {
      const bit = bits.find((item) => item.id === id);
      if (!bit) return;
      text += `${index + 1}. ${bit.title} (${bit.duration || 0} min)\n`;
      if (includeScript) text += `   ${bit.content || ''}\n`;
      if (includeNotes && bit.notes) text += `   Notes: ${bit.notes}\n`;
      if (includePunchlines && bit.punchlines?.length) text += `   Punchlines: ${bit.punchlines.join(' | ')}\n`;
      text += '\n';
    });
    return text;
  }, [activeSet, bits, totalSetTime, includeScript, includeNotes, includePunchlines]);

  const copy = async () => {
    playSound('pop');
    try { await navigator.clipboard.writeText(generatedText); }
    catch { window.prompt('Copy this set list:', generatedText); }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Export set list">
      <div className="glass-panel modal-card export-modal">
        <header className="modal-header">
          <h2 className="text-green-400">Export Set List</h2>
          <button onClick={onClose} className="icon-button" title="Close"><X size={20} /></button>
        </header>
        <div className="checkbox-row">
          <label><input type="checkbox" checked={includeScript} onChange={(e) => setIncludeScript(e.target.checked)} /> Script</label>
          <label><input type="checkbox" checked={includePunchlines} onChange={(e) => setIncludePunchlines(e.target.checked)} /> Punchlines</label>
          <label><input type="checkbox" checked={includeNotes} onChange={(e) => setIncludeNotes(e.target.checked)} /> Notes</label>
        </div>
        <textarea readOnly value={generatedText} className="export-textarea" />
        <footer className="modal-footer right">
          <button onClick={onClose} className="secondary-button">Back</button>
          <button onClick={copy} className="primary-button green"><Copy size={16} /> Copy</button>
        </footer>
      </div>
    </div>
  );
}
