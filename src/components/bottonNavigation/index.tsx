import { useRouter } from "next/router";
import { Rubik } from "next/font/google";
import { ChartLine, CreditCard, House, User } from "@phosphor-icons/react";

import styles from "./styles.module.css";

const rubik = Rubik({
	subsets: ["latin"],
});
export const BottonNavigation = () => {
	const router = useRouter();
	return (
		<div className={`${styles.nav}`}>
			<button
				className={`
        ${styles.nav__button} 
        ${rubik.className}
        ${router.asPath === "/home" ? styles["nav__button--active"] : ""}
      `}
				onClick={() => router.push("/home")}
			>
				<House height={30} width={30} />
				Home
			</button>
			<button
				className={`
        ${styles.nav__button} 
        ${rubik.className}
        ${router.asPath === "/bank" ? styles["nav__button--active"] : ""}
      `}
				onClick={() => router.push("/bank")}
			>
				<CreditCard height={30} width={30} />
				Bank
			</button>
			<button
				className={`
        ${styles.nav__button} 
        ${rubik.className}
        ${router.asPath === "/expenses" ? styles["nav__button--active"] : ""}
      `}
				onClick={() => router.push("/expenses")}
			>
				<ChartLine height={30} width={30} />
				Expenses
			</button>
			<button
				className={`
        ${styles.nav__button} 
        ${rubik.className}
        ${router.asPath === "/profile" ? styles["nav__button--active"] : ""}
      `}
				onClick={() => router.push("/profile")}
			>
				<User height={30} width={30} />
				Profile
			</button>
		</div>
	);
};
