"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Phone,
  Mail,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SiteLink from "@/components/ui/SiteLink";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import type { ContactSettings } from "@/lib/getSiteSettings";
import CurrencySwitcher from "@/components/ui/CurrencySwitcher";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

/* ═══════════════════════════════════════════════════════════════════════════
   NAV DATA
═══════════════════════════════════════════════════════════════════════════ */

interface DropdownItem {
  label: string;
  href: string;
  description: string;
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

function getNavLinks(t: ReturnType<typeof useTranslations>): NavItem[] {
  return [
    { label: t("nav.home"), href: "/" },
    {
      label: t("nav.toursSafaris"),
      href: "/safaris",
      dropdown: [
        {
          label: t("nav.toursDropdown.all.label"),
          href: "/safaris",
          description: t("nav.toursDropdown.all.description"),
        },
        {
          label: t("nav.toursDropdown.kenya.label"),
          href: "/safaris/kenya",
          description: t("nav.toursDropdown.kenya.description"),
        },
        {
          label: t("nav.toursDropdown.tanzania.label"),
          href: "/safaris/tanzania",
          description: t("nav.toursDropdown.tanzania.description"),
        },
        {
          label: t("nav.toursDropdown.uganda.label"),
          href: "/safaris/uganda",
          description: t("nav.toursDropdown.uganda.description"),
        },
        {
          label: t("nav.toursDropdown.rwanda.label"),
          href: "/safaris/rwanda",
          description: t("nav.toursDropdown.rwanda.description"),
        },
        {
          label: t("nav.toursDropdown.crossCountry.label"),
          href: "/safaris/cross-country-safaris",
          description: t("nav.toursDropdown.crossCountry.description"),
        },
      ],
    },
    {
      label: t("nav.safariTypes"),
      href: "/safari-types",
      dropdown: [
        {
          label: t("nav.safariTypesDropdown.all.label"),
          href: "/safari-types",
          description: t("nav.safariTypesDropdown.all.description"),
        },
        {
          label: t("nav.safariTypesDropdown.walking.label"),
          href: "/safari-types/walking",
          description: t("nav.safariTypesDropdown.walking.description"),
        },
        {
          label: t("nav.safariTypesDropdown.photographic.label"),
          href: "/safari-types/photographic",
          description: t("nav.safariTypesDropdown.photographic.description"),
        },
        {
          label: t("nav.safariTypesDropdown.family.label"),
          href: "/safari-types/family",
          description: t("nav.safariTypesDropdown.family.description"),
        },
        {
          label: t("nav.safariTypesDropdown.honeymoon.label"),
          href: "/safari-types/honeymoon",
          description: t("nav.safariTypesDropdown.honeymoon.description"),
        },
        {
          label: t("nav.safariTypesDropdown.solo.label"),
          href: "/safari-types/solo",
          description: t("nav.safariTypesDropdown.solo.description"),
        },
      ],
    },
    {
      label: t("nav.destinations"),
      href: "/destinations",
      dropdown: [
        {
          label: t("nav.destinationsDropdown.all.label"),
          href: "/destinations",
          description: t("nav.destinationsDropdown.all.description"),
        },
        {
          label: t("nav.destinationsDropdown.kenya.label"),
          href: "/destinations/kenya",
          description: t("nav.destinationsDropdown.kenya.description"),
        },
        {
          label: t("nav.destinationsDropdown.tanzania.label"),
          href: "/destinations/tanzania",
          description: t("nav.destinationsDropdown.tanzania.description"),
        },
        {
          label: t("nav.destinationsDropdown.uganda.label"),
          href: "/destinations/uganda",
          description: t("nav.destinationsDropdown.uganda.description"),
        },
        {
          label: t("nav.destinationsDropdown.rwanda.label"),
          href: "/destinations/rwanda",
          description: t("nav.destinationsDropdown.rwanda.description"),
        },
      ],
    },
    {
      label: t("nav.accommodations"),
      href: "/accommodations",
      dropdown: [
        {
          label: t("nav.accommodationsDropdown.all.label"),
          href: "/accommodations",
          description: t("nav.accommodationsDropdown.all.description"),
        },
        {
          label: t("nav.accommodationsDropdown.luxuryLodges.label"),
          href: "/accommodations/luxury-lodges",
          description: t("nav.accommodationsDropdown.luxuryLodges.description"),
        },
        {
          label: t("nav.accommodationsDropdown.tentedCamps.label"),
          href: "/accommodations/tented-camps",
          description: t("nav.accommodationsDropdown.tentedCamps.description"),
        },
        {
          label: t("nav.accommodationsDropdown.beachResorts.label"),
          href: "/accommodations/beach-resorts",
          description: t("nav.accommodationsDropdown.beachResorts.description"),
        },
      ],
    },
    { label: t("nav.aboutUs"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
    { label: t("nav.journal"), href: "/journal" },
  ];
}

/* ═══════════════════════════════════════════════════════════════════════════
   INLINE SVG ICONS
═══════════════════════════════════════════════════════════════════════════ */

function TripAdvisorIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="18"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle
        cx="22"
        cy="18"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle cx="10" cy="18" r="2" />
      <circle cx="22" cy="18" r="2" />
      <path d="M14.5 22 L16 25 L17.5 22 Z" />
      <path
        d="M6 10 C8 8, 10 7, 10 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M26 10 C24 8, 22 7, 22 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 13 Q16 10 22 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.5 14.4c-.3-.15-1.65-.8-1.9-.9-.25-.1-.45-.15-.6.15-.2.3-.7.9-.85 1.05-.15.15-.3.2-.55.05-1.5-.75-2.5-1.35-3.5-3.05-.25-.45.25-.4.7-1.35.1-.2.05-.35-.05-.5-.1-.15-.55-1.3-.75-1.8-.2-.45-.4-.4-.6-.4-.15 0-.4 0-.6 0-.2 0-.55.1-.8.4-.3.35-1.1 1.1-1.1 2.6 0 1.5 1.1 3 1.25 3.2.15.2 2.05 3.25 5.1 4.4 2.55 1 2.55.65 3.05.6.5-.05 1.65-.65 1.9-1.3.25-.65.25-1.2.15-1.3-.1-.1-.4-.2-.85-.4z" />
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.55 3.7 1.5 5.2L2 22l4.95-1.45C8.4 21.45 10.15 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.15c-1.65 0-3.2-.45-4.55-1.3l-.3-.2-3.05.9.9-2.95-.2-.3c-.95-1.4-1.45-3.05-1.45-4.8 0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z" />
    </svg>
  );
}

function StarRow({
  className = "fill-[#e8c080] text-[#e8c080]",
}: {
  className?: string;
}) {
  return (
    <span className="flex items-center gap-[1px]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={9} className={className} strokeWidth={0} />
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DESKTOP NAV LINK  (plain or with hover-dropdown)
═══════════════════════════════════════════════════════════════════════════ */

const MotionLink = motion.create(Link);

function checkActive(href: string, pathname: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  const base = href.split("?")[0];
  return pathname === base || pathname.startsWith(base + "/");
}

/* ── Shared motion variants ── */
const navLiftVars = {
  rest: { y: 0 },
  hover: { y: -1.5 },
} as const;

/* Optimized custom easing curve for a high-end feel */
const smoothTransition = { duration: 0.38, ease: [0.25, 1, 0.5, 1] };

function DesktopNavLink({
  link,
  pathname,
}: {
  link: NavItem;
  pathname: string;
}) {
  const active = checkActive(link.href, pathname);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const enter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 130);
  };

  /* ── Plain link (no dropdown) ── */
  if (!link.dropdown) {
    return (
      <MotionLink
        href={link.href}
        className={cn(
          "relative block font-serif py-1 group transition-colors duration-200",
          active ? "text-bone-forest" : "text-bone-ink hover:text-bone-forest",
        )}
        variants={navLiftVars}
        initial="rest"
        whileHover="hover"
        transition={smoothTransition}
      >
        <h5 className="relative z-[1] text-[16px] xl:text-[17px] whitespace-nowrap">
          {link.label}
        </h5>
        <span
          className={cn(
            "absolute bottom-0 left-0 w-full h-[1.5px] bg-bone-clay origin-left",
            "scale-x-0 transition-transform duration-300 ease-out",
            "group-hover:scale-x-100",
            active && "scale-x-100 bg-bone-forest",
          )}
          aria-hidden="true"
        />
      </MotionLink>
    );
  }

  /* ── Link with dropdown ── */
  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <div className="flex items-center">
        <MotionLink
          href={link.href}
          className={cn(
            "relative flex items-center font-serif py-1 group",
            "transition-colors duration-200",
            active || open
              ? "text-bone-forest"
              : "text-bone-ink hover:text-bone-forest",
          )}
          variants={navLiftVars}
          initial="rest"
          whileHover="hover"
          transition={smoothTransition}
        >
          <h5 className="relative z-[1] text-[16px] xl:text-[17px] whitespace-nowrap">
            {link.label}
          </h5>
          <motion.button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex items-center justify-center p-1 ml-0.5 bg-transparent border-0 cursor-pointer",
              "transition-colors duration-200",
              active || open
                ? "text-bone-forest"
                : "text-bone-ink hover:text-bone-forest",
            )}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            aria-label={`${open ? "Close" : "Open"} ${link.label} sub-menu`}
          >
            <ChevronDown size={12} strokeWidth={2} />
          </motion.button>
          <span
            className={cn(
              "absolute bottom-0 left-0 w-full h-[1.5px] bg-bone-clay origin-left",
              "scale-x-0 transition-transform duration-300 ease-out",
              "group-hover:scale-x-100",
              active && "scale-x-100 bg-bone-forest",
            )}
            aria-hidden="true"
          />
        </MotionLink>
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={smoothTransition}
            className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-[120]
                       min-w-[360px] bg-bone-paper rounded-sm overflow-hidden
                       border border-[rgba(23,22,18,0.12)] shadow-[0_8px_32px_rgba(23,22,18,0.12)]"
          >
            {/* Arrow notch */}
            <div
              className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-[10px] h-[10px]
                         bg-bone-paper border-l border-t border-[rgba(23,22,18,0.12)] rotate-45"
            />

            {/* Scrollable item list — keeps a constant max height on short
                (small-laptop) viewports instead of growing past the bottom
                of the screen */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "min(72vh, 480px)" }}
            >
              {link.dropdown.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex flex-col px-5 py-3.5 transition-colors duration-150 hover:bg-bone-bg group",
                    i < link.dropdown!.length - 1 &&
                      "border-b border-[rgba(23,22,18,0.07)]",
                  )}
                >
                  <p className="font-serif font-medium text-bone-ink group-hover:text-bone-forest transition-colors">
                    {item.label}
                  </p>
                  <p className="font-serif text-bone-muted mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE MENU VARIANTS
═══════════════════════════════════════════════════════════════════════════ */

const menuContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const menuLinkVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] },
  },
};

const menuCtaVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1], delay: 0.55 },
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE NAV ITEM  (plain or accordion-dropdown)
═══════════════════════════════════════════════════════════════════════════ */

function MobileNavItem({
  link,
  pathname,
  openDropdown,
  setOpenDropdown,
  onClose,
}: {
  link: NavItem;
  pathname: string;
  openDropdown: string | null;
  setOpenDropdown: (v: string | null) => void;
  onClose: () => void;
}) {
  const active = checkActive(link.href, pathname);
  const isOpen = openDropdown === link.href;

  if (!link.dropdown) {
    return (
      <Link
        href={link.href}
        onClick={onClose}
        className={cn(
          "flex items-center justify-between w-full py-[15px] border-b border-[rgba(23,22,18,0.07)]",
          "font-serif font-light leading-[1.1] transition-colors duration-150",
          "text-[clamp(26px,7vw,36px)]",
          active ? "text-bone-clay" : "text-bone-ink hover:text-bone-clay",
        )}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center border-b border-[rgba(23,22,18,0.07)]">
        <Link
          href={link.href}
          onClick={onClose}
          className={cn(
            "flex-1 py-[15px] font-serif font-light leading-[1.1] transition-colors duration-150",
            "text-[clamp(26px,7vw,36px)]",
            active || isOpen
              ? "text-bone-clay"
              : "text-bone-ink hover:text-bone-clay",
          )}
        >
          {link.label}
        </Link>
        <button
          onClick={() => setOpenDropdown(isOpen ? null : link.href)}
          className={cn(
            "flex items-center justify-center w-12 h-full py-[15px] flex-shrink-0",
            "bg-transparent border-0 cursor-pointer transition-colors duration-150",
            active || isOpen
              ? "text-bone-clay"
              : "text-bone-ink hover:text-bone-clay",
          )}
          aria-label={`${isOpen ? "Close" : "Open"} ${link.label} sub-menu`}
          aria-expanded={isOpen}
        >
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <ChevronDown size={22} strokeWidth={1.5} />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="sub"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-4 pt-1 pb-3 space-y-1">
              {link.dropdown.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex flex-col py-2.5 group transition-colors"
                >
                  <span className="font-serif text-[22px] font-light text-bone-ink/80 group-hover:text-bone-clay transition-colors">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] text-bone-muted mt-0.5 tracking-[0.04em]">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export default function Navbar({ settings }: { settings: ContactSettings }) {
  const t = useTranslations("common");
  const navLinks = getNavLinks(t);
  const [navVisible, setNavVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const topbarRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLElement>(null);
  // Ref so the scroll handler can read the latest mobileOpen without being
  // re-created every time the mobile menu opens/closes.
  const mobileOpenRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const h =
        (topbarRef.current?.offsetHeight ?? 0) +
        (stickyHeaderRef.current?.offsetHeight ?? 0);
      document.documentElement.style.setProperty("--navbar-h", `${h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (topbarRef.current) ro.observe(topbarRef.current);
    if (stickyHeaderRef.current) ro.observe(stickyHeaderRef.current);
    return () => ro.disconnect();
  }, []);

  // Keep ref in sync so the scroll handler always sees the latest value.
  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      // When the mobile menu is open the user is scrolling inside the overlay.
      // Bail out completely so the menu doesn't close mid-scroll.
      if (mobileOpenRef.current) return;

      const y = window.scrollY;
      const atTop = y < 60;

      setScrolled(!atTop);

      if (atTop) {
        setNavVisible(true);
      } else if (y > lastScrollY.current + 8) {
        setNavVisible(false);
        setOpenDropdown(null);
      } else if (y < lastScrollY.current - 8) {
        setNavVisible(true);
      }

      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const phoneHref = settings.phone
    ? `tel:${settings.phone.replace(/[^+\d]/g, "")}`
    : "";
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`
    : "";
  const hasSocial = !!(
    settings.facebook ||
    settings.instagram ||
    settings.youtube
  );

  return (
    <>
      {/* TOPBAR */}
      <div
        ref={topbarRef}
        className="relative z-[150] hidden sm:block w-full text-[11px]"
      >
        <div className="absolute inset-0 bg-bone-forest" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bone-clay/40 to-transparent" />

        <div className="relative z-10 flex h-[34px] w-full items-center justify-between px-6 lg:px-12">
          {/* Contact group */}
          <div className="flex items-center gap-3 text-[12px] min-w-0">
            {settings.phone && (
              <a
                href={phoneHref}
                className="group flex items-center gap-1.5 text-bone-paper/80 transition-colors hover:text-[#e8c080]"
                aria-label={`Call us: ${settings.phone}`}
              >
                <Phone
                  size={13}
                  strokeWidth={2.2}
                  className="text-[#e8c080]"
                  aria-hidden="true"
                />
                <span className="hidden md:inline font-medium">
                  {settings.phone}
                </span>
                <span className="md:hidden font-medium">
                  {t("topbar.callUs")}
                </span>
              </a>
            )}
            {settings.whatsapp && (
              <>
                <span
                  className="h-4 w-px bg-bone-paper/20"
                  aria-hidden="true"
                />
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-bone-paper/80 transition-colors hover:text-[#e8c080]"
                  aria-label={t("topbar.chatWhatsappAria")}
                >
                  <WhatsAppIcon className="h-[13px] w-[13px] fill-[#25D366]" />
                  <span className="hidden lg:inline font-medium">
                    {t("topbar.whatsapp")}
                  </span>
                </a>
              </>
            )}
            {settings.email && (
              <>
                <span
                  className="hidden md:block h-4 w-px bg-bone-paper/20"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${settings.email}`}
                  className="group hidden md:flex items-center gap-1.5 text-bone-paper/80 transition-colors hover:text-[#e8c080]"
                >
                  <Mail
                    size={13}
                    strokeWidth={2.2}
                    className="text-[#e8c080]"
                    aria-hidden="true"
                  />
                  <span className="hidden xl:inline font-medium">
                    {settings.email}
                  </span>
                  <span className="xl:hidden font-medium">
                    {t("topbar.emailUs")}
                  </span>
                </a>
              </>
            )}
          </div>

          {/* Utility group */}
          <div className="flex items-center gap-2">
            <CurrencySwitcher variant="pill" />
            <LanguageSwitcher variant="pill" />

            {hasSocial && (
              <div className="hidden xl:flex items-center gap-1.5 ml-1.5 pl-2.5 border-l border-bone-paper/20">
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("topbar.facebookAria")}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-bone-paper/65 transition-all hover:bg-bone-paper/15 hover:text-[#5b9bf5] hover:scale-110"
                  >
                    <Facebook size={14} strokeWidth={2.2} />
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("topbar.instagramAria")}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-bone-paper/65 transition-all hover:bg-bone-paper/15 hover:text-[#f0738a] hover:scale-110"
                  >
                    <Instagram size={14} strokeWidth={2.2} />
                  </a>
                )}
                {settings.youtube && (
                  <a
                    href={settings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("topbar.youtubeAria")}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-bone-paper/65 transition-all hover:bg-bone-paper/15 hover:text-[#ff5c5c] hover:scale-110"
                  >
                    <Youtube size={15} strokeWidth={2.2} />
                  </a>
                )}
              </div>
            )}

            {settings.tripadvisor && (
              <>
                <span
                  className="hidden lg:block h-4 w-px bg-bone-paper/20"
                  aria-hidden="true"
                />
                <a
                  href={settings.tripadvisor}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex items-center gap-1.5 transition-opacity hover:opacity-80"
                  aria-label={t("topbar.tripadvisorAria")}
                >
                  <TripAdvisorIcon className="h-4 w-4 text-[#e8c080]" />
                  <StarRow className="fill-[#e8c080] text-[#e8c080]" />
                  <span className="hidden xl:inline font-medium text-bone-paper/85">
                    {t("topbar.tripadvisor")}
                  </span>
                </a>
              </>
            )}
            {settings.googleReviews && (
              <a
                href={settings.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 transition-opacity hover:opacity-80"
                aria-label={t("topbar.googleAria")}
              >
                <GoogleIcon className="h-[13px] w-[13px]" />
                <StarRow className="fill-[#e8c080] text-[#e8c080]" />
                <span className="hidden xl:inline font-medium text-bone-paper/85">
                  {t("topbar.google")}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* STICKY NAV */}
      <motion.header
        ref={stickyHeaderRef}
        className="sticky top-0 z-[100] w-full"
        animate={{ y: navVisible ? 0 : "-100%" }}
        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
      >
        <div
          className={cn(
            "border-b border-[rgba(23,22,18,0.08)]",
            "grid grid-cols-[auto_1fr_auto] items-center gap-8 md:gap-12 px-6 lg:px-12",
            "transition-all duration-300 py-[10px]",
            scrolled
              ? " bg-[rgba(244,239,226,0.96)] backdrop-blur-[14px] shadow-nav"
              : " bg-bone-paper",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group"
            aria-label="Divine Travel Nest Safaris — home"
          >
            <div className="overflow-hidden rounded transition-all duration-300 flex-shrink-0 h-9">
              <Image
                src="/logo.png"
                alt="Divine Travel Nest Safaris"
                width={48}
                height={48}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block md:hidden 2xl:block leading-tight">
              <span className="font-serif text-[19px] tracking-[-0.01em] text-bone-ink">
                Divine{" "}
                <span className="italic text-bone-clay font-medium">
                  Travel Nest
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-5">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.href} link={link} pathname={pathname} />
            ))}
          </nav>

          {/* Right CTA */}
          <div className="flex items-center justify-end gap-4">
            <HoverBorderGradient
              as={Link}
              href="/contact"
              containerClassName="hidden lg:flex"
            >
              {t("cta.planMySafari")}
            </HoverBorderGradient>

            <motion.button
              className="lg:hidden font-mono text-sm uppercase tracking-[0.14em] text-bone-ink/70 hover:text-bone-clay transition-colors min-w-[36px] text-right"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? t("menu.close") : t("menu.open")}
              aria-expanded={mobileOpen}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, y: mobileOpen ? -3 : 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: mobileOpen ? 3 : -3 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="block"
                >
                  {mobileOpen ? t("menu.close") : t("menu.open")}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", pointerEvents: "none" }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[200] bg-bone-paper flex flex-col xl:hidden"
          >
            <div className="flex items-center justify-between px-6 pt-[22px] mb-6 flex-shrink-0">
              <span className="font-serif text-[22px] tracking-[-0.01em] text-bone-ink">
                Divine{" "}
                <em className="italic text-bone-clay font-normal">
                  Travel Nest
                </em>
              </span>
              <motion.button
                onClick={() => setMobileOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-[28px] leading-none text-bone-ink hover:text-bone-clay transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Close menu"
              >
                ×
              </motion.button>
            </div>

            <motion.nav
              className="flex-1 overflow-y-auto px-6"
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={menuLinkVariants}>
                  <MobileNavItem
                    link={link}
                    pathname={pathname}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    onClose={() => setMobileOpen(false)}
                  />
                </motion.div>
              ))}
            </motion.nav>

            <motion.div
              variants={menuCtaVariants}
              initial="hidden"
              animate="visible"
              className="px-6 pt-4 pb-4 flex-shrink-0"
            >
              <HoverBorderGradient
                as={Link}
                href="/contact"
                containerClassName="w-full justify-center"
                className="w-full justify-center text-[14px] py-[10px] px-5"
              >
                {t("cta.planMySafari")}
              </HoverBorderGradient>
            </motion.div>

            <div className="px-6 pb-5 flex-shrink-0 flex flex-wrap justify-between gap-2 font-mono text-[12px] tracking-[0.06em] text-bone-muted">
              {settings.phone && (
                <a
                  href={phoneHref}
                  className="hover:text-bone-clay transition-colors"
                >
                  {settings.phone}
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-bone-clay transition-colors break-all"
                >
                  {settings.email}
                </a>
              )}
            </div>

            {(settings.whatsapp || hasSocial) && (
              <div className="px-6 pb-8 flex-shrink-0 flex items-center gap-5 text-bone-muted">
                {settings.whatsapp && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with us on WhatsApp"
                    className="hover:text-bone-clay transition-colors"
                  >
                    <WhatsAppIcon className="w-[18px] h-[18px]" />
                  </a>
                )}
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-bone-clay transition-colors"
                  >
                    <Facebook size={18} strokeWidth={1.8} />
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-bone-clay transition-colors"
                  >
                    <Instagram size={18} strokeWidth={1.8} />
                  </a>
                )}
                {settings.youtube && (
                  <a
                    href={settings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="hover:text-bone-clay transition-colors"
                  >
                    <Youtube size={19} strokeWidth={1.8} />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
