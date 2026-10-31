import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { ShowcaseDashboard } from "./ShowcaseDashboard";

export default async function HomePage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return <ShowcaseDashboard />;
}
