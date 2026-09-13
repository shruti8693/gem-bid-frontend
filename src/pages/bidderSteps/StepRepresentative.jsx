import {
  TextField,
  FileUploadField,
} from "../../components/FormFields";

export default function StepRepresentative({ form, update }) {
  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Organization Profile / Authorized Representative
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide the details of the person authorized to represent your
          organization.
        </p>
      </div>

      {/* Representative details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <TextField
          label="Authorized Representative Name"
          value={form.representativeName}
          onChange={(v) => update("representativeName", v)}
          placeholder="Enter full name"
          required
        />

        <TextField
          label="Designation"
          value={form.representativeDesignation}
          onChange={(v) => update("representativeDesignation", v)}
          placeholder="e.g. Director, Manager"
          required
        />

        <TextField
          label="Official Email"
          type="email"
          value={form.representativeEmail}
          onChange={(v) => update("representativeEmail", v)}
          placeholder="name@company.com"
          required
        />

        <TextField
          label="Official Phone"
          type="tel"
          value={form.representativePhone}
          onChange={(v) => update("representativePhone", v)}
          placeholder="Enter official phone number"
          required
        />

      </div>

      {/* Authorization document */}
      <div className="pt-2 border-t border-slate-200">

        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Authorization Document
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upload the document confirming the representative's authorization.
          </p>
        </div>

        <FileUploadField
          label="Authorization / Authorized Representative Document"
          fileName={form.representativeDocFile}
          onChange={(v) => update("representativeDocFile", v)}
          required
        />

      </div>

      {/* Password */}
      <div className="pt-5 border-t border-slate-200">

        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Account Security
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Create a password for accessing your BidSure AI account.
          </p>
        </div>

        <TextField
          label="Set a Password"
          type="password"
          value={form.password}
          onChange={(v) => update("password", v)}
          placeholder="Create a secure password"
          required
        />

      </div>
    </div>
  );
}