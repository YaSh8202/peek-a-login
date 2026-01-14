import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "motion/react";
import { useEffect } from "react";
import { useFaceTracking } from "../hooks/useEyeTracking";

interface ViolettoProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  isFormFocused?: boolean;
}

/**
 * Violetto - The Tall Purple One
 * Back left position, tall rectangle shape with wide-set eyes
 */
export function Violetto({
  cursorX,
  cursorY,
  isFormFocused = false,
}: ViolettoProps) {
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

  // Lean animation when form is focused - use skewX to keep base flat
  const leanSkewValue = useMotionValue(0);
  const leanSkew = useSpring(leanSkewValue, {
    stiffness: 1000,
    damping: 50,
    mass: 0.1,
  });

  useEffect(() => {
    // Negative skewX leans the top to the right while keeping bottom flat
    leanSkewValue.set(isFormFocused ? -8 : 0);
  }, [isFormFocused, leanSkewValue]);

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
      <motion.g
        style={{
          skewX: leanSkew,
          transformOrigin: "bottom center",
        }}
      >
        <g>
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
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 0,
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
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 0,
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
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 0,
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
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 0,
            }}
          />

          {/* Mouth - changes based on focus state */}
          {isFormFocused ? (
            /* Focused: Attentive vertical line mouth */
            <motion.rect
              x={faceCenterX - 1.5}
              y={faceCenterY + mouthOffsetY - 22}
              width={4}
              height={28}
              rx={1.5}
              fill="black"
              style={{
                x: face.faceOffsetX,
                y: face.faceOffsetY,
              }}
            />
          ) : (
            /* Default: Small horizontal smile */
            <motion.path
              d={`M ${faceCenterX - 8} ${
                faceCenterY + mouthOffsetY
              } Q ${faceCenterX} ${faceCenterY + mouthOffsetY + 4} ${
                faceCenterX + 8
              } ${faceCenterY + mouthOffsetY}`}
              stroke="black"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              style={{
                x: face.faceOffsetX,
                y: face.faceOffsetY,
              }}
            />
          )}
        </g>
      </motion.g>
    </motion.g>
  );
}
