"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "../animations/AnimatedSection";
import { getPrimaryPropertyImage } from "@/src/lib/property-images";

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

// ─── Skeleton ─────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="h-56 w-full animate-pulse bg-gray-100" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-lg bg-gray-100" />
        <div className="mt-2 flex gap-4">
          <div className="h-3 w-12 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-3 w-12 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-3 w-16 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="mt-4 h-px w-full bg-gray-100" />
        <div className="h-5 w-1/3 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchProperties(type: string) {
    setLoading(true);
    setError(false);

    try {
      const params = type !== "All" ? `?type=${encodeURIComponent(type)}` : "";
      const res = await fetch(`/api/user/properties/get${params}`);

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setProperties(data.properties ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties(active);
  }, [active]);

  return (
    <section className="bg-white pt-6 pb-16 px-8 lg:px-12">
      <AnimatedSection className="mx-auto max-w-300">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-primary font-semibold uppercase tracking-wide text-sm">
              Our Properties
            </h3>
            <p className="mt-1 text-gray-500 text-sm">
              Discover Your Ideal Property
            </p>
          </div>

          {/* RED LINK ADDED (same style as your app, not big text) */}
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
              onClick={() => setActive(cat)}
              disabled={loading}
              className={[
                "rounded-full px-5 h-9 text-[13px] font-medium border",
                active === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200",
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
              <SkeletonCard key={i} />
            ))}

          {!loading && error && (
            <ErrorState onRetry={() => fetchProperties(active)} />
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
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="relative h-56 w-full bg-gray-50">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={property.title}
                        fill
                        className="object-cover"
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