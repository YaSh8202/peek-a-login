import { motion, type MotionValue } from "framer-motion";
import { useFaceTracking } from "../hooks/useEyeTracking";

interface GloopProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}

/**
 * Gloop - The Big Orange Blob
 * Front left position, large semi-circle/dome shape
 * Simple black dot eyes (no sclera or pupil tracking)
 */
export function Gloop({ cursorX, cursorY }: GloopProps) {
  // Body dimensions (dome shape)
  const bodyLeft = 60;
  const bodyRight = 260;
  const bodyTop = 230;
  const bodyBottom = 360;
  const bodyWidth = bodyRight - bodyLeft; // 200

  // Head region (upper portion of dome)
  const headHeight = 80;
  const headCenterX = bodyLeft + bodyWidth / 2; // 160
  const headCenterY = bodyTop + headHeight / 2; // 270

  // Face center starts at head center
  const faceCenterX = headCenterX;
  const faceCenterY = headCenterY;

  // Eye positions relative to face center
  const leftEyeOffsetX = -25;
  const rightEyeOffsetX = 25;
  const eyeOffsetY = 0;

  // Mouth position relative to face center
  const mouthOffsetY = 20;

  // Face tracking - entire face moves together
  const face = useFaceTracking(faceCenterX, faceCenterY, cursorX, cursorY, {
    maxFaceShift: 15,
    maxPupilDistance: 0, // No pupils for Gloop
  });

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

      {/* Left Eye: Simple black dot - moves with face */}
      <motion.circle
        r={6}
        fill="black"
        style={{
          x: face.faceOffsetX,
          y: face.faceOffsetY,
          translateX: faceCenterX + leftEyeOffsetX,
          translateY: faceCenterY + eyeOffsetY,
        }}
      />

      {/* Right Eye: Simple black dot - moves with face */}
      <motion.circle
        r={6}
        fill="black"
        style={{
          x: face.faceOffsetX,
          y: face.faceOffsetY,
          translateX: faceCenterX + rightEyeOffsetX,
          translateY: faceCenterY + eyeOffsetY,
        }}
      />

      {/* Mouth: Filled smile curve - moves with face */}
      <motion.path
        d={`M ${faceCenterX - 12} ${faceCenterY + mouthOffsetY} Q ${faceCenterX} ${faceCenterY + mouthOffsetY + 15}, ${faceCenterX + 12} ${faceCenterY + mouthOffsetY} Z`}
        fill="black"
        style={{
          x: face.faceOffsetX,
          y: face.faceOffsetY,
        }}
      />
    </motion.g>
  );
}
