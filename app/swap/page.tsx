"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { base } from "wagmi/chains";
import styles from "./page.module.css";
import Link from "next/link";

// Common tokens on Base
const TOKENS = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917E0C6A",
    decimals: 18,
  },
};

export default function SwapPage() {
  const { isConnected, chainId } = useAccount();
  const [fromToken, setFromToken] = useState(TOKENS.ETH);
  const [toToken, setToToken] = useState(TOKENS.USDC);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch price quote from Uniswap (simplified - using mock rate)
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      // In production, fetch real quote from Uniswap API
      // For now, using approximate rate
      const rate = fromToken.symbol === "ETH" && toToken.symbol === "USDC" ? 2500 : 0.0004;
      const calculated = (parseFloat(fromAmount) * rate).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError("Please enter an amount");
      return;
    }

    if (chainId !== base.id) {
      setError("Please switch to Base network");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // In production, this would use Uniswap Router contract
      // For demo, we'll create a link to Uniswap
      const uniswapUrl = `https://app.uniswap.org/swap?chain=base&inputCurrency=${fromToken.address}&outputCurrency=${toToken.address}&amount=${fromAmount}`;
      window.open(uniswapUrl, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Swap failed");
    } finally {
      setIsLoading(false);
    }
  };

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back
        </Link>
        <h1 className={styles.title}>Swap Tokens</h1>
        <p className={styles.subtitle}>Trade tokens on Uniswap</p>
      </div>

      {!isConnected && (
        <div className={styles.warningBox}>
          <p>⚠️ Please connect your wallet to swap tokens</p>
        </div>
      )}

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
              disabled={!isConnected}
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
          <p className={styles.tokenName}>{fromToken.name}</p>
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
          <p className={styles.tokenName}>{toToken.name}</p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <button
          onClick={handleSwap}
          disabled={!isConnected || isLoading || !fromAmount || parseFloat(fromAmount) <= 0}
          className={styles.swapActionButton}
        >
          {isLoading ? "Processing..." : "Open in Uniswap"}
        </button>

        <div className={styles.infoBox}>
          <p>💡 This will open Uniswap in a new tab to complete your swap</p>
          <p>🔗 <a href="https://app.uniswap.org/swap?chain=base" target="_blank" rel="noopener noreferrer" className={styles.link}>Visit Uniswap directly</a></p>
        </div>
      </div>

    </div>
  );
}

