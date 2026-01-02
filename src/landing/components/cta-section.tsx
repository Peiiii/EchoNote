import { Check } from "lucide-react";
import { motion } from "framer-motion";

export const CTASection = () => {
  return (
    <section className="px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] lp-glass p-12 lg:p-24 text-center border-white/10 shadow-3xl"
        >
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/10 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl lp-heading font-black tracking-tighter text-white mb-8 leading-tight">
              立即开启你的<br />
              <span className="lp-gradient-text">认知进化之旅</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              让每一个闪念都成为成长的养料。加入 EchoNote，体验 AI 导师引领下的高效思维与规划。
            </p>
 
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center mb-16">
              <button className="lp-button-primary px-12 py-5 rounded-full text-white font-bold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95">
                立即开始免费成长
              </button>
              <button className="px-10 py-5 border border-white/10 text-slate-300 font-bold rounded-full text-xl hover:bg-white/5 transition-all">
                路线图计划
              </button>
            </div>
 
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/5 pt-12">
              {[
                "AI 导师实时反馈",
                "思维导图一键生成",
                "零门槛碎片记录",
                "跨平台自动同步"
              ].map((benefit) => (
                <div key={benefit} className="flex items-center justify-center gap-3 text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
