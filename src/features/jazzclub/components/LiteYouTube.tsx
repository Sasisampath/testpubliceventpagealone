"use client";

import { useState } from "react";

/**
 * YouTube without the upfront cost: a lazy thumbnail and play button; the
 * real player (and its ~1MB of scripts) loads only when the viewer taps play.
 */
export function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block h-full w-full cursor-pointer"
    >
      {/* Plain <img>: YouTube's still needs no optimisation and no
          remote-image config. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/oar2.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition group-hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-[#131315]">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
