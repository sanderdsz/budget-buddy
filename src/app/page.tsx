"use client";

import Head from "next/head";
import {useEffect, useState} from "react";
import { Rubik, Karla } from "next/font/google";
import { ThemeToggle } from "@/components/basicElements/themeToggle";
import { Button } from "@/components/basicElements/button";
import { useAuth } from "@/contexts/authContext";
import { Input } from "@/components/basicElements/input";
import { signIn, useSession } from "next-auth/react"
import { SocialLoginButton } from "@/components/basicElements/socialLoginButton";
import { PasswordInput } from "@/components/basicElements/passwordInput";

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
	const [isLoading, setIsLoading] = useState(false);
	const { data: session }: any = useSession();

	const loginRedirection = () => {
		setIsLoading(true);
		auth.signIn({ email, password }).then((response) => {
			if (response.status !== 200) {
				setMessage(response.message);
				setClassname(`form__message--activated`);
				setIsLoading(false);
			} else {
				setMessage(" ");
				setClassname(`form__message--deactivated`);
			}
		});
	};

	const googleLogin = () => {
		signIn("google")
	}

	useEffect(() => {
		if (session && session.user.email) {
			auth.sessionCookies(session);
		}
	}, [session]);

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
										type={"email"}
										placeholder="e-mail"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={isLoading}
									/>
								</div>
								<div>
									<PasswordInput
										placeholder="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										disabled={isLoading}
									/>
								</div>
								<div className={`${styles[`form__message-container`]}`}>
									<span
										className={`
                    ${styles[classname]}
                    ${styles[`form__message`]}
                    ${rubik.className}
                  `}
									>
										{message}
									</span>
								</div>
							</div>
							<div className={styles.form__buttons}>
								<Button
									label="sign in"
									colour="primary"
									onClick={() => loginRedirection()}
									isLoading={isLoading}
									height={2}
								/>
								<Button
									label="sign up"
									colour="outline"
									disabled={true}
									height={2}
								/>
							</div>
							<div className={styles[`social-login__container`]}>
								<SocialLoginButton
									provider="Google"
									onClick={() => googleLogin()}
								/>
								{/*
								<SocialLoginButton
									provider="Github"
									onClick={() => signIn("github")}
								/>
								*/}
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
