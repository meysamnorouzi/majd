import Link from "next/link";

const variants = {
  primary:
    "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-lg shadow-gold-500/25",
  secondary:
    "border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm",
  outline:
    "border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white",
  ghost: "text-navy-900 hover:bg-navy-900/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
