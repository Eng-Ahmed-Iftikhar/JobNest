import React from "react";
import { View, Text, Pressable } from "react-native";
import { useFormikContext, FieldArray, ErrorMessage } from "formik";
import Input from "@/components/ui/Input";

interface FormValues {
  educations: Array<{
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
  }>;
  [key: string]: any;
}

export const EducationSection: React.FC = () => {
  const formik = useFormikContext<FormValues>();
  return (
    <View className="px-4 py-6 bg-white rounded-lg mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Education
      </Text>

      <FieldArray name="educations">
        {(arrayHelpers) => (
          <View>
            {formik.values.educations &&
              formik.values.educations.map((education: any, index: number) => (
                <View
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200"
                >
                  <View className="flex-row justify-end items-center mb-4">
                    <Pressable
                      onPress={() => arrayHelpers.remove(index)}
                      className="bg-red-100 px-3 py-1 rounded"
                    >
                      <Text className="text-red-600 font-semibold text-sm font-medium">
                        Remove
                      </Text>
                    </Pressable>
                  </View>

                  <Input
                    label="Degree"
                    placeholder="e.g., Bachelor of Science"
                    value={education.degree}
                    onChangeText={formik.handleChange(
                      `educations.${index}.degree`
                    )}
                    onBlur={formik.handleBlur(`educations.${index}.degree`)}
                    error={
                      (formik.touched.educations as any)?.[index]?.degree &&
                      (formik.errors.educations as any)?.[index]?.degree
                        ? ((formik.errors.educations as any)?.[index]
                            ?.degree as string)
                        : undefined
                    }
                  />

                  <Input
                    label="Institution"
                    placeholder="e.g., Stanford University"
                    value={education.institution}
                    onChangeText={formik.handleChange(
                      `educations.${index}.institution`
                    )}
                    onBlur={formik.handleBlur(
                      `educations.${index}.institution`
                    )}
                    error={
                      (formik.touched.educations as any)?.[index]
                        ?.institution &&
                      (formik.errors.educations as any)?.[index]?.institution
                        ? ((formik.errors.educations as any)?.[index]
                            ?.institution as string)
                        : undefined
                    }
                  />

                  <View className="flex-row gap-3">
                    <Input
                      label="Start Date"
                      placeholder="MM/YYYY"
                      value={education.startDate}
                      onChangeText={formik.handleChange(
                        `educations.${index}.startDate`
                      )}
                      onBlur={formik.handleBlur(
                        `educations.${index}.startDate`
                      )}
                      error={
                        (formik.touched.educations as any)?.[index]
                          ?.startDate &&
                        (formik.errors.educations as any)?.[index]?.startDate
                          ? ((formik.errors.educations as any)?.[index]
                              ?.startDate as string)
                          : undefined
                      }
                    />

                    <Input
                      label="End Date"
                      placeholder="MM/YYYY"
                      value={education.endDate}
                      onChangeText={formik.handleChange(
                        `educations.${index}.endDate`
                      )}
                      onBlur={formik.handleBlur(`educations.${index}.endDate`)}
                      error={
                        (formik.touched.educations as any)?.[index]?.endDate &&
                        (formik.errors.educations as any)?.[index]?.endDate
                          ? ((formik.errors.educations as any)?.[index]
                              ?.endDate as string)
                          : undefined
                      }
                    />
                  </View>
                </View>
              ))}

            <Pressable
              onPress={() =>
                arrayHelpers.push({
                  degree: "",
                  institution: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="bg-azure-radiance/10 border border-dashed border-azure-radiance p-2 rounded-lg"
            >
              <Text className="text-azure-radiance font-semibold text-center">
                + Add Education
              </Text>
            </Pressable>
          </View>
        )}
      </FieldArray>
      <ErrorMessage
        name="educations"
        component={Text}
        className="text-red-500 text-sm font-medium mt-1"
      />
    </View>
  );
};
