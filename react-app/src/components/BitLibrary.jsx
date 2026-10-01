import React, { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { playSound } from '../utils/audio.js';

export default function BitLibrary({ bits = [], allTags = [], onCreateBit, onSelectBit, selectedBitId, onClose }) {
  const [searchInput, setSearchInput] = useState('');
  const [tagFilter, setTagFilter] = useState([]);

  const filtered = bits.filter((bit) => {
    const matchesSearch = !searchInput || bit.title.toLowerCase().includes(searchInput.toLowerCase()) || (bit.content || '').toLowerCase().includes(searchInput.toLowerCase());
    const matchesTags = tagFilter.length === 0 || tagFilter.some((tag) => (bit.tags || []).includes(tag));
    return matchesSearch && matchesTags;
  });

  const createBit = () => {
    playSound('pop');
    onCreateBit?.({ id: `bit_${Date.now()}`, title: 'Untitled Bit', content: '', duration: 0, performanceCount: 0, status: 'Raw', tags: [], punchlines: [], createdAt: Date.now() });
  };

  const toggleTag = (tag) => {
    setTagFilter((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="bit-library-panel">
      <header className="library-header">
        <h2>Bit Library</h2>
        <button onClick={onClose} className="icon-button"><X size={18} /></button>
      </header>

      <div className="library-controls">
        <div className="search-box">
          <Search size={16} />
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search bits..." />
        </div>
        <button onClick={createBit} className="primary-button"><Plus size={16} /> New Bit</button>
      </div>

      <div className="tag-filter">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`tag-chip ${tagFilter.includes(tag) ? 'active' : ''}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="bit-list">
        {filtered.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 1rem' }}>No bits found</p>}
        {filtered.map((bit) => (
          <button
            key={bit.id}
            onClick={() => onSelectBit?.(bit.id)}
            className={`bit-card ${selectedBitId === bit.id ? 'selected' : ''}`}
          >
            <strong>{bit.title}</strong>
            <span>{bit.duration || 0} min • {bit.status}</span>
            <span style={{ fontSize: '.75rem', color: '#94a3b8' }}>{(bit.tags || []).join(' • ')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
