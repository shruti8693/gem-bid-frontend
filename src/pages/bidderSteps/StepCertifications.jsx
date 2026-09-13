import {
  YesNoField,
  FileUploadField,
} from "../../components/FormFields";

export default function StepCertifications({ form, update }) {
  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Certifications
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Indicate which certifications are applicable to your organization
          and upload supporting documents where applicable.
        </p>
      </div>

      {/* ISO Certification */}
      <div className="space-y-4 pb-5 border-b border-slate-200">
        <YesNoField
          label="Is ISO Certification applicable?"
          value={form.isoApplicable}
          onChange={(v) => update("isoApplicable", v)}
          required
        />

        {form.isoApplicable === "Yes" && (
          <FileUploadField
            label="ISO Certificate"
            fileName={form.isoFile}
            onChange={(v) => update("isoFile", v)}
            required
          />
        )}
      </div>

      {/* BIS Certification */}
      <div className="space-y-4 pb-5 border-b border-slate-200">
        <YesNoField
          label="Is BIS Certification applicable?"
          value={form.bisApplicable}
          onChange={(v) => update("bisApplicable", v)}
          required
        />

        {form.bisApplicable === "Yes" && (
          <FileUploadField
            label="BIS Certificate"
            fileName={form.bisFile}
            onChange={(v) => update("bisFile", v)}
            required
          />
        )}
      </div>

      {/* Other Certification */}
      <div className="space-y-4">
        <YesNoField
          label="Any other relevant certification applicable?"
          value={form.otherCertApplicable}
          onChange={(v) => update("otherCertApplicable", v)}
          required
        />

        {form.otherCertApplicable === "Yes" && (
          <FileUploadField
            label="Other Certification Document"
            fileName={form.otherCertFile}
            onChange={(v) => update("otherCertFile", v)}
            required
          />
        )}
      </div>

    </div>
  );
}