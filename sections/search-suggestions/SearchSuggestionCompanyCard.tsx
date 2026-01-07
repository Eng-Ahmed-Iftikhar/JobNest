import {
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
} from "@/api/services/companyApi";
import LocationText from "@/components/LocationText";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCompanyFollowers } from "@/store/reducers/companySlice";
import { SuggestedCompany } from "@/types/search/suggestedCompanies";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

function SearchSuggestionCompanyCard({ item }: { item: SuggestedCompany }) {
  const router = useRouter();
  const followedCompanies = useAppSelector(selectCompanyFollowers);
  const isFollowed = followedCompanies.find(
    (company) => company.id === item.id
  );
  const [followCompany, { isLoading: isFollowLoading }] =
    useFollowCompanyMutation();
  const [unfollowCompany, { isLoading: isUnfollowLoading }] =
    useUnfollowCompanyMutation();

  const handleFollowToggle = async () => {
    if (isFollowed) {
      await unfollowCompany({ companyId: item.id });
    } else {
      await followCompany({ companyId: item.id });
    }
  };

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(dashboard)/(tabs)/company-detail",
          params: { id: item.id },
        })
      }
      className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-white"
    >
      <View className="flex-row items-center gap-3">
        {item.profile.pictureUrl ? (
          <View className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 items-center justify-center">
            <Image
              src={item.profile.pictureUrl}
              alt={item.name}
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
          </View>
        ) : (
          <View className="w-11 h-11 rounded-full items-center justify-center bg-azure-radiance-500">
            <Ionicons name="storefront" size={20} color="white" />
          </View>
        )}
        <View>
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <LocationText location={item.profile.location} />
          <Text className="text-sm font-medium  text-azure-radiance-500 mt-1">
            {item.profile.employer.employerJobs.length} open jobs
          </Text>
        </View>
      </View>
      <Pressable
        className={`px-4 py-2 rounded-lg border ${isFollowed ? "bg-gray-100 border-gray-300" : "bg-azure-radiance-50 border-azure-radiance-200"}`}
        onPress={handleFollowToggle}
        disabled={isFollowLoading || isUnfollowLoading}
      >
        {isFollowLoading || isUnfollowLoading ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : (
          <Text
            className={`text-sm font-medium ${isFollowed ? "text-gray-500" : "text-azure-radiance-500"}`}
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Text>
        )}
      </Pressable>
    </Pressable>
  );
}

export default SearchSuggestionCompanyCard;
