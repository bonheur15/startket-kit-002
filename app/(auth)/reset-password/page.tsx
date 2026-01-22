import ResetPasswordForm from "./_components/reset-password-form";

type SearchParams = {
  token?: string;
  error?: string;
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const token = searchParams?.token || "";
  const error =
    searchParams?.error || (!token ? "missing_token" : undefined);

  return <ResetPasswordForm token={token} error={error} />;
}
