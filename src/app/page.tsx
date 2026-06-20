import { Hero } from "../components/landing-page/hero-section";
import { StatsSection } from "../components/landing-page/stats-section";
import { PropertiesSection } from "../components/landing-page/propeties-section";
import { ContactCta } from "../components/landing-page/contact-cta";
import { LatestProjects } from "../components/landing-page/latest-project";

export default function Home() {
  return (
    <div>
      <Hero />
      <StatsSection />
      <PropertiesSection />
      <LatestProjects />
      <ContactCta />
    </div>
  );
}
