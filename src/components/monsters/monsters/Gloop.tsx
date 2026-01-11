import { motion, type MotionValue } from "framer-motion";

interface GloopProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}

/**
 * Gloop - The Big Orange Blob
 * Front left position, large semi-circle/dome shape
 * Simple black dot eyes (no sclera or pupil tracking)
 */
export function Gloop(_props: GloopProps) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Body: Large semi-circle dome */}
      <path
        d="M 60 360 Q 60 230, 160 230 Q 260 230, 260 360 Z"
        fill="#ff8a28"
      />

      {/* Left Eye: Simple black dot (no sclera) */}
      <circle cx={120} cy={300} r={8} fill="black" />

      {/* Right Eye: Simple black dot (no sclera) */}
      <circle cx={200} cy={300} r={8} fill="black" />

      {/* Mouth: Single black dot below eyes (triangular arrangement) */}
      <circle cx={160} cy={335} r={7} fill="black" />
    </motion.g>
  );
}
