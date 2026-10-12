import type { Metadata } from "next";
import Image from "next/image";
import { CalendarSection } from "@/features/jazzclub/components/CalendarSection";
import { CinematicHero } from "@/features/jazzclub/components/CinematicHero";
import { EventsSection } from "@/features/jazzclub/components/EventsSection";
import { JazzclubTestimonials } from "@/features/jazzclub/components/JazzclubTestimonials";
import { PartnersSection } from "@/features/jazzclub/components/PartnersSection";
import { SponsorContact } from "@/features/jazzclub/components/SponsorContact";
import { SponsorshipOptions } from "@/features/jazzclub/components/SponsorshipOptions";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "JazzClub Events | JazzHQ",
  description:
    "Invite-only rooms where AI founders, operators, and partners close real deals. Attend the next JazzClub room, or become a co-host.",
  path: "/events",
});

/**
 * One page: attend a room, or co-host one. Everything below the Events
 * section sits on one Figma canvas; a full-width group photo leads into
 * the footer.
 */
export default function EventsPage() {
  return (
    <>
      <CinematicHero />
      <EventsSection />
      <div className="jc-canvas">
        <div className="jc-stack">
          <SponsorshipOptions />
          <CalendarSection />
          <JazzclubTestimonials />
          <PartnersSection />
          <SponsorContact />
        </div>
      </div>
      <div className="relative aspect-[4/1] min-h-[220px] w-full overflow-hidden">
        <Image
          src="/assets/jazzclub/footer-group.webp"
          alt="JazzClub guests and co-hosts together at a JazzHQ event"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover object-[50%_51%]"
        />
      </div>
    </>
  );
}
