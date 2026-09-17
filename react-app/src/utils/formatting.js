export function calculateDuration(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.round((words / 110) * 10) / 10;
}

export function detectLanguageTags(text, existingTags = []) {
  const tags = new Set(existingTags);
  if (!text) return [...tags];
  if (/[\u4e00-\u9fa5]/.test(text)) {
    tags.add('中文');
    tags.add('Canton');
  } else if (/[a-zA-Z]/.test(text)) {
    tags.add('English');
  }
  return [...tags];
}

export function formatTimer(totalSeconds) {
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
