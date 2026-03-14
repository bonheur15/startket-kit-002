import RegisterForm from "./_components/register-form";
import { isGoogleEnabled } from "@/lib/app-config";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return <RegisterForm googleEnabled={isGoogleEnabled()} />;
}
