import LoginForm from "./_components/login-form";

type SearchParams = {
  verified?: string;
  reset?: string;
  signup?: string;
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const statusMessage =
    searchParams?.verified === "1"
      ? "Email verified. You can sign in now."
      : searchParams?.reset === "1"
        ? "Password updated. Sign in with your new password."
        : searchParams?.signup === "1"
          ? "Account created. Check your email to verify."
          : undefined;

  return <LoginForm statusMessage={statusMessage} />;
}
