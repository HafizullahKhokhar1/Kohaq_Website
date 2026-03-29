import { EcosystemOverview } from "@/components/home/EcosystemOverview";
import { EventsCarousel } from "@/components/home/EventsCarousel";
import { HeroSection } from "@/components/home/HeroSection";
import { ImpactStats } from "@/components/home/ImpactStats";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { Testimonials } from "@/components/home/Testimonials";

export default function MarketingHomePage() {
  return (
    <main>
      <HeroSection />
      <EcosystemOverview />
      <ImpactStats />
      <EventsCarousel />
      <PartnerLogos />
      <Testimonials />
    </main>
  );
}

