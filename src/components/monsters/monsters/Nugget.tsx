import { motion, type MotionValue } from "framer-motion";

interface NuggetProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}

/**
 * Nugget - The Yellow One
 * Front right position, thumb/gumdrop shaped with a right tilt
 * Single eye (profile view) with horizontal mouth line
 */
export function Nugget(_props: NuggetProps) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      transform="rotate(10, 370, 300)"
    >
      {/* Body: Rounded top, flat bottom (gumdrop/thumb shape) */}
      <path
        d="M 320 360 L 320 230 A 50 50 0 0 1 420 230 L 420 360 Z"
        fill="#f3d300"
      />

      {/* Eye: Single black dot (profile view) on left side of face */}
      <circle cx={350} cy={230} r={4} fill="black" />

      {/* Mouth: Horizontal line on right side, 15px below eye */}
      <line
        x1={360}
        y1={250}
        x2={430}
        y2={250}
        stroke="black"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </motion.g>
  );
}
