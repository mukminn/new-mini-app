import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../minikit.config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const manifest = withValidManifest(minikitConfig);
    
    return NextResponse.json(manifest, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch {
    // Return a valid manifest structure even on error
    const fallbackManifest = {
      accountAssociation: {
        header: "",
        payload: "",
        signature: ""
      },
      miniapp: {
        version: "1",
        name: "Swap Tokens",
        description: "Trade any token on any chain - Powered by Uniswap",
        iconUrl: "https://ber4mins.vercel.app/blue-icon.png",
        splashImageUrl: "https://ber4mins.vercel.app/blue-hero.png",
        splashBackgroundColor: "#000000",
        homeUrl: "https://ber4mins.vercel.app",
        subtitle: "Trade Any Token on Any Chain",
        screenshotUrls: ["https://ber4mins.vercel.app/screenshot-portrait.png"],
        heroImageUrl: "https://ber4mins.vercel.app/blue-hero.png",
        tagline: "Swap any token on any chain",
        webhookUrl: "https://ber4mins.vercel.app/api/webhook",
        primaryCategory: "finance",
        tags: ["swap", "trading", "defi", "uniswap", "tokens"],
        ogTitle: "Swap Tokens - Trade Any Token on Any Chain",
        ogDescription: "Trade any token on any chain - Powered by Uniswap",
        ogImageUrl: "https://ber4mins.vercel.app/blue-hero.png",
      }
    };
    
    return NextResponse.json(fallbackManifest, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
