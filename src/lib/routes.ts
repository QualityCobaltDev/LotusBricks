export const routes = {
  home: "/",
  buy: "/buy",
  rent: "/rent",
  sell: "/sell",
  landlords: "/landlords",
  developers: "/developers",
  pricing: "/pricing",
  contact: "/contact",
  about: "/about",
  help: "/help",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  account: "/account",
  accountSaved: "/account/saved",
  accountViewings: "/account/viewings",
  accountProfile: "/account/profile",
  admin: "/admin",
  adminListings: "/admin/listings",
  adminUsers: "/admin/users",
  adminReports: "/admin/reports",
  adminInquiries: "/admin/inquiries"
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
