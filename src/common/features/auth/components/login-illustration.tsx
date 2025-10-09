export const LoginIllustration = () => {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative overflow-hidden">
      <div className="relative z-10 max-w-lg">
        {/* Brand Message */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6 leading-tight">
            <span className="italic text-slate-600 dark:text-slate-400">"</span>
            <span className="bg-gradient-to-r from-emerald-700 via-slate-800 to-slate-700 dark:from-emerald-400 dark:via-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
              StillRoot: where thoughts take root
            </span>
            <span className="italic text-slate-600 dark:text-slate-400">"</span>
          </h2>

          <div className="space-y-3 text-slate-600 dark:text-slate-300">
            <p className="text-lg font-medium leading-relaxed opacity-90">
              For your{" "}
              <span className="italic text-emerald-600 dark:text-emerald-400">fleeting ideas</span>.
            </p>
            <p className="text-lg font-medium leading-relaxed opacity-90">
              For your{" "}
              <span className="italic text-teal-600 dark:text-teal-400">emerging insights</span>.
            </p>
            <p className="text-lg font-medium leading-relaxed opacity-90">
              For your{" "}
              <span className="italic text-cyan-600 dark:text-cyan-400">evolving self</span>.
            </p>
          </div>
        </div>

        {/* Decorative Illustration */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-200 to-cyan-200 dark:from-emerald-800 dark:to-cyan-800 animate-pulse"></div>
          </div>
          <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto relative z-10">
            <g transform="translate(150, 80)">
              <ellipse
                cx="0"
                cy="40"
                rx="25"
                ry="35"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
              <circle
                cx="0"
                cy="-10"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
              <path
                d="M-15,-25 Q-20,-35 -10,-30 Q0,-40 10,-30 Q20,-35 15,-25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
              <path
                d="M-25,20 Q-35,10 -30,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
              <path
                d="M25,20 Q35,10 30,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
              <path
                d="M-15,70 L-20,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
              <path
                d="M15,70 L20,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
              <circle cx="30" cy="0" r="3" fill="#10b981" />
            </g>

            <g transform="translate(120, 60)">
              <path
                d="M0,100 Q-20,80 -15,60 Q-10,40 0,50 Q10,40 15,60 Q20,80 0,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
              <path
                d="M0,50 L0,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600 dark:text-slate-400"
              />
            </g>

            <g transform="translate(180, 60)">
              <circle cx="0" cy="0" r="8" fill="#10b981" />
              <path
                d="M-8,0 Q-12,-5 -8,-10 Q-4,-15 0,-10 Q4,-15 8,-10 Q12,-5 8,0"
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
              />
            </g>

            <g transform="translate(50, 40)">
              <path
                d="M0,0 Q10,-10 20,0 Q10,10 0,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-600 dark:text-slate-400"
              />
            </g>

            <g transform="translate(320, 60)">
              <path
                d="M0,0 Q5,-8 10,0 Q5,8 0,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-600 dark:text-slate-400"
              />
            </g>

            <g transform="translate(80, 120)">
              <path
                d="M0,20 Q-10,10 -5,0 Q0,-10 5,0 Q10,10 0,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-600 dark:text-slate-400"
              />
              <path
                d="M0,0 L0,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-600 dark:text-slate-400"
              />
            </g>
          </svg>
        </div>
      </div>

      <div className="absolute top-10 right-10 w-8 h-8 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
      <div className="absolute top-20 right-20 w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      <div className="absolute bottom-20 left-10 w-6 h-6 border border-slate-300 dark:border-slate-600 rounded-full"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
    </div>
  );
};
