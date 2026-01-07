import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

type Education = {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  yearStarted: number;
  yearGraduated?: number;
  inProgress?: boolean;
};

type EducationSectionProps = {
  values: Education[];
  setFieldValue: (field: string, value: any) => void;
  formik: any;
};

function EducationSection({
  values,
  setFieldValue,
  formik,
}: EducationSectionProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    label: String(currentYear - i),
    value: String(currentYear - i),
  }));

  const degreeOptions = [
    { label: "High School", value: "High School" },
    { label: "Associate", value: "Associate" },
    { label: "Bachelor", value: "Bachelor" },
    { label: "Master", value: "Master" },
    { label: "Doctorate", value: "Doctorate" },
    { label: "Certificate", value: "Certificate" },
  ];

  const handleAddEducation = () => {
    const newEducation: Education = {
      school: "",
      degree: "",
      fieldOfStudy: "",
      yearStarted: currentYear,
      yearGraduated: undefined,
      inProgress: false,
    };
    setFieldValue("educations", [...values, newEducation]);
  };

  const handleRemoveEducation = (index: number) => {
    setFieldValue(
      "educations",
      values.filter((_, i) => i !== index)
    );
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updated = [...values];
    updated[index] = { ...updated[index], [field]: value };
    setFieldValue("educations", updated);
  };

  const getFieldError = (index: number, field: string) => {
    return formik.errors.educations?.[index]?.[field];
  };

  const getFieldTouched = (index: number, field: string) => {
    return formik.touched.educations?.[index]?.[field];
  };

  return (
    <View>
      <Text className="text-xl font-bold text-black mb-4">Education</Text>

      {values.map((edu, index) => (
        <View key={index} className="mb-6 pb-6 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-4">
            {values.length > 1 && (
              <TouchableOpacity onPress={() => handleRemoveEducation(index)}>
                <Text className="text-red-500 font-medium">Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-4">
            <Input
              label="School"
              placeholder="e.g., Stanford University"
              value={edu.school}
              onChangeText={(text) => handleFieldChange(index, "school", text)}
              onBlur={() =>
                formik.setFieldTouched(`educations[${index}].school`)
              }
              error={getFieldError(index, "school")}
              isError={
                !!getFieldError(index, "school") &&
                getFieldTouched(index, "school")
              }
            />

            <View className="flex-row flex-1 gap-4">
              <Select
                label="Year Started"
                placeholder="Select year"
                items={yearOptions}
                value={String(edu.yearStarted)}
                onValueChange={(value) =>
                  handleFieldChange(index, "yearStarted", parseInt(value))
                }
                error={getFieldError(index, "yearStarted")}
                isError={
                  !!getFieldError(index, "yearStarted") &&
                  getFieldTouched(index, "yearStarted")
                }
              />

              <Select
                label="Year Graduated"
                placeholder="Select year"
                items={yearOptions}
                value={
                  edu.yearGraduated ? String(edu.yearGraduated) : undefined
                }
                onValueChange={(value) =>
                  handleFieldChange(index, "yearGraduated", parseInt(value))
                }
                error={getFieldError(index, "yearGraduated")}
                isError={
                  !!getFieldError(index, "yearGraduated") &&
                  getFieldTouched(index, "yearGraduated")
                }
                disabled={edu.inProgress}
              />
            </View>

            <Select
              label="Degree"
              placeholder="Select degree"
              items={degreeOptions}
              value={edu.degree}
              onValueChange={(value) =>
                handleFieldChange(index, "degree", value)
              }
              error={getFieldError(index, "degree")}
              isError={
                !!getFieldError(index, "degree") &&
                getFieldTouched(index, "degree")
              }
            />

            <Input
              label="Field of study (optional)"
              placeholder="e.g., Computer Science"
              value={edu.fieldOfStudy || ""}
              onChangeText={(text) =>
                handleFieldChange(index, "fieldOfStudy", text)
              }
              onBlur={() =>
                formik.setFieldTouched(`educations[${index}].fieldOfStudy`)
              }
              error={getFieldError(index, "fieldOfStudy")}
              isError={
                !!getFieldError(index, "fieldOfStudy") &&
                getFieldTouched(index, "fieldOfStudy")
              }
            />

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() =>
                  handleFieldChange(index, "inProgress", !edu.inProgress)
                }
                className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                  edu.inProgress
                    ? "bg-azure-radiance-500 border-azure-radiance-500"
                    : "border-gray-300"
                }`}
              >
                {edu.inProgress && (
                  <Text className="text-white text-sm font-medium">✓</Text>
                )}
              </TouchableOpacity>
              <Text className="text-gray-600">Education in progress</Text>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={handleAddEducation}
        className="flex-row items-center gap-2 py-3"
      >
        <Text className="text-azure-radiance-500 text-lg">+</Text>
        <Text className="text-azure-radiance-500 font-medium">
          Add education
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default EducationSection;
