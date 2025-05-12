import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/useAuth";
import { passwordResetSchema } from "@/lib/validations/auth";
import type { PasswordResetFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthForm } from "./AuthForm";

interface PasswordResetFormProps {
  token: string;
}

export function PasswordResetForm({ token }: PasswordResetFormProps) {
  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { resetPassword, isLoading, error } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: PasswordResetFormData) => {
    await resetPassword(token, data);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <AuthForm
        form={form}
        title="Password reset successful"
        description="Your password has been reset successfully. You can now sign in with your new password."
        error={null}
        onSubmit={handleSubmit}
      >
        <a href="/auth/login" className="block">
          <Button className="w-full">Sign in</Button>
        </a>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      form={form}
      title="Reset your password"
      description="Enter your new password below."
      error={error}
      onSubmit={handleSubmit}
    >
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                placeholder="Min. 8 characters"
                data-testid="password-reset-password-input"
              />
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
            <FormLabel>Confirm New Password</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                placeholder="Re-enter your new password"
                data-testid="password-reset-confirm-password-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading} data-testid="password-reset-submit-button">
        {isLoading ? "Resetting password..." : "Reset password"}
      </Button>
    </AuthForm>
  );
}
