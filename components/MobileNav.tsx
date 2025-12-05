"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  MicIcon,
  CrownIcon,
  UserStar,
} from "lucide-react";

export default function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: HomeIcon,
    },
    {
      href: "/appointments",
      label: "Appointments",
      icon: CalendarIcon,
    },
    {
      href: "/voice",
      label: "Voice",
      icon: MicIcon,
    },
    {
      href: "/pro",
      label: "Pro",
      icon: CrownIcon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 z-50 md:hidden">
      <ul className="flex justify-around items-center h-16">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}

        {/* ADMIN NAV LINK (only for admins) */}
        {isAdmin && (
          <li>
            <Link
              href="/admin"
              className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                pathname === "/admin"
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserStar className="w-5 h-5" />
              <span>Admin</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
