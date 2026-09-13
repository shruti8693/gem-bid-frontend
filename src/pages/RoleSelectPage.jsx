import { useNavigate } from "react-router-dom";
import {
  Building2,
  Gavel,
  ClipboardCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const ROLES = [
  {
    role: "bidder",
    icon: Building2,
    title: "Bidder",
    description:
      "Register your company to participate in tenders with verified compliance documents.",
  },
  {
    role: "buyer",
    icon: Gavel,
    title: "Buyer",
    description:
      "Register your organization to create and publish tenders and monitor bids.",
  },
  {
    role: "officer",
    icon: ClipboardCheck,
    title: "Procurement Officer",
    description:
      "Review evidence, evaluate compliance and make informed bid decisions.",
  },
];

export default function RoleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">

      {/* Header */}
      <header className="h-[76px] bg-white border-b border-slate-200 shadow-sm">
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

      {/* Main */}
      <main className="relative flex-1 overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue-100/60 blur-3xl" />

          <div className="absolute top-10 -right-32 w-[480px] h-[480px] rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 w-[500px] h-[220px] rounded-full bg-indigo-100/40 blur-3xl" />

        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 lg:px-10 py-14 lg:py-20">

          {/* Heading */}
          <div className="max-w-2xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              CREATE YOUR ACCOUNT
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Select Your Role
            </h1>

            <p className="mt-3 text-[15px] leading-7 text-slate-600">
              Choose how you'll be using BidSure AI. You'll provide the
              details required for this role next.
            </p>

          </div>

          {/* Role Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

            {ROLES.map(
              ({ role, icon: Icon, title, description }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => navigate(`/register/${role}`)}
                  className="
                    group
                    relative
                    text-left
                    bg-white
                    border border-slate-200
                    rounded-2xl
                    p-7
                    shadow-sm
                    hover:shadow-xl
                    hover:-translate-y-1
                    hover:border-blue-300
                    transition-all duration-200
                  "
                >

                  {/* Top accent */}
                  <div className="absolute top-0 left-7 right-7 h-1 rounded-b-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-blue-700" />
                  </div>

                  {/* Content */}
                  <div className="mt-6">

                    <h2 className="text-xl font-bold text-slate-900">
                      {title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-600 min-h-[72px]">
                      {description}
                    </p>

                  </div>

                  {/* Action */}
                  <div className="mt-7 flex items-center justify-between">

                    <span className="text-sm font-bold text-blue-700">
                      Get started
                    </span>

                    <span className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-700 group-hover:border-blue-700 transition-colors">
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </span>

                  </div>

                </button>
              )
            )}

          </div>

          {/* Bottom information */}
          <div className="mt-10 flex justify-center">

            <div className="inline-flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>
                Choose the role that matches your procurement activity.
              </span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}