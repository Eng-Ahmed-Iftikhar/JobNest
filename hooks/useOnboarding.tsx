import { onboardingContext } from "@/contexts/OnboardingContext";
import { useContext } from "react";

export default function useOnboarding() {
  return useContext(onboardingContext);
}
