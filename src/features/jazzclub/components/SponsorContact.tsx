import { LiteYouTube } from "./LiteYouTube";
import { LazyFillout } from "./LazyFillout";
import { SPONSOR_EVENTS_PAGE } from "@/data/onboarding";
import { SPONSOR_ID } from "../data/anchors";

/** The JazzHQ "Voices from Around the World" short shown in the Figma. */
const COHOST_VIDEO_ID = "CxDrAnhX35Q";

/**
 * Figma "Become a Co-Host": centred heading, then a balanced pair — YouTube
 * embed left, the existing Fillout form right — sharing one frame height.
 */
export function SponsorContact() {
  return (
    <section
      id={SPONSOR_ID}
      aria-labelledby="cohost-form-heading"
      className="page-section scroll-mt-24"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 id="cohost-form-heading" className="jc-h2 text-center">
          Become a Co-Host
        </h2>

        <div className="jc-pair mt-[30px]">
          <div className="jc-pair__video">
            <LiteYouTube
              id={COHOST_VIDEO_ID}
              title="Voices from Around the World | Global Leaders on AI, Business & Innovation with JazzHQ"
            />
          </div>
          <div className="jc-pair__form">
            <LazyFillout formId={SPONSOR_EVENTS_PAGE.filloutId!} />
          </div>
        </div>
      </div>
    </section>
  );
}
