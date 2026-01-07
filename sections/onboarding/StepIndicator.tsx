import { Text, View } from "react-native";
import React from "react";

const Step = ({
  active,
  completed,
}: {
  active: boolean;
  completed: boolean;
}) => (
  <View
    className={`h-2 w-6 mx-0.5 rounded-md ${completed ? "bg-azure-radiance-500" : active ? "bg-gray-500" : "bg-gray-300"}`}
  />
);

type StepIndicatorProps = {
  total: number;
  current: number;
};

export default function StepIndicator({
  total = 5,
  current = 1,
}: StepIndicatorProps) {
  return (
    <View className="  mt-4">
      <View className="flex-row justify-center items-center  mt-4  ">
        {Array.from({ length: total }).map((_, index) => (
          <Step
            key={index}
            completed={index < current - 1}
            active={index <= current - 1}
          />
        ))}
      </View>

      <View className=" flex-row justify-center mt-9  ">
        <Text className=" text-sm font-medium font-medium text-gray-400   ">
          STEP {current}/{total}
        </Text>
      </View>
    </View>
  );
}
