"use client";
import { useState, useEffect, useMemo } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { base, mainnet, arbitrum, optimism, polygon } from "wagmi/chains";
import { parseUnits, formatUnits, Address, maxUint256 } from "viem";
import { erc20Abi } from "viem";
import styles from "./page.module.css";

// Uniswap Universal Router addresses
const UNIVERSAL_ROUTER: Record<number, Address> = {
  [mainnet.id]: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD" as Address,
  [base.id]: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD" as Address,
  [arbitrum.id]: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD" as Address,
  [optimism.id]: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD" as Address,
  [polygon.id]: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD" as Address,
};

// Common token addresses with decimals
const TOKEN_INFO: Record<number, Record<string, { address: Address; decimals: number; symbol: string }>> = {
  [mainnet.id]: {
    ETH: { address: "0x0000000000000000000000000000000000000000" as Address, decimals: 18, symbol: "ETH" },
    USDC: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address, decimals: 6, symbol: "USDC" },
    USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address, decimals: 6, symbol: "USDT" },
    DAI: { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address, decimals: 18, symbol: "DAI" },
    WBTC: { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as Address, decimals: 8, symbol: "WBTC" },
    WETH: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address, decimals: 18, symbol: "WETH" },
  },
  [base.id]: {
    ETH: { address: "0x0000000000000000000000000000000000000000" as Address, decimals: 18, symbol: "ETH" },
    USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address, decimals: 6, symbol: "USDC" },
    DAI: { address: "0x50c5725949A6F0c72E6C4a641F24049A917E0C6A" as Address, decimals: 18, symbol: "DAI" },
    WETH: { address: "0x4200000000000000000000000000000000000006" as Address, decimals: 18, symbol: "WETH" },
  },
  [arbitrum.id]: {
    ETH: { address: "0x0000000000000000000000000000000000000000" as Address, decimals: 18, symbol: "ETH" },
    USDC: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" as Address, decimals: 6, symbol: "USDC" },
    USDT: { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" as Address, decimals: 6, symbol: "USDT" },
    WETH: { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" as Address, decimals: 18, symbol: "WETH" },
  },
  [optimism.id]: {
    ETH: { address: "0x0000000000000000000000000000000000000000" as Address, decimals: 18, symbol: "ETH" },
    USDC: { address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85" as Address, decimals: 6, symbol: "USDC" },
    WETH: { address: "0x4200000000000000000000000000000000000006" as Address, decimals: 18, symbol: "WETH" },
  },
  [polygon.id]: {
    ETH: { address: "0x0000000000000000000000000000000000000000" as Address, decimals: 18, symbol: "ETH" },
    USDC: { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" as Address, decimals: 6, symbol: "USDC" },
    USDT: { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" as Address, decimals: 6, symbol: "USDT" },
    WETH: { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" as Address, decimals: 18, symbol: "WETH" },
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
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Get available tokens for current chain
  const availableTokens = useMemo(() => {
    return TOKEN_INFO[selectedChain.id] || TOKEN_INFO[base.id];
  }, [selectedChain.id]);

  // Check token allowance
  const fromTokenInfo = availableTokens[fromToken];
  const needsApproval = fromTokenInfo && fromTokenInfo.address !== "0x0000000000000000000000000000000000000000";

  const { data: allowance } = useReadContract({
    address: fromTokenInfo?.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && fromTokenInfo?.address ? [address, UNIVERSAL_ROUTER[selectedChain.id]] : undefined,
    enabled: needsApproval && isConnected && !!address && !!fromTokenInfo?.address,
  });

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
      setError(null);
      try {
        // In production, fetch real quote from Uniswap API
        // For now, using approximate rate
        const rate = fromToken === "ETH" && toToken === "USDC" ? 2500 : 
                     fromToken === "USDC" && toToken === "ETH" ? 0.0004 :
                     fromToken === "USDT" && toToken === "USDC" ? 1 : 1;
        
        const calculated = (parseFloat(fromAmount) * rate).toFixed(6);
        setToAmount(calculated);
      } catch (error) {
        console.error("Error fetching quote:", error);
        setError("Failed to fetch quote");
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const timeoutId = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fromAmount, fromToken, toToken, availableTokens]);

  const handleApprove = async () => {
    if (!isConnected || !fromTokenInfo || !address) return;

    try {
      writeContract({
        address: fromTokenInfo.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [UNIVERSAL_ROUTER[selectedChain.id], maxUint256],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    }
  };

  const handleSwap = async () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError("Please enter an amount");
      return;
    }

    if (chainId !== selectedChain.id) {
      switchChain({ chainId: selectedChain.id });
      return;
    }

    setError(null);

    // For now, open Uniswap with pre-filled parameters
    // In production, implement actual swap using Universal Router
    const fromAddress = fromTokenInfo?.address === "0x0000000000000000000000000000000000000000" ? "ETH" : fromTokenInfo?.address;
    const toAddress = availableTokens[toToken]?.address === "0x0000000000000000000000000000000000000000" ? "ETH" : availableTokens[toToken]?.address;
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
  const needsTokenApproval = needsApproval && allowance !== undefined && fromAmount && 
    parseFloat(fromAmount) > 0 && 
    allowance < parseUnits(fromAmount, fromTokenInfo?.decimals || 18);

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

        {error && <div className={styles.errorBox}>{error}</div>}

        {needsTokenApproval && isConnected && (
          <button
            onClick={handleApprove}
            disabled={isPending}
            className={styles.approveButton}
          >
            {isPending ? "Approving..." : `Approve ${fromToken}`}
          </button>
        )}

        <button
          onClick={handleSwap}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoadingQuote || isPending || isConfirming}
          className={styles.swapActionButton}
        >
          {!isConnected 
            ? "Connect Wallet to Swap" 
            : chainId !== selectedChain.id 
            ? `Switch to ${selectedChain.name}` 
            : isPending || isConfirming
            ? "Processing..."
            : "Swap on Uniswap"}
        </button>

        {isSuccess && hash && (
          <div className={styles.successBox}>
            <p>✅ Transaction submitted!</p>
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              View on Explorer
            </a>
          </div>
        )}

        <div className={styles.infoBox}>
          <p>💡 This will open Uniswap in a new tab to complete your swap</p>
          <p>🔗 <a href={`https://app.uniswap.org/swap?chain=${selectedChain.url}`} target="_blank" rel="noopener noreferrer" className={styles.link}>Visit Uniswap directly</a></p>
        </div>
      </div>
    </div>
  );
}
