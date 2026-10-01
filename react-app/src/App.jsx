import React from 'react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import InlineBitEditor from './components/InlineBitEditor.jsx';
import PersonaEditor from './components/PersonaEditor.jsx';
import ExportModal from './components/ExportModal.jsx';
import './components/components.css';
import './components/editor.css';

const sampleBit = {
  id: 'demo-1',
  title: 'Demo Bit',
  content: 'I tried to organize my life with a spreadsheet. Now my calendar is more emotionally available than my ex.',
  duration: 2.8,
  performanceCount: 12,
  status: 'Ready',
  tags: ['English', 'Opener'],
  punchlines: ['emotionally available than my ex'],
  createdAt: Date.now(),
};

const sampleSet = {
  id: 'set-1',
  name: 'Club Warmup',
  bitIds: ['demo-1'],
};

const samplePersonas = [
  { id: '1', name: 'Comedy Consultant', prompt: 'You are a stand-up comedy consultant...' },
  { id: '2', name: 'Roast Master', prompt: 'You are a savage roast comic...' },
];

export default function App() {
  const onChange = (nextBit) => {
    console.log('Bit updated', nextBit.title);
  };

  return (
    <ErrorBoundary>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">GreenRoom v3</p>
            <h1>React conversion workspace</h1>
          </div>
          <div className="header-actions">
            <button className="secondary-button">Library</button>
            <button className="primary-button">New Set</button>
          </div>
        </header>

        <div className="app-grid">
          <aside className="panel left-panel">
            <h2>Bit Library</h2>
            <div className="card-list">
              <div className="mini-card selected">
                <strong>{sampleBit.title}</strong>
                <span>{sampleBit.tags.join(' • ')}</span>
              </div>
              <div className="mini-card">
                <strong>Openers</strong>
                <span>2 bits ready</span>
              </div>
            </div>
          </aside>

          <main className="panel center-panel">
            <InlineBitEditor
              bit={sampleBit}
              onChange={onChange}
              allTags={['English', 'Opener', 'Crowd Work', '中文']}
              personas={samplePersonas}
              defaultPersonaId="1"
              geminiApiKey=""
              onClose={() => {}}
              onSave={() => {}}
              onTrash={() => {}}
              onAddToSet={() => {}}
              onAddTag={() => {}}
              onDuplicate={() => {}}
              onNewBit={() => {}}
            />
          </main>

          <aside className="panel right-panel">
            <h2>Set Builder</h2>
            <div className="set-card">
              <strong>{sampleSet.name}</strong>
              <span>1 bit loaded</span>
            </div>
            <div className="set-list-item">1. {sampleBit.title}</div>
          </aside>
        </div>

        <PersonaEditor
          persona={samplePersonas[0]}
          personas={samplePersonas}
          onClose={() => {}}
          onSave={() => {}}
          onDelete={() => {}}
        />

        <ExportModal
          activeSet={sampleSet}
          bits={[sampleBit]}
          totalSetTime={sampleBit.duration}
          onClose={() => {}}
        />
      </div>
    </ErrorBoundary>
  );
}
