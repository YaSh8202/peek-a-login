import {
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect } from "react";
import { useFaceTracking } from "../hooks/useEyeTracking";

interface GloopProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  isFormFocused?: boolean;
}

/**
 * Gloop - The Big Orange Blob
 * Front left position, large semi-circle/dome shape
 * Simple black dot eyes (no sclera or pupil tracking)
 */
export function Gloop({ cursorX, cursorY, isFormFocused = false }: GloopProps) {
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
  const mouthHalfWidth = 11; // Distance from center to smile endpoints
  const mouthCurveDepth = 19; // How deep the smile curves down

  // Face tracking - entire face moves together
  const face = useFaceTracking(faceCenterX, faceCenterY, cursorX, cursorY, {
    maxFaceShift: 15,
    maxPupilDistance: 0, // No pupils for Gloop
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
    leanSkewValue.set(isFormFocused ? -3 : 0);
  }, [isFormFocused, leanSkewValue]);

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.g
        style={{
          skewX: leanSkew,
          transformOrigin: "bottom center",
        }}
      >
        <g>
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
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 0.5,
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
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 0.5,
            }}
          />

          {/* Mouth - changes based on focus state */}
          {isFormFocused ? (
            /* Focused: Stunned dot mouth (same size as eyes) */
            <motion.circle
              r={6}
              fill="black"
              style={{
                x: face.faceOffsetX,
                y: face.faceOffsetY,
                translateX: faceCenterX,
                translateY: faceCenterY + mouthOffsetY + 8,
              }}
            />
          ) : (
            /* Default: Filled smile curve */
            <motion.path
              d={`M ${faceCenterX - mouthHalfWidth} ${
                faceCenterY + mouthOffsetY
              } Q ${faceCenterX} ${faceCenterY + mouthOffsetY + mouthCurveDepth}, ${
                faceCenterX + mouthHalfWidth
              } ${faceCenterY + mouthOffsetY} Z`}
              fill="black"
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
