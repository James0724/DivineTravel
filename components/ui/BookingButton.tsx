"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import SiteLink from "./SiteLink";
import type { Safari } from "@/types";

interface BookingButtonProps {
  safari: Safari;
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
