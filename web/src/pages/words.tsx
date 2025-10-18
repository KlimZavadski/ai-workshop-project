import { useWords } from '@/hooks/use-words'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function WordsPage() {
  const {
    words,
    loading,
    currentPage,
    totalPages,
    totalCount,
    searchQuery,
    goToNextPage,
    goToPreviousPage,
    handleSearch,
    clearSearch,
  } = useWords()

  const [localSearchQuery, setLocalSearchQuery] = useState('')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value)
    handleSearch(value)
  }

  const handleClearSearch = () => {
    setLocalSearchQuery('')
    clearSearch()
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Words</CardTitle>
          <CardDescription>
            All words from the database (showing {words.length} of {totalCount} words)
            {searchQuery && (
              <span className="text-blue-600"> • Searching for: "{searchQuery}"</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by word or translation..."
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="flex-1"
              />
              {searchQuery && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading words...</p>
            </div>
          ) : words.length === 0 ? (
            <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery ? `No words found for "${searchQuery}"` : 'No words found'}
                </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Word</TableHead>
                          <TableHead>Language</TableHead>
                          <TableHead>Translation</TableHead>
                      <TableHead className="text-right">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {words.map((word) => (
                      <TableRow key={word.id}>
                        <TableCell className="font-mono text-xs">
                          {word.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">{word.word}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {word.language_code.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {word.translated_word || '-'}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatDate(word.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
