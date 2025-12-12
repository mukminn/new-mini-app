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
    // Return a valid manifest structure even on error (following Base documentation)
    const fallbackManifest = {
      accountAssociation: {
        header: "",
        payload: "",
        signature: ""
      },
      miniapp: {
        // Identity & Launch (Required)
        version: "1",
        name: "Swap Tokens",
        homeUrl: "https://new-mini-app-delta.vercel.app",
        iconUrl: "https://new-mini-app-delta.vercel.app/blue-icon.png",
        
        // Loading Experience (Required)
        splashImageUrl: "https://new-mini-app-delta.vercel.app/blue-hero.png",
        splashBackgroundColor: "#000000",
        
        // Discovery & Search (Required)
        primaryCategory: "finance",
        tags: ["swap", "trading", "defi", "uniswap", "tokens"],
        noindex: false,
        
        // Display Information
        subtitle: "Trade Any Token",
        description: "Trade any token on any chain - Powered by Uniswap",
        tagline: "Swap instantly",
        heroImageUrl: "https://new-mini-app-delta.vercel.app/blue-hero.png",
        screenshotUrls: ["https://new-mini-app-delta.vercel.app/screenshot-portrait.png"],
        
        // Embeds & Social Sharing
        ogTitle: "Swap Tokens",
        ogDescription: "Trade any token on any chain - Powered by Uniswap",
        ogImageUrl: "https://new-mini-app-delta.vercel.app/blue-hero.png",
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
