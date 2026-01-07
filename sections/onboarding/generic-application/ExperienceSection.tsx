import DatePicker from "@/components/ui/DatePicker";
import Input from "@/components/ui/Input";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Experience = {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
};

type ExperienceSectionProps = {
  values: Experience[];
  setFieldValue: (field: string, value: any) => void;
  formik: any;
};

function ExperienceSection({
  values,
  setFieldValue,
  formik,
}: ExperienceSectionProps) {
  const handleAddExperience = () => {
    const newExperience: Experience = {
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    };
    setFieldValue("experiences", [...values, newExperience]);
  };

  const handleRemoveExperience = (index: number) => {
    setFieldValue(
      "experiences",
      values.filter((_, i) => i !== index)
    );
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updated = [...values];
    updated[index] = { ...updated[index], [field]: value };
    setFieldValue("experiences", updated);
  };

  const getFieldError = (index: number, field: string) => {
    return formik.errors.experiences?.[index]?.[field];
  };

  const getFieldTouched = (index: number, field: string) => {
    return formik.touched.experiences?.[index]?.[field];
  };

  return (
    <View>
      <Text className="text-xl font-bold text-black mb-4">Experience</Text>

      {values.map((exp, index) => (
        <View key={index} className="mb-6 pb-6 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-4">
            {values.length > 1 && (
              <TouchableOpacity onPress={() => handleRemoveExperience(index)}>
                <Text className="text-red-500 font-medium">Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-4">
            <Input
              label="Position"
              placeholder="e.g., Senior Developer"
              value={exp.position}
              onChangeText={(text) =>
                handleFieldChange(index, "position", text)
              }
              onBlur={() =>
                formik.setFieldTouched(`experiences[${index}].position`)
              }
              error={getFieldError(index, "position")}
              isError={
                !!getFieldError(index, "position") &&
                getFieldTouched(index, "position")
              }
            />

            <Input
              label="Company"
              placeholder="e.g., Google"
              value={exp.company}
              onChangeText={(text) => handleFieldChange(index, "company", text)}
              onBlur={() =>
                formik.setFieldTouched(`experiences[${index}].company`)
              }
              error={getFieldError(index, "company")}
              isError={
                !!getFieldError(index, "company") &&
                getFieldTouched(index, "company")
              }
            />

            <View className="flex-row gap-4">
              <DatePicker
                label="Start Date"
                placeholder="Select start date"
                value={exp.startDate}
                onChangeDate={(date) =>
                  handleFieldChange(index, "startDate", date)
                }
                error={getFieldError(index, "startDate")}
                isError={
                  !!getFieldError(index, "startDate") &&
                  getFieldTouched(index, "startDate")
                }
                maxDate={exp.endDate || undefined}
              />

              <DatePicker
                label="End Date"
                placeholder="Select end date"
                value={exp.endDate || ""}
                onChangeDate={(date) =>
                  handleFieldChange(index, "endDate", date)
                }
                error={getFieldError(index, "endDate")}
                isError={
                  !!getFieldError(index, "endDate") &&
                  getFieldTouched(index, "endDate")
                }
                editable={!exp.isCurrent}
                minDate={exp.startDate || undefined}
              />
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() =>
                  handleFieldChange(index, "isCurrent", !exp.isCurrent)
                }
                className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                  exp.isCurrent
                    ? "bg-azure-radiance-500 border-azure-radiance-500"
                    : "border-gray-300"
                }`}
              >
                {exp.isCurrent && (
                  <Text className="text-white text-sm font-medium">✓</Text>
                )}
              </TouchableOpacity>
              <Text className="text-gray-600">My current position</Text>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={handleAddExperience}
        className="flex-row items-center gap-2 py-3"
      >
        <Text className="text-azure-radiance-500 text-lg">+</Text>
        <Text className="text-azure-radiance-500 font-medium">
          Add experience
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default ExperienceSection;
