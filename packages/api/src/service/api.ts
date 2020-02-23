import { IMessage, IRequestConfig, IRoom } from '../models';
import { IUser } from '../models/user';

export const init = (baseUrl: string, request: <T>(options: IRequestConfig) => Promise<T>) => {
  /** Create a new room */
  const createRoom = async (room: IRoom) => {
    return await request<IRoom>({
      method: 'POST',
      url: `${baseUrl}/rooms`,
      body: room,
    }).catch(console.error);
  };
  /** Update an existing room */
  const updateRoom = async (room: IRoom) => {
    if (typeof room.$loki === 'undefined') {
      return;
    }
    return await request<IRoom>({
      method: 'PUT',
      url: `${baseUrl}/rooms/${room.$loki}`,
      body: room,
    }).catch(console.error);
  };
  /** Create a new message */
  const createMessage = async (roomName: string, message: IMessage) => {
    return await request<IMessage>({
      method: 'POST',
      url: `${baseUrl}/${roomName}`,
      body: message,
    }).catch(console.error);
  };
  /** Update an existing message */
  const updateMessage = async (roomName: string, message: IMessage) => {
    if (typeof message.$loki === 'undefined') {
      return;
    }
    return await request<IMessage>({
      method: 'PUT',
      url: `${baseUrl}/${roomName}/${message.$loki}`,
      body: message,
    }).catch(console.error);
  };
  /** Update an existing message */
  const updateUser = async (user: IUser) => {
    if (typeof user.$loki === 'undefined') {
      return;
    }
    return await request<IUser>({
      method: 'PUT',
      url: `${baseUrl}/users/${user.$loki}`,
      body: user,
    }).catch(console.error);
  };
  /** Create a new user */
  const createUser = async (user: IUser) => {
    return await request<IUser>({
      method: 'POST',
      url: `${baseUrl}/users`,
      body: user,
    }).catch(console.error);
  };
  /** Update an existing room */
  return {
    /** Get all existing users */
    getUsers: async () => {
      return await request<IUser[]>({
        method: 'GET',
        url: `${baseUrl}/users`,
      }).catch(console.error);
    },
    /** Save (update or create) a user */
    saveUser: async (user: IUser) => (typeof user.$loki === 'undefined' ? createUser(user) : updateUser(user)),
    /** Get a user */
    getUser: async (user: number | IUser) => {
      const id = typeof user === 'number' ? user : user.$loki;
      if (!id) {
        return;
      }
      return await request<IUser>({
        method: 'GET',
        url: `${baseUrl}/users/${id}`,
      }).catch(console.error);
    },
    /** Delete a user */
    deleteUser: async (user: number | IUser) => {
      const id = typeof user === 'number' ? user : user.$loki;
      if (!id) {
        return;
      }
      return await request<boolean>({
        method: 'DELETE',
        url: `${baseUrl}/users/${id}`,
      }).catch(console.error);
    },
    /** Create or update a room */
    saveRoom: async (room: IRoom) => {
      if (
        !room.name ||
        /users/i.test(room.name) ||
        /rooms/i.test(room.name) ||
        /collections/i.test(room.name) ||
        /env/i.test(room.name)
      ) {
        console.error('Room name must be supplied, and cannot be users, rooms, collections or env.');
        return false;
      }
      return typeof room.$loki === 'undefined' ? createRoom(room) : updateRoom(room);
    },
    /** Get room info (users and name of room) */
    getRoom: async (roomId: number) => {
      const id = +roomId;
      if (isNaN(id)) {
        return console.error(`roomId is not a number: ${roomId}`);
      }
      return await request<IRoom>({
        method: 'GET',
        url: `${baseUrl}/rooms/${id}`,
      }).catch(console.error);
    },
    /** Clear a room, removing all messages and indices permanently */
    clearRoom: async (roomName: string) => {
      return await request<IRoom>({
        method: 'DELETE',
        url: `${baseUrl}/${roomName}`,
      }).catch(console.error);
    },
    /** Get all existing rooms */
    getRooms: async () => {
      return await request<IRoom[]>({
        method: 'GET',
        url: `${baseUrl}/rooms`,
      }).catch(console.error);
    },
    /** Get all rooms of a user */
    getRoomsOfUser: async (userId: number) => {
      const id = +userId;
      if (isNaN(id)) {
        return console.error(`userId is not a number: ${userId}`);
      }
      return await request<IRoom[]>({
        method: 'GET',
        url: `${baseUrl}/rooms`,
        params: { q: `{"userIds":{"$contains":${id}}}` },
      }).catch(console.error);
    },
    /**
     * Get all messages in a room.
     * By default, retrieves the last 10 messages. Otherwise, specify from and to,
     * where negative values count from the end of the collection.
     * E.g. from 0 to -10 gets the last 10 messages.
     */
    getMessages: async (roomName: string /**, from = 0, to = -10 */) => {
      return await request<IMessage[]>({
        method: 'GET',
        // url: `${baseUrl}/${roomName}?from=${from}&to=${to}`,
        url: `${baseUrl}/${roomName}`,
      }).catch(console.error);
    },
    /** Save (update or create) a message */
    saveMessage: async (roomName: string, message: IMessage) =>
      typeof message.$loki === 'undefined' ? createMessage(roomName, message) : updateMessage(roomName, message),
    /** Get a message */
    getMessage: async (roomName: string, message: number | IMessage) => {
      const id = typeof message === 'number' ? message : message.$loki;
      if (!id) {
        return;
      }
      return await request<IMessage>({
        method: 'GET',
        url: `${baseUrl}/${roomName}/${id}`,
      }).catch(console.error);
    },
    /** Delete a message */
    deleteMessage: async (roomName: string, message: number | IMessage) => {
      const id = typeof message === 'number' ? message : message.$loki;
      if (!id) {
        return;
      }
      return await request<boolean>({
        method: 'DELETE',
        url: `${baseUrl}/${roomName}/${id}`,
      }).catch(console.error);
    },
  };
};
