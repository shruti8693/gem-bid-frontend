import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { getCurrentUser } from "../utils/auth";

function getRoleFromPath(pathname) {
  if (pathname.startsWith("/buyer/")) return "buyer";
  if (pathname.startsWith("/officer/")) return "officer";
  if (pathname.startsWith("/bidder/")) return "bidder";

  return null;
}

export default function PlaceholderPage({ title }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const role =
    getRoleFromPath(window.location.pathname) ??
    user?.role ??
    "bidder";

  const userName =
    role === "buyer"
      ? "Buyer"
      : role === "officer"
      ? "Officer"
      : "Bidder";

  const dashboardPath =
    role === "buyer"
      ? "/buyer/dashboard"
      : role === "officer"
      ? "/officer/dashboard"
      : "/bidder/dashboard";

  return (
    <DashboardLayout
      role={role}
      userName={userName}
    >
      <div className="max-w-3xl">

        <p className="text-[11px] font-bold tracking-widest text-blue-700 uppercase mb-1">
          {role === "buyer"
            ? "Buyer Workspace"
            : role === "officer"
            ? "Officer Workspace"
            : "Bidder Workspace"}
        </p>

        <h1 className="text-[27px] font-bold text-slate-900 mb-1">
          {title}
        </h1>

        <p className="text-[13px] text-slate-500 mb-5">
          This section is being prepared for the next phase of the
          procurement workflow.
        </p>

        <Card className="p-6">

          <div className="text-center py-8">

            <div className="
              mx-auto
              w-12
              h-12
              rounded-xl
              bg-blue-50
              flex
              items-center
              justify-center
            ">
              <span className="text-xl">🚧</span>
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              The navigation route is connected. The full feature
              will be added to this workspace later.
            </p>

            <Button
              variant="primary"
              className="mt-5"
              onClick={() => navigate(dashboardPath)}
            >
              Back to Dashboard
            </Button>

          </div>

        </Card>

      </div>
    </DashboardLayout>
  );
}