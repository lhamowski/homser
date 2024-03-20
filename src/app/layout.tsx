import type { Metadata } from "next";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import darkTheme from "@/ui/Themes/darkTheme";
import SessionProvider from "@/app/login/SessionProvider";

export const metadata: Metadata = {
  title: "Home Server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <AppRouterCacheProvider>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              <SessionProvider>{children}</SessionProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
      </body>
    </html>
  );
}
