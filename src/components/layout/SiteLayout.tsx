import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingCTA } from "./FloatingCTA";
import { ClientProviders } from "@/components/providers/ClientProviders";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCTA />
    </ClientProviders>
  );
}
