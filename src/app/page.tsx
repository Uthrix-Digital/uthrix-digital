import { Navigation } from "@/components/layout/(header)/Navigation";
import { InquiryForm } from "@/components/shared/InquiryForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <Navigation />

      {/* ── Inquiry / Lead Capture Section ── */}
      <section className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
        <InquiryForm />
      </section>
    </div>
  );
}

