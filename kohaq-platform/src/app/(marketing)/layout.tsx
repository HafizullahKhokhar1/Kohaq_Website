import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-bg text-text">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </section>
  );
}

