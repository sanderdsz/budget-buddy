'use client'

import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

type ThemeContextData = {
	activeTheme: string;
	setActiveTheme: Dispatch<SetStateAction<string>>;
};

type ThemeContextProps = {
	children: ReactNode;
};

const ThemeContext = createContext({} as ThemeContextData);
export const ThemeProvider = ({ children }: ThemeContextProps) => {
	const [activeTheme, setActiveTheme] = useState("light");

	/* Verify system wide user's color preference */
	useEffect(() => {
		const themeMediaQuery = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		if (themeMediaQuery) {
			setActiveTheme("dark");
		} else {
			setActiveTheme("light");
		}
	}, []);

	return (
		<ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	return useContext(ThemeContext);
};
