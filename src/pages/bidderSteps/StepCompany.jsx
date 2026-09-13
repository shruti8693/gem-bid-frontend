import {
  TextField,
  SelectField,
  FileUploadField,
} from "../../components/FormFields";

const COMPANY_TYPES = [
  "Private Limited",
  "Public Limited",
  "Partnership",
  "Sole Proprietorship",
  "LLP",
];

export default function StepCompany({ form, update }) {
  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Company Registration / Legal Identity
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide the legal and registration details of your organization.
        </p>
      </div>

      {/* Company details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <TextField
          label="Company Name"
          value={form.companyName}
          onChange={(v) => update("companyName", v)}
          required
          placeholder="Enter registered company name"
        />

        <SelectField
          label="Company Type"
          value={form.companyType}
          onChange={(v) => update("companyType", v)}
          options={COMPANY_TYPES}
          required
        />

        <TextField
          label="Company Registration Number"
          value={form.companyRegNumber}
          onChange={(v) => update("companyRegNumber", v)}
          required
          placeholder="Enter registration number"
        />

        <TextField
          label="Date of Incorporation"
          type="date"
          value={form.incorporationDate}
          onChange={(v) => update("incorporationDate", v)}
          required
        />

      </div>

      {/* Address */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Registered Address
        </h3>

        <div className="space-y-5">

          <TextField
            label="Registered Address"
            value={form.registeredAddress}
            onChange={(v) => update("registeredAddress", v)}
            required
            placeholder="Enter complete registered address"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <TextField
              label="State"
              value={form.state}
              onChange={(v) => update("state", v)}
              required
              placeholder="Enter state"
            />

            <TextField
              label="City"
              value={form.city}
              onChange={(v) => update("city", v)}
              required
              placeholder="Enter city"
            />

          </div>

        </div>
      </div>

      {/* Supporting document */}
      <div className="pt-2 border-t border-slate-200">

        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Supporting Document
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upload the document used to verify your company registration.
          </p>
        </div>

        <FileUploadField
          label="Company Registration Certificate"
          fileName={form.companyRegCertFile}
          onChange={(v) => update("companyRegCertFile", v)}
          required
        />

      </div>
    </div>
  );
}