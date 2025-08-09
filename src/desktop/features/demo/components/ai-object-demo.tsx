import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Textarea } from '@/common/components/ui/textarea'
import { Button } from '@/common/components/ui/button'
import { generateObject } from '@/common/services/ai/generate-object'

export function AiObjectDemo() {
  const [prompt, setPrompt] = useState('生成一个简短的待办事项，包含标题、是否完成、标签数组（2-3个）。')
  const [result, setResult] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = useMemo(() => z.object({
    title: z.string().max(30),
    done: z.boolean().default(false),
    tags: z.array(z.string()).min(1).max(5),
  }), [])

  const handleRun = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const obj = await generateObject({ schema, prompt, temperature: 0.3 })
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
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">对象生成 Demo</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          基于 zod 约束，前端直连生成并校验结构化对象
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">Prompt</label>
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="请输入对象生成指令..." />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading ? '生成中…' : '生成对象'}
          </Button>
          {!import.meta.env.VITE_DASHSCOPE_API_KEY && (
            <span className="text-xs text-amber-600">未检测到 VITE_DASHSCOPE_API_KEY，请在本地 .env 配置</span>
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
