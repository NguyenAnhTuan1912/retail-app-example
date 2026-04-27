import { callApi, success, error } from './shared';

interface Event {
  apiKey: string;
}

export const handler = async (event: Event) => {
  try {
    const user = await callApi(event.apiKey, '/me');

    const result = [
      `👤 Thông tin tài khoản:`,
      `Tên: ${user.fullName ?? user.username}`,
      `Email: ${user.email}`,
      `SĐT: ${user.phoneNumber ?? 'Chưa cập nhật'}`,
      `Vai trò: ${user.role}`,
      `User ID: ${user.id}`,
    ].join('\n');

    return success(result);
  } catch (e) {
    return error(e);
  }
};
