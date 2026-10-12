"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import {
  clamp01,
  secondsSettled,
  trackProgress,
  type IntroTimeline,
} from "../data/intro-timeline";
import type { PhotoPlaneConfig, SceneConfig } from "../data/scene-config";

type Props = {
  config: PhotoPlaneConfig;
  texture: THREE.Texture;
  /** Shared standard-card geometry — identical for every photo. */
  geometry: THREE.BufferGeometry;
  scene: SceneConfig;
  timeline: React.RefObject<IntroTimeline>;
};

const { lerp, smoothstep } = THREE.MathUtils;

/** Wrap an angle to (-PI, PI] so rotations take the short way round. */
function wrap(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/**
 * One archive photograph on the ring.
 *
 * FINAL transform: its slot on the ring, facing the axis, scale 1.
 * INTRO transform: final + an authored offset (deeper, shifted, turned,
 * smaller). The card exists in space from the first frame and eases from
 * intro → final. Once settled it stays attached to the ring; only the whole
 * ring turns, individual cards breathe by a few millimetres.
 */
export function PhotoPlane({ config, texture, geometry, scene, timeline }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    const tl = timeline.current;
    if (!mesh || !material || !tl) return;

    const now = performance.now();
    const { timing, ringRadius } = scene;
    const { intro } = config;

    const p = trackProgress(tl, now, intro.delay, timing.cardDuration, timing.skipDuration);
    const k = 1 - p; // remaining intro offset

    // Tiny idle drift once settled — radial + vertical only, no rotation.
    const settled = secondsSettled(tl, now, timing.settleEnd, timing.skipDuration);
    let driftY = 0;
    let driftRadius = 0;
    if (!tl.still && settled > 0) {
      const fade = clamp01(settled / 2);
      driftY = Math.sin(settled * 0.24 + config.driftSeed) * 0.035 * fade;
      driftRadius = Math.sin(settled * 0.19 + config.driftSeed * 1.3) * 0.05 * fade;
    }

    // FINAL transform: its slot on the ring, facing the axis.
    const sin = Math.sin(config.angle);
    const cos = Math.cos(config.angle);
    const finalX = sin * (ringRadius + driftRadius);
    const finalY = config.y + driftY;
    const finalZ = cos * (ringRadius + driftRadius);
    const finalRotY = wrap(config.angle + Math.PI);

    // Cards that end behind the camera are never on screen during the
    // intro, so they simply hold their final slot.
    const flies = cos * ringRadius < scene.camera.endZ - 0.5;

    if (!flies || k === 0) {
      mesh.position.set(finalX, finalY, finalZ);
      mesh.rotation.set(0, finalRotY, 0);
      mesh.scale.setScalar(1);
    } else {
      // INTRO transform: floating ahead of the viewer, pulled toward the
      // centre of view, facing the camera with a slight authored tilt.
      const startX = finalX * 0.7 + intro.x;
      const startY = config.y * 0.4 + intro.y;
      const startZ = finalZ - intro.depth;
      const faceCamera = Math.atan2(-startX, scene.camera.startZ - startZ);
      const startRotY = faceCamera + intro.rotY;

      // Travel toward the viewer and sweep out into the curve; the turn
      // into the ring completes as the card arrives.
      mesh.position.set(
        lerp(startX, finalX, p),
        lerp(startY, finalY, p),
        lerp(startZ, finalZ, p),
      );
      mesh.rotation.set(
        0,
        startRotY + wrap(finalRotY - startRotY) * p,
        intro.rotZ * k,
      );
      mesh.scale.setScalar(lerp(intro.scale, 1, p));
    }

    // Always fully visible — the entrance is spatial, never a fade.
    material.opacity = 1;

    // The card passing behind the plaque dims so the centre stays legible.
    // Same treatment for every card; eased in as the ring forms.
    const ringAngle = config.angle + (mesh.parent?.rotation.y ?? 0);
    const fromCentre = Math.abs(
      Math.atan2(Math.sin(ringAngle - Math.PI), Math.cos(ringAngle - Math.PI)),
    );
    const dim = lerp(
      1,
      0.22 + 0.78 * smoothstep(fromCentre, 0.18, 0.55),
      smoothstep(p, 0.4, 1),
    );
    material.color.setScalar(dim);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
