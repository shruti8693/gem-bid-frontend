import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Gavel,
  ClipboardList,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ArrowRight,
  Eye,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import { getOfficerProfile } from "../../services/api";

const SUMMARY_CARDS = [
  {
    label: "Active Tenders",
    value: "04",
    icon: FileText,
    tone: "blue",
  },
  {
    label: "Bids Received",
    value: "17",
    icon: Gavel,
    tone: "indigo",
  },
  {
    label: "Under Evaluation",
    value: "06",
    icon: ClipboardList,
    tone: "amber",
  },
  {
    label: "Low Risk Bids",
    value: "10",
    icon: ShieldCheck,
    tone: "green",
  },
  {
    label: "Medium Risk Bids",
    value: "05",
    icon: ShieldAlert,
    tone: "amber",
  },
  {
    label: "High Risk Bids",
    value: "02",
    icon: ShieldX,
    tone: "red",
  },
];

const TENDER_DATA = [
  {
    id: "CPCL/2026/104",
    title: "Crude Oil Supply",
    bids: 8,
    progress: 82,
    status: "Evaluation",
    deadline: "25 Sep 2026",
  },
  {
    id: "CPCL/2026/091",
    title: "Pipeline Maintenance",
    bids: 6,
    progress: 64,
    status: "Evaluation",
    deadline: "30 Sep 2026",
  },
  {
    id: "CPCL/2026/087",
    title: "Equipment Procurement",
    bids: 14,
    progress: 48,
    status: "Review",
    deadline: "15 Oct 2026",
  },
];

const ACTIVITY = [
  {
    icon: ShieldCheck,
    tone: "green",
    title: "Bid compliance verified",
    detail: "CPCL/2026/104 · ABC Petroleum",
    time: "12 min ago",
  },
  {
    icon: AlertTriangle,
    tone: "amber",
    title: "Clarification required",
    detail: "CPCL/2026/091 · Bid #BID-006",
    time: "35 min ago",
  },
  {
    icon: ShieldX,
    tone: "red",
    title: "High-risk compliance flag",
    detail: "CPCL/2026/087 · Bid #BID-014",
    time: "1 hr ago",
  },
  {
    icon: FileText,
    tone: "blue",
    title: "New bid submitted",
    detail: "CPCL/2026/104 · Bid #BID-017",
    time: "2 hrs ago",
  },
];

function iconStyles(tone) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  return styles[tone] ?? styles.blue;
}

function statusStyles(status) {
  if (status === "Evaluation") {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }

  if (status === "Review") {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
}

export default function OfficerDashboardPage() {
  const navigate = useNavigate();

  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    getOfficerProfile(user.profileId)
      .then(setOfficer)
      .catch(() => setOfficer(null))
      .finally(() => setLoading(false));
  }, [navigate]);

  const riskTotal = useMemo(
    () =>
      Number(SUMMARY_CARDS[3].value) +
      Number(SUMMARY_CARDS[4].value) +
      Number(SUMMARY_CARDS[5].value),
    []
  );

  const riskShare = {
    low: Math.round((10 / riskTotal) * 100),
    medium: Math.round((5 / riskTotal) * 100),
    high: Math.round((2 / riskTotal) * 100),
  };

  if (loading) {
    return (
      <DashboardLayout role="officer" userName="Loading...">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />

            <p className="mt-3 text-sm text-slate-500">
              Loading officer dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="officer"
      userName={officer?.fullName ?? "Officer"}
      notificationCount={1}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-5 mb-5">
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-blue-700">
            Procurement Command Center
          </p>

          <h1 className="mt-1 text-[27px] leading-tight font-bold tracking-tight text-slate-900">
            Officer Dashboard
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Welcome back, {officer?.fullName ?? "Officer"}. Review procurement
            activity, bid compliance and risk.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/officer/evaluation")}
        >
          <Gavel className="w-4 h-4" />
          Evaluate Bids
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {SUMMARY_CARDS.map(
          ({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>

                  <p className="mt-1.5 text-[25px] leading-none font-bold text-slate-900">
                    {value}
                  </p>
                </div>

                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconStyles(
                    tone
                  )}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* MAIN DASHBOARD */}
      <div className="grid grid-cols-12 gap-4">
        {/* TENDER EVALUATION */}
        <Card
          className="col-span-8"
          title="Tender Evaluation"
          action={
            <button
              type="button"
              onClick={() => navigate("/officer/evaluation")}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-700 hover:text-blue-900"
            >
              View Evaluation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-[30%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Tender
                  </th>

                  <th className="w-[13%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Bids
                  </th>

                  <th className="w-[24%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Progress
                  </th>

                  <th className="w-[17%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="w-[16%] pb-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {TENDER_DATA.map((tender) => (
                  <tr
                    key={tender.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 pr-3">
                      <p className="text-[12px] font-bold text-slate-800 truncate">
                        {tender.title}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {tender.id}
                      </p>
                    </td>

                    <td className="py-3">
                      <span className="text-[12px] font-bold text-slate-800">
                        {tender.bids}
                      </span>
                    </td>

                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-700 rounded-full"
                            style={{ width: `${tender.progress}%` }}
                          />
                        </div>

                        <span className="text-[10px] font-bold text-slate-600">
                          {tender.progress}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] font-bold ${statusStyles(
                          tender.status
                        )}`}
                      >
                        {tender.status}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/officer/evaluation")}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* RISK DISTRIBUTION */}
        <Card className="col-span-4" title="Bid Risk Distribution">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-slate-500">
                Current evaluated bid portfolio
              </p>

              <p className="mt-1 text-[25px] leading-none font-bold text-slate-900">
                {riskTotal}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                bids with risk classification
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-600">
                  Low Risk
                </span>

                <span className="text-[11px] font-bold text-emerald-700">
                  10 · {riskShare.low}%
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${riskShare.low}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-600">
                  Medium Risk
                </span>

                <span className="text-[11px] font-bold text-amber-700">
                  5 · {riskShare.medium}%
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${riskShare.medium}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-600">
                  High Risk
                </span>

                <span className="text-[11px] font-bold text-red-700">
                  2 · {riskShare.high}%
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${riskShare.high}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />

              <p className="text-[11px] leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-700">
                  2 high-risk bids
                </span>{" "}
                require priority review before final evaluation.
              </p>
            </div>
          </div>
        </Card>

        {/* COMPLIANCE CENTER */}
        <Card className="col-span-7" title="Compliance Review Center">
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-emerald-100 bg-emerald-50/60 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />

                <span className="text-[11px] font-bold text-emerald-800">
                  Compliant
                </span>
              </div>

              <p className="mt-3 text-[23px] leading-none font-bold text-slate-900">
                10
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Ready for officer review
              </p>
            </div>

            <div className="border border-amber-100 bg-amber-50/60 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-amber-700" />

                <span className="text-[11px] font-bold text-amber-800">
                  Needs Review
                </span>
              </div>

              <p className="mt-3 text-[23px] leading-none font-bold text-slate-900">
                05
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Evidence or clarification needed
              </p>
            </div>

            <div className="border border-red-100 bg-red-50/60 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <ShieldX className="w-4 h-4 text-red-700" />

                <span className="text-[11px] font-bold text-red-800">
                  Critical
                </span>
              </div>

              <p className="mt-3 text-[23px] leading-none font-bold text-slate-900">
                02
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                High-risk conflicts detected
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

            <div>
              <p className="text-[11px] font-bold text-blue-900">
                Evidence-backed compliance review
              </p>

              <p className="mt-0.5 text-[10px] leading-relaxed text-blue-800/80">
                Use Compliance X-Ray to trace each requirement to the
                submitted document and verification evidence before making a
                procurement decision.
              </p>
            </div>
          </div>
        </Card>

        {/* RECENT ACTIVITY */}
        <Card className="col-span-5" title="Recent Procurement Activity">
          <div className="space-y-4">
            {ACTIVITY.map(
              ({ icon: Icon, tone, title, detail, time }) => (
                <div key={`${title}-${time}`} className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconStyles(
                      tone
                    )}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] font-semibold text-slate-800">
                        {title}
                      </p>

                      <span className="text-[9px] text-slate-400 whitespace-nowrap">
                        {time}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[10px] text-slate-500 truncate">
                      {detail}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      </div>

      {/* USP CTA */}
      <div className="mt-4 bg-slate-900 rounded-xl px-5 py-4 flex items-center justify-between gap-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          <div>
            <p className="text-[13px] font-bold text-white">
              Compliance X-Ray
            </p>

            <p className="mt-0.5 text-[11px] text-slate-300">
              Trace every tender requirement to document evidence and
              verification results.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate("/officer/evaluation")}
          className="shrink-0"
        >
          Open Evaluation
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </DashboardLayout>
  );
}