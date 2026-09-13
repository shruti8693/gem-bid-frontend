import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Check,
  CheckCircle2,
  ArrowLeft,
  Save,
  Send,
  Sparkles,
} from "lucide-react";

import Button from "../../components/Button";
import {
  createTender,
  publishTender,
  createNotification,
} from "../../services/api";

import StepTenderInfo from "./tenderSteps/StepTenderInfo";
import StepEligibility from "./tenderSteps/StepEligibility";
import StepDocuments from "./tenderSteps/StepDocuments";
import StepUpload from "./tenderSteps/StepUpload";
import StepPreview from "./tenderSteps/StepPreview";


/* ============================================================
   STEPS
============================================================ */

const STEPS = [
  {
    label: "Tender Information",
    shortLabel: "Tender Info",
    component: StepTenderInfo,
  },
  {
    label: "Eligibility",
    shortLabel: "Eligibility",
    component: StepEligibility,
  },
  {
    label: "Documents",
    shortLabel: "Documents",
    component: StepDocuments,
  },
  {
    label: "Tender PDF",
    shortLabel: "Upload PDF",
    component: StepUpload,
  },
  {
    label: "Review & Publish",
    shortLabel: "Review",
    component: StepPreview,
  },
];


/* ============================================================
   INITIAL FORM
============================================================ */

const INITIAL_FORM = {
  title: "",
  tenderId: "",
  description: "",
  category: "Petroleum & Equipment",
  estimatedValue: "",
  deadline: "",
  minExperience: "",
  minTurnover: "",
  minTechnicalCapacity: "",
  requireCompanyRegistration: true,
  requireGST: true,
  requirePAN: true,
  requireExperience: true,
  requireFinancial: true,
  requireTechnical: true,
  requireISO: false,
  requireBIS: false,
  tenderPdfFile: "",
  tenderPdfAnalyzed: false,
};


export default function CreateTenderPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);


  /* ============================================================
     FORM UPDATE
  ============================================================ */

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }


  /* ============================================================
     NAVIGATION
  ============================================================ */

  function goNext() {
    setError("");

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


  /* ============================================================
     SAVE DRAFT
  ============================================================ */

  async function handleSaveDraft() {
    setError("");
    setLoading(true);

    try {
      await createTender(form);
      navigate("/buyer/tenders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  /* ============================================================
     PUBLISH
  ============================================================ */

  async function handlePublish() {
    setError("");
    setLoading(true);

    try {
      const tender = await createTender(form);

      await publishTender(tender.id);

      await createNotification({
        recipientRole: "bidder",
        recipientId: "BID-001",
        type: "new_tender",
        title: "New Tender Published",
        message: `${tender.title} — deadline ${tender.deadline}`,
        link: `/bidder/tenders/${tender.id}`,
      });

      setPublished(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  /* ============================================================
     STEP STATE
  ============================================================ */

  const isUploadStep = currentStep === 3;

  const nextDisabled =
    isUploadStep && !form.tenderPdfAnalyzed;

  const StepComponent =
    STEPS[currentStep].component;

  const isPreviewStep =
    currentStep === STEPS.length - 1;


  /* ============================================================
     SUCCESS SCREEN
  ============================================================ */

  if (published) {
    return (
      <div className="min-h-screen bg-slate-50">

        <header className="
          h-[72px]
          bg-white
          border-b
          border-slate-200
          flex
          items-center
        ">

          <div className="
            w-full
            max-w-6xl
            mx-auto
            px-6
            flex
            items-center
            justify-between
          ">

            <img
              src="/bidsure logo.jpeg"
              alt="BidSure AI"
              className="h-12 w-auto object-contain"
            />

            <span className="
              text-[11px]
              font-bold
              uppercase
              tracking-wider
              text-emerald-700
            ">
              Tender Published
            </span>

          </div>

        </header>


        <main className="
          min-h-[calc(100vh-72px)]
          flex
          items-center
          justify-center
          px-6
        ">

          <div className="
            w-full
            max-w-md
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-8
            text-center
          ">

            <div className="
              mx-auto
              w-16
              h-16
              rounded-2xl
              bg-emerald-50
              flex
              items-center
              justify-center
            ">
              <CheckCircle2 className="
                w-9
                h-9
                text-emerald-600
              " />
            </div>


            <h1 className="
              mt-5
              text-[22px]
              font-bold
              text-slate-900
            ">
              Tender Published Successfully
            </h1>


            <p className="
              mt-2
              text-[13px]
              leading-relaxed
              text-slate-500
            ">
              Your tender has been published and eligible
              bidders will be notified.
            </p>


            <Button
              variant="primary"
              className="mt-6 w-full"
              onClick={() =>
                navigate("/buyer/tenders")
              }
            >
              View My Tenders
            </Button>

          </div>

        </main>

      </div>
    );
  }


  /* ============================================================
     MAIN PAGE
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50">


      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="
        sticky
        top-0
        z-30
        h-[72px]
        bg-white
        border-b
        border-slate-200
      ">

        <div className="
          h-full
          max-w-6xl
          mx-auto
          px-6
          flex
          items-center
          justify-between
        ">


          {/* LOGO */}

          <div className="flex items-center">

            <img
              src="/bidsure logo.jpeg"
              alt="BidSure AI"
              className="h-12 w-auto object-contain"
            />

          </div>


          {/* RIGHT */}

          <button
            type="button"
            onClick={() =>
              navigate("/buyer/dashboard")
            }
            className="
              inline-flex
              items-center
              gap-2
              text-[12px]
              font-semibold
              text-slate-600
              hover:text-blue-700
              transition-colors
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

        </div>

      </header>


      {/* ========================================================
          CONTENT
      ======================================================== */}

      <main className="
        max-w-5xl
        mx-auto
        px-6
        py-7
      ">


        {/* PAGE HEADER */}

        <div className="
          flex
          items-start
          justify-between
          gap-6
          mb-7
        ">

          <div>

            <div className="
              inline-flex
              items-center
              gap-1.5
              px-2.5
              py-1
              rounded-full
              bg-blue-50
              border
              border-blue-100
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-blue-700
              mb-2
            ">

              <Sparkles className="w-3 h-3" />

              AI-Assisted Procurement

            </div>


            <h1 className="
              text-[28px]
              leading-tight
              font-bold
              tracking-tight
              text-slate-900
            ">
              Create Tender
            </h1>


            <p className="
              mt-1.5
              text-[13px]
              text-slate-500
            ">
              Define requirements, verify tender documents,
              and publish your procurement opportunity.
            </p>

          </div>


          {/* STEP COUNTER */}

          <div className="
            shrink-0
            text-right
          ">

            <p className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            ">
              Current Step
            </p>

            <p className="
              mt-0.5
              text-[18px]
              font-bold
              text-slate-900
            ">
              {currentStep + 1}
              <span className="
                text-[12px]
                font-medium
                text-slate-400
              ">
                {" "}of {STEPS.length}
              </span>
            </p>

          </div>

        </div>


        {/* ======================================================
            PROGRESS
        ======================================================= */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          shadow-sm
          px-5
          py-4
          mb-5
        ">

          <div className="flex items-start">

            {STEPS.map((step, index) => {

              const completed =
                index < currentStep;

              const active =
                index === currentStep;

              return (
                <div
                  key={step.label}
                  className="
                    flex
                    items-start
                    flex-1
                    last:flex-none
                  "
                >

                  {/* STEP */}

                  <div className="
                    flex
                    flex-col
                    items-center
                    min-w-[92px]
                  ">

                    <div className="flex items-center">

                      <div
                        className={`
                          w-9
                          h-9
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-[12px]
                          font-bold
                          border-2
                          transition-all

                          ${
                            completed
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : active
                              ? "bg-blue-700 border-blue-700 text-white shadow-sm"
                              : "bg-white border-slate-300 text-slate-400"
                          }
                        `}
                      >

                        {completed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}

                      </div>

                    </div>


                    <p className={`
                      mt-2
                      text-[10px]
                      text-center
                      font-semibold
                      whitespace-nowrap

                      ${
                        active
                          ? "text-blue-700"
                          : completed
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }
                    `}>
                      {step.shortLabel}
                    </p>

                  </div>


                  {/* CONNECTOR */}

                  {index < STEPS.length - 1 && (

                    <div className="
                      flex-1
                      h-[2px]
                      mt-[18px]
                      mx-1
                      rounded-full
                      overflow-hidden
                      bg-slate-200
                    ">

                      <div
                        className={`
                          h-full
                          rounded-full
                          transition-all

                          ${
                            index < currentStep
                              ? "bg-emerald-600 w-full"
                              : "w-0"
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


        {/* ======================================================
            MAIN FORM CARD
        ======================================================= */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          shadow-sm
          overflow-hidden
        ">


          {/* CARD HEADER */}

          <div className="
            px-6
            py-4
            border-b
            border-slate-200
            bg-slate-50/70
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-blue-700
              ">
                Step {currentStep + 1}
              </p>

              <h2 className="
                mt-0.5
                text-[17px]
                font-bold
                text-slate-900
              ">
                {STEPS[currentStep].label}
              </h2>

            </div>


            {/* AI INDICATOR */}

            <div className="
              hidden
              sm:flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-lg
              bg-blue-50
              border
              border-blue-100
            ">

              <ShieldCheck className="
                w-4
                h-4
                text-blue-700
              " />

              <span className="
                text-[10px]
                font-bold
                text-blue-700
              ">
                Compliance Ready
              </span>

            </div>

          </div>


          {/* STEP CONTENT */}

          <div className="p-6">

            <StepComponent
              form={form}
              update={update}
            />

          </div>

        </div>


        {/* ======================================================
            ERROR
        ======================================================= */}

        {error && (

          <div className="
            mt-4
            px-4
            py-3
            rounded-xl
            bg-red-50
            border
            border-red-200
            text-[12px]
            font-medium
            text-red-700
          ">
            {error}
          </div>

        )}


        {/* ======================================================
            BOTTOM ACTION BAR
        ======================================================= */}

        <div className="
          mt-5
          bg-white
          border
          border-slate-200
          rounded-xl
          shadow-sm
          px-5
          py-3.5
          flex
          items-center
          justify-between
          gap-4
        ">


          {/* BACK */}

          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-lg
              border
              border-slate-300
              bg-white
              text-[13px]
              font-semibold
              text-slate-700
              hover:bg-slate-50
              hover:border-blue-400
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition-all
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>


          <div className="
            flex
            items-center
            gap-2
          ">


            {/* SAVE DRAFT */}

            {isPreviewStep && (

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  text-[13px]
                  font-semibold
                  text-slate-700
                  hover:bg-slate-50
                  hover:border-blue-400
                  disabled:opacity-50
                  transition-all
                "
              >

                <Save className="w-4 h-4" />

                {loading
                  ? "Saving..."
                  : "Save Draft"}

              </button>

            )}


            {/* NEXT */}

            {!isPreviewStep && (

              <Button
                variant="primary"
                onClick={goNext}
                disabled={nextDisabled}
              >
                {isUploadStep
                  ? "Continue to Review"
                  : "Continue"}

                <span className="text-base leading-none">
                  →
                </span>
              </Button>

            )}


            {/* PUBLISH */}

            {isPreviewStep && (

              <Button
                variant="primary"
                onClick={handlePublish}
                disabled={loading}
              >

                <Send className="w-4 h-4" />

                {loading
                  ? "Publishing..."
                  : "Publish Tender"}

              </Button>

            )}

          </div>

        </div>


        {/* ======================================================
            PDF ANALYSIS NOTE
        ======================================================= */}

        {isUploadStep && (

          <div className="
            mt-3
            flex
            items-center
            justify-center
            gap-2
            text-[11px]
            text-slate-500
          ">

            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />

            Tender PDF analysis must complete before continuing.

          </div>

        )}

      </main>

    </div>
  );
}