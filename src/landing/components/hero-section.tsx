import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 lg:px-8 lg:pt-48 lg:pb-32">
      {/* Immersive background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>
      
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Note-Taking</span>
            </div>

            <h1 className="text-6xl md:text-8xl lp-heading font-black tracking-tighter text-white leading-[0.85] mb-8">
              碎片化记录
              <span className="block mt-4 lp-gradient-text underline decoration-blue-500/30 underline-offset-8">
                AI 助你成长
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg font-medium">
              捕捉每一个转瞬即逝的灵感。EchoNote 通过 AI 深度整理与成长规划，协助你将碎片化的信息转化为清晰的行动与认知。
            </p>

            <div className="flex flex-col gap-4 sm:flex-row items-center">
              <button className="lp-button-primary px-10 py-4 rounded-full text-white font-bold text-lg flex items-center gap-2 group">
                立即开始成长
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 text-slate-300 font-semibold hover:text-white transition-colors">
                观看演示视频
              </button>
            </div>

            <div className="flex items-center gap-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-6">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500/50" />
                <span>Zero Friction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500/50" />
                <span>AI Insight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/50" />
                <span>Auto Sync</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Demo Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="relative"
          >
            <div className="lp-glass p-1 rounded-[2.5rem] relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="bg-slate-900/40 rounded-[2.3rem] overflow-hidden border border-white/5 shadow-inner">
                <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                </div>
              
              {/* Placeholder for demo - will be replaced with actual demo component */}
                <div className="p-8 space-y-6">
                  <div className="flex justify-end pr-4">
                    <div className="lp-glass px-6 py-4 rounded-3xl rounded-tr-sm text-sm text-slate-200 border-white/10 max-w-[85%]">
                      感觉最近在学习 React Server Components 时，信息太碎了，没法形成系统。
                    </div>
                  </div>
                  <div className="flex justify-start pl-4 gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="space-y-3 max-w-[85%]">
                      <div className="bg-white/5 px-6 py-4 rounded-3xl rounded-tl-sm text-sm text-slate-300 border border-white/5">
                        理解你的困扰。RSC 的核心在于改变『组件所有权』。我为你生成了思维导图，并关联了你上周关于 SSR 的笔记。
                      </div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                          Mindmap Generated
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                          Insight +3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Floating elements */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute -right-8 -top-8 w-24 h-24 lp-glass rounded-full flex items-center justify-center border-white/10 shadow-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors" />
              <Sparkles className="h-8 w-8 text-blue-400 relative z-10" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute -left-12 bottom-12 lp-glass px-6 py-3 rounded-2xl flex items-center gap-3 border-white/10 shadow-2xl"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 tracking-wider">THOUGHT ORGANIZED</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
