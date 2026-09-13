import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  UploadCloud,
  ClipboardCheck,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import {
  getTenderById,
  getBidderProfile,
  getExtraDocuments,
} from "../../services/api";
import { buildComplianceChecklist } from "../../utils/complianceChecklist";

function formatCurrency(value) {
  if (!value) return "—";

  const num = Number(value);

  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)} Cr`;
  }

  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)} L`;
  }

  return `₹${num.toLocaleString("en-IN")}`;
}

export default function TenderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [extras, setExtras] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getTenderById(id),
      getExtraDocuments(user.profileId, id),
    ])
      .then(([bidderProfile, tenderData, extraDocs]) => {
        setBidder(bidderProfile);
        setTender(tenderData);
        setExtras(extraDocs);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate, id]);

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
              Loading tender details...
            </p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (error || !tender) {
    return (
      <DashboardLayout
        role="bidder"
        userName={bidder?.companyName ?? "Bidder"}
      >
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />

            <h2 className="mt-3 text-[16px] font-bold text-slate-900">
              Unable to load tender
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              {error || "Tender not found."}
            </p>

            <Button
              variant="secondary"
              className="mt-5"
              onClick={() => navigate("/bidder/tenders")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tenders
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const checklist = buildComplianceChecklist(tender, bidder, extras);

  const readiness =
    checklist.total > 0
      ? Math.round((checklist.available / checklist.total) * 100)
      : 0;

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
          onClick={() => navigate("/bidder/tenders")}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-blue-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tenders
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                {tender.tenderId}
              </span>

              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                Tender Details
              </span>
            </div>

            <h1 className="text-[27px] leading-tight font-bold text-slate-900">
              {tender.title}
            </h1>

            <p className="text-[13px] text-slate-500 mt-2 max-w-3xl">
              Review tender requirements and check your document readiness
              before submitting your bid.
            </p>
          </div>

          {/* Readiness */}
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 min-w-[210px] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Compliance Readiness
              </span>

              <ShieldCheck className="w-5 h-5 text-blue-700" />
            </div>

            <div className="flex items-end gap-2 mt-1">
              <span className="text-[28px] font-bold text-slate-900">
                {readiness}%
              </span>

              <span className="text-[11px] text-slate-500 mb-1">
                documents ready
              </span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${readiness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tender summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-blue-700" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Organization
              </p>

              <p className="text-[13px] font-bold text-slate-900 truncate mt-0.5">
                Ministry of Petroleum & Natural Gas
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-amber-700" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Submission Deadline
              </p>

              <p className="text-[13px] font-bold text-slate-900 mt-0.5">
                {tender.deadline}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 text-emerald-700" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Estimated Value
              </p>

              <p className="text-[13px] font-bold text-slate-900 mt-0.5">
                {formatCurrency(tender.estimatedValue)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5 text-violet-700" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Requirements
              </p>

              <p className="text-[13px] font-bold text-slate-900 mt-0.5">
                {checklist.total} Checks
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left */}
        <div className="xl:col-span-2 space-y-5">
          {/* Tender details */}
          <Card title="Tender Details">
            <div className="space-y-0">
              <div className="py-3 border-b border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Description
                </p>

                <p className="text-[13px] leading-5 text-slate-700">
                  {tender.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Tender ID
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900 mt-1">
                    {tender.tenderId}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Submission Deadline
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900 mt-1">
                    {tender.deadline}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Estimated Value
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900 mt-1">
                    {formatCurrency(tender.estimatedValue)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Issuing Organization
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900 mt-1">
                    Ministry of Petroleum & Natural Gas
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Compliance checklist */}
          <Card
            title="Tender Compliance Checklist"
            action={
              <span className="text-[11px] font-semibold text-slate-500">
                {checklist.available}/{checklist.total} Available
              </span>
            }
          >
            <div className="space-y-1">
              {checklist.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-3 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.available ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    )}

                    <span className="text-[13px] font-medium text-slate-800">
                      {item.label}
                    </span>
                  </div>

                  {item.available ? (
                    <StatusBadge status="green">
                      Available
                    </StatusBadge>
                  ) : (
                    <StatusBadge status="amber">
                      Missing
                    </StatusBadge>
                  )}
                </div>
              ))}
            </div>

            {/* Checklist summary */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-200">
              <div className="text-center">
                <p className="text-[23px] font-bold text-slate-900">
                  {checklist.total}
                </p>
                <p className="text-[11px] text-slate-500">
                  Requirements
                </p>
              </div>

              <div className="text-center">
                <p className="text-[23px] font-bold text-emerald-700">
                  {checklist.available}
                </p>
                <p className="text-[11px] text-slate-500">
                  Already Available
                </p>
              </div>

              <div className="text-center">
                <p className="text-[23px] font-bold text-amber-700">
                  {checklist.missing}
                </p>
                <p className="text-[11px] text-slate-500">
                  Additional Required
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right action panel */}
        <div className="space-y-5">
          <Card className="p-5">
            {checklist.missing === 0 ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>

                <h2 className="text-[16px] font-bold text-slate-900">
                  Bid Ready
                </h2>

                <p className="text-[13px] leading-5 text-slate-500 mt-1.5">
                  All required documents are available. You can proceed to
                  verification and submit your bid.
                </p>

                <Button
                  variant="primary"
                  className="w-full mt-5"
                  onClick={() =>
                    navigate(`/bidder/tenders/${tender.id}/verify`)
                  }
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verify & Submit Bid
                </Button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>

                <h2 className="text-[16px] font-bold text-slate-900">
                  Documents Required
                </h2>

                <p className="text-[13px] leading-5 text-slate-500 mt-1.5">
                  {checklist.missing} additional document
                  {checklist.missing > 1 ? "s are" : " is"} required before
                  your bid can be submitted.
                </p>

                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-[12px] leading-5 text-amber-800">
                    Documents already available in your bidder profile do not
                    need to be uploaded again.
                  </p>
                </div>

                <Button
                  variant="primary"
                  className="w-full mt-4"
                  onClick={() =>
                    navigate(`/bidder/tenders/${tender.id}/upload`)
                  }
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Missing Documents
                </Button>
              </>
            )}
          </Card>

          {/* Readiness breakdown */}
          <Card title="Readiness Summary">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-medium text-slate-600">
                    Documents available
                  </span>

                  <span className="text-[12px] font-bold text-slate-900">
                    {checklist.available}/{checklist.total}
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${readiness}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <span className="text-[12px] text-slate-500">
                  Additional documents
                </span>

                <span
                  className={`text-[12px] font-bold ${
                    checklist.missing === 0
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  {checklist.missing}
                </span>
              </div>
            </div>
          </Card>

          {/* AI assistance */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-blue-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-blue-700" />
              </div>

              <div>
                <p className="text-[12px] font-bold text-blue-900">
                  AI Compliance Assistance
                </p>

                <p className="text-[11px] leading-5 text-blue-800/80 mt-1">
                  BidSure checks your available documents against the tender
                  requirements before submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}