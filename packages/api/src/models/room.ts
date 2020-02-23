import { ILokiObj } from './loki';
import { IMessage } from './message';

export interface IRoom extends ILokiObj {
  /** A list of user IDs */
  userIds: number[];
  /** Room name, also the name of the collection that stores all messages */
  name: string;
  /** Messages in the current room */
  messages: IMessage[];
}
