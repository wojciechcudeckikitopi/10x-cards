import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Form } from "@/components/ui/Form";
import type { FieldValues, UseFormReturn } from "react-hook-form";

interface AuthFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  title: string;
  description: string;
  error?: string | null;
  onSubmit: (data: T) => Promise<void>;
  children: React.ReactNode;
}

export function AuthForm<T extends FieldValues>({
  form,
  title,
  description,
  error,
  onSubmit,
  children,
}: AuthFormProps<T>) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {children}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
