import type {
  AuthResponse,
  LoginFormData,
  PasswordRecoveryFormData,
  PasswordResetFormData,
  RegisterFormData,
} from "@/types/auth";

class ApiError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || "An error occurred", data.code);
    }

    return data;
  }

  static async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  static async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  static async requestPasswordRecovery(data: PasswordRecoveryFormData): Promise<void> {
    const response = await fetch("/api/auth/password-recovery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return this.handleResponse<void>(response);
  }

  static async resetPassword(token: string, data: PasswordResetFormData): Promise<void> {
    const response = await fetch(`/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return this.handleResponse<void>(response);
  }

  static async logout(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    return this.handleResponse<void>(response);
  }
}

export { ApiError };
