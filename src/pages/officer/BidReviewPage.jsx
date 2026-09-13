import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  Gavel,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Eye,
  AlertTriangle,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";

import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getTenderById,
  getOfficerProfile,
  updateBidStatus,
} from "../../services/api";

function riskColor(level) {
  if (level === "LOW") return "green";
  if (level === "MEDIUM") return "amber";
  return "red";
}

function statusColor(status) {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "red";
  if (status === "Clarification Requested") return "amber";
  return "neutral";
}

function riskIcon(level) {
  if (level === "LOW") return ShieldCheck;
  if (level === "MEDIUM") return ShieldAlert;
  return ShieldX;
}

export default function BidReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [officer, setOfficer] = useState(null);
  const [bid, setBid] = useState(null);
  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    getOfficerProfile(user.profileId)
      .then(setOfficer)
      .catch(() => setOfficer(null));

    getBidById(id)
      .then(async (bidData) => {
        setBid(bidData);

        const [bidderProfile, tenderData] = await Promise.all([
          getBidderProfile(bidData.bidderId).catch(() => null),
          getTenderById(bidData.tenderId).catch(() => null),
        ]);

        setBidder(bidderProfile);
        setTender(tenderData);
      })
      .catch(() => {
        setBid(null);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleDecision(status) {
    if (status === "Clarification Requested") {
      navigate(`/officer/bids/${id}/clarify`);
      return;
    }

    setUpdating(true);

    try {
      const updated = await updateBidStatus(id, status);
      setBid(updated);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        role="officer"
        userName={officer?.fullName ?? "Officer"}
      >
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />

            <p className="mt-3 text-sm text-slate-500">
              Loading bid review...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!bid) {
    return (
      <DashboardLayout
        role="officer"
        userName={officer?.fullName ?? "Officer"}
      >
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="mx-auto w-10 h-10 text-amber-600" />

            <h2 className="mt-3 text-lg font-bold text-slate-900">
              Bid not found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The requested bid could not be loaded.
            </p>

            <Button
              variant="primary"
              className="mt-5"
              onClick={() => navigate("/officer/bids")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Bids
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const RiskIcon = riskIcon(bid.riskLevel);

  const complianceScore = Number(bid.complianceScore) || 0;

  const complianceItems = [
    {
      label: "Eligibility",
      status: "Pass",
    },
    {
      label: "Documents",
      status: "Pass",
    },
    {
      label: "Financial",
      status: "Pass",
    },
    {
      label: "Technical",
      status: "Pass",
    },
    {
      label: "Certifications",
      status: "Pass",
    },
  ];

  return (
    <DashboardLayout
      role="officer"
      userName={officer?.fullName ?? "Officer"}
      notificationCount={1}
    >
      {/* HEADER */}
      <div className="mb-5">
        <button
          type="button"
          onClick={() => navigate("/officer/bids")}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bids
        </button>

        <div className="mt-4 flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-widest uppercase text-blue-700">
                Bid Review
              </span>

              <StatusBadge status={statusColor(bid.status)}>
                {bid.status || "Under Review"}
              </StatusBadge>
            </div>

            <h1 className="mt-1.5 text-[26px] leading-tight font-bold tracking-tight text-slate-900">
              {bidder?.companyName || "Bidder"}
            </h1>

            <div className="mt-2 flex items-center gap-4 flex-wrap text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5" />
                Bid #{bid.id}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                {tender?.tenderId}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                {tender?.title}
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/officer/bids/${bid.id}/compliance-xray`)
            }
          >
            <Eye className="w-4 h-4" />
            Compliance X-Ray
          </Button>
        </div>
      </div>

      {/* SCORE STRIP */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Compliance Score
              </p>

              <p className="mt-1.5 text-[30px] leading-none font-bold text-slate-900">
                {complianceScore}%
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
          </div>

          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${complianceScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Risk Level
              </p>

              <div className="mt-2">
                <StatusBadge status={riskColor(bid.riskLevel)}>
                  {bid.riskLevel}
                </StatusBadge>
              </div>
            </div>

            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                bid.riskLevel === "LOW"
                  ? "bg-emerald-50"
                  : bid.riskLevel === "MEDIUM"
                  ? "bg-amber-50"
                  : "bg-red-50"
              }`}
            >
              <RiskIcon
                className={`w-5 h-5 ${
                  bid.riskLevel === "LOW"
                    ? "text-emerald-700"
                    : bid.riskLevel === "MEDIUM"
                    ? "text-amber-700"
                    : "text-red-700"
                }`}
              />
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Risk score:{" "}
            <span className="font-bold text-slate-800">
              {bid.riskScore ?? "—"}/100
            </span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Review Status
              </p>

              <div className="mt-2">
                <StatusBadge status={statusColor(bid.status)}>
                  {bid.status || "Under Review"}
                </StatusBadge>
              </div>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ClipboardIcon />
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Officer review required before final decision.
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT */}
        <div className="col-span-7 space-y-4">
          <Card title="Bidder Profile">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-blue-700" />
              </div>

              <div>
                <p className="text-[15px] font-bold text-slate-900">
                  {bidder?.companyName || "—"}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Registered bidder
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
              <InfoItem
                label="Registration Number"
                value={bidder?.companyRegNumber}
              />

              <InfoItem
                label="GSTIN"
                value={bidder?.gstin}
              />

              <InfoItem
                label="Experience"
                value={
                  bidder?.yearsExperience
                    ? `${bidder.yearsExperience} years`
                    : "—"
                }
              />

              <InfoItem
                label="Annual Turnover"
                value={
                  bidder?.annualTurnover
                    ? `₹${bidder.annualTurnover}`
                    : "—"
                }
              />

              <InfoItem
                label="Technical Capacity"
                value={bidder?.technicalCapacity}
              />

              <InfoItem
                label="Tender"
                value={tender?.tenderId}
              />
            </div>
          </Card>

          <Card
            title="Compliance Summary"
            action={
              <span className="text-[11px] font-semibold text-emerald-700">
                {complianceItems.length}/{complianceItems.length} Passed
              </span>
            }
          >
            <div className="space-y-1">
              {complianceItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                    <span className="text-[12px] font-semibold text-slate-700">
                      {item.label}
                    </span>
                  </div>

                  <StatusBadge status="green">
                    {item.status}
                  </StatusBadge>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/officer/bids/${bid.id}/compliance-xray`
                  )
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-700 text-white text-[12px] font-bold hover:bg-blue-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Inspect Evidence with Compliance X-Ray
              </button>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="col-span-5 space-y-4">
          <Card title="AI Risk Assessment">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  bid.riskLevel === "LOW"
                    ? "bg-emerald-50"
                    : bid.riskLevel === "MEDIUM"
                    ? "bg-amber-50"
                    : "bg-red-50"
                }`}
              >
                <RiskIcon className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[13px] font-bold text-slate-800">
                  {bid.riskLevel} RISK
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  AI-generated risk classification based on the available
                  compliance and bid information.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Risk Score
              </p>

              <div className="flex items-end justify-between mt-1">
                <span className="text-[22px] font-bold text-slate-900">
                  {bid.riskScore ?? "—"}
                </span>

                <span className="text-[10px] text-slate-400">
                  out of 100
                </span>
              </div>
            </div>
          </Card>

          <Card title="Tender Information">
            <InfoItem
              label="Tender ID"
              value={tender?.tenderId}
            />

            <div className="mt-4">
              <InfoItem
                label="Tender Title"
                value={tender?.title}
              />
            </div>

            <div className="mt-4">
              <InfoItem
                label="Deadline"
                value={tender?.deadline}
              />
            </div>
          </Card>

          <Card title="Officer Evaluation">
            <p className="text-[11px] leading-relaxed text-slate-500 mb-4">
              Review the evidence before taking an action. AI provides
              decision support; the procurement officer retains final
              authority.
            </p>

            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full"
                disabled={updating}
                onClick={() => handleDecision("Approved")}
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Bid
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                disabled={updating}
                onClick={() =>
                  handleDecision("Clarification Requested")
                }
              >
                <AlertTriangle className="w-4 h-4" />
                Request Clarification
              </Button>

              <Button
                variant="secondary"
                className="w-full text-red-700 border-red-200 hover:bg-red-50"
                disabled={updating}
                onClick={() => handleDecision("Rejected")}
              >
                <ShieldX className="w-4 h-4" />
                Reject Bid
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* DECISION DISCLAIMER */}
      <div className="mt-4 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

        <div>
          <p className="text-[11px] font-bold text-blue-900">
            AI Decision Support
          </p>

          <p className="mt-0.5 text-[10px] leading-relaxed text-blue-800/80">
            Compliance scores, risk classifications and recommendations are
            intended to assist the procurement officer. Final
            qualification, clarification and rejection decisions remain
            with the authorized officer.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[12px] font-semibold text-slate-800 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <div className="w-5 h-5 rounded border-2 border-blue-700 relative">
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-1.5 rounded-sm bg-blue-700" />
    </div>
  );
}