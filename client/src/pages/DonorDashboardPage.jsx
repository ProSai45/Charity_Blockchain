import { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import InfoCard from "@/components/InfoCard";
import StatusBadge from "@/components/StatusBadge";
import useDonorDashboard from "@/hooks/useDonorDashboard";
import { shortenAddress } from "@/utils/chain";
import {
  campaignStatusLabels,
  campaignStatusVariants,
  formatEthAmount,
  formatTimestamp,
  verificationTierLabels,
  verificationTierVariants,
} from "@/utils/formatters";

function DonorDashboardPage() {
  const { wallet } = useOutletContext();
  const { donations, campaignsById, error, isLoading, refresh } = useDonorDashboard({
    account: wallet.account,
    provider: wallet.provider,
    isCorrectNetwork: wallet.isCorrectNetwork,
  });

  const donationView = useMemo(
    () =>
      [...donations]
        .sort((left, right) => right.timestamp - left.timestamp)
        .map((donation) => ({
          ...donation,
          campaign: campaignsById[donation.campaignId] ?? null,
        })),
    [campaignsById, donations]
  );

  const summary = useMemo(() => {
    const uniqueCampaignIds = new Set(donationView.map((donation) => donation.campaignId));
    const activeSupported = new Set(
      donationView
        .filter((donation) => donation.campaign?.status === 1)
        .map((donation) => donation.campaignId)
    );
    const verifiedSupported = new Set(
      donationView
        .filter((donation) => (donation.campaign?.verificationTier ?? 0) > 0)
        .map((donation) => donation.campaignId)
    );

    return {
      supportedCampaigns: uniqueCampaignIds.size,
      totalDonated: donationView.reduce((total, donation) => total + donation.amount, 0n),
      totalReceipts: donationView.length,
      activeSupported: activeSupported.size,
      verifiedSupported: verifiedSupported.size,
    };
  }, [donationView]);

  return (
    <div className="info-grid">
      <InfoCard
        className="surface-card--span-8"
        title="Donor trust dashboard"
        subtitle="Phase 8 adds donation tracking, donor impact receipts, and campaign support visibility."
      >
        {!wallet.isConnected ? (
          <div className="placeholder-box">
            <p className="muted">Connect MetaMask to read your donor history from the contract.</p>
          </div>
        ) : !wallet.isCorrectNetwork ? (
          <div className="placeholder-box">
            <p className="muted">
              Switch MetaMask to Ganache to read `getDonationsByDonor(address)` and your supported
              campaigns.
            </p>
          </div>
        ) : (
          <>
            <div className="summary-grid">
              <div className="summary-grid__item">
                <span className="section-label">Total donated</span>
                <strong>{formatEthAmount(summary.totalDonated)}</strong>
              </div>
              <div className="summary-grid__item">
                <span className="section-label">Receipts</span>
                <strong>{summary.totalReceipts}</strong>
              </div>
              <div className="summary-grid__item">
                <span className="section-label">Supported campaigns</span>
                <strong>{summary.supportedCampaigns}</strong>
              </div>
              <div className="summary-grid__item">
                <span className="section-label">Verified supported</span>
                <strong>{summary.verifiedSupported}</strong>
              </div>
            </div>

            <div className="toolbar" style={{ marginTop: "16px" }}>
              <button className="button button--secondary" type="button" onClick={refresh}>
                Refresh donor history
              </button>
              <Link className="button button--secondary" to="/campaigns">
                Browse campaigns
              </Link>
            </div>

            {isLoading ? <p className="muted">Loading donor receipts from Ganache...</p> : null}
            {error ? <div className="badge badge--danger">{error}</div> : null}
          </>
        )}
      </InfoCard>

      <InfoCard
        className="surface-card--span-4"
        title="Connected donor"
        subtitle="Current wallet context"
      >
        <div className="detail-list">
          <li>
            <span>Wallet</span>
            <strong className="mono detail-list__wrap">
              {wallet.account || "Not connected"}
            </strong>
          </li>
          <li>
            <span>Network</span>
            <StatusBadge variant={wallet.isCorrectNetwork ? "success" : "warning"}>
              {wallet.isCorrectNetwork ? "Ganache ready" : "Switch required"}
            </StatusBadge>
          </li>
          <li>
            <span>Active supported</span>
            <strong>{summary.activeSupported}</strong>
          </li>
        </div>
      </InfoCard>

      <InfoCard
        className="surface-card--span-8"
        title="Donor impact receipts"
        subtitle="Each entry is reconstructed from immutable on-chain donation history."
      >
        {!wallet.isConnected || !wallet.isCorrectNetwork ? (
          <div className="placeholder-box">
            <p className="muted">Connect the donor wallet on Ganache to view receipts.</p>
          </div>
        ) : donationView.length === 0 ? (
          <div className="placeholder-box">
            <p className="muted">
              No donor receipts yet. Open a live <Link to="/campaigns">campaign</Link> and make the
              first donation from this wallet.
            </p>
          </div>
        ) : (
          <div className="receipt-list">
            {donationView.map((donation) => (
              <article className="receipt-card" key={donation.id}>
                <div className="page-header">
                  <div>
                    <div className="section-label">Receipt #{donation.id}</div>
                    <h4>{donation.campaign?.title || `Campaign #${donation.campaignId}`}</h4>
                  </div>
                  <strong>{formatEthAmount(donation.amount)}</strong>
                </div>
                <div className="campaign-card__badges" style={{ marginTop: "12px" }}>
                  <StatusBadge
                    variant={campaignStatusVariants[donation.campaign?.status ?? 0] || "neutral"}
                  >
                    {campaignStatusLabels[donation.campaign?.status ?? 0] || "Unknown"}
                  </StatusBadge>
                  <StatusBadge
                    variant={
                      verificationTierVariants[donation.campaign?.verificationTier ?? 0] || "neutral"
                    }
                  >
                    {verificationTierLabels[donation.campaign?.verificationTier ?? 0] || "Unknown"}
                  </StatusBadge>
                </div>
                <div className="detail-list">
                  <li>
                    <span>Donated at</span>
                    <strong>{formatTimestamp(donation.timestamp)}</strong>
                  </li>
                  <li>
                    <span>Beneficiary</span>
                    <strong className="mono">{shortenAddress(donation.beneficiaryWallet)}</strong>
                  </li>
                  <li>
                    <span>Donor</span>
                    <strong className="mono">{shortenAddress(donation.donor)}</strong>
                  </li>
                </div>
                <div style={{ marginTop: "16px" }}>
                  <Link className="button button--secondary" to={`/campaigns/${donation.campaignId}`}>
                    View campaign detail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </InfoCard>

      <InfoCard
        className="surface-card--span-4"
        title="Support footprint"
        subtitle="Quick trust-facing summary of the campaigns this wallet has backed."
      >
        {donationView.length === 0 ? (
          <div className="placeholder-box">
            <p className="muted">Campaign support metrics will appear after the first donation.</p>
          </div>
        ) : (
          <div className="detail-list">
            {Object.values(campaignsById).map((campaign) => (
              <li key={campaign.id}>
                <span>
                  <Link to={`/campaigns/${campaign.id}`}>{campaign.title}</Link>
                </span>
                <span>{campaignStatusLabels[campaign.status]}</span>
              </li>
            ))}
          </div>
        )}
      </InfoCard>
    </div>
  );
}

export default DonorDashboardPage;
