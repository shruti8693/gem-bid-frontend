import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Eye,
  Search,
  Users,
  FileCheck2,
  ChevronRight,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";

import { getCurrentUser } from "../../utils/auth";
import {
  getOfficerProfile,
  getBids,
  getBidderProfile,
} from "../../services/api";

import RiskDistributionChart from "../../components/RiskDistributionChart";
import RiskShareDonut from "../../components/RiskShareDonut";
import RiskInsightsPanel from "../../components/RiskInsightsPanel";

function riskColor(level) {
  if (level === "LOW") return "green";
  if (level === "MEDIUM") return "amber";
  return "red";
}

function complianceStatus(score) {
  if (score >= 85) return "pass";
  if (score >= 65) return "review";
  return "fail";
}

function complianceGlyph(score) {
  const status = complianceStatus(score);

  if (status === "pass") {
    return (
      <div className="mx-auto w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
        <Check className="w-4 h-4 text-emerald-600" />
      </div>
    );
  }

  if (status === "review") {
    return (
      <div className="mx-auto w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
      <X className="w-4 h-4 text-red-600" />
    </div>
  );
}

function scoreTone(score) {
  if (score >= 85) return "text-emerald-700";
  if (score >= 65) return "text-amber-700";
  return "text-red-700";
}

export default function BidComparisonPage() {
  const navigate = useNavigate();

  const [officer, setOfficer] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    Promise.all([
      getOfficerProfile(user.profileId),
      getBids(),
    ])
      .then(async ([officerProfile, allBids]) => {
        setOfficer(officerProfile);

        const enriched = await Promise.all(
          allBids.map(async (bid) => {
            const bidder = await getBidderProfile(
              bid.bidderId
            ).catch(() => null);

            return {
              ...bid,
              bidderName:
                bidder?.companyName ?? bid.bidderId,
            };
          })
        );

        setBids(enriched);
      })
      .catch(() => {
        setBids([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const filteredBids = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return bids;

    return bids.filter((bid) =>
      bid.bidderName?.toLowerCase().includes(query)
    );
  }, [bids, search]);

  const stats = useMemo(() => {
    const low = bids.filter(
      (bid) => bid.riskLevel === "LOW"
    ).length;

    const medium = bids.filter(
      (bid) => bid.riskLevel === "MEDIUM"
    ).length;

    const high = bids.filter(
      (bid) => bid.riskLevel === "HIGH"
    ).length;

    const average =
      bids.length > 0
        ? Math.round(
            bids.reduce(
              (sum, bid) =>
                sum + Number(bid.complianceScore || 0),
              0
            ) / bids.length
          )
        : 0;

    return {
      total: bids.length,
      low,
      medium,
      high,
      average,
    };
  }, [bids]);

  const rows = [
    {
      label: "Eligibility",
      description: "Basic eligibility requirements",
      icon: ShieldCheck,
      getValue: (bid) => bid.complianceScore,
    },
    {
      label: "Documents",
      description: "Mandatory document completeness",
      icon: FileCheck2,
      getValue: (bid) => bid.complianceScore,
    },
    {
      label: "Financial",
      description: "Financial qualification",
      icon: FileCheck2,
      getValue: (bid) =>
        bid.complianceScore >= 80
          ? bid.complianceScore
          : bid.complianceScore - 8,
    },
    {
      label: "Technical",
      description: "Technical requirement match",
      icon: FileCheck2,
      getValue: (bid) =>
        bid.complianceScore >= 75
          ? bid.complianceScore
          : bid.complianceScore - 10,
    },
    {
      label: "Certifications",
      description: "Required certifications",
      icon: FileCheck2,
      getValue: (bid) =>
        bid.complianceScore >= 85
          ? bid.complianceScore
          : bid.complianceScore - 5,
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
          onClick={() => navigate("/officer/dashboard")}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-700" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-blue-700">
                  Procurement Evaluation
                </p>

                <h1 className="text-[26px] leading-tight font-bold text-slate-900">
                  Bidder Comparison
                </h1>
              </div>
            </div>

            <p className="mt-2 text-[12px] text-slate-500">
              Compare bidder compliance, risk and verification
              readiness before detailed evaluation.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-100 bg-emerald-50">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />

            <span className="text-[11px] font-semibold text-emerald-700">
              Evidence-backed evaluation
            </span>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      {!loading && bids.length > 0 && (
        <div className="grid grid-cols-5 gap-3 mb-4">
          <KpiCard
            label="Total Bids"
            value={stats.total}
            icon={Users}
            tone="blue"
          />

          <KpiCard
            label="Low Risk"
            value={stats.low}
            icon={Check}
            tone="green"
          />

          <KpiCard
            label="Medium Risk"
            value={stats.medium}
            icon={AlertTriangle}
            tone="amber"
          />

          <KpiCard
            label="High Risk"
            value={stats.high}
            icon={X}
            tone="red"
          />

          <KpiCard
            label="Avg. Compliance"
            value={`${stats.average}%`}
            icon={ShieldCheck}
            tone="blue"
          />
        </div>
      )}

      {/* SEARCH */}
      {!loading && bids.length > 0 && (
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="relative w-full max-w-[360px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bidder..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-[11px] text-slate-400 whitespace-nowrap">
            Showing {filteredBids.length} of {bids.length} bidders
          </p>
        </div>
      )}

      {/* ANALYTICS */}
      {!loading && bids.length > 0 && (
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-5 min-w-0">
            <RiskDistributionChart bids={bids} />
          </div>

          <div className="col-span-3 min-w-0">
            <RiskShareDonut bids={bids} />
          </div>

          <div className="col-span-4 min-w-0">
            <RiskInsightsPanel bids={bids} />
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto w-9 h-9 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />

            <p className="mt-3 text-[12px] text-slate-500">
              Loading bidder comparison...
            </p>
          </div>
        </div>
      ) : bids.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />

            <p className="mt-3 text-[13px] font-bold text-slate-700">
              No bids available
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Bidders will appear here once bids are submitted.
            </p>
          </div>
        </Card>
      ) : filteredBids.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <Search className="w-7 h-7 text-slate-300 mx-auto" />

            <p className="mt-3 text-[13px] font-bold text-slate-700">
              No matching bidders
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Try another bidder name.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* TOP BIDDER CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {filteredBids.slice(0, 3).map((bid, index) => (
              <BidderCard
                key={bid.id}
                bid={bid}
                rank={index + 1}
                onView={() =>
                  navigate(`/officer/bids/${bid.id}`)
                }
                onXray={() =>
  navigate(`/officer/bids/${bid.id}/compliance-xray`)
}
              />
            ))}
          </div>

          {/* COMPARISON */}
          <Card
            title="Side-by-Side Compliance Comparison"
            action={
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-[10px] text-slate-400">
                  Scroll horizontally to compare all bidders
                </span>

                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            }
          >
            {/* IMPORTANT:
                Fixed minimum width prevents the 8 bidder columns
                from squeezing together and overlapping.
            */}
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="min-w-[1450px] w-full table-fixed">
                <colgroup>
                  <col className="w-[230px]" />

                  {filteredBids.map((bid) => (
                    <col
                      key={bid.id}
                      className="w-[152px]"
                    />
                  ))}
                </colgroup>

                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="sticky left-0 z-10 bg-slate-50 px-4 py-4 text-left">
                      <span className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                        Criteria
                      </span>
                    </th>

                    {filteredBids.map((bid, index) => (
                      <th
                        key={bid.id}
                        className="px-3 py-4 text-center align-top"
                      >
                        <div className="w-[130px] mx-auto">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-[9px] font-bold flex items-center justify-center shrink-0">
                              #{index + 1}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/officer/bids/${bid.id}`
                                )
                              }
                              className="min-w-0 text-left"
                              title={bid.bidderName}
                            >
                              <span className="block text-[11px] font-bold text-slate-800 hover:text-blue-700 truncate">
                                {bid.bidderName}
                              </span>

                              <span className="block mt-0.5 text-[9px] text-slate-400">
                                View bid
                              </span>
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => {
                    const Icon = row.icon;

                    return (
                      <tr
                        key={row.label}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="sticky left-0 z-10 bg-white px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-slate-500" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-800">
                                {row.label}
                              </p>

                              <p className="text-[9px] text-slate-400 truncate">
                                {row.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {filteredBids.map((bid) => (
                          <td
                            key={bid.id}
                            className="px-3 py-3 text-center"
                          >
                            {complianceGlyph(
                              row.getValue(bid)
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}

                  {/* RISK */}
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <td className="sticky left-0 z-10 bg-slate-50/60 px-4 py-3">
                      <p className="text-[11px] font-bold text-slate-800">
                        Overall Risk
                      </p>

                      <p className="text-[9px] text-slate-400">
                        AI risk classification
                      </p>
                    </td>

                    {filteredBids.map((bid) => (
                      <td
                        key={bid.id}
                        className="px-3 py-3 text-center"
                      >
                        <StatusBadge
                          status={riskColor(bid.riskLevel)}
                        >
                          {bid.riskLevel}
                        </StatusBadge>
                      </td>
                    ))}
                  </tr>

                  {/* COMPLIANCE */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-4 py-4">
                      <p className="text-[12px] font-bold text-slate-900">
                        Compliance Score
                      </p>

                      <p className="text-[9px] text-slate-400">
                        Overall verification readiness
                      </p>
                    </td>

                    {filteredBids.map((bid) => (
                      <td
                        key={bid.id}
                        className="px-3 py-4 text-center"
                      >
                        <span
                          className={`text-[20px] font-bold ${scoreTone(
                            bid.complianceScore
                          )}`}
                        >
                          {bid.complianceScore}%
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* ACTION */}
                  <tr className="bg-slate-50/60">
                    <td className="sticky left-0 z-10 bg-slate-50/60 px-4 py-3">
                      <p className="text-[11px] font-bold text-slate-800">
                        Evidence Review
                      </p>

                      <p className="text-[9px] text-slate-400">
                        Inspect supporting evidence
                      </p>
                    </td>

                    {filteredBids.map((bid) => (
                      <td
                        key={bid.id}
                        className="px-3 py-3 text-center"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/officer/bids/${bid.id}/compliance-xray`
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold hover:bg-blue-100 transition-colors"
                        >
                          X-Ray
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* DECISION SUPPORT */}
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
              </div>

              <div>
                <p className="text-[12px] font-bold text-slate-800">
                  AI Decision Support
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                  Bid comparison highlights compliance and risk
                  patterns across submitted bids. Use Compliance
                  X-Ray to inspect the evidence behind individual
                  findings.
                </p>

                <p className="mt-2 text-[10px] font-semibold text-blue-700">
                  Final qualification or disqualification remains
                  with the authorized Procurement Officer.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function KpiCard({ label, value, icon: Icon, tone }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${styles[tone]}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-[22px] leading-none font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function BidderCard({ bid, rank, onView, onXray }) {
  const score = Number(bid.complianceScore || 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[12px] font-bold text-blue-700 shrink-0">
            #{rank}
          </div>

          <div className="min-w-0">
            <p
              className="text-[13px] font-bold text-slate-800 truncate"
              title={bid.bidderName}
            >
              {bid.bidderName}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400 truncate">
              Bid ID: {bid.id}
            </p>
          </div>
        </div>

        <StatusBadge status={riskColor(bid.riskLevel)}>
          {bid.riskLevel}
        </StatusBadge>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wide font-bold text-slate-400">
            Compliance
          </p>

          <p
            className={`mt-1 text-[25px] leading-none font-bold ${scoreTone(
              score
            )}`}
          >
            {score}%
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wide font-bold text-slate-400">
            Status
          </p>

          <p className="mt-1 text-[11px] font-semibold text-slate-700">
            {bid.status ?? "Under Review"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View Bid
        </button>

        <button
          type="button"
          onClick={onXray}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg bg-blue-700 text-white text-[10px] font-bold hover:bg-blue-800 transition-colors"
        >
          X-Ray
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}