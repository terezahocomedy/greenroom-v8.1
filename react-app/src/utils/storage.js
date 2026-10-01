const STORAGE_KEY = 'greenroom_v3_data';

const defaultState = {
  bits: [],
  sets: [{ id: 'main', name: 'Main Club Set', bitIds: [] }],
  personas: [
    { id: '1', name: 'Comedy Consultant', prompt: 'You are a bilingual stand-up comedy consultant specializing in observational humor. Review my joke and make the punchline hit harder. Keep the language (English/Cantonese) consistent with the input.' },
    { id: '2', name: 'Roast Master', prompt: 'You are a savage roast comic. Review this bit and make it sharper, more aggressive, and add a killer tag at the end.' },
  ],
  allTags: ['Opener', 'Closer', 'Crowd Work', 'Callback', '18+', 'Corporate', 'English', '中文', 'Canton', 'Eng', '廣東話', '普通話'],
  shows: [],
  geminiApiKey: '',
};

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Failed to save state:', error);
    return false;
  }
}

export function exportBits(bits, sets) {
  const json = JSON.stringify({ bits, sets, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `greenroom-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importBits(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve({ bits: data.bits || [], sets: data.sets || [] });
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
