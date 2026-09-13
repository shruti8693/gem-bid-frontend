import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ArrowRight,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import { getCurrentUser } from "../../utils/auth";
import {
  getBidderProfile,
  getNotifications,
  markNotificationRead,
} from "../../services/api";

const TYPE_CONFIG = {
  new_tender: {
    icon: FileText,
    label: "New Tender",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  verification_complete: {
    icon: ShieldCheck,
    label: "Verification",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  clarification: {
    icon: AlertTriangle,
    label: "Clarification",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
};

function getTypeConfig(type) {
  return (
    TYPE_CONFIG[type] ?? {
      icon: Bell,
      label: "Notification",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
    }
  );
}

export default function BidderNotificationsPage() {
  const navigate = useNavigate();

  const [bidder, setBidder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getNotifications(user.profileId),
    ])
      .then(([bidderProfile, notifs]) => {
        setBidder(bidderProfile);
        setNotifications(notifs);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleClick(notif) {
    if (!notif.read) {
      await markNotificationRead(notif.id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notif.id ? { ...n, read: true } : n
        )
      );
    }

    if (notif.link) {
      navigate(notif.link);
    }
  }

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const readCount = notifications.length - unreadCount;

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={unreadCount}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-700" />
          </div>

          <div>
            <h1 className="text-[27px] leading-tight font-bold text-slate-900">
              Notifications
            </h1>

            <p className="text-[13px] text-slate-500 mt-1">
              Stay updated on tenders, verification and clarification requests.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      {!loading && notifications.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </p>

                <p className="text-[28px] font-bold text-slate-900 mt-1">
                  {notifications.length}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Unread
                </p>

                <p className="text-[28px] font-bold text-red-700 mt-1">
                  {unreadCount}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-red-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Read
                </p>

                <p className="text-[28px] font-bold text-emerald-700 mt-1">
                  {readCount}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {loading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-700 animate-spin" />

            <p className="mt-4 text-[13px] font-medium text-slate-600">
              Loading notifications...
            </p>
          </div>
        </Card>
      ) : notifications.length === 0 ? (
        <Card className="p-10">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <Bell className="w-7 h-7 text-slate-400" />
            </div>

            <h2 className="mt-4 text-[16px] font-bold text-slate-900">
              No notifications
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              New tender, verification and clarification updates will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const config = getTypeConfig(notif.type);
            const Icon = config.icon;

            return (
              <button
                key={notif.id}
                type="button"
                onClick={() => handleClick(notif)}
                className={`group w-full text-left bg-white border rounded-xl p-4 sm:p-5 flex items-start gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  notif.read
                    ? "border-slate-200 hover:border-blue-200"
                    : "border-blue-200 bg-blue-50/30 hover:border-blue-400"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-bold text-slate-900">
                      {notif.title}
                    </p>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        notif.read
                          ? "bg-slate-100 text-slate-500"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {notif.read ? "Read" : "New"}
                    </span>
                  </div>

                  <p className="text-[13px] leading-5 text-slate-600 mt-1">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide ${config.iconColor}`}
                    >
                      {config.label}
                    </span>

                    {notif.link && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-400">
                          Open related item
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 shrink-0 pt-1">
                  {!notif.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  )}

                  {notif.link && (
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Info note */}
      {!loading && notifications.length > 0 && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

            <p className="text-[12px] leading-5 text-blue-900">
              Select a notification to mark it as read and open the related
              tender, verification or clarification when available.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}