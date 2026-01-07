/// <reference lib="es2015" />
import { Chat, ChatMessage } from "@/types/chat";
import {
  CHAT_SOCKET_EVENT,
  CHAT_SOCKET_ROOM,
  CONNECTION_SOCKET_EVENT,
} from "@/types/socket";
import { initSocket } from "@/utils/socket";
import { AnyAction, Middleware, ThunkDispatch } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";
import { Socket } from "socket.io-client";
import { addUnreadCount, upsertMessage } from "../reducers/chatSlice";
import { socketConnected, socketDisconnected } from "../reducers/socketSlice";
import { router } from "expo-router";
import { RootState } from "../reducers";
import moment from "moment";
import { ConnectionRequest } from "@/types/connection-request";
import {
  addRequest,
  removeRequest,
  updateRequestCount,
} from "@/store/reducers/connectionRequestSlice";
import { Connection } from "@/types/connection";
import {
  addConnection,
  updateConnectionCount,
} from "@/store/reducers/connectionSlice";
import { chatApi } from "@/api/services/chatApi";

let socket: Socket | null = null;

// Map notificationId to chatId
let newMessageNotifications: {
  notificationId: string;
  chatMessage: ChatMessage;
}[] = [];

export const socketMiddleware: Middleware<Object, RootState> =
  (storeAPI) => (next) => (action) => {
    const dispatch = storeAPI.dispatch as ThunkDispatch<
      RootState,
      unknown,
      AnyAction
    >;
    const typedAction = action as AnyAction;

    if (typedAction.type === "socket/connect") {
      const state = storeAPI.getState();
      const accessToken = state.auth?.access_token;
      socket = initSocket(accessToken);
      socket.connect();

      socket.on("connect", () => {
        console.log("connected to chat socket");
        storeAPI.dispatch(socketConnected(socket));
        socket?.emit(CHAT_SOCKET_ROOM.USERS);
      });

      socket.on("disconnect", () => {
        console.log("disconnected from chat socket");
        storeAPI.dispatch(socketDisconnected());
      });

      socket.on(CHAT_SOCKET_EVENT.NEW_MESSAGE, async (message: ChatMessage) => {
        const state = storeAPI.getState() as RootState;
        const userId = state.user.user?.id;
        const chats = state.chats.chats || [];
        let chat = chats.filter((c: Chat) => c.id === message.chatId)[0];
        if (!chat) {
          chat = await dispatch(
            chatApi.endpoints.getChat.initiate(message.chatId || "")
          ).unwrap();

          return;
        }
        const currentChatUser = chat?.users?.filter(
          (cu) => cu.userId === userId
        )[0];

        const chatUser = chat?.users?.filter(
          (cu) => cu.id === message.senderId
        )[0];
        const mutedEntry = chat?.mutes.filter(
          (mute) =>
            mute.chatUserId === chatUser?.id &&
            moment(mute.mutedTill).isAfter(moment())
        )[0];
        const isMuted = Boolean(mutedEntry);

        if (currentChatUser?.id === message.senderId) return;
        // Only trigger one notification per chatId until dismissed
        const alreadyNotified = newMessageNotifications.filter(
          (n) => n.chatMessage.id === message.id
        )[0];

        if (!alreadyNotified && !isMuted) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: "New Message Received",
              body: message.text || "You have received a new message.",
              sound: "default",
            },
            trigger: null,
          });
          newMessageNotifications.push({
            notificationId,
            chatMessage: message,
          });
        }

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
        storeAPI.dispatch(
          addUnreadCount({ chatId: message.chatId, senderId: message.senderId })
        );

        storeAPI.dispatch(
          upsertMessage({ ...message, userStatuses: updatedStatuses })
        );
      });

      socket.on(CHAT_SOCKET_EVENT.MESSAGE_RECEIVED, (message: ChatMessage) => {
        const state = storeAPI.getState() as RootState;
        const userId = state.user.user?.id;
        const chats = state.chats.chats || [];
        const chat = chats.filter((c: Chat) => c.id === message.chatId)[0];
        const currentChatUser = chat?.users?.filter(
          (cu) => cu.userId === userId
        )[0];
        if (currentChatUser?.id !== message.senderId) return;
        storeAPI.dispatch(upsertMessage(message));
      });

      socket.on(CHAT_SOCKET_EVENT.MESSAGE_SEEN, (message) => {
        const state = storeAPI.getState() as RootState;
        const userId = state.user.user?.id;
        const chats = state.chats.chats || [];
        const chat = chats.filter((c: Chat) => c.id === message.chatId)[0];
        const currentChatUser = chat?.users?.filter(
          (cu) => cu.userId === userId
        )[0];
        if (currentChatUser?.id !== message.senderId) return;
        storeAPI.dispatch(upsertMessage(message));
      });

      socket.on(
        CONNECTION_SOCKET_EVENT.NEW_CONNECTION,
        (message: { connectionRequest: ConnectionRequest; count: number }) => {
          console.log({ message });
          const { connectionRequest, count } = message;
          const state = storeAPI.getState();
          const userId = state.user.user?.id;
          if (userId === connectionRequest.senderId) return;
          storeAPI.dispatch(addRequest(connectionRequest));
          storeAPI.dispatch(updateRequestCount(count));
        }
      );

      socket.on(
        CONNECTION_SOCKET_EVENT.CONNECTION_ACCEPTED,
        ({ connection, count }: { connection: Connection; count: number }) => {
          const state = storeAPI.getState();
          const userId = state.user.user?.id;
          if (userId === connection.connectionRequest?.receiverId) return;
          storeAPI.dispatch(addConnection(connection));
          storeAPI.dispatch(updateConnectionCount(count));
          storeAPI.dispatch(removeRequest(connection.connectionRequest!.id));
        }
      );
      socket.on(
        CONNECTION_SOCKET_EVENT.CONNECTION_CANCELED,
        ({
          connectionRequest,
          count,
        }: {
          connectionRequest: ConnectionRequest;
          count: number;
        }) => {
          const state = storeAPI.getState();
          const userId = state.user.user?.id;
          if (userId === connectionRequest.receiverId) return;
          storeAPI.dispatch(removeRequest(connectionRequest.id));
          storeAPI.dispatch(updateRequestCount(count));
        }
      );
    }

    if (typedAction.type === "socket/disconnect") {
      socket?.disconnect();
    }

    return next(typedAction);
  };

Notifications.addNotificationResponseReceivedListener((response) => {
  const notificationId = response.notification.request.identifier;
  const chatNotification = newMessageNotifications.filter(
    (n) => n.notificationId === notificationId
  )[0];
  if (chatNotification) {
    // redirect to chat screen with chatId
    router.push({
      pathname: "/messages/chat",
      params: { id: chatNotification.chatMessage.chatId },
    });
    Notifications.dismissNotificationAsync(notificationId);
    // Optionally, remove the notificationId from the map
    newMessageNotifications = newMessageNotifications.filter(
      (n) => n.notificationId !== notificationId
    );
  }
});
