import { Rubik } from "next/font/google";
import { useAuth } from "@/contexts/authContext";
import { Bell } from "@phosphor-icons/react";
import { Avatar } from "@/components/avatar";

const rubik = Rubik({
	subsets: ["latin"],
	weight: ["300", "400", "600"],
});

import styles from "./styles.module.css";
import { ThemeToggle } from "@/components/themeToggle";
import { useTheme } from "@/contexts/themeContext";
import { usePathname } from "next/navigation";

export const Header = () => {
	const auth = useAuth();
	const theme = useTheme();
	const pathname = usePathname();

	return (
		<header
			className={`${styles.header} ${rubik.className}`}
			style={
				pathname === "/home" && theme.activeTheme === "light"
					? { backgroundColor: "#dadee3" }
					: { backgroundColor: "#232730" }
			}
		>
			<div className={styles.header__user}>
				<Avatar
					size={50}
					src={
						"https://images.unsplash.com/photo-1558788353-f76d92427f16?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1638&q=80"
					}
				/>
				<div className={styles.header__title}>
					<span>Welcome Back</span>
					<h3>{auth.user?.firstName}</h3>
				</div>
			</div>
			<div className={styles.header__menu}>
				<button>
					<Bell width={30} height={30} />
				</button>
				<ThemeToggle />
			</div>
		</header>
	);
};
