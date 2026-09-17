export async function fetchWithRetry(url, options, retries = 3) {
  const delays = [1000, 2000, 4000];
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === retries - 1) {
        throw new Error(`API request failed: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
    }
  }
  throw new Error('API request failed');
}

export function getGeminiModel(apiKey) {
  return apiKey ? 'gemini-3.5-flash' : 'gemini-2.5-flash-preview-09-2025';
}

export function parseGeminiJson(value) {
  const cleaned = String(value || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  return JSON.parse(cleaned);
}
