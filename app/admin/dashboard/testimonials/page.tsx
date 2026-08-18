import PageHeader from "@/components/admin/shared/PageHeader";
import AdminTestimonials from "@/components/admin/testimonials/AdminTestimonials";

// Admin-only internal page reading live testimonial data — must never
// serve a cached/stale snapshot.
export const dynamic = "force-dynamic";

export default function TestimonialsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Testimonials"
        description="Moderate what customers are saying about ZeroArc on the homepage."
      />

      <AdminTestimonials />
    </div>
  );
}
