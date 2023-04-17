import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/themeContext";
import { AuthProvider } from "@/contexts/authContext";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<ThemeProvider>
				<Component {...pageProps} />
			</ThemeProvider>
		</AuthProvider>
	);
}
