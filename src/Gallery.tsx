import * as motion from "motion/react-client";
import { useEffect, useMemo, useState } from "react";

type GalleryCard = {
  id: string;
  title: string;
  caption: string;
  description: string;
};

type InspectState = {
  id: string;
  flipped: boolean;
};

const galleryCards: GalleryCard[] = Array.from({ length: 12 }, (_, index) => {
  const photoNumber = index + 1;
  return {
    id: `gallery-${photoNumber}`,
    title: `Snapshot ${photoNumber}`,
    caption: "Click to relive this moment.",
    description:
      "Add a story about where this photo was taken, who was there, or why it matters. Flip the card for bonus notes.",
  };
});

function Gallery() {
  const [inspectState, setInspectState] = useState<InspectState | null>(null);

  const cardLookup = useMemo(() => {
    return galleryCards.reduce<Record<string, GalleryCard>>(
      (accumulator, card) => {
        accumulator[card.id] = card;
        return accumulator;
      },
      {}
    );
  }, []);

  useEffect(() => {
    if (!inspectState) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setInspectState(null);
      }
      if (event.key.toLowerCase() === "f") {
        setInspectState((previous) =>
          previous ? { ...previous, flipped: !previous.flipped } : previous
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [inspectState]);

  const navigateToSection = (direction: "left" | "right" | "down") => {
    const scrollOptions: ScrollToOptions = {
      behavior: "smooth",
    };

    switch (direction) {
      case "right":
        scrollOptions.left = window.innerWidth;
        scrollOptions.top = 0;
        break;
    }

    window.scrollTo(scrollOptions);
  };

  const closeInspect = () => setInspectState(null);

  const toggleFlip = () =>
    setInspectState((previous) =>
      previous ? { ...previous, flipped: !previous.flipped } : previous
    );

  return (
    <>
      <div className="relative min-h-screen w-full bg-slate-950/90 py-24 text-slate-50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-24">
          <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            {galleryCards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => setInspectState({ id: card.id, flipped: false })}
                className="group relative aspect-3/4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg backdrop-blur transition-colors duration-200 hover:bg-white/10"
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                layoutId={`gallery-card-${card.id}`}
              >
                <div className="flex h-full flex-col justify-between space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25rem] text-slate-300/70">
                      Photo log
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-50 transition-colors group-hover:text-white">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-200/80">{card.caption}</p>
                  <p className="text-right text-xs text-slate-400">
                    Tap to inspect →
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateToSection("right")}
          className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-4xl text-white shadow-lg backdrop-blur hover:bg-white/20"
        >
          →
        </motion.button>
      </div>

      {inspectState && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          onClick={closeInspect}
        >
          <motion.div
            className="relative w-full max-w-lg"
            layoutId={`gallery-card-${inspectState.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute -top-16 right-0 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFlip}
                className="rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur"
              >
                {inspectState.flipped ? "Show front" : "Flip card"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeInspect}
                className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg"
              >
                Return
              </motion.button>
            </div>

            <div className="aspect-3/4 w-full" style={{ perspective: 1200 }}>
              <motion.div
                className="card-3d"
                animate={{ rotateY: inspectState.flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.45, 0, 0.25, 1] }}
              >
                <div className="card-face card-face-front flex h-full w-full flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/95 p-8 text-left text-slate-50 shadow-2xl">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.4rem] text-slate-400/80">
                      {cardLookup[inspectState.id]?.title ?? "Snapshot"}
                    </p>
                    <h2 className="text-3xl font-semibold">
                      {cardLookup[inspectState.id]?.caption ?? "Story"}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200/90">
                    Capture how the scene felt—the colors, the sounds, the
                    inside jokes. Flip for behind-the-camera details.
                  </p>
                  <div className="rounded-2xl border border-dashed border-slate-500/50 p-4 text-xs text-slate-300/70">
                    Tip: Press the F key to flip the card. Press Escape to
                    return to the gallery grid.
                  </div>
                </div>

                <div className="card-face card-face-back flex h-full w-full flex-col justify-between rounded-3xl border border-white/10 bg-linear-to-br from-slate-100 via-white to-slate-200 p-8 text-left text-slate-900 shadow-2xl">
                  <h3 className="text-2xl font-semibold">
                    {cardLookup[inspectState.id]?.title ?? "Snapshot details"}
                  </h3>
                  <p className="text-base leading-relaxed">
                    {cardLookup[inspectState.id]?.description}
                  </p>
                  <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-700 shadow-inner">
                    Jot down camera settings, playlists, or the next adventure
                    this memory inspires.
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Gallery;
