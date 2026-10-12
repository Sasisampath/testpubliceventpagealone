"use client";

import { useEffect, useRef, useState } from "react";
import { FilloutEmbed } from "@/components/onboarding/fillout-embed";

/**
 * Mounts the shared Fillout embed only once the form is near the viewport,
 * so its iframe and scripts never load with the top of the page.
 */
export function LazyFillout({ formId }: { formId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full">
      {visible && <FilloutEmbed formId={formId} />}
    </div>
  );
}
