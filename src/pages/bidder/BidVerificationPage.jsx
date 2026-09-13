import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Check,
  ShieldCheck,
  FileSearch,
  Database,
  ClipboardCheck,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import { getCurrentUser } from "../../utils/auth";
import { submitBid, createNotification } from "../../services/api";

const VERIFICATION_STEPS = [
  "Reading submitted documents",
  "Matching bidder information",
  "Checking required documents",
  "Checking document validity",
  "Checking expiry dates",
  "Cross-verifying registration details",
  "Checking tender eligibility",
  "Checking technical requirements",
  "Assessing compliance risk",
];

const STEP_INTERVAL_MS = 800;

const STEP_ICONS = [
  FileSearch,
  Database,
  ClipboardCheck,
  ShieldCheck,
  Clock3,
  Database,
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle,
];

export default function BidVerificationPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [visibleSteps, setVisibleSteps] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bidId, setBidId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    let animationDone = false;
    let submittedBidId = null;

    function tryRedirect() {
      if (animationDone && submittedBidId) {
        navigate(`/bidder/bids/${submittedBidId}/report`, {
          replace: true,
        });
      }
    }

    submitBid(user.profileId, id)
      .then(async (bid) => {
        submittedBidId = bid.id;
        setBidId(bid.id);

        await createNotification({
          recipientRole: "officer",
          recipientId: "OFF-001",
          type: "new_bid",
          title: "New Bid Received",
          message: `Compliance: ${bid.complianceScore}% • Risk: ${bid.riskLevel}`,
          link: `/officer/bids/${bid.id}`,
        });

        tryRedirect();
      })
      .catch((err) => setError(err.message));

    VERIFICATION_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps(i + 1);

        setProgress(
          Math.round(
            ((i + 1) / VERIFICATION_STEPS.length) * 100
          )
        );
      }, i * STEP_INTERVAL_MS);
    });

    const totalDuration =
      VERIFICATION_STEPS.length * STEP_INTERVAL_MS + 600;

    const animationTimer = setTimeout(() => {
      animationDone = true;
      tryRedirect();
    }, totalDuration);

    return () => clearTimeout(animationTimer);
  }, [id, navigate]);

  const completedSteps = Math.min(
    visibleSteps,
    VERIFICATION_STEPS.length
  );

  const isComplete =
    completedSteps === VERIFICATION_STEPS.length && !error;

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-2xl">
        {/* Brand */}
        <div className="flex justify-center mb-5">
          <img
            src="/bidsure logo.jpeg"
            alt="BidSure AI"
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Main panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-blue-700" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h1 className="text-[20px] font-bold text-slate-900">
                      AI-Powered Compliance Verification
                    </h1>

                    <p className="text-[13px] text-slate-500 mt-1">
                      BidSure is analyzing your submitted bid against the
                      tender requirements.
                    </p>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    Processing
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="px-7 pt-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[12px] font-semibold text-slate-700">
                  Verification Progress
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  {completedSteps} of {VERIFICATION_STEPS.length} checks
                  completed
                </p>
              </div>

              <span className="text-[20px] font-bold text-blue-700">
                {progress}%
              </span>
            </div>

            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Verification steps */}
          <div className="px-7 py-6">
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              {VERIFICATION_STEPS.map((step, i) => {
                const Icon = STEP_ICONS[i] ?? ShieldCheck;
                const completed = i < visibleSteps;
                const current = i === visibleSteps - 1;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 last:border-b-0 transition-all duration-300 ${
                      completed
                        ? "bg-white"
                        : "bg-slate-50/60 opacity-60"
                    }`}
                  >
                    {/* Status */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        completed
                          ? "bg-emerald-50"
                          : "bg-slate-100"
                      }`}
                    >
                      {completed ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Icon className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[13px] font-medium ${
                          completed
                            ? "text-slate-800"
                            : "text-slate-500"
                        }`}
                      >
                        {step}
                      </p>

                      {current && !isComplete && (
                        <p className="text-[10px] text-blue-600 mt-0.5 font-medium">
                          Processing...
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div className="shrink-0">
                      {completed ? (
                        <span className="text-[10px] font-semibold text-emerald-600">
                          Complete
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completion */}
          {isComplete && bidId && (
            <div className="mx-7 mb-7 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />

                <div>
                  <p className="text-[12px] font-bold text-emerald-900">
                    Verification complete
                  </p>

                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    Your compliance report is being prepared.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-7 mb-7 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />

                <div>
                  <p className="text-[12px] font-bold text-red-900">
                    Verification could not be completed
                  </p>

                  <p className="text-[12px] text-red-800/80 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-7 py-4 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />

              <p className="text-[10px] text-slate-500 text-center">
                Verification checks documents, eligibility and compliance
                signals before generating the bid report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}