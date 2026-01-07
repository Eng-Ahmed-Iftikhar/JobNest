import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useFormikContext } from "formik";
import * as DocumentPicker from "expo-document-picker";

interface FormValues {
  cvFile: { uri: string; name: string; size?: number } | null;
  [key: string]: any;
}

export const CVSection: React.FC = () => {
  const formik = useFormikContext<FormValues>();
  const [cvName, setCVName] = useState(formik.values.cvFile?.name || "");
  const [isUploading, setIsUploading] = useState(false);

  const handlePickDocument = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        formik.setFieldValue("cvFile", {
          uri: file.uri,
          name: file.name,
          size: file.size,
        });
        setCVName(file.name);
      }
    } catch (error) {
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className="px-4 py-6 bg-white rounded-lg mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        CV/Resume
      </Text>

      <Pressable
        onPress={handlePickDocument}
        disabled={isUploading}
        className="border-2 border-dashed border-azure-radiance rounded-lg p-6 items-center mb-4"
      >
        <Text className="text-azure-radiance font-semibold mb-2">
          {isUploading ? "Uploading..." : "Choose File"}
        </Text>
        <Text className="text-gray-600 text-sm font-medium text-center">
          Click to select a PDF file
        </Text>
      </Pressable>

      {cvName && (
        <View className="bg-gray-50 p-3 rounded-lg flex-row items-center justify-between">
          <Text className="text-gray-700 flex-1" numberOfLines={1}>
            📄 {cvName}
          </Text>
          <Pressable
            onPress={() => {
              formik.setFieldValue("cvFile", null);
              setCVName("");
            }}
          >
            <Text className="text-red-500 font-semibold">Remove</Text>
          </Pressable>
        </View>
      )}

      {formik.touched.cvFile && formik.errors.cvFile && (
        <Text className="text-red-500 text-sm font-medium mt-2">
          {formik.errors.cvFile as string}
        </Text>
      )}
    </View>
  );
};
