const CharityDonationPlatform = artifacts.require("CharityDonationPlatform");
const RejectingBeneficiary = artifacts.require("RejectingBeneficiary");

contract("CharityDonationPlatform", (accounts) => {
  const [owner, verifier, creator, beneficiary, outsider] = accounts;
  const proofBundleHash =
    "0x1111111111111111111111111111111111111111111111111111111111111111";
  const reviewReasonHash =
    "0x2222222222222222222222222222222222222222222222222222222222222222";
  const progressUpdateHash =
    "0x3333333333333333333333333333333333333333333333333333333333333333";
  const deliveryUpdateHash =
    "0x4444444444444444444444444444444444444444444444444444444444444444";
  const closureProofHash =
    "0x5555555555555555555555555555555555555555555555555555555555555555";

  let platform;
  let rejectingBeneficiary;

  beforeEach(async () => {
    platform = await CharityDonationPlatform.new({ from: owner });
    rejectingBeneficiary = await RejectingBeneficiary.new({ from: owner });
  });

  it("creates a campaign with PRD-defined defaults", async () => {
    const receipt = await platform.createCampaign(
      "Medical Relief Fund",
      "ipfs://medical-relief-001",
      "Medical",
      beneficiary,
      web3.utils.toWei("5", "ether"),
      proofBundleHash,
      { from: creator }
    );

    const campaign = await platform.getCampaign(1);
    const campaignCount = await platform.getCampaignCount();
    const campaignDonations = await platform.getCampaignDonations(1);
    const campaignUpdates = await platform.getCampaignUpdates(1);

    assert.equal(receipt.logs[0].event, "CampaignCreated");
    assert.equal(receipt.logs[0].args.campaignId.toString(), "1");
    assert.equal(receipt.logs[0].args.creator, creator);
    assert.equal(receipt.logs[0].args.beneficiaryWallet, beneficiary);
    assert.equal(receipt.logs[0].args.title, "Medical Relief Fund");

    assert.equal(campaign.id.toString(), "1");
    assert.equal(campaign.creator, creator);
    assert.equal(campaign.beneficiaryWallet, beneficiary);
    assert.equal(campaign.title, "Medical Relief Fund");
    assert.equal(campaign.descriptionHash, "ipfs://medical-relief-001");
    assert.equal(campaign.category, "Medical");
    assert.equal(campaign.targetAmount.toString(), web3.utils.toWei("5", "ether"));
    assert.equal(campaign.raisedAmount.toString(), "0");
    assert.equal(campaign.donationCount.toString(), "0");
    assert.equal(campaign.status.toString(), "0");
    assert.equal(campaign.verificationTier.toString(), "0");
    assert.equal(campaign.verifiedAt.toString(), "0");
    assert.equal(campaign.closedAt.toString(), "0");
    assert.equal(campaign.latestProofHash, proofBundleHash);
    assert.notEqual(campaign.createdAt.toString(), "0");

    assert.equal(campaignCount.toString(), "1");
    assert.equal(campaignDonations.length, 0);
    assert.equal(campaignUpdates.length, 0);
  });

  it("rejects campaign creation when title is empty", async () => {
    await expectCustomError(
      platform.createCampaign.call(
        "",
        "ipfs://medical-relief-001",
        "Medical",
        beneficiary,
        web3.utils.toWei("1", "ether"),
        proofBundleHash,
        { from: creator }
      ),
      "EmptyTitle()"
    );
  });

  it("rejects campaign creation when description hash is empty", async () => {
    await expectCustomError(
      platform.createCampaign.call(
        "Medical Relief Fund",
        "",
        "Medical",
        beneficiary,
        web3.utils.toWei("1", "ether"),
        proofBundleHash,
        { from: creator }
      ),
      "EmptyDescriptionHash()"
    );
  });

  it("rejects campaign creation when category is empty", async () => {
    await expectCustomError(
      platform.createCampaign.call(
        "Medical Relief Fund",
        "ipfs://medical-relief-001",
        "",
        beneficiary,
        web3.utils.toWei("1", "ether"),
        proofBundleHash,
        { from: creator }
      ),
      "EmptyCategory()"
    );
  });

  it("rejects campaign creation when beneficiary wallet is zero", async () => {
    await expectCustomError(
      platform.createCampaign.call(
        "Medical Relief Fund",
        "ipfs://medical-relief-001",
        "Medical",
        "0x0000000000000000000000000000000000000000",
        web3.utils.toWei("1", "ether"),
        proofBundleHash,
        { from: creator }
      ),
      "InvalidBeneficiaryWallet()"
    );
  });

  it("rejects campaign creation when target amount is zero", async () => {
    await expectCustomError(
      platform.createCampaign.call(
        "Medical Relief Fund",
        "ipfs://medical-relief-001",
        "Medical",
        beneficiary,
        "0",
        proofBundleHash,
        { from: creator }
      ),
      "InvalidTargetAmount()"
    );
  });

  it("reverts getCampaign for a missing campaign ID", async () => {
    await expectCustomError(platform.getCampaign(999), "CampaignNotFound(uint256)");
  });

  it("reverts campaign donation and update reads for missing campaign IDs", async () => {
    await expectCustomError(
      platform.getCampaignDonations(999),
      "CampaignNotFound(uint256)"
    );
    await expectCustomError(
      platform.getCampaignUpdates(999),
      "CampaignNotFound(uint256)"
    );
  });

  it("allows the owner to register and remove a verifier", async () => {
    const addReceipt = await platform.setVerifier(verifier, true, { from: owner });
    assert.equal(addReceipt.logs[0].event, "VerifierUpdated");
    assert.equal(addReceipt.logs[0].args.verifier, verifier);
    assert.equal(addReceipt.logs[0].args.allowed, true);
    assert.equal(await platform.verifiers(verifier), true);

    const removeReceipt = await platform.setVerifier(verifier, false, { from: owner });
    assert.equal(removeReceipt.logs[0].event, "VerifierUpdated");
    assert.equal(removeReceipt.logs[0].args.verifier, verifier);
    assert.equal(removeReceipt.logs[0].args.allowed, false);
    assert.equal(await platform.verifiers(verifier), false);
  });

  it("rejects verifier updates from a non-owner", async () => {
    await expectCustomError(
      platform.setVerifier.call(verifier, true, { from: outsider }),
      "OwnableUnauthorizedAccount(address)"
    );
  });

  it("allows the owner to approve a pending campaign with a verification tier", async () => {
    await createDefaultCampaign();

    const receipt = await platform.approveCampaign(1, 3, { from: owner });
    const campaign = await platform.getCampaign(1);

    assert.equal(receipt.logs[0].event, "CampaignApproved");
    assert.equal(receipt.logs[0].args.campaignId.toString(), "1");
    assert.equal(receipt.logs[0].args.verificationTier.toString(), "3");
    assert.equal(campaign.status.toString(), "1");
    assert.equal(campaign.verificationTier.toString(), "3");
    assert.notEqual(campaign.verifiedAt.toString(), "0");
  });

  it("allows an assigned verifier to approve a pending campaign", async () => {
    await createDefaultCampaign();
    await platform.setVerifier(verifier, true, { from: owner });

    await platform.approveCampaign(1, 2, { from: verifier });

    const campaign = await platform.getCampaign(1);
    assert.equal(campaign.status.toString(), "1");
    assert.equal(campaign.verificationTier.toString(), "2");
    assert.notEqual(campaign.verifiedAt.toString(), "0");
  });

  it("rejects campaign approval from an unauthorized wallet", async () => {
    await createDefaultCampaign();

    await expectCustomError(
      platform.approveCampaign.call(1, 3, { from: outsider }),
      "Unauthorized(address)"
    );
  });

  it("rejects approval when the verification tier is unverified", async () => {
    await createDefaultCampaign();

    await expectCustomError(
      platform.approveCampaign.call(1, 0, { from: owner }),
      "InvalidStatus(uint256)"
    );
  });

  it("allows the owner to reject a pending campaign", async () => {
    await createDefaultCampaign();

    const receipt = await platform.rejectCampaign(1, reviewReasonHash, { from: owner });
    const campaign = await platform.getCampaign(1);

    assert.equal(receipt.logs[0].event, "CampaignRejected");
    assert.equal(receipt.logs[0].args.campaignId.toString(), "1");
    assert.equal(receipt.logs[0].args.reasonHash, reviewReasonHash);
    assert.equal(campaign.status.toString(), "4");
  });

  it("allows an assigned verifier to reject a pending campaign", async () => {
    await createDefaultCampaign();
    await platform.setVerifier(verifier, true, { from: owner });

    await platform.rejectCampaign(1, reviewReasonHash, { from: verifier });

    const campaign = await platform.getCampaign(1);
    assert.equal(campaign.status.toString(), "4");
  });

  it("rejects campaign rejection from an unauthorized wallet", async () => {
    await createDefaultCampaign();

    await expectCustomError(
      platform.rejectCampaign.call(1, reviewReasonHash, { from: outsider }),
      "Unauthorized(address)"
    );
  });

  it("allows owner or verifier to pause and resume an active campaign", async () => {
    await createDefaultCampaign();
    await platform.setVerifier(verifier, true, { from: owner });
    await platform.approveCampaign(1, 3, { from: owner });

    const pauseReceipt = await platform.pauseCampaign(1, reviewReasonHash, { from: verifier });
    let campaign = await platform.getCampaign(1);
    assert.equal(pauseReceipt.logs[0].event, "CampaignPaused");
    assert.equal(pauseReceipt.logs[0].args.campaignId.toString(), "1");
    assert.equal(pauseReceipt.logs[0].args.reasonHash, reviewReasonHash);
    assert.equal(campaign.status.toString(), "2");

    const resumeReceipt = await platform.resumeCampaign(1, { from: owner });
    campaign = await platform.getCampaign(1);
    assert.equal(resumeReceipt.logs[0].event, "CampaignResumed");
    assert.equal(resumeReceipt.logs[0].args.campaignId.toString(), "1");
    assert.equal(campaign.status.toString(), "1");
  });

  it("allows donations again after a paused campaign is resumed", async () => {
    await createApprovedCampaign();
    await platform.pauseCampaign(1, reviewReasonHash, { from: owner });
    await platform.resumeCampaign(1, { from: owner });

    const donationAmount = web3.utils.toWei("0.75", "ether");
    await platform.donateToCampaign(1, { from: outsider, value: donationAmount });

    const campaign = await platform.getCampaign(1);
    assert.equal(campaign.status.toString(), "1");
    assert.equal(campaign.raisedAmount.toString(), donationAmount);
    assert.equal(campaign.donationCount.toString(), "1");
  });

  it("rejects pause for non-active campaigns", async () => {
    await createDefaultCampaign();

    await expectCustomError(
      platform.pauseCampaign.call(1, reviewReasonHash, { from: owner }),
      "InvalidStatus(uint256)"
    );
  });

  it("rejects resume for campaigns that are not paused", async () => {
    await createDefaultCampaign();
    await platform.approveCampaign(1, 3, { from: owner });

    await expectCustomError(
      platform.resumeCampaign.call(1, { from: owner }),
      "InvalidStatus(uint256)"
    );
  });

  it("rejects unauthorized pause and resume actions", async () => {
    await createDefaultCampaign();
    await platform.approveCampaign(1, 3, { from: owner });

    await expectCustomError(
      platform.pauseCampaign.call(1, reviewReasonHash, { from: outsider }),
      "Unauthorized(address)"
    );
    await platform.pauseCampaign(1, reviewReasonHash, { from: owner });

    await expectCustomError(
      platform.resumeCampaign.call(1, { from: outsider }),
      "Unauthorized(address)"
    );
  });

  it("rejects invalid transitions after campaigns are already active or rejected", async () => {
    await createDefaultCampaign();
    await platform.approveCampaign(1, 3, { from: owner });

    await expectCustomError(
      platform.rejectCampaign.call(1, reviewReasonHash, { from: owner }),
      "InvalidStatus(uint256)"
    );
    await expectCustomError(
      platform.approveCampaign.call(1, 2, { from: owner }),
      "InvalidStatus(uint256)"
    );

    await platform.createCampaign(
      "Emergency Shelter Fund",
      "ipfs://shelter-relief-001",
      "Shelter",
      beneficiary,
      web3.utils.toWei("3", "ether"),
      proofBundleHash,
      { from: creator }
    );
    await platform.rejectCampaign(2, reviewReasonHash, { from: owner });
    const campaign = await platform.getCampaign(2);
    assert.equal(campaign.status.toString(), "4");

    await expectCustomError(
      platform.pauseCampaign.call(2, reviewReasonHash, { from: owner }),
      "InvalidStatus(uint256)"
    );
    await expectCustomError(
      platform.resumeCampaign.call(2, { from: owner }),
      "InvalidStatus(uint256)"
    );
    await expectCustomError(
      platform.approveCampaign.call(2, 3, { from: owner }),
      "InvalidStatus(uint256)"
    );
  });

  it("allows a paused campaign to be re-approved directly by a verifier", async () => {
    await createDefaultCampaign();
    await platform.setVerifier(verifier, true, { from: owner });
    await platform.approveCampaign(1, 1, { from: owner });
    await platform.pauseCampaign(1, reviewReasonHash, { from: owner });

    const receipt = await platform.approveCampaign(1, 3, { from: verifier });
    const campaign = await platform.getCampaign(1);

    assert.equal(receipt.logs[0].event, "CampaignApproved");
    assert.equal(receipt.logs[0].args.verificationTier.toString(), "3");
    assert.equal(campaign.status.toString(), "1");
    assert.equal(campaign.verificationTier.toString(), "3");
  });

  it("rejects lifecycle actions for missing campaign IDs", async () => {
    await expectCustomError(
      platform.approveCampaign.call(42, 3, { from: owner }),
      "CampaignNotFound(uint256)"
    );
    await expectCustomError(
      platform.rejectCampaign.call(42, reviewReasonHash, { from: owner }),
      "CampaignNotFound(uint256)"
    );
    await expectCustomError(
      platform.pauseCampaign.call(42, reviewReasonHash, { from: owner }),
      "CampaignNotFound(uint256)"
    );
    await expectCustomError(
      platform.resumeCampaign.call(42, { from: owner }),
      "CampaignNotFound(uint256)"
    );
  });

  it("records a donation for an active campaign and forwards ETH to the beneficiary", async () => {
    await createApprovedCampaign();

    const donationAmount = web3.utils.toWei("1", "ether");
    const beneficiaryBalanceBefore = web3.utils.toBN(await web3.eth.getBalance(beneficiary));

    const receipt = await platform.donateToCampaign(1, {
      from: outsider,
      value: donationAmount,
    });

    const beneficiaryBalanceAfter = web3.utils.toBN(await web3.eth.getBalance(beneficiary));
    const campaign = await platform.getCampaign(1);
    const campaignDonations = await platform.getCampaignDonations(1);
    const donorDonations = await platform.getDonationsByDonor(outsider);

    assert.equal(receipt.logs[0].event, "DonationRecorded");
    assert.equal(receipt.logs[0].args.donationId.toString(), "1");
    assert.equal(receipt.logs[0].args.campaignId.toString(), "1");
    assert.equal(receipt.logs[0].args.donor, outsider);
    assert.equal(receipt.logs[0].args.beneficiaryWallet, beneficiary);
    assert.equal(receipt.logs[0].args.amount.toString(), donationAmount);

    assert.equal(campaign.raisedAmount.toString(), donationAmount);
    assert.equal(campaign.donationCount.toString(), "1");

    assert.equal(campaignDonations.length, 1);
    assert.equal(campaignDonations[0].id.toString(), "1");
    assert.equal(campaignDonations[0].campaignId.toString(), "1");
    assert.equal(campaignDonations[0].donor, outsider);
    assert.equal(campaignDonations[0].beneficiaryWallet, beneficiary);
    assert.equal(campaignDonations[0].amount.toString(), donationAmount);
    assert.notEqual(campaignDonations[0].timestamp.toString(), "0");

    assert.equal(donorDonations.length, 1);
    assert.equal(donorDonations[0].id.toString(), "1");
    assert.equal(donorDonations[0].campaignId.toString(), "1");
    assert.equal(donorDonations[0].donor, outsider);
    assert.equal(donorDonations[0].amount.toString(), donationAmount);

    assert.equal(
      beneficiaryBalanceAfter.sub(beneficiaryBalanceBefore).toString(),
      donationAmount
    );
  });

  it("accumulates raised amount and donation count across multiple donations", async () => {
    await createApprovedCampaign();

    const firstDonation = web3.utils.toWei("0.5", "ether");
    const secondDonation = web3.utils.toWei("1.25", "ether");

    await platform.donateToCampaign(1, { from: outsider, value: firstDonation });
    await platform.donateToCampaign(1, { from: verifier, value: secondDonation });

    const campaign = await platform.getCampaign(1);
    const campaignDonations = await platform.getCampaignDonations(1);
    const outsiderDonations = await platform.getDonationsByDonor(outsider);
    const verifierDonations = await platform.getDonationsByDonor(verifier);

    assert.equal(
      campaign.raisedAmount.toString(),
      web3.utils.toBN(firstDonation).add(web3.utils.toBN(secondDonation)).toString()
    );
    assert.equal(campaign.donationCount.toString(), "2");
    assert.equal(campaignDonations.length, 2);
    assert.equal(campaignDonations[1].id.toString(), "2");
    assert.equal(campaignDonations[1].amount.toString(), secondDonation);
    assert.equal(outsiderDonations.length, 1);
    assert.equal(verifierDonations.length, 1);
  });

  it("returns donor history across multiple campaigns in donation order", async () => {
    await createApprovedCampaign();
    await createDefaultCampaign({
      title: "Education Support Fund",
      descriptionHash: "ipfs://education-support-001",
      category: "Education",
      targetAmount: web3.utils.toWei("8", "ether"),
    });
    await platform.approveCampaign(2, 2, { from: owner });

    const firstDonation = web3.utils.toWei("0.25", "ether");
    const secondDonation = web3.utils.toWei("0.6", "ether");

    await platform.donateToCampaign(1, { from: outsider, value: firstDonation });
    await platform.donateToCampaign(2, { from: outsider, value: secondDonation });

    const donorDonations = await platform.getDonationsByDonor(outsider);

    assert.equal(donorDonations.length, 2);
    assert.equal(donorDonations[0].id.toString(), "1");
    assert.equal(donorDonations[0].campaignId.toString(), "1");
    assert.equal(donorDonations[0].amount.toString(), firstDonation);
    assert.equal(donorDonations[1].id.toString(), "2");
    assert.equal(donorDonations[1].campaignId.toString(), "2");
    assert.equal(donorDonations[1].amount.toString(), secondDonation);
  });

  it("rejects donations to campaigns that are still pending verification", async () => {
    await createDefaultCampaign();

    await expectCustomError(
      platform.donateToCampaign.call(1, { from: outsider, value: web3.utils.toWei("1", "ether") }),
      "CampaignNotActive(uint256)"
    );
  });

  it("rejects donations to rejected campaigns", async () => {
    await createDefaultCampaign();
    await platform.rejectCampaign(1, reviewReasonHash, { from: owner });

    await expectCustomError(
      platform.donateToCampaign.call(1, { from: outsider, value: web3.utils.toWei("1", "ether") }),
      "CampaignNotActive(uint256)"
    );
  });

  it("rejects donations to paused campaigns", async () => {
    await createApprovedCampaign();
    await platform.pauseCampaign(1, reviewReasonHash, { from: owner });

    await expectCustomError(
      platform.donateToCampaign.call(1, { from: outsider, value: web3.utils.toWei("1", "ether") }),
      "CampaignNotActive(uint256)"
    );
  });

  it("rejects zero-value donations", async () => {
    await createApprovedCampaign();

    await expectCustomError(
      platform.donateToCampaign.call(1, { from: outsider, value: "0" }),
      "ZeroDonation()"
    );
  });

  it("reverts the donation when beneficiary ETH forwarding fails", async () => {
    await createDefaultCampaign({
      beneficiaryWallet: rejectingBeneficiary.address,
      title: "Rejected Beneficiary Fund",
      descriptionHash: "ipfs://failing-beneficiary-001",
      category: "Emergency",
      targetAmount: web3.utils.toWei("2", "ether"),
    });
    await platform.approveCampaign(1, 3, { from: owner });

    await expectCustomError(
      platform.donateToCampaign.call(1, { from: outsider, value: web3.utils.toWei("1", "ether") }),
      "TransferFailed(address,uint256)"
    );

    await expectRevert(
      platform.donateToCampaign(1, { from: outsider, value: web3.utils.toWei("1", "ether") }),
      "revert"
    );

    const campaign = await platform.getCampaign(1);
    const campaignDonations = await platform.getCampaignDonations(1);
    const donorDonations = await platform.getDonationsByDonor(outsider);

    assert.equal(campaign.raisedAmount.toString(), "0");
    assert.equal(campaign.donationCount.toString(), "0");
    assert.equal(campaignDonations.length, 0);
    assert.equal(donorDonations.length, 0);
  });

  it("allows the creator to add a campaign update and refresh latest proof hash", async () => {
    await createApprovedCampaign();

    const receipt = await platform.addCampaignUpdate(1, 1, progressUpdateHash, {
      from: creator,
    });
    const campaign = await platform.getCampaign(1);
    const campaignUpdates = await platform.getCampaignUpdates(1);

    assert.equal(receipt.logs[0].event, "CampaignUpdateAdded");
    assert.equal(receipt.logs[0].args.campaignId.toString(), "1");
    assert.equal(receipt.logs[0].args.updateId.toString(), "1");
    assert.equal(receipt.logs[0].args.updateType.toString(), "1");
    assert.equal(receipt.logs[0].args.detailsHash, progressUpdateHash);
    assert.equal(campaign.latestProofHash, progressUpdateHash);

    assert.equal(campaignUpdates.length, 1);
    assert.equal(campaignUpdates[0].id.toString(), "1");
    assert.equal(campaignUpdates[0].campaignId.toString(), "1");
    assert.equal(campaignUpdates[0].author, creator);
    assert.equal(campaignUpdates[0].updateType.toString(), "1");
    assert.equal(campaignUpdates[0].detailsHash, progressUpdateHash);
    assert.notEqual(campaignUpdates[0].timestamp.toString(), "0");
  });

  it("allows owner or verifier to add campaign updates", async () => {
    await createApprovedCampaign();
    await platform.setVerifier(verifier, true, { from: owner });

    await platform.addCampaignUpdate(1, 0, progressUpdateHash, { from: owner });
    await platform.addCampaignUpdate(1, 2, deliveryUpdateHash, { from: verifier });

    const campaign = await platform.getCampaign(1);
    const campaignUpdates = await platform.getCampaignUpdates(1);

    assert.equal(campaign.latestProofHash, deliveryUpdateHash);
    assert.equal(campaignUpdates.length, 2);
    assert.equal(campaignUpdates[0].author, owner);
    assert.equal(campaignUpdates[0].updateType.toString(), "0");
    assert.equal(campaignUpdates[1].author, verifier);
    assert.equal(campaignUpdates[1].updateType.toString(), "2");
  });

  it("rejects campaign updates from unauthorized wallets", async () => {
    await createApprovedCampaign();

    await expectCustomError(
      platform.addCampaignUpdate.call(1, 0, progressUpdateHash, { from: outsider }),
      "NotCreatorOrVerifier(address)"
    );
  });

  it("rejects campaign updates with an empty proof hash", async () => {
    await createApprovedCampaign();

    await expectCustomError(
      platform.addCampaignUpdate.call(
        1,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { from: creator }
      ),
      "InvalidProofHash()"
    );
  });

  it("preserves campaign update order in the timeline", async () => {
    await createApprovedCampaign();
    await platform.setVerifier(verifier, true, { from: owner });

    await platform.addCampaignUpdate(1, 0, progressUpdateHash, { from: creator });
    await platform.addCampaignUpdate(1, 2, deliveryUpdateHash, { from: verifier });
    await platform.addCampaignUpdate(1, 4, closureProofHash, { from: owner });

    const campaignUpdates = await platform.getCampaignUpdates(1);

    assert.equal(campaignUpdates.length, 3);
    assert.equal(campaignUpdates[0].id.toString(), "1");
    assert.equal(campaignUpdates[0].detailsHash, progressUpdateHash);
    assert.equal(campaignUpdates[1].id.toString(), "2");
    assert.equal(campaignUpdates[1].detailsHash, deliveryUpdateHash);
    assert.equal(campaignUpdates[2].id.toString(), "3");
    assert.equal(campaignUpdates[2].detailsHash, closureProofHash);
  });

  it("rejects update and completion actions for missing campaign IDs", async () => {
    await expectCustomError(
      platform.addCampaignUpdate.call(77, 0, progressUpdateHash, { from: creator }),
      "CampaignNotFound(uint256)"
    );
    await expectCustomError(
      platform.completeCampaign.call(77, { from: owner }),
      "CampaignNotFound(uint256)"
    );
  });

  it("allows the creator to complete a campaign and stores the closed timestamp", async () => {
    await createApprovedCampaign();
    await platform.addCampaignUpdate(1, 4, closureProofHash, { from: creator });

    const receipt = await platform.completeCampaign(1, { from: creator });
    const campaign = await platform.getCampaign(1);

    assert.equal(receipt.logs[0].event, "CampaignCompleted");
    assert.equal(receipt.logs[0].args.campaignId.toString(), "1");
    assert.equal(campaign.status.toString(), "3");
    assert.notEqual(campaign.closedAt.toString(), "0");
    assert.equal(campaign.latestProofHash, closureProofHash);
  });

  it("allows owner or verifier to complete a campaign", async () => {
    await createApprovedCampaign();
    await platform.setVerifier(verifier, true, { from: owner });

    await platform.completeCampaign(1, { from: verifier });
    let campaign = await platform.getCampaign(1);
    assert.equal(campaign.status.toString(), "3");

    await createDefaultCampaign({
      title: "Second Campaign",
      descriptionHash: "ipfs://second-campaign-001",
      category: "Education",
      targetAmount: web3.utils.toWei("4", "ether"),
    });
    await platform.completeCampaign(2, { from: owner });
    campaign = await platform.getCampaign(2);
    assert.equal(campaign.status.toString(), "3");
  });

  it("allows completion from a paused campaign state", async () => {
    await createApprovedCampaign();
    await platform.pauseCampaign(1, reviewReasonHash, { from: owner });

    await platform.completeCampaign(1, { from: owner });

    const campaign = await platform.getCampaign(1);
    assert.equal(campaign.status.toString(), "3");
    assert.notEqual(campaign.closedAt.toString(), "0");
  });

  it("rejects completion from unauthorized wallets", async () => {
    await createApprovedCampaign();

    await expectCustomError(
      platform.completeCampaign.call(1, { from: outsider }),
      "NotCreatorOrVerifier(address)"
    );
  });

  it("rejects completion for already finalized campaigns", async () => {
    await createApprovedCampaign();
    await platform.completeCampaign(1, { from: creator });

    await expectCustomError(
      platform.completeCampaign.call(1, { from: creator }),
      "CampaignAlreadyFinalized(uint256)"
    );

    await createDefaultCampaign({
      title: "Rejected Campaign",
      descriptionHash: "ipfs://rejected-campaign-001",
      category: "Shelter",
      targetAmount: web3.utils.toWei("2", "ether"),
    });
    await platform.rejectCampaign(2, reviewReasonHash, { from: owner });

    await expectCustomError(
      platform.completeCampaign.call(2, { from: owner }),
      "CampaignAlreadyFinalized(uint256)"
    );
  });

  it("rejects updates once a campaign is completed or rejected", async () => {
    await createApprovedCampaign();
    await platform.completeCampaign(1, { from: creator });

    await expectCustomError(
      platform.addCampaignUpdate.call(1, 0, progressUpdateHash, { from: creator }),
      "InvalidStatus(uint256)"
    );

    await createDefaultCampaign({
      title: "Rejected Update Campaign",
      descriptionHash: "ipfs://rejected-update-campaign-001",
      category: "Food",
      targetAmount: web3.utils.toWei("1", "ether"),
    });
    await platform.rejectCampaign(2, reviewReasonHash, { from: owner });

    await expectCustomError(
      platform.addCampaignUpdate.call(2, 0, progressUpdateHash, { from: owner }),
      "InvalidStatus(uint256)"
    );
  });

  it("blocks donations after a campaign is completed", async () => {
    await createApprovedCampaign();
    await platform.completeCampaign(1, { from: creator });

    await expectCustomError(
      platform.donateToCampaign.call(1, { from: outsider, value: web3.utils.toWei("1", "ether") }),
      "CampaignNotActive(uint256)"
    );
  });

  async function createDefaultCampaign(overrides = {}) {
    return platform.createCampaign(
      overrides.title || "Medical Relief Fund",
      overrides.descriptionHash || "ipfs://medical-relief-001",
      overrides.category || "Medical",
      overrides.beneficiaryWallet || beneficiary,
      overrides.targetAmount || web3.utils.toWei("5", "ether"),
      proofBundleHash,
      { from: overrides.from || creator }
    );
  }

  async function createApprovedCampaign(overrides = {}) {
    await createDefaultCampaign(overrides);
    return platform.approveCampaign(1, overrides.tier || 3, { from: overrides.approver || owner });
  }
});

async function expectCustomError(promise, expectedErrorSignature) {
  try {
    await promise;
    assert.fail(`Expected custom error ${expectedErrorSignature}`);
  } catch (error) {
    const revertData = extractRevertData(error);
    const expectedSelector = web3.utils.keccak256(expectedErrorSignature).slice(0, 10);

    assert(
      revertData && revertData.startsWith(expectedSelector),
      `Expected selector ${expectedSelector} for ${expectedErrorSignature}, got ${revertData || error.message}`
    );
  }
}

async function expectRevert(promise, expectedMessageFragment) {
  try {
    await promise;
    assert.fail(`Expected revert containing ${expectedMessageFragment}`);
  } catch (error) {
    assert(
      error.message.includes(expectedMessageFragment),
      `Expected revert containing ${expectedMessageFragment}, got ${error.message}`
    );
  }
}

function extractRevertData(error) {
  if (!error) {
    return null;
  }

  if (typeof error.data === "string" && error.data.startsWith("0x")) {
    return error.data;
  }

  if (error.data && typeof error.data === "object") {
    for (const value of Object.values(error.data)) {
      const nested = extractRevertData(value);
      if (nested) {
        return nested;
      }
    }
  }

  if (typeof error.result === "string" && error.result.startsWith("0x")) {
    return error.result;
  }

  if (typeof error.return === "string" && error.return.startsWith("0x")) {
    return error.return;
  }

  return null;
}
