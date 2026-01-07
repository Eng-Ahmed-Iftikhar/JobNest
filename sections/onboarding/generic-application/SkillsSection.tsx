import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  useGetSkillsQuery,
  useCreateSkillMutation,
} from "@/api/services/skillApi";

type SkillsSectionProps = {
  values: string[]; // Array of skill IDs
  setFieldValue: (field: string, value: any) => void;
  formik: any;
};

function SkillsSection({ values, setFieldValue, formik }: SkillsSectionProps) {
  const [skillInput, setSkillInput] = useState("");
  const { data: availableSkills, isLoading: isLoadingSkills } =
    useGetSkillsQuery();
  const [createSkill, { isLoading: isCreatingSkill }] =
    useCreateSkillMutation();

  const handleAddSkill = async () => {
    if (skillInput.trim().length === 0) return;

    try {
      // Check if skill already exists in available skills
      const existingSkill = availableSkills?.find(
        (skill) => skill.name.toLowerCase() === skillInput.trim().toLowerCase()
      );

      if (existingSkill) {
        // Add existing skill if not already selected
        if (!values.includes(existingSkill.id)) {
          setFieldValue("skillIds", [...values, existingSkill.id]);
        }
      } else {
        // Create new skill
        const newSkill = await createSkill({
          name: skillInput.trim(),
        }).unwrap();
        setFieldValue("skillIds", [...values, newSkill.id]);
      }

      setSkillInput("");
    } catch (error: any) {
      console.error("Failed to add skill:", error);
      Alert.alert("Error", "Failed to add skill. Please try again.");
    }
  };

  const handleSelectSkill = (skillId: string) => {
    if (!values.includes(skillId)) {
      setFieldValue("skillIds", [...values, skillId]);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setFieldValue(
      "skillIds",
      values.filter((id) => id !== skillId)
    );
  };

  const getSkillName = (skillId: string) => {
    return availableSkills?.find((skill) => skill.id === skillId)?.name || "";
  };

  const unselectedSkills = availableSkills?.filter(
    (skill) => !values.includes(skill.id)
  );

  const hasError = formik.touched.skillIds && formik.errors.skillIds;

  return (
    <View className="flex-1">
      <Text className="text-xl font-bold text-black mb-4">Skills</Text>

      <View className="gap-4">
        {/* Input to add new skill */}
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-base"
            placeholder="Enter a skill"
            value={skillInput}
            onChangeText={setSkillInput}
            onSubmitEditing={handleAddSkill}
            editable={!isCreatingSkill}
          />
          <TouchableOpacity
            onPress={handleAddSkill}
            disabled={isCreatingSkill || skillInput.trim().length === 0}
            className={`px-4 py-2 rounded-lg justify-center ${
              isCreatingSkill || skillInput.trim().length === 0
                ? "bg-gray-400"
                : "bg-azure-radiance-500"
            }`}
          >
            {isCreatingSkill ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-medium">Add</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Available skills to select */}
        {isLoadingSkills ? (
          <ActivityIndicator color="#1eadff" size="small" />
        ) : (
          unselectedSkills &&
          unselectedSkills.length > 0 && (
            <View>
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
                    <Text className="text-gray-700 text-sm font-medium font-medium">
                      {skill.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )
        )}

        {/* Selected skills */}
        {values.length > 0 && (
          <View>
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Selected skills:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {values.map((skillId) => (
                <TouchableOpacity
                  key={skillId}
                  onPress={() => handleRemoveSkill(skillId)}
                  className="bg-azure-radiance-500 px-3 py-2 rounded-full flex-row items-center gap-2"
                >
                  <Text className="text-white text-sm font-medium font-medium">
                    {getSkillName(skillId)}
                  </Text>
                  <Text className="text-white text-sm font-medium font-bold">
                    ×
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Error message */}
        {hasError && (
          <Text className="text-red-500 text-sm font-medium mt-1">
            {formik.errors.skillIds}
          </Text>
        )}
      </View>
    </View>
  );
}

export default SkillsSection;
