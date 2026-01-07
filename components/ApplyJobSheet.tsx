import BottomSheet from "@/components/ui/BottomSheet";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface ApplyJobSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (coverLetter: string) => void;
  jobTitle?: string;
}

export default function ApplyJobSheet({
  visible,
  onClose,
  onApply,
  jobTitle,
}: ApplyJobSheetProps) {
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = () => {
    onApply(coverLetter);
    setCoverLetter("");
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Apply for the job"
      showHandle={true}
      footer={
        <TouchableOpacity
          className="bg-azure-radiance-500 h-14 rounded-xl items-center justify-center"
          onPress={handleApply}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">Apply now</Text>
        </TouchableOpacity>
      }
    >
      <View className="bg-gray-50 rounded-xl p-4 min-h-[150px]">
        <TextInput
          value={coverLetter}
          onChangeText={setCoverLetter}
          placeholder="Add cover letter (optional)"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          className="text-base text-gray-900 h-full"
        />
      </View>
    </BottomSheet>
  );
}
