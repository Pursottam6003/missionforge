export interface UserSession {
  id: string;
  login: string;
  name?: string;
  avatar_url?: string;
}

export async function signSession(payload: UserSession, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const dataStr = btoa(JSON.stringify(payload));
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(dataStr));
  const sigStr = btoa(String.fromCharCode(...new Uint8Array(sigBuf)));
  return `${dataStr}.${sigStr}`;
}

export async function verifySession(token: string, secret: string): Promise<UserSession | null> {
  try {
    const [dataStr, sigStr] = token.split('.');
    if (!dataStr || !sigStr) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBuf = Uint8Array.from(atob(sigStr), (c) => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(dataStr));
    if (!isValid) return null;

    return JSON.parse(atob(dataStr)) as UserSession;
  } catch {
    return null;
  }
}

export function parseCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}