"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createTimeline } from "../data/intro-timeline";
import { DESKTOP_SCENE, MOBILE_SCENE, photoSrc } from "../data/scene-config";
import { HeroOverlay, type HeroPhase } from "./HeroOverlay";

// three.js only ever loads on the client, and only once we know the device
// can actually run the scene.
const loadHeroCanvas = () => import("./HeroCanvas");
const HeroCanvas = dynamic(
  () => loadHeroCanvas().then((mod) => mod.HeroCanvas),
  { ssr: false },
);

// Start fetching the scene chunk as soon as this module runs in the
// browser, so the photos are on screen with as little black as possible.
if (typeof window !== "undefined") void loadHeroCanvas();

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function mediaSubscriber(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

const subscribeMobile = mediaSubscriber(MOBILE_QUERY);
const subscribeReduced = mediaSubscriber(REDUCED_QUERY);
const subscribeNever = () => () => {};
const getFalse = () => false;
const getTrue = () => true;
const getMobile = () => window.matchMedia(MOBILE_QUERY).matches;
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

let webglSupport: boolean | null = null;
function supportsWebgl() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/** Archive photographs used by the no-WebGL fallback. Not tied to any city. */
const FALLBACK_PHOTOS = ["room-01", "room-04", "room-05", "room-06"];

export function CinematicHero() {
  // Device capability and motion preference only exist in the browser, so
  // they are read as external stores rather than synced through an effect.
  const mounted = useSyncExternalStore(subscribeNever, getTrue, getFalse);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, getFalse);
  const reducedMotion = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getFalse,
  );
  // INTRO → SETTLING → IDLE. "loading" = textures not decoded yet.
  const [phase, setPhase] = useState<HeroPhase>("loading");
  const [plaqueIn, setPlaqueIn] = useState(false);
  /** True when the plaque should settle quickly (skip / returning visit). */
  const [fastSettle, setFastSettle] = useState(false);
  const [active, setActive] = useState(true);

  const timeline = useRef(createTimeline());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const mode = !mounted
    ? "pending"
    : supportsWebgl()
      ? "webgl"
      : "static";

  const scene = isMobile ? MOBILE_SCENE : DESKTOP_SCENE;

  // Without WebGL or with reduced motion there is no intro to wait for.
  const effectivePhase: HeroPhase =
    mode === "static" || (reducedMotion && phase === "loading") ? "idle" : phase;
  const showPlaque = plaqueIn || effectivePhase === "idle";

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // Stop rendering while the hero is off-screen.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // Called by the scene before its first frame: starts the intro clock.
  const handleReady = useCallback(() => {
    clearTimers();
    const tl = timeline.current;
    tl.start = performance.now();

    if (reducedMotion) {
      tl.instant = true;
      tl.still = true;
      setFastSettle(true);
      setPlaqueIn(true);
      setPhase("idle");
      return;
    }

    const { timing } = scene;
    setPhase("intro");
    later(() => setPlaqueIn(true), timing.plaqueStart * 1000);
    later(() => setPhase("idle"), timing.settleEnd * 1000);
  }, [reducedMotion, scene, later, clearTimers]);

  // Freeze the intro where it is and settle quickly to the final state.
  const handleSkip = useCallback(() => {
    if (phase !== "intro") return;
    clearTimers();
    timeline.current.skipAt = performance.now();
    setFastSettle(true);
    setPlaqueIn(true);
    setPhase("settling");
    later(() => setPhase("idle"), scene.timing.skipDuration * 1000);
  }, [phase, clearTimers, later, scene.timing.skipDuration]);

  return (
    <section
      ref={sectionRef}
      aria-label="Jazzclub"
      className="relative h-[calc(100dvh-72px)] min-h-[560px] w-full overflow-hidden bg-[#08080a]"
    >
      {/* Fetch the ring photos with the page, not after three.js boots, so
          the first frame is ready early. Only the first few — not every photo.
          React hoists these into <head>. */}
      {DESKTOP_SCENE.planes.slice(0, 6).map((plane) => (
        <link
          key={`pd-${plane.id}`}
          rel="preload"
          as="image"
          href={photoSrc(plane.slug, false)}
          media="(min-width: 768px)"
        />
      ))}
      {MOBILE_SCENE.planes.slice(0, 4).map((plane) => (
        <link
          key={`pm-${plane.id}`}
          rel="preload"
          as="image"
          href={photoSrc(plane.slug, true)}
          media="(max-width: 767px)"
        />
      ))}

      {/* Scene layer. The black section behind it never changes. */}
      <div className="absolute inset-0">
        {mode === "webgl" && (
          <HeroCanvas
            scene={scene}
            isMobile={isMobile}
            timeline={timeline}
            active={active}
            onReady={handleReady}
          />
        )}

        {mode === "static" && (
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0 grid grid-cols-2 gap-2 opacity-45 sm:grid-cols-4">
              {FALLBACK_PHOTOS.map((slug) => (
                <div key={slug} className="relative h-full w-full">
                  <Image
                    src={photoSrc(slug, true)}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-[#08080a]/55" />
          </div>
        )}
      </div>

      <HeroOverlay
        phase={effectivePhase}
        showPlaque={showPlaque}
        fastSettle={fastSettle || reducedMotion}
        onSkip={handleSkip}
      />
    </section>
  );
}
