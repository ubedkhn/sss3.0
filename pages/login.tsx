import { Helmet } from "react-helmet";
import { PasswordLoginForm } from "../components/PasswordLoginForm";
import styles from "./login.module.css";

export default function Login() {
  return (
    <main className={styles.page}>
      <Helmet>
        <title>Admin Sign In | Shri Sawariya Seth Interior Designs</title>
        <meta
          name="description"
          content="Secure administrator sign in for Shri Sawariya Seth Interior Designs."
        />
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Helmet>

      <section className={styles.card} aria-labelledby="login-title">
        <a className={styles.back} href="/">← View website</a>
        <p className={styles.eyebrow}>PRIVATE STUDIO ACCESS</p>
        <h1 id="login-title">Studio Admin</h1>
        <p className={styles.intro}>
          Sign in to manage enquiries, portfolio projects, reviews and journal
          content.
        </p>
        <PasswordLoginForm redirectTo="/admin" />
        <p className={styles.security}>
          Protected by server-side role authorization, secure sessions and
          login rate limiting.
        </p>
      </section>
    </main>
  );
}