import { useEffect, useState } from "react";

import styles from "./styles.module.css";
import { useTheme } from "@/contexts/themeContext";

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
			{activeTheme === "light" ? <span>🌙</span> : <span>☀️</span>}
		</button>
	);
};
