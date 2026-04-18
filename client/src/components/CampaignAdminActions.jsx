import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InfoCard from "@/components/InfoCard";
import StatusBadge from "@/components/StatusBadge";
import {
  addCampaignUpdateWithSigner,
  approveCampaignWithSigner,
  completeCampaignWithSigner,
  pauseCampaignWithSigner,
  rejectCampaignWithSigner,
  resumeCampaignWithSigner,
  validateBytes32Hash,
} from "@/utils/campaigns";
import { shortenAddress } from "@/utils/chain";
import {
  campaignStatusLabels,
  campaignStatusVariants,
  formatEthAmount,
  formatTimestamp,
  updateTypeLabels,
  verificationTierLabels,
  verificationTierVariants,
} from "@/utils/formatters";

function CampaignAdminActions({ campaign, isOwner, isVerifier, wallet, onActionComplete }) {
  const [verificationTier, setVerificationTier] = useState("1");
  const [rejectReasonHash, setRejectReasonHash] = useState("");
  const [pauseReasonHash, setPauseReasonHash] = useState("");
  const [updateType, setUpdateType] = useState("0");
  const [updateHash, setUpdateHash] = useState("");
  const [formError, setFormError] = useState("");
  const [txState, setTxState] = useState({
    status: "idle",
    message: "",
  });

  const isCreator =
    wallet.account && campaign.creator.toLowerCase() === wallet.account.toLowerCase();
  const canModerate = isOwner || isVerifier;
  const canPublishUpdate = canModerate || isCreator;
  const canComplete = canPublishUpdate;

  const actionFlags = useMemo(
    () => ({
      canApprove: canModerate && (campaign.status === 0 || campaign.status === 2),
      canReject: canModerate && (campaign.status === 0 || campaign.status === 2),
      canPause: canModerate && campaign.status === 1,
      canResume: canModerate && campaign.status === 2,
      canPublishUpdate: canPublishUpdate && campaign.status !== 3 && campaign.status !== 4,
      canComplete: canComplete && campaign.status !== 3 && campaign.status !== 4,
    }),
    [campaign.status, canComplete, canModerate, canPublishUpdate]
  );

  async function runTransaction(action) {
    if (!wallet.isConnected) {
      setFormError("Connect MetaMask before running privileged actions.");
      return;
    }
    if (!wallet.isCorrectNetwork) {
      setFormError("Switch MetaMask to Ganache before running privileged actions.");
      return;
    }

    setFormError("");
    setTxState({
      status: "awaiting-signature",
      message: "Waiting for MetaMask confirmation...",
    });

    try {
      const signer = await wallet.provider.getSigner();
      const tx = await action(signer);

      setTxState({
        status: "submitted",
        message: "Transaction submitted. Waiting for confirmation...",
      });

      await tx.wait();

      setTxState({
        status: "confirmed",
        message: "Campaign action confirmed on-chain.",
      });

      if (onActionComplete) {
        await onActionComplete();
      }
    } catch (nextError) {
      setTxState({
        status: "failed",
        message: nextError instanceof Error ? nextError.message : "Campaign action failed.",
      });
    }
  }

  return (
    <InfoCard
      className="surface-card--span-6"
      title={`Campaign #${campaign.id}: ${campaign.title}`}
      subtitle="Verifier/admin controls with creator-authorized update and completion support."
    >
      <div className="campaign-card__badges">
        <StatusBadge variant={campaignStatusVariants[campaign.status]}>
          {campaignStatusLabels[campaign.status]}
        </StatusBadge>
        <StatusBadge variant={verificationTierVariants[campaign.verificationTier]}>
          {verificationTierLabels[campaign.verificationTier]}
        </StatusBadge>
      </div>

      <div className="detail-list">
        <li>
          <span>Creator</span>
          <strong className="mono">{shortenAddress(campaign.creator)}</strong>
        </li>
        <li>
          <span>Beneficiary</span>
          <strong className="mono">{shortenAddress(campaign.beneficiaryWallet)}</strong>
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
          <span>Verified at</span>
          <strong>{formatTimestamp(campaign.verifiedAt)}</strong>
        </li>
        <li>
          <span>Closed at</span>
          <strong>{formatTimestamp(campaign.closedAt)}</strong>
        </li>
      </div>

      <div className="action-panel">
        {actionFlags.canApprove ? (
          <div className="action-group">
            <div className="form-field">
              <label htmlFor={`tier-${campaign.id}`}>Approval tier</label>
              <select
                id={`tier-${campaign.id}`}
                onChange={(event) => setVerificationTier(event.target.value)}
                value={verificationTier}
              >
                <option value="1">{verificationTierLabels[1]}</option>
                <option value="2">{verificationTierLabels[2]}</option>
                <option value="3">{verificationTierLabels[3]}</option>
              </select>
            </div>
            <button
              className="button"
              onClick={() => runTransaction((signer) => approveCampaignWithSigner(signer, campaign.id, Number(verificationTier)))}
              type="button"
            >
              Approve campaign
            </button>
          </div>
        ) : null}

        {actionFlags.canReject ? (
          <div className="action-group">
            <div className="form-field">
              <label htmlFor={`reject-${campaign.id}`}>Rejection reason hash</label>
              <input
                id={`reject-${campaign.id}`}
                onChange={(event) => setRejectReasonHash(event.target.value)}
                placeholder="Optional bytes32 hash"
                type="text"
                value={rejectReasonHash}
              />
            </div>
            <button
              className="button button--secondary"
              onClick={() => {
                const error = validateBytes32Hash(rejectReasonHash, {
                  label: "Rejection reason hash",
                  allowZero: true,
                });
                if (error) {
                  setFormError(error);
                  return;
                }
                runTransaction((signer) => rejectCampaignWithSigner(signer, campaign.id, rejectReasonHash));
              }}
              type="button"
            >
              Reject campaign
            </button>
          </div>
        ) : null}

        {actionFlags.canPause ? (
          <div className="action-group">
            <div className="form-field">
              <label htmlFor={`pause-${campaign.id}`}>Pause reason hash</label>
              <input
                id={`pause-${campaign.id}`}
                onChange={(event) => setPauseReasonHash(event.target.value)}
                placeholder="Optional bytes32 hash"
                type="text"
                value={pauseReasonHash}
              />
            </div>
            <button
              className="button button--secondary"
              onClick={() => {
                const error = validateBytes32Hash(pauseReasonHash, {
                  label: "Pause reason hash",
                  allowZero: true,
                });
                if (error) {
                  setFormError(error);
                  return;
                }
                runTransaction((signer) => pauseCampaignWithSigner(signer, campaign.id, pauseReasonHash));
              }}
              type="button"
            >
              Pause campaign
            </button>
          </div>
        ) : null}

        {actionFlags.canResume ? (
          <div className="action-group">
            <button
              className="button"
              onClick={() => runTransaction((signer) => resumeCampaignWithSigner(signer, campaign.id))}
              type="button"
            >
              Resume campaign
            </button>
          </div>
        ) : null}

        {actionFlags.canPublishUpdate ? (
          <div className="action-group">
            <div className="form-field">
              <label htmlFor={`update-type-${campaign.id}`}>Update type</label>
              <select
                id={`update-type-${campaign.id}`}
                onChange={(event) => setUpdateType(event.target.value)}
                value={updateType}
              >
                {Object.entries(updateTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor={`update-hash-${campaign.id}`}>Proof / status hash</label>
              <input
                id={`update-hash-${campaign.id}`}
                onChange={(event) => setUpdateHash(event.target.value)}
                placeholder="Required bytes32 hash"
                type="text"
                value={updateHash}
              />
            </div>
            <button
              className="button"
              onClick={() => {
                const error = validateBytes32Hash(updateHash, {
                  label: "Proof / status hash",
                  required: true,
                });
                if (error) {
                  setFormError(error);
                  return;
                }
                runTransaction((signer) =>
                  addCampaignUpdateWithSigner(signer, campaign.id, Number(updateType), updateHash)
                );
              }}
              type="button"
            >
              Publish update
            </button>
          </div>
        ) : null}

        {actionFlags.canComplete ? (
          <div className="action-group">
            <button
              className="button button--secondary"
              onClick={() => runTransaction((signer) => completeCampaignWithSigner(signer, campaign.id))}
              type="button"
            >
              Complete campaign
            </button>
          </div>
        ) : null}
      </div>

      {!Object.values(actionFlags).some(Boolean) ? (
        <div className="placeholder-box" style={{ marginTop: "16px" }}>
          <p className="muted">
            No privileged actions are available for this wallet on the current campaign state.
          </p>
        </div>
      ) : null}

      {formError ? <div className="badge badge--danger">{formError}</div> : null}
      {txState.message ? (
        <div className={`badge ${txState.status === "failed" ? "badge--danger" : "badge--success"}`}>
          {txState.message}
        </div>
      ) : null}

      <div style={{ marginTop: "16px" }}>
        <Link className="button button--secondary" to={`/campaigns/${campaign.id}`}>
          Open campaign detail
        </Link>
      </div>
    </InfoCard>
  );
}

export default CampaignAdminActions;
