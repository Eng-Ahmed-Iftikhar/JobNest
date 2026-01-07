import Avatar from "@/components/ui/Avatar";
import { SearchCompany } from "@/types/search";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface SearchCompanyCardProps {
  company: SearchCompany;
}

export default function SearchCompanyCard({ company }: SearchCompanyCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(dashboard)/(tabs)/company-detail",
      params: { id: company.id },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className=" bg-white items-center w-32"
    >
      <Avatar
        imageUrl={company?.pictureUrl}
        size={40}
        name={company?.company.name}
      />
      <Text
        className="text-sm font-semibold text-gray-900 mt-3 text-center"
        numberOfLines={2}
      >
        {company?.company.name}
      </Text>
    </TouchableOpacity>
  );
}
