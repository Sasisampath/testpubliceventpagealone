"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  clamp01,
  easeOutCubic,
  secondsSettled,
  type IntroTimeline,
} from "../data/intro-timeline";
import { photoSrc, type SceneConfig } from "../data/scene-config";
import { CameraJourney } from "./CameraJourney";
import { PhotoPlane } from "./PhotoPlane";

type Props = {
  scene: SceneConfig;
  isMobile: boolean;
  /** Shared intro clock, owned by CinematicHero. */
  timeline: React.RefObject<IntroTimeline>;
  /**
   * Fired once textures are ready, before the first frame renders, so the
   * owner can start the intro clock.
   */
  onReady: () => void;
};

/** Rounded-rect card with UVs normalised to 0..1 across the card. */
function createCardGeometry(width: number, height: number, radius: number) {
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);

  const geometry = new THREE.ShapeGeometry(shape, 8);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) + w) / width, (position.getY(i) + h) / height);
  }
  uv.needsUpdate = true;
  return geometry;
}

/** object-fit: cover — crop the source to the card, never stretch it. */
function coverTexture(texture: THREE.Texture, cardAspect: number) {
  const image = texture.image as { width: number; height: number } | undefined;
  if (!image?.width || !image?.height) return;
  const imageAspect = image.width / image.height;
  if (imageAspect > cardAspect) {
    texture.repeat.set(cardAspect / imageAspect, 1);
  } else {
    texture.repeat.set(1, imageAspect / cardAspect);
  }
  texture.offset.set((1 - texture.repeat.x) / 2, (1 - texture.repeat.y) / 2);
  texture.needsUpdate = true;
}

/**
 * The ring of archive photography. Suspends until every texture is decoded
 * so the journey clock only starts once there is something to show.
 */
export function JazzclubScene({
  scene,
  isMobile,
  timeline,
  onReady,
}: Props) {
  const urls = useMemo(
    () => scene.planes.map((plane) => photoSrc(plane.slug, isMobile)),
    [scene, isMobile],
  );

  const { width, height, cornerRadius } = scene.card;
  const cardAspect = width / height;

  // Configured on load: the textures are owned by the loader cache.
  const textures = useTexture(urls, (loaded) => {
    const list = Array.isArray(loaded) ? loaded : [loaded];
    for (const texture of list) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      coverTexture(texture, cardAspect);
    }
  }) as THREE.Texture[];

  // One geometry shared by every card: identical size, aspect and corners.
  const geometry = useMemo(
    () => createCardGeometry(width, height, cornerRadius),
    [width, height, cornerRadius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  const groupRef = useRef<THREE.Group>(null);

  // The intro clock starts once the scene is actually on screen: after a
  // couple of rendered frames, so texture upload / shader compile hitches
  // never eat into the entrance. Until then every track holds its INTRO
  // transform (see trackProgress).
  const framesRendered = useRef(0);
  const started = useRef(false);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const tl = timeline.current;
    if (!group || !tl) return;
    if (!started.current && ++framesRendered.current >= 3) {
      started.current = true;
      onReady();
    }
    const now = performance.now();

    // Handing over to /events/explore: the ring eases gently backward.
    const exitZ =
      tl.exitAt === null
        ? 0
        : -0.9 * easeOutCubic(clamp01((now - tl.exitAt) / 320));

    const settled = secondsSettled(
      tl,
      now,
      scene.timing.settleEnd,
      scene.timing.skipDuration,
    );
    if (tl.still || settled <= 0) {
      group.rotation.set(0, 0, 0);
      group.position.set(0, 0, exitZ);
      return;
    }

    // The whole ring turns slowly. Never resets, never speeds up.
    group.rotation.y = settled * scene.idleSpin;

    // Tiny parallax toward the cursor and a slow depth breath.
    const ease = 1 - Math.exp(-delta * 2);
    const fade = Math.min(1, settled / 2);
    const px = isMobile ? 0 : state.pointer.x;
    const py = isMobile ? 0 : state.pointer.y;
    group.rotation.x += (py * 0.015 * fade - group.rotation.x) * ease;
    group.position.x += (-px * 0.1 * fade - group.position.x) * ease;
    group.position.z = Math.sin(settled * 0.2) * 0.06 * fade + exitZ;
  });

  return (
    <>
      <CameraJourney scene={scene} timeline={timeline} />
      <group ref={groupRef}>
        {scene.planes.map((plane, index) => (
          <PhotoPlane
            key={plane.id}
            config={plane}
            texture={textures[index]}
            geometry={geometry}
            scene={scene}
            timeline={timeline}
          />
        ))}
      </group>
    </>
  );
}
