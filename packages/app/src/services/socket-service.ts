import io from 'socket.io-client';
import { IGame } from '../../../common/src';

const SocketService = () => {
  const socket = io(process.env.SERVER);
  socket.on('connect', () => {
    console.log('Socket.io - connected');
  });
  socket.on('games', (data: IGame) => console.table(data));
  return socket;
};

export const socketSvc = SocketService();
