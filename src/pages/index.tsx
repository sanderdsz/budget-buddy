import Head from "next/head";
import { useRouter } from "next/router";
import { Rubik, Karla } from "next/font/google";
import { ThemeToggle } from "@/components/themeToggle";
import { Button } from "@/components/button";

import styles from "../styles/index.module.css";

const rubik = Rubik({
	subsets: ["latin"],
	weight: ["400", "600"],
});

const karla = Karla({ subsets: ["latin"] });

export default function Index() {
	const router = useRouter();
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
					<div className={styles.users}>
						<Button
							label="Sabrina"
							color="primary"
							onClick={() => router.push("/home")}
						/>
						<Button
							label="Sander"
							color="outline"
							onClick={() => router.push("/home")}
						/>
					</div>
				</section>
			</main>
		</>
	);
}
