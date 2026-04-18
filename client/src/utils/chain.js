export function normalizeChainId(chainId) {
  if (chainId === null || chainId === undefined) {
    return null;
  }

  if (typeof chainId === "number") {
    return chainId;
  }

  if (typeof chainId === "bigint") {
    return Number(chainId);
  }

  if (typeof chainId === "string") {
    return chainId.startsWith("0x") ? Number.parseInt(chainId, 16) : Number(chainId);
  }

  return null;
}

export function formatChainLabel(chainId) {
  const normalized = normalizeChainId(chainId);
  if (!normalized) {
    return "Unknown network";
  }

  return `Chain ID ${normalized}`;
}

export function shortenAddress(address) {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
