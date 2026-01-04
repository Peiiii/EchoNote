import { useState, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { MessageSquare, Sparkles, Brain, TreePine, Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SVGHomepageProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export const SVGHomepage = ({ onGetStarted, onLearnMore }: SVGHomepageProps) => {
  const { t } = useTranslation();
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background SVG Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" className="absolute inset-0">
          {/* Floating particles */}
          <g className="opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 1920}
                cy={Math.random() * 1080}
                r={Math.random() * 3 + 1}
                fill="currentColor"
                className="text-emerald-400 dark:text-emerald-600"
              >
                <animate
                  attributeName="cy"
                  values={`${Math.random() * 1080};${Math.random() * 1080};${Math.random() * 1080}`}
                  dur={`${Math.random() * 10 + 10}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                StillRoot
              </span>
            </div>

            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-slate-800 dark:text-white">{t('homepage.hero.where')}</span>
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('homepage.hero.thoughtsTakeRoot')}
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                {t('homepage.hero.description')}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('homepage.features.aiConversations')}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <TreePine className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>{t('homepage.features.organizedSpaces')}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Lightbulb className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>{t('homepage.features.intelligentInsights')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                onClick={onGetStarted}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t('homepage.cta.getStarted')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={onLearnMore}
                className="border-slate-300 dark:border-slate-600"
              >
                {t('homepage.cta.learnMore')}
              </Button>
            </div>
          </div>

          {/* Right Side - SVG Illustration */}
          <div className="flex justify-center">
            <MainSVGIllustration animationPhase={animationPhase} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface MainSVGIllustrationProps {
  animationPhase: number;
}

const MainSVGIllustration = ({ animationPhase: _animationPhase }: MainSVGIllustrationProps) => {
  return (
    <svg width="500" height="500" viewBox="0 0 500 500" className="drop-shadow-2xl">
      {/* Background Circle */}
      <circle
        cx="250"
        cy="250"
        r="200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-200 dark:text-slate-700"
        opacity="0.3"
      />

      {/* Central Tree/Thought Root */}
      <g transform="translate(250, 250)">
        {/* Main Trunk */}
        <rect
          x="-8"
          y="-50"
          width="16"
          height="100"
          fill="currentColor"
          className="text-slate-600 dark:text-slate-400"
          rx="8"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.05;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Root System */}
        <g className="opacity-80">
          <path
            d="M-8,50 Q-30,80 -50,100 Q-70,120 -90,140"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-emerald-600 dark:text-emerald-400"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,200;100,100;200,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M8,50 Q30,80 50,100 Q70,120 90,140"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-emerald-600 dark:text-emerald-400"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,200;100,100;200,0"
              dur="3s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M-8,50 Q-20,70 -30,90 Q-40,110 -50,130"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-teal-600 dark:text-teal-400"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,150;75,75;150,0"
              dur="2.5s"
              begin="1s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M8,50 Q20,70 30,90 Q40,110 50,130"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-teal-600 dark:text-teal-400"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,150;75,75;150,0"
              dur="2.5s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Branches/Thoughts */}
        <g className="opacity-90">
          {/* Left Branch */}
          <path
            d="M-8,-30 Q-25,-50 -40,-70 Q-55,-90 -70,-110"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-cyan-600 dark:text-cyan-400"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,100;50,50;100,0"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Right Branch */}
          <path
            d="M8,-30 Q25,-50 40,-70 Q55,-90 70,-110"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-cyan-600 dark:text-cyan-400"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,100;50,50;100,0"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </path>

          {/* Top Branch */}
          <path
            d="M-8,-50 Q0,-70 8,-90 Q15,-110 20,-130"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-cyan-600 dark:text-cyan-400"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,80;40,40;80,0"
              dur="1.8s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Thought Nodes */}
        <g className="opacity-80">
          {/* Root Nodes */}
          <circle cx="-50" cy="100" r="6" fill="#10b981">
            <animate
              attributeName="r"
              values="6;8;6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="50" cy="100" r="6" fill="#10b981">
            <animate
              attributeName="r"
              values="6;8;6"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="-30" cy="90" r="4" fill="#14b8a6">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="1.5s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="30" cy="90" r="4" fill="#14b8a6">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="1.5s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Branch Nodes */}
          <circle cx="-40" cy="-70" r="5" fill="#06b6d4">
            <animate
              attributeName="r"
              values="5;7;5"
              dur="1.8s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="40" cy="-70" r="5" fill="#06b6d4">
            <animate
              attributeName="r"
              values="5;7;5"
              dur="1.8s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="0" cy="-90" r="4" fill="#06b6d4">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="1.6s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Floating Ideas */}
        <g className="opacity-60">
          <circle cx="-80" cy="-20" r="3" fill="#f59e0b">
            <animate
              attributeName="cy"
              values="-20;-30;-20"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="80" cy="-40" r="3" fill="#f59e0b">
            <animate
              attributeName="cy"
              values="-40;-50;-40"
              dur="3s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="-60" cy="20" r="2" fill="#f59e0b">
            <animate
              attributeName="cy"
              values="20;10;20"
              dur="2.5s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="60" cy="10" r="2" fill="#f59e0b">
            <animate
              attributeName="cy"
              values="10;0;10"
              dur="2.5s"
              begin="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>

      {/* Orbiting Elements */}
      <g className="opacity-70">
        <circle cx="150" cy="150" r="2" fill="#8b5cf6">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 250 250;360 250 250"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="350" cy="150" r="2" fill="#8b5cf6">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 250 250;360 250 250"
            dur="20s"
            begin="5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="150" cy="350" r="2" fill="#8b5cf6">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 250 250;360 250 250"
            dur="20s"
            begin="10s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="350" cy="350" r="2" fill="#8b5cf6">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 250 250;360 250 250"
            dur="20s"
            begin="15s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Connection Lines */}
      <g className="opacity-30">
        <line x1="150" y1="150" x2="250" y2="250" stroke="#8b5cf6" strokeWidth="1">
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="4s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="350" y1="150" x2="250" y2="250" stroke="#8b5cf6" strokeWidth="1">
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="4s"
            begin="1s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="150" y1="350" x2="250" y2="250" stroke="#8b5cf6" strokeWidth="1">
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="4s"
            begin="2s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="350" y1="350" x2="250" y2="250" stroke="#8b5cf6" strokeWidth="1">
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="4s"
            begin="3s"
            repeatCount="indefinite"
          />
        </line>
      </g>
    </svg>
  );
};
