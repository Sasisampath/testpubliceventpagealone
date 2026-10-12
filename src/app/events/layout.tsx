import "@/features/jazzclub/jazzclub.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

/**
 * Events-only wrapper: the dark stage behind the hero, the company Header
 * and Footer, and the JazzClub stylesheet — scoped to /events.
 */
export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#08080a]">
      <Header />
      <main className="flex-1 bg-[#08080a]">{children}</main>
      <Footer />
    </div>
  );
}
