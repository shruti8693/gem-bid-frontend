import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Gavel,
  RefreshCw,
  ShieldCheck,
  Users,
  AlertTriangle,
  Eye,
  Activity,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import {
  getBuyerProfile,
  getTenderById,
  getBids,
  getBidderProfile,
} from "../../services/api";

function statusColor(status) {
  if (status === "Published") return "green";
  if (status === "Draft") return "amber";
  if (status === "Closed") return "neutral";
  return "neutral";
}

function riskColor(risk) {
  if (risk === "Low") return "green";
  if (risk === "Medium") return "amber";
  return "red";
}

export default function TenderMonitoringPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [buyer, setBuyer] = useState(null);
  const [tender, setTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidderProfiles, setBidderProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "buyer") {
      navigate("/login");
      return;
    }

    async function loadData() {
      try {
        const [buyerProfile, tenderData, allBids] = await Promise.all([
          getBuyerProfile(user.profileId),
          getTenderById(id),
          getBids(),
        ]);

        setBuyer(buyerProfile);
        setTender(tenderData);

        const tenderBids = (allBids || []).filter(
          (bid) => String(bid.tenderId) === String(id)
        );

        setBids(tenderBids);

        const profiles = {};

        await Promise.all(
          tenderBids.map(async (bid) => {
            if (!bid.bidderId) return;

            try {
              const profile = await getBidderProfile(bid.bidderId);
              profiles[bid.bidderId] = profile;
            } catch {
              // Keep monitoring page usable if one bidder profile fails.
            }
          })
        );

        setBidderProfiles(profiles);
      } catch (error) {
        console.error("Failed to load tender monitoring data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, navigate]);

  const publishedBids = useMemo(
    () => bids.filter((bid) => bid.status !== "Draft"),
    [bids]
  );

  const verifiedCount = useMemo(
    () =>
      bids.filter(
        (bid) =>
          bid.status === "Verified" ||
          bid.status === "Under Review" ||
          bid.complianceStatus === "Compliant"
      ).length,
    [bids]
  );

  const clarificationCount = useMemo(
    () =>
      bids.filter(
        (bid) =>
          bid.status === "Clarification Required" ||
          bid.status === "Clarification"
      ).length,
    [bids]
  );

  const averageCompliance = useMemo(() => {
    const scores = bids
      .map((bid) => Number(bid.complianceScore))
      .filter((score) => !Number.isNaN(score));

    if (!scores.length) return 0;

    return Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
  }, [bids]);

  if (loading) {
    return (
      <DashboardLayout role="buyer" userName="Loading...">
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />
            <p className="mt-3 text-sm text-slate-500">
              Loading tender monitoring...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tender) {
    return (
      <DashboardLayout
        role="buyer"
        userName={buyer?.organizationName ?? "Buyer"}
      >
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="mx-auto w-10 h-10 text-amber-600" />

            <h2 className="mt-3 text-lg font-bold text-slate-900">
              Tender not found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The requested tender could not be loaded.
            </p>

            <Button
              variant="primary"
              className="mt-5"
              onClick={() => navigate("/buyer/tenders")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Tenders
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const requirements = [
    {
      label: "Tender document",
      complete: Boolean(tender.pdfUrl || tender.documentUrl),
    },
    {
      label: "Eligibility requirements",
      complete: Boolean(tender.eligibility),
    },
    {
      label: "Technical requirements",
      complete: Boolean(tender.technicalRequirements),
    },
    {
      label: "Commercial requirements",
      complete: Boolean(tender.commercialRequirements),
    },
  ];

  const completedRequirements = requirements.filter(
    (item) => item.complete
  ).length;

  const requirementProgress = Math.round(
    (completedRequirements / requirements.length) * 100
  );

  return (
    <DashboardLayout
      role="buyer"
      userName={buyer?.organizationName ?? "Buyer"}
    >
      {/* HEADER */}
      <div className="mb-5">
        <button
          type="button"
          onClick={() => navigate("/buyer/tenders")}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Tenders
        </button>

        <div className="mt-4 flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-widest uppercase text-blue-700">
                Tender Monitoring
              </span>

              <StatusBadge status={statusColor(tender.status)}>
                {tender.status || "Active"}
              </StatusBadge>
            </div>

            <h1 className="mt-1.5 text-[26px] leading-tight font-bold tracking-tight text-slate-900">
              {tender.title}
            </h1>

            <div className="mt-2 flex items-center gap-4 flex-wrap text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {tender.tenderId}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Deadline: {tender.deadline || "Not specified"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>

            <Button
              variant="primary"
              onClick={() => navigate("/buyer/evaluation")}
            >
              <Gavel className="w-4 h-4" />
              Evaluate Bids
            </Button>
          </div>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-700" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Bids Received
              </p>

              <p className="mt-0.5 text-[24px] leading-none font-bold text-slate-900">
                {publishedBids.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Verified / Reviewed
              </p>

              <p className="mt-0.5 text-[24px] leading-none font-bold text-slate-900">
                {verifiedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock3 className="w-4 h-4 text-amber-700" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Clarifications
              </p>

              <p className="mt-0.5 text-[24px] leading-none font-bold text-slate-900">
                {clarificationCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4 text-indigo-700" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Avg. Compliance
              </p>

              <p className="mt-0.5 text-[24px] leading-none font-bold text-slate-900">
                {averageCompliance || "—"}
                {averageCompliance ? "%" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-4">
        {/* TENDER OVERVIEW */}
        <Card className="col-span-7" title="Tender Overview">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Tender ID
              </p>
              <p className="mt-1 text-[14px] font-semibold text-slate-800">
                {tender.tenderId}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Status
              </p>
              <div className="mt-1">
                <StatusBadge status={statusColor(tender.status)}>
                  {tender.status || "Active"}
                </StatusBadge>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Category
              </p>
              <p className="mt-1 text-[14px] font-semibold text-slate-800">
                {tender.category || "Procurement"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Organization
              </p>
              <p className="mt-1 text-[14px] font-semibold text-slate-800">
                {tender.organization || buyer?.organizationName || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Published On
              </p>
              <p className="mt-1 text-[14px] font-semibold text-slate-800">
                {tender.publishedAt || tender.createdAt || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Bid Deadline
              </p>
              <p className="mt-1 text-[14px] font-semibold text-slate-800">
                {tender.deadline || "—"}
              </p>
            </div>
          </div>
        </Card>

        {/* COMPLIANCE PROGRESS */}
        <Card className="col-span-5" title="Compliance Readiness">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[12px] text-slate-500">
                Tender requirements configured
              </p>
              <p className="mt-1 text-[25px] font-bold text-slate-900">
                {requirementProgress}%
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-700" />
            </div>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 rounded-full transition-all"
              style={{ width: `${requirementProgress}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {requirements.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-1"
              >
                <span className="text-[12px] text-slate-600">
                  {item.label}
                </span>

                {item.complete ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                    <Clock3 className="w-3.5 h-3.5" />
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* BID MONITORING */}
        <Card
          className="col-span-8"
          title="Bid Monitoring"
          action={
            <button
              type="button"
              onClick={() => navigate("/buyer/evaluation")}
              className="text-[12px] font-semibold text-blue-700 hover:text-blue-900"
            >
              Open Evaluation →
            </button>
          }
        >
          {bids.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="mx-auto w-8 h-8 text-slate-300" />
              <p className="mt-3 text-[14px] font-semibold text-slate-700">
                No bids received yet
              </p>
              <p className="mt-1 text-[12px] text-slate-500">
                Bidder submissions will appear here as they are received.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="w-[28%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Bidder
                    </th>
                    <th className="w-[17%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Compliance
                    </th>
                    <th className="w-[17%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Risk
                    </th>
                    <th className="w-[20%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                    <th className="w-[18%] pb-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bids.map((bid) => {
                    const bidder =
                      bidderProfiles[bid.bidderId] || {};

                    const score =
                      bid.complianceScore !== undefined
                        ? `${bid.complianceScore}%`
                        : "—";

                    return (
                      <tr
                        key={bid.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-3 pr-3">
                          <div className="truncate">
                            <p className="text-[12px] font-semibold text-slate-800 truncate">
                              {bidder.companyName ||
                                bidder.organizationName ||
                                bidder.name ||
                                bid.bidderName ||
                                "Bidder"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {bid.bidId || `Bid #${bid.id}`}
                            </p>
                          </div>
                        </td>

                        <td className="py-3">
                          <span className="text-[12px] font-bold text-slate-800">
                            {score}
                          </span>
                        </td>

                        <td className="py-3">
                          <StatusBadge
                            status={riskColor(
                              bid.riskLevel || bid.risk || "Low"
                            )}
                          >
                            {bid.riskLevel || bid.risk || "Low"}
                          </StatusBadge>
                        </td>

                        <td className="py-3">
                          <span className="text-[11px] font-medium text-slate-600">
                            {bid.status || "Under Review"}
                          </span>
                        </td>

                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/buyer/bids/${bid.id}`)
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ACTIVITY */}
        <Card className="col-span-4" title="Recent Activity">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-blue-700" />
              </div>

              <div>
                <p className="text-[12px] font-semibold text-slate-800">
                  Tender monitoring opened
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Current tender workspace
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-emerald-700" />
              </div>

              <div>
                <p className="text-[12px] font-semibold text-slate-800">
                  {publishedBids.length} bid
                  {publishedBids.length === 1 ? "" : "s"} received
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Submissions available for review
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Clock3 className="w-4 h-4 text-amber-700" />
              </div>

              <div>
                <p className="text-[12px] font-semibold text-slate-800">
                  {clarificationCount} clarification
                  {clarificationCount === 1 ? "" : "s"}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Requires buyer attention
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
              </div>

              <div>
                <p className="text-[12px] font-semibold text-slate-800">
                  Compliance review in progress
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  AI-assisted evidence verification
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="mt-4 bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-bold text-slate-800">
            Need to inspect bidder compliance?
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Review submitted bids and supporting evidence before evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            onClick={() => navigate("/buyer/tenders")}
          >
            <ArrowLeft className="w-4 h-4" />
            My Tenders
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate("/buyer/evaluation")}
          >
            <Gavel className="w-4 h-4" />
            Open Evaluation
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}