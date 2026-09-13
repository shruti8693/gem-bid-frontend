import {
  TextField,
  FileUploadField,
} from "../../components/FormFields";

export default function StepExperience({ form, update }) {
  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Experience Certificates
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide details of your previous projects and relevant experience.
        </p>
      </div>

      {/* Experience information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <TextField
          label="Years of Experience"
          type="number"
          value={form.yearsExperience}
          onChange={(v) => update("yearsExperience", v)}
          placeholder="e.g. 5"
          required
        />

        <TextField
          label="Previous Government Projects"
          value={form.previousGovtProjects}
          onChange={(v) => update("previousGovtProjects", v)}
          placeholder="e.g. Names or count of past government contracts"
          required
        />

        <div className="md:col-span-2">
          <TextField
            label="Major Completed Projects"
            value={form.majorCompletedProjects}
            onChange={(v) => update("majorCompletedProjects", v)}
            placeholder="Brief description of major completed work"
            required
          />
        </div>

      </div>

      {/* Experience certificates */}
      <div className="pt-2 border-t border-slate-200">

        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Supporting Document
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upload certificates or documents supporting your claimed experience.
          </p>
        </div>

        <FileUploadField
          label="Experience Certificates"
          fileName={form.experienceCertFile}
          onChange={(v) => update("experienceCertFile", v)}
          required
        />

      </div>
    </div>
  );
}