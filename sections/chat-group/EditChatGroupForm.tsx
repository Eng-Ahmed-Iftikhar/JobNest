import { useEditChatGroupMutation } from "@/api/services/chatApi";
import { useUploadFileMutation } from "@/api/services/fileApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import useChat from "@/hooks/useChat";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/store/reducers/notificationSlice";
import { getMimeTypeImage } from "@/utils/files";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik, FormikValues } from "formik";
import React, { useEffect } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Group name is required")
    .min(3, "Group name must be at least 3 characters"),
  description: Yup.string()
    .optional()
    .min(10, "Description must be at least 10 characters"),
  iconUrl: Yup.string().url("Invalid URL format").nullable(),
});
type ChatGroupForm = {
  iconUrl: string | null;
  name: string;
  description: string | null;
};

export default function EditChatGroupForm() {
  const param = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] =
    React.useState<ImagePicker.ImageInfo | null>(null);
  const id = typeof param.id === "string" ? param.id : "";
  const { chatGroup = null } = useChat(id);
  const [editGroup] = useEditChatGroupMutation();
  const [updateFile] = useUploadFileMutation();
  const [initialValues, setInitialValues] = React.useState<ChatGroupForm>({
    iconUrl: null,
    name: "",
    description: "",
  });

  const handleSubmit = async (values: FormikValues) => {
    try {
      let url = "";
      if (selectedImage) {
        const formData = new FormData();
        const fileObj = {
          uri: selectedImage.uri,
          type: getMimeTypeImage(selectedImage.fileName || "") || "image/jpeg",
          name:
            selectedImage.fileName ||
            `photo.${getMimeTypeImage(selectedImage.fileName || "")?.split("/")[1]}`,
        };

        formData.append("file", fileObj as any);
        formData.append("fileType", "image");
        formData.append("folderPath", "profile-images");
        formData.append("customFilename", `profile-${Date.now()}`);

        const uploadResult = await updateFile(formData).unwrap();
        url = uploadResult.url;
      }
      await editGroup({
        chatId: id,
        body: {
          name: values.name,
          description: values.description,
          ...(url
            ? {
                iconUrl: url,
              }
            : {}),
        },
      }).unwrap();
      dispatch(showSuccessNotification("Group updated successfully"));
      router.back();
    } catch (error) {
      dispatch(showErrorNotification("Failed to update group"));
    }
  };

  const handleChangeImage = async () => {
    const pickFromGallery = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        dispatch(
          showErrorNotification("Permission to access gallery is required")
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets || result.assets.length === 0) {
        dispatch(showErrorNotification("Image selection was canceled"));
        return;
      }
      const image = result.assets[0];
      if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
        dispatch(showErrorNotification("Image size should be less than 2MB"));
        return;
      }
      setSelectedImage(image);
    };

    const takePhoto = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        dispatch(
          showErrorNotification("Permission to access camera is required")
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets || result.assets.length === 0) {
        dispatch(showErrorNotification("Image selection was canceled"));
        return;
      }
      const image = result.assets[0];
      if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
        dispatch(showErrorNotification("Image size should be less than 2MB"));
        return;
      }
      setSelectedImage(image);
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Gallery"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto();
          } else if (buttonIndex === 2) {
            pickFromGallery();
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
            onPress: takePhoto,
          },
          {
            text: "Choose from Gallery",
            onPress: pickFromGallery,
          },
        ],
        { cancelable: true }
      );
    }
  };

  useEffect(() => {
    if (chatGroup) {
      setInitialValues({
        iconUrl: chatGroup.iconUrl || null,
        name: chatGroup.name || "",
        description: chatGroup.description || "",
      });
    }
  }, [chatGroup]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 16 }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8, marginRight: 12 }}
            >
              <Ionicons name="chevron-back" size={24} color="#222" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#222" }}>
              Edit Group
            </Text>
          </View>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View style={{ flex: 1, padding: 24 }}>
                <Pressable
                  onPress={() => handleChangeImage()}
                  className="relative mx-auto mb-8"
                >
                  <View className="w-24 h-24 rounded-full bg-azure-radiance-500 items-center relative justify-center">
                    {values.iconUrl || selectedImage ? (
                      <Image
                        source={{ uri: values.iconUrl || selectedImage?.uri }}
                        className="w-24 h-24 rounded-full"
                      />
                    ) : (
                      <Ionicons name="person" size={40} color="white" />
                    )}
                  </View>
                  <View className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-white border-2 border-gray-200 items-center justify-center">
                    <Ionicons name="pencil" size={12} color="#6B7280" />
                  </View>
                </Pressable>
                <View className="flex-1" style={{ marginBottom: 20 }}>
                  <Input
                    label="Group Name"
                    placeholder="Enter group name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    isError={touched.name && !!errors.name}
                    error={errors.name}
                  />
                </View>
                <View className="flex-1" style={{ marginBottom: 32 }}>
                  <TextArea
                    label="Group Description"
                    placeholder="Enter group description"
                    value={values.description || ""}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    numberOfLines={4}
                    error={errors.description}
                    isError={touched.description && !!errors.description}
                  />
                </View>
                <View className="flex-1" style={{ marginBottom: 32 }}>
                  <Button
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    variant="primary"
                    onPress={() => handleSubmit()}
                  >
                    Save Changes
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
