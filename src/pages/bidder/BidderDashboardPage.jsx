import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Gavel,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Search,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import { getCurrentUser } from "../../utils/auth";
import { getBidderProfile } from "../../services/api";


/* ============================================================
   SUMMARY CARDS
============================================================ */

const SUMMARY_CARDS = [
  {
    label: "Active Tenders",
    value: "08",
    description: "Currently open",
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    accent: "border-blue-600",
  },
  {
    label: "Bids Submitted",
    value: "03",
    description: "Across active tenders",
    icon: Gavel,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    accent: "border-emerald-600",
  },
  {
    label: "Under Review",
    value: "02",
    description: "Awaiting evaluation",
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    accent: "border-amber-500",
  },
  {
    label: "Compliance",
    value: "92%",
    description: "Good standing",
    icon: ShieldCheck,
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    accent: "border-green-600",
  },
];


/* ============================================================
   RECOMMENDED TENDERS
============================================================ */

const RECOMMENDED_TENDERS = [
  {
    id: "CPCL/2026/104",
    title: "Crude Oil Supply",
    deadline: "25 Sep 2026",
    status: "Open",
    statusType: "open",
  },
  {
    id: "CPCL/2026/091",
    title: "Pipeline Maintenance",
    deadline: "30 Sep 2026",
    status: "Open",
    statusType: "open",
  },
  {
    id: "CPCL/2026/087",
    title: "Equipment Procurement",
    deadline: "15 Oct 2026",
    status: "New",
    statusType: "new",
  },
];


/* ============================================================
   MAIN PAGE
============================================================ */

export default function BidderDashboardPage() {
  const navigate = useNavigate();

  const [bidder, setBidder] = useState(null);
  const [loading, setLoading] = useState(true);


  /* ============================================================
     AUTH + PROFILE
  ============================================================ */

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    getBidderProfile(user.profileId)
      .then(setBidder)
      .catch(() => setBidder(null))
      .finally(() => setLoading(false));
  }, [navigate]);


  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <DashboardLayout role="bidder" userName="Loading...">
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }


  const companyName = bidder?.companyName ?? "Bidder";


  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <DashboardLayout
      role="bidder"
      userName={companyName}
    >

      {/* ========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="flex items-center justify-between gap-4 mb-5">

        <div className="min-w-0">

          <div className="flex items-center gap-2 mb-1">

            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-blue-700 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Procurement Overview
            </span>

          </div>

          <h1 className="text-[27px] leading-tight font-bold tracking-tight text-slate-900">
            Bidder Dashboard
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Welcome back,{" "}
            <span className="font-semibold text-slate-700">
              {companyName}
            </span>
            . Track tenders, bids and compliance.
          </p>

        </div>


        <button
          type="button"
          onClick={() => navigate("/bidder/tenders")}
          className="
            shrink-0
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-lg
            bg-blue-700
            text-white
            text-[13px]
            font-bold
            shadow-sm
            hover:bg-blue-800
            transition-all
          "
        >
          <Search className="w-4 h-4" />
          Find Tenders
        </button>

      </div>


      {/* ========================================================
          KPI CARDS
      ========================================================= */}

      <div className="grid grid-cols-4 gap-4">

        {SUMMARY_CARDS.map(
          ({
            label,
            value,
            description,
            icon: Icon,
            iconBg,
            iconColor,
            accent,
          }) => (

            <div
              key={label}
              className={`
                bg-white
                border
                border-slate-200
                border-l-[3px]
                ${accent}
                rounded-xl
                px-4
                py-3.5
                shadow-sm
                hover:shadow-md
                transition-shadow
              `}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>

                  <div className="flex items-end gap-2 mt-1.5">

                    <p className="text-[27px] leading-none font-bold text-slate-900">
                      {value}
                    </p>

                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">
                      {description}
                    </p>

                  </div>

                </div>


                <div
                  className={`
                    w-10
                    h-10
                    rounded-lg
                    ${iconBg}
                    flex
                    items-center
                    justify-center
                  `}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>

              </div>

            </div>

          )
        )}

      </div>


      {/* ========================================================
          MAIN CONTENT ROW
      ========================================================= */}

      <div className="grid grid-cols-12 gap-4 mt-4">


        {/* ======================================================
            RECENT ACTIVITY
        ======================================================= */}

        <Card className="col-span-7 bg-white border border-slate-200 shadow-sm p-5">

          <div className="flex items-center justify-between mb-3.5">

            <div>

              <h2 className="text-[17px] font-bold text-slate-900">
                Recent Activity
              </h2>

              <p className="mt-0.5 text-[12px] text-slate-500">
                Latest procurement updates
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/bidder/bids")}
              className="
                inline-flex
                items-center
                gap-1
                text-[12px]
                font-bold
                text-blue-700
                hover:text-blue-900
              "
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>


          <div className="divide-y divide-slate-100">

            {/* Activity 1 */}
            <div className="flex items-center gap-3 py-2.5">

              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Gavel className="w-4.5 h-4.5 text-blue-700" />
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between gap-3">

                  <p className="text-[13px] font-bold text-slate-900">
                    Bid Submitted
                  </p>

                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                    2 hours ago
                  </span>

                </div>

                <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                  Bid submitted successfully for{" "}
                  <span className="font-semibold text-slate-700">
                    CPCL/2026/104
                  </span>
                </p>

              </div>

              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

            </div>


            {/* Activity 2 */}
            <div className="flex items-center gap-3 py-2.5">

              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-700" />
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between gap-3">

                  <p className="text-[13px] font-bold text-slate-900">
                    Document Verified
                  </p>

                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                    Yesterday
                  </span>

                </div>

                <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                  PAN and GSTIN verification completed successfully.
                </p>

              </div>

              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

            </div>


            {/* Activity 3 */}
            <div className="flex items-center gap-3 py-2.5">

              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5 text-amber-700" />
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between gap-3">

                  <p className="text-[13px] font-bold text-slate-900">
                    New Tender Available
                  </p>

                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                    2 days ago
                  </span>

                </div>

                <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                  A new tender matching your business profile is available.
                </p>

              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

            </div>

          </div>

        </Card>


        {/* ======================================================
            COMPLIANCE OVERVIEW
        ======================================================= */}

        <Card className="col-span-5 bg-white border border-slate-200 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-[17px] font-bold text-slate-900">
                Compliance Overview
              </h2>

              <p className="mt-0.5 text-[12px] text-slate-500">
                Current readiness status
              </p>

            </div>

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
            </div>

          </div>


          {/* Score */}
          <div className="flex items-center gap-5 mt-4">

            <div className="relative w-[92px] h-[92px] shrink-0">

              <svg
                viewBox="0 0 100 100"
                className="w-full h-full -rotate-90"
              >

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  className="text-emerald-100"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset="20.1"
                  className="text-emerald-600"
                />

              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-[21px] leading-none font-bold text-slate-900">
                  92%
                </span>

                <span className="text-[9px] font-semibold text-slate-500 mt-1">
                  READY
                </span>

              </div>

            </div>


            <div className="flex-1 space-y-2">

              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />

                  <span className="text-[11px] font-semibold text-slate-700">
                    Verified Documents
                  </span>

                </div>

                <span className="text-[13px] font-bold text-emerald-700">
                  12
                </span>

              </div>


              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">

                <div className="flex items-center gap-2">

                  <AlertTriangle className="w-4 h-4 text-amber-700" />

                  <span className="text-[11px] font-semibold text-slate-700">
                    Review Required
                  </span>

                </div>

                <span className="text-[13px] font-bold text-amber-700">
                  02
                </span>

              </div>

            </div>

          </div>

        </Card>

      </div>


      {/* ========================================================
          BOTTOM ROW
      ========================================================= */}

      <div className="grid grid-cols-12 gap-4 mt-4">


        {/* ======================================================
            RECOMMENDED TENDERS
        ======================================================= */}

        <Card className="col-span-8 bg-white border border-slate-200 shadow-sm p-5">

          <div className="flex items-center justify-between mb-3">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-[17px] font-bold text-slate-900">
                  Recommended Tenders
                </h2>

                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  3 MATCHES
                </span>

              </div>

              <p className="mt-0.5 text-[12px] text-slate-500">
                Opportunities relevant to your business profile
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/bidder/tenders")}
              className="
                inline-flex
                items-center
                gap-1
                text-[12px]
                font-bold
                text-blue-700
                hover:text-blue-900
              "
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>


          {/* TABLE */}
          <div className="overflow-hidden rounded-lg border border-slate-200">

            <table className="w-full table-fixed">

              <thead>

                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="w-[24%] text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Tender ID
                  </th>

                  <th className="w-[27%] text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Title
                  </th>

                  <th className="w-[20%] text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Deadline
                  </th>

                  <th className="w-[14%] text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="w-[15%] text-right px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {RECOMMENDED_TENDERS.map((tender, index) => (

                  <tr
                    key={tender.id}
                    className={`
                      hover:bg-blue-50/40
                      transition-colors
                      ${
                        index !== RECOMMENDED_TENDERS.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }
                    `}
                  >

                    {/* ID */}
                    <td className="px-3 py-2.5">

                      <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
                        {tender.id}
                      </span>

                    </td>


                    {/* TITLE */}
                    <td className="px-3 py-2.5">

                      <span className="text-[11px] font-semibold text-slate-700">
                        {tender.title}
                      </span>

                    </td>


                    {/* DEADLINE */}
                    <td className="px-3 py-2.5">

                      <span className="text-[11px] text-slate-600 whitespace-nowrap">
                        {tender.deadline}
                      </span>

                    </td>


                    {/* STATUS */}
                    <td className="px-3 py-2.5">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1
                          px-2
                          py-1
                          rounded-full
                          text-[10px]
                          font-bold
                          border

                          ${
                            tender.statusType === "open"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                          }
                        `}
                      >

                        <span
                          className={`
                            w-1.5
                            h-1.5
                            rounded-full

                            ${
                              tender.statusType === "open"
                                ? "bg-emerald-600"
                                : "bg-blue-600"
                            }
                          `}
                        />

                        {tender.status}

                      </span>

                    </td>


                    {/* ACTION */}
                    <td className="px-3 py-2.5 text-right">

                      <button
                        type="button"
                        onClick={() => navigate("/bidder/tenders")}
                        className="
                          inline-flex
                          items-center
                          gap-1
                          px-2.5
                          py-1.5
                          rounded-md
                          bg-blue-700
                          text-white
                          text-[10px]
                          font-bold
                          hover:bg-blue-800
                          transition-colors
                        "
                      >
                        View
                        <ChevronRight className="w-3 h-3" />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </Card>


        {/* ======================================================
            QUICK ACTIONS
        ======================================================= */}

        <Card className="col-span-4 bg-white border border-slate-200 shadow-sm p-5">

          <div className="mb-3">

            <h2 className="text-[17px] font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-0.5 text-[12px] text-slate-500">
              Common bidder tasks
            </p>

          </div>


          <div className="grid grid-cols-2 gap-2.5">


            {/* Find Tenders */}
            <button
              type="button"
              onClick={() => navigate("/bidder/tenders")}
              className="
                group
                text-left
                p-3
                rounded-xl
                border
                border-blue-100
                bg-blue-50/70
                hover:bg-blue-100
                transition-colors
              "
            >

              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">

                <Search className="w-4 h-4 text-blue-700" />

              </div>

              <p className="mt-2 text-[12px] font-bold text-slate-900">
                Find Tenders
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Browse opportunities
              </p>

            </button>


            {/* Documents */}
            <button
              type="button"
              onClick={() => navigate("/bidder/documents")}
              className="
                group
                text-left
                p-3
                rounded-xl
                border
                border-emerald-100
                bg-emerald-50/70
                hover:bg-emerald-100
                transition-colors
              "
            >

              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">

                <Upload className="w-4 h-4 text-emerald-700" />

              </div>

              <p className="mt-2 text-[12px] font-bold text-slate-900">
                Documents
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Manage your files
              </p>

            </button>


            {/* Compliance */}
            <button
              type="button"
              onClick={() => navigate("/bidder/documents")}
              className="
                group
                text-left
                p-3
                rounded-xl
                border
                border-amber-100
                bg-amber-50/70
                hover:bg-amber-100
                transition-colors
              "
            >

              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">

                <ShieldCheck className="w-4 h-4 text-amber-700" />

              </div>

              <p className="mt-2 text-[12px] font-bold text-slate-900">
                Compliance
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Check readiness
              </p>

            </button>


            {/* My Bids */}
            <button
              type="button"
              onClick={() => navigate("/bidder/bids")}
              className="
                group
                text-left
                p-3
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                hover:bg-slate-100
                transition-colors
              "
            >

              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">

                <Gavel className="w-4 h-4 text-slate-700" />

              </div>

              <p className="mt-2 text-[12px] font-bold text-slate-900">
                My Bids
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Track submissions
              </p>

            </button>

          </div>

        </Card>

      </div>

    </DashboardLayout>
  );
}