import { Github, Twitter, Mail } from "lucide-react";

const navigation = {
  product: [
    { name: "功能特性", href: "#features" },
    { name: "使用案例", href: "#use-cases" },
    { name: "定价", href: "#pricing" },
    { name: "更新日志", href: "#changelog" },
  ],
  support: [
    { name: "帮助文档", href: "#docs" },
    { name: "API 文档", href: "#api" },
    { name: "社区论坛", href: "#community" },
    { name: "联系我们", href: "#contact" },
  ],
  company: [
    { name: "关于我们", href: "#about" },
    { name: "博客", href: "#blog" },
    { name: "隐私政策", href: "#privacy" },
    { name: "服务条款", href: "#terms" },
  ],
  social: [
    { name: "GitHub", href: "https://github.com/Peiiii/EchoNote", icon: Github },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Email", href: "mailto:contact@stillroot.app", icon: Mail },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-black text-white lp-heading tracking-tighter uppercase">EchoNote</h3>
            <p className="mt-6 text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
              让碎片化记录成为你成长的源动力。
              <br />
              借助 AI 的深度整理与导师化引导，开启你的认知进化之旅。
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-white/40">产品</h4>
            <ul className="mt-4 space-y-2">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-white/40">支持</h4>
            <ul className="mt-4 space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-white/40">公司</h4>
            <ul className="mt-4 space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-24 border-t border-white/5 pt-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              © {new Date().getFullYear()} EchoNote. Built for Cognitive Growth.
            </p>
            
            <div className="flex gap-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all font-bold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
