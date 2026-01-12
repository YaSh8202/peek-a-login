import { motion, useTransform, type MotionValue } from "framer-motion";
import { useFaceTracking } from "../hooks/useEyeTracking";

interface ViolettoProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}

/**
 * Violetto - The Tall Purple One
 * Back left position, tall rectangle shape with wide-set eyes
 */
export function Violetto({ cursorX, cursorY }: ViolettoProps) {
  // Body dimensions
  const bodyX = 135;
  const bodyY = 20;
  const bodyWidth = 165;
  const bodyHeight = 340;
  
  // Head region (top portion of body)
  const headHeight = 80;
  const headCenterX = bodyX + bodyWidth / 2; // 217.5
  const headCenterY = bodyY + headHeight / 2; // 60 (center of head area)

  // Face center starts at head center
  const faceCenterX = headCenterX;
  const faceCenterY = headCenterY;

  // Eye positions relative to face center
  const leftEyeOffsetX = -25;
  const rightEyeOffsetX = 25;
  const eyeOffsetY = -8;
  
  // Mouth position relative to face center
  const mouthOffsetY = 20;

  // Face tracking - entire face moves together, pupils move independently
  const face = useFaceTracking(faceCenterX, faceCenterY, cursorX, cursorY, {
    maxFaceShift: 20,
    maxPupilDistance: 4,
  });

  // Combine face offset with pupil offset for total pupil position
  const leftPupilTotalX = useTransform(
    [face.faceOffsetX, face.pupilOffsetX],
    ([fx, px]) => (fx as number) + (px as number)
  );
  const leftPupilTotalY = useTransform(
    [face.faceOffsetY, face.pupilOffsetY],
    ([fy, py]) => (fy as number) + (py as number)
  );
  const rightPupilTotalX = useTransform(
    [face.faceOffsetX, face.pupilOffsetX],
    ([fx, px]) => (fx as number) + (px as number)
  );
  const rightPupilTotalY = useTransform(
    [face.faceOffsetY, face.pupilOffsetY],
    ([fy, py]) => (fy as number) + (py as number)
  );

  return (
    <motion.g
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Body: Tall rectangle */}
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        fill="#7e27ff"
        rx={2}
      />

      {/* Left Eye Sclera - moves with face */}
      <motion.circle
        r={8}
        fill="white"
        style={{
          x: face.faceOffsetX,
          y: face.faceOffsetY,
          translateX: faceCenterX + leftEyeOffsetX,
          translateY: faceCenterY + eyeOffsetY,
        }}
      />

      {/* Left Eye Pupil - moves with face + additional pupil movement */}
      <motion.circle
        r={4}
        fill="black"
        style={{
          x: leftPupilTotalX,
          y: leftPupilTotalY,
          translateX: faceCenterX + leftEyeOffsetX,
          translateY: faceCenterY + eyeOffsetY,
        }}
      />

      {/* Right Eye Sclera - moves with face */}
      <motion.circle
        r={8}
        fill="white"
        style={{
          x: face.faceOffsetX,
          y: face.faceOffsetY,
          translateX: faceCenterX + rightEyeOffsetX,
          translateY: faceCenterY + eyeOffsetY,
        }}
      />

      {/* Right Eye Pupil - moves with face + additional pupil movement */}
      <motion.circle
        r={4}
        fill="black"
        style={{
          x: rightPupilTotalX,
          y: rightPupilTotalY,
          translateX: faceCenterX + rightEyeOffsetX,
          translateY: faceCenterY + eyeOffsetY,
        }}
      />

      {/* Mouth: Small horizontal smile - moves with face */}
      <motion.path
        d={`M ${faceCenterX - 8} ${faceCenterY + mouthOffsetY} Q ${faceCenterX} ${faceCenterY + mouthOffsetY + 4} ${faceCenterX + 8} ${faceCenterY + mouthOffsetY}`}
        stroke="black"
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        style={{
          x: face.faceOffsetX,
          y: face.faceOffsetY,
        }}
      />
    </motion.g>
  );
}
