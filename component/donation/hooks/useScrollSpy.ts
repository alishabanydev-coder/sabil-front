"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

type UseScrollSpyOptions = {
  /** Distance from top of viewport (sticky header + tabs). */
  offset?: number;
};

/**
 * Highlights whichever section header has crossed the offset line while
 * scrolling the page. Uses scroll + getBoundingClientRect — reliable for
 * long doc-style layouts with variable section heights.
 */
export function useScrollSpy(
  sectionIds: string[],
  sectionRefs: RefObject<Record<string, HTMLElement | null>>,
  { offset = 150 }: UseScrollSpyOptions = {}
) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (sectionIds.length === 0) {
      return;
    }

    setActiveId((current) => current || sectionIds[0]);

    const updateActiveSection = () => {
      let currentId = sectionIds[0];

      for (const id of sectionIds) {
        const element = sectionRefs.current[id];
        if (!element) {
          continue;
        }

        const { top } = element.getBoundingClientRect();
        if (top - offset <= 0) {
          currentId = id;
        }
      }

      const atPageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (atPageBottom) {
        currentId = sectionIds[sectionIds.length - 1];
      }

      setActiveId((prev) => (prev === currentId ? prev : currentId));
    };

    const onScroll = () => {
      window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIds, sectionRefs, offset]);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setActiveId(sectionId);
      sectionRefs.current[sectionId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [sectionRefs]
  );

  return { activeId, scrollToSection };
}
