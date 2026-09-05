import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "flex w-full rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(fieldBase, "h-11 px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, "min-h-28 px-3 py-2", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, "h-11 px-3 py-2", className)} {...props} />
  )
);
Select.displayName = "Select";

const FieldError = ({ children }: { children?: React.ReactNode }) =>
  children ? (
    <p className="mt-1.5 text-sm text-destructive" role="alert">
      {children}
    </p>
  ) : null;

export { Input, Textarea, Select, FieldError };
