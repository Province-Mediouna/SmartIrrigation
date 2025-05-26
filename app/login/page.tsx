import { Providers } from "../providers";
import LoginPage from "@/components/auth/login-page";

export default function Login() {
  return (
    <Providers>
      <LoginPage />
    </Providers>
  );
}
