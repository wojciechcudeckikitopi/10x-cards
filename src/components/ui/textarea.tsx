import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { XCircle } from "lucide-react";
import * as React from "react";

const textareaVariants = cva(
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
  {
    variants: {
      size: {
        sm: "min-h-[80px] text-sm",
        md: "min-h-[120px] text-base",
        lg: "min-h-[160px] text-lg",
      },
      status: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive/50 text-destructive",
        success: "border-success focus-visible:ring-success/50 text-success",
      },
    },
    defaultVariants: {
      size: "md",
      status: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  autoResize?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size,
      status,
      label,
      helperText,
      maxLength,
      showCharCount = false,
      autoResize = false,
      showClearButton = false,
      onClear,
      value = "",
      onChange,
      ...props
    },
    ref
  ) => {
    const [textValue, setTextValue] = React.useState(value);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      setTextValue(value);
    }, [value]);

    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (maxLength && newValue.length > maxLength) return;

      setTextValue(newValue);
      onChange?.(e);

      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const handleClear = () => {
      setTextValue("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.focus();
      }
      onClear?.();
    };

    return (
      <div className="w-full space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={textValue}
            onChange={handleChange}
            className={cn(textareaVariants({ size, status }), showClearButton && textValue && "pr-10", className)}
            {...props}
          />
          {showClearButton && textValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear text"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          {helperText && <span>{helperText}</span>}
          {showCharCount && typeof textValue === "string" && (
            <span className="ml-auto">
              {textValue.length}
              {maxLength && `/${maxLength}`}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
