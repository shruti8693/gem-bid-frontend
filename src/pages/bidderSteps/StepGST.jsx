import {
  TextField,
  SelectField,
  FileUploadField,
} from "../../components/FormFields";

const GST_STATUSES = ["Active", "Cancelled", "Suspended"];

export default function StepGST({ form, update }) {
  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          GST Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide your GST registration information for verification.
        </p>
      </div>

      {/* GST information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <TextField
          label="GSTIN"
          value={form.gstin}
          onChange={(v) => update("gstin", v)}
          placeholder="e.g. 27ABCDE1234F1Z5"
          required
        />

        <TextField
          label="Legal Business Name"
          value={form.legalBusinessName}
          onChange={(v) => update("legalBusinessName", v)}
          placeholder="Enter legal business name"
          required
        />

        <TextField
          label="GST Registration Date"
          type="date"
          value={form.gstRegDate}
          onChange={(v) => update("gstRegDate", v)}
          required
        />

        <SelectField
          label="GST Status"
          value={form.gstStatus}
          onChange={(v) => update("gstStatus", v)}
          options={GST_STATUSES}
          required
        />

      </div>

      {/* GST Certificate */}
      <div className="pt-2 border-t border-slate-200">

        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Supporting Document
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upload your GST registration certificate for document verification.
          </p>
        </div>

        <FileUploadField
          label="GST Certificate"
          fileName={form.gstCertFile}
          onChange={(v) => update("gstCertFile", v)}
          required
        />

      </div>
    </div>
  );
}