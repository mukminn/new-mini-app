import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.ogDescription || minikitConfig.miniapp.description,
    openGraph: {
      title: minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name,
      description: minikitConfig.miniapp.ogDescription || minikitConfig.miniapp.description,
      images: minikitConfig.miniapp.ogImageUrl ? [minikitConfig.miniapp.ogImageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "fc:frame": JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Join the ${minikitConfig.miniapp.name} Waitlist`,
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
