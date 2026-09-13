import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck2,
  Search,
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  Eye,
  ArrowLeft,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";

import { getCurrentUser } from "../../utils/auth";
import {
  getOfficerProfile,
  getBids,
  getBidderProfile,
  getTenderById,
} from "../../services/api";

function riskColor(level) {
  if (level === "LOW") return "green";
  if (level === "MEDIUM") return "amber";
  return "red";
}

function statusColor(status) {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "red";
  return "amber";
}

export default function ComplianceReportsPage() {
  const navigate = useNavigate();

  const [officer, setOfficer] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    getOfficerProfile(user.profileId).then(setOfficer);

    getBids()
      .then(async (bids) => {
        const enriched = await Promise.all(
          bids.map(async (bid) => {
            const [bidder, tender] = await Promise.all([
              getBidderProfile(bid.bidderId).catch(() => null),
              getTenderById(bid.tenderId).catch(() => null),
            ]);

            return {
              ...bid,
              bidder,
              tender,
            };
          })
        );

        setReports(enriched);
      })
      .catch(() => {
        setReports([]);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return reports;

    return reports.filter((report) => {
      const bidderName =
        report.bidder?.companyName?.toLowerCase() ?? "";

      const tenderName =
        report.tender?.title?.toLowerCase() ?? "";

      const tenderId =
        report.tender?.tenderId?.toLowerCase() ?? "";

      const bidId =
        report.id?.toLowerCase() ?? "";

      return (
        bidderName.includes(query) ||
        tenderName.includes(query) ||
        tenderId.includes(query) ||
        bidId.includes(query)
      );
    });
  }, [reports, search]);

  const stats = useMemo(() => {
    return {
      total: reports.length,

      review: reports.filter(
        (report) =>
          report.status === "Under Review" ||
          report.riskLevel === "MEDIUM"
      ).length,

      highCompliance: reports.filter(
        (report) => Number(report.complianceScore) >= 90
      ).length,

      highRisk: reports.filter(
        (report) => report.riskLevel === "HIGH"
      ).length,
    };
  }, [reports]);

  if (loading) {
    return (
      <DashboardLayout
        role="officer"
        userName={officer?.fullName ?? "Officer"}
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto w-9 h-9 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />

            <p className="mt-3 text-[12px] text-slate-500">
              Loading compliance reports...
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
      <div className="mb-5">
        <button
          type="button"
          onClick={() => navigate("/officer/dashboard")}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5 text-blue-700" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-blue-700">
                Evidence & Verification
              </p>

              <h1 className="text-[26px] leading-tight font-bold text-slate-900">
                Compliance Reports
              </h1>

              <p className="mt-1.5 text-[12px] text-slate-500">
                Review evidence-backed compliance reports for submitted
                bids.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-100 bg-emerald-50">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />

            <span className="text-[11px] font-semibold text-emerald-700">
              Evidence verified
            </span>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <SummaryCard
          label="Total Reports"
          value={stats.total}
          icon={FileCheck2}
          tone="blue"
        />

        <SummaryCard
          label="Review Required"
          value={stats.review}
          icon={AlertTriangle}
          tone="amber"
        />

        <SummaryCard
          label="High Compliance"
          value={stats.highCompliance}
          icon={ShieldCheck}
          tone="green"
        />

        <SummaryCard
          label="High Risk"
          value={stats.highRisk}
          icon={FileWarning}
          tone="red"
        />
      </div>

      {/* REPORT CENTER */}
      <Card
        title="Bid Compliance Reports"
        action={
          <span className="text-[10px] text-slate-400">
            Evidence-backed bid assessment
          </span>
        }
      >
        {/* SEARCH BAR */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="relative w-full max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bidder, tender or bid ID..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-[11px] text-slate-400 whitespace-nowrap">
            {filteredReports.length} report
            {filteredReports.length === 1 ? "" : "s"} found
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="py-14 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <FileCheck2 className="w-6 h-6 text-slate-400" />
            </div>

            <p className="mt-3 text-[13px] font-bold text-slate-700">
              No compliance reports available
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Reports will appear once bids are submitted.
            </p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-12 text-center">
            <Search className="w-7 h-7 mx-auto text-slate-300" />

            <p className="mt-3 text-[13px] font-bold text-slate-700">
              No matching reports
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Try searching for a different bidder or tender.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="w-[23%] px-4 py-3 text-left text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Bidder
                  </th>

                  <th className="w-[25%] px-4 py-3 text-left text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Tender
                  </th>

                  <th className="w-[13%] px-4 py-3 text-center text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Compliance
                  </th>

                  <th className="w-[12%] px-4 py-3 text-center text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Risk
                  </th>

                  <th className="w-[13%] px-4 py-3 text-center text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Status
                  </th>

                  <th className="w-[14%] px-4 py-3 text-center text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Evidence
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* BIDDER */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-700 shrink-0">
                          BID
                        </div>

                        <div className="min-w-0">
                          <p
                            className="text-[12px] font-bold text-slate-800 truncate"
                            title={
                              report.bidder?.companyName
                            }
                          >
                            {report.bidder?.companyName ??
                              "Unknown Bidder"}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {report.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* TENDER */}
                    <td className="px-4 py-4">
                      <p
                        className="text-[11px] font-semibold text-slate-700 truncate max-w-[280px]"
                        title={report.tender?.title}
                      >
                        {report.tender?.title ??
                          "Unknown Tender"}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {report.tender?.tenderId ?? "-"}
                      </p>
                    </td>

                    {/* COMPLIANCE */}
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`text-[18px] font-bold ${
                            Number(
                              report.complianceScore
                            ) >= 90
                              ? "text-emerald-700"
                              : Number(
                                  report.complianceScore
                                ) >= 65
                              ? "text-amber-700"
                              : "text-red-700"
                          }`}
                        >
                          {report.complianceScore}%
                        </span>

                        <span className="text-[9px] text-slate-400">
                          score
                        </span>
                      </div>
                    </td>

                    {/* RISK */}
                    <td className="px-4 py-4 text-center">
                      <StatusBadge
                        status={riskColor(
                          report.riskLevel
                        )}
                      >
                        {report.riskLevel}
                      </StatusBadge>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4 text-center">
                      <StatusBadge
                        status={statusColor(
                          report.status
                        )}
                      >
                        {report.status}
                      </StatusBadge>
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-4 text-center">
                      <Button
                        variant="secondary"
                        className="!px-3 !py-2 text-[11px]"
                        onClick={() =>
                          navigate(
                            `/officer/bids/${report.id}/compliance-xray`
                          )
                        }
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View X-Ray
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* AUDIT / HUMAN DECISION NOTE */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />

            <div>
              <p className="text-[12px] font-bold text-slate-800">
                Evidence-backed review
              </p>

              <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                Each report can be traced back to the bidder's
                submitted evidence and verification findings through
                Compliance X-Ray.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />

            <div>
              <p className="text-[12px] font-bold text-slate-800">
                Human-in-the-loop decision
              </p>

              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                AI provides decision support only. The authorized
                Procurement Officer remains the final decision-maker.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}) {
  const styles = {
    blue: {
      box: "bg-blue-50",
      icon: "text-blue-700",
    },
    green: {
      box: "bg-emerald-50",
      icon: "text-emerald-700",
    },
    amber: {
      box: "bg-amber-50",
      icon: "text-amber-700",
    },
    red: {
      box: "bg-red-50",
      icon: "text-red-700",
    },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${styles[tone].box}`}
        >
          <Icon
            className={`w-4 h-4 ${styles[tone].icon}`}
          />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-[23px] leading-none font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}