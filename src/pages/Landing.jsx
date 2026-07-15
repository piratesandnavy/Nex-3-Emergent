import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import Marquee from "@/components/site/Marquee";
import Manifesto from "@/components/site/Manifesto";
import ContactCTA from "@/components/site/ContactCTA";

export default function Landing() {
  useLenis();
  return (
    <main data-testid="landing-page" className="relative bg-[var(--ink)]">
      <Nav />
      <Hero />
      <TrustBar />
      <Marquee />
      <Manifesto />
      <ContactCTA />
    </main>
  );
}
