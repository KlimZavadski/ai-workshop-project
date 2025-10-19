import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useWordExtraction } from '@/hooks/use-word-extraction'

export default function PhrasesPage() {
  const [text, setText] = useState('')
  const [languageLevel, setLanguageLevel] = useState<string>('')
  const { result, loading, error, extractWords } = useWordExtraction()

  const handleSubmit = async () => {
    if (!text.trim() || !languageLevel) return
    await extractWords(text, languageLevel)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Phrases</CardTitle>
            <CardDescription>
              Enter text and select language level to process phrases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="text-input">Text</Label>
              <textarea
                id="text-input"
                placeholder="Enter your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none"
                rows={5}
              />
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
                disabled={!text.trim() || !languageLevel || loading}
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
                    <h3 className="text-sm font-medium mb-3">
                      Extracted Words ({result.total_words}):
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {result.words.length > 0 ? (
                        result.words.map((word, index) => (
                          <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                            {word}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No words found for this level
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Enter your text and select the appropriate language level to extract
                words that correspond to that CEFR level using AI.
              </p>
              <p>
                The system will analyze your text and identify words that match the
                vocabulary complexity of the selected language level.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
