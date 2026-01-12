import { motion, useTransform, type MotionValue } from "framer-motion";
import { useFaceTracking } from "../hooks/useEyeTracking";

interface InkyProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}

/**
 * Inky - The Dark Shadow
 * Back right position, rectangular pillar with googly eyes that touch
 */
export function Inky({ cursorX, cursorY }: InkyProps) {
  // Body dimensions
  const bodyX = 250;
  const bodyY = 120;
  const bodyWidth = 100;
  const bodyHeight = 240;

  // Head region (top portion of body)
  const headHeight = 60;
  const headCenterX = bodyX + bodyWidth / 2; // 300
  const headCenterY = bodyY + headHeight / 2; // 150 (center of head area)

  // Face center starts at head center
  const faceCenterX = headCenterX;
  const faceCenterY = headCenterY;

  // Eye positions relative to face center (googly style, close together)
  const leftEyeOffsetX = -15;
  const rightEyeOffsetX = 15;
  const eyeOffsetY = -5;

  // Face tracking - entire face moves together, pupils move independently
  const face = useFaceTracking(faceCenterX, faceCenterY, cursorX, cursorY, {
    maxFaceShift: 15,
    maxPupilDistance: 5,
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Body: Rectangular pillar */}
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        fill="#1d2025"
        rx={2}
      />

      {/* Left Eye Sclera - moves with face */}
      <motion.circle
        r={10}
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
        r={5}
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
        r={10}
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
        r={6}
        fill="black"
        style={{
          x: rightPupilTotalX,
          y: rightPupilTotalY,
          translateX: faceCenterX + rightEyeOffsetX,
          translateY: faceCenterY + eyeOffsetY,
        }}
      />

      {/* No mouth - the silent type */}
    </motion.g>
  );
}
