import { useAppDispatch } from "@/hooks/useAppDispatch";
import { showSuccessNotification } from "@/store/reducers/notificationSlice";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import OptionsDropdown from "./OptionsDropdown";
import ShareDropdown from "./ShareDropdown";

type JobCardMenuIconProps = {
  jobId: string;
  jobTitle: string;
  jobCompany?: {
    id: string;
    name: string;
  };
};

export default function JobCardMenuIcon({
  jobId,
  jobTitle,
  jobCompany,
}: JobCardMenuIconProps) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const jobUrl = `https://shiftquest/jobs/${jobId}`;
  const dispatch = useAppDispatch();

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(jobUrl);
    setShowShareMenu(false);
    setShowOptionsMenu(false);
    dispatch(showSuccessNotification("Link copied to clipboard!"));
  };

  const handleSaveJob = () => {
    setShowOptionsMenu(false);
  };
  const handleSocialShare = (platform: string) => {
    let url = "";
    const text = encodeURIComponent(
      `Check out this job: ${jobTitle} at ${jobCompany?.name}`
    );

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(jobUrl)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(`Job Opportunity: ${jobTitle}`)}&body=${text}%0A${encodeURIComponent(jobUrl)}`;
        break;
    }

    Linking.openURL(url);
    setShowShareMenu(false);
    setShowOptionsMenu(false);
  };

  const toggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const closeAllMenus = () => {
    setShowOptionsMenu(false);
    setShowShareMenu(false);
  };

  const hasOpenMenu = showOptionsMenu || showShareMenu;

  return (
    <>
      {hasOpenMenu && (
        <Pressable
          style={[
            StyleSheet.absoluteFillObject,
            {
              top: -1000,
              bottom: -1000,
              left: -1000,
              right: -1000,
              zIndex: 40,
            },
          ]}
          onPress={closeAllMenus}
          pointerEvents="auto"
        >
          <View style={StyleSheet.absoluteFillObject} />
        </Pressable>
      )}

      <View className="relative">
        <TouchableOpacity
          className="relative"
          onPress={toggleOptionsMenu}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="ellipsis-vertical" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Options Menu Dropdown */}
        <OptionsDropdown
          jobId={jobId}
          onSave={handleSaveJob}
          visible={showOptionsMenu}
          onShare={() => {
            setShowOptionsMenu(false);
            setShowShareMenu(true);
          }}
        />

        {/* Share Menu Dropdown */}
        <ShareDropdown
          visible={showShareMenu}
          jobUrl={jobUrl}
          onCopyLink={handleCopyLink}
          onShareFacebook={() => handleSocialShare("facebook")}
          onShareTwitter={() => handleSocialShare("twitter")}
          onShareEmail={() => handleSocialShare("email")}
        />
      </View>
    </>
  );
}
