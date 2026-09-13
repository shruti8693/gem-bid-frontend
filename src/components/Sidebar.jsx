import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Gavel,
  FolderOpen,
  Bell,
  User,
  HelpCircle,
  LogOut,
  PlusCircle,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import { clearCurrentUser } from "../utils/auth";

// Navigation items per role
const NAV_ITEMS = {
  bidder: [
    { to: "/bidder/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/bidder/tenders", label: "Tenders", icon: FileText },
    { to: "/bidder/bids", label: "My Bids", icon: Gavel },
    { to: "/bidder/documents", label: "My Documents", icon: FolderOpen },
    { to: "/bidder/notifications", label: "Notifications", icon: Bell },
    { to: "/bidder/profile", label: "Profile", icon: User },
  ],

  buyer: [
    { to: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/buyer/tenders/create", label: "Create Tender", icon: PlusCircle },
    { to: "/buyer/tenders", label: "My Tenders", icon: FileText },
    { to: "/buyer/notifications", label: "Notifications", icon: Bell },
    { to: "/buyer/profile", label: "Profile", icon: User },
  ],

  officer: [
    { to: "/officer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/officer/tenders", label: "Tenders", icon: FileText },
    { to: "/officer/bids", label: "Bids", icon: Gavel },
    {
      to: "/officer/reports",
      label: "Compliance Reports",
      icon: ClipboardCheck,
    },
    {
      to: "/officer/evaluation",
      label: "Evaluation",
      icon: BarChart3,
    },
    {
      to: "/officer/notifications",
      label: "Notifications",
      icon: Bell,
    },
    { to: "/officer/profile", label: "Profile", icon: User },
  ],
};

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const items = NAV_ITEMS[role] ?? [];

  function handleLogout() {
    clearCurrentUser();
    navigate("/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-navy-900 text-white flex flex-col shadow-xl">
      
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center justify-center">
          <img
            src="/bidsure logo.jpeg"
            alt="BidSure AI"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1.5">
        
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <HelpCircle className="w-[18px] h-[18px] shrink-0" />
          <span>Help</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-white/80 hover:bg-red-500/20 hover:text-white transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
}