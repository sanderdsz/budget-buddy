import React from "react";
import { AuthProvider } from "@/contexts/authContext";
import { ThemeProvider } from "@/contexts/themeContext";

import "../styles/globals.css";
import OauthContext from "@/contexts/oauthContext";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<OauthContext>
					<AuthProvider>
						<ThemeProvider>{children}</ThemeProvider>
					</AuthProvider>
				</OauthContext>
			</body>
		</html>
	);
}
