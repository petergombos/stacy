import { Header } from "@/components/header";
import { SignUpForm } from "@/components/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto px-4 py-6 my-12">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
