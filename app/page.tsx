"use client";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { base, mainnet, arbitrum, optimism, polygon } from "wagmi/chains";
import styles from "./page.module.css";

const CHAINS = [
  { id: base.id, name: "Base", url: "base" },
  { id: mainnet.id, name: "Ethereum", url: "ethereum" },
  { id: arbitrum.id, name: "Arbitrum", url: "arbitrum" },
  { id: optimism.id, name: "Optimism", url: "optimism" },
  { id: polygon.id, name: "Polygon", url: "polygon" },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true");
      document.documentElement.classList.toggle("dark", savedDarkMode === "true");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  // Update selected chain based on connected chain
  useEffect(() => {
    const currentChain = CHAINS.find((c) => c.id === chainId);
    if (currentChain) {
      setSelectedChain(currentChain);
    }
  }, [chainId]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  // Build Uniswap iframe URL with current chain
  const uniswapIframeUrl = `https://app.uniswap.org/swap?chain=${selectedChain.url}&theme=${isDarkMode ? "dark" : "light"}`;

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Swap Tokens</h1>
        <p className={styles.subtitle}>Trade any token on any chain - Powered by Uniswap</p>
      </div>

      {/* Wallet Section */}
      <div className={styles.walletSection}>
        {!isConnected ? (
          <button onClick={() => connect({ connector: connectors[0] })} className={styles.connectButton}>
            Connect Wallet
          </button>
        ) : (
          <>
            <div className={styles.walletInfo}>
              <p>{address?.slice(0, 6)}...{address?.slice(-4)}</p>
            </div>
            <button onClick={() => disconnect()} className={styles.disconnectButton}>
              Disconnect
            </button>
          </>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode} 
        className={styles.themeToggle} 
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* Chain Selection */}
      <div className={styles.chainSection}>
        <label className={styles.chainLabel}>Select Network</label>
        <select
          value={selectedChain.id}
          onChange={(e) => {
            const chain = CHAINS.find((c) => c.id === Number(e.target.value));
            if (chain) setSelectedChain(chain);
          }}
          className={styles.chainSelect}
        >
          {CHAINS.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>

      {/* Uniswap Interface Embed */}
      <div className={styles.uniswapContainer}>
        <iframe
          src={uniswapIframeUrl}
          className={styles.uniswapIframe}
          title="Uniswap Swap Interface"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
