import { useEffect, useMemo, useState } from "react";
import { BrowserProvider } from "ethers";
import { normalizeChainId } from "@/utils/chain";
import { SUPPORTED_CHAIN_ID } from "@/utils/contractConfig";

function getEthereum() {
  return typeof window !== "undefined" ? window.ethereum : undefined;
}

export default function useWallet() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState("");

  const hasProvider = Boolean(getEthereum());
  const provider = useMemo(() => {
    if (!hasProvider) {
      return null;
    }

    return new BrowserProvider(getEthereum());
  }, [hasProvider]);

  useEffect(() => {
    if (!hasProvider) {
      return undefined;
    }

    const ethereum = getEthereum();

    async function syncWalletState() {
      try {
        const [accounts, currentChainId] = await Promise.all([
          ethereum.request({ method: "eth_accounts" }),
          ethereum.request({ method: "eth_chainId" }),
        ]);

        setAccount(accounts?.[0] || "");
        setChainId(normalizeChainId(currentChainId));
      } catch (error) {
        setWalletError(error instanceof Error ? error.message : "Unable to read wallet state.");
      }
    }

    syncWalletState();

    function handleAccountsChanged(accounts) {
      setAccount(accounts?.[0] || "");
    }

    function handleChainChanged(nextChainId) {
      setChainId(normalizeChainId(nextChainId));
    }

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [hasProvider]);

  async function connectWallet() {
    if (!hasProvider) {
      setWalletError("MetaMask was not detected in this browser.");
      return;
    }

    setIsConnecting(true);
    setWalletError("");

    try {
      const ethereum = getEthereum();
      const [accounts, nextChainId] = await Promise.all([
        ethereum.request({ method: "eth_requestAccounts" }),
        ethereum.request({ method: "eth_chainId" }),
      ]);

      setAccount(accounts?.[0] || "");
      setChainId(normalizeChainId(nextChainId));
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Wallet connection failed.");
    } finally {
      setIsConnecting(false);
    }
  }

  return {
    account,
    chainId,
    connectWallet,
    hasProvider,
    isConnected: Boolean(account),
    isConnecting,
    isCorrectNetwork: chainId === SUPPORTED_CHAIN_ID,
    provider,
    walletError,
  };
}
