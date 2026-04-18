import { Link, useOutletContext } from "react-router-dom";
import InfoCard from "@/components/InfoCard";
import StatusBadge from "@/components/StatusBadge";
import useCampaigns from "@/hooks/useCampaigns";
import usePlatformOverview from "@/hooks/usePlatformOverview";
import { shortenAddress } from "@/utils/chain";
import { contractConfig, SUPPORTED_CHAIN_NAME } from "@/utils/contractConfig";
import { campaignStatusLabels, verificationTierLabels } from "@/utils/formatters";

function HomePage() {
  const { wallet } = useOutletContext();
  const { overview, isLoading, error, refresh } = usePlatformOverview(wallet);
  const { campaigns } = useCampaigns(wallet);

  return (
    <div className="info-grid">
      <InfoCard
        className="surface-card--span-8"
        title="Platform readiness"
        subtitle="This frontend now connects MetaMask, detects Ganache, reads contract overview data, and exposes live campaign browsing routes."
      >
        <div className="detail-list">
          <li>
            <span>Contract address</span>
            <span className="mono">{contractConfig.address || "Missing deployment config"}</span>
          </li>
          <li>
            <span>Connected account role</span>
            <StatusBadge variant={wallet.isCorrectNetwork ? "success" : "warning"}>
              {overview.currentRole}
            </StatusBadge>
          </li>
          <li>
            <span>Contract owner</span>
            <span className="mono">{shortenAddress(overview.contractOwner)}</span>
          </li>
          <li>
            <span>Latest refresh</span>
            <span>{overview.lastUpdatedAt || "Pending read"}</span>
          </li>
        </div>
        <div style={{ marginTop: "16px" }}>
          <button className="button button--secondary" type="button" onClick={refresh}>
            Refresh contract read
          </button>
        </div>
        {isLoading ? <p className="muted">Reading contract overview...</p> : null}
        {error ? <div className="badge badge--danger">{error}</div> : null}
      </InfoCard>

      <InfoCard
        className="surface-card--span-4"
        title="Campaign count"
        subtitle="Live contract read"
      >
        <div className="metric-value">{overview.campaignCount === null ? "—" : overview.campaignCount}</div>
        <p className="muted">
          This value comes from `getCampaignCount()` and confirms the React app can read the deployed
          Ganache contract.
        </p>
      </InfoCard>

      <InfoCard
        className="surface-card--span-6"
        title="Frontend progress"
        subtitle="Implemented through Phase 9"
      >
        <ul className="action-list">
          <li>
            <span>MetaMask connect</span>
            <StatusBadge variant={wallet.hasProvider ? "success" : "warning"}>
              {wallet.hasProvider ? "Available" : "Needs MetaMask"}
            </StatusBadge>
          </li>
          <li>
            <span>Ganache network check</span>
            <StatusBadge variant={wallet.isCorrectNetwork ? "success" : "warning"}>
              {SUPPORTED_CHAIN_NAME}
            </StatusBadge>
          </li>
          <li>
            <span>Campaign list + detail routes</span>
            <StatusBadge variant="success">Live</StatusBadge>
          </li>
          <li>
            <span>Create campaign form</span>
            <StatusBadge variant="success">Live</StatusBadge>
          </li>
          <li>
            <span>Donation flow + donor dashboard</span>
            <StatusBadge variant="success">Live</StatusBadge>
          </li>
          <li>
            <span>Verifier/admin controls</span>
            <StatusBadge variant="success">Live</StatusBadge>
          </li>
        </ul>
      </InfoCard>

      <InfoCard
        className="surface-card--span-6"
        title="Next UI phases"
        subtitle="What the current frontend foundation is preparing for"
      >
        <div className="placeholder-box">
          <p className="muted">
            Phase 10 focuses on final polish, demo packaging, Ubuntu setup clarity, and the
            end-to-end reviewer flow.
          </p>
        </div>
      </InfoCard>

      <InfoCard
        className="surface-card--span-12"
        title="Recent campaigns"
        subtitle="Live overview sourced from the same campaign listing hook used on the dedicated campaigns page."
      >
        {campaigns.length === 0 ? (
          <div className="placeholder-box">
            <p className="muted">
              No campaigns have been created on this deployment yet. Open the{" "}
              <Link to="/campaigns">campaigns page</Link> to submit the first one.
            </p>
          </div>
        ) : (
          <div className="detail-list">
            {campaigns.slice(0, 4).map((campaign) => (
              <li key={campaign.id}>
                <span>
                  <Link to={`/campaigns/${campaign.id}`}>{campaign.title}</Link>
                </span>
                <span>
                  {campaignStatusLabels[campaign.status]} / {verificationTierLabels[campaign.verificationTier]}
                </span>
              </li>
            ))}
          </div>
        )}
      </InfoCard>
    </div>
  );
}

export default HomePage;
