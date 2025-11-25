import type { Metadata, Viewport } from "next";
import { Bruno_Ace_SC, Montserrat } from "next/font/google";
import type { PropsWithChildren } from "react";

import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { StarsCanvas } from "@/components/main/star-background";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";

import "./globals.css";
import { ChatWidget } from "@/components/main/chat-widget";

const brunoAceSC = Bruno_Ace_SC({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bruno-ace-sc"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat"
});

export const viewport: Viewport = {
  themeColor: "#030014",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://deakinrover.com/#organization",
        "name": "Deakin Rover Team",
        "url": "https://deakinrover.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://deakinrover.com/deakin_rover_logo_white.svg",
          "width": 512,
          "height": 512
        },
        "description": "Deakin University's student-led rover team competing in the Australian Rover Challenge",
        "foundingDate": "2025",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Geelong",
          "addressRegion": "VIC",
          "postalCode": "3216",
          "addressCountry": "AU"
        },
        "parentOrganization": {
          "@type": "EducationalOrganization",
          "name": "Deakin University",
          "url": "https://deakin.edu.au"
        },
        "sameAs": [
          "https://github.com/deakinrover",
          "https://instagram.com/deakinroverteam",
          "https://linkedin.com/company/deakin-competitive-robotics/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://deakinrover.com/#website",
        "url": "https://deakinrover.com",
        "name": "Deakin Rover Team",
        "description": "Deakin University's student-led rover team competing in the Australian Rover Challenge",
        "publisher": {
          "@id": "https://deakinrover.com/#organization"
        },
        "inLanguage": "en-AU"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://deakinrover.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NQJPHK8J');`
          }}
        />
      </head>
      <body
        className={cn(
          "bg-[#030014] overflow-y-scroll overflow-x-hidden",
          montserrat.className,
          brunoAceSC.variable,
          montserrat.variable
        )}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NQJPHK8J"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <StarsCanvas />
        <Navbar />
        {children}
        <ChatWidget />
        <Footer />
      </body>
    </html>
  );
}
