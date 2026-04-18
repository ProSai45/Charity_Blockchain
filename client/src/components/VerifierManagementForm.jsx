import { useState } from "react";
import { isAddress } from "ethers";
import { setVerifierWithSigner } from "@/utils/campaigns";

function VerifierManagementForm({ wallet, onUpdated }) {
  const [verifier, setVerifier] = useState("");
  const [allowed, setAllowed] = useState(true);
  const [error, setError] = useState("");
  const [txState, setTxState] = useState({
    status: "idle",
    message: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();

    if (!wallet.isConnected) {
      setError("Connect MetaMask before managing verifiers.");
      return;
    }
    if (!wallet.isCorrectNetwork) {
      setError("Switch MetaMask to Ganache before managing verifiers.");
      return;
    }
    if (!verifier.trim()) {
      setError("Verifier address is required.");
      return;
    }
    if (!isAddress(verifier.trim())) {
      setError("Verifier address must be a valid wallet address.");
      return;
    }

    setError("");
    setTxState({
      status: "awaiting-signature",
      message: "Waiting for MetaMask confirmation...",
    });

    try {
      const signer = await wallet.provider.getSigner();
      const tx = await setVerifierWithSigner(signer, verifier, allowed);

      setTxState({
        status: "submitted",
        message: "Transaction submitted. Waiting for confirmation...",
      });

      await tx.wait();

      setTxState({
        status: "confirmed",
        message: allowed ? "Verifier added successfully." : "Verifier removed successfully.",
      });
      setVerifier("");

      if (onUpdated) {
        await onUpdated();
      }
    } catch (nextError) {
      setTxState({
        status: "failed",
        message:
          nextError instanceof Error ? nextError.message : "Verifier update transaction failed.",
      });
    }
  }

  return (
    <div className="action-panel">
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-field form-field--span-2">
          <label htmlFor="verifier-address">Verifier wallet</label>
          <input
            id="verifier-address"
            onChange={(event) => setVerifier(event.target.value)}
            placeholder="0x..."
            type="text"
            value={verifier}
          />
        </div>

        <div className="form-field">
          <label htmlFor="verifier-permission">Permission</label>
          <select
            id="verifier-permission"
            onChange={(event) => setAllowed(event.target.value === "true")}
            value={String(allowed)}
          >
            <option value="true">Grant verifier access</option>
            <option value="false">Revoke verifier access</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            className="button"
            disabled={txState.status === "awaiting-signature" || txState.status === "submitted"}
            type="submit"
          >
            {txState.status === "awaiting-signature"
              ? "Awaiting signature"
              : txState.status === "submitted"
                ? "Confirming..."
                : "Save verifier change"}
          </button>
        </div>
      </form>

      {error ? <div className="badge badge--danger">{error}</div> : null}
      {txState.message ? (
        <div className={`badge ${txState.status === "failed" ? "badge--danger" : "badge--success"}`}>
          {txState.message}
        </div>
      ) : null}
    </div>
  );
}

export default VerifierManagementForm;
