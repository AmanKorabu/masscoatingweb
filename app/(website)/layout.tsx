import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import ScrollToTop from "./_components/ScrollToTop";
import SmoothScroll from "./_components/SmoothScroll";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SmoothScroll>

      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
      </SmoothScroll>
    </div>
  );
}