import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AuthForm } from "./AuthForm";

export function PasswordRecoveryForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/password-recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send password reset email");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while sending the reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthForm
        title="Check your email"
        description="We have sent you an email with instructions to reset your password."
        error={null}
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Did not receive the email? Check your spam folder or try again.
          </p>
          <Button variant="secondary" className="w-full" onClick={() => setIsSuccess(false)}>
            Try again
          </Button>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Reset your password"
      description="Enter your email address and we will send you instructions to reset your password."
      error={error}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending instructions..." : "Send instructions"}
        </Button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <a href="/auth/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Sign in
          </a>
        </p>
      </form>
    </AuthForm>
  );
}
