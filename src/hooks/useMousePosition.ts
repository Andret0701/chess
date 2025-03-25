import { useState, useEffect, useCallback } from "react";
import { throttle } from "lodash";

/**
 * Returns the mouse position, throttled by a given amount (default 16ms). 
 */
export function useMousePosition(throttleDelay = 16) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }, throttleDelay),
    [throttleDelay]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return mousePosition;
}
