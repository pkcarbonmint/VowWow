import { auth } from "@/auth";
import { ResourcesHubSidebar } from "@/components/resources-hub-sidebar";
import { Header } from "@/components/site-chrome";

export const metadata = {
  title: "Resources - VowWow",
  description: "Your personalized wedding wellness journey",
};

export default async function ResourcesPage() {
  const session = await auth();
  
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <ResourcesHubSidebar
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />
    </div>
  );
}
