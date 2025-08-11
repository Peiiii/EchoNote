import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Textarea } from '@/common/components/ui/textarea'
import { Button } from '@/common/components/ui/button'
import { generateObject } from '@/common/services/ai/generate-object'

// Define the expected return type
interface TodoItem {
  title: string
  done: boolean
  tags: string[]
}

export function AiObjectDemo() {
  const [prompt, setPrompt] = useState('Generate a short todo item with title, completion status, and tags array (2-3 items).')
  const [result, setResult] = useState<TodoItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = useMemo(() => ({
    type: 'object',
    properties: {
      title: {
        type: 'string',
        maxLength: 30
      },
      done: {
        type: 'boolean',
        default: false
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 5
      }
    },
    required: ['title', 'done', 'tags']
  }), [])

  const handleRun = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const obj = await generateObject<TodoItem>({ 
        schema, 
        prompt, 
        temperature: 0.3,
        jsonOnly: true
      })
      setResult(obj)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Object Generation Demo</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Generate and validate structured objects using JSON Schema constraints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">Prompt</label>
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter object generation instructions..." />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Object'}
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
        {result !== null && (
          <pre className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-800 dark:text-slate-100 overflow-auto max-h-80">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
