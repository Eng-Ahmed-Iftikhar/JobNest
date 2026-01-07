import Avatar from "@/components/ui/Avatar";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUser } from "@/store/reducers/userSlice";
import { Connection } from "@/types/connection";
import { Pressable, Text } from "react-native";

function ContactSuggestItem({
  item,
  onPress,
}: {
  item: Connection;
  onPress: () => void;
}) {
  const user = useAppSelector(selectUser);
  const isSender = item.connectionRequest?.senderId === user?.id;
  const contactUser = isSender
    ? item.connectionRequest?.receiver
    : item.connectionRequest?.sender;
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-100"
    >
      <Avatar
        imageUrl={contactUser?.profile.pictureUrl || ""}
        name={`${contactUser?.profile.firstName} ${contactUser?.profile.lastName}`}
      />
      <Text className="text-base font-semibold text-gray-900">{`${contactUser?.profile.firstName} ${contactUser?.profile.lastName}`}</Text>
    </Pressable>
  );
}

export default ContactSuggestItem;
