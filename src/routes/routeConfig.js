// Central route table. Kept as plain data (not JSX) so it's easy to see the
// whole app's navigable surface at a glance. Real page components will
// replace `label`-only stubs as each phase is built.
export const routes = [
  { path: "/", label: "Landing" },
  { path: "/login", label: "Login" },
  { path: "/register", label: "Select Role" },
  { path: "/register/bidder", label: "Bidder Registration" },
  { path: "/register/buyer", label: "Buyer Registration" },
  { path: "/register/officer", label: "Officer Registration" },

  { path: "/bidder/dashboard", label: "Bidder Dashboard" },
  { path: "/bidder/tenders", label: "Available Tenders" },
  { path: "/bidder/tenders/:id", label: "Tender Details" },
  { path: "/bidder/bids", label: "My Bids" },
  { path: "/bidder/documents", label: "My Documents" },
  { path: "/bidder/notifications", label: "Bidder Notifications" },
  { path: "/bidder/profile", label: "Bidder Profile" },

  { path: "/buyer/dashboard", label: "Buyer Dashboard" },
  { path: "/buyer/tenders", label: "My Tenders" },
  { path: "/buyer/tenders/create", label: "Create Tender" },
  { path: "/buyer/tenders/:id", label: "Tender Monitoring" },
  { path: "/buyer/notifications", label: "Buyer Notifications" },
  { path: "/buyer/profile", label: "Buyer Profile" },

  { path: "/officer/dashboard", label: "Officer Dashboard" },
  { path: "/officer/tenders", label: "Officer Tenders" },
  { path: "/officer/tenders/:id", label: "Officer Tender View" },
  { path: "/officer/bids", label: "Bid List" },
{ path: "/officer/bids/:id", label: "Bid Review" },
{ path: "/officer/bids/:id/compliance-xray", label: "Compliance X-ray" },
{ path: "/officer/reports", label: "Compliance Reports" },
  { path: "/officer/evaluation", label: "Evaluation" },
  { path: "/officer/notifications", label: "Officer Notifications" },
  { path: "/officer/profile", label: "Officer Profile" },
];