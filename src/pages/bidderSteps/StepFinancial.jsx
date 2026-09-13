import {
  TextField,
  FileUploadField,
} from "../../components/FormFields";

export default function StepFinancial({ form, update }) {
  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Audited Financial Statements
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide your financial information and supporting audited statement.
        </p>
      </div>

      {/* Financial information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <TextField
          label="Annual Turnover (₹)"
          type="number"
          value={form.annualTurnover}
          onChange={(v) => update("annualTurnover", v)}
          placeholder="Enter annual turnover"
          required
        />

        <TextField
          label="Financial Year"
          value={form.financialYear}
          onChange={(v) => update("financialYear", v)}
          placeholder="e.g. 2024-25"
          required
        />

        <TextField
          label="Net Worth (₹)"
          type="number"
          value={form.netWorth}
          onChange={(v) => update("netWorth", v)}
          placeholder="Enter net worth"
          required
        />

      </div>

      {/* Financial statement */}
      <div className="pt-2 border-t border-slate-200">

        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Supporting Document
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upload the audited financial statement used for verification.
          </p>
        </div>

        <FileUploadField
          label="Audited Financial Statement"
          fileName={form.financialStatementFile}
          onChange={(v) => update("financialStatementFile", v)}
          required
        />

      </div>
    </div>
  );
}