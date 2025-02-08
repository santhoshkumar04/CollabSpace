import AuthWrapper from "@/components/auth/auth-wrapper";
import SignUpForm from "@/components/auth/signup-form";

export default function SignUp() {
  return (
    <AuthWrapper>
      <SignUpForm />
    </AuthWrapper>
  );
}
