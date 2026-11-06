import { auth } from "@/auth";
import { ResourcesHub } from "@/components/resources-hub";
import { Header } from "@/components/site-chrome";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Resources - VowWow",
  description: "Your personalized wedding wellness journey",
};

export default async function ResourcesPage() {
  const session = await auth();
  
  // For MVP, allow access without authentication
  // In future, can require signup
  
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <ResourcesHub
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />
    </div>
  );
}
