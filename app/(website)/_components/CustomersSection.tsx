"use client";

import { getCustomersSettings } from "@/services/customerSettings";
import { CustomersData } from "@/types/customer";
import { useEffect, useState } from "react";

export default function CustomersSection() {
  const [data, setData] = useState<CustomersData | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const result = await getCustomersSettings();
      console.log("Customers Data:", result);
      setData(result);
    };

    fetchCustomers();
  }, []);

  const customers = data?.customers || [];

  if (customers.length === 0) {
    return null;
  }


  return (
    <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 md:py-20 lg:px-8">
      {/* Soft Background Decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-10 h-72 w-72 rounded-full bg-blue-100 blur-[100px]" />
        <div className="absolute bottom-[-140px] right-[-120px] h-80 w-80 rounded-full bg-cyan-100 blur-[110px]" />

        <div className="absolute inset-0 opacity-[0.35] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-4xl text-center md:mb-16">
          <div className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 sm:text-xs">
              Trusted By Industries
            </span>
          </div>

          <h2 className="font-serif text-4xl font-bold uppercase tracking-[0.12em] text-slate-950 sm:text-5xl md:text-6xl">
            {data?.title || "Global Customers"}
          </h2>

          {data?.subTitle && (
            <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold uppercase tracking-[0.22em] text-sky-500 sm:text-base md:text-lg">
              {data.subTitle}
            </p>
          )}
        </div>

        {/* Customer Logos */}
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 items-center justify-items-center gap-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 lg:gap-y-12">
            {customers.map((customer, index) => (
              <div
                key={`${customer.name}-${index}`}
                className="group flex h-30 w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:h-35 sm:p-5"
              >
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <img
                    src={customer.logoUrl}
                    alt={customer.name}
                    className="max-h-14 w-full max-w-[110px] object-contain transition-all duration-300 group-hover:scale-105 sm:max-h-20 sm:max-w-[170px] "
                  />

                  <p className=" text-xs font-semibold uppercase text-slate-500 transition group-hover:text-blue-600 sm:text-sm">
                    {customer.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

}