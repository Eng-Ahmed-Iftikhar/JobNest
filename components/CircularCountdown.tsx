import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const CIRCLE_LENGTH = 300; // Circumference = 2πr

type CircularCountdownProps = {
  onComplete?: () => void;
  seconds?: number;
  size?: number; // Optional size prop to customize the size of the circle
};

const CircularCountdown = ({
  onComplete,
  seconds = 20, // Default to 20 seconds
  size = 150, // Default size of the circle
}: CircularCountdownProps) => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    if (secondsLeft === 0) return onComplete?.();

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const STROKE_WIDTH = size * 0.07; // relative stroke width (7%)
  const RADIUS = (size - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progress = secondsLeft / seconds;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const displayTime =
    secondsLeft >= 60
      ? `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
      : `${secondsLeft}s`;

  return (
    <View className={"items-center justify-center"}>
      <Svg height={size} width={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          stroke="#E5E7EB" // Gray-300
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          stroke="#1eadff" // Blue-500
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text
        style={{ fontSize: size * 0.25 }} // relative font size (25% of size)
        className={" font-semibold text-azure-radiance-500 absolute"}
      >
        {displayTime}
      </Text>
    </View>
  );
};

export default CircularCountdown;
