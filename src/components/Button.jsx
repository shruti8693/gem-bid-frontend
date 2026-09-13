// Reusable button with consistent government-tech styling.
// variant: "primary", "secondary", "ghost"
export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-semibold rounded-lg transition-all duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-px";

  const variants = {
    primary:
      "bg-blue-700 text-white shadow-sm hover:bg-blue-800 hover:shadow-md",

    secondary:
      "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-blue-500",

    ghost:
      "text-slate-700 hover:bg-slate-100 hover:text-blue-700",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}