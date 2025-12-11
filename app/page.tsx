"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import styles from "./page.module.css";

interface Accomplishment {
  id: string;
  text: string;
  emoji: string;
  createdAt: number;
}

const EMOJI_OPTIONS = ["🎉", "🔥", "💪", "✨", "🚀", "⭐", "💯", "🎯", "🏆", "❤️"];

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>([]);
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true");
      document.documentElement.classList.toggle("dark", savedDarkMode === "true");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  // Load accomplishments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("accomplishments");
    if (saved) {
      try {
        setAccomplishments(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading accomplishments:", e);
      }
    }
  }, []);

  // Save accomplishments to localStorage
  useEffect(() => {
    if (accomplishments.length > 0 || localStorage.getItem("accomplishments")) {
      localStorage.setItem("accomplishments", JSON.stringify(accomplishments));
    }
  }, [accomplishments]);

  const handleAdd = () => {
    if (!inputText.trim()) return;

    const newAccomplishment: Accomplishment = {
      id: Date.now().toString(),
      text: inputText.trim(),
      emoji: "✨",
      createdAt: Date.now(),
    };

    setAccomplishments([newAccomplishment, ...accomplishments]);
    setInputText("");
  };

  const handleEmojiChange = (id: string, emoji: string) => {
    setAccomplishments(
      accomplishments.map((acc) => (acc.id === id ? { ...acc, emoji } : acc))
    );
  };

  const handleDelete = (id: string) => {
    setAccomplishments(accomplishments.filter((acc) => acc.id !== id));
  };

  const handleEdit = (id: string) => {
    const accomplishment = accomplishments.find((acc) => acc.id === id);
    if (accomplishment) {
      setEditingId(id);
      setEditText(accomplishment.text);
    }
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;

    setAccomplishments(
      accomplishments.map((acc) =>
        acc.id === id ? { ...acc, text: editText.trim() } : acc
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      <div className={styles.walletSection}>
        {!isConnected ? (
          <button 
            onClick={() => connect({ connector: connectors[0] })}
            className={styles.connectButton}
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className={styles.walletInfo}>
              <p>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            </div>
            <button 
              onClick={() => disconnect()}
              className={styles.disconnectButton}
            >
              Disconnect
            </button>
          </>
        )}
      </div>
      <button 
        onClick={toggleDarkMode} 
        className={styles.themeToggle}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
      {accomplishments.length === 0 && (
        <div className={styles.emptyState}>
          <p>No accomplishments yet. Start adding your wins! 🚀</p>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            What Did You Accomplish?
          </h1>
          <p className={styles.subtitle}>
            Hey {context?.user?.displayName || "there"}! Track your wins and celebrate your progress 🎯
          </p>
        </div>

        <div className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="What did you accomplish today?"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              className={styles.input}
            />
            <button onClick={handleAdd} className={styles.addButton}>
              Add
            </button>
          </div>
        </div>

        <div className={styles.listSection}>
          {accomplishments.length > 0 && (
            <div className={styles.accomplishmentsList}>
              {accomplishments.map((acc) => (
                <div key={acc.id} className={styles.accomplishmentCard}>
                  {editingId === acc.id ? (
                    <div className={styles.editMode}>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEdit(acc.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className={styles.editInput}
                        autoFocus
                      />
                      <div className={styles.editActions}>
                        <button
                          onClick={() => handleSaveEdit(acc.id)}
                          className={styles.saveButton}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.cardContent}>
                        <span className={styles.emojiDisplay}>{acc.emoji}</span>
                        <p className={styles.accomplishmentText}>{acc.text}</p>
                      </div>
                      <div className={styles.cardActions}>
                        <div className={styles.emojiSelector}>
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleEmojiChange(acc.id, emoji)}
                              className={`${styles.emojiButton} ${
                                acc.emoji === emoji ? styles.emojiButtonActive : ""
                              }`}
                              title={`React with ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleEdit(acc.id)}
                            className={styles.editButton}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(acc.id)}
                            className={styles.deleteButton}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
