import { Rubik } from "next/font/google";
import { useAuth } from "@/contexts/authContext";
import { Bell } from "@phosphor-icons/react";
import { Avatar } from "@/components/basicElements/avatar";
import { ThemeToggle } from "@/components/basicElements/themeToggle";
import { useTheme } from "@/contexts/themeContext";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./styles.module.css";

const rubik = Rubik({
	subsets: ["latin"],
	weight: ["300", "400", "600"],
});

export const Header = () => {
	const auth = useAuth();
	const { data: session }: any = useSession();
	const theme = useTheme();
	const accessToken = Cookies.get("budgetbuddy.accessToken");
	const provider = Cookies.get("budgetbuddy.provider");
	const [avatar, setAvatar] = useState("");
	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		responseType: "blob",
	};

	useEffect(() => {
		auth.verifyToken();
		auth.fetchUser();
		if (!provider) {
			fetchAvatar();
		}
	}, []);

	useEffect(() => {
		if (session && session.user && session.user.image !== undefined) {
			setAvatar(session.user.image);
		}
	}, [session]);

	const fetchAvatar = async () => {
		try {
			// @ts-ignore
			const response = await api.get("/users/avatar", config);
			const blob = new Blob([response.data], { type: "image/png" });
			const url = URL.createObjectURL(blob);
			setAvatar(url);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<header
			className={`${styles.header} ${rubik.className}`}
			style={
				theme.activeTheme === "light"
					? { backgroundColor: "#dadee3" }
					: { backgroundColor: "#232730" }
			}
		>
			<div className={styles.header__user}>
				{!avatar ? (
					<Skeleton
						circle
						baseColor={
							theme.activeTheme === "dark"
								? "var(--gray-02)"
								: "var(--white-05)"
						}
						highlightColor={
							theme.activeTheme === "dark"
								? "var(--gray-03)"
								: "var(--white-03)"
						}
						style={{
							width: 50,
							height: 50,
						}}
					/>
				) : (
					<Avatar size={50} src={avatar} />
				)}
				<div className={styles.header__title}>
					<span>Welcome Back</span>
					{auth.user?.firstName ? (
						<h3>{auth.user?.firstName}</h3>
					) : (
						<Skeleton
							baseColor={
								theme.activeTheme === "dark"
									? "var(--gray-02)"
									: "var(--white-05)"
							}
							highlightColor={
								theme.activeTheme === "dark"
									? "var(--gray-03)"
									: "var(--white-03)"
							}
						/>
					)}
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
