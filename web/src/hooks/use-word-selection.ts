import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Word = Database['public']['Tables']['words']['Row']

export interface WordSelection {
  word: string
  selected: boolean
  existsInDb: boolean
}

export function useWordSelection() {
  const [existingWords, setExistingWords] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Загружаем существующие слова из базы данных
  const loadExistingWords = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('words')
        .select('word')
        .eq('language_code', 'pl')

      if (error) throw error

      const wordSet = new Set(data?.map(item => item.word.toLowerCase()) || [])
      setExistingWords(wordSet)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load existing words'))
    } finally {
      setLoading(false)
    }
  }

  // Проверяем, существует ли слово в базе данных
  const checkWordExists = (word: string): boolean => {
    return existingWords.has(word.toLowerCase())
  }

  // Создаем массив выбора слов из извлеченных слов
  const createWordSelections = (words: string[]): WordSelection[] => {
    return words.map(word => ({
      word,
      selected: false,
      existsInDb: checkWordExists(word)
    }))
  }

  // Добавляем выбранные слова в базу данных
  const addSelectedWords = async (selections: WordSelection[]): Promise<void> => {
    const wordsToAdd = selections
      .filter(selection => selection.selected && !selection.existsInDb)
      .map(selection => ({
        word: selection.word,
        language_code: 'pl',
        translated_word: null
      }))

    if (wordsToAdd.length === 0) {
      throw new Error('Нет слов для добавления')
    }

    const { error } = await supabase
      .from('words')
      .insert(wordsToAdd)

    if (error) throw error

    // Обновляем список существующих слов
    await loadExistingWords()
  }

  // Загружаем существующие слова при инициализации
  useEffect(() => {
    loadExistingWords()
  }, [])

  return {
    existingWords,
    loading,
    error,
    checkWordExists,
    createWordSelections,
    addSelectedWords,
    loadExistingWords
  }
}
