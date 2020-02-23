import { IUser } from '../../../api/src';
import { chattyService } from '../app';
import { UpdateStream } from './meiosis';

export interface IUserState {
  users: {
    /** Currently active user */
    current?: IUser;
    /** All users */
    all?: IUser[];
  };
}

export interface IUserService {
  getUsers: () => void;
  getUser: (id: number) => void;
  setCurrentUser: (user: IUser) => void;
  saveUser: (user: IUser) => void;
  deleteUser: (user: IUser) => void;
}

export const userService = {
  initial: {
    users: {
      current: undefined as undefined | IUser,
      all: undefined as undefined | IUser[],
    },
  } as IUserState,
  actions: (us: UpdateStream) => {
    const getUsers = async () => {
      const users = await chattyService.getUsers();
      if (users) {
        const all = users.sort((a, b) => a.username && b.username ? a.username > b.username ? 1 : -1 : 0);
        us({ users: { all } });
      }
    };

    return {
      getUser: async (id: number) => {
        const current = await chattyService.getUser(id);
        if (current) {
          us({ users: { current } });
        }
      },
      getUsers,
      setCurrentUser: (user: IUser) => {
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
    } as IUserService;
  },
};
