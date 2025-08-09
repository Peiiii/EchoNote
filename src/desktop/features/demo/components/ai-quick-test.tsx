import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Textarea } from '@/common/components/ui/textarea'
import { Button } from '@/common/components/ui/button'
import { generateText } from '@/common/services/ai/generate-text'

export function AiQuickTest() {
  const [prompt, setPrompt] = useState('用 3 点总结 EchoNote 当前架构。')
  const [system, setSystem] = useState<string | undefined>('你是资深前端/全栈工程师，回答要精炼。')
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
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">AI 快速测试</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          直接在前端调用 DashScope（OpenAI 兼容端点）进行快速验证
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">System 指令（可选）</label>
          <Textarea value={system ?? ''} onChange={e => setSystem(e.target.value || undefined)} placeholder="系统指令，可留空" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">Prompt</label>
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="请输入问题..." />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading ? '生成中…' : '生成'}
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
        {answer && (
          <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 whitespace-pre-wrap text-slate-800 dark:text-slate-100">
            {answer}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 