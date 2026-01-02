import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const DemoSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", isUser: true, content: "刚刚读完了《深度工作》，感觉自己在任务规划上还有很大提升空间。想把里面的方法应用到下周的项目中。", timestamp: new Date() },
    { id: "2", isUser: false, content: "读得好！《深度工作》的核心在于保护『高价值产出』。我为你整理了一份下周的『深度工作实验方案』：\n\n1. **封锁时间**：每天上午 9-11 点关闭所有推送。\n2. **度量指标**：记录你的『深度时间』，而不是任务数量。\n3. **仪式感**：为进入状态设计一个专属动作。\n\n需要我帮你把这些加入到 OKR 规划中吗？", timestamp: new Date() },
    { id: "3", isUser: true, content: "好主意，帮我生成一份简单的周规划建议。", timestamp: new Date() },
    { id: "4", isUser: false, content: "已根据你的笔记生成『深度工作实验周』计划：\n\n- 周一：识别并移除现有的沟通干扰项。\n- 周二：在 Mindmap 视图中拆解项目核心难点。\n- 周四：进行一次 4 小时的深度开发冲刺。\n\n我会每天早晨提醒你当天的深度目标。", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `💡 基于你的记录，我生成了几个思考方向：\n\n• 深度工作的核心原则是什么？\n• 如何在日常工作中实践深度工作？\n• 深度工作与番茄工作法的结合点在哪里？`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lp-heading font-black tracking-tighter text-white"
          >
            与你的成长<span className="lp-gradient-text">实时对话</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-slate-400 font-medium"
          >
            无需注册，直接感受 AI 导师引领的认知进化
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="lp-glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl">
            {/* Header */}
            <div className="border-b border-white/5 bg-white/5 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  </div>
                  <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">Growth Space / #Action-Plan</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI Status: Connected</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-8 space-y-6 bg-slate-900/40">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 border ${
                        message.isUser
                          ? "bg-blue-600/20 border-blue-500/30 text-slate-100 rounded-tr-sm"
                          : "bg-white/5 border-white/10 text-slate-300 rounded-tl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm leading-relaxed font-medium">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/5 bg-white/5 p-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="与你的 AI 导师对话..."
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-900/50 px-6 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="lp-button-primary w-12 h-12 rounded-2xl flex items-center justify-center text-white p-0"
                >
                  <Send className="h-5 w-5" />
                </button>
                <button
                   className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Sparkles className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
 
          <p className="mt-8 text-center text-sm text-slate-500 font-bold uppercase tracking-widest">
            👆 立即输入你的想法，体验 AI 如何重塑你的认知
          </p>
        </motion.div>
      </div>
    </section>
  );
};
