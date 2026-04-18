import StatusBadge from "@/components/StatusBadge";
import { formatChainLabel } from "@/utils/chain";
import { SUPPORTED_CHAIN_NAME } from "@/utils/contractConfig";

function NetworkBanner({ wallet }) {
  const { chainId, hasProvider, isConnected, isCorrectNetwork } = wallet;

  let className = "network-banner";
  let message = "Connect a wallet to verify the Ganache network and unlock contract reads.";

  if (!hasProvider) {
    className += " network-banner--danger";
    message = "MetaMask is not available in this browser, so wallet-based reads and writes are disabled.";
  } else if (isConnected && !isCorrectNetwork) {
    className += " network-banner--warning";
    message = `Switch MetaMask to ${SUPPORTED_CHAIN_NAME} before using platform actions.`;
  } else if (isConnected && isCorrectNetwork) {
    message = "Connected to the expected Ganache network. Contract reads are enabled.";
  }

  return (
    <section className={className}>
      <div>
        <div className="section-label">Network status</div>
        <p className="muted">{message}</p>
      </div>
      <StatusBadge variant={isConnected ? (isCorrectNetwork ? "success" : "warning") : "neutral"}>
        {isConnected ? formatChainLabel(chainId) : "Awaiting wallet"}
      </StatusBadge>
    </section>
  );
}

export default NetworkBanner;
