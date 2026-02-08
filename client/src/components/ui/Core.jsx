// Add these to your Core.jsx file
import { motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";
import { Toaster as HotToaster } from "react-hot-toast";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Card Components ---
export function Card({ children, className }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn("p-6 pb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return (
    <h3
      className={cn(
        "font-serif text-xl font-bold text-ink dark:text-zinc-100",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

// --- Rest of your Core.jsx (Badge, Button, etc.) ---
// export function Badge({ children, variant = "neutral", className }) {
//   const styles = {
//     neutral: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300",
//     accent:
//       "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
//     outline: "border border-zinc-200 dark:border-zinc-700 text-zinc-500",
//   };

//   return (
//     <span
//       className={cn(
//         "px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase",
//         styles[variant],
//         className,
//       )}
//     >
//       {children}
//     </span>
//   );
// }

// --- Inputs & Form Elements ---

export function Label({ children, className, ...props }) {
  return (
    <label
      className={cn(
        "block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none transition-all placeholder:text-zinc-400 text-sm text-ink dark:text-zinc-200",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none transition-all placeholder:text-zinc-400 text-sm text-ink dark:text-zinc-200 resize-none min-h-[100px]",
        className,
      )}
      {...props}
    />
  );
}

// --- Buttons ---

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  const variants = {
    primary:
      "bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md border border-transparent",
    secondary:
      "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-ink dark:text-gray-200 hover:bg-zinc-50 dark:hover:bg-zinc-700",
    ghost:
      "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-ink dark:text-gray-200",
    outline:
      "bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900",
    danger: "bg-danger hover:bg-red-700 text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    icon: "p-2 aspect-square flex items-center justify-center",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Badge({ children, variant = "neutral" }) {
  const styles = {
    neutral: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300",
    accent:
      "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide uppercase",
        styles[variant],
      )}
    >
      {children}
    </span>
  );
}

// --- Feedback & Utilities ---

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800", className)}
      {...props}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
      <p className="font-serif italic text-zinc-500">Loading library...</p>
    </div>
  );
}

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        className:
          "dark:bg-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-xl",
        style: {
          background: "var(--color-paper)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );
}
