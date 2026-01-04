import { Sparkles, Hash, Search, Layout, Brain, PieChart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const featureIcons = [
  Sparkles,
  Brain,
  PieChart,
  Zap,
  Hash,
  Search,
  Layout,
];

const featureGlows = [
  "rgba(59, 130, 246, 0.4)",
  "rgba(168, 85, 247, 0.4)",
  "rgba(34, 197, 94, 0.4)",
  "rgba(249, 115, 22, 0.4)",
  "rgba(99, 102, 241, 0.4)",
  "rgba(99, 102, 241, 0.4)",
  "rgba(236, 72, 153, 0.4)",
];

export const FeaturesSection = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: featureIcons[0],
      title: t("landing.features.feature1.title"),
      description: t("landing.features.feature1.description"),
      glow: featureGlows[0],
    },
    {
      icon: featureIcons[1],
      title: t("landing.features.feature2.title"),
      description: t("landing.features.feature2.description"),
      glow: featureGlows[1],
    },
    {
      icon: featureIcons[2],
      title: t("landing.features.feature3.title"),
      description: t("landing.features.feature3.description"),
      glow: featureGlows[2],
    },
    {
      icon: featureIcons[3],
      title: t("landing.features.feature4.title"),
      description: t("landing.features.feature4.description"),
      glow: featureGlows[3],
    },
    {
      icon: featureIcons[4],
      title: t("landing.features.feature5.title"),
      description: t("landing.features.feature5.description"),
      glow: featureGlows[4],
    },
    {
      icon: featureIcons[5],
      title: t("landing.features.feature6.title"),
      description: t("landing.features.feature6.description"),
      glow: featureGlows[5],
    },
    {
      icon: featureIcons[6],
      title: t("landing.features.feature7.title"),
      description: t("landing.features.feature7.description"),
      glow: featureGlows[6],
    },
  ];
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
            {t("landing.features.title")}
            <span className="lp-gradient-text">{t("landing.features.titleHighlight")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 font-medium max-w-2xl mx-auto"
          >
            {t("landing.features.description")}
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
