const API_BASE = "/api";

export async function loginRequest({ email, password, role }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed.");
  }
  return data.user;
}

export async function registerBuyer(formData) {
  const res = await fetch(`${API_BASE}/register/buyer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Registration failed.");
  }
  return data;
}

export async function registerOfficer(formData) {
  const res = await fetch(`${API_BASE}/register/officer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Registration failed.");
  }
  return data;
}

export async function registerBidder(formData) {
  const res = await fetch(`${API_BASE}/register/bidder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Registration failed.");
  }
  return data;
}

export async function getBidderProfile(bidderId) {
  const res = await fetch(`${API_BASE}/bidders/${bidderId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load profile.");
  }
  return data.bidder;
}

export async function getBuyerProfile(buyerId) {
  const res = await fetch(`${API_BASE}/buyers/${buyerId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load profile.");
  }
  return data.buyer;
}

export async function getOfficerProfile(officerId) {
  const res = await fetch(`${API_BASE}/officers/${officerId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load profile.");
  }
  return data.officer;
}

export async function createTender(tenderData) {
  const res = await fetch(`${API_BASE}/tenders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tenderData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create tender.");
  return data.tender;
}

export async function getTenders() {
  const res = await fetch(`${API_BASE}/tenders`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load tenders.");
  return data.tenders;
}

export async function getTenderById(tenderId) {
  const res = await fetch(`${API_BASE}/tenders/${tenderId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load tender.");
  return data.tender;
}

export async function publishTender(tenderId) {
  const res = await fetch(`${API_BASE}/tenders/${tenderId}/publish`, {
    method: "PATCH",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to publish tender.");
  return data.tender;
}

export async function saveExtraDocuments(bidderId, tenderId, docs) {
  const res = await fetch(`${API_BASE}/documents/extra`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bidderId, tenderId, docs }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save documents.");
  return data;
}

export async function getExtraDocuments(bidderId, tenderId) {
  const res = await fetch(`${API_BASE}/documents/extra/${bidderId}/${tenderId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load documents.");
  return data.docs;
}

export async function submitBid(bidderId, tenderId) {
  const res = await fetch(`${API_BASE}/bids`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bidderId, tenderId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to submit bid.");
  return data.bid;
}

export async function getBids({ bidderId, tenderId } = {}) {
  const params = new URLSearchParams();
  if (bidderId) params.set("bidderId", bidderId);
  if (tenderId) params.set("tenderId", tenderId);

  const res = await fetch(`${API_BASE}/bids?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load bids.");
  return data.bids;
}

export async function getBidById(bidId) {
  const res = await fetch(`${API_BASE}/bids/${bidId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load bid.");
  return data.bid;
}

export async function updateBidStatus(bidId, status) {
  const res = await fetch(`${API_BASE}/bids/${bidId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update bid status.");
  return data.bid;
}

export async function createClarification(payload) {
  const res = await fetch(`${API_BASE}/clarifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to send clarification.");
  return data.clarification;
}

export async function getClarifications({ bidderId, bidId } = {}) {
  const params = new URLSearchParams();
  if (bidderId) params.set("bidderId", bidderId);
  if (bidId) params.set("bidId", bidId);

  const res = await fetch(`${API_BASE}/clarifications?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load clarifications.");
  return data.clarifications;
}

export async function resolveClarification(clarificationId) {
  const res = await fetch(
    `${API_BASE}/clarifications/${clarificationId}/resolve`,
    { method: "PATCH" }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to resolve clarification.");
  return data.clarification;
}

export async function createNotification(payload) {
  const res = await fetch(`${API_BASE}/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create notification.");
  return data.notification;
}

export async function getNotifications(recipientId) {
  const res = await fetch(`${API_BASE}/notifications?recipientId=${recipientId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load notifications.");
  return data.notifications;
}

export async function markNotificationRead(notificationId) {
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update notification.");
  return data.notification;
}