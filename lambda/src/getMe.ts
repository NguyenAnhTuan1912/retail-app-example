import { callApi, successWithData, error } from './shared';

interface Event {
  user?: { userId: string };
}

export const handler = async (event: Event) => {
  try {
    const path = event.user?.userId ? `/users/${event.user.userId}` : '/me';
    const user = await callApi(path);

    const text = [
      `👤 Thông tin tài khoản:`,
      `Tên: ${user.fullName ?? user.username}`,
      `Email: ${user.email}`,
      `SĐT: ${user.phoneNumber ?? 'Chưa cập nhật'}`,
      `Vai trò: ${user.role}`,
      `User ID: ${user.id}`,
    ].join('\n');

    return successWithData(text, user);
  } catch (e) {
    return error(e);
  }
};
