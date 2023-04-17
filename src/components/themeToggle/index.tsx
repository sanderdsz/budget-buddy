import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "@/contexts/themeContext";

import styles from "./styles.module.css";

export const ThemeToggle = () => {
	const { activeTheme, setActiveTheme } = useTheme();

	const inactiveTheme = activeTheme === "light" ? "dark" : "light";

	/* Change the color inside body DOM */
	useEffect(() => {
		document.body.dataset.theme = activeTheme;
	}, [activeTheme]);

	return (
		<button
			className={styles["theme-toggle"]}
			onClick={() => setActiveTheme(inactiveTheme)}
		>
			{activeTheme === "light" ? (
				<Moon width={30} height={30} />
			) : (
				<Sun width={30} height={30} />
			)}
		</button>
	);
};
