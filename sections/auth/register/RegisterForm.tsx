import { useSignUpMutation } from "@/api/services/authApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SocialProvider } from "@/types/user";
import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import * as yup from "yup";

const registerSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(6, "Confirm password must be at least 6 characters")
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

function RegisterForm() {
  const [registerUser] = useSignUpMutation();

  const handleSubmit = useCallback(
    async (
      values: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      },
      { setFieldError }: any
    ) => {
      try {
        const { firstName, lastName, email, password } = values;
        await registerUser({
          firstName,
          lastName,
          email,
          password,
          provider: SocialProvider.EMAIL,
        }).unwrap();
      } catch (error: any) {
        // Set field error if server returns validation error
        if (error?.data?.message) {
          // Check if the error is related to a specific field
          const message = error.data.message.toLowerCase();
          if (message.includes("email")) {
            setFieldError("email", error.data.message);
          } else if (message.includes("password")) {
            setFieldError("password", error.data.message);
          } else if (
            message.includes("first name") ||
            message.includes("firstname")
          ) {
            setFieldError("firstName", error.data.message);
          } else if (
            message.includes("last name") ||
            message.includes("lastname")
          ) {
            setFieldError("lastName", error.data.message);
          } else {
            // General error - set on email field as fallback
            setFieldError("email", error.data.message);
          }
        }
      }
    },
    [registerUser]
  );

  return (
    <View style={{ flex: 1 }}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={registerSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View>
            <View className=" flex gap-6 ">
              <Input
                label="First Name"
                type="text"
                placeholder="Enter your first name"
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
                error={errors.firstName}
                isError={!!errors.firstName && touched.firstName}
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Enter your last name"
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
                error={errors.lastName}
                isError={!!errors.lastName && touched.lastName}
              />
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
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                error={errors.confirmPassword}
                isError={!!errors.confirmPassword && touched.confirmPassword}
              />
            </View>

            <View className=" mt-6">
              <Text className="text-sm font-medium text-gray-500 ">
                By signing up, you confirm that you agree to{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-azure-radiance-500 text-sm font-medium"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-azure-radiance-500 text-sm font-medium"
                >
                  Privacy Policy
                </Link>
              </Text>
            </View>

            <Button
              loading={isSubmitting}
              onPress={(e) => handleSubmit(e as any)}
              className="mt-6"
            >
              Sign up
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}

export default RegisterForm;
