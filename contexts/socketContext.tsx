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
import { updateUnreadCount } from "@/store/reducers/notificationSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { Chat, ChatMessage } from "@/types/chat";
import { Connection } from "@/types/connection";
import { ConnectionRequest } from "@/types/connection-request";
import {
  CHAT_SOCKET_EVENT,
  CONNECTION_SOCKET_EVENT,
  NOTIFICATION_SOCKET_EVENT,
} from "@/types/socket";
import Constants from "expo-constants";
import moment from "moment";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}
const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { access_token = "" } = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const chats = useAppSelector(selectChats);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [getChatById] = useLazyGetChatQuery();

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
  const handleNotifcationCountUpdate = useCallback(
    ({ count }: { count: number }) => {
      dispatch(updateUnreadCount(count));
    },
    [dispatch],
  );
  const handleSocketConnect = useCallback(() => {
    console.log("Socket connected:", socket?.id);
  }, [socket]);

  const handleSocketDisconnect = useCallback(() => {
    console.log("Socket disconnected");
  }, []);

  useEffect(() => {
    if (!socket) return; // Don't initialize socket if no access token
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", handleSocketConnect);
    socket.on("disconnect", handleSocketDisconnect);

    socket.on(CHAT_SOCKET_EVENT.NEW_MESSAGE, handleNewChatMessage);
    socket.on(CHAT_SOCKET_EVENT.MESSAGE_RECEIVED, handleChatMessageReceived);
    socket.on(CHAT_SOCKET_EVENT.MESSAGE_SEEN, handleMessageSeen);
    socket.on(
      CONNECTION_SOCKET_EVENT.NEW_CONNECTION,
      handleNewConnectionRequest,
    );
    socket.on(
      CONNECTION_SOCKET_EVENT.CONNECTION_ACCEPTED,
      handleConnectionAccepted,
    );
    socket.on(
      NOTIFICATION_SOCKET_EVENT.UNREAD_COUNT_UPDATE,
      handleNotifcationCountUpdate,
    );

    // Cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.disconnect();
        socket.on("disconnect", handleSocketDisconnect);
      } else {
        socket.on("connect", handleSocketConnect);
      }
      socket.off(CHAT_SOCKET_EVENT.NEW_MESSAGE, handleNewChatMessage);
      socket.off(CHAT_SOCKET_EVENT.MESSAGE_RECEIVED, handleChatMessageReceived);
      socket.off(CHAT_SOCKET_EVENT.MESSAGE_SEEN, handleMessageSeen);
      socket.off(
        CONNECTION_SOCKET_EVENT.NEW_CONNECTION,
        handleNewConnectionRequest,
      );
      socket.off(
        CONNECTION_SOCKET_EVENT.CONNECTION_ACCEPTED,
        handleConnectionAccepted,
      );
      socket.off(
        NOTIFICATION_SOCKET_EVENT.UNREAD_COUNT_UPDATE,
        handleNotifcationCountUpdate,
      );
    };
  }, [
    access_token,
    handleNewChatMessage,
    handleChatMessageReceived,
    handleMessageSeen,
    handleNewConnectionRequest,
    handleConnectionAccepted,
    handleNotifcationCountUpdate,
    socket,
    handleSocketConnect,
    handleSocketDisconnect,
  ]);

  useEffect(() => {
    if (socket) return; // Socket already initialized
    // If no BASE_URL, warn and don't attempt to connect
    if (!BASE_URL) {
      console.warn(
        "SocketProvider: BASE_URL is not defined (expo config extra.BASE_URL)",
      );
      return;
    }

    const newSocket = io(BASE_URL, {
      autoConnect: true,
      auth: { token: access_token },
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      // do not force websocket-only here so polling fallback can be used in environments
    });

    setSocket(newSocket);
  }, [access_token, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
