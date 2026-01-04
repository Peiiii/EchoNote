import { Github, Twitter, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  
  const navigation = {
    product: [
      { name: t("landing.footer.product.features"), href: "#features" },
      { name: t("landing.footer.product.useCases"), href: "#use-cases" },
      { name: t("landing.footer.product.pricing"), href: "#pricing" },
      { name: t("landing.footer.product.changelog"), href: "#changelog" },
    ],
    support: [
      { name: t("landing.footer.support.docs"), href: "#docs" },
      { name: t("landing.footer.support.api"), href: "#api" },
      { name: t("landing.footer.support.community"), href: "#community" },
      { name: t("landing.footer.support.contact"), href: "#contact" },
    ],
    company: [
      { name: t("landing.footer.company.about"), href: "#about" },
      { name: t("landing.footer.company.blog"), href: "#blog" },
      { name: t("landing.footer.company.privacy"), href: "#privacy" },
      { name: t("landing.footer.company.terms"), href: "#terms" },
    ],
    social: [
      { name: "GitHub", href: "https://github.com/Peiiii/EchoNote", icon: Github },
      { name: "Twitter", href: "#", icon: Twitter },
      { name: "Email", href: "mailto:contact@stillroot.app", icon: Mail },
    ],
  };
  return (
    <footer className="border-t border-white/5 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-black text-white lp-heading tracking-tighter uppercase">{t("landing.footer.brand")}</h3>
            <p className="mt-6 text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
              {t("landing.footer.description")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-white/40">{t("landing.footer.product.label")}</h4>
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
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-white/40">{t("landing.footer.support.label")}</h4>
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
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-white/40">{t("landing.footer.company.label")}</h4>
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
              {t("landing.footer.copyright", { year: new Date().getFullYear() })}
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
