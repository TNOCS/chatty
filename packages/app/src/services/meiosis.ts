import Stream from 'mithril/stream';
import { IMessage, IRoom, IUser } from '../../../api/src';
import { merge } from '../utils/mergerino';
import { userService } from './user-service';
import { roomService } from './room-service';

/** Application state */
export const appStateMgmt = {
  initial: {
    app: {
      isSearching: false,
      searchQuery: '',
    },
  },
  actions: (us: UpdateStream) => {
    return {
      search: (isSearching: boolean, searchQuery?: string) =>
        us({ app: { isSearching, searchQuery } }),
    };
  },
};

export interface IAppModel {
  app: {
    isSearching?: boolean;
    searchQuery?: string;
  };
  users: {
    current?: IUser;
    all?: IUser[];
  };
  rooms: {
    current?: IRoom;
    all?: IRoom[];
  };
  room: { [roomName: string]: IMessage[] };
}

export interface IActions {
  getUsers: () => Promise<IUser[]>;
  getUser: (id: number) => void;
  setCurrentUser: (user: IUser) => void;
  saveUser: (user: IUser) => void;
  deleteUser: (user: IUser) => void;
  getRooms: () => Promise<IRoom[]>;
  getRoom: (id: number) => void;
  setCurrentRoom: (room: IRoom) => void;
  saveRoom: (room: IRoom) => void;
  clearRoom: (room: IRoom) => void;
  // getMessage: (id: number) => void;
  // getMessages: () => void;
  // saveMessage: (message: IMessage) => void;
  // deleteMessage: (message: IMessage) => void;
}

export type ModelUpdateFunction =
  | Partial<IAppModel>
  | ((model: Partial<IAppModel>) => Partial<IAppModel>);
export type UpdateStream = Stream<ModelUpdateFunction>;

const app = {
  initial: { ...appStateMgmt.initial, ...userService.initial },
  actions: (us: UpdateStream) =>
    ({ ...userService.actions(us), ...roomService.actions(us) } as IActions),
};

const update = Stream<ModelUpdateFunction>();
export const states = Stream.scan(merge, app.initial, update);
export const actions = app.actions(update);
