import { IMessage } from "@veramo/core";

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
arr.reduce((groups, item) => {
  (groups[key(item)] ||= []).push(item);
  return groups;
}, {} as Record<K, T[]>);

export function getMessagesParticipants(messages: IMessage[]) {
  const participants: string[] = [];
  messages.forEach((message) => {
    if (message.from) {
      participants.push(message.from);
    }
    if (message.to) {
      participants.push(message.to);
    }
  });
  return [...new Set(participants)];
}