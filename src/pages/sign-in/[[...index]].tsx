// src/pages/sign-in/[[...index]].tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn routing="path" path="/sign-in" />;
}
