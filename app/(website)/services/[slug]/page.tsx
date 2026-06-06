import { getServiceBySlug } from "@/services/serviceSettings";
import Link from "next/link";
import { notFound } from "next/navigation";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.seoTitle || service.title,
    description:
      service.seoDescription ||
      service.shortDescription ||
      `Learn more about ${service.title} services by Mass Coating Company.`,
    keywords: service.seoKeywords || [
      service.title,
      `${service.title} Services`,
      "Mass Coating Company",
      "Industrial Coating Services",
    ],
    openGraph: {
      title: service.seoTitle || service.title,
      description:
        service.seoDescription ||
        service.shortDescription ||
        `Professional ${service.title} services by Mass Coating Company.`,
      images: service.images?.[0] ? [service.images[0]] : ["/icon-512.png"],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || !service.isActive) {
    notFound();
  }

  const mainImage = service.images?.[0];

  return (
    <main className="bg-[#f8fbff]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07111f] px-4 py-16 text-white sm:px-6 md:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-[-150px] right-[-120px] h-80 w-80 rounded-full bg-cyan-400/20 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
            Mass Coating Company Services
          </p>

          <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
            {service.title}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {service.shortDescription}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/get-quote"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Get Quote
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
              Service Overview
            </p>

            <h2 className="mt-3 text-2xl font-black text-slate-950">
              About {service.title}
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
              {service.fullDescription}
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
            {mainImage ? (
              <img
                src={mainImage}
                alt={service.title}
                className="h-[360px] w-full object-cover sm:h-[450px]"
              />
            ) : (
              <div className="flex h-[360px] items-center justify-center bg-slate-200 text-slate-500 sm:h-[450px]">
                No Image
              </div>
            )}
          </div>
        </div>

        {(service.features?.length > 0 || service.extraServices?.length) && (
          <div className="mx-auto mt-8 grid max-w-7xl gap-6 md:grid-cols-2">
            {service.features?.length > 0 && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
                <h2 className="text-xl font-black text-slate-950">
                  Key Benefits
                </h2>

                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {service.features.map((feature, index) => (
                    <li key={`${feature}-${index}`}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {service.extraServices?.length ? (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
                <h2 className="text-xl font-black text-slate-950">
                  Related Services
                </h2>

                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {service.extraServices.map((item, index) => (
                    <li key={`${item}-${index}`}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}