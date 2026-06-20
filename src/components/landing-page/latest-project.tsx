"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "../animations/AnimatedSection";
import { getPrimaryPropertyImage } from "@/src/lib/property-images";
import { usePropertyCache } from "@/src/hooks/use-property-cache";
import { LatestProjectCardSkeleton } from "../skeletons/PropertySkeletons";

type Property = {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  area_has_plus?: boolean | null;
  image_url: string | null;
  created_at: string;
};

// ─── Main component ───────────────────────────────────────────────────────────
export function LatestProjects() {
  // Fetch function - will be memoized by usePropertyCache
  const fetchLatestProperties = useCallback(async (): Promise<Property[]> => {
    const res = await fetch("/api/user/properties/get?limit=3");
    if (!res.ok) throw new Error("Failed to fetch properties");
    const data: { properties?: Property[] } = await res.json();
    return data.properties ?? [];
  }, []);

  // Use cache hook with 5-minute TTL
  const { data: cachedProperties, loading, error, refetch } = usePropertyCache(
    fetchLatestProperties,
    {
      key: "property_latest",
      ttl: 5 * 60 * 1000, // 5 minutes cache
    }
  );
  const properties = cachedProperties ?? [];

  return (
    <section className="bg-[#f7f7f8] py-16 px-8 lg:px-12">
      <AnimatedSection className="mx-auto max-w-300">

        {/* ── HEADER ── */}
        <div className="mb-10 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="mb-8">
            <h3 className="font-heading font-black uppercase tracking-wide text-primary">
              Latest Properties
            </h3>
            <p className="mt-1 text-gray-500">Our Latest Properties</p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 self-start lg:self-end
                       text-[13px] font-semibold text-primary no-underline
                       border-b border-primary/40 pb-0.5
                       transition-all duration-200 hover:border-primary whitespace-nowrap"
          >
            See All Properties <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* ── CARDS ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Loading skeletons */}
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <LatestProjectCardSkeleton key={i} />
          ))}

          {/* Error state */}
          {!loading && error && (
            <div className="col-span-full py-16 text-center">
              <p className="text-sm text-gray-400 mb-4">Failed to load properties.</p>
              <button
                onClick={refetch}
                className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && properties.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-gray-400">
              No properties added yet.
            </div>
          )}

          {/* Real cards */}
          {!loading && !error && properties.map((property) => {
            const coverImage = getPrimaryPropertyImage(property.image_url);

            return (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group relative overflow-hidden rounded-2xl no-underline
                         h-75 lg:h-85
                         transition-all duration-300 hover:-translate-y-1
                         hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
            >
              {/* Image */}
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

              {/* Type badge */}
              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-800 backdrop-blur-sm">
                  {property.type}
                </span>
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="m-0 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {property.location}
                </p>
                <h4 className="m-0 font-heading text-[20px] font-bold text-white leading-tight line-clamp-2">
                  {property.title}
                </h4>
                <p className="m-0 mt-2 text-[13px] font-semibold text-white/80">
                  RWF {property.price.toLocaleString()}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      </AnimatedSection>
    </section>
  );
}
