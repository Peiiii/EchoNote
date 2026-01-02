import { HeroSection } from "@/landing/components/hero-section";
import { FeaturesSection } from "@/landing/components/features-section";
import { DemoSection } from "@/landing/components/demo-section";
import { CTASection } from "@/landing/components/cta-section";
import { Footer } from "@/landing/components/footer";
import "@/landing/landing.css";

export const LandingPageV2 = () => {
  return (
    <div className="min-h-screen lp-mesh-bg text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden antialiased">
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};
