import Head from "next/head";
import { useRouter } from "next/router";
import { Rubik, Karla } from "next/font/google";
import { ThemeToggle } from "@/components/themeToggle";
import { Button } from "@/components/button";
import { useAuth } from "@/contexts/authContext";
import { Input } from "@/components/input";
import { useState } from "react";

import styles from "../styles/index.module.css";

const rubik = Rubik({
	subsets: ["latin"],
	weight: ["400", "600"],
});

const karla = Karla({ subsets: ["latin"] });

export default function Index() {
	const router = useRouter();
	const auth = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const loginRedirection = () => {
		auth.signIn({ email, password }).then((response) => console.log(response));
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
