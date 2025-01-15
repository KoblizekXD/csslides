import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <main className="h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] md:flex flex-col md:justify-center md:items-center">
      <SignupForm />
    </main>
  );
}
