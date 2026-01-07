import { useLocationSuggestions } from "@/hooks/useLocationSuggestions";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { showErrorNotification } from "@/store/reducers/notificationSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectNativeEvent } from "@/store/reducers/uiSlice";

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
  const [locationSelected, setLocationSelected] = useState<boolean>(false);
  const nativeEvent = useAppSelector(selectNativeEvent);
  const [fetchCurrentLocation, setFetchCurrentLocation] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { suggestions, isFetching } = useLocationSuggestions(
    input,
    locationSelected
  );
  const inputRef = useRef<TextInput>(null);

  const handleTextChange = (text: string) => {
    setInput(text);
    onChangeText(text);
    setLocationSelected(false);
  };

  const handleSelectLocation = (location: string) => {
    setInput(location);
    onChangeText(location);
    setLocationSelected(true);
    Keyboard.dismiss();
  };

  const handleUseCurrentLocation = async () => {
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
    }${locationName.region || ""}${locationName.region && locationName.country ? ", " : ""}${locationName.country || ""}`;

    onChangeText(locationString);
    setInput(locationString);
    setFetchCurrentLocation(false);
    setLocationSelected(true);

    Keyboard.dismiss();
  };
  useEffect(() => {
    if (!nativeEvent || locationSelected) return;
    inputRef?.current?.measure((_x, _y, width, height, pageX, pageY) => {
      const touchX = nativeEvent?.pageX;
      const touchY = nativeEvent?.pageY;
      // Only proceed if touchX and touchY are numbers (i.e., from a touch event)
      if (typeof touchX !== "number" || typeof touchY !== "number") return;
      // console.log(touchX, touchY, pageX, pageY, width, height);

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
  }, [nativeEvent]);

  return (
    <View className="relative">
      <View className="flex-row items-center bg-white rounded-full border border-gray-200 px-3 h-12">
        <Ionicons
          name="location-outline"
          size={20}
          color="#9CA3AF"
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={input}
          ref={inputRef}
          onChangeText={handleTextChange}
          underlineColorAndroid="transparent"
        />
        {value.length > 0 && (
          <Pressable onPress={() => handleTextChange("")} className="p-1">
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>
      {locationSelected ? null : (
        <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50">
          <Pressable
            onPress={handleUseCurrentLocation}
            className="flex-row items-center px-4 py-3 border-b border-gray-100"
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
                className="flex-row items-start px-4 py-3 border-b border-gray-100"
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#6B7280"
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-base text-gray-900">{item}</Text>
                </View>
              </Pressable>
            )}
            scrollEnabled={false}
            nestedScrollEnabled
            ListEmptyComponent={
              <Pressable className="flex-row items-start px-4 py-3 border-b border-gray-100">
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 font-medium">
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
