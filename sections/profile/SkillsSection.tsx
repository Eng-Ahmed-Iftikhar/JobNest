import {
  useCreateSkillMutation,
  useGetSkillsQuery,
} from "@/api/services/skillApi";
import Input from "@/components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface FormValues {
  skillIds: string[]; // array of skill IDs
  [key: string]: any;
}

export const SkillsSection: React.FC = () => {
  const formik = useFormikContext<FormValues>();
  const [skillInput, setSkillInput] = useState("");
  const colorScheme = useColorScheme();

  const { data: availableSkills, isLoading: isLoadingSkills } =
    useGetSkillsQuery();
  const [createSkill, { isLoading: isCreatingSkill }] =
    useCreateSkillMutation();

  const handleAddSkill = useCallback(async () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    try {
      const existing = availableSkills?.find(
        (skill) => skill.name.toLowerCase() === trimmed.toLowerCase()
      );

      if (existing) {
        if (!formik.values.skillIds.includes(existing.id)) {
          formik.setFieldValue("skillIds", [
            ...formik.values.skillIds,
            existing.id,
          ]);
        }
      } else {
        const newSkill = await createSkill({ name: trimmed }).unwrap();
        formik.setFieldValue("skillIds", [
          ...formik.values.skillIds,
          newSkill.id,
        ]);
      }

      setSkillInput("");
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  }, [skillInput, availableSkills, createSkill, formik]);

  const handleSelectSkill = useCallback(
    (skillId: string) => {
      if (!formik.values.skillIds.includes(skillId)) {
        formik.setFieldValue("skillIds", [...formik.values.skillIds, skillId]);
      }
    },
    [formik]
  );

  const handleRemoveSkill = useCallback(
    (skillId: string) => {
      formik.setFieldValue(
        "skillIds",
        formik.values.skillIds.filter((id: string) => id !== skillId)
      );
    },
    [formik]
  );

  const getSkillName = useCallback(
    (skillId: string) => {
      return availableSkills?.find((skill) => skill.id === skillId)?.name;
    },
    [availableSkills]
  );

  const unselectedSkills = availableSkills?.filter(
    (skill) => !formik.values.skillIds.includes(skill.id)
  );

  const hasError = formik.touched.skillIds && formik.errors.skillIds;

  return (
    <View className="px-4 py-6 border border-gray-700 bg-white dark:bg-black rounded-lg mb-4">
      <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Skills
      </Text>

      <View className="flex-row gap-2 mb-4">
        <Input
          value={skillInput}
          onChangeText={setSkillInput}
          onSubmitEditing={handleAddSkill}
          editable={!isCreatingSkill}
          placeholder="Enter a skill"
        />
        <TouchableOpacity
          onPress={handleAddSkill}
          disabled={isCreatingSkill || skillInput.trim().length === 0}
          className={`px-4 py-2 rounded-lg justify-center ${
            isCreatingSkill || skillInput.trim().length === 0
              ? "bg-gray-400 dark:bg-gray-600"
              : "bg-azure-radiance-500"
          }`}
        >
          {isCreatingSkill ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Ionicons
              name="add"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          )}
        </TouchableOpacity>
      </View>

      {isLoadingSkills ? (
        <ActivityIndicator color="#1eadff" size="small" />
      ) : (
        unselectedSkills &&
        unselectedSkills.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Select from available skills:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {unselectedSkills.map((skill) => (
                <TouchableOpacity
                  key={skill.id}
                  onPress={() => handleSelectSkill(skill.id)}
                  className="bg-gray-200 px-3 py-2 rounded-full"
                >
                  <Text className="text-gray-700 text-sm font-medium ">
                    {skill.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )
      )}

      <View className="flex-row flex-wrap gap-2">
        {formik.values.skillIds && formik.values.skillIds.length > 0 ? (
          formik.values.skillIds.map((skillId: string) => {
            const skillName = getSkillName(skillId);
            if (!skillName) return null;
            return (
              <TouchableOpacity
                key={skillId}
                onPress={() => handleRemoveSkill(skillId)}
                className="bg-azure-radiance-500 px-3 py-2 rounded-full flex-row items-center gap-2"
              >
                <Text className="text-white text-sm font-medium ">
                  {getSkillName(skillId)}
                </Text>
                <Text className="text-white text-sm font-medium ">×</Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text className="text-gray-500 text-sm font-medium italic">
            No skills added yet
          </Text>
        )}
      </View>

      {hasError && (
        <Text className="text-red-500 text-sm font-medium mt-2">
          {formik.errors.skillIds as string}
        </Text>
      )}
    </View>
  );
};
