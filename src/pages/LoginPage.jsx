import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  UserRound,
  Building2,
  BriefcaseBusiness,
} from "lucide-react";
import Button from "../components/Button";
import { loginRequest } from "../services/api";
import { setCurrentUser } from "../utils/auth";

const ROLES = [
  {
    value: "bidder",
    label: "Bidder",
  },
  {
    value: "buyer",
    label: "Buyer",
  },
  {
    value: "officer",
    label: "Procurement Officer",
  },
];

const DEMO_ACCOUNTS = {
  bidder: {
    email: "contact@abcpetroleum.in",
    password: "demo123",
    label: "Bidder",
  },

  buyer: {
    email: "procurement@mopng.gov.in",
    password: "demo123",
    label: "Buyer",
  },

  officer: {
    email: "officer.rao@mopng.gov.in",
    password: "demo123",
    label: "Procurement Officer",
  },
};

const DEMO_BUTTONS = [
  {
    role: "bidder",
    label: "Bidder Demo",
    icon: UserRound,
  },

  {
    role: "buyer",
    label: "Buyer Demo",
    icon: Building2,
  },

  {
    role: "officer",
    label: "Officer Demo",
    icon: BriefcaseBusiness,
  },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("bidder");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fill demo credentials
  function useDemo(roleValue) {
    const demo = DEMO_ACCOUNTS[roleValue];

    setRole(roleValue);
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
  }

  // Login
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await loginRequest({
        email,
        password,
        role,
      });

      setCurrentUser(user);

      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="h-[68px] border-b border-slate-200 bg-white flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <img
              src="/bidsure logo.jpeg"
              alt="BidSure AI"
              className="h-12 w-auto object-contain"
            />
          </button>

        </div>
      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="relative flex-1 flex items-center justify-center px-5 py-5 overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">

          {/* Top left */}
          <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-100/50 blur-3xl" />

          {/* Bottom right */}
          <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-cyan-100/40 blur-3xl" />

          {/* Subtle tricolor-inspired bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-orange-100/30 via-white to-green-100/30" />

        </div>


        {/* =====================================================
            LOGIN CONTAINER
        ====================================================== */}
        <div className="relative z-10 w-full max-w-[430px]">

          {/* LOGIN CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">


            {/* =================================================
                HEADING
            ================================================== */}
            <div className="text-center">

              <div className="mx-auto w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
              </div>

              <h1 className="mt-2.5 text-[23px] font-bold text-slate-900">
                Sign in
              </h1>

              <p className="mt-0.5 text-[13px] text-slate-600">
                Access your procurement dashboard
              </p>

            </div>


            {/* =================================================
                DEMO ACCOUNT ACCESS
            ================================================== */}
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">

              {/* Demo heading */}
              <div className="text-center">

                <p className="text-[13px] font-bold text-slate-900">
                  Demo Account Access
                </p>

                <p className="mt-0.5 text-[11px] text-slate-600">
                  Select a role to auto-fill demo credentials
                </p>

              </div>


              {/* Demo buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">

                {DEMO_BUTTONS.map(
                  ({ role: demoRole, label, icon: Icon }) => (

                    <button
                      key={demoRole}
                      type="button"
                      onClick={() => useDemo(demoRole)}
                      className={`
                        flex flex-col
                        items-center
                        justify-center
                        gap-1
                        h-[58px]
                        px-1.5
                        rounded-lg
                        border
                        text-[11px]
                        font-semibold
                        transition-all
                        duration-150

                        ${
                          role === demoRole
                            ? "bg-blue-700 border-blue-700 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                        }
                      `}
                    >

                      <Icon className="w-4 h-4" />

                      <span>
                        {label}
                      </span>

                    </button>

                  )
                )}

              </div>


              {/* Demo note */}
              <p className="mt-2 text-[10px] text-slate-500 text-center">
                Uses simulated data and verification responses
              </p>

            </div>


            {/* =================================================
                LOGIN FORM
            ================================================== */}
            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-3.5"
            >


              {/* =================================================
                  ROLE
              ================================================== */}
              <div>

                <label className="block text-[12px] font-bold text-slate-700 mb-1">

                  Role

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>


                <select
                  value={role}
                  required
                  onChange={(e) => setRole(e.target.value)}
                  className="
                    w-full
                    h-10
                    border
                    border-slate-300
                    rounded-lg
                    px-3
                    text-[13px]
                    font-medium
                    text-slate-900
                    bg-white
                    transition-all
                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-100
                    focus:border-blue-600
                  "
                >

                  {ROLES.map((r) => (

                    <option
                      key={r.value}
                      value={r.value}
                    >
                      {r.label}
                    </option>

                  ))}

                </select>

              </div>


              {/* =================================================
                  EMAIL
              ================================================== */}
              <div>

                <label className="block text-[12px] font-bold text-slate-700 mb-1">

                  Email / User ID

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>


                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="
                    w-full
                    h-10
                    border
                    border-slate-300
                    rounded-lg
                    px-3
                    text-[13px]
                    text-slate-900
                    bg-white
                    placeholder:text-slate-400
                    transition-all
                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-100
                    focus:border-blue-600
                  "
                />

              </div>


              {/* =================================================
                  PASSWORD
              ================================================== */}
              <div>

                <label className="block text-[12px] font-bold text-slate-700 mb-1">

                  Password

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>


                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="
                    w-full
                    h-10
                    border
                    border-slate-300
                    rounded-lg
                    px-3
                    text-[13px]
                    text-slate-900
                    bg-white
                    placeholder:text-slate-400
                    transition-all
                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-100
                    focus:border-blue-600
                  "
                />

              </div>


              {/* =================================================
                  ERROR MESSAGE
              ================================================== */}
              {error && (

                <div className="
                  text-[12px]
                  font-medium
                  text-red-700
                  bg-red-50
                  border
                  border-red-100
                  px-3
                  py-2.5
                  rounded-lg
                ">

                  {error}

                </div>

              )}


              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}
              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-[13px]"
                disabled={loading}
              >

                {loading
                  ? "Signing in..."
                  : "Login"
                }

              </Button>

            </form>


            {/* =================================================
                CREATE ACCOUNT
            ================================================== */}
            <div className="mt-4 pt-3.5 border-t border-slate-200 text-center">

              <span className="text-[12px] text-slate-500">
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  ml-1.5
                  text-[12px]
                  font-bold
                  text-blue-700
                  hover:text-blue-800
                  hover:underline
                  transition-colors
                "
              >
                Create an account
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}