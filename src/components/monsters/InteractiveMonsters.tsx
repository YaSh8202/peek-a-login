import { useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import { Violetto } from "./monsters/Violetto";
import { Inky } from "./monsters/Inky";
import { Gloop } from "./monsters/Gloop";
import { Nugget } from "./monsters/Nugget";

/**
 * Interactive Monsters Component
 * Renders 4 animated SVG monsters that follow the cursor with their eyes
 * Z-index layering order: Violetto (back) → Inky → Gloop → Nugget (front)
 */
export function InteractiveMonsters() {
  const containerRef = useRef<SVGSVGElement>(null);
  const cursorX = useMotionValue(200);
  const cursorY = useMotionValue(200);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Convert client coordinates to SVG viewBox coordinates
      const svgX = ((e.clientX - rect.left) / rect.width) * 400;
      const svgY = ((e.clientY - rect.top) / rect.height) * 400;

      cursorX.set(svgX);
      cursorY.set(svgY);
    };

    // Add global mouse move listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 400 400"
      className="w-full h-full"
      aria-label="Interactive monster characters"
    >
      {/* Render order determines z-index (later = on top) */}
      <Violetto cursorX={cursorX} cursorY={cursorY} />
      <Inky cursorX={cursorX} cursorY={cursorY} />
      <Gloop cursorX={cursorX} cursorY={cursorY} />
      <Nugget cursorX={cursorX} cursorY={cursorY} />
    </svg>
  );
}
