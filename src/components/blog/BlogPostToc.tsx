"use client";

import { useEffect, useMemo, useState } from "react";
import {
  extractContentToc,
  flattenToc,
  type TocNode,
} from "@/lib/wordpress/headings";

function TocList({
  nodes,
  activeId,
  depth = 0,
}: {
  nodes: TocNode[];
  activeId: string | null;
  depth?: number;
}) {
  return (
    <ul className={depth > 0 ? "mt-0.5 mr-2 space-y-0.5 border-r border-slate-100 pr-2" : "space-y-0.5"}>
      {nodes.map((node) => {
        const active = activeId === node.id;
        return (
          <li key={node.id}>
            <a
              href={`#${node.id}`}
              className={`block rounded-lg px-3 py-1.5 leading-snug transition ${
                depth === 0 ? "text-sm" : "text-[13px]"
              } ${
                active
                  ? "bg-navy-900 font-semibold text-gold-400"
                  : "text-slate-700 hover:bg-cream hover:text-navy-900"
              }`}
            >
              {node.text}
            </a>
            {node.children.length > 0 && (
              <TocList
                nodes={node.children}
                activeId={activeId}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function BlogPostToc({ html }: { html: string }) {
  const items = useMemo(() => extractContentToc(html), [html]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = flattenToc(items).map((node) => node.id);
    if (!ids.length) return;

    const updateActive = () => {
      const offset = 120;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = id;
      }
      setActiveId(current ?? null);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [items]);

  if (!items.length) return null;

  return (
    <nav
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
      aria-label="فهرست مطالب"
    >
      <div className="border-b border-slate-100 bg-cream/60 px-5 py-4">
        <h3 className="font-bold text-navy-900">فهرست مطالب</h3>
        <p className="mt-1 text-xs text-slate-500">
          بخش‌های این مقاله
        </p>
      </div>
      <div className="max-h-[min(24rem,55vh)] overflow-y-auto p-2">
        <TocList nodes={items} activeId={activeId} />
      </div>
    </nav>
  );
}
