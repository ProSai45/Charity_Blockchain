import StatusBadge from "@/components/StatusBadge";
import { shortenAddress } from "@/utils/chain";

function WalletConnector({ wallet }) {
  const {
    account,
    connectWallet,
    hasProvider,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    walletError,
  } = wallet;

  return (
    <aside className="wallet-card">
      <div className="wallet-card__status">
        <StatusBadge
          variant={isConnected ? (isCorrectNetwork ? "success" : "warning") : "neutral"}
        >
          {isConnected ? "Wallet connected" : "Wallet not connected"}
        </StatusBadge>
        {isConnected ? (
          <StatusBadge variant={isCorrectNetwork ? "success" : "warning"}>
            {isCorrectNetwork ? "Ganache ready" : "Wrong network"}
          </StatusBadge>
        ) : null}
      </div>

      <div>
        <div className="section-label">Wallet</div>
        <p className="muted">
          Connect MetaMask now so the app can detect the Ganache network and read the deployed
          contract.
        </p>
      </div>

      <div className="wallet-card__address">{shortenAddress(account)}</div>

      <button
        className="button"
        type="button"
        onClick={connectWallet}
        disabled={!hasProvider || isConnecting}
      >
        {hasProvider ? (isConnecting ? "Connecting..." : "Connect MetaMask") : "MetaMask missing"}
      </button>

      {walletError ? <div className="badge badge--danger">{walletError}</div> : null}
    </aside>
  );
}

export default WalletConnector;
