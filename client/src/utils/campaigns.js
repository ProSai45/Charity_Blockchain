import { Contract, ZeroHash, isAddress, isHexString, parseEther } from "ethers";
import { contractConfig } from "@/utils/contractConfig";

export function getPlatformContract(runner) {
  if (!contractConfig.address) {
    throw new Error("Contract address is not configured.");
  }

  return new Contract(contractConfig.address, contractConfig.abi, runner);
}

export function normalizeCampaign(rawCampaign) {
  return {
    id: Number(rawCampaign.id),
    creator: rawCampaign.creator,
    beneficiaryWallet: rawCampaign.beneficiaryWallet,
    title: rawCampaign.title,
    descriptionHash: rawCampaign.descriptionHash,
    category: rawCampaign.category,
    targetAmount: rawCampaign.targetAmount,
    raisedAmount: rawCampaign.raisedAmount,
    donationCount: Number(rawCampaign.donationCount),
    status: Number(rawCampaign.status),
    verificationTier: Number(rawCampaign.verificationTier),
    createdAt: Number(rawCampaign.createdAt),
    verifiedAt: Number(rawCampaign.verifiedAt),
    closedAt: Number(rawCampaign.closedAt),
    latestProofHash: rawCampaign.latestProofHash,
  };
}

export function normalizeCampaignUpdate(rawUpdate) {
  return {
    id: Number(rawUpdate.id),
    campaignId: Number(rawUpdate.campaignId),
    author: rawUpdate.author,
    updateType: Number(rawUpdate.updateType),
    detailsHash: rawUpdate.detailsHash,
    timestamp: Number(rawUpdate.timestamp),
  };
}

export function normalizeDonation(rawDonation) {
  return {
    id: Number(rawDonation.id),
    campaignId: Number(rawDonation.campaignId),
    donor: rawDonation.donor,
    beneficiaryWallet: rawDonation.beneficiaryWallet,
    amount: rawDonation.amount,
    timestamp: Number(rawDonation.timestamp),
  };
}

export async function fetchCampaignCount(provider) {
  const contract = getPlatformContract(provider);
  const count = await contract.getCampaignCount();
  return Number(count);
}

export async function fetchCampaigns(provider) {
  const contract = getPlatformContract(provider);
  const count = await fetchCampaignCount(provider);
  const campaigns = [];

  for (let campaignId = 1; campaignId <= count; campaignId += 1) {
    const campaign = await contract.getCampaign(campaignId);
    campaigns.push(normalizeCampaign(campaign));
  }

  return campaigns;
}

export async function fetchCampaignDetail(provider, campaignId) {
  const contract = getPlatformContract(provider);
  const [campaign, donations, updates] = await Promise.all([
    contract.getCampaign(campaignId),
    contract.getCampaignDonations(campaignId),
    contract.getCampaignUpdates(campaignId),
  ]);

  return {
    campaign: normalizeCampaign(campaign),
    donations: donations.map(normalizeDonation),
    updates: updates.map(normalizeCampaignUpdate),
  };
}

export async function fetchCampaignById(provider, campaignId) {
  const contract = getPlatformContract(provider);
  const campaign = await contract.getCampaign(campaignId);
  return normalizeCampaign(campaign);
}

export async function fetchDonationsByDonor(provider, donor) {
  const contract = getPlatformContract(provider);
  const donations = await contract.getDonationsByDonor(donor);
  return donations.map(normalizeDonation);
}

export function validateCampaignForm(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }
  if (!values.descriptionHash.trim()) {
    errors.descriptionHash = "Description hash is required.";
  }
  if (!values.category.trim()) {
    errors.category = "Category is required.";
  }
  if (!values.beneficiaryWallet.trim()) {
    errors.beneficiaryWallet = "Beneficiary wallet is required.";
  } else if (!isAddress(values.beneficiaryWallet.trim())) {
    errors.beneficiaryWallet = "Beneficiary wallet must be a valid address.";
  }
  if (!values.targetAmount.trim()) {
    errors.targetAmount = "Target amount is required.";
  } else {
    try {
      if (parseEther(values.targetAmount) <= 0n) {
        errors.targetAmount = "Target amount must be greater than zero.";
      }
    } catch {
      errors.targetAmount = "Target amount must be a valid ETH value.";
    }
  }
  if (values.proofBundleHash.trim() && values.proofBundleHash.trim().length !== 66) {
    errors.proofBundleHash = "Proof bundle hash must be a 32-byte hex string.";
  }

  return errors;
}

export function validateDonationAmount(amount) {
  if (!amount.trim()) {
    return "Donation amount is required.";
  }

  try {
    if (parseEther(amount.trim()) <= 0n) {
      return "Donation amount must be greater than zero.";
    }
  } catch {
    return "Donation amount must be a valid ETH value.";
  }

  return "";
}

export function validateBytes32Hash(value, { label = "Hash", required = false, allowZero = false } = {}) {
  const trimmed = value.trim();

  if (!trimmed) {
    return required ? `${label} is required.` : "";
  }

  if (!isHexString(trimmed, 32)) {
    return `${label} must be a 32-byte hex string.`;
  }

  if (!allowZero && trimmed === ZeroHash) {
    return `${label} cannot be the zero hash.`;
  }

  return "";
}

export async function createCampaignWithSigner(signer, values) {
  const contract = getPlatformContract(signer);
  return contract.createCampaign(
    values.title.trim(),
    values.descriptionHash.trim(),
    values.category.trim(),
    values.beneficiaryWallet.trim(),
    parseEther(values.targetAmount.trim()),
    values.proofBundleHash.trim() || ZeroHash
  );
}

export async function donateToCampaignWithSigner(signer, campaignId, amount) {
  const contract = getPlatformContract(signer);
  return contract.donateToCampaign(campaignId, {
    value: parseEther(amount.trim()),
  });
}

export async function setVerifierWithSigner(signer, verifier, allowed) {
  const contract = getPlatformContract(signer);
  return contract.setVerifier(verifier.trim(), allowed);
}

export async function approveCampaignWithSigner(signer, campaignId, verificationTier) {
  const contract = getPlatformContract(signer);
  return contract.approveCampaign(campaignId, verificationTier);
}

export async function rejectCampaignWithSigner(signer, campaignId, reasonHash) {
  const contract = getPlatformContract(signer);
  return contract.rejectCampaign(campaignId, reasonHash.trim() || ZeroHash);
}

export async function pauseCampaignWithSigner(signer, campaignId, reasonHash) {
  const contract = getPlatformContract(signer);
  return contract.pauseCampaign(campaignId, reasonHash.trim() || ZeroHash);
}

export async function resumeCampaignWithSigner(signer, campaignId) {
  const contract = getPlatformContract(signer);
  return contract.resumeCampaign(campaignId);
}

export async function addCampaignUpdateWithSigner(signer, campaignId, updateType, detailsHash) {
  const contract = getPlatformContract(signer);
  return contract.addCampaignUpdate(campaignId, updateType, detailsHash.trim());
}

export async function completeCampaignWithSigner(signer, campaignId) {
  const contract = getPlatformContract(signer);
  return contract.completeCampaign(campaignId);
}
