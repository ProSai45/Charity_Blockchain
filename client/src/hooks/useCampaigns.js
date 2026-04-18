import { useCallback, useEffect, useState } from "react";
import { fetchCampaigns } from "@/utils/campaigns";
import { contractConfig } from "@/utils/contractConfig";

export default function useCampaigns({ provider, isCorrectNetwork }) {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!provider || !contractConfig.address || !isCorrectNetwork) {
      setCampaigns([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      setCampaigns(await fetchCampaigns(provider));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load campaigns.");
    } finally {
      setIsLoading(false);
    }
  }, [isCorrectNetwork, provider]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { campaigns, error, isLoading, refresh };
}
