import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { FeatureGrid } from './FeatureGrid';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />
      <HeroSection />
      <FeatureGrid />
      <CTASection />
      <Footer />
    </div>
  );
}
