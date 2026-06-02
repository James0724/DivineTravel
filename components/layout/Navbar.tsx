"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Mail, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Tours & Safaris",
    href: "/safaris",
    dropdown: [
      {
        label: "Kenya Safaris",
        href: "/safaris/kenya",
        description: "Masai Mara, Amboseli, Tsavo & more",
      },
      {
        label: "Tanzania Safaris",
        href: "/safaris/tanzania",
        description: "Serengeti, Ngorongoro & Zanzibar",
      },
      {
        label: "Uganda Safaris",
        href: "/safaris/uganda",
        description: "Gorilla trekking & chimp tracking",
      },
      {
        label: "cross-country safaris",
        href: "/safaris/cross-country-safaris",
        description: "Kenya · Tanzania · Uganda circuits",
      },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations/kenya",
    dropdown: [
      {
        label: "Kenya Wildlife Parks",
        href: "/destinations/kenya",
        description: "Masai Mara, Amboseli, Tsavo & 9 more",
      },
      {
        label: "Tanzania Wildlife Parks",
        href: "/destinations/tanzania",
        description: "Serengeti, Ngorongoro & beyond",
      },
      {
        label: "Uganda Wildlife Parks",
        href: "/destinations/uganda",
        description: "Gorillas, chimps & savannah",
      },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

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
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DESKTOP NAV LINK  (plain or with hover-dropdown)
═══════════════════════════════════════════════════════════════════════════ */

const MotionLink = motion(Link);

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
const smoothTransition = { duration: 0.22, ease: [0.25, 1, 0.5, 1] };

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
          "relative block font-serif text-2xl py-1 group transition-colors duration-200",
          active ? "text-bone-forest" : "text-bone-ink hover:text-bone-forest",
        )}
        variants={navLiftVars}
        initial="rest"
        whileHover="hover"
        transition={smoothTransition}
      >
        <span className="relative z-[1]">{link.label}</span>
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
            "relative flex items-center font-serif text-2xl py-1 group",
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
          <span className="relative z-[1]">{link.label}</span>
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
                       min-w-[240px] bg-bone-paper rounded-sm overflow-hidden
                       border border-[rgba(23,22,18,0.12)] shadow-[0_8px_32px_rgba(23,22,18,0.12)]"
          >
            {/* Arrow notch */}
            <div
              className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-[10px] h-[10px]
                         bg-bone-paper border-l border-t border-[rgba(23,22,18,0.12)] rotate-45"
            />

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
                <span className="text-[13px] font-medium text-bone-ink group-hover:text-bone-forest transition-colors">
                  {item.label}
                </span>
                <span className="text-[11px] text-bone-muted mt-0.5 leading-snug">
                  {item.description}
                </span>
              </Link>
            ))}
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
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const menuLinkVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
  },
};

const menuCtaVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1], delay: 0.25 },
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
            transition={{ duration: 0.22, ease: "easeInOut" }}
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
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
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

export default function Navbar() {
  const [navVisible, setNavVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const atTop = y < 60;

      setScrolled(!atTop);

      if (atTop) {
        setNavVisible(true);
      } else if (y > lastScrollY.current + 8) {
        setNavVisible(false);
        setMobileOpen(false);
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

  return (
    <>
      {/* TOPBAR */}
      <div className="z-[50] bg-bone-ink text-[rgba(244,239,226,0.82)] font-mono text-[11px] tracking-[0.1em] px-6 lg:px-12 py-[9px] flex justify-between items-center">
        <div className="flex gap-4 items-center flex-wrap">
          <a
            href="tel:+254722595916"
            className="flex items-center gap-1.5 transition-colors hover:text-[#e8c080]"
          >
            <Phone size={11} strokeWidth={2.2} aria-hidden="true" />
            +254 722-595-916
          </a>
          <span className="opacity-30 select-none">·</span>
          <a
            href="mailto:info@divinetravelnestsafaris.com"
            className="hidden lg:flex items-center gap-1.5 transition-colors hover:text-[#e8c080]"
          >
            <Mail size={11} strokeWidth={2.2} aria-hidden="true" />
            info@divinetravelnestsafaris.com
          </a>
        </div>

        <div className="flex gap-4 items-center">
          <a
            href="https://www.tripadvisor.com/Attraction_Review-g294207-d26155748-Reviews-Divine_Travel_Nest_Safaris-Nairobi.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-[#e8c080]"
            aria-label="TripAdvisor reviews"
          >
            <TripAdvisorIcon className="w-[14px] h-[14px] opacity-90" />
            <span className="hidden xs:inline">TripAdvisor</span>
            <span className="opacity-50 hidden lg:inline">↗</span>
          </a>
          <a
            href="https://share.google/hr0uDk89EOkgVPDGh"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 transition-colors hover:text-[#e8c080]"
            aria-label="Google Reviews"
          >
            <GoogleIcon className="w-[13px] h-[13px]" />
            <span>Google Reviews</span>
            <span className="opacity-50 hidden lg:inline">↗</span>
          </a>
        </div>
      </div>

      {/* STICKY NAV */}
      <motion.header
        className="sticky top-0 z-[100]"
        animate={{ y: navVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
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
            <div className="hidden sm:block leading-tight">
              <span className="font-serif text-[19px] tracking-[-0.01em] text-bone-ink">
                Divine{" "}
                <span className="italic text-bone-clay font-medium">
                  Travel Nest
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center justify-center gap-6">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.href} link={link} pathname={pathname} />
            ))}
          </nav>

          {/* Right CTA */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/plan-my-safari"
              className="hidden font-sans lg:inline-flex items-center px-[20px] py-[8px] bg-bone-forest text-bone-paper rounded-full text-sm tracking-[0.01em] transition-all duration-200 hover:bg-bone-clay hover:-translate-y-px"
            >
              Plan My Safari
            </Link>

            <motion.button
              className="lg:hidden font-mono text-sm uppercase tracking-[0.14em] text-bone-ink/70 hover:text-bone-clay transition-colors min-w-[36px] text-right"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, y: mobileOpen ? -3 : 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: mobileOpen ? 3 : -3 }}
                  transition={{ duration: 0.15, ease: "linear" }}
                  className="block"
                >
                  {mobileOpen ? "Close" : "Menu"}
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
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
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
              className="px-6 pt-6 pb-4 flex-shrink-0"
            >
              <Link
                href="/plan-my-safari"
                className="flex font-sans items-center justify-center gap-2.5 w-full py-[17px] bg-bone-forest text-bone-paper rounded-full text-[15px] font-medium tracking-[0.01em] hover:bg-bone-clay transition-colors duration-200"
              >
                Plan My Safari <span>→</span>
              </Link>
            </motion.div>

            <div className="px-6 pb-8 flex-shrink-0 flex flex-col gap-1.5 font-mono text-[12px] tracking-[0.06em] text-bone-muted">
              <a
                href="tel:+254722595916"
                className="hover:text-bone-clay transition-colors"
              >
                +254 722-595-916
              </a>
              <a
                href="mailto:info@divinetravelnestsafaris.com"
                className="hover:text-bone-clay transition-colors"
              >
                info@divinetravelnestsafaris.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
