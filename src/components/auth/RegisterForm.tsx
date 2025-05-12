import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/useAuth";
import { useNavigate } from "@/lib/hooks/useNavigate";
import { useAuthStore } from "@/lib/stores/auth.store";
import { registerSchema } from "@/lib/validations/auth";
import type { RegisterFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthForm } from "./AuthForm";

export function RegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { register, isLoading, error } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <AuthForm
      form={form}
      title="Create an account"
      description="Enter your email and create a password to get started"
      error={error}
      onSubmit={register}
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="you@example.com" data-testid="register-email-input" />
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
              <Input {...field} type="password" placeholder="Min. 8 characters" data-testid="register-password-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                placeholder="Re-enter your password"
                data-testid="register-confirm-password-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading} data-testid="register-submit-button">
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
          Sign in
        </a>
      </p>
    </AuthForm>
  );
}
