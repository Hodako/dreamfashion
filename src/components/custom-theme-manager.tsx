"use client";

import { useEffect, useState } from "react";

export type ThemeConfig = {
  primaryColor?: string;
  backgroundColor?: string;
  bgImage?: string;
  bgImageOpacity?: number;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  density?: "compact" | "standard" | "cozy";
  widgetOrder?: string[];
  isMaterialUI?: boolean;
};

export function CustomThemeManager() {
  const [config, setConfig] = useState<ThemeConfig>({});

  const loadTheme = () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("hz_custom_theme");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse custom theme config", e);
      }
    } else {
      setConfig({});
    }
  };

  useEffect(() => {
    loadTheme();

    const handleUpdate = () => {
      loadTheme();
    };

    window.addEventListener("hz-theme-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("hz-theme-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let styleEl = document.getElementById("hz-custom-theme-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "hz-custom-theme-styles";
      document.head.appendChild(styleEl);
    }

    let css = "";

    // 0. Material UI overrides
    if (config.isMaterialUI) {
      css += `
        /* Material UI Mode Overrides */
        :root, .dark {
          --radius: 4px !important;
          --font-sans: Roboto, Inter, system-ui, -apple-system, sans-serif !important;
        }

        /* Material UI Page Background */
        body {
          background-image: none !important;
          background-color: var(--background) !important;
        }

        /* Material UI Cards - Elevation 1 */
        .card, .beveled-card, .glass-card, [class*="glass-card"], [class*="beveled-card"] {
          background-color: var(--card) !important;
          background: var(--card) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border: none !important;
          border-radius: 4px !important;
          box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12) !important;
        }

        /* Material UI Hover Elevation 4 */
        .card:hover, .beveled-card:hover, .glass-card:hover {
          box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12) !important;
        }

        /* Material UI Raised Buttons */
        .button, .beveled-button, button[class*="beveled-button"], button[class*="bg-primary"], button[class*="bg-indigo-600"], [role="button"][class*="bg-primary"] {
          border-radius: 4px !important;
          text-transform: uppercase !important;
          font-weight: 500 !important;
          letter-spacing: 0.02857em !important;
          box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12) !important;
          border: none !important;
        }
        .button:active, .beveled-button:active {
          box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12) !important;
        }

        /* Material UI Form Fields - OutlinedInput style */
        input, select, textarea {
          border: 1px solid rgba(0,0,0,0.23) !important;
          border-radius: 4px !important;
          background-color: transparent !important;
          transition: border-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important;
        }
        .dark input, .dark select, .dark textarea {
          border: 1px solid rgba(255,255,255,0.23) !important;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--primary) !important;
          border-width: 2px !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* Material App Bar / Header */
        header {
          background-color: var(--card) !important;
          border-bottom: none !important;
          box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12) !important;
        }

        /* Material Sidebar */
        .sidebar {
          background-color: var(--card) !important;
          border-right: none !important;
          box-shadow: 0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12) !important;
        }

        button, [role="button"] {
          position: relative;
          overflow: hidden;
        }
      `;
    }

    // 1. Accent / Primary Color
    if (config.primaryColor) {
      css += `
        :root, .dark {
          --primary: ${config.primaryColor} !important;
          --ring: ${config.primaryColor} !important;
          --sidebar-primary: ${config.primaryColor} !important;
          --loader-color: ${config.primaryColor} !important;
        }
        .text-primary {
          color: ${config.primaryColor} !important;
        }
        .bg-primary {
          background-color: ${config.primaryColor} !important;
        }
        .border-primary {
          border-color: ${config.primaryColor} !important;
        }
      `;
    }

    // 2. Background Color
    if (config.backgroundColor) {
      css += `
        :root, .dark {
          --background: ${config.backgroundColor} !important;
          --sidebar: ${config.backgroundColor} !important;
        }
        body {
          background-color: ${config.backgroundColor} !important;
        }
      `;
    }

    // 3. Text Color
    if (config.textColor) {
      css += `
        :root, .dark {
          --foreground: ${config.textColor} !important;
          --card-foreground: ${config.textColor} !important;
          --popover-foreground: ${config.textColor} !important;
          --sidebar-foreground: ${config.textColor} !important;
        }
        body {
          color: ${config.textColor} !important;
        }
      `;
    }

    // 4. Font Family
    if (config.fontFamily) {
      css += `
        :root, .dark {
          --font-sans: ${config.fontFamily} !important;
        }
        body, html, button, input, select, textarea {
          font-family: ${config.fontFamily} !important;
        }
      `;
    }

    // 5. Base Font Size
    if (config.fontSize) {
      css += `
        html {
          font-size: ${config.fontSize} !important;
        }
      `;
    }

    // 6. Density / Sizing
    if (config.density) {
      if (config.density === "compact") {
        css += `
          .p-4, .p-5, .p-6 {
            padding: 0.65rem !important;
          }
          .p-3 {
            padding: 0.5rem !important;
          }
          .space-y-6 > * + * {
            margin-top: 0.75rem !important;
          }
          .space-y-5 > * + * {
            margin-top: 0.5rem !important;
          }
          .space-y-4 > * + * {
            margin-top: 0.5rem !important;
          }
          .beveled-card, .glass-card, [class*="glass-card"] {
            padding: 0.65rem !important;
          }
        `;
      } else if (config.density === "cozy") {
        css += `
          .p-4, .p-5, .p-6 {
            padding: 1.5rem !important;
          }
          .space-y-6 > * + * {
            margin-top: 2rem !important;
          }
          .space-y-5 > * + * {
            margin-top: 1.75rem !important;
          }
          .space-y-4 > * + * {
            margin-top: 1.5rem !important;
          }
          .beveled-card, .glass-card, [class*="glass-card"] {
            padding: 1.5rem !important;
          }
        `;
      }
    }

    // 7. Background Image Overlay
    if (config.bgImage) {
      const opacity = config.bgImageOpacity !== undefined ? config.bgImageOpacity : 0.1;
      css += `
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -10;
          background-image: url('${config.bgImage}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: ${opacity};
          pointer-events: none;
        }
      `;
    }

    styleEl.innerHTML = css;
  }, [config]);

  return null;
}
