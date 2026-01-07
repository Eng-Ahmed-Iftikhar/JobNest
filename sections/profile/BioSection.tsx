import React from "react";
import { View, Text, TextInput } from "react-native";
import { useFormikContext } from "formik";
import TextArea from "@/components/ui/TextArea";

interface FormValues {
  bio: string;
  [key: string]: any;
}

export const BioSection: React.FC = () => {
  const formik = useFormikContext<FormValues>();
  return (
    <View className="px-4 py-6 bg-white rounded-lg mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Bio</Text>

      <TextArea
        placeholder="Tell us about yourself..."
        value={formik.values.bio}
        onChangeText={formik.handleChange("bio")}
        onBlur={formik.handleBlur("bio")}
        error={formik.errors.bio as string}
        isError={!!formik.errors.bio && (formik.touched.bio as boolean)}
        numberOfLines={3}
      />

      <Text className="text-gray-500 text-sm font-medium mt-2">
        {formik.values.bio.length}/500 characters
      </Text>

      {formik.touched.bio && formik.errors.bio && (
        <Text className="text-red-500 text-sm font-medium mt-1">
          {formik.errors.bio as string}
        </Text>
      )}
    </View>
  );
};
