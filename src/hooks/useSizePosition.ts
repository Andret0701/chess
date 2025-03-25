import { useState, useEffect } from "react";

export interface SizePosition {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * Returns the size and position of a given DOM element (via ref),
 * automatically updating on window resize.
 */
export function useSizePosition(
  ref: React.RefObject<HTMLElement>
): SizePosition | null {
  const [sizePosition, setSizePosition] = useState<SizePosition | null>(null);

  useEffect(() => {
    function updateSizePosition() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setSizePosition({
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
      });
    }

    // Initial call
    updateSizePosition();

    // Listen for window resizes
    window.addEventListener("resize", updateSizePosition);

    return () => {
      window.removeEventListener("resize", updateSizePosition);
    };
  }, [ref]);

  return sizePosition;
}
