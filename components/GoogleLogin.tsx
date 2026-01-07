import { useSocialLoginMutation } from "@/api/services/authApi";
import GoogleIcon from "@/assets/images/google.png";
import { SocialProvider } from "@/types/user";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";

function GoogleLogin() {
  const [socialLogin, { isLoading }] = useSocialLoginMutation();

  const googleClientId =
    Constants.expoConfig?.extra?.GOOGLE_OAUTH?.EXPO_CLIENT_ID;
  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: googleClientId,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, [googleClientId]);

  const handleGoogleSignIn = async () => {
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices();

      // Sign in
      const userInfo = await GoogleSignin.signIn();

      // Extract user data - GoogleSignin.signIn() returns the user object directly
      const googleUserData = {
        email: userInfo.data?.user?.email || "",
        firstName: userInfo.data?.user?.givenName || "",
        lastName: userInfo.data?.user?.familyName || "",
        profileImage: userInfo.data?.user?.photo || "",
        provider: SocialProvider.GOOGLE,
      };

      // Call social login API with Google user data
      await socialLogin(googleUserData).unwrap();
    } catch (error: any) {
      console.log({ error });

      if (error.code === "SIGN_IN_CANCELLED") {
        // User cancelled the sign-in flow
        return;
      }

      // Handle specific API errors
      if (error.status === 401) {
        Alert.alert(
          "Authentication Failed",
          "Invalid credentials. Please try again."
        );
      } else if (error.status === 409) {
        Alert.alert(
          "Account Already Exists",
          "An account with this email already exists. Please sign in instead."
        );
      } else {
        Alert.alert(
          "Google Sign In Failed",
          "There was an error signing in with Google. Please try again."
        );
      }
    }
  };

  const handleGooglePress = () => {
    handleGoogleSignIn();
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center font-bold bg-gray-100 h-10 rounded-lg shadow-md"
      onPress={handleGooglePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#6B7280" className="mr-2" />
      ) : (
        <Image source={GoogleIcon} className="h-4 w-4 mr-2" />
      )}
      <Text className="text-gray-700 font-semibold">
        {isLoading ? "Signing in..." : "Continue with Google"}
      </Text>
    </TouchableOpacity>
  );
}

export default GoogleLogin;
