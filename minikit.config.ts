// Default production URL - always use this
const ROOT_URL = 'https://new-mini-app-delta.vercel.app';

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    // Identity & Launch (Required)
    version: "1",
    name: "Swap Tokens",
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    
    // Loading Experience (Required)
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    
    // Discovery & Search (Required)
    primaryCategory: "finance",
    tags: ["swap", "trading", "defi", "uniswap", "tokens"],
    noindex: false, // Set to true for development/staging
    
    // Display Information (Optional but recommended)
    subtitle: "Trade Any Token", // Max 30 chars
    description: "Trade any token on any chain - Powered by Uniswap. Swap tokens directly from your Base App.", // Max 170 chars
    tagline: "Swap instantly", // Max 30 chars
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    
    // Embeds & Social Sharing (Optional)
    ogTitle: "Swap Tokens", // Max 30 chars
    ogDescription: "Trade any token on any chain - Powered by Uniswap", // Max 100 chars
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
    
    // Notifications (Optional - only if using notifications)
    // webhookUrl: `${ROOT_URL}/api/webhook`, // Commented out if not using notifications
  },
} as const;

