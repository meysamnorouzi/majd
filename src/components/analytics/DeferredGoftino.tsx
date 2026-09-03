"use client";

import { useEffect } from "react";

const WIDGET_ID = "x2AETb";
const LOAD_AFTER_MS = 4000;

function injectGoftino() {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    Goftino?: { setWidget: (opts: { marginLeft: number; marginBottom: number }) => void };
    __majdGoftinoLoaded?: boolean;
  };
  if (w.__majdGoftinoLoaded) return;
  w.__majdGoftinoLoaded = true;

  const script = document.createElement("script");
  const src = `https://www.goftino.com/widget/${WIDGET_ID}`;
  const existing = localStorage.getItem(`goftino_${WIDGET_ID}`);
  script.async = true;
  script.src = existing ? `${src}?o=${existing}` : src;
  document.head.appendChild(script);

  window.addEventListener("goftino_ready", () => {
    w.Goftino?.setWidget({
      marginLeft: 24,
      marginBottom: 24,
    });
    const el = document.getElementById("goftino_w");
    if (el) {
      el.style.setProperty("left", "24px", "important");
      el.style.setProperty("right", "auto", "important");
    }
  });
}

/**
 * Chat widget is third-party JS that blocks the main thread.
 * Load it after idle / first interaction so it stays off the LCP/TBT path.
 */
export function DeferredGoftino() {
  useEffect(() => {
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      injectGoftino();
    };

    const onInteract = () => load();
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    window.addEventListener("keydown", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });

    let idleId = 0;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(load, { timeout: LOAD_AFTER_MS });
    }
    const fallback = window.setTimeout(load, LOAD_AFTER_MS);

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract);
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
