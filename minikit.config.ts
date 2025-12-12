const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

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
    version: "1",
    name: "Swap Tokens", 
    subtitle: "Trade Any Token", 
    description: "Trade any token on any chain - Powered by Uniswap. Swap tokens directly from your Base App.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["swap", "trading", "defi", "uniswap", "tokens"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "Swap any token on any chain",
    ogTitle: "Swap Tokens - Trade Any Token on Any Chain",
    ogDescription: "Trade any token on any chain - Powered by Uniswap. Swap tokens directly from your Base App.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;

