import { ChatMessage, ChatMessagesByDate } from "@/types/chat";

export const formatMessagesByDate = (messages: ChatMessage[]) => {
  let messagesByDate: ChatMessagesByDate[] = [];
  messages.forEach((msg) => {
    const dateKey =
      new Date(msg.createdAt).getDay() +
      "-" +
      new Date(msg.createdAt).getMonth() +
      "-" +
      new Date(msg.createdAt).getFullYear();

    let dateGroup = messagesByDate.find((group) => {
      const groupDateKey =
        new Date(group.date).getDay() +
        "-" +
        new Date(group.date).getMonth() +
        "-" +
        new Date(group.date).getFullYear();
      return groupDateKey === dateKey ? group : null;
    });

    if (!dateGroup) {
      dateGroup = { date: new Date(msg.createdAt), messages: [msg] };
      messagesByDate.push(dateGroup);
    } else {
      const previousMessages =
        messagesByDate[messagesByDate.indexOf(dateGroup)].messages;
      const alreadyHaveMessage = previousMessages.find((m) => m.id === msg.id);
      if (!alreadyHaveMessage) {
        messagesByDate[messagesByDate.indexOf(dateGroup)].messages.push(msg);
      }
    }
  });
  // Sort messages in each date group so newest is first
  messagesByDate.forEach((group) => {
    group.messages.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });
  return messagesByDate;
};
