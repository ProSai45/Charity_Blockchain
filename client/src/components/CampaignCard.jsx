import { Link } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { shortenAddress } from "@/utils/chain";
import {
  campaignStatusLabels,
  campaignStatusVariants,
  formatEthAmount,
  formatPercent,
  formatProofFreshness,
  verificationTierLabels,
  verificationTierVariants,
} from "@/utils/formatters";

function CampaignCard({ campaign }) {
  return (
    <article className="surface-card campaign-card">
      <div className="campaign-card__header">
        <div>
          <div className="section-label">Campaign #{campaign.id}</div>
          <h3>{campaign.title}</h3>
          <p className="muted">{campaign.category}</p>
        </div>
        <div className="campaign-card__badges">
          <StatusBadge variant={campaignStatusVariants[campaign.status]}>
            {campaignStatusLabels[campaign.status]}
          </StatusBadge>
          <StatusBadge variant={verificationTierVariants[campaign.verificationTier]}>
            {verificationTierLabels[campaign.verificationTier]}
          </StatusBadge>
        </div>
      </div>

      <div className="campaign-card__meter">
        <div
          className="campaign-card__meter-fill"
          style={{ width: formatPercent(campaign.raisedAmount, campaign.targetAmount) }}
        />
      </div>

      <div className="detail-list">
        <li>
          <span>Raised</span>
          <strong>{formatEthAmount(campaign.raisedAmount)}</strong>
        </li>
        <li>
          <span>Target</span>
          <strong>{formatEthAmount(campaign.targetAmount)}</strong>
        </li>
        <li>
          <span>Funding progress</span>
          <strong>{formatPercent(campaign.raisedAmount, campaign.targetAmount)}</strong>
        </li>
        <li>
          <span>Donations</span>
          <strong>{campaign.donationCount}</strong>
        </li>
        <li>
          <span>Beneficiary</span>
          <strong className="mono">{shortenAddress(campaign.beneficiaryWallet)}</strong>
        </li>
        <li>
          <span>Proof freshness</span>
          <strong>{formatProofFreshness(campaign.verifiedAt || campaign.createdAt)}</strong>
        </li>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Link className="button button--secondary" to={`/campaigns/${campaign.id}`}>
          View campaign
        </Link>
      </div>
    </article>
  );
}

export default CampaignCard;
