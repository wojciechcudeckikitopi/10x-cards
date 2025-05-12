import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/useAuth";
import { useNavigate } from "@/lib/hooks/useNavigate";
import { useAuthStore } from "@/lib/stores/auth.store";
import { loginSchema } from "@/lib/validations/auth";
import type { LoginFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthForm } from "./AuthForm";

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { login, isLoading, error } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <AuthForm
      form={form}
      title="Sign In"
      description="Enter your credentials to access your account"
      error={error}
      onSubmit={login}
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter your email" data-testid="login-email-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input {...field} type="password" placeholder="Enter your password" data-testid="login-password-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading} data-testid="login-submit-button">
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
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
    </AuthForm>
  );
}
