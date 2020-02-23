import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { IRoomService, IRoomState, roomService } from './room-service';
import { IUserService, IUserState, userService } from './user-service';

interface IAppState {
  app: {
    isSearching?: boolean;
    searchQuery?: string;
  };
}

export interface IAppModel extends IAppState, IUserState, IRoomState {}

export type ModelUpdateFunction =
  | Partial<IAppModel>
  | ((model: Partial<IAppModel>) => Partial<IAppModel>)
  | ((model: Partial<IAppModel>) => Promise<Partial<IAppModel>>);
export type UpdateStream = Stream<ModelUpdateFunction>;

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

export interface IActions extends IUserService, IRoomService {}

const app = {
  initial: { ...appStateMgmt.initial, ...userService.initial, ...roomService.initial } as IAppModel,
  actions: (us: UpdateStream) =>
    ({ ...userService.actions(us), ...roomService.actions(us) } as IActions),
};

const update = Stream<ModelUpdateFunction>() as UpdateStream;
export const states = Stream.scan(merge as any, app.initial, update);
export const actions = app.actions(update);
