import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  FileWarning,
  UploadCloud,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { FileUploadField } from "../../components/FormFields";
import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getClarifications,
  resolveClarification,
} from "../../services/api";

export default function ClarificationResponsePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bidder, setBidder] = useState(null);
  const [bid, setBid] = useState(null);
  const [clarification, setClarification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getBidById(id),
      getClarifications({ bidId: id }),
    ])
      .then(([bidderProfile, bidData, clarifications]) => {
        setBidder(bidderProfile);
        setBid(bidData);

        // Most recent pending clarification for this bid.
        const pending = clarifications
          .filter((c) => c.status === "Pending")
          .slice(-1)[0];

        setClarification(pending ?? null);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleResolve() {
    if (!clarification || !uploadedFile) return;

    setResolving(true);

    try {
      await resolveClarification(clarification.id);
      setResolved(true);
    } finally {
      setResolving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        role="bidder"
        userName={bidder?.companyName ?? "Bidder"}
      >
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-700 animate-spin" />

            <p className="mt-4 text-[13px] font-medium text-slate-600">
              Loading clarification...
            </p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/bidder/bids")}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-blue-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Bids
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <FileWarning className="w-5 h-5 text-amber-700" />
          </div>

          <div>
            <h1 className="text-[27px] leading-tight font-bold text-slate-900">
              Clarification Required
            </h1>

            <p className="text-[13px] text-slate-500 mt-1">
              Respond to the Procurement Officer's clarification request.
            </p>
          </div>
        </div>
      </div>

      {/* Tender context */}
      {bid && (
        <Card className="p-4 mb-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Tender
              </p>

              <p className="text-[13px] font-bold text-slate-900 mt-0.5">
                {bid.tenderId}
              </p>
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block" />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Bid
              </p>

              <p className="text-[13px] font-semibold text-slate-700 mt-0.5 truncate">
                {bid.id}
              </p>
            </div>

            <div className="ml-auto">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Action Required
              </span>
            </div>
          </div>
        </Card>
      )}

      {!clarification ? (
        <Card className="p-10">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-slate-400" />
            </div>

            <h2 className="mt-4 text-[16px] font-bold text-slate-900">
              No Pending Clarification
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              There is no pending clarification request for this bid.
            </p>

            <Button
              variant="secondary"
              className="mt-5"
              onClick={() => navigate("/bidder/bids")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Bids
            </Button>
          </div>
        </Card>
      ) : resolved ? (
        /* Success state */
        <Card className="p-10">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <h2 className="mt-5 text-[19px] font-bold text-slate-900">
              Updated Document Submitted
            </h2>

            <p className="text-[13px] leading-5 text-slate-500 mt-2">
              Your response has been submitted successfully. The Procurement
              Officer can now re-review your bid.
            </p>

            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-left">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />

                <p className="text-[12px] leading-5 text-emerald-900">
                  The clarification has been marked as resolved and the
                  updated submission is ready for officer review.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              className="mt-6"
              onClick={() => navigate("/bidder/bids")}
            >
              Back to My Bids
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Clarification request */}
          <div className="lg:col-span-2">
            <Card title="Officer Clarification Request">
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-amber-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                      Document Requiring Clarification
                    </p>

                    <h2 className="text-[16px] font-bold text-slate-900 mt-1">
                      {clarification.document}
                    </h2>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-amber-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Reason
                  </p>

                  <p className="text-[13px] font-semibold text-slate-800 mt-1">
                    {clarification.reason}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Officer Message
                  </p>

                  <p className="text-[13px] leading-5 text-slate-700 mt-1">
                    {clarification.message}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action */}
          <div>
            <Card title="Submit Response">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-blue-700" />
                </div>

                <h2 className="text-[15px] font-bold text-slate-900 mt-3">
                  Upload Updated Document
                </h2>

                <p className="text-[12px] leading-5 text-slate-500 mt-1">
                  Upload the corrected document requested by the officer.
                </p>
              </div>

              <FileUploadField
                label={`Updated ${clarification.document}`}
                fileName={uploadedFile}
                onChange={setUploadedFile}
              />

              <Button
                variant="primary"
                className="w-full mt-4"
                disabled={!uploadedFile || resolving}
                onClick={handleResolve}
              >
                {resolving ? (
                  "Submitting..."
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Updated Document
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Workflow note */}
      {clarification && !resolved && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

            <p className="text-[12px] leading-5 text-blue-900">
              After submission, the updated document will be available for
              Procurement Officer re-review. The clarification workflow does
              not automatically approve or qualify the bid.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}