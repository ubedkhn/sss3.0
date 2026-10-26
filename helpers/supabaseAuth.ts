const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const SESSION_KEY = "sss_supabase_session";

export type StudioUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: "admin" | "user";
};

type StoredSession = { access_token: string; refresh_token?: string; expires_at?: number; user?: { id: string; email?: string; user_metadata?: Record<string, unknown> } };

function config() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase login configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for the Preview deployment.");
  return { url: SUPABASE_URL.replace(/\/$/, ""), key: SUPABASE_KEY };
}
export function readSession(): StoredSession | null {
  try { const raw = localStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) as StoredSession : null; } catch { return null; }
}
function saveSession(value: StoredSession | null) {
  if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value)); else localStorage.removeItem(SESSION_KEY);
}
async function requestJson(url: string, init: RequestInit, fallback: string) {
  const response = await fetch(url, init);
  const raw = await response.text();
  let data: any = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`Supabase returned an invalid response (HTTP ${response.status}). Check the deployed API/configuration.`); }
  if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || fallback);
  return data;
}
export async function signIn(email: string, password: string): Promise<StudioUser> {
  const { url, key } = config();
  const session = await requestJson(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify({ email, password })
  }, "Login failed. Check your email and password.");
  if (!session.access_token || !session.user?.id) throw new Error("Supabase login succeeded without a usable session.");
  saveSession(session as StoredSession);
  try { return await getCurrentUser(); } catch (error) { saveSession(null); throw error; }
}
export async function getCurrentUser(): Promise<StudioUser> {
  const { url, key } = config();
  const session = readSession();
  if (!session?.access_token) throw new Error("You are signed out.");
  const user = await requestJson(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${session.access_token}` } }, "Your session expired. Please log in again.");
  const profiles = await requestJson(`${url}/rest/v1/profiles?select=id,display_name,role&id=eq.${encodeURIComponent(user.id)}&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${session.access_token}` }
  }, "Could not verify your studio role. Check the profiles table RLS policy.");
  const profile = Array.isArray(profiles) ? profiles[0] : null;
  if (!profile) throw new Error("Your profile is missing. Ask the administrator to create your profile.");
  return { id: String(user.id), email: user.email || "", displayName: profile.display_name || user.user_metadata?.display_name || "", avatarUrl: null, role: profile.role === "admin" ? "admin" : "user" };
}
export async function signOut() {
  const { url, key } = config();
  const session = readSession();
  try { if (session?.access_token) await fetch(`${url}/auth/v1/logout`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${session.access_token}` } }); }
  finally { saveSession(null); }
}
