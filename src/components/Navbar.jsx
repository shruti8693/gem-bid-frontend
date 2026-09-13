import { Search, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({
  userName = "User",
  notificationCount = 0,
}) {
  const navigate = useNavigate();

  function handleNotificationClick() {
    const path = window.location.pathname;

    if (path.startsWith("/officer")) {
      navigate("/officer/notifications");
    } else if (path.startsWith("/buyer")) {
      navigate("/buyer/notifications");
    } else if (path.startsWith("/bidder")) {
      navigate("/bidder/notifications");
    }
  }

  function handleNotificationClick() {
    if (role === "officer") {
      navigate("/officer/notifications");
    } else if (role === "buyer") {
      navigate("/buyer/notifications");
    } else if (role === "bidder") {
      navigate("/bidder/notifications");
    }
  }

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-7 sticky top-0 z-20">
      {/* Search */}
      <div className="flex items-center gap-3 w-full max-w-xl">
        <div className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-colors">
          <Search className="w-[19px] h-[19px] text-slate-500 shrink-0" />

          <input
            type="text"
            placeholder="Search tenders, bids, documents..."
            className="w-full bg-transparent text-[14px] font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5 ml-6">
        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-blue-700 transition-colors cursor-pointer"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-[20px] h-[20px] text-slate-700" />

          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold border-2 border-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <User className="w-[19px] h-[19px] text-blue-700" />
          </div>

          <div className="hidden sm:block max-w-[220px]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Signed in as
            </p>

            <p className="text-[14px] font-bold text-slate-900 truncate">
              {userName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}