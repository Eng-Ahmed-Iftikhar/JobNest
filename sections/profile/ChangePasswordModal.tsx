import React, { useState } from "react";
import { View, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormModal from "@/components/ui/FormModal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useChangePasswordMutation } from "@/api/services/userApi";

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  visible,
  onClose,
}: ChangePasswordModalProps) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    setError(null);
    setSuccess(null);

    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      setSuccess("Password changed successfully!");
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to change password");
    }
  };

  const handleClose = () => {
    onClose();
    setError(null);
    setSuccess(null);
  };

  return (
    <FormModal visible={visible} onClose={handleClose} title="Change Password">
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={changePasswordSchema}
        onSubmit={handleChangePassword}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            {error && (
              <View className="mb-4 p-3 bg-red-50 rounded-lg">
                <Text className="text-sm font-medium text-red-600">
                  {error}
                </Text>
              </View>
            )}

            {success && (
              <View className="mb-4 p-3 bg-green-50 rounded-lg">
                <Text className="text-sm font-medium text-green-600">
                  {success}
                </Text>
              </View>
            )}

            <View className="mb-4 flex-1">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={values.currentPassword}
                onChangeText={handleChange("currentPassword")}
                onBlur={handleBlur("currentPassword")}
                isError={!!(touched.currentPassword && errors.currentPassword)}
                error={
                  touched.currentPassword && errors.currentPassword
                    ? errors.currentPassword
                    : undefined
                }
              />
            </View>

            <View className="mb-4 flex-1">
              <Input
                type="password"
                label="New Password"
                placeholder="Enter new password"
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                isError={!!(touched.newPassword && errors.newPassword)}
                error={
                  touched.newPassword && errors.newPassword
                    ? errors.newPassword
                    : undefined
                }
              />
            </View>

            <View className="mb-6 flex-1">
              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                isError={!!(touched.confirmPassword && errors.confirmPassword)}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : undefined
                }
              />
            </View>

            <Button
              onPress={() => handleSubmit()}
              disabled={isLoading}
              loading={isLoading}
            >
              Change Password
            </Button>
          </View>
        )}
      </Formik>
    </FormModal>
  );
}
