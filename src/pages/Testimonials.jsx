import { useEffect } from "react";
import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import TestimonialsSections from "@/components/site/TestimonialsSections";
import ContactCTA from "@/components/site/ContactCTA";

export default function Testimonials() {
  useLenis();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main data-testid="testimonials-page" className="relative bg-[var(--ink)]">
      <Nav />
      <TestimonialsSections />
      <ContactCTA />
    </main>
  );
}
