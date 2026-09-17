import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Copy, Highlighter, Redo, Save, Send, Sparkles, Undo, Volume2, X } from 'lucide-react';
import { fetchWithRetry, getGeminiModel, parseGeminiJson } from '../utils/api.js';
import { calculateDuration, detectLanguageTags, escapeRegExp, formatDateTime } from '../utils/formatting.js';
import { playSound } from '../utils/audio.js';

function highlightText(text, punchlines = []) {
  let segments = [{ text, highlighted: false }];
  punchlines.filter(Boolean).forEach((punchline) => {
    const next = [];
    const regex = new RegExp(`(${escapeRegExp(punchline)})`, 'gi');
    segments.forEach((segment) => {
      if (segment.highlighted) return next.push(segment);
      segment.text.split(regex).forEach((part) => {
        if (!part) return;
        next.push({ text: part, highlighted: part.toLowerCase() === punchline.toLowerCase() });
      });
    });
    segments = next;
  });
  return segments.map((segment, index) => segment.highlighted
    ? <mark key={index}>{segment.text}</mark>
    : <React.Fragment key={index}>{segment.text}</React.Fragment>);
}

export default function InlineBitEditor({
  bit,
  onChange,
  allTags = [],
  personas = [],
  defaultPersonaId,
  geminiApiKey = '',
  onClose,
  onSave,
  onTrash,
  onAddToSet,
  onAddTag,
  onDuplicate,
  onNewBit,
}) {
  const contentRef = useRef(null);
  const audioRef = useRef(null);
  const [history, setHistory] = useState([bit.content || '']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showHighlights, setShowHighlights] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [aiDraft, setAiDraft] = useState('');
  const [aiNotes, setAiNotes] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [personaId, setPersonaId] = useState(defaultPersonaId || personas[0]?.id);
  const [dateInput, setDateInput] = useState(formatDateTime(bit.createdAt || bit.id));

  useEffect(() => setDateInput(formatDateTime(bit.createdAt || bit.id)), [bit.id, bit.createdAt]);
  useEffect(() => () => audioRef.current?.pause(), []);

  const update = (updates) => onChange({ ...bit, ...updates });
  const handleContentChange = (event) => {
    const content = event.target.value;
    const tags = detectLanguageTags(content, bit.tags || []);
    tags.forEach((tag) => { if (!allTags.includes(tag)) onAddTag?.(tag); });
    update({ content, duration: calculateDuration(content), tags });
  };
  const commitHistory = () => {
    if (history[historyIndex] === bit.content) return;
    const next = [...history.slice(0, historyIndex + 1), bit.content];
    setHistory(next); setHistoryIndex(next.length - 1);
  };
  const undo = () => {
    if (historyIndex === 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex); update({ content: history[nextIndex], duration: calculateDuration(history[nextIndex]) });
  };
  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex); update({ content: history[nextIndex], duration: calculateDuration(history[nextIndex]) });
  };
  const addTag = () => {
    const tag = tagInput.replace(/^#/, '').trim();
    if (!tag) return;
    update({ tags: [...new Set([...(bit.tags || []), tag])] });
    onAddTag?.(tag); setTagInput(''); playSound('pop');
  };
  const highlightSelection = () => {
    const textarea = contentRef.current;
    if (!textarea || textarea.selectionStart === textarea.selectionEnd) return;
    const selected = bit.content.slice(textarea.selectionStart, textarea.selectionEnd).trim();
    if (selected) update({ punchlines: [...new Set([...(bit.punchlines || []), selected])] });
  };
  const analyze = async () => {
    if (!bit.content || !personas.length) return;
    setIsAILoading(true); setShowAI(true);
    const persona = personas.find((item) => item.id === personaId) || personas[0];
    try {
      const model = getGeminiModel(geminiApiKey);
      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${persona.prompt}\nReview this bit:\n${bit.content}\nRespond JSON: {"rewrittenContent":"...","notes":"..."}` }] }], generationConfig: { responseMimeType: 'application/json' }, model }),
      });
      const result = parseGeminiJson(response.candidates?.[0]?.content?.parts?.[0]?.text);
      setAiDraft(result.rewrittenContent || bit.content); setAiNotes(result.notes || '');
    } catch (error) { setAiNotes(error.message); }
    finally { setIsAILoading(false); }
  };
  const handleDateBlur = () => { const time = new Date(dateInput).getTime(); if (!Number.isNaN(time)) update({ createdAt: time }); };
  const copyDraft = () => navigator.clipboard?.writeText(aiDraft);

  return <section className="editor-shell">
    <header className="editor-toolbar">
      <button onClick={onClose} className="secondary-button"><ChevronLeft size={18} /> Back</button>
      <button onClick={onSave} className="primary-button"><Save size={16} /> Save</button>
      <div className="toolbar-spacer" />
      <button onClick={() => setShowAI(!showAI)} className="primary-button purple"><Sparkles size={16} /> Studio</button>
      <button onClick={onTrash} className="danger-button">Trash</button>
    </header>
    <div className="editor-body">
      <main className="editor-canvas">
        <div className="editor-title-row"><input className="editor-title" value={bit.title || ''} onChange={(e) => update({ title: e.target.value })} /><select value={bit.status || 'Raw'} onChange={(e) => update({ status: e.target.value })}><option>Raw</option><option>In Progress</option><option>Ready</option></select></div>
        <div className="tag-row">{(bit.tags || []).map((tag) => <button key={tag} onClick={() => update({ tags: bit.tags.filter((item) => item !== tag) })}>#{tag} <X size={12} /></button>)}<input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} placeholder="+ Add tag" /></div>
        <div className="metric-row"><label>Minutes <input type="number" value={bit.duration || 0} onChange={(e) => update({ duration: Number(e.target.value) || 0 })} /></label><label>Plays <input type="number" value={bit.performanceCount || 0} onChange={(e) => update({ performanceCount: Number(e.target.value) || 0 })} /></label><label>Created <input value={dateInput} onChange={(e) => setDateInput(e.target.value)} onBlur={handleDateBlur} /></label></div>
        <div className="script-toolbar"><span>Script ({bit.content?.length || 0} chars)</span><button onClick={undo} disabled={!historyIndex}><Undo size={15} /></button><button onClick={redo} disabled={historyIndex >= history.length - 1}><Redo size={15} /></button><button onClick={() => setShowHighlights(!showHighlights)}><Highlighter size={15} /></button><button onClick={highlightSelection}>Highlight selection</button></div>
        <div className="script-editor">{showHighlights && <div className="highlight-overlay">{highlightText(bit.content || '', bit.punchlines)}</div>}<textarea ref={contentRef} value={bit.content || ''} onChange={handleContentChange} onBlur={commitHistory} /></div>
        <div className="punchline-row">{(bit.punchlines || []).map((punchline) => <span key={punchline}>{punchline}<button onClick={() => update({ punchlines: bit.punchlines.filter((item) => item !== punchline) })}><X size={12} /></button></span>)}</div>
      </main>
      {showAI && <aside className="ai-panel"><div className="ai-header"><strong><Sparkles size={16} /> AI Studio</strong><button onClick={() => setShowAI(false)}><X size={16} /></button></div><select value={personaId || ''} onChange={(e) => setPersonaId(e.target.value)}>{personas.map((persona) => <option key={persona.id} value={persona.id}>{persona.name}</option>)}</select><button onClick={analyze} disabled={isAILoading} className="primary-button purple">{isAILoading ? 'Thinking...' : 'Auto-Analyze'}</button><p>{aiNotes}</p><textarea value={aiDraft} onChange={(e) => setAiDraft(e.target.value)} placeholder="AI draft" /><button onClick={copyDraft} className="secondary-button"><Copy size={15} /> Copy draft</button><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Feedback for AI" /></aside>}
    </div>
    <audio ref={audioRef} hidden />
  </section>;
}
