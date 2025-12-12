"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
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

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  // Build Uniswap Interface URL with theme
  const uniswapUrl = `https://app.uniswap.org/swap?theme=${isDarkMode ? "dark" : "light"}`;

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Swap Tokens</h1>
        <p className={styles.subtitle}>Trade any token on any chain - Powered by Uniswap</p>
      </div>

      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode} 
        className={styles.themeToggle} 
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* Uniswap Interface Embed */}
      <div className={styles.uniswapContainer}>
        <iframe
          key={isDarkMode}
          src={uniswapUrl}
          className={styles.uniswapIframe}
          title="Uniswap Swap Interface"
          allow="clipboard-read; clipboard-write; payment"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}
