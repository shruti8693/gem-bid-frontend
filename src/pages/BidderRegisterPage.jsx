import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Button from "../components/Button";
import { registerBidder } from "../services/api";
import { setCurrentUser } from "../utils/auth";

import StepCompany from "./bidderSteps/StepCompany";
import StepGST from "./bidderSteps/StepGST";
import StepPAN from "./bidderSteps/StepPAN";
import StepExperience from "./bidderSteps/StepExperience";
import StepFinancial from "./bidderSteps/StepFinancial";
import StepTechnical from "./bidderSteps/StepTechnical";
import StepCertifications from "./bidderSteps/StepCertifications";
import StepRepresentative from "./bidderSteps/StepRepresentative";
import StepReview from "./bidderSteps/StepReview";

const STEPS = [
  { label: "Company", component: StepCompany },
  { label: "GST", component: StepGST },
  { label: "PAN", component: StepPAN },
  { label: "Experience", component: StepExperience },
  { label: "Financial", component: StepFinancial },
  { label: "Technical", component: StepTechnical },
  { label: "Certifications", component: StepCertifications },
  { label: "Representative", component: StepRepresentative },
  { label: "Review", component: StepReview },
];

const INITIAL_FORM = {
  // A. Company Identity
  companyName: "",
  companyType: "Private Limited",
  companyRegNumber: "",
  registeredAddress: "",
  state: "",
  city: "",
  incorporationDate: "",
  companyRegCertFile: "",

  // B. GST
  gstin: "",
  legalBusinessName: "",
  gstRegDate: "",
  gstStatus: "Active",
  gstCertFile: "",

  // C. PAN
  panNumber: "",
  panHolderName: "",
  panDocFile: "",

  // D. Experience
  yearsExperience: "",
  previousGovtProjects: "",
  majorCompletedProjects: "",
  experienceCertFile: "",

  // E. Financial
  annualTurnover: "",
  financialYear: "",
  netWorth: "",
  financialStatementFile: "",

  // F. Technical Capability
  technicalInfrastructure: "",
  equipment: "",
  manpower: "",
  technicalCapacity: "",
  technicalDocFile: "",

  // G. Certifications
  isoApplicable: "No",
  isoFile: "",
  bisApplicable: "No",
  bisFile: "",
  otherCertApplicable: "No",
  otherCertFile: "",

  // H. Representative
  representativeName: "",
  representativeDesignation: "",
  representativeEmail: "",
  representativePhone: "",
  representativeDocFile: "",

  // Login credential
  password: "",
};

/*
 * Required fields for each registration step.
 * Certification documents are handled conditionally below.
 */
const REQUIRED_FIELDS = {
  0: [
    ["companyName", "Company Name"],
    ["companyType", "Company Type"],
    ["companyRegNumber", "Company Registration Number"],
    ["registeredAddress", "Registered Address"],
    ["state", "State"],
    ["city", "City"],
    ["incorporationDate", "Date of Incorporation"],
    ["companyRegCertFile", "Company Registration Certificate"],
  ],

  1: [
    ["gstin", "GSTIN"],
    ["legalBusinessName", "Legal Business Name"],
    ["gstRegDate", "GST Registration Date"],
    ["gstStatus", "GST Status"],
    ["gstCertFile", "GST Certificate"],
  ],

  2: [
    ["panNumber", "PAN Number"],
    ["panHolderName", "PAN Holder / Company Name"],
    ["panDocFile", "PAN Document"],
  ],

  3: [
    ["yearsExperience", "Years of Experience"],
    ["previousGovtProjects", "Previous Government Projects"],
    ["majorCompletedProjects", "Major Completed Projects"],
    ["experienceCertFile", "Experience Certificates"],
  ],

  4: [
    ["annualTurnover", "Annual Turnover"],
    ["financialYear", "Financial Year"],
    ["netWorth", "Net Worth"],
    ["financialStatementFile", "Audited Financial Statement"],
  ],

  5: [
    ["technicalInfrastructure", "Technical Infrastructure"],
    ["equipment", "Equipment"],
    ["manpower", "Manpower"],
    ["technicalCapacity", "Technical Capacity"],
    ["technicalDocFile", "Technical Capability Documents"],
  ],

  6: [
    ["isoApplicable", "ISO Certification applicability"],
    ["bisApplicable", "BIS Certification applicability"],
    ["otherCertApplicable", "Other certification applicability"],
  ],

  7: [
    ["representativeName", "Authorized Representative Name"],
    ["representativeDesignation", "Designation"],
    ["representativeEmail", "Official Email"],
    ["representativePhone", "Official Phone"],
    ["representativeDocFile", "Authorization / Authorized Representative Document"],
    ["password", "Password"],
  ],
};

export default function BidderRegisterPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Remove the validation message once the user starts correcting fields.
    setError("");
  }

  /*
   * Validates the current step.
   */
  function validateStep(stepIndex) {
    const fields = REQUIRED_FIELDS[stepIndex] || [];

    const missingFields = fields.filter(([field]) => {
      const value = form[field];

      return (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      );
    });

    /*
     * Conditional certification documents.
     */
    if (stepIndex === 6) {
      if (form.isoApplicable === "Yes" && !form.isoFile?.trim()) {
        missingFields.push(["isoFile", "ISO Certificate"]);
      }

      if (form.bisApplicable === "Yes" && !form.bisFile?.trim()) {
        missingFields.push(["bisFile", "BIS Certificate"]);
      }

      if (
        form.otherCertApplicable === "Yes" &&
        !form.otherCertFile?.trim()
      ) {
        missingFields.push([
          "otherCertFile",
          "Other Certification Document",
        ]);
      }
    }

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(([, label]) => label);

      setError(
        `Please complete the required field${
          fieldNames.length > 1 ? "s" : ""
        }: ${fieldNames.join(", ")}`
      );

      return false;
    }

    /*
     * Basic email validation.
     */
    if (stepIndex === 7) {
      const email = form.representativeEmail.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid Official Email address.");
        return false;
      }

      if (form.password.trim().length < 6) {
        setError("Password must contain at least 6 characters.");
        return false;
      }
    }

    return true;
  }

  function goNext() {
    setError("");

    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) =>
      Math.min(step + 1, STEPS.length - 1)
    );
  }

  function goBack() {
    setError("");

    setCurrentStep((step) =>
      Math.max(step - 1, 0)
    );
  }

  async function handleSubmit() {
    setError("");

    /*
     * Review is the final step, so validate every
     * registration step before submitting.
     */
    for (let stepIndex = 0; stepIndex < STEPS.length - 1; stepIndex++) {
      if (!validateStep(stepIndex)) {
        setCurrentStep(stepIndex);
        return;
      }
    }

    setLoading(true);

    try {
      const { user } = await registerBidder(form);

      setCurrentUser(user);
      navigate("/bidder/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const StepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;

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
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">

          {/* Page heading */}
          <div className="mb-7">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

              <div>
                <p className="text-xs font-bold tracking-[0.16em] uppercase text-blue-700">
                  BidSure AI
                </p>

                <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
                  Bidder Registration
                </h1>

                <p className="mt-2 text-sm sm:text-[15px] text-slate-600">
                  Complete your organization profile and compliance information.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Registration progress
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
              </div>

            </div>
          </div>

          {/* PROGRESS STEPPER */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">

            <div className="overflow-x-auto">
              <div className="min-w-[760px] flex items-start">

                {STEPS.map((step, index) => {
                  const completed = index < currentStep;
                  const active = index === currentStep;

                  return (
                    <div
                      key={step.label}
                      className={`flex items-start ${
                        index === STEPS.length - 1
                          ? ""
                          : "flex-1"
                      }`}
                    >

                      {/* Step */}
                      <div className="flex flex-col items-center min-w-[70px]">

                        <div
                          className={`
                            w-9 h-9 rounded-full
                            flex items-center justify-center
                            text-xs font-bold
                            border-2
                            transition-all duration-200
                            ${
                              completed
                                ? "bg-blue-700 border-blue-700 text-white"
                                : active
                                ? "bg-blue-700 border-blue-700 text-white ring-4 ring-blue-100"
                                : "bg-white border-slate-300 text-slate-500"
                            }
                          `}
                        >
                          {completed ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <span
                          className={`
                            mt-2 text-[11px] sm:text-xs
                            font-semibold text-center whitespace-nowrap
                            ${
                              active
                                ? "text-blue-700"
                                : completed
                                ? "text-slate-700"
                                : "text-slate-500"
                            }
                          `}
                        >
                          {step.label}
                        </span>

                      </div>

                      {/* Connector */}
                      {index < STEPS.length - 1 && (
                        <div className="flex-1 pt-[18px] px-1">

                          <div
                            className={`
                              h-0.5 w-full
                              ${
                                index < currentStep
                                  ? "bg-blue-700"
                                  : "bg-slate-200"
                              }
                            `}
                          />

                        </div>
                      )}

                    </div>
                  );
                })}

              </div>
            </div>

          </div>

          {/* FORM CARD */}
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">

            {/* Card header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-200 bg-slate-50/80">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Step {currentStep + 1}
                  </p>

                  <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
                    {STEPS[currentStep].label}
                  </h2>
                </div>

                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                </div>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Please provide accurate information and supporting documents.
                Required fields are marked with{" "}
                <span className="text-red-600 font-bold">*</span>.
              </p>

            </div>

            {/* Step content */}
            <div className="p-6 sm:p-8">

              <StepComponent
                form={form}
                update={update}
              />

            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>
          )}

          {/* NAVIGATION */}
          <div className="mt-5 flex items-center justify-between gap-4">

            <Button
              variant="secondary"
              onClick={goBack}
              disabled={currentStep === 0 || loading}
              className="min-w-[100px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {isLastStep ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="min-w-[190px]"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    Complete Registration
                    <Check className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={goNext}
                disabled={loading}
                className="min-w-[110px]"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

          </div>

          {/* Bottom reassurance */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Your registration information is handled securely.</span>
          </div>

        </div>
      </main>
    </div>
  );
}