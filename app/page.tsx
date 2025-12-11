"use client";
import { useState, useEffect, useMemo } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { base, mainnet, arbitrum, optimism, polygon } from "wagmi/chains";
import { Address } from "viem";
import styles from "./page.module.css";

// Common token addresses
const TOKEN_ADDRESSES: Record<number, Record<string, Address>> = {
  [mainnet.id]: {
    ETH: "0x0000000000000000000000000000000000000000" as Address,
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address,
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address,
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address,
    WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as Address,
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address,
  },
  [base.id]: {
    ETH: "0x0000000000000000000000000000000000000000" as Address,
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address,
    DAI: "0x50c5725949A6F0c72E6C4a641F24049A917E0C6A" as Address,
    WETH: "0x4200000000000000000000000000000000000006" as Address,
  },
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
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Get available tokens for current chain
  const availableTokens = useMemo(() => {
    return TOKEN_ADDRESSES[selectedChain.id] || TOKEN_ADDRESSES[base.id];
  }, [selectedChain.id]);

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

  // Fetch quote from Uniswap API
  useEffect(() => {
    const fetchQuote = async () => {
      if (!fromAmount || parseFloat(fromAmount) <= 0 || !fromToken || !toToken) {
        setToAmount("");
        return;
      }

      setIsLoadingQuote(true);
      try {
        // For demo, using approximate rate (in production, use Uniswap API)
        const rate = fromToken === "ETH" && toToken === "USDC" ? 2500 : 
                     fromToken === "USDC" && toToken === "ETH" ? 0.0004 :
                     fromToken === "USDT" && toToken === "USDC" ? 1 : 1;
        
        const calculated = (parseFloat(fromAmount) * rate).toFixed(6);
        setToAmount(calculated);
      } catch (error) {
        console.error("Error fetching quote:", error);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const timeoutId = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fromAmount, fromToken, toToken, availableTokens]);

  const handleSwap = async () => {
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

    // Open Uniswap with pre-filled parameters for actual swap
    const fromAddress = availableTokens[fromToken] === "0x0000000000000000000000000000000000000000" ? "ETH" : availableTokens[fromToken];
    const toAddress = availableTokens[toToken] === "0x0000000000000000000000000000000000000000" ? "ETH" : availableTokens[toToken];
    const uniswapUrl = `https://app.uniswap.org/swap?chain=${selectedChain.url}&inputCurrency=${fromAddress}&outputCurrency=${toAddress}&amount=${fromAmount}`;
    window.open(uniswapUrl, "_blank");
  };

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const tokenOptions = Object.keys(availableTokens);

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
              step="any"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className={styles.tokenSelect}
            >
              {tokenOptions.map((token) => (
                <option key={token} value={token}>
                  {token}
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
              value={isLoadingQuote ? "Loading..." : toAmount}
              readOnly
              className={styles.amountInput}
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className={styles.tokenSelect}
            >
              {tokenOptions.map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoadingQuote}
          className={styles.swapActionButton}
        >
          {!isConnected 
            ? "Connect Wallet to Swap" 
            : chainId !== selectedChain.id 
            ? `Switch to ${selectedChain.name}` 
            : "Swap on Uniswap"}
        </button>

        <div className={styles.infoBox}>
          <p>💡 This will open Uniswap in a new tab to complete your swap</p>
          <p>🔗 <a href={`https://app.uniswap.org/swap?chain=${selectedChain.url}`} target="_blank" rel="noopener noreferrer" className={styles.link}>Visit Uniswap directly</a></p>
        </div>
      </div>
    </div>
  );
}
