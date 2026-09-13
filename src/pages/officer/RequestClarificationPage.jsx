import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquareWarning,
  FileText,
  ShieldCheck,
  Send,
  Info,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { TextField, SelectField } from "../../components/FormFields";
import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getOfficerProfile,
  createClarification,
  createNotification,
} from "../../services/api";

const DOCUMENT_OPTIONS = [
  "Authorized Representative Proof",
  "GST Certificate",
  "PAN",
  "Experience Certificate",
  "Financial Statement",
  "Technical Capability Documents",
  "ISO Certificate",
];

export default function RequestClarificationPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [officer, setOfficer] = useState(null);
  const [bid, setBid] = useState(null);
  const [bidder, setBidder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    document: DOCUMENT_OPTIONS[0],
    reason: "",
    message: "",
  });

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    getOfficerProfile(user.profileId).then(setOfficer);

    getBidById(id)
      .then(async (bidData) => {
        setBid(bidData);

        const bidderProfile = await getBidderProfile(
          bidData.bidderId
        );

        setBidder(bidderProfile);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleSend() {
    setSending(true);

    try {
      await createClarification({
        bidId: bid.id,
        tenderId: bid.tenderId,
        bidderId: bid.bidderId,
        document: form.document,
        reason: form.reason,
        message: form.message,
      });

      await createNotification({
        recipientRole: "bidder",
        recipientId: bid.bidderId,
        type: "clarification",
        title: "Clarification Required",
        message: `${form.document}: ${form.reason}`,
        link: `/bidder/bids/${bid.id}/clarification`,
      });

      navigate(`/officer/bids/${id}`);
    } finally {
      setSending(false);
    }
  }

  if (loading || !bid) {
    return (
      <DashboardLayout
        role="officer"
        userName={officer?.fullName ?? "Officer"}
      >
        <div className="flex items-center justify-center min-h-[420px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-[13px] font-medium text-slate-600">
              Loading bid details...
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
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(`/officer/bids/${id}`)}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600 hover:text-blue-700 transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bid Review
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide">
                Clarification Required
              </span>

              <span className="text-[11px] font-semibold text-slate-400">
                {bid.tenderId}
              </span>
            </div>

            <h1 className="text-[27px] font-bold text-slate-900">
              Request Clarification
            </h1>

            <p className="mt-1.5 text-[13px] text-slate-500">
              Request additional or corrected evidence from the bidder
              before completing the compliance review.
            </p>
          </div>

          <div className="hidden sm:flex w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 items-center justify-center">
            <MessageSquareWarning className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Bid context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Bidder
            </p>

            <p className="mt-1 text-[13px] font-bold text-slate-900 truncate">
              {bidder?.companyName ?? "Bidder"}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Tender
            </p>

            <p className="mt-1 text-[13px] font-bold text-slate-900 truncate">
              {bid.tenderId}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Review Action
            </p>

            <div className="flex items-center gap-2 mt-1">
              <MessageSquareWarning className="w-3.5 h-3.5 text-amber-600" />

              <p className="text-[13px] font-bold text-amber-700">
                Ask Bidder for Evidence
              </p>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          {/* Form */}
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-blue-700" />
                </div>

                <div>
                  <h2 className="text-[15px] font-bold text-slate-900">
                    Clarification Details
                  </h2>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Specify exactly what the bidder needs to clarify.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <SelectField
                label="Document"
                value={form.document}
                onChange={(value) =>
                  update("document", value)
                }
                options={DOCUMENT_OPTIONS}
              />

              <TextField
                label="Reason"
                value={form.reason}
                onChange={(value) =>
                  update("reason", value)
                }
                placeholder="e.g. Document contains an unclear authorization date"
              />

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                  Message to Bidder
                </label>

                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    update("message", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-3 text-[13px] text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none transition-colors"
                  placeholder="Please submit a valid updated document and provide any additional information required for verification."
                />

                <p className="mt-1.5 text-[10px] text-slate-400">
                  Give the bidder clear instructions so the document can
                  be reviewed without unnecessary back-and-forth.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/officer/bids/${id}`)
                  }
                  className="text-[12px] font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>

                <Button
                  variant="primary"
                  disabled={
                    sending ||
                    !form.reason.trim() ||
                    !form.message.trim()
                  }
                  onClick={handleSend}
                  className="sm:min-w-[190px]"
                >
                  <Send className="w-4 h-4" />

                  {sending
                    ? "Sending Request..."
                    : "Send Clarification"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Guidance */}
          <div className="space-y-5">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-blue-700" />

                <h3 className="text-[14px] font-bold text-slate-900">
                  Review Guidance
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                    1
                  </span>

                  <p className="text-[11px] leading-4.5 text-slate-600">
                    Select the specific document that requires
                    clarification.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                    2
                  </span>

                  <p className="text-[11px] leading-4.5 text-slate-600">
                    Clearly explain the issue identified during
                    verification.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                    3
                  </span>

                  <p className="text-[11px] leading-4.5 text-slate-600">
                    Ask only for evidence necessary to resolve the
                    compliance issue.
                  </p>
                </div>
              </div>
            </Card>

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

                <div>
                  <p className="text-[11px] font-bold text-blue-900">
                    Human Review Control
                  </p>

                  <p className="mt-1 text-[10.5px] leading-4.5 text-blue-800">
                    The clarification request is issued by the
                    procurement officer. AI provides decision support;
                    the officer remains responsible for the final
                    qualification decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}