"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "../animations/AnimatedSection";
import { getPrimaryPropertyImage } from "@/src/lib/property-images";
import { usePropertyCache } from "@/src/hooks/use-property-cache";
import { PropertyCardSkeleton } from "../skeletons/PropertySkeletons";

// ⬇️ Matched exactly to PROPERTY_TYPES in AddProperty.tsx so filtering works correctly
const categories = [
  "All",
  "Villa",
  "Family House",
  "Penthouse",
  "Apartment",
  "Mansion",
  "Townhouse",
  "Studio",
  "Commercial",
  "Plot of Land",
];

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

// ─── Empty state ─────────────────────────────────────
function EmptyState({ type }: { type: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="text-sm font-semibold text-gray-700">
        No {type === "All" ? "" : type} properties yet
      </p>
      <p className="text-xs text-gray-400">
        Check back soon — new listings are added regularly.
      </p>
    </div>
  );
}

// ─── Error state ─────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="text-sm font-semibold text-gray-700">
        Failed to load properties
      </p>
      <button
        onClick={onRetry}
        className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
      >
        Try again
      </button>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────
export function PropertiesSection() {
  const [active, setActive] = useState("All");

  // Fetch function with proper cache key strategy
  const fetchProperties = useCallback(async (): Promise<Property[]> => {
    const params = active !== "All" ? `?type=${encodeURIComponent(active)}` : "";
    const res = await fetch(`/api/user/properties/get${params}`);

    if (!res.ok) throw new Error("Failed to fetch properties");

    const data: { properties?: Property[] } = await res.json();
    return data.properties ?? [];
  }, [active]);

  // Use cache hook with category-specific cache key
  const { data: cachedProperties, loading, error, refetch } = usePropertyCache(
    fetchProperties,
    {
      key: `property_${active}`,
      ttl: 5 * 60 * 1000, // 5 minutes cache
    }
  );
  const properties = cachedProperties ?? [];

  const handleCategoryChange = (category: string) => {
    setActive(category);
  };

  return (
    <section className="bg-white pt-4 pb-12 px-6 lg:px-12 properties-test py-8 sm:py-12">
      <AnimatedSection className="mx-auto max-w-300">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-primary font-semibold uppercase tracking-wide text-sm">
              Projects
            </h3>
            <p className="mt-1 text-gray-500 text-sm">
              Building Dreams, Shaping Communities
            </p>
          </div>

          <Link
            href="/properties"
            className="text-red-500 text-sm font-medium border-b border-red-300 hover:border-red-500"
          >
            All Properties
          </Link>
        </div>

        {/* FILTERS */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              disabled={loading}
              className={[
                "rounded-full px-5 h-9 text-[13px] font-medium border transition-all duration-200",
                active === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/30",
                loading ? "opacity-60 pointer-events-none" : "",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}

          {!loading && error && (
            <ErrorState onRetry={refetch} />
          )}

          {!loading && !error && properties.length === 0 && (
            <EmptyState type={active} />
          )}

          {!loading &&
            !error &&
            properties.map((property) => {
              const coverImage = getPrimaryPropertyImage(property.image_url);

              return (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative h-56 w-full bg-gray-50">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : null}

                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold">
                        {property.type}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {property.title}
                    </h4>

                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {property.location}
                    </p>

                    <p className="mt-4 text-primary font-semibold text-sm">
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