// Consistent card container used across dashboards, forms, and detail views.
// title/action are optional — pass only what you need.
// `interactive` adds a hover lift for cards that are clickable.
export default function Card({
  title,
  action,
  children,
  className = "",
  interactive = false,
}) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-6 transition-all duration-200 ease-out ${
        interactive
          ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : ""
      } ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h3 className="text-lg font-bold text-slate-900">
              {title}
            </h3>
          )}

          {action && <div>{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
}