import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminDashboardClient } from "./AdminDashboardClient";

// Always render on the server per request — no caching, no static optimization.
// Combined with the auth check below, this ensures the dashboard cannot be
// reached via browser back-button after logout.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
  return <AdminDashboardClient />;
}
