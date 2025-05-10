import { useNavigate } from "@/lib/hooks/useNavigate";
import { ApiError, AuthService } from "@/lib/services/auth.service";
import type { LoginFormData, PasswordRecoveryFormData, PasswordResetFormData, RegisterFormData } from "@/types/auth";
import { useState } from "react";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred");
    }
  };

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.login(data);
      navigate("/dashboard");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.register(data);
      navigate("/dashboard");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordRecovery = async (data: PasswordRecoveryFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.requestPasswordRecovery(data);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, data: PasswordResetFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.resetPassword(token, data);
      navigate("/auth/login");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.logout();
      navigate("/auth/login");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    requestPasswordRecovery,
    resetPassword,
    logout,
    isLoading,
    error,
  };
}
