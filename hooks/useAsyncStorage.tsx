import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAsyncStorage<T>(key: string, initialValue?: T) {
  const [value, setValue] = useState<T | null>(initialValue ?? null);
  const [loading, setLoading] = useState(true);

  // Load value on mount
  useEffect(() => {
    (async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setValue(JSON.parse(storedValue));
        }
      } catch (error) {
        console.error("AsyncStorage read error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [key]);

  // Save value
  const setItem = async (newValue: T) => {
    try {
      setValue(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error("AsyncStorage write error:", error);
    }
  };

  // Remove value
  const removeItem = async () => {
    try {
      setValue(null);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("AsyncStorage remove error:", error);
    }
  };

  return {
    value,
    setItem,
    removeItem,
    loading,
  };
}
