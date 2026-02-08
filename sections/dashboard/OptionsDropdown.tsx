import {
  useSaveJobMutation,
  useUnsaveJobMutation,
} from "@/api/services/jobsApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";

import { showErrorAlert, showSuccessAlert } from "@/store/reducers/alertSlice";
import React, { useCallback } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type OptionsDropdownProps = {
  onShare: () => void;
  onSave: () => void;
  jobId: string;
  isSaved: boolean;
};

export default function OptionsDropdown({
  onSave,
  onShare,
  jobId,
  isSaved,
}: OptionsDropdownProps) {
  const [saveJob] = useSaveJobMutation();
  const [unSaveJob] = useUnsaveJobMutation();
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const handleSave = useCallback(async () => {
    try {
      if (isSaved) {
        await unSaveJob({ jobId }).unwrap();
        dispatch(showSuccessAlert("Job removed from saved jobs!"));
      } else {
        await saveJob({ jobId }).unwrap();
        dispatch(showSuccessAlert("Job saved successfully!"));
      }

      onSave();
    } catch (e: any) {
      const msg = Array.isArray(e?.data?.message)
        ? e.data.message[0]
        : e?.data?.message || "Failed to save job";
      dispatch(showErrorAlert(msg));
    }
  }, [isSaved, unSaveJob, jobId, saveJob, dispatch, onSave]);

  return (
    <View
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", zIndex: 999 }}
      className="absolute top-4 -left-44 bg-white dark:bg-black rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700  z-50 w-44"
    >
      <TouchableOpacity
        onPress={handleSave}
        className="flex-row items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700"
      >
        {isSaved ? (
          <Icon
            name={"bookmark"}
            size={22}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        ) : (
          <Icon
            name={"bookmark-outline"}
            size={22}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        )}

        <Text
          className={`ml-4 text-base font-medium  text-gray-800 dark:text-gray-200`}
        >
          {isSaved ? "Unsave" : "Save"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onShare}
        className="flex-row items-center px-6 py-4"
      >
        <Icon
          name="share-social-outline"
          size={22}
          color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        />
        <Text className="ml-4 text-base text-gray-800 dark:text-gray-200 font-medium">
          Share
        </Text>
      </TouchableOpacity>
    </View>
  );
}
