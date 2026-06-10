"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface AppLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  src?: string;
  alt?: string;
}

const sizes = { sm: "h-7", md: "h-9", lg: "h-12" };

/** Business logo from settings or default. */
export function AppLogo({ className, size = "md", src, alt }: AppLogoProps) {
  const { user } = useAuth();
  const logoSrc = src ?? user?.logo_url ?? "/logo.png";
  const logoAlt = alt ?? user?.business_name ?? "HakimEzy";

  return (
    <img
      src={logoSrc}
      alt={logoAlt}
      className={cn("w-auto object-contain", sizes[size], className)}
      onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }}
    />
  );
}
