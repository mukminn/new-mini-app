"use client";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { base, mainnet, arbitrum, optimism, polygon } from "wagmi/chains";
import styles from "./page.module.css";

// Popular tokens across all chains
const TOKENS = {
  ETH: { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
  USDC: { symbol: "USDC", name: "USD Coin", address: "native", decimals: 6 },
  USDT: { symbol: "USDT", name: "Tether USD", address: "native", decimals: 6 },
  DAI: { symbol: "DAI", name: "Dai Stablecoin", address: "native", decimals: 18 },
  WBTC: { symbol: "WBTC", name: "Wrapped Bitcoin", address: "native", decimals: 8 },
  WETH: { symbol: "WETH", name: "Wrapped Ether", address: "native", decimals: 18 },
};

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
  const { switchChain } = useSwitchChain();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [fromToken, setFromToken] = useState(TOKENS.ETH);
  const [toToken, setToToken] = useState(TOKENS.USDC);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
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

  // Calculate swap amount (simplified - in production use Uniswap API)
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const rate = fromToken.symbol === "ETH" && toToken.symbol === "USDC" ? 2500 : 
                   fromToken.symbol === "USDC" && toToken.symbol === "ETH" ? 0.0004 :
                   fromToken.symbol === "USDT" && toToken.symbol === "USDC" ? 1 : 1;
      const calculated = (parseFloat(fromAmount) * rate).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      return;
    }

    // Switch chain if needed
    if (chainId !== selectedChain.id) {
      switchChain({ chainId: selectedChain.id });
      return;
    }

    // Open Uniswap with pre-filled parameters
    const fromAddress = fromToken.address === "0x0000000000000000000000000000000000000000" ? "ETH" : fromToken.address;
    const toAddress = toToken.address === "0x0000000000000000000000000000000000000000" ? "ETH" : toToken.address;
    const uniswapUrl = `https://app.uniswap.org/swap?chain=${selectedChain.url}&inputCurrency=${fromAddress}&outputCurrency=${toAddress}&amount=${fromAmount}`;
    window.open(uniswapUrl, "_blank");
  };

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Swap Tokens</h1>
        <p className={styles.subtitle}>Trade any token on Uniswap</p>
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
      <button onClick={toggleDarkMode} className={styles.themeToggle} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* Chain Selection */}
      <div className={styles.chainSection}>
        <label className={styles.chainLabel}>Network</label>
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

      {/* Swap Card */}
      <div className={styles.swapCard}>
        <div className={styles.inputSection}>
          <label className={styles.label}>From</label>
          <div className={styles.tokenInput}>
            <input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className={styles.amountInput}
            />
            <select
              value={fromToken.symbol}
              onChange={(e) => {
                const token = Object.values(TOKENS).find((t) => t.symbol === e.target.value);
                if (token) setFromToken(token);
              }}
              className={styles.tokenSelect}
            >
              {Object.values(TOKENS).map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={swapTokens} className={styles.swapButton} title="Swap tokens">
          ⇅
        </button>

        <div className={styles.inputSection}>
          <label className={styles.label}>To</label>
          <div className={styles.tokenInput}>
            <input
              type="text"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className={styles.amountInput}
            />
            <select
              value={toToken.symbol}
              onChange={(e) => {
                const token = Object.values(TOKENS).find((t) => t.symbol === e.target.value);
                if (token) setToToken(token);
              }}
              className={styles.tokenSelect}
            >
              {Object.values(TOKENS).map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          className={styles.swapActionButton}
        >
          {!isConnected ? "Connect Wallet to Swap" : chainId !== selectedChain.id ? `Switch to ${selectedChain.name}` : "Swap on Uniswap"}
        </button>

        <div className={styles.infoBox}>
          <p>💡 This will open Uniswap in a new tab to complete your swap</p>
          <p>🔗 <a href={`https://app.uniswap.org/swap?chain=${selectedChain.url}`} target="_blank" rel="noopener noreferrer" className={styles.link}>Visit Uniswap directly</a></p>
        </div>
      </div>
    </div>
  );
}
