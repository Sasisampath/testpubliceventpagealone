"use client";

type FilloutEmbedProps = {
  formId: string;
};

/**
 * Preview build: the form is shown for layout only. `inert` blocks pointer
 * and keyboard input, so nothing can be typed or submitted.
 */
export function FilloutEmbed({ formId }: FilloutEmbedProps) {
  return (
    <div className="onboarding-fillout__embed relative" inert>
      <iframe
        key={formId}
        src={`https://embed.fillout.com/t/${formId}?fillout-embed-type=standard&fillout-embed-dynamic-resize=true`}
        title="JazzHQ form (preview, disabled)"
        className="onboarding-fillout__iframe pointer-events-none"
        tabIndex={-1}
      />
      <span className="absolute right-3 top-3 rounded-full bg-[#131315] px-3 py-1 text-xs font-semibold text-white">
        Preview · form disabled
      </span>
    </div>
  );
}
