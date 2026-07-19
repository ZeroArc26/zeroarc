import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create Account."
      subtitle="Join ZEROARC and unlock premium anime streetwear made for true anime fans."
    >
      <SignupForm />
    </AuthLayout>
  );
}