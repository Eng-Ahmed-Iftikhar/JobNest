import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import Modal from "@/components/ui/Modal";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";

type MuteOption = {
  label: string;
  value: string;
  description?: string;
};

const options: MuteOption[] = [
  {
    label: "24 Hours",
    value: moment().add(24, "hours").toString(),
    description: "Mute notifications for 1 day",
  },
  {
    label: "1 Week",
    value: moment().add(1, "week").toString(),
    description: "Mute notifications for 7 days",
  },
  {
    label: "1 Month",
    value: moment().add(1, "month").toString(),
    description: "Mute notifications for 30 days",
  },
  {
    label: "Permanent",
    value: moment().add(100, "years").toString(),
    description: "Mute until you unmute",
  },
];

interface MuteOptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  selected?: string;
}

const validationSchema = Yup.object().shape({
  muteOption: Yup.string().required("Please select a mute duration."),
});

const MuteOptionModal: React.FC<MuteOptionModalProps> = ({
  visible,
  onClose,
  onSelect,
  selected,
}) => {
  return (
    <Modal visible={visible} onClose={onClose} title="Mute Options">
      <Formik
        initialValues={{ muteOption: selected || "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSelect(values.muteOption);
        }}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          handleSubmit,
          isSubmitting,
        }) => (
          <View>
            <View className="gap-2 mb-4">
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  className={`flex-row items-center px-4 py-3 rounded-xl ${values.muteOption === opt.value ? "bg-azure-radiance-50 border border-azure-radiance-500" : "bg-gray-50"}`}
                  onPress={() => setFieldValue("muteOption", opt.value)}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${values.muteOption === opt.value ? "border-azure-radiance-500 bg-azure-radiance-500" : "border-gray-300 bg-white"} items-center justify-center mr-3`}
                  >
                    {values.muteOption === opt.value && (
                      <View className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900">
                      {opt.label}
                    </Text>
                    {opt.description && (
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {opt.description}
                      </Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
            {touched.muteOption && errors.muteOption && (
              <Text className="text-xs text-red-500 mb-2">
                {errors.muteOption}
              </Text>
            )}
            <View className="flex-row gap-3 mt-2">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-gray-100 items-center justify-center"
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text className="text-base font-semibold text-gray-700">
                  Cancel
                </Text>
              </Pressable>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center justify-center ${values.muteOption ? "bg-azure-radiance-500" : "bg-gray-300"}`}
                onPress={() => handleSubmit()}
                disabled={!values.muteOption || isSubmitting}
              >
                <Text className="text-base font-semibold text-white">Mute</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </Modal>
  );
};

export default MuteOptionModal;
