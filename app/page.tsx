import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LandingClient } from "@/components/LandingClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return <LandingClient />;
}
