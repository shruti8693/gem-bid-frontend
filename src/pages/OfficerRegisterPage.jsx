import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  Check,
  UserCheck,
  Building2,
  FileCheck2,
  LockKeyhole,
} from "lucide-react";
import Button from "../components/Button";
import { registerOfficer } from "../services/api";
import { setCurrentUser } from "../utils/auth";

const PERMISSIONS = [
  "View Tender",
  "View Bids",
  "Review Compliance",
  "View Risk Reports",
  "Evaluate Bid",
  "Make Recommendation",
];

function TextField({
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

function FileUploadField({
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
          onChange={(e) =>
            onChange(e.target.files[0]?.name ?? "")
          }
        />
      </label>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-blue-700" />
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function OfficerRegisterPage() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // A. Officer Identity
    fullName: "",
    employeeId: "",
    designation: "",
    department: "",
    officialEmail: "",
    officialPhone: "",

    // B. Organization Association
    organization: "",
    employeeNumber: "",

    // C. Authorization Proof
    authorizationDocFile: "",

    // Login credential
    password: "",
  });

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  }

  function validateForm() {
    const requiredFields = [
      ["fullName", "Full Name"],
      ["employeeId", "Employee ID"],
      ["designation", "Designation"],
      ["department", "Department"],
      ["officialEmail", "Official Email"],
      ["officialPhone", "Official Phone"],
      ["organization", "Organization"],
      ["employeeNumber", "Employee Number"],
      ["authorizationDocFile", "Officer Authorization / Role Proof"],
      ["password", "Password"],
    ];

    const missing = requiredFields
      .filter(([field]) => {
        const value = form[field];

        return (
          value === undefined ||
          value === null ||
          String(value).trim() === ""
        );
      })
      .map(([, label]) => label);

    if (missing.length > 0) {
      setError(
        `Please complete the required field${
          missing.length > 1 ? "s" : ""
        }: ${missing.join(", ")}`
      );

      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.officialEmail.trim()
      )
    ) {
      setError("Please enter a valid Official Email address.");
      return false;
    }

    if (form.password.trim().length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { user } = await registerOfficer(form);

      setCurrentUser(user);
      navigate("/officer/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 h-[76px] bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-6 lg:px-10 flex items-center justify-between">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <img
              src="/bidsure logo.jpeg"
              alt="BidSure AI"
              className="h-14 w-auto object-contain"
            />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Secure Registration</span>
          </div>

        </div>
      </header>

      {/* PAGE */}
      <main className="relative min-h-[calc(100vh-76px)] overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue-100/60 blur-3xl" />

          <div className="absolute top-20 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 w-[500px] h-[220px] rounded-full bg-indigo-100/40 blur-3xl" />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-r from-orange-100/50 via-white to-green-100/50" />

        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">

          {/* PAGE HEADING */}
          <div className="mb-8">

            <p className="text-xs font-bold tracking-[0.16em] uppercase text-blue-700">
              BidSure AI
            </p>

            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
              Procurement Officer Registration
            </h1>

            <p className="mt-2 text-sm sm:text-[15px] text-slate-600">
              Register to verify, evaluate and decide on submitted bids.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* OFFICER IDENTITY */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7">

              <SectionHeader
                icon={UserCheck}
                title="Official Employee / Officer Identity"
                description="Provide your official employee and contact information."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <TextField
                  label="Full Name"
                  value={form.fullName}
                  onChange={(v) => update("fullName", v)}
                  placeholder="Enter full name"
                  required
                />

                <TextField
                  label="Employee ID"
                  value={form.employeeId}
                  onChange={(v) => update("employeeId", v)}
                  placeholder="Enter employee ID"
                  required
                />

                <TextField
                  label="Designation"
                  value={form.designation}
                  onChange={(v) => update("designation", v)}
                  placeholder="Enter designation"
                  required
                />

                <TextField
                  label="Department"
                  value={form.department}
                  onChange={(v) => update("department", v)}
                  placeholder="Enter department"
                  required
                />

                <TextField
                  label="Official Email"
                  type="email"
                  value={form.officialEmail}
                  onChange={(v) => update("officialEmail", v)}
                  placeholder="official@organization.gov.in"
                  required
                />

                <TextField
                  label="Official Phone"
                  type="tel"
                  value={form.officialPhone}
                  onChange={(v) => update("officialPhone", v)}
                  placeholder="Enter official phone number"
                  required
                />

              </div>

            </section>

            {/* ORGANIZATION ASSOCIATION */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7">

              <SectionHeader
                icon={Building2}
                title="Organization Association"
                description="Provide the organization and employee reference details."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <TextField
                  label="Organization"
                  value={form.organization}
                  onChange={(v) =>
                    update("organization", v)
                  }
                  placeholder="Enter organization name"
                  required
                />

                <TextField
                  label="Employee Number"
                  value={form.employeeNumber}
                  onChange={(v) =>
                    update("employeeNumber", v)
                  }
                  placeholder="Enter employee number"
                  required
                />

              </div>

            </section>

            {/* AUTHORIZATION */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7">

              <SectionHeader
                icon={FileCheck2}
                title="Authorization / Role Proof"
                description="Upload documentation supporting your officer role and authorization."
              />

              <FileUploadField
                label="Officer Authorization / Role Proof"
                fileName={form.authorizationDocFile}
                onChange={(v) =>
                  update("authorizationDocFile", v)
                }
                required
              />

            </section>

            {/* PERMISSIONS */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7">

              <SectionHeader
                icon={ShieldCheck}
                title="Role / Permissions"
                description="The following permissions are predefined for procurement officers."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {PERMISSIONS.map((perm) => (
                  <div
                    key={perm}
                    className="
                      flex items-center gap-3
                      rounded-lg
                      border border-slate-200
                      bg-slate-50
                      px-4 py-3
                    "
                  >
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-green-700" />
                    </div>

                    <span className="text-sm font-medium text-slate-800">
                      {perm}
                    </span>
                  </div>
                ))}

              </div>

            </section>

            {/* PASSWORD */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7">

              <SectionHeader
                icon={LockKeyhole}
                title="Account Security"
                description="Create a password for accessing your BidSure AI officer account."
              />

              <div className="max-w-xl">

                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(v) =>
                    update("password", v)
                  }
                  placeholder="Create a secure password"
                  required
                />

                <p className="mt-2 text-xs text-slate-500">
                  Password must contain at least 6 characters.
                </p>

              </div>

            </section>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>

              </div>
            )}

            {/* SUBMIT */}
            <div className="flex justify-end">

              <Button
                type="submit"
                variant="primary"
                className="min-w-[220px]"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Complete Registration"}
              </Button>

            </div>

          </form>

          {/* REASSURANCE */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>
              Your registration information is handled securely.
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}