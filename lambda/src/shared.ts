const BASE_URL = process.env.API_BASE_URL || 'http://localhost:19000';

export async function callApi(apiKey: string, path: string): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'X-API-Key': apiKey },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function callApiWithBody(
  apiKey: string,
  method: string,
  path: string,
  body: any,
): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
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

export function error(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  return { statusCode: 500, body: `Error: ${message}` };
}

export function formatCurrency(value: string | number): string {
  return Number(value).toLocaleString('vi-VN') + 'đ';
}
