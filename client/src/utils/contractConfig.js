import { charityDonationPlatformArtifact, charityDonationPlatformAbi } from "@/abi/CharityDonationPlatformArtifact";

export const SUPPORTED_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 1337);
export const SUPPORTED_CHAIN_NAME = `Ganache Local (${SUPPORTED_CHAIN_ID})`;

function getLatestArtifactAddress() {
  const networks = charityDonationPlatformArtifact.networks || {};
  const latestNetworkId = Object.keys(networks)
    .map((networkId) => Number(networkId))
    .filter((networkId) => Number.isFinite(networkId))
    .sort((left, right) => right - left)[0];

  if (!latestNetworkId) {
    return "";
  }

  return networks[String(latestNetworkId)]?.address || "";
}

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS || getLatestArtifactAddress();

export const contractConfig = {
  abi: charityDonationPlatformAbi,
  address: CONTRACT_ADDRESS,
  supportedChainId: SUPPORTED_CHAIN_ID,
};
