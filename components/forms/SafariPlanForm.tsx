"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const DESTINATIONS = ["Kenya", "Tanzania", "Uganda", "Rwanda", "Cross-country combo"];
const SAFARI_STYLES = ["Budget", "Mid-range", "Luxury"];
const INTERESTS = [
  "Big cats",
  "Birding",
  "Photography",
  "Migration",
  "Culture",
  "Honeymoon",
  "Family-friendly",
];

export const inputCls =
  "w-full bg-bone-bg border border-[rgba(23,22,18,0.14)] px-3.5 py-3 text-sm text-bone-ink font-sans placeholder:text-bone-muted/50 focus:outline-none focus:border-bone-forest transition-colors";
export const labelCls =
  "block text-[10px] font-mono uppercase tracking-[0.14em] text-bone-muted mb-2";

export default function SafariPlanForm() {
  const [destinations, setDestinations] = useState<string[]>(["Kenya"]);
  const [style, setStyle] = useState("Mid-range");
  const [interests, setInterests] = useState<string[]>(["Big cats"]);
  const [submitting, setSubmitting] = useState(false);

  const toggleMulti = (
    arr: string[],
    set: (v: string[]) => void,
    val: string,
  ) => set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const chipCls = (active: boolean) =>
    `px-3.5 py-2 border rounded-full text-xs transition-colors ${
      active
        ? "bg-bone-forest text-bone-paper border-bone-forest"
        : "bg-bone-bg border-[rgba(23,22,18,0.14)] text-bone-ink hover:border-bone-forest/40"
    }`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const firstName = (fd.get("firstName") as string).trim();
    const lastName = (fd.get("lastName") as string).trim();
    const email = (fd.get("email") as string).trim();
    const phone = (fd.get("phone") as string).trim();
    const dates = (fd.get("dates") as string).trim();
    const travelers = (fd.get("travelers") as string).trim();
    const notes = (fd.get("notes") as string).trim();

    const message = [
      `Destinations: ${destinations.join(", ")}`,
      `Safari style: ${style}`,
      `Interests: ${interests.join(", ")}`,
      dates ? `Travel dates: ${dates}` : null,
      travelers ? `Travelers: ${travelers}` : null,
      notes ? `Additional info: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone: phone || undefined,
          subject: "Safari Planning Request",
          message,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        "Request sent! We'll reply with your custom plan within 24 hours.",
      );
      setDestinations(["Kenya"]);
      setStyle("Mid-range");
      setInterests(["Big cats"]);
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Failed to send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>First name</label>
          <input name="firstName" type="text" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Last name</label>
          <input name="lastName" type="text" required className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Email</label>
        <input name="email" type="email" required className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Phone (optional)</label>
        <input
          name="phone"
          type="tel"
          placeholder="+ country code"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Destinations</label>
        <div className="flex flex-wrap gap-2">
          {DESTINATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleMulti(destinations, setDestinations, d)}
              className={chipCls(destinations.includes(d))}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Safari style</label>
        <div className="flex flex-wrap gap-2">
          {SAFARI_STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={chipCls(style === s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Interests</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleMulti(interests, setInterests, i)}
              className={chipCls(interests.includes(i))}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Preferred travel dates</label>
          <input
            name="dates"
            type="text"
            placeholder="e.g. Aug 2026"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Travelers</label>
          <input
            name="travelers"
            type="text"
            placeholder="e.g. 2 adults"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Anything we should know?</label>
        <textarea
          name="notes"
          rows={4}
          placeholder="Lodges preferred, dietary needs, kids' ages…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-bone-forest text-bone-paper text-sm tracking-[0.04em] hover:bg-bone-clay transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send to a real person →"}
      </button>
    </motion.form>
  );
}
