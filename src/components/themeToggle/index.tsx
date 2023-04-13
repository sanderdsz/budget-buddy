import { useEffect, useState } from "react";

import styles from "./styles.module.css";

export const ThemeToggle = () => {
	const [activeTheme, setActiveTheme] = useState("light");
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
