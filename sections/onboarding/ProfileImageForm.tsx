import { useUploadFileMutation } from "@/api/services/fileApi";
import { useUpdateProfilePictureMutation } from "@/api/services/userApi";
import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import * as yup from "yup";

const formSchema = yup.object({
  pictureUrl: yup.string().nullable(),
});

type FormValues = yup.InferType<typeof formSchema>;

function ProfileImageForm() {
  const { handleUserProfile, handleChangeCurrentStep, userProfile } =
    useOnboarding();
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();
  const [updateProfilePicture, { isLoading: isUpdatingProfile }] =
    useUpdateProfilePictureMutation();
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
    size: number;
  } | null>(null);

  const handleImagePick = useCallback(
    async (setFieldValue: (field: string, value: any) => void) => {
      try {
        // Request permissions
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Please grant camera roll permissions to select an image."
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          const image = result.assets[0];

          // Check file size (2MB limit)
          if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
            Alert.alert(
              "Image too large",
              "Please select an image smaller than 2MB"
            );
            return;
          }

          setSelectedImage({
            uri: image.uri,
            name: image.fileName || "profile-image.jpg",
            size: image.fileSize || 0,
          });

          // Set the Formik value to the image URI
          setFieldValue("pictureUrl", image.uri);
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick image");
      }
    },
    []
  );

  const handleCameraCapture = useCallback(
    async (setFieldValue: (field: string, value: any) => void) => {
      try {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Please grant camera permissions to take a photo."
          );
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          const image = result.assets[0];

          // Check file size (2MB limit)
          if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
            Alert.alert(
              "Image too large",
              "Please select an image smaller than 2MB"
            );
            return;
          }

          setSelectedImage({
            uri: image.uri,
            name: image.fileName || `camera-${Date.now()}.jpg`,
            size: image.fileSize || 0,
          });

          // Set the Formik value to the image URI
          setFieldValue("pictureUrl", image.uri);
        }
      } catch (error) {
        console.error("Error capturing image:", error);
        Alert.alert("Error", "Failed to capture image");
      }
    },
    []
  );

  const handleImageSourceChoice = useCallback(
    (setFieldValue: (field: string, value: any) => void) => {
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancel", "Take Photo", "Choose from Gallery"],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              handleCameraCapture(setFieldValue);
            } else if (buttonIndex === 2) {
              handleImagePick(setFieldValue);
            }
          }
        );
      } else {
        Alert.alert(
          "Select Image Source",
          "Choose an option",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Take Photo",
              onPress: () => handleCameraCapture(setFieldValue),
            },
            {
              text: "Choose from Gallery",
              onPress: () => handleImagePick(setFieldValue),
            },
          ],
          { cancelable: true }
        );
      }
    },
    [handleCameraCapture, handleImagePick]
  );

  const handleSubmit = async (values: FormValues) => {
    // If pictureUrl exists but no new image selected, skip upload and move to next step
    if (values.pictureUrl && !selectedImage) {
      handleUserProfile({ pictureUrl: values.pictureUrl });
      handleChangeCurrentStep(OnboardingSteps.RESUME_URL);

      return;
    }

    if (!values.pictureUrl) {
      Alert.alert("No image selected", "Please select a profile image first");
      return;
    }

    if (!selectedImage) {
      Alert.alert("No image selected", "Please select a profile image first");
      return;
    }

    try {
      // Determine MIME type based on file extension
      const getMimeType = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase();
        switch (extension) {
          case "jpg":
          case "jpeg":
            return "image/jpeg";
          case "png":
            return "image/png";
          case "gif":
            return "image/gif";
          default:
            return "image/jpeg";
        }
      };

      // Create FormData for file upload
      const formData = new FormData();

      // For React Native, FormData expects specific structure
      const fileObj = {
        uri: selectedImage.uri,
        type: getMimeType(selectedImage.name),
        name: selectedImage.name,
      };

      console.log("File object to upload:", fileObj);

      // Append file - React Native expects this structure
      formData.append("file", fileObj as any);
      formData.append("fileType", "image");
      formData.append("folderPath", "profile-images");
      formData.append("customFilename", `profile-${Date.now()}`);

      console.log("FormData prepared, uploading...");

      // First upload the image to get the URL
      const fileUploadResponse = await uploadFile(formData).unwrap();

      console.log("Upload successful:", fileUploadResponse);

      // Then update the profile with the uploaded image URL
      await updateProfilePicture({
        pictureUrl: fileUploadResponse.url,
      }).unwrap();

      // Save to context with the uploaded image URL
      handleUserProfile({ pictureUrl: fileUploadResponse.url });
      handleChangeCurrentStep(OnboardingSteps.RESUME_URL);
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      // Extract error message
      let errorMessage = "Failed to upload image. Please try again.";

      if (error?.data?.message) {
        if (Array.isArray(error.data.message)) {
          errorMessage = error.data.message[0];
        } else {
          errorMessage = error.data.message;
        }
      } else if (error?.error) {
        errorMessage = error.error;
      }

      Alert.alert("Upload Error", errorMessage);
    }
  };

  const handleSkip = () => {
    // Skip this step and move to next
    handleChangeCurrentStep(OnboardingSteps.RESUME_URL);
  };

  return (
    <Formik
      initialValues={{
        pictureUrl: userProfile?.pictureUrl || null,
      }}
      onSubmit={handleSubmit}
      validationSchema={formSchema}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
        <ScrollView className="flex-1 bg-white px-4">
          <View className="flex-1 mt-12">
            <View className="items-center justify-center flex-1">
              {/* Image Upload Area */}
              <TouchableOpacity
                onPress={() => handleImageSourceChoice(setFieldValue)}
                className="w-32 h-32 rounded-full bg-azure-radiance-500 items-center justify-center mb-4"
              >
                {values.pictureUrl ? (
                  <Image
                    source={{ uri: values.pictureUrl }}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Icon name="user" size={48} color="white" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleImageSourceChoice(setFieldValue)}
              >
                <Text className="text-azure-radiance-500 text-lg font-semibold mb-6">
                  Upload image
                </Text>
              </TouchableOpacity>

              {/* Image Requirements */}
              <View className="mb-8">
                <Text className="text-gray-600 text-center text-sm font-medium mb-1">
                  Recommended resolution is 300×300 px.
                </Text>
                <Text className="text-gray-600 text-center text-sm font-medium mb-1">
                  Max size - 2 MB.
                </Text>
                <Text className="text-gray-600 text-center text-sm font-medium">
                  Allowed formats: *.jpg, *.jpeg, *.png, *.gif
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="w-full space-y-4">
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  disabled={
                    !values.pictureUrl ||
                    isSubmitting ||
                    isUploadingFile ||
                    isUpdatingProfile
                  }
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-center ${
                    values.pictureUrl ? "bg-azure-radiance-500" : "bg-gray-300"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold text-lg ${
                      values.pictureUrl ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {isUploadingFile || isUpdatingProfile
                      ? "Processing..."
                      : "Next"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSkip}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-center"
                >
                  <Text className="text-gray-500 text-center font-semibold text-lg">
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
}

export default ProfileImageForm;
