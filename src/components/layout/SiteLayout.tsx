import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingCTA } from "./FloatingCTA";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { LegacyRedirectGuard } from "./LegacyRedirectGuard";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <LegacyRedirectGuard />
      <Header />
      <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </main>
      <Footer />
      <FloatingCTA />
    </ClientProviders>
  );
}
