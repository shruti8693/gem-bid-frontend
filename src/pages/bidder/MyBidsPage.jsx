import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gavel,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock3,
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { getCurrentUser } from "../../utils/auth";
import {
  getBids,
  getTenderById,
  getBidderProfile,
} from "../../services/api";

function statusColor(status) {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "red";
  if (status === "Clarification Requested") return "amber";
  return "neutral";
}

function getStatusIcon(status) {
  if (status === "Approved") return CheckCircle2;
  if (status === "Rejected") return XCircle;
  if (status === "Clarification Requested") return AlertTriangle;
  return Clock3;
}

function getStatusStyle(status) {
  if (status === "Approved") {
    return {
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    };
  }

  if (status === "Rejected") {
    return {
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    };
  }

  if (status === "Clarification Requested") {
    return {
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    };
  }

  return {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  };
}

export default function MyBidsPage() {
  const navigate = useNavigate();

  const [bidder, setBidder] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getBids({ bidderId: user.profileId }),
    ])
      .then(async ([bidderProfile, bids]) => {
        setBidder(bidderProfile);

        const enriched = await Promise.all(
          bids.map(async (bid) => {
            const tender = await getTenderById(bid.tenderId).catch(
              () => null
            );

            return {
              ...bid,
              tenderTitle: tender?.title ?? bid.tenderId,
              tenderId: tender?.tenderId ?? bid.tenderId,
              deadline: tender?.deadline ?? null,
            };
          })
        );

        setRows(enriched);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const summary = useMemo(() => {
    return {
      total: rows.length,
      approved: rows.filter((b) => b.status === "Approved").length,
      clarification: rows.filter(
        (b) => b.status === "Clarification Requested"
      ).length,
      underReview: rows.filter(
        (b) =>
          b.status !== "Approved" &&
          b.status !== "Rejected" &&
          b.status !== "Clarification Requested"
      ).length,
    };
  }, [rows]);

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Gavel className="w-5 h-5 text-blue-700" />
          </div>

          <div>
            <h1 className="text-[27px] leading-tight font-bold text-slate-900">
              My Bids
            </h1>

            <p className="text-[13px] text-slate-500 mt-1">
              Track submitted bids, compliance status and procurement decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Total Bids
                </p>

                <p className="text-[28px] font-bold text-slate-900 mt-1">
                  {summary.total}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Under Review
                </p>

                <p className="text-[28px] font-bold text-blue-700 mt-1">
                  {summary.underReview}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Clarification
                </p>

                <p className="text-[28px] font-bold text-amber-700 mt-1">
                  {summary.clarification}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Approved
                </p>

                <p className="text-[28px] font-bold text-emerald-700 mt-1">
                  {summary.approved}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-700 animate-spin" />

            <p className="mt-4 text-[13px] font-medium text-slate-600">
              Loading your bids...
            </p>
          </div>
        </Card>
      ) : rows.length === 0 ? (
        <Card className="p-10">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <Gavel className="w-7 h-7 text-slate-400" />
            </div>

            <h2 className="mt-4 text-[16px] font-bold text-slate-900">
              No bids submitted yet
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              Browse available tenders and submit your first bid.
            </p>

            <button
              type="button"
              onClick={() => navigate("/bidder/tenders")}
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-blue-700 text-white text-[13px] font-semibold hover:bg-blue-800 transition-colors"
            >
              Browse Tenders
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((bid) => {
            const StatusIcon = getStatusIcon(bid.status);
            const style = getStatusStyle(bid.status);

            return (
              <Card
                key={bid.id}
                className="p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                  {/* Bid information */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}
                    >
                      <StatusIcon
                        className={`w-5 h-5 ${style.iconColor}`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[15px] font-bold text-slate-900 truncate">
                          {bid.tenderTitle}
                        </h2>

                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {bid.tenderId}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <span className="text-[12px] text-slate-500">
                          Compliance{" "}
                          <strong className="text-slate-800">
                            {bid.complianceScore}%
                          </strong>
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="text-[12px] text-slate-500">
                          Risk{" "}
                          <strong
                            className={
                              bid.riskLevel === "LOW"
                                ? "text-emerald-700"
                                : bid.riskLevel === "MEDIUM"
                                ? "text-amber-700"
                                : "text-red-700"
                            }
                          >
                            {bid.riskLevel}
                          </strong>
                        </span>

                        {bid.deadline && (
                          <>
                            <span className="text-slate-300">•</span>

                            <span className="text-[12px] text-slate-500">
                              Deadline{" "}
                              <strong className="text-slate-800">
                                {bid.deadline}
                              </strong>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compliance score */}
                  <div className="flex items-center gap-3 xl:border-l xl:border-slate-100 xl:pl-5">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                        Compliance
                      </p>

                      <p
                        className={`text-[20px] font-bold ${
                          bid.complianceScore >= 85
                            ? "text-emerald-700"
                            : bid.complianceScore >= 65
                            ? "text-amber-700"
                            : "text-red-700"
                        }`}
                      >
                        {bid.complianceScore}%
                      </p>
                    </div>
                  </div>

                  {/* Status + action */}
                  <div className="flex items-center justify-between xl:justify-end gap-4 xl:min-w-[230px]">
                    <StatusBadge status={statusColor(bid.status)}>
                      {bid.status}
                    </StatusBadge>

                    {bid.status === "Clarification Requested" ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700 hover:text-blue-900"
                        onClick={() =>
                          navigate(
                            `/bidder/bids/${bid.id}/clarification`
                          )
                        }
                      >
                        View Request
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700 hover:text-blue-900"
                        onClick={() =>
                          navigate(`/bidder/bids/${bid.id}/report`)
                        }
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        View Report
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Information note */}
      {!loading && rows.length > 0 && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <div className="flex items-start gap-3">
            <FileCheck2 className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

            <p className="text-[12px] leading-5 text-blue-900">
              BidSure keeps your submitted bid status, compliance score and
              review information available for tracking. Clarification
              requests can be opened directly from this page.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}