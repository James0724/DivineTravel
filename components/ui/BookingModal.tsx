"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useCreateBooking } from "@/hooks/useBooking";
import { useCurrency } from "@/lib/currency/useCurrency";
import type { Safari, PriceTier } from "@/types";

// ─── Pricing helpers (mirrors BookingDetailsForm logic) ───────────────────────

type PriceRow = {
  per2: number; per3: number; per4: number; per5: number; per6: number;
  seasonLabel: string; dateRange: string;
};

function perNRate(row: PriceRow | null | undefined, count: number): number {
  if (!row) return 0;
  const key = `per${Math.max(2, Math.min(6, count))}` as keyof Pick<PriceRow, "per2" | "per3" | "per4" | "per5" | "per6">;
  const v = row[key];
  return typeof v === "number" && v > 0 ? v : 0;
}

function tierLowestPer6(tier: Safari["pricing"]["budget"]): number {
  if (!tier) return 0;
  if (tier.rows?.length) {
    const vals = tier.rows
      .map((r) => r.per6)
      .filter((p): p is number => typeof p === "number" && p > 0);
    return vals.length ? Math.min(...vals) : 0;
  }
  return tier.pricePerPerson ?? 0;
}

function findSeasonRow(
  rows: PriceRow[] | undefined,
  date: Date | null,
): { row: PriceRow; label: string; matched: boolean } | null {
  if (!rows?.length) return null;
  if (date) {
    for (const row of rows) {
      if (!row.dateRange) continue;
      const parts = row.dateRange.split(/[–—]/).map((p) => p.trim());
      if (parts.length === 2) {
        const start = new Date(parts[0]);
        const end = new Date(parts[1]);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && date >= start && date <= end) {
          return { row, label: row.seasonLabel, matched: true };
        }
      }
    }
  }
  return { row: rows[0], label: rows[0].seasonLabel, matched: false };
}

// ─────────────────────────────────────────────────────────────────────────────

const TIERS = [
  { key: "budget" as const, label: "Budget" },
  { key: "midRange" as const, label: "Mid-range" },
  { key: "luxury" as const, label: "Luxury" },
];

interface BookingModalProps {
  safari: Safari;
  onClose: () => void;
}

export default function BookingModal({ safari, onClose }: BookingModalProps) {
  const isShort = safari.tripLength === "short";

  const availableTiers = TIERS.filter((t) => tierLowestPer6(safari.pricing?.[t.key]) > 0);
  const defaultTier: PriceTier =
    availableTiers.find((t) => t.key === "midRange")?.key ??
    availableTiers[0]?.key ??
    "budget";

  const [tier, setTier] = useState<PriceTier>(defaultTier);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [preferredDate, setPreferredDate] = useState("");
  const [alternateDate, setAlternateDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<{ bookingRef: string } | null>(null);

  const createBooking = useCreateBooking();
  const { displayPrice } = useCurrency();

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Dynamic pricing ────────────────────────────────────────────────────────

  const groupSize = adults + children;
  const preferredDateObj = preferredDate ? new Date(preferredDate) : null;

  let adultRate = 0;
  let seasonLabel: string | null = null;
  let seasonMatched = false;

  if (isShort) {
    adultRate = perNRate(safari.pricing?.budget?.rows?.[0] as PriceRow | undefined, groupSize);
  } else {
    const tierRows = (safari.pricing?.[tier]?.rows ?? []) as PriceRow[];
    const found = findSeasonRow(tierRows, preferredDateObj);
    if (found) {
      adultRate = perNRate(found.row, groupSize);
      seasonLabel = found.label;
      seasonMatched = found.matched;
    }
  }

  const childRate = adultRate > 0 ? Math.round(adultRate / 2) : 0;
  const adultTotal = adults * adultRate;
  const childTotal = children * childRate;
  const totalPrice = adultTotal + childTotal;

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  function validate() {
    const e: Record<string, string> = {};
    if (firstName.trim().length < 2) e.firstName = "Required";
    if (lastName.trim().length < 2) e.lastName = "Required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if (phone.trim().length < 7) e.phone = "Required";
    if (nationality.trim().length < 2) e.nationality = "Required";
    if (!preferredDate) e.preferredDate = "Required";
    return e;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      const result = await createBooking.mutateAsync({
        safariId: safari._id,
        tier,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nationality: nationality.trim(),
        groupSize,
        adultCount: adults,
        childCount: children,
        preferredDate,
        ...(alternateDate && { alternateDate }),
        ...(specialRequests.trim() && { specialRequests: specialRequests.trim() }),
      });
      setSuccess({ bookingRef: result.data!.bookingRef });
    } catch (err) {
      setErrors({ form: (err as Error).message || "Something went wrong. Please try again." });
    }
  };

  function clearError(field: string) {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  const inputClass = (field: string) =>
    `w-full h-11 px-3 border text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors ${
      errors[field] ? "border-red-400" : "border-[var(--line)]"
    }`;

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" onClick={onClose} />
        <div className="relative bg-[var(--paper)] p-8 max-w-md w-full text-center shadow-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[var(--forest)] flex items-center justify-center mx-auto mb-5">
            <Check size={30} className="text-[var(--paper)]" strokeWidth={2.5} />
          </div>
          <h2 className="font-serif font-normal text-[30px] leading-tight mb-3">Booking Request Sent</h2>
          <p className="text-[var(--muted)] text-[14px] leading-relaxed mb-5">
            Thank you, <strong>{firstName}</strong>! A member of our team will contact you shortly
            to discuss deposit payment and finalise your pricing and confirmation.
          </p>
          <div className="font-mono text-[11px] bg-[var(--bg)] border border-[var(--line)] px-4 py-3 mb-6 text-[var(--ink)]">
            Your booking reference:{" "}
            <strong className="text-[var(--forest)]">{success.bookingRef}</strong>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-[var(--forest)] text-[var(--paper)] py-3.5 text-[13px] font-medium tracking-[0.04em] transition-opacity hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ── Booking form ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative bg-[var(--paper)] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl mx-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--forest)] text-[var(--paper)] px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-55 mb-1">
              Book this safari
            </p>
            <h2 className="font-serif font-normal text-[22px] leading-tight">{safari.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 text-[var(--paper)]/60 hover:text-[var(--paper)] transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 overscroll-contain">

          {/* Tier selection — multi-day only */}
          {!isShort && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-1">
                Safari Tier
              </p>
              <p className="text-[11px] text-[var(--muted)] mb-3">
                Choose your comfort level — each tier uses different lodges and services.
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {TIERS.map(({ key, label }) => {
                  const fromPrice = tierLowestPer6(safari.pricing?.[key]);
                  if (!fromPrice) return null;
                  const active = tier === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTier(key)}
                      className={`p-3 border text-left transition-colors ${
                        active
                          ? "border-[var(--forest)] bg-[var(--forest)]/5"
                          : "border-[var(--line)] hover:border-[var(--forest)]/40"
                      }`}
                    >
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] mb-1">
                        {label}
                      </div>
                      <div className="font-serif italic text-[18px] leading-none text-[var(--clay)]">
                        from {displayPrice(fromPrice)}
                      </div>
                      <div className="font-mono text-[9px] text-[var(--muted)] mt-0.5">
                        / person · 6 pax
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
                Preferred Travel Date *
              </label>
              <input
                type="date"
                value={preferredDate}
                min={tomorrow}
                onChange={(e) => { setPreferredDate(e.target.value); clearError("preferredDate"); }}
                className={inputClass("preferredDate")}
              />
              {errors.preferredDate && (
                <p className="text-red-500 text-[11px] mt-1">{errors.preferredDate}</p>
              )}
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
                Alternate Date (optional)
              </label>
              <input
                type="date"
                value={alternateDate}
                min={tomorrow}
                onChange={(e) => setAlternateDate(e.target.value)}
                className="w-full h-11 px-3 border border-[var(--line)] text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors"
              />
            </div>
          </div>

          {/* Group size */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-3">
              Group Size
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Adults *", value: adults, min: 1, max: 50, set: setAdults },
                { label: "Children (under 12)", value: children, min: 0, max: 20, set: setChildren },
              ].map(({ label, value, min, max, set }) => (
                <div key={label}>
                  <label className="block text-[12px] text-[var(--muted)] mb-1.5">{label}</label>
                  <div className="flex items-center h-11 border border-[var(--line)]">
                    <button
                      type="button"
                      onClick={() => set((v) => Math.max(min, v - 1))}
                      className="w-11 h-full flex items-center justify-center text-[var(--forest)] hover:bg-[var(--bg)] transition-colors text-[20px] leading-none"
                    >−</button>
                    <span className="flex-1 text-center text-sm font-medium text-[var(--ink)]">{value}</span>
                    <button
                      type="button"
                      onClick={() => set((v) => Math.min(max, v + 1))}
                      className="w-11 h-full flex items-center justify-center text-[var(--forest)] hover:bg-[var(--bg)] transition-colors text-[20px] leading-none"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="bg-[var(--forest)] text-[var(--paper)] px-5 py-4 space-y-2">
            {/* Season badge — multi-day only */}
            {!isShort && (
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--paper)]/15 text-[11px] opacity-70">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-60">Season:</span>
                {seasonLabel ? (
                  <>
                    <span>{seasonLabel}</span>
                    {preferredDate && !seasonMatched && (
                      <span className="opacity-50 text-[10px]">(nearest match)</span>
                    )}
                    {!preferredDate && (
                      <span className="opacity-50 text-[10px]">— pick a date above to auto-detect</span>
                    )}
                  </>
                ) : (
                  <span className="opacity-50">Select a travel date to match your season</span>
                )}
              </div>
            )}

            {/* Line items */}
            <div className="space-y-1">
              {adultRate > 0 ? (
                <div className="flex justify-between text-[13px]">
                  <span className="opacity-80">
                    {adults} adult{adults !== 1 ? "s" : ""} × {displayPrice(adultRate)}
                    {groupSize > 1 && (
                      <span className="opacity-50 text-[10px] ml-1">({groupSize} pax rate)</span>
                    )}
                  </span>
                  <span className="font-medium">{displayPrice(adultTotal)}</span>
                </div>
              ) : (
                <div className="text-[12px] opacity-50 italic">
                  {!preferredDate && !isShort
                    ? "Add a travel date to calculate pricing"
                    : "Pricing not available — contact us"}
                </div>
              )}
              {children > 0 && childRate > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span className="opacity-80">
                    {children} child{children !== 1 ? "ren" : ""} × {displayPrice(childRate)}
                    <span className="opacity-50 text-[10px] ml-1">(½ adult rate)</span>
                  </span>
                  <span className="font-medium">{displayPrice(childTotal)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-[var(--paper)]/20 pt-2 flex items-end justify-between gap-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-50 mb-1">
                  Estimated total
                </div>
                <div className="font-serif italic text-[36px] leading-none">
                  {totalPrice > 0 ? displayPrice(totalPrice) : "—"}
                </div>
                {totalPrice > 0 && groupSize > 0 && (
                  <div className="font-mono text-[10px] opacity-50 mt-1">
                    ≈ {displayPrice(Math.round(totalPrice / groupSize))} avg / person
                  </div>
                )}
              </div>
              <div className="text-right text-[11px] opacity-55 leading-relaxed">
                {isShort ? (
                  <span>Fixed rate · no seasonal change</span>
                ) : (
                  <span>{tier === "midRange" ? "Mid-range" : tier === "luxury" ? "Luxury" : "Budget"} tier</span>
                )}
                <br />
                <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
                  Final price confirmed by team
                </span>
              </div>
            </div>
          </div>

          {/* Personal details */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-4">
              Your Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
                  autoComplete="given-name"
                  className={inputClass("firstName")}
                />
                {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); clearError("lastName"); }}
                  autoComplete="family-name"
                  className={inputClass("lastName")}
                />
                {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                  autoComplete="email"
                  className={inputClass("email")}
                />
                {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
                  autoComplete="tel"
                  placeholder="+1 234 567 8900"
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  Nationality *
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => { setNationality(e.target.value); clearError("nationality"); }}
                  placeholder="e.g. American, British, Kenyan…"
                  className={inputClass("nationality")}
                />
                {errors.nationality && <p className="text-red-500 text-[11px] mt-1">{errors.nationality}</p>}
              </div>
            </div>
          </div>

          {/* Special requests */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
              Special Requests (optional)
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Dietary requirements, accessibility needs, special occasions, preferred lodges…"
              className="w-full px-3 py-2.5 border border-[var(--line)] text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors resize-none"
            />
          </div>

          {errors.form && (
            <p className="text-red-600 text-[13px] bg-red-50 border border-red-200 px-4 py-3">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={createBooking.isPending}
            className="w-full bg-[var(--forest)] text-[var(--paper)] py-4 text-[14px] font-medium tracking-[0.04em] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createBooking.isPending
              ? "Submitting your request…"
              : totalPrice > 0
                ? `Submit Booking Request — ${displayPrice(totalPrice)}`
                : "Submit Booking Request"}
          </button>

          <p className="text-[11px] text-[var(--muted)] text-center leading-relaxed">
            No payment is required now. Our team will contact you to finalise pricing and arrange your deposit.
          </p>
        </form>
      </div>
    </div>
  );
}
