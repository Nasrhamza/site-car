"use client";

// Providers globaux : thème et React Query.
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LanguageProvider } from "@/lib/site-language";
import { PublicTextLocalizer } from "@/components/public-text-localizer";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="alhaduni-theme-v2"
    >
      <QueryClientProvider client={client}>
        <LanguageProvider>
          <PublicTextLocalizer />
          {children}
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
