import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Word = Database['public']['Tables']['words']['Row']

const ITEMS_PER_PAGE = 20

export function useWords() {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchWords()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Separate effect for page changes (immediate)
  useEffect(() => {
    if (!searchQuery) {
      fetchWords()
    }
  }, [currentPage])

  const fetchWords = async () => {
    try {
      setLoading(true)

      // Build query with search
      let query = supabase.from('words').select('*', { count: 'exact' })

      if (searchQuery.trim()) {
        // Search in both original word and translation
        query = query.or(`word.ilike.%${searchQuery}%,translated_word.ilike.%${searchQuery}%`)
      }

      // Get total count
      const { count } = await query

      setTotalCount(count || 0)

      // Get paginated data
      const from = (currentPage - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      let dataQuery = supabase.from('words').select('*')

      if (searchQuery.trim()) {
        dataQuery = dataQuery.or(`word.ilike.%${searchQuery}%,translated_word.ilike.%${searchQuery}%`)
      }

      const { data, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Error fetching words:', error)
        return
      }

      setWords(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const refresh = () => {
    fetchWords()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  const clearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
  }

  return {
    words,
    loading,
    currentPage,
    totalPages,
    totalCount,
    searchQuery,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    refresh,
    handleSearch,
    clearSearch,
  }
}
