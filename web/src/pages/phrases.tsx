import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { useWordExtraction } from '@/hooks/use-word-extraction'
import { useWordSelection, type WordSelection } from '@/hooks/use-word-selection'
import { getWordCount } from '@/lib/validation'

export default function PhrasesPage() {
  const [text, setText] = useState('')
  const [languageLevel, setLanguageLevel] = useState<string>('')
  const [wordSelections, setWordSelections] = useState<WordSelection[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<Error | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { result, loading, error, validation, extractWords, validateText } = useWordExtraction()
  const { createWordSelections, addSelectedWords } = useWordSelection()

  const handleTextChange = (newText: string) => {
    setText(newText)
    validateText(newText)
  }

  const handleSubmit = async () => {
    if (!text.trim() || !languageLevel) return
    const extractionResult = await extractWords(text, languageLevel)
    if (extractionResult) {
      const selections = createWordSelections(extractionResult.words)
      setWordSelections(selections)
    }
  }

  const handleWordSelectionChange = (index: number, selected: boolean) => {
    setWordSelections(prev =>
      prev.map((selection, i) =>
        i === index ? { ...selection, selected } : selection
      )
    )
  }

  const handleSaveSelectedWords = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      await addSelectedWords(wordSelections)
      setSaveSuccess(true)
      // Сбрасываем выбор после сохранения
      setWordSelections(prev =>
        prev.map(selection => ({ ...selection, selected: false }))
      )
    } catch (err) {
      setSaveError(err instanceof Error ? err : new Error('Failed to save words'))
    } finally {
      setSaving(false)
    }
  }

  const wordCount = getWordCount(text)
  const selectedWordsCount = wordSelections.filter(s => s.selected).length
  const canSave = selectedWordsCount > 0 && !saving

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Phrases</CardTitle>
            <CardDescription>
              Введите текст на польском языке (до 100 слов) и выберите уровень языка для извлечения слов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="text-input">Polish Text</Label>
              <textarea
                id="text-input"
                placeholder="Wprowadź tekst w języku polskim..."
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                className={`w-full min-h-[120px] px-3 py-2 border text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none ${validation.isValid
                  ? 'border-input bg-background focus-visible:ring-ring'
                  : 'border-destructive bg-background focus-visible:ring-destructive'
                  }`}
                rows={5}
              />

              {/* Word Count */}
              <div className="flex justify-between items-center text-xs">
                <div className={`${wordCount.isValid ? 'text-muted-foreground' : 'text-destructive'}`}>
                  {wordCount.current}/{wordCount.max} слов
                </div>
                {text.trim().length > 0 && (
                  <div className={`${wordCount.isValid ? 'text-green-600' : 'text-destructive'}`}>
                    {wordCount.isValid ? '✓' : '✗'}
                  </div>
                )}
              </div>

              {/* Validation Errors */}
              {!validation.isValid && validation.errors.length > 0 && (
                <div className="space-y-1">
                  {validation.errors.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Language Level Selection */}
            <div className="space-y-2">
              <Label htmlFor="language-level">Language Level</Label>
              <Select value={languageLevel} onValueChange={setLanguageLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 - Beginner</SelectItem>
                  <SelectItem value="A2">A2 - Elementary</SelectItem>
                  <SelectItem value="B1">B1 - Intermediate</SelectItem>
                  <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                  <SelectItem value="C1">C1 - Advanced</SelectItem>
                  <SelectItem value="C2">C2 - Proficient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!text.trim() || !languageLevel || loading || !validation.isValid}
              >
                {loading ? 'Processing...' : 'Extract Words'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {(result || error) && (
          <Card>
            <CardHeader>
              <CardTitle>Extraction Results</CardTitle>
              <CardDescription>
                Words found for level {languageLevel}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 flex-wrap">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ) : error ? (
                <div className="text-center space-y-2">
                  <p className="text-destructive font-medium">Error extracting words</p>
                  <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
              ) : result ? (
                <>
                  {/* Analysis */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Analysis:</h3>
                    <p className="text-sm text-muted-foreground">{result.analysis}</p>
                  </div>

                  {/* Extracted Words */}
                  <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium">
                            Извлеченные слова ({result.total_words}):
                          </h3>
                          {selectedWordsCount > 0 && (
                            <span className="text-xs text-muted-foreground">
                              Выбрано: {selectedWordsCount}
                            </span>
                          )}
                        </div>

                        {result.words.length > 0 ? (
                          <div className="space-y-2">
                            {wordSelections.map((selection, index) => (
                              <div key={index} className="flex items-center space-x-3 p-2 rounded-md border">
                                <Checkbox
                                  id={`word-${index}`}
                                  checked={selection.selected}
                                  onCheckedChange={(checked) =>
                                    handleWordSelectionChange(index, checked as boolean)
                                  }
                                  disabled={selection.existsInDb}
                                />
                                <Label
                                  htmlFor={`word-${index}`}
                                  className={`flex-1 cursor-pointer ${selection.existsInDb ? 'text-muted-foreground' : ''
                                    }`}
                                >
                                  {selection.word}
                                </Label>
                                {selection.existsInDb && (
                                  <Badge variant="outline" className="text-xs">
                                    Уже в базе
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            Слова для этого уровня не найдены
                          </p>
                        )}
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Save Selected Words Section */}
        {wordSelections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Сохранение слов</CardTitle>
              <CardDescription>
                Выберите слова для добавления в базу данных
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Success/Error Messages */}
              {saveSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    ✓ Слова успешно добавлены в базу данных!
                  </p>
                </div>
              )}

              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    ✗ Ошибка при сохранении: {saveError.message}
                  </p>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSaveSelectedWords}
                  disabled={!canSave}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {saving ? 'Сохранение...' : `Сохранить выбранные слова (${selectedWordsCount})`}
                </Button>
              </div>

              {/* Info about existing words */}
              <div className="text-xs text-muted-foreground text-center">
                Слова, которые уже есть в базе данных, нельзя выбрать для добавления
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Введите текст на польском языке (до 100 слов) и выберите
                соответствующий уровень языка для извлечения слов с помощью ИИ.
              </p>
              <p>
                Система проанализирует ваш текст и определит слова, соответствующие
                сложности словаря выбранного уровня языка CEFR.
              </p>
              <p>
                <strong>Новая функциональность:</strong> После извлечения слов вы можете
                выбрать те, которые хотите добавить в базу данных. Слова, которые уже
                существуют в базе, будут отмечены и недоступны для выбора.
              </p>
              <p className="text-xs">
                <strong>Требования:</strong> Текст должен быть на польском языке, содержать
                от 1 до 100 слов, включать польские символы (ąćęłńóśźż) или
                распространенные польские слова.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
