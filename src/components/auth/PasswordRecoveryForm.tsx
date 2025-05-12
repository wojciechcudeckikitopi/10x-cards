import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/useAuth";
import { passwordRecoverySchema } from "@/lib/validations/auth";
import type { PasswordRecoveryFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthForm } from "./AuthForm";

export function PasswordRecoveryForm() {
  const form = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(passwordRecoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const { requestPasswordRecovery, isLoading, error } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: PasswordRecoveryFormData) => {
    const success = await requestPasswordRecovery(data);
    if (success) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <AuthForm
        form={form}
        title="Check your email"
        description="We have sent you an email with instructions to reset your password."
        error={null}
        onSubmit={handleSubmit}
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
      form={form}
      title="Reset your password"
      description="Enter your email address and we will send you instructions to reset your password."
      error={error}
      onSubmit={handleSubmit}
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="you@example.com"
                data-testid="password-recovery-email-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading} data-testid="password-recovery-submit-button">
        {isLoading ? "Sending instructions..." : "Send instructions"}
      </Button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Remember your password?{" "}
        <a href="/auth/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
          Sign in
        </a>
      </p>
    </AuthForm>
  );
}
