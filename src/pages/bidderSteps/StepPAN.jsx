import {
  TextField,
  FileUploadField,
} from "../../components/FormFields";

export default function StepPAN({ form, update }) {
  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          PAN Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide your PAN information for identity and tax verification.
        </p>
      </div>

      {/* PAN information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <TextField
          label="PAN Number"
          value={form.panNumber}
          onChange={(v) => update("panNumber", v)}
          placeholder="e.g. ABCDE1234F"
          required
        />

        <TextField
          label="PAN Holder / Company Name"
          value={form.panHolderName}
          onChange={(v) => update("panHolderName", v)}
          placeholder="Enter PAN holder or company name"
          required
        />

      </div>

      {/* PAN Document */}
      <div className="pt-2 border-t border-slate-200">

        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Supporting Document
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upload the PAN document used for verification.
          </p>
        </div>

        <FileUploadField
          label="PAN Document"
          fileName={form.panDocFile}
          onChange={(v) => update("panDocFile", v)}
          required
        />

      </div>
    </div>
  );
}