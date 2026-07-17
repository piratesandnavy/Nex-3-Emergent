import { useEffect } from "react";
import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import TeamSections from "@/components/site/TeamSections";
import ContactCTA from "@/components/site/ContactCTA";

export default function Team() {
  useLenis();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main data-testid="team-page" className="relative bg-[var(--ink)]">
      <Nav />
      <TeamSections />
      <ContactCTA careers />
    </main>
  );
}
