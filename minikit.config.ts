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
    name: "Accomplish", 
    subtitle: "Track Your Wins", 
    description: "A simple and beautiful way to track your daily accomplishments and celebrate your progress with emoji reactions.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["productivity", "tracking", "goals", "achievements"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "What did you accomplish today?",
    ogTitle: "Accomplish - Track Your Daily Wins",
    ogDescription: "Track your accomplishments and celebrate your progress with emoji reactions.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;

