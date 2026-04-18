import { useState } from "react";
import { createCampaignWithSigner, validateCampaignForm } from "@/utils/campaigns";

const initialValues = {
  title: "",
  descriptionHash: "",
  category: "",
  beneficiaryWallet: "",
  targetAmount: "",
  proofBundleHash: "",
};

function CreateCampaignForm({ wallet, onCreated }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [txState, setTxState] = useState("idle");
  const [txHash, setTxHash] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateCampaignForm(values);
    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    if (!wallet.hasProvider || !wallet.isConnected) {
      setFormError("Connect MetaMask before creating a campaign.");
      return;
    }
    if (!wallet.isCorrectNetwork) {
      setFormError("Switch MetaMask to the Ganache Local network before creating a campaign.");
      return;
    }

    setTxState("awaiting-signature");
    setTxHash("");

    try {
      const signer = await wallet.provider.getSigner();
      const tx = await createCampaignWithSigner(signer, values);
      setTxState("submitted");
      setTxHash(tx.hash);
      await tx.wait();
      setTxState("mined");
      setValues(initialValues);
      if (onCreated) {
        await onCreated();
      }
    } catch (error) {
      setTxState("failed");
      setFormError(error instanceof Error ? error.message : "Campaign creation failed.");
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field form-field--span-2">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={values.title} onChange={handleChange} />
        {errors.title ? <span className="form-error">{errors.title}</span> : null}
      </div>

      <div className="form-field form-field--span-2">
        <label htmlFor="descriptionHash">Description hash</label>
        <input
          id="descriptionHash"
          name="descriptionHash"
          value={values.descriptionHash}
          onChange={handleChange}
          placeholder="ipfs://..."
        />
        {errors.descriptionHash ? <span className="form-error">{errors.descriptionHash}</span> : null}
      </div>

      <div className="form-field">
        <label htmlFor="category">Category</label>
        <input id="category" name="category" value={values.category} onChange={handleChange} />
        {errors.category ? <span className="form-error">{errors.category}</span> : null}
      </div>

      <div className="form-field">
        <label htmlFor="targetAmount">Target amount (ETH)</label>
        <input
          id="targetAmount"
          name="targetAmount"
          value={values.targetAmount}
          onChange={handleChange}
          placeholder="5"
        />
        {errors.targetAmount ? <span className="form-error">{errors.targetAmount}</span> : null}
      </div>

      <div className="form-field form-field--span-2">
        <label htmlFor="beneficiaryWallet">Beneficiary wallet</label>
        <input
          id="beneficiaryWallet"
          name="beneficiaryWallet"
          value={values.beneficiaryWallet}
          onChange={handleChange}
          placeholder="0x..."
        />
        {errors.beneficiaryWallet ? <span className="form-error">{errors.beneficiaryWallet}</span> : null}
      </div>

      <div className="form-field form-field--span-2">
        <label htmlFor="proofBundleHash">Proof bundle hash (optional)</label>
        <input
          id="proofBundleHash"
          name="proofBundleHash"
          value={values.proofBundleHash}
          onChange={handleChange}
          placeholder="0x..."
        />
        {errors.proofBundleHash ? <span className="form-error">{errors.proofBundleHash}</span> : null}
      </div>

      <div className="form-actions form-field--span-2">
        <button className="button" type="submit" disabled={txState === "awaiting-signature" || txState === "submitted"}>
          {txState === "awaiting-signature"
            ? "Awaiting MetaMask confirmation..."
            : txState === "submitted"
              ? "Transaction submitted..."
              : "Create campaign"}
        </button>
        <button
          className="button button--secondary"
          type="button"
          onClick={() => {
            setValues(initialValues);
            setErrors({});
            setFormError("");
            setTxState("idle");
            setTxHash("");
          }}
        >
          Reset form
        </button>
      </div>

      {txState === "mined" ? (
        <div className="badge badge--success form-field--span-2">
          Campaign creation transaction mined successfully.
        </div>
      ) : null}
      {txHash ? <div className="form-field--span-2 mono form-hash">Transaction hash: {txHash}</div> : null}
      {formError ? <div className="badge badge--danger form-field--span-2">{formError}</div> : null}
    </form>
  );
}

export default CreateCampaignForm;
