import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <AuthLayout
      title="Almost There."
      subtitle="Choose a new password to secure your ZeroArc account."
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}