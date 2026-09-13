import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileUp,
  ShieldCheck,
  AlertCircle,
  Save,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { FileUploadField } from "../../components/FormFields";
import { getCurrentUser } from "../../utils/auth";
import {
  getTenderById,
  getBidderProfile,
  getExtraDocuments,
  saveExtraDocuments,
} from "../../services/api";
import { buildComplianceChecklist } from "../../utils/complianceChecklist";

export default function UploadMissingDocsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [extras, setExtras] = useState({});
  const [pendingUploads, setPendingUploads] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getTenderById(id),
      getExtraDocuments(user.profileId, id),
    ])
      .then(([bidderProfile, tenderData, existingExtras]) => {
        setBidder(bidderProfile);
        setTender(tenderData);
        setExtras(existingExtras);
      })
      .finally(() => setLoading(false));
  }, [navigate, id]);

  if (loading || !bidder || !tender) {
    return (
      <DashboardLayout
        role="bidder"
        userName={bidder?.companyName ?? "Bidder"}
      >
        <div className="flex items-center justify-center min-h-[420px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-[13px] font-medium text-slate-600">
              Loading document requirements...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const checklist = buildComplianceChecklist(tender, bidder, extras);
  const missingItems = checklist.items.filter((i) => !i.available);

  function handleFileSelect(extraKey, fileName) {
    setPendingUploads((prev) => ({
      ...prev,
      [extraKey]: fileName,
    }));
  }

  async function handleSaveAll() {
    setSaving(true);

    try {
      const user = getCurrentUser();

      await saveExtraDocuments(
        user.profileId,
        id,
        pendingUploads
      );

      const updated = await getExtraDocuments(
        user.profileId,
        id
      );

      setExtras(updated);
      setPendingUploads({});
    } finally {
      setSaving(false);
    }
  }

  const hasPendingUploads =
    Object.keys(pendingUploads).length > 0;

  const allResolved = missingItems.length === 0;

  const uploadedCount = Object.keys(pendingUploads).length;

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder.companyName}
      notificationCount={3}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(`/bidder/tenders/${tender.id}`)}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600 hover:text-blue-700 transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tender
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                {tender.tenderId}
              </p>

              <h1 className="mt-1 text-[27px] font-bold text-slate-900">
                Upload Missing Documents
              </h1>

              <p className="mt-2 text-[13px] text-slate-500 max-w-2xl leading-5">
                Upload only the documents required for this tender that
                are not already available in your bidder profile.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span className="text-[11px] font-semibold text-blue-800">
                Compliance Documents
              </span>
            </div>
          </div>
        </div>

        {/* Status strip */}
        {!allResolved && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
              <p className="text-[11px] font-medium text-slate-500">
                Documents Required
              </p>
              <p className="mt-1 text-[21px] font-bold text-slate-900">
                {missingItems.length}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
              <p className="text-[11px] font-medium text-slate-500">
                Selected for Upload
              </p>
              <p className="mt-1 text-[21px] font-bold text-blue-700">
                {uploadedCount}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-[11px] font-semibold text-amber-800">
                  Action Required
                </p>
              </div>
              <p className="mt-1 text-[11px] text-amber-700">
                Complete the missing document requirements.
              </p>
            </div>
          </div>
        )}

        {/* Main content */}
        <Card className="p-0 overflow-hidden">
          {allResolved ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <h2 className="mt-5 text-[18px] font-bold text-slate-900">
                All Required Documents Are Available
              </h2>

              <p className="mt-2 max-w-md mx-auto text-[13px] leading-5 text-slate-500">
                Your bidder profile already contains all documents
                required for this tender.
              </p>

              <Button
                variant="primary"
                className="mt-6"
                onClick={() =>
                  navigate(`/bidder/tenders/${tender.id}`)
                }
              >
                Back to Tender
              </Button>
            </div>
          ) : (
            <>
              {/* Section header */}
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <FileUp className="w-4.5 h-4.5 text-blue-700" />
                  </div>

                  <div>
                    <h2 className="text-[15px] font-bold text-slate-900">
                      Additional Documents
                    </h2>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      These documents are specifically required for this
                      tender.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload fields */}
              <div className="p-6">
                <div className="space-y-4">
                  {missingItems.map((item, index) => (
                    <div
                      key={item.extraKey}
                      className="border border-slate-200 rounded-xl p-4 bg-white"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-slate-600">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div>
                          <p className="text-[13px] font-semibold text-slate-800">
                            {item.label}
                          </p>

                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Upload the document required to satisfy this
                            compliance item.
                          </p>
                        </div>
                      </div>

                      <FileUploadField
                        label=""
                        fileName={pendingUploads[item.extraKey]}
                        onChange={(fileName) =>
                          handleFileSelect(
                            item.extraKey,
                            fileName
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Save */}
                <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />

                    <p className="text-[11px] text-slate-500">
                      Uploaded documents will be used during compliance
                      verification.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    disabled={!hasPendingUploads || saving}
                    onClick={handleSaveAll}
                    className="sm:min-w-[210px]"
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? "Saving Documents..."
                      : "Save Uploaded Documents"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Information note */}
        {!allResolved && (
          <div className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
            <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

            <p className="text-[11px] leading-5 text-blue-800">
              BidSure uses your existing bidder profile documents wherever
              possible. You only need to provide additional documents that
              are required by this specific tender.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}