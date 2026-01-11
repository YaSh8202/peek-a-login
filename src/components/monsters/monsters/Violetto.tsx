import { motion, type MotionValue } from "framer-motion";
import { useEyeTracking } from "../hooks/useEyeTracking";

interface ViolettoProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}

/**
 * Violetto - The Tall Purple One
 * Back left position, tall rectangle shape with wide-set eyes
 */
export function Violetto({ cursorX, cursorY }: ViolettoProps) {
  // Eye positions: wide-set (far apart), positioned high on the face
  const leftEye = useEyeTracking(173, 60, cursorX, cursorY, 4);
  const rightEye = useEyeTracking(223, 60, cursorX, cursorY, 4);

  return (
    <motion.g
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Body: Tall rectangle */}
      <rect
        x={135}
        y={20}
        width={165}
        height={340}
        fill="#7e27ff"
        rx={2}
      />

      {/* Left Eye Sclera */}
      <circle cx={173} cy={60} r={8} fill="white" />

      {/* Left Eye Pupil */}
      <motion.circle
        r={4}
        fill="black"
        style={{
          x: leftEye.pupilX,
          y: leftEye.pupilY,
          translateX: 173,
          translateY: 60,
        }}
      />

      {/* Right Eye Sclera */}
      <circle cx={223} cy={60} r={8} fill="white" />

      {/* Right Eye Pupil */}
      <motion.circle
        r={4}
        fill="black"
        style={{
          x: rightEye.pupilX,
          y: rightEye.pupilY,
          translateX: 223,
          translateY: 60,
        }}
      />

      {/* Mouth: Small horizontal smile */}
      <path
        d="M 190 88 Q 198 92 206 88"
        stroke="black"
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
    </motion.g>
  );
}
