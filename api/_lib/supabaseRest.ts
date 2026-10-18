const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supabaseRestHeaders(extra: Record<string, string> = {}) {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error(
      "Server Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_SECRET_KEY in the server environment."
    );
  }

  return {
    apikey: SUPABASE_SECRET_KEY,
    Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
    ...extra,
  };
}

export async function supabaseRest(path: string, init: RequestInit = {}) {
  const baseUrl = SUPABASE_URL?.replace(/\/$/, "");
  if (!baseUrl || !SUPABASE_SECRET_KEY) {
    throw new Error(
      "Server Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_SECRET_KEY in the server environment."
    );
  }

  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...supabaseRestHeaders(),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  const body = await response.text();
  if (!response.ok) {
    // Do not log request headers or secrets.
    throw new Error(`Supabase REST request failed (${response.status}): ${body.slice(0, 500)}`);
  }

  return body ? JSON.parse(body) : null;
}
