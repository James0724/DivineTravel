"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import SiteLink from "./SiteLink";

interface SafariProps {
  _id: string;
  name: string;
  duration: number;
  pricing: {
    budget?: { pricePerPerson: number } | null;
    midRange?: { pricePerPerson: number } | null;
    luxury?: { pricePerPerson: number } | null;
  };
}

interface BookingButtonProps {
  safari: SafariProps;
  label?: string;
  className?: string;
}

export default function BookingButton({
  safari,
  label = "Book this safari →",
  className,
}: BookingButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SiteLink
        onClick={() => setOpen(true)}
        variant="solid"
        size="md"
        arrow
        className="flex-shrink-0"
      >
        {label}
      </SiteLink>

      {open && <BookingModal safari={safari} onClose={() => setOpen(false)} />}
    </>
  );
}
