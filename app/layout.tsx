import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const ogTitle = minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name;
  const ogDescription = minikitConfig.miniapp.ogDescription || minikitConfig.miniapp.description;
  const ogImageUrl = minikitConfig.miniapp.ogImageUrl || minikitConfig.miniapp.heroImageUrl;
  const homeUrl = minikitConfig.miniapp.homeUrl;

  // Use default URL for metadataBase
  const DEFAULT_URL = "https://new-mini-app-delta.vercel.app";
  let metadataBase: URL;
  try {
    metadataBase = new URL(homeUrl || DEFAULT_URL);
  } catch {
    metadataBase = new URL(DEFAULT_URL);
  }

  return {
    metadataBase,
    title: ogTitle,
    description: ogDescription,
    openGraph: {
      type: "website",
      url: homeUrl,
      title: ogTitle,
      description: ogDescription,
      siteName: minikitConfig.miniapp.name,
      images: ogImageUrl ? [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogTitle,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "fc:frame": JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Launch ${minikitConfig.miniapp.name}`,
          action: {
            name: `Launch ${minikitConfig.miniapp.name}`,
            type: "launch_frame",
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (typeof window !== 'undefined') {
                    window.__VERCEL_TOOLBAR__ = false;
                    // Prevent Vercel Toolbar from loading
                    Object.defineProperty(window, '__VERCEL_TOOLBAR__', {
                      value: false,
                      writable: false,
                      configurable: false
                    });
                    // Remove toolbar if already loaded
                    if (document) {
                      const removeToolbar = () => {
                        const toolbar = document.querySelector('#vercel-live-feedback, [data-vercel-toolbar], iframe[src*="vercel.com/toolbar"]');
                        if (toolbar) {
                          toolbar.remove();
                        }
                      };
                      removeToolbar();
                      if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', removeToolbar);
                      }
                      setInterval(removeToolbar, 1000);
                    }
                  }
                })();
              `,
            }}
          />
        </head>
        <body className={`${inter.variable} ${sourceCodePro.variable}`}>
          <SafeArea>{children}</SafeArea>
        </body>
      </html>
    </RootProvider>
  );
}
