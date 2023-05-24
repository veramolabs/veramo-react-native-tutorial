import { IMessage } from "@veramo/core";

export interface IThread {
  id: string;
  participants: string[];
  messages: IMessage[];
}