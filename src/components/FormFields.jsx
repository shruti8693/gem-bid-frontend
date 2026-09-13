import { Upload, CheckCircle2, FileText } from "lucide-react";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder = "",
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-11
          border border-slate-300
          rounded-lg
          px-3.5
          text-sm text-slate-900
          bg-white
          placeholder:text-slate-400
          transition-all duration-150
          focus:outline-none
          focus:border-blue-600
          focus:ring-4
          focus:ring-blue-100
        "
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required = true,
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-11
          border border-slate-300
          rounded-lg
          px-3.5
          text-sm text-slate-900
          bg-white
          transition-all duration-150
          focus:outline-none
          focus:border-blue-600
          focus:ring-4
          focus:ring-blue-100
        "
      >
        <option value="">Select {label}</option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FileUploadField({
  label,
  fileName,
  onChange,
  required = true,
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <label
        className="
          flex items-center gap-3
          min-h-12
          border border-dashed border-slate-300
          rounded-lg
          px-3.5 py-2.5
          text-sm
          bg-slate-50
          cursor-pointer
          transition-all duration-150
          hover:border-blue-500
          hover:bg-blue-50
        "
      >
        {fileName ? (
          <>
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {fileName}
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                PDF selected successfully
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4 text-blue-700" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Choose PDF file
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a PDF document
              </p>
            </div>
          </>
        )}

        <input
          type="file"
          accept="application/pdf"
          required={required && !fileName}
          className="hidden"
          onChange={(e) => onChange(e.target.files[0]?.name ?? "")}
        />
      </label>
    </div>
  );
}

// For "Is this certification applicable?" — Yes/No toggle
export function YesNoField({
  label,
  value,
  onChange,
  required = true,
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`
              min-w-20
              px-4 py-2
              rounded-lg
              text-sm font-semibold
              border
              transition-all duration-150
              ${
                value === opt
                  ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:bg-blue-50"
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}