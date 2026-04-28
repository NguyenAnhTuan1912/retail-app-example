const BASE_URL = process.env.API_BASE_URL || 'http://localhost:19000';
const API_KEY = process.env.API_KEY;

export async function callApi(path: string): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'X-API-Key': API_KEY! },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function callApiWithBody(
  method: string,
  path: string,
  body: any,
): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'X-API-Key': API_KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export function success(body: string) {
  return { statusCode: 200, body };
}

export function successWithData(text: string, data: any) {
  return { statusCode: 200, body: JSON.stringify({ text, data }) };
}

export function error(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  return { statusCode: 500, body: `Error: ${message}` };
}

export function formatCurrency(value: string | number): string {
  return Number(value).toLocaleString('vi-VN') + 'đ';
}
