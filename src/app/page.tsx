'use client'

import Head from "next/head";
import { useState } from "react";
import { Rubik, Karla } from "next/font/google";
import { ThemeToggle } from "@/components/themeToggle";
import { Button } from "@/components/button";
import { useAuth } from "@/contexts/authContext";
import { Input } from "@/components/input";

import styles from "../styles/index.module.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "600"],
});
const karla = Karla({ subsets: ["latin"] });

export default function Index() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [classname, setClassname] = useState("");

  const loginRedirection = () => {
    auth.signIn({ email, password }).then(
      (response) => {
        if (response.status !== 200) {
          setMessage(response.message);
          setClassname(`form__message--activated`);
        } else {
          setMessage(" ");
          setClassname(`form__message--deactivated`);
        }
      }
    );
  };

  return (
    <>
      <Head>
        <title>Budget Buddy</title>
      </Head>
      <main className={styles.main}>
        <header className={`${styles.header} ${rubik.className}`}>
          <div>
            <span className={styles[`header__title`]}>Budget</span>{" "}
            <span>Buddy</span>
          </div>
          <ThemeToggle />
        </header>
        <section className={styles.section}>
          <div className={styles[`sign-in`]}>
            <h2 className={rubik.className}>Welcome back!</h2>
            <h3 className={karla.className}>Sign in to continue.</h3>
            <span className={karla.className}>
							Please enter your e-mail below.
						</span>
            <div className={styles.form}>
              <div className={styles.form__input}>
                <div>
                  <Input
                    placeholder="e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className={`${styles[`form__message-container`]}`}>
                  <span className={`
                    ${styles[classname]}
                    ${styles[`form__message`]}
                    ${rubik.className}
                  `}>
                    { message }
                  </span>
                </div>
              </div>
              <div className={styles.form__buttons}>
                <Button
                  label="sign in"
                  color="primary"
                  onClick={() => loginRedirection()}
                />
                <Button label="sign up" color="outline" onClick={() => null} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
