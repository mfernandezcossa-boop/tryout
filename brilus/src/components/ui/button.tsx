import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[8px] whitespace-nowrap rounded-brilus text-[14px] font-medium tracking-brilus-ui ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#1F1F1F] text-white hover:bg-[#1F1F1F]/90",
        destructive: "bg-[#C02C00] text-white hover:bg-[#C02C00]/90",
        outline: "border border-[rgba(0,0,0,0.1)] bg-white text-[#0A0A0A] hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-[#ECEEF2] text-[#1F1F1F] hover:bg-[#ECEEF2]/80",
        ghost: "text-[#0A0A0A] hover:bg-accent hover:text-accent-foreground",
        link: "text-[#030213] underline-offset-4 hover:underline",
        // Brand accent variants
        coral: "bg-brand-coral text-white hover:bg-brand-coral/90",
        blue: "bg-brand-blue text-white hover:bg-brand-blue/90",
        amber: "bg-brand-amber text-[#1F1F1F] hover:bg-brand-amber/90",
        "outline-coral": "border-2 border-brand-coral text-brand-coral bg-transparent hover:bg-brand-coral hover:text-white",
        "outline-blue": "border-2 border-brand-blue text-brand-blue bg-transparent hover:bg-brand-blue hover:text-white",
        "outline-white": "border-2 border-brand-white text-brand-white bg-transparent hover:bg-brand-white/10 hover:text-brand-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-11 px-6",
        xl: "h-12 px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
