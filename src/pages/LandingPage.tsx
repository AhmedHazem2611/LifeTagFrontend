import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { UseCasesSection } from '../components/landing/UseCasesSection';
import { CtaSection } from '../components/landing/CtaSection';

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-body selection:bg-primary/20">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <CtaSection />
    </main>
  );
}

export default LandingPage;
