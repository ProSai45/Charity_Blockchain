import { useCallback, useEffect, useState } from "react";
import { fetchCampaignById, fetchDonationsByDonor } from "@/utils/campaigns";
import { contractConfig } from "@/utils/contractConfig";

const initialState = {
  donations: [],
  campaignsById: {},
};

export default function useDonorDashboard({ account, provider, isCorrectNetwork }) {
  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!provider || !contractConfig.address || !isCorrectNetwork || !account) {
      setData(initialState);
      setError("");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const donations = await fetchDonationsByDonor(provider, account);
      const uniqueCampaignIds = [...new Set(donations.map((donation) => donation.campaignId))];
      const campaigns = await Promise.all(
        uniqueCampaignIds.map((campaignId) => fetchCampaignById(provider, campaignId))
      );

      setData({
        donations,
        campaignsById: Object.fromEntries(campaigns.map((campaign) => [campaign.id, campaign])),
      });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load donor activity.");
    } finally {
      setIsLoading(false);
    }
  }, [account, isCorrectNetwork, provider]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...data, error, isLoading, refresh };
}
