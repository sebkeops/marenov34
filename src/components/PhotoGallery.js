"use client";

import { useState, useEffect, useCallback } from "react";

// Transforme une URL Supabase Storage en URL redimensionnée
function thumbUrl(url, width = 800, quality = 75) {
  if (!url || !url.includes("/storage/v1/object/public/")) return url;
  return url
    .replace("/storage/v1/object/public/", "/storage/v1/render/image/public/")
    + `?width=${width}&quality=${quality}`;
}

export default function PhotoGallery({ photos, familyTitle }) {
  const [lightbox, setLightbox] = useState(null);
  const [loaded, setLoaded] = useState(0);
  const allLoaded = loaded >= photos.length;

  const open = useCallback((index, e) => {
    // Desktop uniquement : pointer = fine (souris) ou coarse (tactile)
    // On vérifie via matchMedia
    if (window.matchMedia("(pointer: fine)").matches) {
      e.preventDefault();
      setLightbox(index);
    }
  }, []);

  const close = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    setLightbox((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    if (lightbox === null) return;

    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, prev, next]);

  return (
    <>
      {/* Overlay de chargement images */}
      {!allLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#20313c]">
          <div className="h-10 w-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="mt-4 text-sm font-medium text-white/60 tracking-wide">Chargement…</p>
        </div>
      )}

      {/* Galerie masonry */}
      <div className="mt-8 columns-1 gap-4 sm:columns-2 md:columns-3">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 break-inside-avoid md:cursor-zoom-in"
            onClick={(e) => open(index, e)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl(photo.image_url)}
              alt={photo.caption || familyTitle}
              className="w-full object-cover transition duration-300 md:hover:scale-[1.02]"
              onLoad={() => setLoaded((n) => n + 1)}
              onError={() => setLoaded((n) => n + 1)}
            />
            {photo.caption && (
              <div className="px-4 py-2 text-xs text-slate-500">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Bouton fermer */}
          <button
            onClick={close}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-xl"
            aria-label="Fermer"
          >
            ✕
          </button>

          {/* Navigation gauche */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-lg"
              aria-label="Photo précédente"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightbox].image_url}
              alt={photos[lightbox].caption || familyTitle}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />
            {photos[lightbox].caption && (
              <div className="mt-2 text-center text-sm text-white/70">
                {photos[lightbox].caption}
              </div>
            )}
            {photos.length > 1 && (
              <div className="mt-1 text-center text-xs text-white/40">
                {lightbox + 1} / {photos.length}
              </div>
            )}
          </div>

          {/* Navigation droite */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-lg"
              aria-label="Photo suivante"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
