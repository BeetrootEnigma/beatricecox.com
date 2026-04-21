import { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { draftMode } from "next/headers";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar/Navbar";
import { PreviewBadge } from "@/components/PreviewBadge";
import { env } from "@/lib/env";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { isEnabled: isPreviewEnabled } = await draftMode();

  return (
    <>
      <Navbar />
      {children}
      <Footer />

      {isPreviewEnabled && <PreviewBadge />}

      {env.NEXT_PUBLIC_ENVIRONMENT === "production" && (
        <>
          <GoogleAnalytics
            gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string}
          />
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
}
