import { supabase } from './supabase'

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000'

export interface RandomPhraseResponse {
  phrase: string
  words_used: string[]
}

export interface WordExtractionResponse {
  words: string[]
  total_words: number
  language_level: string
  analysis: string
}

/**
 * Generate a random phrase using the AI service
 * @param words - Array of words to use in the phrase
 * @returns Promise with the generated phrase and words used
 */
export async function generateRandomPhrase(words: string[]): Promise<RandomPhraseResponse> {
  // Get the current session token
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('User must be authenticated to generate phrases')
  }

  const response = await fetch(`${AI_SERVICE_URL}/api/random-phrase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ words }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `Failed to generate phrase: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Extract words from text that correspond to the specified language level
 * @param text - Text to analyze
 * @param languageLevel - CEFR language level (A1-C2)
 * @returns Promise with extracted words and analysis
 */
export async function extractWords(text: string, languageLevel: string): Promise<WordExtractionResponse> {
  // Get the current session token
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('User must be authenticated to extract words')
  }

  const response = await fetch(`${AI_SERVICE_URL}/api/extract-words`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ text, language_level: languageLevel }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `Failed to extract words: ${response.statusText}`)
  }

  return response.json()
}

// Export service object for easier usage
export const aiService = {
  generateRandomPhrase,
  extractWords
}

// Re-export types for convenience
export type { WordExtractionResponse, RandomPhraseResponse }
