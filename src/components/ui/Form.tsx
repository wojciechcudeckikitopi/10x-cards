import { cn } from "@/lib/utils";
import React from "react";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(({ className, children, error, onSubmit, ...props }, ref) => {
  return (
    <form ref={ref} onSubmit={onSubmit} className={cn("space-y-6", className)} {...props}>
      {children}
      {error && (
        <div className="text-sm text-red-500 dark:text-red-400" role="alert">
          {error}
        </div>
      )}
    </form>
  );
});

Form.displayName = "Form";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, label, error, description, required, ...props }, ref) => {
    const id = React.useId();

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              id,
              "aria-describedby": description ? `${id}-description` : undefined,
              "aria-invalid": error ? "true" : undefined,
              ...child.props,
            });
          }
          return child;
        })}
        {description && (
          <p id={`${id}-description`} className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "vertical" | "horizontal";
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, layout = "vertical", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-6",
          layout === "horizontal" && "sm:space-y-0 sm:space-x-4 sm:flex sm:items-start",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormGroup.displayName = "FormGroup";

const FormActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
        {...props}
      />
    );
  }
);

FormActions.displayName = "FormActions";

const FormDivider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => {
    return <hr ref={ref} className={cn("my-6 border-t border-gray-200 dark:border-gray-700", className)} {...props} />;
  }
);

FormDivider.displayName = "FormDivider";

export { Form, FormActions, FormDivider, FormField, FormGroup };
