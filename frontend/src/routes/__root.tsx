import Header from "@/pages/homepage/components/header";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import type { AuthContextValue } from "@/context/auth-context/auth-context";

const RootLayout = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  return (
    <>
      <Header theme={theme} onThemeToggle={toggleTheme} />

      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
};

export const Route = createRootRouteWithContext<{
  auth: AuthContextValue | undefined;
}>()({
  component: RootLayout,
});
