import { auth } from "@/auth";
import { ResourcesHub } from "@/components/resources-hub";
import { ResourcesHubSidebar } from "@/components/resources-hub-sidebar";
import { ResourcesHubMessenger } from "@/components/resources-hub-messenger";
import { ResourcesHubSplit } from "@/components/resources-hub-split";
import { ResourcesHubFloating } from "@/components/resources-hub-floating";
import { Header } from "@/components/site-chrome";

export const metadata = {
  title: "Resources - VowWow",
  description: "Your personalized wedding wellness journey",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const layout = params.layout || 'original';
  
  const props = {
    userName: session?.user?.name,
    userEmail: session?.user?.email,
  };

  // Layout switcher for testing
  const LayoutSwitcher = () => (
    <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-line bg-white p-4 shadow-xl">
      <p className="mb-2 text-xs font-semibold uppercase text-muted">Test Layouts</p>
      <div className="flex flex-col gap-2">
        <a href="/resources?layout=original" className={`rounded-lg px-3 py-2 text-sm ${layout === 'original' ? 'bg-sage text-white' : 'bg-sand text-ink hover:bg-sand-dark'}`}>
          Original
        </a>
        <a href="/resources?layout=sidebar" className={`rounded-lg px-3 py-2 text-sm ${layout === 'sidebar' ? 'bg-sage text-white' : 'bg-sand text-ink hover:bg-sand-dark'}`}>
          Sidebar
        </a>
        <a href="/resources?layout=messenger" className={`rounded-lg px-3 py-2 text-sm ${layout === 'messenger' ? 'bg-sage text-white' : 'bg-sand text-ink hover:bg-sand-dark'}`}>
          Messenger
        </a>
        <a href="/resources?layout=split" className={`rounded-lg px-3 py-2 text-sm ${layout === 'split' ? 'bg-sage text-white' : 'bg-sand text-ink hover:bg-sand-dark'}`}>
          Split
        </a>
        <a href="/resources?layout=floating" className={`rounded-lg px-3 py-2 text-sm ${layout === 'floating' ? 'bg-sage text-white' : 'bg-sand text-ink hover:bg-sand-dark'}`}>
          Floating
        </a>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      {layout === 'sidebar' && <ResourcesHubSidebar {...props} />}
      {layout === 'messenger' && <ResourcesHubMessenger {...props} />}
      {layout === 'split' && <ResourcesHubSplit {...props} />}
      {layout === 'floating' && <ResourcesHubFloating {...props} />}
      {layout === 'original' && (
        <div className="mx-auto max-w-7xl px-4 py-8">
          <ResourcesHub {...props} />
        </div>
      )}
      
      <LayoutSwitcher />
    </div>
  );
}
