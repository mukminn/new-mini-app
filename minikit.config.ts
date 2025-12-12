// Get the root URL - use default production URL
const getRootUrl = () => {
  // Default production URL
  const DEFAULT_URL = 'https://ber4mins.vercel.app';
  
  // In production, prefer NEXT_PUBLIC_URL if set
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  
  // Fallback to Vercel URL if available
  if (process.env.VERCEL_URL && process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Use default production URL
  return DEFAULT_URL;
};

const ROOT_URL = getRootUrl();

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
    // Required fields
    version: "1",
    name: "Swap Tokens",
    description: "Trade any token on any chain - Powered by Uniswap. Swap tokens directly from your Base App.",
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    
    // Additional required/recommended fields
    subtitle: "Trade Any Token on Any Chain",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    tagline: "Swap any token on any chain",
    
    // Webhook and category
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["swap", "trading", "defi", "uniswap", "tokens"],
    
    // OpenGraph metadata
    ogTitle: "Swap Tokens - Trade Any Token on Any Chain",
    ogDescription: "Trade any token on any chain - Powered by Uniswap. Swap tokens directly from your Base App.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;

