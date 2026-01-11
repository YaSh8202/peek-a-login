import { useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * Custom hook for tracking cursor position and calculating pupil movement
 * @param eyeX - X coordinate of the eye center in SVG viewBox
 * @param eyeY - Y coordinate of the eye center in SVG viewBox
 * @param cursorX - Motion value for cursor X position
 * @param cursorY - Motion value for cursor Y position
 * @param maxDistance - Maximum distance pupil can move from center (default: 6)
 * @returns Object with pupilX and pupilY motion values
 */
export function useEyeTracking(
  eyeX: number,
  eyeY: number,
  cursorX: MotionValue<number>,
  cursorY: MotionValue<number>,
  maxDistance: number = 6
) {
  // Calculate angle from eye to cursor using atan2
  const angle = useTransform([cursorX, cursorY], ([cx, cy]) => {
    return Math.atan2((cy as number) - eyeY, (cx as number) - eyeX);
  });

  // Calculate distance and normalize it
  const distance = useTransform([cursorX, cursorY], ([cx, cy]) => {
    const dx = (cx as number) - eyeX;
    const dy = (cy as number) - eyeY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Normalize distance and scale to maxDistance
    // Dividing by 50 provides good sensitivity
    return Math.min(dist / 50, 1) * maxDistance;
  });

  // Convert polar coordinates (angle, distance) to cartesian (x, y)
  // Apply spring animation for smooth, natural eye movement
  const pupilX = useSpring(
    useTransform([angle, distance], ([a, d]) => Math.cos(a as number) * (d as number)),
    { stiffness: 150, damping: 15 }
  );

  const pupilY = useSpring(
    useTransform([angle, distance], ([a, d]) => Math.sin(a as number) * (d as number)),
    { stiffness: 150, damping: 15 }
  );

  return { pupilX, pupilY };
}
