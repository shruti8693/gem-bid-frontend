import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RoleSelectPage from "./pages/RoleSelectPage";
import LoginPage from "./pages/LoginPage";
import BuyerRegisterPage from "./pages/BuyerRegisterPage";
import OfficerRegisterPage from "./pages/OfficerRegisterPage";
import BidderRegisterPage from "./pages/BidderRegisterPage";
import BidderDashboardPage from "./pages/bidder/BidderDashboardPage";
import BuyerDashboardPage from "./pages/buyer/BuyerDashboardPage";
import OfficerDashboardPage from "./pages/officer/OfficerDashboardPage";
import CreateTenderPage from "./pages/buyer/CreateTenderPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import { routes } from "./routes/routeConfig";
import MyTendersPage from "./pages/buyer/MyTendersPage";
import AvailableTendersPage from "./pages/bidder/AvailableTendersPage";
import TenderDetailsPage from "./pages/bidder/TenderDetailsPage";
import UploadMissingDocsPage from "./pages/bidder/UploadMissingDocsPage";
import BidVerificationPage from "./pages/bidder/BidVerificationPage";
import BidReportPage from "./pages/bidder/BidReportPage";
import BidListPage from "./pages/officer/BidListPage";
import BidReviewPage from "./pages/officer/BidReviewPage";
import ComplianceXrayPage from "./pages/officer/ComplianceXrayPage";
import RequestClarificationPage from "./pages/officer/RequestClarificationPage";
import MyBidsPage from "./pages/bidder/MyBidsPage";
import ClarificationResponsePage from "./pages/bidder/ClarificationResponsePage";
import BidderNotificationsPage from "./pages/bidder/BidderNotificationsPage";
import OfficerNotificationsPage from "./pages/officer/OfficerNotificationsPage";
import BidComparisonPage from "./pages/officer/BidComparisonPage";
import ComplianceReportsPage from "./pages/officer/ComplianceReportsPage";
import BuyerEvaluationPage from "./pages/buyer/BuyerEvaluationPage";
import BuyerBidReviewPage from "./pages/buyer/BuyerBidReviewPage";
import TenderMonitoringPage from "./pages/buyer/TenderMonitoringPage";
import BuyerNotificationsPage from "./pages/buyer/BuyerNotificationsPage";

const BUILT_PATHS = [
  "/",
  "/register",
  "/login",
  "/register/buyer",
  "/register/officer",
  "/register/bidder",

  // Bidder
  "/bidder/dashboard",
  "/bidder/tenders",
  "/bidder/tenders/:id",
  "/bidder/tenders/:id/upload",
  "/bidder/tenders/:id/verify",
  "/bidder/bids",
  "/bidder/bids/:id/report",
  "/bidder/bids/:id/clarification",
  "/bidder/notifications",

  // Buyer
  "/buyer/dashboard",
  "/buyer/tenders/create",
  "/buyer/tenders",
  "/buyer/tenders/:id",
  "/buyer/evaluation",
  "/buyer/bids/:id",
  "/buyer/notifications",

  // Officer
  "/officer/dashboard",
  "/officer/bids",
  "/officer/bids/:id",
  "/officer/bids/:id/compliance-xray",
  "/officer/bids/:id/clarify",
  "/officer/reports",
  "/officer/evaluation",
  "/officer/notifications",
];

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* General */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RoleSelectPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Registration */}
        <Route
          path="/register/buyer"
          element={<BuyerRegisterPage />}
        />
        <Route
          path="/register/officer"
          element={<OfficerRegisterPage />}
        />
        <Route
          path="/register/bidder"
          element={<BidderRegisterPage />}
        />

        {/* Bidder Dashboard */}
        <Route
          path="/bidder/dashboard"
          element={<BidderDashboardPage />}
        />

        {/* Buyer Dashboard */}
        <Route
          path="/buyer/dashboard"
          element={<BuyerDashboardPage />}
        />

        {/* Officer Dashboard */}
        <Route
          path="/officer/dashboard"
          element={<OfficerDashboardPage />}
        />

        {/* Buyer - Tender Management */}
        <Route
          path="/buyer/tenders/create"
          element={<CreateTenderPage />}
        />

        <Route
          path="/buyer/tenders"
          element={<MyTendersPage />}
        />

        <Route
          path="/buyer/tenders/:id"
          element={<TenderMonitoringPage />}
        />

        {/* Buyer - Evaluation */}
        <Route
          path="/buyer/evaluation"
          element={<BuyerEvaluationPage />}
        />

        <Route
          path="/buyer/bids/:id"
          element={<BuyerBidReviewPage />}
        />

        {/* Buyer - Notifications */}
        <Route
          path="/buyer/notifications"
          element={<BuyerNotificationsPage />}
        />

        {/* Bidder - Tenders */}
        <Route
          path="/bidder/tenders"
          element={<AvailableTendersPage />}
        />

        <Route
          path="/bidder/tenders/:id"
          element={<TenderDetailsPage />}
        />

        <Route
          path="/bidder/tenders/:id/upload"
          element={<UploadMissingDocsPage />}
        />

        <Route
          path="/bidder/tenders/:id/verify"
          element={<BidVerificationPage />}
        />

        {/* Bidder - Bids */}
        <Route
          path="/bidder/bids"
          element={<MyBidsPage />}
        />

        <Route
          path="/bidder/bids/:id/report"
          element={<BidReportPage />}
        />

        <Route
          path="/bidder/bids/:id/clarification"
          element={<ClarificationResponsePage />}
        />

        {/* Bidder - Notifications */}
        <Route
          path="/bidder/notifications"
          element={<BidderNotificationsPage />}
        />

        {/* Officer - Bids */}
        <Route
          path="/officer/bids"
          element={<BidListPage />}
        />

        <Route
          path="/officer/bids/:id"
          element={<BidReviewPage />}
        />

        <Route
          path="/officer/bids/:id/compliance-xray"
          element={<ComplianceXrayPage />}
        />

        <Route
          path="/officer/bids/:id/clarify"
          element={<RequestClarificationPage />}
        />

        {/* Officer - Reports */}
        <Route
          path="/officer/reports"
          element={<ComplianceReportsPage />}
        />

        {/* Officer - Evaluation */}
        <Route
          path="/officer/evaluation"
          element={<BidComparisonPage />}
        />

        {/* Officer - Notifications */}
        <Route
          path="/officer/notifications"
          element={<OfficerNotificationsPage />}
        />

        {/* Placeholder Routes */}
        {routes
          .filter((route) => !BUILT_PATHS.includes(route.path))
          .map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PlaceholderPage title={route.label} />}
            />
          ))}
      </Routes>
    </HashRouter>
  );
}