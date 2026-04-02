export type AnalyticsEventName =
  | "view_home"
  | "click_browse_listings"
  | "view_listings"
  | "apply_filter"
  | "choose_tier"
  | "contact_form_start"
  | "contact_form_submit"
  | "login_view"
  | "password_reset_request";

export type ConsentState = "accepted" | "rejected" | "unset";

export const CONSENT_KEY = "rb_consent_analytics";

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  const raw = window.localStorage.getItem(CONSENT_KEY);
  return raw === "accepted" || raw === "rejected" ? raw : "unset";
}

export function writeConsent(value: Exclude<ConsentState, "unset">) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
}

export function trackEvent(name: AnalyticsEventName, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (readConsent() !== "accepted") return;
  const packet = { event: name, ts: Date.now(), ...payload };
  const dataLayer = ((window as any).dataLayer ??= []);
  dataLayer.push(packet);
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", name, payload);
  }
}
