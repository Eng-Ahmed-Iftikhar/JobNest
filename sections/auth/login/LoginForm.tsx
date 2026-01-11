import { useSignInMutation } from "@/api/services/authApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Checkbox } from "expo-checkbox";
import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "password must be atleast 6 characters"),
  rememberMe: yup.boolean(),
});

function LoginForm() {
  const [loginUser] = useSignInMutation();

  const handleLogin = useCallback(
    async (
      values: {
        email: string;
        password: string;
        rememberMe: boolean;
      },
      { setFieldError }: any
    ) => {
      try {
        await loginUser(values).unwrap();
      } catch (error: any) {
        // Set field error if server returns validation error
        if (error?.data?.message) {
          // Check if the error is related to a specific field
          const message = error.data.message.toLowerCase();
          if (message.includes("email")) {
            setFieldError("email", error.data.message);
          } else if (message.includes("password")) {
            setFieldError("password", error.data.message);
          } else {
            // General error - set on email field as fallback
            setFieldError("email", error.data.message);
          }
        }
      }
    },
    [loginUser]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <Formik
          initialValues={{ email: "", password: "", rememberMe: false }}
          onSubmit={handleLogin}
          validationSchema={loginSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View>
              <View className=" flex gap-6 ">
                <Input
                  label="Email"
                  type="text"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  error={errors.email}
                  isError={!!errors.email && touched.email}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={errors.password}
                  isError={!!errors.password && touched.password}
                />
              </View>

              <View className="mt-2">
                <Link
                  href="/(auth)/forgot-password"
                  className="text-azure-radiance-500 text-sm font-medium"
                >
                  Forgot Password?
                </Link>
              </View>
              <View className="flex-row items-center mt-4">
                <Checkbox
                  color={"#1eadff"}
                  value={values.rememberMe}
                  onValueChange={(value) => {
                    setFieldValue("rememberMe", value);
                  }}
                />
                <Text className="text-sm font-medium  dark:text-white ml-2">
                  Keep me logged in
                </Text>
              </View>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                onPress={(e) => handleSubmit(e as any)}
                className="mt-6"
              >
                Login
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginForm;
