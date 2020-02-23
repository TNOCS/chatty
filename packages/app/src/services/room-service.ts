import { IMessage, IRoom } from '../../../api/src';
import { chattyService } from '../app';
import { IAppModel, UpdateStream } from './meiosis';

export interface IRoomState {
  rooms: {
    /** Message you are currently editing */
    message?: IMessage,
    /** Currently active room */
    current?: IRoom;
    /** All rooms */
    all?: IRoom[];
    /** Rooms of the current user */
    user?: IRoom[];
  };
}

export interface IRoomService {
  getRooms: () => void;
  getRoomsOfCurrentUser: () => void;
  getRoom: (id: number) => void;
  setCurrentRoom: (room: IRoom) => void;
  saveRoom: (room: IRoom) => void;
  clearRoom: (room: IRoom) => void;
  getMessages: (currentRoom: IRoom) => void;
  /** Save message in the current room */
  saveMessage: (room: IRoom, message: IMessage) => void;
  /** Delete message in the current room */
  deleteMessage: (room: IRoom, message: IMessage) => void;
  /** Update current message */
  updateMessage: (message: IMessage) => void;
}

export const roomService = {
  initial: {
    rooms: {
      message: undefined as undefined | IMessage,
      /** Currently active room */
      current: undefined as undefined | IRoom,
      /** All rooms */
      all: undefined as undefined | IRoom[],
      /** Rooms of the current user */
      user: undefined as undefined | IRoom[],
    },
  } as IRoomState,
  actions: (us: UpdateStream) => {

    const getRooms = async () => {
      const rooms = await chattyService.getRooms();
      if (rooms) {
        const all = rooms.sort((a, b) => a.name && b.name ? a.name > b.name ? 1 : -1 : 0);
        us({ rooms: { all } });
      }
    };

    const getRoomsOfCurrentUser = async () => {
      const state = us() as Partial<IAppModel>;
      const user = state?.users?.current;
      if (user && user.$loki) {
        const rooms = await chattyService.getRoomsOfUser(user.$loki);
        console.log(rooms);
        if (rooms) {
          us({ rooms: { user: rooms }});
        }
      }
    };

    const getMessages = async (currentRoom: IRoom) => {
      if (currentRoom) {
        const msgs = await chattyService.getMessages(currentRoom.name) || [];
        currentRoom.messages = msgs;
        us({ rooms: { current: currentRoom } });
      }
    };

    return {
      getRoom: async (id: number) => {
        const current = await chattyService.getRoom(id);
        if (current) {
          us({ rooms: { current } });
          await getMessages(current);
        }
      },
      getRooms,
      getRoomsOfCurrentUser,
      setCurrentRoom: async (current: IRoom) => {
        us({ rooms: { current } });
        await getMessages(current);
      },
      saveRoom: async (room: IRoom) => {
        const current = await chattyService.saveRoom(room);
        if (current) {
          us({ rooms: { current } });
        }
        await getRooms();
      },
      clearRoom: async (room: IRoom) => {
        await chattyService.clearRoom(room.name);
        us({ rooms: { current: undefined } });
        await getRooms();
      },
      updateMessage: async (msg: IMessage) => us({ rooms: { message: msg }}),
      /** Get the messages in the current room */
      getMessages,
      saveMessage: async (current: IRoom, msg: IMessage) => {
        if (current) {
          const savedMsg = await chattyService.saveMessage(current.name, msg);
          if (typeof current.messages === 'undefined') {
            current.messages = [];
          }
          if (savedMsg) {
            current.messages = [savedMsg, ...current.messages];
          }
          us({ rooms: { current, message: undefined } });
        }
      },
      deleteMessage: async (room: IRoom, msg: IMessage) => {
        if (room) {
          const isDeleted = await chattyService.deleteMessage(room.name, msg);
          if (isDeleted) {
            room.messages = room.messages.filter(m => m.$loki !== msg.$loki);
          }
          us({ rooms: { current: room } });
        }
      },
    } as IRoomService;
  },
};
