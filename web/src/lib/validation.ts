/**
 * Validation utilities for text input
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validates if text is in Polish language
 * Uses basic Polish character detection and common Polish words
 */
export function validatePolishLanguage(text: string): boolean {
  if (!text.trim()) return false

  // Polish-specific characters
  const polishChars = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/

  // Common Polish words (basic set)
  const polishWords = [
    'jest', 'nie', 'że', 'się', 'na', 'w', 'z', 'do', 'od', 'po', 'przez', 'dla',
    'ale', 'lub', 'i', 'oraz', 'także', 'również', 'bardzo', 'może', 'można',
    'trzeba', 'powinien', 'powinna', 'powinno', 'mogę', 'możesz', 'może',
    'człowiek', 'dom', 'praca', 'czas', 'dzień', 'rok', 'miesiąc', 'tydzień',
    'godzina', 'minuta', 'sekunda', 'dzisiaj', 'wczoraj', 'jutro', 'teraz',
    'tutaj', 'tam', 'gdzie', 'kiedy', 'jak', 'dlaczego', 'co', 'kto', 'który'
  ]

  const words = text.toLowerCase().split(/\s+/)

  // Check for Polish characters
  const hasPolishChars = polishChars.test(text)

  // Check for Polish words (at least 20% should be Polish words)
  const polishWordCount = words.filter(word =>
    polishWords.includes(word.replace(/[.,!?;:]/g, ''))
  ).length

  const polishWordRatio = polishWordCount / words.length

  return hasPolishChars || polishWordRatio >= 0.2
}

/**
 * Validates text length (in characters)
 */
export function validateTextLength(text: string, minLength: number = 10, maxLength: number = 100): boolean {
  const trimmedText = text.trim()
  return trimmedText.length >= minLength && trimmedText.length <= maxLength
}

/**
 * Validates word count
 */
export function validateWordCount(text: string, minWords: number = 1, maxWords: number = 100): boolean {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0)
  return words.length >= minWords && words.length <= maxWords
}

/**
 * Comprehensive text validation for Polish language input
 */
export function validatePolishText(text: string): ValidationResult {
  const errors: string[] = []

  if (!text.trim()) {
    errors.push('Текст не может быть пустым')
    return { isValid: false, errors }
  }

  if (!validateWordCount(text, 1, 100)) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    if (words.length < 1) {
      errors.push('Текст должен содержать минимум 1 слово')
    }
    if (words.length > 100) {
      errors.push('Текст не должен превышать 100 слов')
    }
  }

  if (!validatePolishLanguage(text)) {
    errors.push('Текст должен быть на польском языке')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get word count for display
 */
export function getWordCount(text: string): { current: number; max: number; isValid: boolean } {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0)
  const current = words.length
  const max = 100
  const isValid = current >= 1 && current <= max

  return { current, max, isValid }
}
