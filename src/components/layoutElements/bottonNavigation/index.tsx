import { useRouter, usePathname } from "next/navigation";
import { Rubik } from "next/font/google";
import { ChartLine, CreditCard, House, User } from "@phosphor-icons/react";

import styles from "./styles.module.css";

const rubik = Rubik({
	subsets: ["latin"],
	weight: ["300"],
});
export const BottonNavigation = () => {
	const router = useRouter();
	const pathname = usePathname();
	return (
		<div className={`${styles.nav}`}>
			<button
				className={`
        ${styles.nav__button} 
        ${rubik.className}
        ${pathname === "/home" ? styles["nav__button--active"] : ""}
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
        ${pathname.includes("incomes") ? styles["nav__button--active"] : ""}
      `}
				onClick={() => router.push("/incomes")}
			>
				<CreditCard height={30} width={30} />
				Incomes
			</button>
			<button
				className={`
        ${styles.nav__button} 
        ${rubik.className}
        ${pathname.includes("expenses") ? styles["nav__button--active"] : ""}
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
        ${pathname === "/profile" ? styles["nav__button--active"] : ""}
      `}
				onClick={() => router.push("/profile")}
			>
				<User height={30} width={30} />
				Profile
			</button>
		</div>
	);
};
