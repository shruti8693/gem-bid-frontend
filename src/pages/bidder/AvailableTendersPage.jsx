import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  CalendarDays,
  IndianRupee,
  ClipboardCheck,
  ArrowRight,
  Search,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import { getTenders, getBidderProfile } from "../../services/api";

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

export default function AvailableTendersPage() {
  const navigate = useNavigate();

  const [bidder, setBidder] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getTenders(),
    ])
      .then(([bidderProfile, allTenders]) => {
        setBidder(bidderProfile);

        // Bidders only see Published tenders.
        setTenders(
          allTenders.filter((t) => t.status === "Published")
        );
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const filteredTenders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return tenders;

    return tenders.filter((tender) =>
      [
        tender.tenderId,
        tender.title,
        tender.description,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [tenders, search]);

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-700" />
              </div>

              <div>
                <h1 className="text-[27px] leading-tight font-bold text-slate-900">
                  Available Tenders
                </h1>

                <p className="text-[13px] text-slate-500 mt-1">
                  Browse published procurement opportunities available for bidding.
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          {!loading && tenders.length > 0 && (
            <div className="w-full lg:w-[300px]">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tenders..."
                  className="w-full bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Published Tenders
                </p>

                <p className="text-[28px] font-bold text-slate-900 mt-1">
                  {tenders.length}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Showing
                </p>

                <p className="text-[28px] font-bold text-blue-700 mt-1">
                  {filteredTenders.length}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Search className="w-5 h-5 text-indigo-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Bidder Status
                </p>

                <p className="text-[16px] font-bold text-emerald-700 mt-2">
                  Ready to Bid
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-700 animate-spin" />

            <p className="mt-4 text-[13px] font-medium text-slate-600">
              Loading available tenders...
            </p>
          </div>
        </Card>
      ) : filteredTenders.length === 0 ? (
        <Card className="p-10">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-slate-400" />
            </div>

            <h2 className="mt-4 text-[16px] font-bold text-slate-900">
              {tenders.length === 0
                ? "No tenders available"
                : "No matching tenders"}
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              {tenders.length === 0
                ? "There are no published tenders available right now. Check back later."
                : "Try changing your search to find another tender."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 text-[12px] font-semibold text-blue-700 hover:text-blue-900"
              >
                Clear Search
              </button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTenders.map((tender) => {
            const requiredDocCount = [
              tender.requireCompanyRegistration,
              tender.requireGST,
              tender.requirePAN,
              tender.requireExperience,
              tender.requireFinancial,
              tender.requireTechnical,
              tender.requireISO,
              tender.requireBIS,
            ].filter(Boolean).length;

            return (
              <Card
                key={tender.id}
                className="p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                  {/* Tender information */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-blue-700" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                          {tender.tenderId}
                        </span>

                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                          Published
                        </span>
                      </div>

                      <h2 className="text-[15px] font-bold text-slate-900 mt-2">
                        {tender.title}
                      </h2>

                      {tender.description && (
                        <p className="text-[12px] leading-5 text-slate-500 mt-1 max-w-3xl line-clamp-2">
                          {tender.description}
                        </p>
                      )}

                      {/* Tender metadata */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />

                          <span className="text-[11px] text-slate-500">
                            Deadline:
                          </span>

                          <span className="text-[11px] font-semibold text-slate-800">
                            {tender.deadline}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <ClipboardCheck className="w-3.5 h-3.5 text-slate-400" />

                          <span className="text-[11px] text-slate-500">
                            Requirements:
                          </span>

                          <span className="text-[11px] font-semibold text-slate-800">
                            {requiredDocCount}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <IndianRupee className="w-3.5 h-3.5 text-slate-400" />

                          <span className="text-[11px] text-slate-500">
                            Estimated:
                          </span>

                          <span className="text-[11px] font-semibold text-slate-800">
                            {formatCurrency(tender.estimatedValue)}
                          </span>
                        </div>
                      </div>

                      {/* Eligibility */}
                      <div className="flex items-center gap-2 mt-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                        <span className="text-[12px] font-semibold text-emerald-700">
                          You appear eligible based on your current profile
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-end xl:min-w-[145px]">
                    <Button
                      variant="primary"
                      className="w-full xl:w-auto"
                      onClick={() =>
                        navigate(`/bidder/tenders/${tender.id}`)
                      }
                    >
                      View Tender
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      {!loading && filteredTenders.length > 0 && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

            <p className="text-[12px] leading-5 text-blue-900">
              BidSure uses your registered bidder information to provide an
              initial eligibility indication. Final tender qualification
              depends on the complete bid verification process.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}