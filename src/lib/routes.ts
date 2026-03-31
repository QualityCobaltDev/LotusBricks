export const routes = {
  home: "/",
  buy: "/buy",
  rent: "/rent",
  sell: "/sell",
  developers: "/developers",
  contact: "/contact",
  pricing: "/pricing",
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
  adminReports: "/admin/reports"
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
