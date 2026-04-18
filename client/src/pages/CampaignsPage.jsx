import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import CampaignCard from "@/components/CampaignCard";
import CreateCampaignForm from "@/components/CreateCampaignForm";
import InfoCard from "@/components/InfoCard";
import StatusBadge from "@/components/StatusBadge";
import useCampaigns from "@/hooks/useCampaigns";
import { contractConfig } from "@/utils/contractConfig";
import { campaignStatusLabels, formatEthAmount, verificationTierLabels } from "@/utils/formatters";

function CampaignsPage() {
  const { wallet } = useOutletContext();
  const [filter, setFilter] = useState("all");
  const { campaigns, error, isLoading, refresh } = useCampaigns(wallet);

  const filteredCampaigns = useMemo(() => {
    if (filter === "all") {
      return campaigns;
    }

    return campaigns.filter((campaign) => String(campaign.status) === filter);
  }, [campaigns, filter]);

  return (
    <div className="info-grid">
      <InfoCard
        className="surface-card--span-8"
        title="Campaign explorer"
        subtitle="This Phase 7 view reads live campaigns from the deployed Ganache contract and exposes the PRD-defined creation inputs."
      >
        <div className="page-header">
          <div>
            <h2>Campaign listing and creation</h2>
            <p>
              Campaigns are loaded from `getCampaignCount()` plus `getCampaign(id)`. Creation writes
              directly through MetaMask using the same contract address resolved in Phase 6.
            </p>
          </div>
          <StatusBadge variant={wallet.isCorrectNetwork ? "success" : "warning"}>
            {wallet.isCorrectNetwork ? "Ganache connected" : "Connect Ganache first"}
          </StatusBadge>
        </div>

        <div className="toolbar">
          <div className="toolbar__filters">
            {[
              ["all", "All"],
              ["0", "Pending"],
              ["1", "Active"],
              ["2", "Paused"],
              ["3", "Completed"],
              ["4", "Rejected"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={`chip${filter === value ? " chip--active" : ""}`}
                type="button"
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="button button--secondary" type="button" onClick={refresh}>
            Refresh campaigns
          </button>
        </div>

        {isLoading ? <p className="muted">Loading campaigns from Ganache...</p> : null}
        {error ? <div className="badge badge--danger">{error}</div> : null}

        <div className="campaign-grid">
          {filteredCampaigns.length === 0 ? (
            <div className="placeholder-box campaign-grid__empty">
              <p className="muted">
                No campaigns match the current filter yet. Create one below or switch filters.
              </p>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
          )}
        </div>
      </InfoCard>

      <InfoCard
        className="surface-card--span-4"
        title="Create campaign"
        subtitle="PRD-required input set"
      >
        <CreateCampaignForm wallet={wallet} onCreated={refresh} />
      </InfoCard>

      <InfoCard
        className="surface-card--span-12"
        title="Live summary"
        subtitle="Quick trust and deployment context for the current frontend phase"
      >
        <div className="summary-grid">
          <div className="summary-grid__item">
            <span className="section-label">Campaign count</span>
            <strong>{campaigns.length}</strong>
          </div>
          <div className="summary-grid__item">
            <span className="section-label">Active total</span>
            <strong>{campaigns.filter((campaign) => campaign.status === 1).length}</strong>
          </div>
          <div className="summary-grid__item">
            <span className="section-label">Total raised</span>
            <strong>
              {formatEthAmount(campaigns.reduce((total, campaign) => total + campaign.raisedAmount, 0n))}
            </strong>
          </div>
          <div className="summary-grid__item">
            <span className="section-label">Contract</span>
            <strong className="mono">
              {contractConfig.address ? `${contractConfig.address.slice(0, 10)}...` : "Missing"}
            </strong>
          </div>
        </div>

        {campaigns.length > 0 ? (
          <div className="detail-list" style={{ marginTop: "18px" }}>
            {campaigns.slice(0, 3).map((campaign) => (
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
        ) : null}
      </InfoCard>
    </div>
  );
}

export default CampaignsPage;
