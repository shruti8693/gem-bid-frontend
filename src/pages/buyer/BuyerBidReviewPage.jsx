import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  IndianRupee,
  Award,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";

import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getTenderById,
  getBuyerProfile,
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


function complianceStatus(score) {
  if (score >= 85) return "green";
  if (score >= 65) return "amber";
  return "red";
}


export default function BuyerBidReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [buyer, setBuyer] = useState(null);
  const [bid, setBid] = useState(null);
  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "buyer") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBuyerProfile(user.profileId),
      getBidById(id),
    ])
      .then(async ([buyerProfile, bidData]) => {
        setBuyer(buyerProfile);
        setBid(bidData);

        const [bidderProfile, tenderData] =
          await Promise.all([
            getBidderProfile(bidData.bidderId),
            getTenderById(bidData.tenderId),
          ]);

        setBidder(bidderProfile);
        setTender(tenderData);
      })
      .catch(() => {
        setBid(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);


  if (loading) {
    return (
      <DashboardLayout
        role="buyer"
        userName="Loading..."
      >
        <div className="min-h-[300px] flex items-center justify-center">

          <div className="text-center">

            <div className="
              mx-auto
              w-9
              h-9
              rounded-full
              border-4
              border-blue-100
              border-t-blue-700
              animate-spin
            " />

            <p className="mt-3 text-sm text-slate-500">
              Loading bid details...
            </p>

          </div>

        </div>
      </DashboardLayout>
    );
  }


  if (!bid) {
    return (
      <DashboardLayout
        role="buyer"
        userName={buyer?.organizationName ?? "Buyer"}
      >
        <Card>

          <div className="py-10 text-center">

            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />

            <h2 className="mt-3 text-lg font-bold text-slate-900">
              Bid not found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The requested bid could not be loaded.
            </p>

            <button
              type="button"
              onClick={() => navigate("/buyer/evaluation")}
              className="
                mt-4
                px-4
                py-2
                rounded-lg
                bg-blue-700
                text-white
                text-sm
                font-semibold
              "
            >
              Back to Evaluation
            </button>

          </div>

        </Card>
      </DashboardLayout>
    );
  }


  const categories = [
    "Eligibility",
    "Documents",
    "Financial",
    "Technical",
    "Certifications",
  ];


  return (
    <DashboardLayout
      role="buyer"
      userName={buyer?.organizationName ?? "Buyer"}
      notificationCount={2}
    >

      {/* ======================================================
          HEADER
      ======================================================= */}

      <button
        type="button"
        onClick={() => navigate("/buyer/evaluation")}
        className="
          inline-flex
          items-center
          gap-1.5
          mb-3
          text-[12px]
          font-semibold
          text-slate-500
          hover:text-blue-700
        "
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Bid Evaluation
      </button>


      <div className="flex items-start justify-between gap-4 mb-5">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <div className="
              w-9
              h-9
              rounded-lg
              bg-blue-50
              flex
              items-center
              justify-center
            ">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                Bid Review
              </p>

              <h1 className="text-[25px] leading-tight font-bold text-slate-900">
                {bidder?.companyName ?? "Bidder"}
              </h1>

            </div>

          </div>


          <p className="mt-2 text-[13px] text-slate-500">
            {tender?.tenderId}
            <span className="mx-2">•</span>
            {tender?.title}
          </p>

        </div>


        {/* AI SUPPORT */}

        <div className="
          shrink-0
          flex
          items-center
          gap-2
          px-3
          py-2
          rounded-lg
          bg-blue-50
          border
          border-blue-100
        ">

          <ShieldCheck className="w-4 h-4 text-blue-700" />

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">
              AI Verification
            </p>

            <p className="text-[10px] text-slate-500">
              Evidence-based decision support
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          SCORE CARDS
      ======================================================= */}

      <div className="grid grid-cols-3 gap-4 mb-4">

        {/* Compliance */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          px-4
          py-3.5
          shadow-sm
        ">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Compliance Score
          </p>

          <div className="flex items-end gap-2 mt-1.5">

            <p className={`
              text-[30px]
              leading-none
              font-bold

              ${
                bid.complianceScore >= 85
                  ? "text-emerald-700"
                  : bid.complianceScore >= 65
                  ? "text-amber-700"
                  : "text-red-700"
              }
            `}>
              {bid.complianceScore}%
            </p>

            <span className="text-[11px] text-slate-500 mb-1">
              verified
            </span>

          </div>

        </div>


        {/* Risk */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          px-4
          py-3.5
          shadow-sm
        ">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Risk Level
          </p>

          <div className="mt-2">

            <StatusBadge status={riskColor(bid.riskLevel)}>
              {bid.riskLevel}
            </StatusBadge>

          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Risk score:{" "}
            <span className="font-bold text-slate-700">
              {bid.riskScore}/100
            </span>
          </p>

        </div>


        {/* Status */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          px-4
          py-3.5
          shadow-sm
        ">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Bid Status
          </p>

          <div className="mt-2">

            <StatusBadge status={statusColor(bid.status)}>
              {bid.status}
            </StatusBadge>

          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Submitted bid under review
          </p>

        </div>

      </div>


      {/* ======================================================
          MAIN CONTENT
      ======================================================= */}

      <div className="grid grid-cols-12 gap-4">


        {/* ====================================================
            LEFT
        ===================================================== */}

        <div className="col-span-8 space-y-4">


          {/* BIDDER PROFILE */}

          <Card className="p-5">

            <div className="flex items-center gap-2 mb-4">

              <div className="
                w-8
                h-8
                rounded-lg
                bg-blue-50
                flex
                items-center
                justify-center
              ">
                <Building2 className="w-4 h-4 text-blue-700" />
              </div>

              <div>

                <h2 className="text-[16px] font-bold text-slate-900">
                  Bidder Profile
                </h2>

                <p className="text-[11px] text-slate-500">
                  Registered organization details
                </p>

              </div>

            </div>


            <div className="grid grid-cols-2 gap-x-8 gap-y-3">

              <div>
                <p className="text-[10px] uppercase font-bold tracking-wide text-slate-400">
                  Company
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {bidder?.companyName}
                </p>
              </div>


              <div>
                <p className="text-[10px] uppercase font-bold tracking-wide text-slate-400">
                  Registration Number
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {bidder?.companyRegNumber}
                </p>
              </div>


              <div>
                <p className="text-[10px] uppercase font-bold tracking-wide text-slate-400">
                  GSTIN
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {bidder?.gstin}
                </p>
              </div>


              <div>
                <p className="text-[10px] uppercase font-bold tracking-wide text-slate-400">
                  Experience
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {bidder?.yearsExperience} years
                </p>
              </div>


              <div>
                <p className="text-[10px] uppercase font-bold tracking-wide text-slate-400">
                  Annual Turnover
                </p>

                <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-slate-800">
                  <IndianRupee className="w-3 h-3" />
                  {bidder?.annualTurnover}
                </p>
              </div>


              <div>
                <p className="text-[10px] uppercase font-bold tracking-wide text-slate-400">
                  Technical Capacity
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {bidder?.technicalCapacity}
                </p>
              </div>

            </div>

          </Card>


          {/* COMPLIANCE */}

          <Card className="p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">

                <div className="
                  w-8
                  h-8
                  rounded-lg
                  bg-emerald-50
                  flex
                  items-center
                  justify-center
                ">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>

                <div>

                  <h2 className="text-[16px] font-bold text-slate-900">
                    Compliance Summary
                  </h2>

                  <p className="text-[11px] text-slate-500">
                    AI-verified tender requirements
                  </p>

                </div>

              </div>


              <span className="
                px-2.5
                py-1
                rounded-full
                bg-blue-50
                text-blue-700
                text-[10px]
                font-bold
              ">
                {bid.complianceScore}% Overall
              </span>

            </div>


            <div className="space-y-1">

              {categories.map((label) => {

                const passed =
                  bid.complianceScore >= 85;

                const review =
                  bid.complianceScore >= 65 &&
                  bid.complianceScore < 85;

                return (

                  <div
                    key={label}
                    className="
                      flex
                      items-center
                      justify-between
                      px-3
                      py-2.5
                      rounded-lg
                      border
                      border-slate-100
                      bg-slate-50/60
                    "
                  >

                    <div className="flex items-center gap-2">

                      {passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : review ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}

                      <span className="text-[12px] font-semibold text-slate-700">
                        {label}
                      </span>

                    </div>


                    <StatusBadge
                      status={
                        passed
                          ? "green"
                          : review
                          ? "amber"
                          : "red"
                      }
                    >
                      {passed
                        ? "Pass"
                        : review
                        ? "Review"
                        : "Failed"}
                    </StatusBadge>

                  </div>

                );

              })}

            </div>


            {/* EXPLANATION */}

            <div className="
              mt-4
              p-3
              rounded-lg
              bg-blue-50
              border
              border-blue-100
            ">

              <div className="flex gap-2">

                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />

                <div>

                  <p className="text-[11px] font-bold text-blue-900">
                    AI Verification Summary
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                    Compliance results are generated from submitted
                    documents and verification data. Any flagged item
                    should be reviewed against the supporting evidence.
                  </p>

                </div>

              </div>

            </div>

          </Card>


          {/* DOCUMENT EVIDENCE */}

          <Card className="p-5">

            <div className="flex items-center gap-2 mb-4">

              <div className="
                w-8
                h-8
                rounded-lg
                bg-slate-100
                flex
                items-center
                justify-center
              ">
                <FileText className="w-4 h-4 text-slate-700" />
              </div>

              <div>

                <h2 className="text-[16px] font-bold text-slate-900">
                  Document Evidence
                </h2>

                <p className="text-[11px] text-slate-500">
                  Documents considered during verification
                </p>

              </div>

            </div>


            <div className="grid grid-cols-2 gap-2">

              {[
                "Company Registration",
                "GST Certificate",
                "PAN Document",
                "Financial Statement",
                "Technical Documents",
                "Experience Certificates",
              ].map((document) => (

                <div
                  key={document}
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2.5
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                  "
                >

                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                  <span className="text-[11px] font-semibold text-slate-700">
                    {document}
                  </span>

                </div>

              ))}

            </div>

          </Card>

        </div>


        {/* ====================================================
            RIGHT
        ===================================================== */}

        <div className="col-span-4 space-y-4">


          {/* RISK */}

          <Card className="p-5">

            <div className="flex items-center gap-2 mb-4">

              <div className="
                w-8
                h-8
                rounded-lg
                bg-amber-50
                flex
                items-center
                justify-center
              ">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              </div>

              <div>

                <h2 className="text-[16px] font-bold text-slate-900">
                  Risk Assessment
                </h2>

                <p className="text-[11px] text-slate-500">
                  AI-generated risk indicators
                </p>

              </div>

            </div>


            <div className="text-center py-3">

              <StatusBadge status={riskColor(bid.riskLevel)}>
                {bid.riskLevel} RISK
              </StatusBadge>

              <p className="mt-3 text-[30px] font-bold text-slate-900">
                {bid.riskScore}
                <span className="text-sm font-medium text-slate-400">
                  /100
                </span>
              </p>

              <p className="text-[11px] text-slate-500">
                Overall risk score
              </p>

            </div>


            <div className="
              mt-3
              pt-3
              border-t
              border-slate-100
            ">

              <p className="text-[11px] font-semibold text-slate-700">
                Recommendation
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Review compliance evidence and tender-specific
                requirements before proceeding with the bid.
              </p>

            </div>

          </Card>


          {/* TENDER */}

          <Card className="p-5">

            <div className="flex items-center gap-2 mb-4">

              <div className="
                w-8
                h-8
                rounded-lg
                bg-blue-50
                flex
                items-center
                justify-center
              ">
                <Award className="w-4 h-4 text-blue-700" />
              </div>

              <div>

                <h2 className="text-[16px] font-bold text-slate-900">
                  Tender Information
                </h2>

              </div>

            </div>


            <div className="space-y-3">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Tender ID
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {tender?.tenderId}
                </p>
              </div>


              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Tender Title
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {tender?.title}
                </p>
              </div>


              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Bid Status
                </p>

                <div className="mt-1.5">
                  <StatusBadge status={statusColor(bid.status)}>
                    {bid.status}
                  </StatusBadge>
                </div>
              </div>

            </div>

          </Card>


          {/* BUYER NOTE */}

          <div className="
            p-4
            rounded-xl
            bg-slate-50
            border
            border-slate-200
          ">

            <p className="text-[11px] font-bold text-slate-700">
              Procurement Review
            </p>

            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
              This screen provides evidence and AI-assisted insights
              for procurement evaluation. Final qualification and
              procurement decisions remain with the authorized
              procurement officer.
            </p>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}