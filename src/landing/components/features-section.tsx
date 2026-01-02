import { Sparkles, Hash, Search, Layout, Brain, PieChart, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI 成长导师",
    description: "AI 实时监控你的成长状态，提供深度的思维反馈与行动规划建议。",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  {
    icon: Brain,
    title: "多维知识整理",
    description: "通过 Concept Cards 和自动标签，将零散的碎片转化为系统的知识体系。",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  {
    icon: PieChart,
    title: "思维可视化",
    description: "一键生成思维导图与周报，直观呈现你的认知轨迹与项目进展。",
    glow: "rgba(34, 197, 94, 0.4)",
  },
  {
    icon: Zap,
    title: "极简记录体验",
    description: "像发微信一样简单。随时随地，零干扰捕捉你的每一个呼吸间的想法。",
    glow: "rgba(249, 115, 22, 0.4)",
  },
  {
    icon: Hash,
    title: "智能标签",
    description: "使用 #标签 自动组织分类，轻松管理海量笔记",
    color: "from-indigo-500 to-purple-500", // Retaining original color for this position
  },
  {
    icon: Search,
    title: "全文搜索",
    description: "强大的搜索引擎，瞬间找到你需要的任何内容",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Layout,
    title: "多维视图",
    description: "时间线、看板、脑图等多种视图，不同角度看笔记",
    color: "from-pink-500 to-rose-500",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lp-heading font-black tracking-tighter text-white mb-6"
          >
            系统化你的<span className="lp-gradient-text">碎片灵感</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 font-medium max-w-2xl mx-auto"
          >
            我们将复杂的功能隐藏在简洁的界面之下，协助你构建属于自己的第二大脑。
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="lp-glass p-8 rounded-3xl border-white/5 group transition-all duration-500 relative"
            >
              <div 
                className="absolute inset-x-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.glow}, transparent)` }}
              />
              <div 
                className="mb-8 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden group-hover:border-white/20 transition-colors"
              >
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: feature.glow }} 
                />
                <feature.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <h3 className="mb-4 text-xl font-bold text-slate-100 lp-heading leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
