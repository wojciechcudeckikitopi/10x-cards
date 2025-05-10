export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  confirmPassword: string;
}

export interface PasswordRecoveryFormData {
  email: string;
}

export interface PasswordResetFormData {
  password: string;
  confirmPassword: string;
}

export interface AuthFormProps {
  onSubmit: (
    data: LoginFormData | RegisterFormData | PasswordRecoveryFormData | PasswordResetFormData
  ) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}
