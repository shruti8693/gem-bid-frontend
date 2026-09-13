import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  Gavel,
  ClipboardCheck,
  FileCheck2,
  BrainCircuit,
  Scale,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Button from "../components/Button";
import heroBackground from "../assets/procurement-hero-bg.png";

const ROLE_CARDS = [
  {
    role: "bidder",
    icon: Building2,
    title: "Bidder",
    description:
      "Participate in tenders with verified compliance documents.",
  },
  {
    role: "buyer",
    icon: Gavel,
    title: "Buyer",
    description:
      "Create tenders and monitor bid compliance efficiently.",
  },
  {
    role: "officer",
    icon: ClipboardCheck,
    title: "Procurement Officer",
    description:
      "Review evidence, risks and AI-assisted compliance results.",
  },
];

const FEATURES = [
  {
    icon: Scale,
    title: "Fairer Procurement",
    description:
      "Standardized compliance checks across bidders.",
  },
  {
    icon: FileCheck2,
    title: "Greater Transparency",
    description:
      "Clear evidence behind every verification result.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Driven Verification",
    description:
      "Automated document and requirement analysis.",
  },
  {
    icon: BarChart3,
    title: "Smarter Evaluation",
    description:
      "Risk insights to support procurement decisions.",
  },
];

const VERIFICATION_ITEMS = [
  {
    label: "GST Registration",
    status: "Verified",
    type: "verified",
  },
  {
    label: "PAN Verification",
    status: "Verified",
    type: "verified",
  },
  {
    label: "Turnover Requirement",
    status: "Review",
    type: "review",
  },
  {
    label: "Experience Requirement",
    status: "Verified",
    type: "verified",
  },
  {
    label: "Document Validity",
    status: "Verified",
    type: "verified",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="relative z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[78px] flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center"
          >
            <img
              src="/bidsure logo.jpeg"
              alt="BidSure AI"
              className="h-14 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
            <a
              href="#about"
              className="hover:text-blue-700 transition-colors"
            >
              About
            </a>

            <a
              href="#features"
              className="hover:text-blue-700 transition-colors"
            >
              Features
            </a>

            <a
              href="#roles"
              className="hover:text-blue-700 transition-colors"
            >
              How It Works
            </a>

            <a
              href="#help"
              className="hover:text-blue-700 transition-colors"
            >
              Help
            </a>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-7 py-3 rounded-xl bg-blue-800 text-white font-semibold shadow-sm hover:bg-blue-900 transition-all"
            >
              Login
            </button>
          </nav>

          {/* Mobile Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="md:hidden px-5 py-2.5 rounded-lg bg-blue-800 text-white font-semibold"
          >
            Login
          </button>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <main>
        <section
          id="about"
          className="relative min-h-[calc(100vh-78px)] overflow-hidden"
        >
          {/* Generated background */}
          <div className="absolute inset-0">
            <img
              src={heroBackground}
              alt=""
              className="w-full h-full object-cover object-center"
            />

            {/* Readability overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/10" />

            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white/90 via-white/30 to-transparent" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10 py-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center min-h-[590px]">
              {/* =====================================================
                  LEFT CONTENT
              ===================================================== */}
              <div className="max-w-3xl">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200 shadow-sm text-blue-800 text-sm font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  AI-Powered Procurement Compliance
                </div>

                {/* Heading */}
                <h1 className="mt-7 text-5xl lg:text-[58px] font-bold leading-[1.05] tracking-tight text-[#092a56]">
                  AI-Powered
                  <br />
                  Integrated Bid
                  <br />
                  <span className="text-blue-700">
                    Compliance Verification
                  </span>
                </h1>

                {/* Description */}
                <p className="mt-7 text-xl lg:text-[21px] leading-relaxed text-slate-700 max-w-2xl">
                  Simplifying tender compliance, verification and evaluation
                  with intelligent document analysis and evidence-backed
                  insights.
                </p>

                {/* CTA */}
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Button
                    variant="primary"
                    className="px-7 py-3.5 text-[15px]"
                    onClick={() => navigate("/register")}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    className="px-7 py-3.5 text-[15px]"
                    onClick={() => navigate("/login")}
                  >
                    Explore Demo
                  </Button>
                </div>

                {/* Prototype label */}
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Prototype • Demonstration Version
                </div>

                {/* Mini trust points */}
                <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-slate-600">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Document Verification
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Risk Detection
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Evidence-Based Results
                  </span>
                </div>
              </div>

              {/* =====================================================
                  RIGHT COMPLIANCE CARD
              ===================================================== */}
              <div className="relative hidden lg:block">
                {/* Glow behind card */}
                <div className="absolute -inset-5 bg-blue-200/30 blur-3xl rounded-full" />

                <div className="relative bg-white/95 backdrop-blur-md border border-white rounded-[22px] shadow-2xl p-5 max-w-[410px] ml-auto">
                  {/* Card heading */}
                  <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                        Compliance Intelligence
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        Bid Verification
                      </h2>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>

                  {/* Verification list */}
                  <div className="mt-4 space-y-2">
                    {VERIFICATION_ITEMS.map(
                      ({ label, status, type }) => (
                        <div
                          key={label}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                              <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
                            </div>

                            <span className="text-sm font-semibold text-slate-700 truncate">
                              {label}
                            </span>
                          </div>

                          <span
                            className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                              type === "verified"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Score cards */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                      <p className="text-xs font-semibold text-slate-500">
                        Compliance Score
                      </p>

                      <p className="mt-1 text-3xl font-bold text-blue-800">
                        92%
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        AI-assisted assessment
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Risk Level
                      </p>

                      <p className="mt-1 text-3xl font-bold text-green-700">
                        Low
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Based on current evidence
                      </p>
                    </div>
                  </div>

                  
                  </div>
                </div>
              </div>
            </div>
        
        </section>

        {/* =========================================================
            FEATURES
        ========================================================= */}
        <section
          id="features"
          className="relative bg-white py-16 border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                Why BidSure AI
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Smarter Procurement. Better Decisions.
              </h2>

              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                Bring document verification, compliance intelligence and
                risk insights into one connected workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map(
                ({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-6 h-6 text-blue-700" />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-slate-900">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            ROLES
        ========================================================= */}
        <section
          id="roles"
          className="bg-[#f5f8fc] py-16"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-2xl mb-9">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                One Platform
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Built for Every Procurement Stakeholder
              </h2>

              <p className="mt-3 text-slate-600">
                A connected workflow for bidders, buyers and procurement
                officers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ROLE_CARDS.map(
                ({
                  role,
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => navigate("/register")}
                    className="group text-left bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-700" />
                      </div>

                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-slate-900">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>

                    <div className="mt-5 text-sm font-semibold text-blue-700">
                      Get started →
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            CTA
        ========================================================= */}
        <section
          id="help"
          className="relative overflow-hidden bg-[#092a56] text-white py-14"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#092a56] to-blue-800/90" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-7">
              <div>
                <p className="text-sm font-semibold tracking-widest text-blue-200">
                  READY TO EXPLORE?
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Experience intelligent bid compliance verification.
                </h2>

                <p className="mt-2 text-blue-100 max-w-2xl">
                  Explore the prototype workflow for bidders, buyers and
                  procurement officers.
                </p>
              </div>

              <Button
                variant="secondary"
                className="shrink-0 px-7 py-3.5"
                onClick={() => navigate("/login")}
              >
                Open Demo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>BidSure AI • Prototype</span>
            </div>

            <p className="text-xs text-slate-400 text-center">
              AI-powered procurement compliance verification platform
            </p>

            <p className="text-xs text-slate-400">
              Demonstration Version
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}