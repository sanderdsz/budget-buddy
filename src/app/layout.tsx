import React from "react";
import {AuthProvider} from "@/contexts/authContext";
import {ThemeProvider} from "@/contexts/themeContext";

import "../styles/globals.css"

export default function RootLayout(
  {children}: {children: React.ReactNode}
) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}