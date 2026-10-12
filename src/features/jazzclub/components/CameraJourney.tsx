"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { trackProgress, type IntroTimeline } from "../data/intro-timeline";
import type { SceneConfig } from "../data/scene-config";

type Props = {
  scene: SceneConfig;
  timeline: React.RefObject<IntroTimeline>;
};

/**
 * Gentle one-shot approach from slightly farther back to the final framing.
 * Once it lands the camera is parked and never written to again — the intro
 * never replays and the camera never drifts.
 */
export function CameraJourney({ scene, timeline }: Props) {
  const { camera } = useThree();
  const parkedRef = useRef(false);

  useFrame(() => {
    const tl = timeline.current;
    if (!tl || parkedRef.current) return;
    const { camera: cam, timing } = scene;
    const p = trackProgress(
      tl,
      performance.now(),
      0,
      timing.cameraDuration,
      timing.skipDuration,
    );
    camera.position.set(0, 0, cam.startZ + (cam.endZ - cam.startZ) * p);
    camera.lookAt(0, 0, 0);
    if (p >= 1) parkedRef.current = true;
  });

  return null;
}
