import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return null;
}
