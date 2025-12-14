import { redirect } from "@tanstack/react-router";
import type { AuthContextValue } from "@/context/auth-context/auth-context";

type AuthContext = { auth: AuthContextValue | undefined };

export default async function requireAuth({
  context,
}: {
  context: AuthContext;
}) {
  const auth = context.auth;
  if (!auth) {
    throw redirect({ to: "/" });
  }

  const result = await auth.refetchUserData();
  const isLoggedIn = !!result.data?.user?._id;

  if (!isLoggedIn) {
    throw redirect({ to: "/" }); // or "/login"
  }
}
