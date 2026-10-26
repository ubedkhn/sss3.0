import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import styles from "./reset-password.module.css";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || "https://ebanvmpflysobdhtjwme.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    const tokenType = hash.get("type");
    if (!accessToken || tokenType !== "recovery") {
      setError("This recovery link is missing or expired. Request a new password recovery email.");
      return;
    }
    if (!SUPABASE_KEY) {
      setError("Password reset is not configured for this deployment. Please contact the site administrator.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, {
        method: "PUT",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const raw = await response.text();
      let data: any = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch { /* handled below */ }
      if (!response.ok) throw new Error(data.msg || data.message || data.error_description || "Could not update the password. Request a fresh recovery email and try again.");
      window.history.replaceState(null, "", window.location.pathname);
      setMessage("Your password has been updated. You can now sign in to the studio admin.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className={styles.page}>
      <Helmet>
        <title>Reset Admin Password | Shri Sawariya Seth Interior Designs</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Helmet>
      <section className={styles.card}>
        <Link className={styles.back} to="/login">← Back to sign in</Link>
        <p className={styles.eyebrow}>PRIVATE STUDIO ACCESS</p>
        <h1>Set a new password</h1>
        <p className={styles.intro}>Choose a new password for your studio administrator account.</p>
        <form onSubmit={updatePassword} className={styles.form}>
          <label htmlFor="new-password">New password</label>
          <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} />
          <label htmlFor="confirm-password">Confirm new password</label>
          <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={busy} />
          {error && <p role="alert" className={styles.error}>{error}</p>}
          {message && <p role="status" className={styles.success}>{message}</p>}
          <button type="submit" disabled={busy}>{busy ? "Updating password…" : "Update password"}</button>
        </form>
        {message && <Link className={styles.signin} to="/login">Go to admin sign in</Link>}
      </section>
    </main>
  );
}
