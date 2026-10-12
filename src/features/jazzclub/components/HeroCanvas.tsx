"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { IntroTimeline } from "../data/intro-timeline";
import type { SceneConfig } from "../data/scene-config";
import { JazzclubScene } from "./JazzclubScene";

type Props = {
  scene: SceneConfig;
  isMobile: boolean;
  /** Shared intro clock, owned by CinematicHero. */
  timeline: React.RefObject<IntroTimeline>;
  /** Paused while the hero is scrolled out of view. */
  active: boolean;
  onReady: () => void;
};

/**
 * Isolated WebGL entry point. This module is the only thing that pulls
 * three.js into the bundle, and it is loaded dynamically by CinematicHero.
 */
export function HeroCanvas({ scene, isMobile, timeline, active, onReady }: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, isMobile ? 1.5 : 1.75]}
      camera={{ fov: scene.camera.fov, position: [0, 0, scene.camera.startZ] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <JazzclubScene
          scene={scene}
          isMobile={isMobile}
          timeline={timeline}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}
