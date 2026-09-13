import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Users,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";

import { getCurrentUser } from "../../utils/auth";
import {
  getBuyerProfile,
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


function complianceGlyph(bid) {
  if (bid.complianceScore >= 85) {
    return (
      <Check className="w-4 h-4 text-status-green mx-auto" />
    );
  }

  if (bid.complianceScore >= 65) {
    return (
      <AlertTriangle className="w-4 h-4 text-status-amber mx-auto" />
    );
  }

  return (
    <X className="w-4 h-4 text-status-red mx-auto" />
  );
}


export default function BuyerEvaluationPage() {
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "buyer") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBuyerProfile(user.profileId),
      getBids(),
    ])
      .then(async ([buyerProfile, allBids]) => {
        setBuyer(buyerProfile);

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


  const rows = [
    { label: "Eligibility" },
    { label: "Documents" },
    { label: "Financial" },
    { label: "Technical" },
    { label: "Certifications" },
  ];


  return (
    <DashboardLayout
      role="buyer"
      userName={buyer?.organizationName ?? "Buyer"}
      notificationCount={2}
    >

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4 mb-5">

        <div>

          <button
            type="button"
            onClick={() => navigate("/buyer/dashboard")}
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
            Back to Dashboard
          </button>

          <p className="text-[11px] font-bold tracking-widest text-blue-700 uppercase mb-1">
            Bid Evaluation
          </p>

          <h1 className="text-[27px] leading-tight font-bold text-slate-900">
            Review Submitted Bids
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Compare bidder compliance, risk and verification results.
          </p>

        </div>


        <div className="
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
              AI Decision Support
            </p>

            <p className="text-[10px] text-slate-500">
              Officer retains final authority
            </p>

          </div>

        </div>

      </div>


      {/* BID SUMMARY */}

      {!loading && bids.length > 0 && (

        <div className="grid grid-cols-3 gap-3 mb-4">

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-700" />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Bids Received
                </p>

                <p className="text-[24px] font-bold text-slate-900 leading-none mt-1">
                  {bids.length}
                </p>

              </div>

            </div>

          </div>


          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-700" />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  High Compliance
                </p>

                <p className="text-[24px] font-bold text-slate-900 leading-none mt-1">
                  {
                    bids.filter(
                      (bid) => bid.complianceScore >= 85
                    ).length
                  }
                </p>

              </div>

            </div>

          </div>


          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Needs Review
                </p>

                <p className="text-[24px] font-bold text-slate-900 leading-none mt-1">
                  {
                    bids.filter(
                      (bid) =>
                        bid.complianceScore < 85
                    ).length
                  }
                </p>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* RISK ANALYTICS */}

      {!loading && bids.length > 0 && (

        <div className="grid grid-cols-3 gap-4 mb-4">

          <RiskDistributionChart bids={bids} />

          <RiskShareDonut bids={bids} />

          <RiskInsightsPanel bids={bids} />

        </div>

      )}


      {/* BID COMPARISON */}

      {loading ? (

        <Card>

          <div className="py-10 text-center">

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
              Loading submitted bids...
            </p>

          </div>

        </Card>

      ) : bids.length === 0 ? (

        <Card>

          <div className="py-10 text-center">

            <Users className="w-8 h-8 text-slate-300 mx-auto" />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No bids available
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Submitted bids will appear here once available.
            </p>

          </div>

        </Card>

      ) : (

        <Card className="bg-white border border-slate-200 shadow-sm p-5">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-[17px] font-bold text-slate-900">
                Bidder Comparison
              </h2>

              <p className="mt-0.5 text-[12px] text-slate-500">
                Side-by-side compliance overview
              </p>

            </div>

            <span className="
              px-2.5
              py-1
              rounded-full
              bg-slate-100
              text-slate-600
              text-[11px]
              font-bold
            ">
              {bids.length} Bidders
            </span>

          </div>


          <div className="overflow-x-auto rounded-lg border border-slate-200">

            <table className="w-full text-sm">

              <thead>

                <tr className="bg-slate-50">

                  <th className="
                    text-left
                    font-bold
                    text-slate-600
                    px-4
                    py-3
                    border-b
                    border-slate-200
                    min-w-[170px]
                  ">
                    Criteria
                  </th>


                  {bids.map((bid) => (

                    <th
                      key={bid.id}
                      className="
                        text-center
                        font-bold
                        text-slate-800
                        px-4
                        py-3
                        border-b
                        border-slate-200
                        min-w-[150px]
                      "
                    >

                      <div className="flex flex-col items-center">

                        <span className="text-[12px]">
                          {bid.bidderName}
                        </span>

                        <span className="mt-0.5 text-[10px] font-normal text-slate-400">
                          {bid.id}
                        </span>

                      </div>

                    </th>

                  ))}

                </tr>

              </thead>


              <tbody>

                {rows.map((row) => (

                  <tr
                    key={row.label}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="
                      px-4
                      py-3
                      text-[12px]
                      text-slate-800
                      font-semibold
                    ">
                      {row.label}
                    </td>


                    {bids.map((bid) => (

                      <td
                        key={bid.id}
                        className="px-4 py-3 text-center"
                      >
                        {complianceGlyph(bid)}
                      </td>

                    ))}

                  </tr>

                ))}


                {/* RISK */}

                <tr className="border-b border-slate-100">

                  <td className="
                    px-4
                    py-3
                    text-[12px]
                    text-slate-800
                    font-semibold
                  ">
                    Risk
                  </td>


                  {bids.map((bid) => (

                    <td
                      key={bid.id}
                      className="px-4 py-3 text-center"
                    >

                      <StatusBadge status={riskColor(bid.riskLevel)}>
                        {bid.riskLevel}
                      </StatusBadge>

                    </td>

                  ))}

                </tr>


                {/* COMPLIANCE */}

                <tr>

                  <td className="
                    px-4
                    py-3
                    text-[12px]
                    text-slate-800
                    font-semibold
                  ">
                    Compliance Score
                  </td>


                  {bids.map((bid) => (

                    <td
                      key={bid.id}
                      className="
                        px-4
                        py-3
                        text-center
                        text-[13px]
                        font-bold
                        text-slate-900
                      "
                    >
                      {bid.complianceScore}%
                    </td>

                  ))}

                </tr>

              </tbody>

            </table>

          </div>


          {/* DETAILS */}

          <div className="mt-4 flex flex-wrap gap-2">

            {bids.map((bid) => (

              <button
                key={bid.id}
                type="button"
                onClick={() =>
                  navigate(`/buyer/bids/${bid.id}`)
                }
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-2
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  text-[11px]
                  font-bold
                  text-slate-700
                  hover:border-blue-500
                  hover:text-blue-700
                  hover:bg-blue-50
                  transition-colors
                "
              >

                <Eye className="w-3.5 h-3.5" />

                View {bid.bidderName}

              </button>

            ))}

          </div>

        </Card>

      )}

    </DashboardLayout>
  );
}