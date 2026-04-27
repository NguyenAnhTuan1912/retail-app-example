import { useUser } from "./users/state";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const userState = useUser.getState();
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "X-API-Key": userState.apiKey, ...init?.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export function mutate<T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<T> {
  return request<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}
