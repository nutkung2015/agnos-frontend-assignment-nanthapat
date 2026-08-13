import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-semibold text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 inline-flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 font-bold" aria-hidden="true">*</span>}
    </label>
  )
);
Label.displayName = "Label";

export { Label };
