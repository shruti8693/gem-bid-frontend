import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Archive,
  Gavel,
  ClipboardList,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Search,
  BarChart3,
  Users,
  ChevronRight,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import { getCurrentUser } from "../../utils/auth";
import { getBuyerProfile } from "../../services/api";


/* ============================================================
   SUMMARY CARDS
============================================================ */

const SUMMARY_CARDS = [
  {
    label: "Active Tenders",
    value: "04",
    description: "Currently accepting bids",
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    accent: "border-blue-600",
  },
  {
    label: "Closed Tenders",
    value: "12",
    description: "Completed procurement",
    icon: Archive,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
    accent: "border-slate-500",
  },
  {
    label: "Bids Received",
    value: "28",
    description: "Across active tenders",
    icon: Gavel,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    accent: "border-emerald-600",
  },
  {
    label: "Under Evaluation",
    value: "06",
    description: "Awaiting review",
    icon: ClipboardList,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    accent: "border-amber-500",
  },
];


/* ============================================================
   TENDER DATA
============================================================ */

const TENDERS = [
  {
    id: "CPCL/2026/104",
    title: "Crude Oil Supply",
    bids: 8,
    deadline: "25 Sep 2026",
    status: "Evaluation",
    type: "evaluation",
  },
  {
    id: "CPCL/2026/091",
    title: "Pipeline Maintenance",
    bids: 6,
    deadline: "30 Sep 2026",
    status: "Open",
    type: "open",
  },
  {
    id: "CPCL/2026/087",
    title: "Equipment Procurement",
    bids: 14,
    deadline: "15 Oct 2026",
    status: "Open",
    type: "open",
  },
];


/* ============================================================
   MAIN PAGE
============================================================ */

export default function BuyerDashboardPage() {
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);


  /* ============================================================
     AUTH + PROFILE
  ============================================================ */

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "buyer") {
      navigate("/login");
      return;
    }

    getBuyerProfile(user.profileId)
      .then(setBuyer)
      .catch(() => setBuyer(null))
      .finally(() => setLoading(false));
  }, [navigate]);


  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <DashboardLayout
        role="buyer"
        userName="Loading..."
      >
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


  const organizationName =
    buyer?.organizationName ?? "Buyer";


  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <DashboardLayout
      role="buyer"
      userName={organizationName}
      notificationCount={2}
    >

      {/* ========================================================
          HEADER
      ========================================================= */}

      <div className="flex items-center justify-between gap-4 mb-5">

        <div className="min-w-0">

          <p className="text-[11px] font-bold tracking-widest text-blue-700 uppercase mb-1">
            Tender Management
          </p>

          <h1 className="text-[27px] leading-tight font-bold tracking-tight text-slate-900">
            Buyer Dashboard
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Welcome back,{" "}
            <span className="font-semibold text-slate-700">
              {organizationName}
            </span>
            . Manage tenders, bids and evaluations.
          </p>

        </div>


        {/* Create Tender */}
        <button
          type="button"
          onClick={() => navigate("/buyer/tenders/create")}
          className="
            shrink-0
            inline-flex
            items-center
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
          <Plus className="w-4 h-4" />
          Create Tender
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

                    <p className="text-[10px] font-medium text-slate-500 mb-0.5">
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
          MAIN ROW
      ========================================================= */}

      <div className="grid grid-cols-12 gap-4 mt-4">


        {/* ======================================================
            TENDER OVERVIEW
        ======================================================= */}

        <Card className="col-span-8 bg-white border border-slate-200 shadow-sm p-5">

          <div className="flex items-center justify-between mb-3">

            <div>

              <h2 className="text-[17px] font-bold text-slate-900">
                Tender Overview
              </h2>

              <p className="mt-0.5 text-[12px] text-slate-500">
                Current procurement activity
              </p>

            </div>


            <button
              type="button"
              onClick={() => navigate("/buyer/tenders")}
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

                  <th className="w-[25%] text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Tender ID
                  </th>

                  <th className="w-[29%] text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Tender
                  </th>

                  <th className="w-[13%] text-center px-2 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Bids
                  </th>

                  <th className="w-[19%] text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Deadline
                  </th>

                  <th className="w-[14%] text-right px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {TENDERS.map((tender, index) => (

                  <tr
                    key={tender.id}
                    className={`
                      hover:bg-blue-50/40
                      transition-colors
                      ${
                        index !== TENDERS.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }
                    `}
                  >

                    <td className="px-3 py-2.5">

                      <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
                        {tender.id}
                      </span>

                    </td>


                    <td className="px-3 py-2.5">

                      <span className="text-[11px] font-semibold text-slate-700">
                        {tender.title}
                      </span>

                    </td>


                    <td className="px-2 py-2.5 text-center">

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">

                        <Users className="w-3.5 h-3.5 text-slate-400" />

                        {tender.bids}

                      </span>

                    </td>


                    <td className="px-3 py-2.5">

                      <span className="text-[11px] text-slate-600 whitespace-nowrap">
                        {tender.deadline}
                      </span>

                    </td>


                    <td className="px-3 py-2.5 text-right">

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
                            tender.type === "evaluation"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-100"
                          }
                        `}
                      >

                        <span
                          className={`
                            w-1.5
                            h-1.5
                            rounded-full

                            ${
                              tender.type === "evaluation"
                                ? "bg-amber-600"
                                : "bg-emerald-600"
                            }
                          `}
                        />

                        {tender.status}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </Card>


        {/* ======================================================
            EVALUATION SNAPSHOT
        ======================================================= */}

        <Card className="col-span-4 bg-white border border-slate-200 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-[17px] font-bold text-slate-900">
                Evaluation Snapshot
              </h2>

              <p className="mt-0.5 text-[12px] text-slate-500">
                Bid review workload
              </p>

            </div>

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-700" />
            </div>

          </div>


          {/* Large number */}

          <div className="mt-4 flex items-end gap-2">

            <span className="text-[34px] leading-none font-bold text-slate-900">
              06
            </span>

            <span className="text-[12px] font-medium text-slate-500 mb-1">
              bids under evaluation
            </span>

          </div>


          {/* Progress */}

          <div className="mt-4">

            <div className="flex items-center justify-between mb-1.5">

              <span className="text-[11px] font-semibold text-slate-600">
                Evaluation progress
              </span>

              <span className="text-[11px] font-bold text-blue-700">
                68%
              </span>

            </div>


            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">

              <div
                className="h-full w-[68%] bg-blue-700 rounded-full"
              />

            </div>

          </div>


          {/* Status rows */}

          <div className="mt-4 space-y-2">

            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="w-4 h-4 text-emerald-700" />

                <span className="text-[11px] font-semibold text-slate-700">
                  Compliance Passed
                </span>

              </div>

              <span className="text-[12px] font-bold text-emerald-700">
                18
              </span>

            </div>


            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">

              <div className="flex items-center gap-2">

                <Clock3 className="w-4 h-4 text-amber-700" />

                <span className="text-[11px] font-semibold text-slate-700">
                  Awaiting Review
                </span>

              </div>

              <span className="text-[12px] font-bold text-amber-700">
                06
              </span>

            </div>

          </div>

        </Card>

      </div>


      {/* ========================================================
          BOTTOM ROW
      ========================================================= */}

      <div className="grid grid-cols-12 gap-4 mt-4">


        {/* ======================================================
            RECENT ACTIVITY
        ======================================================= */}

        <Card className="col-span-7 bg-white border border-slate-200 shadow-sm p-5">

          <div className="flex items-center justify-between mb-3">

            <div>

              <h2 className="text-[17px] font-bold text-slate-900">
                Recent Activity
              </h2>

              <p className="mt-0.5 text-[12px] text-slate-500">
                Latest tender and evaluation updates
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/buyer/tenders")}
              className="text-[12px] font-bold text-blue-700"
            >
              View All
            </button>

          </div>


          <div className="divide-y divide-slate-100">

            {/* Activity 1 */}

            <div className="flex items-center gap-3 py-2.5">

              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-blue-700" />
              </div>

              <div className="flex-1 min-w-0">

                <p className="text-[13px] font-bold text-slate-900">
                  Tender Published
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                  CPCL/2026/104 is now open for bidder submissions.
                </p>

              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                2h ago
              </span>

            </div>


            {/* Activity 2 */}

            <div className="flex items-center gap-3 py-2.5">

              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>

              <div className="flex-1 min-w-0">

                <p className="text-[13px] font-bold text-slate-900">
                  Compliance Verification Completed
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                  8 bidder submissions were processed successfully.
                </p>

              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                Yesterday
              </span>

            </div>


            {/* Activity 3 */}

            <div className="flex items-center gap-3 py-2.5">

              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              </div>

              <div className="flex-1 min-w-0">

                <p className="text-[13px] font-bold text-slate-900">
                  Clarification Required
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                  2 bidder submissions require additional review.
                </p>

              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                2d ago
              </span>

            </div>

          </div>

        </Card>


        {/* ======================================================
            QUICK ACTIONS
        ======================================================= */}

        <Card className="col-span-5 bg-white border border-slate-200 shadow-sm p-5">

          <div className="mb-3">

            <h2 className="text-[17px] font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-0.5 text-[12px] text-slate-500">
              Common buyer tasks
            </p>

          </div>


          <div className="grid grid-cols-2 gap-2.5">


            {/* Create Tender */}

            <button
              type="button"
              onClick={() => navigate("/buyer/tenders/create")}
              className="
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
                <Plus className="w-4 h-4 text-blue-700" />
              </div>

              <p className="mt-2 text-[12px] font-bold text-slate-900">
                Create Tender
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Start procurement
              </p>

            </button>


            {/* Manage Tenders */}

            <button
              type="button"
              onClick={() => navigate("/buyer/tenders")}
              className="
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
                <Search className="w-4 h-4 text-slate-700" />
              </div>

              <p className="mt-2 text-[12px] font-bold text-slate-900">
                Manage Tenders
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                View procurement
              </p>

            </button>


            {/* Evaluate Bids */}

            <button
              type="button"
              onClick={() => navigate("/buyer/evaluation")}
              className="
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
                <ClipboardList className="w-4 h-4 text-amber-700" />
              </div>

              <p className="mt-2 text-[12px] font-bold text-slate-900">
                Evaluate Bids
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Review submissions
              </p>

            </button>


            {/* Bid Analysis */}

            <button
              type="button"
              onClick={() => navigate("/buyer/evaluation")}
              className="
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
                <BarChart3 className="w-4 h-4 text-emerald-700" />
              </div>

              <p className="mt-2 text-[12px] font-bold text-slate-900">
                Bid Analysis
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Compare bidders
              </p>

            </button>

          </div>

        </Card>

      </div>

    </DashboardLayout>
  );
}