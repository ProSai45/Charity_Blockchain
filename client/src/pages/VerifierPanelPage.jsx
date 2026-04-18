import { useMemo, useState } from "react";
import CampaignAdminActions from "@/components/CampaignAdminActions";
import InfoCard from "@/components/InfoCard";
import StatusBadge from "@/components/StatusBadge";
import VerifierManagementForm from "@/components/VerifierManagementForm";
import useCampaigns from "@/hooks/useCampaigns";
import usePlatformOverview from "@/hooks/usePlatformOverview";
import {
  campaignStatusLabels,
  campaignStatusVariants,
} from "@/utils/formatters";
import { useOutletContext } from "react-router-dom";

function VerifierPanelPage() {
  const { wallet } = useOutletContext();
  const { campaigns, error: campaignsError, isLoading: campaignsLoading, refresh } = useCampaigns(wallet);
  const {
    error: overviewError,
    isLoading: overviewLoading,
    overview,
    refresh: refreshOverview,
  } = usePlatformOverview(wallet);
  const [filter, setFilter] = useState("actionable");

  const isOwner = overview.currentRole === "owner-admin";
  const isVerifier = overview.isVerifier;

  const visibleCampaigns = useMemo(() => {
    const base =
      filter === "all"
        ? campaigns
        : filter === "actionable"
          ? campaigns.filter((campaign) => {
              const isCreator =
                wallet.account && campaign.creator.toLowerCase() === wallet.account.toLowerCase();
              const canModerate = isOwner || isVerifier;

              if (canModerate) {
                return true;
              }

              return isCreator && campaign.status !== 3 && campaign.status !== 4;
            })
          : campaigns.filter((campaign) => String(campaign.status) === filter);

    return [...base].sort((left, right) => right.id - left.id);
  }, [campaigns, filter, isOwner, isVerifier, wallet.account]);

  async function refreshAll() {
    await Promise.all([refresh(), refreshOverview()]);
  }

  return (
    <div className="info-grid">
      <InfoCard
        className="surface-card--span-8"
        title="Verifier and admin control panel"
        subtitle="Phase 9 exposes lifecycle moderation, proof publishing, and completion controls."
      >
        <div className="summary-grid">
          <div className="summary-grid__item">
            <span className="section-label">Current role</span>
            <strong>{overview.currentRole}</strong>
          </div>
          <div className="summary-grid__item">
            <span className="section-label">Verifier access</span>
            <strong>{overview.isVerifier ? "Granted" : "Not granted"}</strong>
          </div>
          <div className="summary-grid__item">
            <span className="section-label">Campaigns loaded</span>
            <strong>{campaigns.length}</strong>
          </div>
          <div className="summary-grid__item">
            <span className="section-label">Actionable view</span>
            <strong>{visibleCampaigns.length}</strong>
          </div>
        </div>

        <div className="toolbar" style={{ marginTop: "16px" }}>
          <div className="toolbar__filters">
            {[
              ["actionable", "Actionable"],
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
                onClick={() => setFilter(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <button className="button button--secondary" onClick={refreshAll} type="button">
            Refresh panel
          </button>
        </div>

        {(overviewLoading || campaignsLoading) ? (
          <p className="muted">Loading privileged panel state from Ganache...</p>
        ) : null}
        {overviewError ? <div className="badge badge--danger">{overviewError}</div> : null}
        {campaignsError ? <div className="badge badge--danger">{campaignsError}</div> : null}

        {!wallet.isConnected ? (
          <div className="placeholder-box" style={{ marginTop: "16px" }}>
            <p className="muted">Connect MetaMask to inspect role-gated controls.</p>
          </div>
        ) : !wallet.isCorrectNetwork ? (
          <div className="placeholder-box" style={{ marginTop: "16px" }}>
            <p className="muted">Switch MetaMask to Ganache to enable privileged actions.</p>
          </div>
        ) : !(isOwner || isVerifier) ? (
          <div className="placeholder-box" style={{ marginTop: "16px" }}>
            <p className="muted">
              This wallet is not an owner or verifier. Creator-authorized update and completion
              actions will still appear below for campaigns created by this wallet.
            </p>
          </div>
        ) : null}
      </InfoCard>

      <InfoCard
        className="surface-card--span-4"
        title="Role trust summary"
        subtitle="Visible moderation signals for the connected wallet"
      >
        <div className="detail-list">
          <li>
            <span>Owner-admin</span>
            <StatusBadge variant={isOwner ? "success" : "neutral"}>
              {isOwner ? "Yes" : "No"}
            </StatusBadge>
          </li>
          <li>
            <span>Verifier</span>
            <StatusBadge variant={isVerifier ? "success" : "neutral"}>
              {isVerifier ? "Yes" : "No"}
            </StatusBadge>
          </li>
          <li>
            <span>Pending campaigns</span>
            <strong>{campaigns.filter((campaign) => campaign.status === 0).length}</strong>
          </li>
          <li>
            <span>Paused campaigns</span>
            <strong>{campaigns.filter((campaign) => campaign.status === 2).length}</strong>
          </li>
        </div>
      </InfoCard>

      {isOwner ? (
        <InfoCard
          className="surface-card--span-12"
          title="Verifier management"
          subtitle="Owner-admin only access to delegated reviewer accounts."
        >
          <VerifierManagementForm wallet={wallet} onUpdated={refreshOverview} />
        </InfoCard>
      ) : null}

      <InfoCard
        className="surface-card--span-12"
        title="Lifecycle state snapshot"
        subtitle="High-level status distribution across the current deployment."
      >
        <div className="campaign-card__badges">
          {[0, 1, 2, 3, 4].map((status) => (
            <StatusBadge key={status} variant={campaignStatusVariants[status]}>
              {campaignStatusLabels[status]}: {campaigns.filter((campaign) => campaign.status === status).length}
            </StatusBadge>
          ))}
        </div>
      </InfoCard>

      {visibleCampaigns.length === 0 ? (
        <InfoCard
          className="surface-card--span-12"
          title="No matching campaigns"
          subtitle="No campaigns currently match this control-panel filter."
        >
          <div className="placeholder-box">
            <p className="muted">
              Create or load campaigns on this deployment, or switch the filter to inspect other
              lifecycle states.
            </p>
          </div>
        </InfoCard>
      ) : (
        visibleCampaigns.map((campaign) => (
          <CampaignAdminActions
            campaign={campaign}
            isOwner={isOwner}
            isVerifier={isVerifier}
            key={campaign.id}
            onActionComplete={refreshAll}
            wallet={wallet}
          />
        ))
      )}
    </div>
  );
}

export default VerifierPanelPage;
