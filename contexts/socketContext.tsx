import { useLazyGetChatQuery } from "@/api/services/chatApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";
import {
  addUnreadCount,
  selectChats,
  upsertMessage,
} from "@/store/reducers/chatSlice";
import {
  addRequest,
  removeRequest,
  updateRequestCount,
} from "@/store/reducers/connectionRequestSlice";
import {
  addConnection,
  updateConnectionCount,
} from "@/store/reducers/connectionSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { Chat, ChatMessage } from "@/types/chat";
import { Connection } from "@/types/connection";
import { ConnectionRequest } from "@/types/connection-request";
import { CHAT_SOCKET_EVENT, CONNECTION_SOCKET_EVENT } from "@/types/socket";
import { initSocket } from "@/utils/socket";
import moment from "moment";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { access_token = "" } = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const chats = useAppSelector(selectChats);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [getChatById] = useLazyGetChatQuery();
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useAppDispatch();

  const handleNewChatMessage = useCallback(
    async (message: ChatMessage) => {
      const userId = user?.id;
      let chat = chats.filter((c: Chat) => c.id === message.chatId)[0];
      if (!chat) {
        chat = await getChatById(message.chatId || "").unwrap();

        return;
      }
      const currentChatUser = chat?.users?.filter(
        (cu) => cu.userId === userId,
      )[0];

      const chatUser = chat?.users?.filter(
        (cu) => cu.id === message.senderId,
      )[0];
      const mutedEntry = chat?.mutes.filter(
        (mute) =>
          mute.chatUserId === chatUser?.id &&
          moment(mute.mutedTill).isAfter(moment()),
      )[0];
      const isMuted = Boolean(mutedEntry);

      if (currentChatUser?.id === message.senderId) return;

      socket?.emit(CHAT_SOCKET_EVENT.MESSAGE_RECEIVED, {
        id: message.id,
        userId,
      });

      const updatedStatuses = message.userStatuses?.map((status) => {
        if (status.userId === userId) {
          return { ...status, receivedAt: new Date() };
        }
        return status;
      });
      dispatch(
        addUnreadCount({
          chatId: message.chatId,
          senderId: message.senderId,
        }),
      );

      dispatch(upsertMessage({ ...message, userStatuses: updatedStatuses }));
    },
    [chats, getChatById, socket, user, dispatch],
  );

  const handleChatMessageReceived = useCallback(
    (message: ChatMessage) => {
      const userId = user?.id;

      const chat = chats.filter((c: Chat) => c.id === message.chatId)[0];
      const currentChatUser = chat?.users?.filter(
        (cu) => cu.userId === userId,
      )[0];
      if (currentChatUser?.id !== message.senderId) return;
      dispatch(upsertMessage(message));
    },
    [chats, dispatch, user],
  );

  const handleMessageSeen = useCallback(
    (message: ChatMessage) => {
      const userId = user?.id;

      const chat = chats.filter((c: Chat) => c.id === message.chatId)[0];
      const currentChatUser = chat?.users?.filter(
        (cu) => cu.userId === userId,
      )[0];
      if (currentChatUser?.id !== message.senderId) return;
      dispatch(upsertMessage(message));
    },
    [chats, dispatch, user],
  );

  const handleNewConnectionRequest = useCallback(
    (message: { connectionRequest: ConnectionRequest; count: number }) => {
      console.log({ message });
      const { connectionRequest, count } = message;

      const userId = user?.id;
      if (userId === connectionRequest.senderId) return;
      dispatch(addRequest(connectionRequest));
      dispatch(updateRequestCount(count));
    },
    [dispatch, user?.id],
  );

  const handleConnectionAccepted = useCallback(
    ({ connection, count }: { connection: Connection; count: number }) => {
      const userId = user?.id;
      if (userId === connection.connectionRequest?.receiverId) return;
      dispatch(addConnection(connection));
      dispatch(updateConnectionCount(count));
      dispatch(removeRequest(connection.connectionRequest!.id));
    },
    [dispatch, user?.id],
  );

  useEffect(() => {
    if (!access_token) return; // Don't initialize socket if no access token
    // Initialize socket connection
    const newSocket = initSocket(access_token); // You can pass any necessary options here

    // Connection listener
    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    // Disconnect listener
    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on(CHAT_SOCKET_EVENT.NEW_MESSAGE, handleNewChatMessage);
    newSocket.on(CHAT_SOCKET_EVENT.MESSAGE_RECEIVED, handleChatMessageReceived);
    newSocket.on(CHAT_SOCKET_EVENT.MESSAGE_SEEN, handleMessageSeen);
    newSocket.on(
      CONNECTION_SOCKET_EVENT.NEW_CONNECTION,
      handleNewConnectionRequest,
    );
    newSocket.on(
      CONNECTION_SOCKET_EVENT.CONNECTION_ACCEPTED,
      handleConnectionAccepted,
    );

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off(CHAT_SOCKET_EVENT.NEW_MESSAGE, handleNewChatMessage);

      newSocket.off(
        CHAT_SOCKET_EVENT.MESSAGE_RECEIVED,
        handleChatMessageReceived,
      );
      newSocket.off(CHAT_SOCKET_EVENT.MESSAGE_SEEN, handleMessageSeen);
      newSocket.off(
        CONNECTION_SOCKET_EVENT.NEW_CONNECTION,
        handleNewConnectionRequest,
      );
      newSocket.off(
        CONNECTION_SOCKET_EVENT.CONNECTION_ACCEPTED,
        handleConnectionAccepted,
      );
      newSocket.disconnect();
    };
  }, [
    access_token,
    handleNewChatMessage,
    handleChatMessageReceived,
    handleMessageSeen,
    handleNewConnectionRequest,
    handleConnectionAccepted,
  ]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
