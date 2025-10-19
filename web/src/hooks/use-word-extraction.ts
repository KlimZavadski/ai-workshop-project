import { useState } from 'react'
import { aiService, type WordExtractionResponse } from '@/lib/ai-service'

export function useWordExtraction() {
  const [result, setResult] = useState<WordExtractionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const extractWords = async (text: string, languageLevel: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await aiService.extractWords(text, languageLevel)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to extract words'))
    } finally {
      setLoading(false)
    }
  }

  return {
    result,
    loading,
    error,
    extractWords
  }
}
