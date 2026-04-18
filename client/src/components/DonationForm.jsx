import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { parseEther } from "ethers";
import {
  donateToCampaignWithSigner,
  validateDonationAmount,
} from "@/utils/campaigns";
import { formatEthAmount, formatTimestamp } from "@/utils/formatters";

function DonationForm({ campaign, wallet, onDonationRecorded }) {
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [txState, setTxState] = useState({
    status: "idle",
    message: "",
    txHash: "",
    receipt: null,
  });

  const canDonate = useMemo(
    () => campaign.status === 1 && wallet.isConnected && wallet.isCorrectNetwork,
    [campaign.status, wallet.isConnected, wallet.isCorrectNetwork]
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!wallet.isConnected) {
      setFormError("Connect MetaMask before donating.");
      return;
    }

    if (!wallet.isCorrectNetwork) {
      setFormError("Switch MetaMask to Ganache before donating.");
      return;
    }

    if (campaign.status !== 1) {
      setFormError("Only active approved campaigns can receive donations.");
      return;
    }

    const amountError = validateDonationAmount(amount);
    if (amountError) {
      setFormError(amountError);
      return;
    }

    setFormError("");
    const amountWei = parseEther(amount.trim());
    setTxState({
      status: "awaiting-signature",
      message: "Waiting for MetaMask confirmation...",
      txHash: "",
      receipt: null,
    });

    try {
      const signer = await wallet.provider.getSigner();
      const tx = await donateToCampaignWithSigner(signer, campaign.id, amount);

      setTxState({
        status: "submitted",
        message: "Transaction submitted. Waiting for on-chain confirmation...",
        txHash: tx.hash,
        receipt: null,
      });

      const receipt = await tx.wait();
      const block = await wallet.provider.getBlock(receipt.blockNumber);

      const nextReceipt = {
        amount: amountWei,
        beneficiaryWallet: campaign.beneficiaryWallet,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        donor: wallet.account,
        timestamp: block?.timestamp ?? 0,
        txHash: receipt.hash,
      };

      setTxState({
        status: "confirmed",
        message: "Donation confirmed. Funds were forwarded to the beneficiary wallet.",
        txHash: receipt.hash,
        receipt: nextReceipt,
      });
      setAmount("");

      if (onDonationRecorded) {
        try {
          await onDonationRecorded(nextReceipt);
        } catch {
          // Receipt stays visible even if follow-up UI refresh fails.
        }
      }
    } catch (error) {
      setTxState({
        status: "failed",
        message: error instanceof Error ? error.message : "Donation transaction failed.",
        txHash: "",
        receipt: null,
      });
    }
  }

  return (
    <div className="donation-panel">
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-field form-field--span-2">
          <label htmlFor={`donation-amount-${campaign.id}`}>Donation amount (ETH)</label>
          <input
            id={`donation-amount-${campaign.id}`}
            inputMode="decimal"
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.10"
            type="text"
            value={amount}
          />
          <span className="form-hash">
            Donations are recorded on-chain and forwarded directly to{" "}
            <span className="mono">{campaign.beneficiaryWallet}</span>.
          </span>
        </div>
        <div className="form-actions">
          <button
            className="button"
            disabled={!canDonate || txState.status === "awaiting-signature" || txState.status === "submitted"}
            type="submit"
          >
            {txState.status === "awaiting-signature"
              ? "Awaiting signature"
              : txState.status === "submitted"
                ? "Confirming..."
                : "Donate with MetaMask"}
          </button>
          <Link className="button button--secondary" to="/donor">
            Open donor dashboard
          </Link>
        </div>
      </form>

      {formError ? <div className="badge badge--danger">{formError}</div> : null}
      {txState.message ? (
        <div className={`badge ${txState.status === "failed" ? "badge--danger" : "badge--success"}`}>
          {txState.message}
        </div>
      ) : null}

      {txState.receipt ? (
        <div className="receipt-card">
          <div className="page-header">
            <div>
              <div className="section-label">Donor impact receipt</div>
              <h4>{txState.receipt.campaignTitle}</h4>
            </div>
            <strong>{formatEthAmount(txState.receipt.amount)}</strong>
          </div>
          <div className="detail-list">
            <li>
              <span>Campaign ID</span>
              <strong>#{txState.receipt.campaignId}</strong>
            </li>
            <li>
              <span>Donor</span>
              <strong className="mono detail-list__wrap">{txState.receipt.donor}</strong>
            </li>
            <li>
              <span>Beneficiary</span>
              <strong className="mono detail-list__wrap">{txState.receipt.beneficiaryWallet}</strong>
            </li>
            <li>
              <span>Confirmed at</span>
              <strong>{formatTimestamp(txState.receipt.timestamp)}</strong>
            </li>
            <li>
              <span>Transaction hash</span>
              <strong className="mono detail-list__wrap">{txState.receipt.txHash}</strong>
            </li>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DonationForm;
