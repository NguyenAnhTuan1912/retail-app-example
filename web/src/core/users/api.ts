import { request } from '../api';
import type { TUser } from './model';

export const usersApi = {
  me: () => request<TUser>('/me'),
};
