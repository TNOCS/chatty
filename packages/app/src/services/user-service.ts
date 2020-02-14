import { IUser } from '../../../api/src';
import { chattyService } from '../app';
import { UpdateStream } from './meiosis';

export const userService = {
  initial: {
    users: {
      current: undefined as undefined | IUser,
      all: undefined as undefined | IUser[],
    },
  },
  actions: (us: UpdateStream) => {
    const getUsers = async () => {
      const users = await chattyService.getUsers();
      if (users) {
        const all = users.sort((a, b) => a.username && b.username ? a.username > b.username ? 1 : -1 : 0);
        us({ users: { all } });
        return all;
      }
      return [];
    };

    return {
      getUser: async (id: number) => {
        const current = await chattyService.getUser(id);
        if (current) {
          us({ users: { current } });
        }
      },
      getUsers,
      setCurrentUser: async (user: IUser) => {
        us({ users: { current: user } });
      },
      saveUser: async (user: IUser) => {
        const current = await chattyService.saveUser(user);
        if (current) {
          us({ users: { current } });
        }
        await getUsers();
      },
      deleteUser: async (user: IUser) => {
        await chattyService.deleteUser(user);
        us({ users: { current: undefined } });
        await getUsers();
      },
    };
  },
};
