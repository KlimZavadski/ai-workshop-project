import { useState } from 'react'
import { aiService, type WordExtractionResponse } from '@/lib/ai-service'
import { validatePolishText, type ValidationResult } from '@/lib/validation'

export function useWordExtraction() {
  const [result, setResult] = useState<WordExtractionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] })

  const validateText = (text: string): ValidationResult => {
    const validationResult = validatePolishText(text)
    setValidation(validationResult)
    return validationResult
  }

  const extractWords = async (text: string, languageLevel: string): Promise<WordExtractionResponse | null> => {
    const validationResult = validateText(text)

    if (!validationResult.isValid) {
      setError(new Error(validationResult.errors.join(', ')))
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await aiService.extractWords(text, languageLevel)
      setResult(response)
      return response
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to extract words'))
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    result,
    loading,
    error,
    validation,
    extractWords,
    validateText
  }
}
