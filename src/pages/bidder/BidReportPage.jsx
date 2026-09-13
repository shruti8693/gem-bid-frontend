import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  FileCheck2,
  Landmark,
  CheckCircle2,
  CircleAlert,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getTenderById,
} from "../../services/api";

const DOC_LABELS = {
  companyRegistration: "Company Registration",
  gst: "GST Certificate",
  pan: "PAN",
  experience: "Experience Certificate",
  financial: "Financial Statement",
  technical: "Technical Capability",
  iso: "ISO Certificate",
  representative: "Authorized Representative",
};

const GOV_LABELS = {
  gstn: "GSTN",
  pan: "PAN Database",
  mca: "MCA Registration",
  udyam: "Udyam Registration",
  nsic: "NSIC",
  epfo: "EPFO",
  esic: "ESIC",
};

function riskBadgeColor(level) {
  if (level === "LOW") return "green";
  if (level === "MEDIUM") return "amber";
  return "red";
}

function getRiskStyle(level) {
  if (level === "LOW") {
    return {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      icon: CheckCircle2,
    };
  }

  if (level === "MEDIUM") {
    return {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
      icon: AlertTriangle,
    };
  }

  return {
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-700",
    icon: CircleAlert,
  };
}

export default function BidReportPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bid, setBid] = useState(null);
  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    getBidById(id)
      .then(async (bidData) => {
        setBid(bidData);

        const [bidderProfile, tenderData] = await Promise.all([
          getBidderProfile(bidData.bidderId),
          getTenderById(bidData.tenderId),
        ]);

        setBidder(bidderProfile);
        setTender(tenderData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <DashboardLayout
        role="bidder"
        userName={bidder?.companyName ?? "Bidder"}
      >
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-700 animate-spin" />

            <p className="mt-4 text-[13px] font-medium text-slate-600">
              Loading compliance report...
            </p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (error || !bid) {
    return (
      <DashboardLayout role="bidder" userName="Bidder">
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />

            <h2 className="mt-3 text-[16px] font-bold text-slate-900">
              Unable to load report
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              {error || "Bid not found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/bidder/bids")}
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-blue-700 text-white text-[13px] font-semibold hover:bg-blue-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Bids
            </button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const { verification } = bid;

  const riskStyle = getRiskStyle(bid.riskLevel);
  const RiskIcon = riskStyle.icon;

  const documentCount = Object.keys(
    verification?.documents ?? {}
  ).length;

  const governmentCount = Object.keys(
    verification?.governmentCrossCheck ?? {}
  ).length;

  const complianceTone =
    bid.complianceScore >= 85
      ? "text-emerald-700"
      : bid.complianceScore >= 65
      ? "text-amber-700"
      : "text-red-700";

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/bidder/bids")}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-blue-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Bids
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                {tender?.tenderId}
              </span>

              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                Compliance Report
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
              </div>

              <div>
                <h1 className="text-[27px] leading-tight font-bold text-slate-900">
                  Bid Compliance Report
                </h1>

                <p className="text-[13px] text-slate-500 mt-1 max-w-3xl">
                  {tender?.title}
                </p>
              </div>
            </div>
          </div>

          {/* Risk summary */}
          <div
            className={`rounded-xl border px-5 py-4 min-w-[210px] ${riskStyle.bg} ${riskStyle.border}`}
          >
            <div className="flex items-center gap-2">
              <RiskIcon className={`w-5 h-5 ${riskStyle.text}`} />

              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Risk Level
              </span>
            </div>

            <p className={`text-[22px] font-bold mt-1 ${riskStyle.text}`}>
              {bid.riskLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Overall Compliance
              </p>

              <p className={`text-[32px] font-bold mt-1 ${complianceTone}`}>
                {bid.complianceScore}%
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${Math.min(
                  Math.max(bid.complianceScore, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Risk Level
              </p>

              <div className="mt-2">
                <StatusBadge status={riskBadgeColor(bid.riskLevel)}>
                  {bid.riskLevel}
                </StatusBadge>
              </div>
            </div>

            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${riskStyle.bg}`}
            >
              <RiskIcon className={`w-5 h-5 ${riskStyle.text}`} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Risk Score
              </p>

              <p className="text-[30px] font-bold text-slate-900 mt-1">
                {bid.riskScore}
                <span className="text-[14px] font-medium text-slate-400">
                  /100
                </span>
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Verification overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-blue-700" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Documents Verified
              </p>

              <p className="text-[20px] font-bold text-slate-900">
                {documentCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-700" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Government Sources Checked
              </p>

              <p className="text-[20px] font-bold text-slate-900">
                {governmentCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Document verification */}
        <Card title="Document Verification">
          <div className="space-y-1">
            {Object.entries(verification?.documents ?? {}).map(
              ([key, status]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 py-3 px-3 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                    <span className="text-[13px] font-medium text-slate-800">
                      {DOC_LABELS[key] ?? key}
                    </span>
                  </div>

                  <StatusBadge status="green">
                    {status}
                  </StatusBadge>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Government verification */}
        <Card title="Government Record Cross-Verification">
          <div className="space-y-1">
            {Object.entries(
              verification?.governmentCrossCheck ?? {}
            ).map(([key, status]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 py-3 px-3 rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Landmark className="w-4 h-4 text-blue-700 shrink-0" />

                  <span className="text-[13px] font-medium text-slate-800">
                    {GOV_LABELS[key] ?? key}
                  </span>
                </div>

                <StatusBadge status="green">
                  {status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Card>

        {/* Technical & Financial */}
        <Card title="Technical & Financial Compliance">
          <div className="space-y-0">
            <div className="flex justify-between gap-4 py-3 border-b border-slate-100">
              <span className="text-[12px] text-slate-500">
                Required Technical Capacity
              </span>

              <span className="text-[13px] font-semibold text-slate-900 text-right">
                {tender?.minTechnicalCapacity ?? "—"}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-3 border-b border-slate-100">
              <span className="text-[12px] text-slate-500">
                Bidder Technical Capacity
              </span>

              <span className="text-[13px] font-semibold text-slate-900 text-right">
                {bidder?.technicalCapacity ?? "—"}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-3 border-b border-slate-100">
              <span className="text-[12px] text-slate-500">
                Required Turnover
              </span>

              <span className="text-[13px] font-semibold text-slate-900">
                ₹{tender?.minTurnover ?? "—"}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-3">
              <span className="text-[12px] text-slate-500">
                Bidder Turnover
              </span>

              <span className="text-[13px] font-semibold text-slate-900">
                ₹{bidder?.annualTurnover ?? "—"}
              </span>
            </div>

            <div className="mt-2 pt-3 border-t border-slate-200">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />

                <span className="text-[12px] font-semibold">
                  Requirements Satisfied
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Exceptions */}
        <Card title="Exceptions & Findings">
          {verification?.nameConsistencyWarning ? (
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />

                <div>
                  <p className="text-[13px] font-bold text-slate-900">
                    Minor Name Variation Detected
                  </p>

                  <p className="text-[12px] leading-5 text-slate-600 mt-1">
                    GST legal name and company registration name show a small
                    formatting difference, such as "Pvt Ltd" vs "Private
                    Limited". No critical compliance issue was identified.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

              <div>
                <p className="text-[13px] font-bold text-slate-900">
                  No Exceptions Found
                </p>

                <p className="text-[12px] text-slate-600 mt-1">
                  No significant compliance exceptions were detected in this
                  bid verification.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* AI explanation */}
      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-blue-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
          </div>

          <div>
            <p className="text-[12px] font-bold text-blue-900">
              AI Compliance Assessment
            </p>

            <p className="text-[12px] leading-5 text-blue-900/80 mt-1">
              The compliance score and risk assessment are generated from the
              submitted bid information, document verification and available
              government-record cross-checks. Review outcomes remain subject
              to procurement authority.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}