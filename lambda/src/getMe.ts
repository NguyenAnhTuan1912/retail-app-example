import { callApi, success, error } from './shared';

export const handler = async () => {
  try {
    const user = await callApi('/me');

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
