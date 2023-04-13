import Head from "next/head";
import { Rubik, Karla } from "next/font/google";
import { ThemeToggle } from "@/components/themeToggle";
import { Button } from "@/components/button";

import styles from "../styles/index.module.css";
import { useTheme } from "@/contexts/themeContext";
import { useEffect } from "react";

const rubik = Rubik({
	subsets: ["latin"],
	weight: ["400", "600"],
});

const karla = Karla({ subsets: ["latin"] });

export default function Index() {
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
					<span className={karla.className}>Choose your user</span>
					<div>
						<Button label="Sabrina" />
						<Button label="Sander" />
					</div>
				</section>
			</main>
		</>
	);
}
