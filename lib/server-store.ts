export type LeadType = "enquiry" | "valuation" | "contact" | "listing_submission";
export type LeadStatus = "new" | "contacted" | "qualified" | "viewing_scheduled" | "negotiation" | "won" | "lost" | "archived";

export type LeadRecord = {
  id: string;
  type: LeadType;
  listingSlug?: string;
  sourcePage?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: LeadStatus;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
};

export type EmailLogRecord = {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  status: "success" | "failed";
  error?: string;
  createdAt: string;
};

export type ContactSettings = {
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  supportHours: string;
};

const globalStore = globalThis as unknown as {
  rbLeads?: LeadRecord[];
  rbEmailLogs?: EmailLogRecord[];
  rbContactSettings?: ContactSettings;
};

export const leads = globalStore.rbLeads ?? (globalStore.rbLeads = []);
export const emailLogs = globalStore.rbEmailLogs ?? (globalStore.rbEmailLogs = []);

export const contactSettings =
  globalStore.rbContactSettings ??
  (globalStore.rbContactSettings = {
    phoneDisplay: "(+855) 011 389 625",
    phoneHref: "+85511389625",
    email: "contact@rightbricks.online",
    supportHours: "Mon-Sat, 8:00 AM - 8:00 PM Cambodia Time"
  });

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
