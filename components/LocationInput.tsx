import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useLocationSuggestions } from "@/hooks/useLocationSuggestions";
import { showErrorNotification } from "@/store/reducers/notificationSlice";
import { selectNativeEvent } from "@/store/reducers/uiSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

interface LocationInputProps {
  value: string;
  onChangeText: (text: string) => void;

  placeholder?: string;
  showCurrentLocation?: boolean;
  onCurrentLocation?: () => void;
}

export default function LocationInput({
  value,
  onChangeText,
  placeholder = "Type city, state or country",
}: LocationInputProps) {
  const [input, setInput] = useState(value);
  const colorScheme = useColorScheme();
  const [locationSelected, setLocationSelected] = useState<boolean>(false);
  const nativeEvent = useAppSelector(selectNativeEvent);
  const [fetchCurrentLocation, setFetchCurrentLocation] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { suggestions, isFetching } = useLocationSuggestions(
    input,
    locationSelected
  );

  const inputRef = useRef<View>(null);

  const handleTextChange = useCallback((text: string) => {
    setInput(text);
    setLocationSelected(false);
  }, []);

  const handleSelectLocation = useCallback(
    (location: string) => {
      onChangeText(location);
      setLocationSelected(true);
      Keyboard.dismiss();
    },
    [onChangeText]
  );

  const handleUseCurrentLocation = useCallback(async () => {
    setFetchCurrentLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      dispatch(showErrorNotification("User not able to access location"));
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    const locationName = reverseGeocode[0];
    const locationString = `${locationName.city || ""}${
      locationName.city && locationName.region ? ", " : ""
    }${locationName.region || ""}${
      locationName.region && locationName.country ? ", " : ""
    }${locationName.country || ""}`;

    onChangeText(locationString);
    setInput(locationString);
    setFetchCurrentLocation(false);
    setLocationSelected(true);

    Keyboard.dismiss();
  }, [onChangeText, dispatch]);

  useEffect(() => {
    if (!nativeEvent || locationSelected) return;
    inputRef?.current?.measure((_x, _y, width, height, pageX, pageY) => {
      const touchX = nativeEvent?.pageX;
      const touchY = nativeEvent?.pageY;

      // Only proceed if touchX and touchY are numbers (i.e., from a touch event)
      if (typeof touchX !== "number" || typeof touchY !== "number") return;

      const isOutside =
        touchX < pageX ||
        touchX > pageX + width ||
        touchY < pageY ||
        touchY > pageY + height;

      if (isOutside) {
        setLocationSelected(true);
        console.log("Clicked outside inputContainerRef");
      }
    });
  }, [locationSelected, nativeEvent]);

  return (
    <View className="relative">
      <View
        ref={inputRef}
        className="flex-row items-center bg-white dark:bg-gray-800 rounded-full border  border-gray-200 dark:border-gray-700 px-3 h-12"
      >
        <Ionicons
          name="location-outline"
          size={20}
          color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 text-base dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2"
          placeholder={placeholder}
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          value={input}
          onChangeText={handleTextChange}
          underlineColorAndroid="transparent"
        />
        {input && (
          <Pressable onPress={() => handleTextChange("")} className="p-1">
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>
      {locationSelected ? null : (
        <View className="absolute top-full left-0 right-0 bg-white dark:bg-black border border-b-0 overflow-hidden border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-lg z-50">
          <Pressable
            onPress={handleUseCurrentLocation}
            className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700  "
          >
            {fetchCurrentLocation ? (
              <ActivityIndicator
                color="#1eadff"
                size={18}
                style={{ marginRight: 12 }}
              />
            ) : (
              <Ionicons
                name="navigate"
                size={18}
                color="#1eadff"
                style={{ marginRight: 12 }}
              />
            )}

            <Text className="text-base font-semibold text-azure-radiance-500">
              {fetchCurrentLocation
                ? "Getting location..."
                : "Use my current location"}
            </Text>
          </Pressable>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectLocation(item)}
                className="flex-row items-start px-4 py-3 border-b border-gray-100 dark:border-gray-700"
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#6B7280"
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-base text-gray-900 dark:text-gray-100">
                    {item}
                  </Text>
                </View>
              </Pressable>
            )}
            scrollEnabled={false}
            nestedScrollEnabled
            ListEmptyComponent={
              <Pressable className="flex-row items-start px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {isFetching
                      ? "Fetching your results..."
                      : input
                      ? `Not results found for "${input}"`
                      : "Type city, state or country"}
                  </Text>
                </View>
              </Pressable>
            }
          />
        </View>
      )}
    </View>
  );
}
