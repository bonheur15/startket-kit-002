import RegisterForm from "./_components/register-form";
import { googleEnabled } from "@/lib/app-config";

export default function RegisterPage() {
  return <RegisterForm googleEnabled={googleEnabled} />;
}
