import { motion, type MotionValue } from "framer-motion";
import { useEyeTracking } from "../hooks/useEyeTracking";

interface InkyProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}

/**
 * Inky - The Dark Shadow
 * Back right position, rectangular pillar with googly eyes that touch
 */
export function Inky({ cursorX, cursorY }: InkyProps) {
  // Eye positions: Two touching circles (googly style) at top center
  const leftEye = useEyeTracking(275, 145, cursorX, cursorY, 6);
  const rightEye = useEyeTracking(305, 145, cursorX, cursorY, 6);

  return (
    <motion.g
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Body: Rectangular pillar */}
      <rect
        x={250}
        y={120}
        width={100}
        height={240}
        fill="#1d2025"
        rx={2}
      />

      {/* Left Eye Sclera - positioned so they touch at x=290 */}
      <circle cx={275} cy={145} r={10} fill="white" />

      {/* Left Eye Pupil */}
      <motion.circle
        r={5}
        fill="black"
        style={{
          x: leftEye.pupilX,
          y: leftEye.pupilY,
          translateX: 275,
          translateY: 145,
        }}
      />

      {/* Right Eye Sclera - touching the left eye */}
      <circle cx={305} cy={145} r={10} fill="white" />

      {/* Right Eye Pupil */}
      <motion.circle
        r={6}
        fill="black"
        style={{
          x: rightEye.pupilX,
          y: rightEye.pupilY,
          translateX: 305,
          translateY: 145,
        }}
      />

      {/* No mouth - the silent type */}
    </motion.g>
  );
}
