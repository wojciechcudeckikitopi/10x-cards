import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@/lib/hooks/useNavigate";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useRef, useState } from "react";

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) {
      setError("Form submission error");
      return;
    }

    setError(null);
    setIsLoading(true);

    const formData = new FormData(formRef.current);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      // Successful login - redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
      data-testid="login-form"
    >
      <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Sign In</h1>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-900/50" data-testid="login-error">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            data-testid="login-email-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            data-testid="login-password-input"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading} data-testid="login-submit-button">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Create account
          </a>
        </p>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Forgot your password?{" "}
          <a href="/auth/password-recovery" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Reset password
          </a>
        </p>
      </form>
    </div>
  );
}
