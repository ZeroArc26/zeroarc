import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset Your Password."
      subtitle="No worries — enter your email and we'll send you a link to get back into your account."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}