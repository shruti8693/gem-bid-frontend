import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Gavel,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Eye,
  ArrowRight,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";

import { getCurrentUser } from "../../utils/auth";
import {
  getBids,
  getBidderProfile,
  getTenderById,
  getOfficerProfile,
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

export default function BidListPage() {
  const navigate = useNavigate();

  const [officer, setOfficer] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    Promise.all([getOfficerProfile(user.profileId), getBids()])
      .then(async ([officerProfile, bids]) => {
        setOfficer(officerProfile);

        const enriched = await Promise.all(
          bids.map(async (bid) => {
            const [bidder, tender] = await Promise.all([
              getBidderProfile(bid.bidderId).catch(() => null),
              getTenderById(bid.tenderId).catch(() => null),
            ]);

            return {
              ...bid,
              bidderName: bidder?.companyName ?? bid.bidderId,
              tenderTitle: tender?.title ?? bid.tenderId,
            };
          })
        );

        setRows(enriched);
      })
      .catch((error) => {
        console.error("Failed to load bids:", error);
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase().trim();

    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        row.bidderName?.toLowerCase().includes(query) ||
        row.tenderTitle?.toLowerCase().includes(query) ||
        String(row.id).toLowerCase().includes(query);

      const matchesRisk =
        riskFilter === "All" || row.riskLevel === riskFilter;

      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [rows, search, riskFilter, statusFilter]);

  const lowRisk = rows.filter(
    (row) => row.riskLevel === "LOW"
  ).length;

  const mediumRisk = rows.filter(
    (row) => row.riskLevel === "MEDIUM"
  ).length;

  const highRisk = rows.filter(
    (row) => row.riskLevel === "HIGH"
  ).length;

  const pendingReview = rows.filter(
    (row) =>
      !row.status ||
      row.status === "Under Review" ||
      row.status === "Submitted"
  ).length;

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
            Procurement Review
          </p>

          <h1 className="mt-1 text-[27px] leading-tight font-bold tracking-tight text-slate-900">
            Bid Review Center
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Review submitted bids, compliance scores and risk indicators
            across your tenders.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/officer/evaluation")}
        >
          <Gavel className="w-4 h-4" />
          Compare Bids
        </Button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Gavel className="w-4 h-4 text-blue-700" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Total Bids
              </p>

              <p className="mt-1 text-[24px] leading-none font-bold text-slate-900">
                {rows.length}
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
                Low Risk
              </p>

              <p className="mt-1 text-[24px] leading-none font-bold text-slate-900">
                {lowRisk}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Medium Risk
              </p>

              <p className="mt-1 text-[24px] leading-none font-bold text-slate-900">
                {mediumRisk}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
              <ShieldX className="w-4 h-4 text-red-700" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                High Risk
              </p>

              <p className="mt-1 text-[24px] leading-none font-bold text-slate-900">
                {highRisk}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3 mb-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bidder, tender or bid ID..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 bg-slate-50 text-[12px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-[12px] font-semibold text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Risks</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-[12px] font-semibold text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Clarification Requested">
              Clarification Requested
            </option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* BID TABLE */}
      {loading ? (
        <Card>
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-9 h-9 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />

              <p className="mt-3 text-sm text-slate-500">
                Loading bids...
              </p>
            </div>
          </div>
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <Gavel className="mx-auto w-9 h-9 text-slate-300" />

            <h2 className="mt-3 text-[15px] font-bold text-slate-800">
              No bids submitted yet
            </h2>

            <p className="mt-1 text-[12px] text-slate-500">
              Bid submissions will appear here when they are received.
            </p>
          </div>
        </Card>
      ) : filteredRows.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <Search className="mx-auto w-8 h-8 text-slate-300" />

            <h2 className="mt-3 text-[15px] font-bold text-slate-800">
              No matching bids
            </h2>

            <p className="mt-1 text-[12px] text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        </Card>
      ) : (
        <Card
          title={`Submitted Bids (${filteredRows.length})`}
          action={
            <span className="text-[11px] text-slate-400">
              {pendingReview} awaiting review
            </span>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-[23%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Bidder
                  </th>

                  <th className="w-[25%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Tender
                  </th>

                  <th className="w-[13%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Compliance
                  </th>

                  <th className="w-[12%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Risk
                  </th>

                  <th className="w-[17%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="w-[10%] pb-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        className="text-left group"
                        onClick={() =>
                          navigate(`/officer/bids/${row.id}`)
                        }
                      >
                        <p className="text-[12px] font-bold text-slate-800 group-hover:text-blue-700 truncate">
                          {row.bidderName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Bid #{row.id}
                        </p>
                      </button>
                    </td>

                    <td className="py-3 pr-3">
                      <p className="text-[12px] font-medium text-slate-700 truncate">
                        {row.tenderTitle}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Tender submission
                      </p>
                    </td>

                    <td className="py-3">
                      <span className="text-[13px] font-bold text-slate-800">
                        {row.complianceScore ?? "—"}
                        {row.complianceScore !== undefined ? "%" : ""}
                      </span>
                    </td>

                    <td className="py-3">
                      <StatusBadge
                        status={riskColor(row.riskLevel)}
                      >
                        {row.riskLevel || "UNKNOWN"}
                      </StatusBadge>
                    </td>

                    <td className="py-3">
                      <StatusBadge
                        status={statusColor(row.status)}
                      >
                        {row.status || "Under Review"}
                      </StatusBadge>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/officer/bids/${row.id}`)
                        }
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
      )}

      {/* COMPLIANCE X-RAY PROMPT */}
      {!loading && rows.length > 0 && (
        <div className="mt-4 bg-slate-900 rounded-xl px-5 py-4 flex items-center justify-between gap-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="text-[13px] font-bold text-white">
                Need evidence before making a decision?
              </p>

              <p className="mt-0.5 text-[11px] text-slate-300">
                Open a bid to inspect its compliance evidence and use
                Compliance X-Ray for requirement-level verification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/officer/bids/${filteredRows[0]?.id}`)
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-900 text-[12px] font-bold hover:bg-slate-100 transition-colors shrink-0"
          >
            Open Bid Review
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}