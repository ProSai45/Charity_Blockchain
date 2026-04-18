import { useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import DonationForm from "@/components/DonationForm";
import InfoCard from "@/components/InfoCard";
import StatusBadge from "@/components/StatusBadge";
import useCampaignDetail from "@/hooks/useCampaignDetail";
import { shortenAddress } from "@/utils/chain";
import {
  campaignStatusLabels,
  campaignStatusVariants,
  formatEthAmount,
  formatPercent,
  formatTimestamp,
  updateTypeLabels,
  verificationTierLabels,
  verificationTierVariants,
} from "@/utils/formatters";

function CampaignDetailPage() {
  const { campaignId } = useParams();
  const { wallet } = useOutletContext();
  const [latestReceipt, setLatestReceipt] = useState(null);
  const { campaign, donations, updates, error, isLoading, refresh } = useCampaignDetail({
    campaignId,
    provider: wallet.provider,
    isCorrectNetwork: wallet.isCorrectNetwork,
  });

  if (isLoading) {
    return (
      <div className="info-grid">
        <InfoCard
          className="surface-card--span-12"
          title={`Campaign detail route: #${campaignId}`}
          subtitle="Loading contract-backed campaign detail..."
        />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="info-grid">
        <InfoCard
          className="surface-card--span-12"
          title={`Campaign detail route: #${campaignId}`}
          subtitle="Unable to load this campaign from the contract."
        >
          <div className="badge badge--danger">{error || "Campaign not found."}</div>
        </InfoCard>
      </div>
    );
  }

  return (
    <div className="info-grid">
      <InfoCard
        className="surface-card--span-8"
        title={campaign.title}
        subtitle="Contract-backed campaign detail for Phase 7."
      >
        <div className="campaign-card__badges">
          <StatusBadge variant={campaignStatusVariants[campaign.status]}>
            {campaignStatusLabels[campaign.status]}
          </StatusBadge>
          <StatusBadge variant={verificationTierVariants[campaign.verificationTier]}>
            {verificationTierLabels[campaign.verificationTier]}
          </StatusBadge>
        </div>

        <div className="campaign-card__meter" style={{ marginTop: "16px" }}>
          <div
            className="campaign-card__meter-fill"
            style={{ width: formatPercent(campaign.raisedAmount, campaign.targetAmount) }}
          />
        </div>

        <div className="detail-list" style={{ marginTop: "18px" }}>
          <li>
            <span>Category</span>
            <strong>{campaign.category}</strong>
          </li>
          <li>
            <span>Raised</span>
            <strong>{formatEthAmount(campaign.raisedAmount)}</strong>
          </li>
          <li>
            <span>Target</span>
            <strong>{formatEthAmount(campaign.targetAmount)}</strong>
          </li>
          <li>
            <span>Creator</span>
            <strong className="mono">{shortenAddress(campaign.creator)}</strong>
          </li>
          <li>
            <span>Beneficiary</span>
            <strong className="mono">{shortenAddress(campaign.beneficiaryWallet)}</strong>
          </li>
          <li>
            <span>Description hash</span>
            <strong className="mono detail-list__wrap">{campaign.descriptionHash}</strong>
          </li>
          <li>
            <span>Latest proof hash</span>
            <strong className="mono detail-list__wrap">{campaign.latestProofHash}</strong>
          </li>
          <li>
            <span>Created</span>
            <strong>{formatTimestamp(campaign.createdAt)}</strong>
          </li>
          <li>
            <span>Verified</span>
            <strong>{formatTimestamp(campaign.verifiedAt)}</strong>
          </li>
          <li>
            <span>Closed</span>
            <strong>{formatTimestamp(campaign.closedAt)}</strong>
          </li>
        </div>

        {latestReceipt ? (
          <div className="badge badge--success" style={{ marginTop: "16px" }}>
            Latest donation receipt captured. Review the donor dashboard for the full donor-side view.
          </div>
        ) : null}
      </InfoCard>

      <InfoCard
        className="surface-card--span-4"
        title="Donate to this campaign"
        subtitle="Phase 8 adds the donor transaction flow while keeping the trust indicators visible."
      >
        <div className="summary-grid summary-grid--stack">
          <div className="summary-grid__item">
            <span className="section-label">Donation count</span>
            <strong>{campaign.donationCount}</strong>
          </div>
          <div className="summary-grid__item">
            <span className="section-label">Funding progress</span>
            <strong>{formatPercent(campaign.raisedAmount, campaign.targetAmount)}</strong>
          </div>
          <div className="summary-grid__item">
            <span className="section-label">Proof entries</span>
            <strong>{updates.length}</strong>
          </div>
        </div>

        <DonationForm
          campaign={campaign}
          wallet={wallet}
          onDonationRecorded={async (receipt) => {
            setLatestReceipt(receipt);
            await refresh();
          }}
        />

        <div className="toolbar" style={{ marginTop: "16px" }}>
          <button className="button button--secondary" type="button" onClick={refresh}>
            Refresh detail
          </button>
          <Link className="button button--secondary" to="/donor">
            Donor dashboard
          </Link>
        </div>
      </InfoCard>

      <InfoCard
        className="surface-card--span-6"
        title="Recent proof and status updates"
        subtitle="Timeline rendering becomes richer later, but the data is already visible now."
      >
        {updates.length === 0 ? (
          <div className="placeholder-box">
            <p className="muted">No proof updates have been published for this campaign yet.</p>
          </div>
        ) : (
          <div className="timeline-list">
            {updates.map((update) => (
              <div className="timeline-list__item" key={update.id}>
                <div className="timeline-list__meta">
                  <StatusBadge variant="neutral">{updateTypeLabels[update.updateType]}</StatusBadge>
                  <span>{formatTimestamp(update.timestamp)}</span>
                </div>
                <div className="mono detail-list__wrap">{update.detailsHash}</div>
                <div className="muted">Author: {shortenAddress(update.author)}</div>
              </div>
            ))}
          </div>
        )}
      </InfoCard>

      <InfoCard
        className="surface-card--span-6"
        title="Donation history snapshot"
        subtitle="The full donor dashboard and donation actions arrive in later phases."
      >
        {donations.length === 0 ? (
          <div className="placeholder-box">
            <p className="muted">No donations recorded yet for this campaign.</p>
          </div>
        ) : (
          <div className="timeline-list">
            {donations.map((donation) => (
              <div className="timeline-list__item" key={donation.id}>
                <div className="timeline-list__meta">
                  <StatusBadge variant="success">{formatEthAmount(donation.amount)}</StatusBadge>
                  <span>{formatTimestamp(donation.timestamp)}</span>
                </div>
                <div className="muted">
                  Donor: <span className="mono">{shortenAddress(donation.donor)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </InfoCard>
    </div>
  );
}

export default CampaignDetailPage;
