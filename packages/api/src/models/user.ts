import { ILokiObj } from './loki';

export interface IUser extends ILokiObj {
  username?: string;
  first?: string;
  last?: string;
  avatar?: string;
}
