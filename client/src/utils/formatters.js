import { formatEther } from "ethers";

export const campaignStatusLabels = {
  0: "Pending Verification",
  1: "Active",
  2: "Paused",
  3: "Completed",
  4: "Rejected",
};

export const campaignStatusVariants = {
  0: "warning",
  1: "success",
  2: "warning",
  3: "neutral",
  4: "danger",
};

export const verificationTierLabels = {
  0: "Unverified",
  1: "Self-Declared",
  2: "NGO-Verified",
  3: "Admin-Verified",
};

export const verificationTierVariants = {
  0: "neutral",
  1: "warning",
  2: "success",
  3: "success",
};

export const updateTypeLabels = {
  0: "General Update",
  1: "Proof of Use",
  2: "Delivery Confirmation",
  3: "Status Change",
  4: "Closure Proof",
};

export function formatEthAmount(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  try {
    return `${Number(formatEther(value)).toLocaleString(undefined, {
      maximumFractionDigits: 4,
    })} ETH`;
  } catch {
    return `${value} wei`;
  }
}

export function formatTimestamp(timestamp) {
  const numeric = Number(timestamp);
  if (!numeric) {
    return "Not set";
  }

  return new Date(numeric * 1000).toLocaleString();
}

export function formatPercent(raisedAmount, targetAmount) {
  const target = Number(targetAmount);
  const raised = Number(raisedAmount);

  if (!target || !Number.isFinite(target)) {
    return "0%";
  }

  return `${Math.min(100, Math.round((raised / target) * 100))}%`;
}

export function formatProofFreshness(timestamp) {
  const numeric = Number(timestamp);
  if (!numeric) {
    return "No updates yet";
  }

  const nowSeconds = Date.now() / 1000;
  const deltaDays = Math.floor((nowSeconds - numeric) / 86400);

  if (deltaDays <= 0) {
    return "Updated today";
  }

  return `Updated ${deltaDays} day${deltaDays === 1 ? "" : "s"} ago`;
}
