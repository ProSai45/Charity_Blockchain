import { useCallback, useEffect, useState } from "react";
import { fetchCampaignDetail } from "@/utils/campaigns";
import { contractConfig } from "@/utils/contractConfig";

const initialState = {
  campaign: null,
  donations: [],
  updates: [],
};

export default function useCampaignDetail({ campaignId, provider, isCorrectNetwork }) {
  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!provider || !contractConfig.address || !isCorrectNetwork || !campaignId) {
      setData(initialState);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      setData(await fetchCampaignDetail(provider, campaignId));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load campaign detail.");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, isCorrectNetwork, provider]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...data, error, isLoading, refresh };
}
