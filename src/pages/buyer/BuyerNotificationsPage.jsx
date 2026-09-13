import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCircle2,
  FileText,
  Gavel,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Clock,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import { getCurrentUser } from "../../utils/auth";
import {
  getBuyerProfile,
  getNotifications,
  markNotificationRead,
} from "../../services/api";

const TYPE_CONFIG = {
  new_bid: {
    icon: Gavel,
    label: "Bid Activity",
    iconClass: "text-blue-700",
    bgClass: "bg-blue-50",
  },
  new_tender: {
    icon: FileText,
    label: "Tender Update",
    iconClass: "text-indigo-700",
    bgClass: "bg-indigo-50",
  },
  clarification: {
    icon: MessageSquare,
    label: "Clarification",
    iconClass: "text-amber-700",
    bgClass: "bg-amber-50",
  },
  verification: {
    icon: CheckCircle2,
    label: "Verification",
    iconClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
  },
};

export default function BuyerNotificationsPage() {
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "buyer") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBuyerProfile(user.profileId),
      getNotifications({
        recipientRole: "buyer",
        recipientId: user.profileId,
      }),
    ])
      .then(([buyerProfile, notificationData]) => {
        setBuyer(buyerProfile);
        setNotifications(notificationData || []);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleMarkRead(notification) {
    if (notification.read) return;

    try {
      await markNotificationRead(notification.id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleNotificationClick(notification) {
    await handleMarkRead(notification);

    if (notification.link) {
      navigate(notification.link);
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        role="buyer"
        userName={buyer?.companyName ?? "Buyer"}
      >
        <div className="flex items-center justify-center min-h-[420px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-[13px] font-medium text-slate-600">
              Loading notifications...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const readCount = notifications.length - unreadCount;

  return (
    <DashboardLayout
      role="buyer"
      userName={buyer?.companyName ?? "Buyer"}
      notificationCount={unreadCount}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-5 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Procurement Activity
            </p>

            <h1 className="mt-1 text-[27px] font-bold text-slate-900">
              Notifications
            </h1>

            <p className="mt-1.5 text-[13px] text-slate-500">
              Stay updated on bids, tenders, clarifications and procurement
              activity.
            </p>
          </div>

          <div className="hidden sm:flex w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center">
            <Bell className="w-5 h-5 text-blue-700" />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500">
              Total Notifications
            </p>

            <p className="mt-1 text-[25px] font-bold text-slate-900">
              {notifications.length}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-blue-700">
              Unread
            </p>

            <p className="mt-1 text-[25px] font-bold text-blue-800">
              {unreadCount}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-emerald-700">
              Read
            </p>

            <p className="mt-1 text-[25px] font-bold text-emerald-800">
              {readCount}
            </p>
          </div>
        </div>

        {/* Notifications */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">
                  Recent Activity
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Notifications related to your procurement activities.
                </p>
              </div>

              {unreadCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6 text-slate-400" />
              </div>

              <h3 className="mt-4 text-[15px] font-bold text-slate-800">
                No notifications
              </h3>

              <p className="mt-1 text-[12px] text-slate-500">
                You're all caught up. New procurement activity will appear
                here.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => {
                const config =
                  TYPE_CONFIG[notification.type] ??
                  {
                    icon: Bell,
                    label: "Notification",
                    iconClass: "text-slate-600",
                    bgClass: "bg-slate-100",
                  };

                const Icon = config.icon;

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`w-full text-left px-6 py-4 border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50 ${
                      !notification.read
                        ? "bg-blue-50/30"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bgClass}`}
                      >
                        <Icon
                          className={`w-5 h-5 ${config.iconClass}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-[13px] font-bold text-slate-900">
                                {notification.title}
                              </h3>

                              {!notification.read && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-bold uppercase">
                                  New
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-[11px] font-semibold text-slate-500">
                              {config.label}
                            </p>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                        </div>

                        <p className="mt-2 text-[12px] leading-5 text-slate-600">
                          {notification.message}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400" />

                          <span className="text-[10px] text-slate-400">
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                                ).toLocaleString()
                              : "Recent"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Information */}
        <div className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
          <ShieldCheckIcon />

          <p className="text-[11px] leading-5 text-blue-800">
            Notifications keep procurement teams informed about bid
            submissions, verification activity, clarifications and tender
            updates.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ShieldCheckIcon() {
  return (
    <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center shrink-0">
      <Check className="w-3.5 h-3.5 text-blue-700" />
    </div>
  );
}