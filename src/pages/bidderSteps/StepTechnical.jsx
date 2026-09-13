import {
  TextField,
  FileUploadField,
} from "../../components/FormFields";

export default function StepTechnical({ form, update }) {
  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Technical Capability
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide details of your infrastructure, equipment, manpower, and
          technical capacity.
        </p>
      </div>

      {/* Technical information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <TextField
          label="Technical Infrastructure"
          value={form.technicalInfrastructure}
          onChange={(v) => update("technicalInfrastructure", v)}
          placeholder="e.g. Facilities, plant capacity"
          required
        />

        <TextField
          label="Equipment"
          value={form.equipment}
          onChange={(v) => update("equipment", v)}
          placeholder="Enter major equipment details"
          required
        />

        <TextField
          label="Manpower"
          value={form.manpower}
          onChange={(v) => update("manpower", v)}
          placeholder="e.g. Number of technical staff"
          required
        />

        <TextField
          label="Technical Capacity"
          value={form.technicalCapacity}
          onChange={(v) => update("technicalCapacity", v)}
          placeholder="e.g. 1200 units/day"
          required
        />

      </div>

      {/* Technical documents */}
      <div className="pt-2 border-t border-slate-200">

        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Supporting Documents
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upload documents supporting your technical capability.
          </p>
        </div>

        <FileUploadField
          label="Technical Capability Documents"
          fileName={form.technicalDocFile}
          onChange={(v) => update("technicalDocFile", v)}
          required
        />

      </div>
    </div>
  );
}