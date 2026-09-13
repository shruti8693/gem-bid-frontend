import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileWarning,
  ShieldCheck,
  ShieldAlert,
  FileText,
  FileCheck2,
  Database,
  BrainCircuit,
  Search,
  ChevronRight,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";

import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getTenderById,
  getOfficerProfile,
} from "../../services/api";

function statusColor(status) {
  if (status === "verified") return "green";
  if (status === "review") return "amber";
  if (status === "failed") return "red";
  return "neutral";
}

function statusLabel(status) {
  if (status === "verified") return "Verified";
  if (status === "review") return "Review Required";
  if (status === "failed") return "Non-Compliant";
  return "Missing";
}

function statusIcon(status) {
  if (status === "verified") {
    return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
  }

  if (status === "review") {
    return <AlertTriangle className="w-5 h-5 text-amber-600" />;
  }

  if (status === "failed") {
    return <XCircle className="w-5 h-5 text-red-600" />;
  }

  return <FileWarning className="w-5 h-5 text-slate-400" />;
}

function statusBackground(status) {
  if (status === "verified") {
    return "bg-emerald-50 border-emerald-100";
  }

  if (status === "review") {
    return "bg-amber-50 border-amber-100";
  }

  if (status === "failed") {
    return "bg-red-50 border-red-100";
  }

  return "bg-slate-50 border-slate-200";
}

export default function ComplianceXrayPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [officer, setOfficer] = useState(null);
  const [bid, setBid] = useState(null);
  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

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

        const [bidderProfile, tenderData] = await Promise.all([
          getBidderProfile(bidData.bidderId),
          getTenderById(bidData.tenderId),
        ]);

        setBidder(bidderProfile);
        setTender(tenderData);
      })
      .catch(() => {
        setBid(null);
        setTender(null);
      });
  }, [id, navigate]);

  const requirements = useMemo(() => {
    if (!bid) return [];

    return [
      {
        id: 1,
        name: "GST Registration",
        category: "Statutory",
        status: "verified",
        evidence: "GST Certificate",
        value: "GSTIN verified successfully",
        source: "GSTN",
        validity: "Valid",
        confidence: 98,
      },
      {
        id: 2,
        name: "PAN Verification",
        category: "Statutory",
        status: "verified",
        evidence: "PAN Card",
        value: bidder?.pan ?? "PAN matched",
        source: "Income Tax / PAN",
        validity: "Valid",
        confidence: 99,
      },
      {
        id: 3,
        name: "Turnover ≥ ₹10 Cr",
        category: "Financial",
        status: "review",
        evidence: "CA Turnover Certificate + Financial Statement",
        value: "CA Certificate: ₹14 Cr | Financial Statement: ₹8 Cr",
        source: "Financial Documents",
        validity: "Review",
        finding: "Turnover contradiction detected",
        confidence: 94,
      },
      {
        id: 4,
        name: "5 Years Experience",
        category: "Eligibility",
        status: "verified",
        evidence: "Experience Certificate",
        value: `${bidder?.yearsExperience ?? 5} years`,
        source: "Submitted Documents",
        validity: "Valid",
        confidence: 96,
      },
      {
        id: 5,
        name: "3-Year Warranty",
        category: "Technical",
        status: "failed",
        evidence: "Product Datasheet",
        value: "Offered: 2 Years | Required: 3 Years",
        source: "Tender Requirement",
        validity: "Non-Compliant",
        finding: "Warranty requirement not met",
        confidence: 97,
      },
      {
        id: 6,
        name: "ISO Certification",
        category: "Certification",
        status: "missing",
        evidence: "ISO Certificate",
        value: "Document not submitted",
        source: "Tender Requirement",
        validity: "Missing",
        finding: "ISO certificate missing",
        confidence: 100,
      },
      {
        id: 7,
        name: "Company Registration",
        category: "Statutory",
        status: "verified",
        evidence: "Company Registration Certificate",
        value: bidder?.companyRegNumber ?? "Verified",
        source: "MCA",
        validity: "Valid",
        confidence: 98,
      },
      {
        id: 8,
        name: "Udyam / MSME Status",
        category: "Statutory",
        status: "verified",
        evidence: "Udyam Registration",
        value: "Verified",
        source: "Udyam Registry",
        validity: "Valid",
        confidence: 97,
      },
    ];
  }, [bid, bidder]);

  const counts = useMemo(
    () => ({
      verified: requirements.filter((r) => r.status === "verified").length,
      review: requirements.filter((r) => r.status === "review").length,
      failed: requirements.filter((r) => r.status === "failed").length,
      missing: requirements.filter((r) => r.status === "missing").length,
    }),
    [requirements]
  );

  const analyzedCount = requirements.length;

  const compliantPercentage = analyzedCount
    ? Math.round((counts.verified / analyzedCount) * 100)
    : 0;

  if (!bid || !tender) {
    return (
      <DashboardLayout
        role="officer"
        userName={officer?.fullName ?? "Officer"}
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />

            <p className="mt-3 text-sm text-slate-500">
              Loading Compliance X-Ray...
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
      {/* HEADER */}
      <div className="mb-5">
        <button
          type="button"
          onClick={() => navigate(`/officer/bids/${id}`)}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bid Review
        </button>

        <div className="mt-4 flex items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-700" />
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-blue-700">
                  Explainable Compliance Engine
                </p>

                <h1 className="text-[26px] leading-tight font-bold text-slate-900">
                  Compliance X-Ray
                </h1>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-4 flex-wrap text-[12px] text-slate-500">
              <span className="font-semibold text-slate-700">
                {bidder?.companyName}
              </span>

              <span>•</span>

              <span>{tender.tenderId}</span>

              <span>•</span>

              <span>{tender.title}</span>
            </div>
          </div>

          <StatusBadge status="amber">
            REVIEW REQUIRED
          </StatusBadge>
        </div>
      </div>

      {/* EXPLAINABILITY BANNER */}
      <div className="mb-4 rounded-xl bg-slate-900 px-5 py-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>

          <div>
            <p className="text-[13px] font-bold text-white">
              See exactly why each requirement passed, failed or needs review.
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
              The X-Ray maps tender requirements to bidder documents,
              extracted values and verification sources so the procurement
              officer can inspect the evidence behind every AI finding.
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        <SummaryCard
          label="Requirements"
          value={analyzedCount}
          icon={FileText}
          tone="blue"
        />

        <SummaryCard
          label="Verified"
          value={counts.verified}
          icon={CheckCircle2}
          tone="green"
        />

        <SummaryCard
          label="Review"
          value={counts.review}
          icon={AlertTriangle}
          tone="amber"
        />

        <SummaryCard
          label="Non-Compliant"
          value={counts.failed}
          icon={XCircle}
          tone="red"
        />

        <SummaryCard
          label="Missing"
          value={counts.missing}
          icon={FileWarning}
          tone="slate"
        />
      </div>

      {/* SCORE + FLOW */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <Card className="col-span-4" title="Compliance Health">
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0">
              <div className="absolute inset-0 rounded-full border-[9px] border-slate-100" />

              <div
                className="absolute inset-0 rounded-full border-[9px] border-emerald-500"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[22px] leading-none font-bold text-slate-900">
                    {bid.complianceScore}%
                  </p>

                  <p className="mt-1 text-[9px] uppercase font-bold text-slate-400">
                    Score
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] font-bold text-slate-800">
                {compliantPercentage}% of requirements verified
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {counts.review + counts.failed + counts.missing} item(s)
                require officer attention.
              </p>
            </div>
          </div>
        </Card>

        <Card className="col-span-8" title="Evidence Verification Flow">
          <div className="grid grid-cols-4 gap-2">
            <FlowStep
              number="01"
              icon={FileText}
              title="Requirement"
              detail="Tender condition"
            />

            <FlowArrow />

            <FlowStep
              number="02"
              icon={FileCheck2Icon}
              title="Document"
              detail="Bidder evidence"
            />

            <FlowArrow />

            <FlowStep
              number="03"
              icon={Database}
              title="Verification"
              detail="Authoritative source"
            />

            <FlowArrow />

            <FlowStep
              number="04"
              icon={BrainCircuit}
              title="AI Finding"
              detail="Explainable result"
            />
          </div>
        </Card>
      </div>

      {/* REQUIREMENT TABLE */}
      <Card
        title="Requirement-by-Requirement Evidence Graph"
        action={
          <span className="text-[11px] text-slate-400">
            Select any requirement to inspect evidence
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="w-[23%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Requirement
                </th>

                <th className="w-[13%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="w-[23%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Evidence
                </th>

                <th className="w-[17%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Source
                </th>

                <th className="w-[12%] pb-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Confidence
                </th>

                <th className="w-[12%] pb-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Inspect
                </th>
              </tr>
            </thead>

            <tbody>
              {requirements.map((requirement) => (
                <tr
                  key={requirement.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      {statusIcon(requirement.status)}

                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-slate-800 truncate">
                          {requirement.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {requirement.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">
                    <StatusBadge
                      status={statusColor(requirement.status)}
                    >
                      {statusLabel(requirement.status)}
                    </StatusBadge>
                  </td>

                  <td className="py-3 pr-3">
                    <p className="text-[11px] font-medium text-slate-700 truncate">
                      {requirement.evidence}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400 truncate">
                      {requirement.value}
                    </p>
                  </td>

                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                      {requirement.source}
                    </span>
                  </td>

                  <td className="py-3">
                    <span className="text-[12px] font-bold text-slate-800">
                      {requirement.confidence}%
                    </span>
                  </td>

                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRequirement(requirement)
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
                    >
                      Inspect
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SELECTED EVIDENCE */}
      {selectedRequirement && (
        <div className="mt-4">
          <Card
            title="Evidence Inspection"
            action={
              <button
                type="button"
                onClick={() => setSelectedRequirement(null)}
                className="text-[11px] font-semibold text-slate-500 hover:text-blue-700"
              >
                Close
              </button>
            }
          >
            <div className="grid grid-cols-12 gap-5">
              {/* REQUIREMENT */}
              <div className="col-span-3">
                <EvidenceNode
                  icon={FileText}
                  step="01"
                  title="Tender Requirement"
                  value={selectedRequirement.name}
                  tone="blue"
                />
              </div>

              <EvidenceConnector />

              {/* DOCUMENT */}
              <div className="col-span-3">
                <EvidenceNode
                  icon={FileCheck2Icon}
                  step="02"
                  title="Bidder Evidence"
                  value={selectedRequirement.evidence}
                  tone="indigo"
                />
              </div>

              <EvidenceConnector />

              {/* SOURCE */}
              <div className="col-span-3">
                <EvidenceNode
                  icon={Database}
                  step="03"
                  title="Verification Source"
                  value={selectedRequirement.source}
                  tone="green"
                />
              </div>
            </div>

            {/* EXTRACTED VALUE */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Extracted / Verified Value
                </p>

                <p className="mt-2 text-[13px] font-semibold text-slate-800">
                  {selectedRequirement.value}
                </p>
              </div>

              <div
                className={`rounded-xl border p-4 ${statusBackground(
                  selectedRequirement.status
                )}`}
              >
                <div className="flex items-center gap-2">
                  {statusIcon(selectedRequirement.status)}

                  <p className="text-[11px] font-bold text-slate-800">
                    AI Finding
                  </p>
                </div>

                <p className="mt-2 text-[12px] font-semibold text-slate-800">
                  {selectedRequirement.finding ||
                    "Requirement verified successfully."}
                </p>
              </div>
            </div>

            {/* VALIDITY */}
            <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 bg-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Document Validity
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-700">
                  {selectedRequirement.validity}
                </p>
              </div>

              <StatusBadge
                status={statusColor(
                  selectedRequirement.validity === "Valid"
                    ? "verified"
                    : selectedRequirement.status
                )}
              >
                {selectedRequirement.validity}
              </StatusBadge>
            </div>
          </Card>
        </div>
      )}

      {/* KEY FINDINGS */}
      <div className="grid grid-cols-12 gap-4 mt-4">
        <Card className="col-span-7" title="Key Findings">
          <div className="space-y-3">
            <Finding
              tone="amber"
              title="Turnover contradiction"
              detail="CA Certificate reports ₹14 Cr while the Financial Statement reports ₹8 Cr."
            />

            <Finding
              tone="red"
              title="Warranty requirement not met"
              detail="Tender requires 3 years; bidder has offered 2 years."
            />

            <Finding
              tone="slate"
              title="ISO Certificate missing"
              detail="The required ISO certificate was not included in the submitted evidence."
            />
          </div>
        </Card>

        <Card className="col-span-5" title="AI Recommendation">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            </div>

            <div>
              <p className="text-[13px] font-bold text-slate-800">
                Review before final evaluation
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Review the financial contradiction and request the
                missing/updated ISO evidence before making the final
                evaluation decision.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mt-5"
            onClick={() =>
              navigate(`/officer/bids/${id}/clarify`)
            }
          >
            Request Clarification
          </Button>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

            <p className="text-[10px] leading-relaxed text-slate-500">
              AI provides decision support. The authorized Procurement
              Officer retains final qualification and decision authority.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${styles[tone]}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-[24px] leading-none font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function FlowStep({ number, icon: Icon, title, detail }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-700" />
      </div>

      <div>
        <p className="text-[10px] font-bold text-blue-700">
          {number}
        </p>

        <p className="text-[11px] font-bold text-slate-800">
          {title}
        </p>

        <p className="text-[9px] text-slate-400">
          {detail}
        </p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center">
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </div>
  );
}

function EvidenceNode({ icon: Icon, step, title, value, tone }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles[tone]}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
          {step}
        </span>
      </div>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-[12px] font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function EvidenceConnector() {
  return (
    <div className="col-span-1 flex items-center justify-center">
      <div className="flex items-center">
        <div className="w-5 border-t border-dashed border-slate-300" />
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </div>
    </div>
  );
}

function Finding({ tone, title, detail }) {
  const styles = {
    amber: "border-amber-100 bg-amber-50",
    red: "border-red-100 bg-red-50",
    slate: "border-slate-200 bg-slate-50",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[tone]}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />

        <div>
          <p className="text-[12px] font-bold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

function FileCheck2Icon() {
  return <FileCheck2 className="w-4 h-4" />;
}