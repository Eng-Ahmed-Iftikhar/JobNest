import React, { useCallback, useEffect, useState } from "react";

import {
  useApplyJobMutation,
  useSaveJobMutation,
  useUnsaveJobMutation,
} from "@/api/services/jobsApi";
import ApplyJobSheet from "@/components/ApplyJobSheet";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/store/reducers/notificationSlice";
import { SuggestedJobResponseItem } from "@/types/api/job";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

type Props = {
  job: SuggestedJobResponseItem;
};

function JobActionButton({ job }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [applySheetVisible, setApplySheetVisible] = useState(false);

  const [applyJob, { isLoading: isApplying }] = useApplyJobMutation();
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
  const [unsaveJob, { isLoading: isUnsaving }] = useUnsaveJobMutation();

  const dispatch = useAppDispatch();

  const handleApply = useCallback(() => {
    setApplySheetVisible(true);
  }, []);

  const handleShare = useCallback(() => {
    if (job) {
      console.log("Share job:", job.id);
    }
  }, [job]);

  const handleConfirmApply = useCallback(
    async (coverLetter: string) => {
      if (!job?.id || isApplying) return;
      try {
        await applyJob({ jobId: String(job.id), coverLetter }).unwrap();
        dispatch(
          showSuccessNotification("Application submitted successfully.")
        );
        setIsApplied(true);
        setInterviewScheduled(true);
        setApplySheetVisible(false);
      } catch (e) {
        dispatch(
          showErrorNotification(
            "Failed to submit job application. Please try again."
          )
        );
        console.warn("Failed to apply for job", e);
      }
    },
    [job, isApplying, applyJob, dispatch]
  );

  const handleRetractApplication = useCallback(() => {
    setInterviewScheduled(false);
  }, []);

  const handleAddToCalendar = useCallback(() => {
    console.log("Add interview to calendar");
    // Implement calendar integration
  }, []);

  const handleBookmark = useCallback(async () => {
    if (!job?.id || isSaving || isUnsaving) return;
    try {
      if (isBookmarked) {
        await unsaveJob({ jobId: String(job.id) }).unwrap();
        dispatch(showSuccessNotification("Job removed from saved jobs."));
        setIsBookmarked(false);
      } else {
        await saveJob({ jobId: String(job.id) }).unwrap();
        dispatch(showSuccessNotification("Job added to saved jobs."));
        setIsBookmarked(true);
      }
    } catch (e) {
      console.warn("Failed to toggle save job", e);
    }
  }, [job, isSaving, isUnsaving, isBookmarked, unsaveJob, dispatch, saveJob]);

  useEffect(() => {
    if (job) {
      setIsBookmarked(Boolean(job.isSaved ?? false));
      setIsApplied(Boolean(job.isApplied ?? false));
    }
  }, [job]);

  return (
    <View className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700">
      {interviewScheduled && (
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Job interview scheduled for{"\n"}
            <Text className="font-semibold">Feb 14, 4:30 PM</Text>
          </Text>
          <Pressable onPress={handleAddToCalendar}>
            <Text className="text-sm font-semibold text-azure-radiance-500">
              Add to Google Calendar
            </Text>
          </Pressable>
        </View>
      )}

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          className="bg-azure-radiance-500 h-14 rounded-xl flex-1 items-center justify-center"
          onPress={isApplied ? handleRetractApplication : handleApply}
          disabled={isApplying}
          activeOpacity={0.8}
        >
          {isApplied ? (
            <View className="flex-row items-center gap-2">
              <Ionicons name="arrow-undo" size={20} color="white" />
              <Text className="text-white font-semibold text-base">
                Retract application
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-base">
              Apply now
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="w-14 h-14 rounded-xl border border-gray-200 bg-white dark:bg-black dark:border-gray-700 items-center justify-center"
          onPress={handleBookmark}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isBookmarked ? "#1eadff" : "#6B7280"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-14 h-14 rounded-xl border border-gray-200 bg-white dark:bg-black dark:border-gray-700 items-center justify-center"
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Ionicons name="share-outline" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <ApplyJobSheet
        visible={applySheetVisible}
        onClose={() => setApplySheetVisible(false)}
        onApply={handleConfirmApply}
        jobTitle={job.name}
      />
    </View>
  );
}

export default JobActionButton;
