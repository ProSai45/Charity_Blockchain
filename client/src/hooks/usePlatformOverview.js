import { useCallback, useEffect, useState } from "react";
import { Contract } from "ethers";
import { contractConfig } from "@/utils/contractConfig";

const initialState = {
  campaignCount: null,
  contractOwner: "",
  currentRole: "visitor",
  isVerifier: false,
  lastUpdatedAt: "",
};

export default function usePlatformOverview({ account, isCorrectNetwork, provider }) {
  const [overview, setOverview] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!provider || !contractConfig.address || !isCorrectNetwork) {
      setOverview(initialState);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const contract = new Contract(contractConfig.address, contractConfig.abi, provider);
      const [campaignCount, contractOwner] = await Promise.all([
        contract.getCampaignCount(),
        contract.owner(),
      ]);

      let isVerifier = false;
      if (account) {
        isVerifier = await contract.verifiers(account);
      }

      const currentRole =
        account && contractOwner.toLowerCase() === account.toLowerCase()
          ? "owner-admin"
          : isVerifier
            ? "verifier"
            : account
              ? "donor"
              : "visitor";

      setOverview({
        campaignCount: Number(campaignCount),
        contractOwner,
        currentRole,
        isVerifier,
        lastUpdatedAt: new Date().toLocaleTimeString(),
      });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to read contract overview.");
    } finally {
      setIsLoading(false);
    }
  }, [account, isCorrectNetwork, provider]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    error,
    isLoading,
    overview,
    refresh,
  };
}
