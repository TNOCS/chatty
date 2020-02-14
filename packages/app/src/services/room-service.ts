import { IRoom } from '../../../api/src';
import { chattyService } from '../app';
import { UpdateStream } from './meiosis';

export const roomService = {
  initial: {
    rooms: {
      current: undefined as undefined | IRoom,
      all: undefined as undefined | IRoom[],
    },
  },
  actions: (us: UpdateStream) => {
    const getRooms = async () => {
      const rooms = await chattyService.getRooms();
      if (rooms) {
        const all = rooms.sort((a, b) => a.name && b.name ? a.name > b.name ? 1 : -1 : 0);
        us({ rooms: { all } });
        return all;
      }
      return [];
    };

    return {
      getRoom: async (id: number) => {
        const current = await chattyService.getRoom(id);
        if (current) {
          us({ rooms: { current } });
        }
      },
      getRooms,
      setCurrentRoom: async (current: IRoom) => {
        us({ rooms: { current } });
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
    };
  },
};
