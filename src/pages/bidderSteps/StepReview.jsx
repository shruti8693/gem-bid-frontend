function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2.5 border-b border-slate-100 last:border-b-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-900 sm:text-right break-words">
        {value || "—"}
      </span>
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
        {title}
      </h3>

      <div>
        {children}
      </div>
    </div>
  );
}

function DocumentStatus({ label, fileName }) {
  const uploaded = Boolean(fileName);

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          uploaded
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {uploaded ? "Uploaded" : "Missing"}
      </span>
    </div>
  );
}

export default function StepReview({ form }) {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Review & Submit
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review your registration details and uploaded documents before
          submitting your bidder profile.
        </p>
      </div>

      {/* Company */}
      <ReviewSection title="Company Identity">
        <ReviewRow label="Company Name" value={form.companyName} />
        <ReviewRow label="Company Type" value={form.companyType} />
        <ReviewRow
          label="Registration Number"
          value={form.companyRegNumber}
        />
        <ReviewRow label="Address" value={form.registeredAddress} />
        <ReviewRow
          label="State / City"
          value={
            form.state || form.city
              ? `${form.state || "—"} / ${form.city || "—"}`
              : ""
          }
        />
        <ReviewRow
          label="Date of Incorporation"
          value={form.incorporationDate}
        />
      </ReviewSection>

      {/* GST */}
      <ReviewSection title="GST Details">
        <ReviewRow label="GSTIN" value={form.gstin} />
        <ReviewRow
          label="Legal Business Name"
          value={form.legalBusinessName}
        />
        <ReviewRow
          label="GST Registration Date"
          value={form.gstRegDate}
        />
        <ReviewRow label="GST Status" value={form.gstStatus} />
      </ReviewSection>

      {/* PAN */}
      <ReviewSection title="PAN Details">
        <ReviewRow label="PAN Number" value={form.panNumber} />
        <ReviewRow
          label="PAN Holder / Company Name"
          value={form.panHolderName}
        />
      </ReviewSection>

      {/* Experience */}
      <ReviewSection title="Experience">
        <ReviewRow
          label="Years of Experience"
          value={form.yearsExperience}
        />
        <ReviewRow
          label="Previous Government Projects"
          value={form.previousGovtProjects}
        />
        <ReviewRow
          label="Major Completed Projects"
          value={form.majorCompletedProjects}
        />
      </ReviewSection>

      {/* Financial */}
      <ReviewSection title="Financial Information">
        <ReviewRow
          label="Annual Turnover"
          value={form.annualTurnover ? `₹ ${form.annualTurnover}` : ""}
        />
        <ReviewRow
          label="Financial Year"
          value={form.financialYear}
        />
        <ReviewRow
          label="Net Worth"
          value={form.netWorth ? `₹ ${form.netWorth}` : ""}
        />
      </ReviewSection>

      {/* Technical */}
      <ReviewSection title="Technical Capability">
        <ReviewRow
          label="Technical Infrastructure"
          value={form.technicalInfrastructure}
        />
        <ReviewRow
          label="Equipment"
          value={form.equipment}
        />
        <ReviewRow
          label="Manpower"
          value={form.manpower}
        />
        <ReviewRow
          label="Technical Capacity"
          value={form.technicalCapacity}
        />
      </ReviewSection>

      {/* Certifications */}
      <ReviewSection title="Certifications">
        <ReviewRow
          label="ISO Applicable"
          value={form.isoApplicable}
        />
        {form.isoApplicable === "Yes" && (
          <ReviewRow
            label="ISO Certificate"
            value={form.isoFile}
          />
        )}

        <ReviewRow
          label="BIS Applicable"
          value={form.bisApplicable}
        />
        {form.bisApplicable === "Yes" && (
          <ReviewRow
            label="BIS Certificate"
            value={form.bisFile}
          />
        )}

        <ReviewRow
          label="Other Certification Applicable"
          value={form.otherCertApplicable}
        />
        {form.otherCertApplicable === "Yes" && (
          <ReviewRow
            label="Other Certification"
            value={form.otherCertFile}
          />
        )}
      </ReviewSection>

      {/* Representative */}
      <ReviewSection title="Authorized Representative">
        <ReviewRow
          label="Name"
          value={form.representativeName}
        />
        <ReviewRow
          label="Designation"
          value={form.representativeDesignation}
        />
        <ReviewRow
          label="Official Email"
          value={form.representativeEmail}
        />
        <ReviewRow
          label="Official Phone"
          value={form.representativePhone}
        />
      </ReviewSection>

      {/* Documents */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Document Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <DocumentStatus
            label="Company Registration Certificate"
            fileName={form.companyRegCertFile}
          />

          <DocumentStatus
            label="GST Certificate"
            fileName={form.gstCertFile}
          />

          <DocumentStatus
            label="PAN Document"
            fileName={form.panDocFile}
          />

          <DocumentStatus
            label="Experience Certificate"
            fileName={form.experienceCertFile}
          />

          <DocumentStatus
            label="Financial Statement"
            fileName={form.financialStatementFile}
          />

          <DocumentStatus
            label="Technical Capability Document"
            fileName={form.technicalDocFile}
          />

          {form.isoApplicable === "Yes" && (
            <DocumentStatus
              label="ISO Certificate"
              fileName={form.isoFile}
            />
          )}

          {form.bisApplicable === "Yes" && (
            <DocumentStatus
              label="BIS Certificate"
              fileName={form.bisFile}
            />
          )}

          {form.otherCertApplicable === "Yes" && (
            <DocumentStatus
              label="Other Certification"
              fileName={form.otherCertFile}
            />
          )}

          <DocumentStatus
            label="Authorization Document"
            fileName={form.representativeDocFile}
          />
        </div>
      </div>

      {/* Final notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">
          Final Review
        </p>

        <p className="mt-1 text-xs leading-5 text-amber-800">
          Please ensure that all information and documents are accurate before
          completing registration. Your submitted information may be used for
          compliance verification during procurement.
        </p>
      </div>

    </div>
  );
}