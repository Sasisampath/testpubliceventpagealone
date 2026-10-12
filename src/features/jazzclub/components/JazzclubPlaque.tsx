"use client";

import { useEffect, useRef } from "react";

/** Resting pose — a slight angle so the plaque's shallow depth reads. */
const REST_X = 6;
const REST_Y = -10;
/** Maximum extra tilt from the cursor, degrees. */
const MAX_TILT = 5;
/** Forward lift while hovered, px. */
const HOVER_Z = 8;
/** Stacked slices that form the shallow body (≈ 10px deep). */
const DEPTH_SLICES = 10;
const SLICE_GAP = 1;

type Props = {
  /** Cursor tilt is only live once the hero has settled. */
  interactive: boolean;
};

/**
 * Compact white Jazzclub plaque (2.5D). The supplied logo is placed,
 * unmodified, on a pure-white rounded front face; a few stacked neutral
 * slices behind it give a very shallow physical edge. No colour tints.
 *
 * Desktop, once idle: subtle cursor tilt (≤5°), tiny forward lift and a soft
 * neutral light response; eases back to rest on leave. No spin, no flip.
 */
export function JazzclubPlaque({ interactive }: Props) {
  const hitRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hit = hitRef.current;
    const body = bodyRef.current;
    const shade = shadeRef.current;
    if (!hit || !body || !shade || !interactive) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    const target = { x: 0, y: 0, z: 0 };
    const current = { x: 0, y: 0, z: 0 };
    let frame = 0;

    const apply = () => {
      body.style.transform = `translateZ(${current.z}px) rotateX(${REST_X + current.x}deg) rotateY(${REST_Y + current.y}deg)`;
      shade.style.setProperty("--lx", `${50 - (current.y / MAX_TILT) * 35}%`);
      shade.style.setProperty("--ly", `${35 + (current.x / MAX_TILT) * 35}%`);
    };

    const render = () => {
      // Damped ease toward the target — smooth, never overshoots.
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      current.z += (target.z - current.z) * 0.12;
      apply();
      const settled =
        Math.abs(target.x - current.x) < 0.01 &&
        Math.abs(target.y - current.y) < 0.01 &&
        Math.abs(target.z - current.z) < 0.05;
      frame = settled ? 0 : requestAnimationFrame(render);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      const rect = hit.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      target.y = Math.max(-1, Math.min(1, nx)) * MAX_TILT;
      target.x = -Math.max(-1, Math.min(1, ny)) * MAX_TILT;
      target.z = HOVER_Z;
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      target.z = 0;
      kick();
    };

    hit.addEventListener("pointermove", onMove);
    hit.addEventListener("pointerleave", onLeave);
    return () => {
      hit.removeEventListener("pointermove", onMove);
      hit.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      // Leave the plaque at rest when interaction switches off.
      current.x = current.y = current.z = 0;
      apply();
    };
  }, [interactive]);

  const face = "absolute inset-0 rounded-[28px] sm:rounded-[34px]";

  return (
    // Generous hit area so the tilt starts before the cursor reaches the edge.
    <div
      ref={hitRef}
      className="pointer-events-auto relative -m-8 p-8 [perspective:900px]"
    >
      <div
        ref={bodyRef}
        className="relative h-[150px] w-[164px] [transform-style:preserve-3d] sm:h-[200px] sm:w-[218px]"
        style={{ transform: `rotateX(${REST_X}deg) rotateY(${REST_Y}deg)` }}
      >
        {/* Soft neutral contact shadow. */}
        <div
          aria-hidden="true"
          className={`${face} bg-black/45 blur-xl`}
          style={{
            transform: `translateZ(${-DEPTH_SLICES * SLICE_GAP - 12}px) translateY(12px) scale(0.94)`,
          }}
        />

        {/* Shallow neutral edge: white → light grey, no tint. */}
        {Array.from({ length: DEPTH_SLICES }, (_, i) => {
          const shade = Math.round(246 - (i / (DEPTH_SLICES - 1)) * 40);
          return (
            <div
              key={i}
              aria-hidden="true"
              className={face}
              style={{
                transform: `translateZ(${-(i + 1) * SLICE_GAP}px)`,
                backgroundColor: `rgb(${shade} ${shade} ${shade})`,
              }}
            />
          );
        })}

        {/* Front face — pure white, exact supplied logo. */}
        <div
          className={`${face} flex items-center justify-center overflow-hidden bg-white`}
          style={{
            boxShadow:
              "inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -2px 6px rgba(0,0,0,0.06)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/jazzclub/logos/jazzclub.svg"
            alt="Jazzclub"
            width={260}
            height={260}
            draggable={false}
            className="h-[128px] w-auto select-none sm:h-[172px]"
          />
          {/* Very subtle neutral light falloff that follows the tilt. */}
          <div
            ref={shadeRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at var(--lx, 50%) var(--ly, 35%), rgba(0,0,0,0) 45%, rgba(0,0,0,0.045) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
