import { Suspense } from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back."
      subtitle="Sign in to access your profile, orders, wishlist and enjoy the complete ZEROARC experience."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}