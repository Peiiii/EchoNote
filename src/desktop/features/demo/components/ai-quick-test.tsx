import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Textarea } from '@/common/components/ui/textarea'
import { Button } from '@/common/components/ui/button'
import { generateText } from '@/common/services/ai/generate-text'

export function AiQuickTest() {
  const [prompt, setPrompt] = useState('Summarize StillRoot current architecture in 3 points.')
  const [system, setSystem] = useState<string | undefined>('You are a creative AI companion in StillRoot, a personal thought recording and reflection application. You help users explore ideas, solve problems, and think creatively. Keep answers concise but insightful.')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRun = async () => {
    setIsLoading(true)
    setError(null)
    setAnswer('')
    try {
      const text = await generateText({ prompt, system, temperature: 0.7 })
      setAnswer(text)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">AI Quick Test</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Directly call DashScope (OpenAI compatible endpoint) from frontend for quick validation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">System Instruction (Optional)</label>
          <Textarea value={system ?? ''} onChange={e => setSystem(e.target.value || undefined)} placeholder="System instruction (optional)" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">Prompt</label>
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter your question..." />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
          {!import.meta.env.VITE_DASHSCOPE_API_KEY && (
            <span className="text-xs text-amber-600">VITE_DASHSCOPE_API_KEY not detected, please configure in local .env file</span>
          )}
        </div>
        {error && (
          <div className="rounded-md border border-red-300/50 bg-red-50/50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {answer && (
          <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 whitespace-pre-wrap text-slate-800 dark:text-slate-100">
            {answer}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 