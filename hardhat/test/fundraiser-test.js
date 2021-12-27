const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

let accounts;
let beneficiary;
let owner;
let name;
let image;
let description;
let Fundraiser;
let fundraiser;

describe("initialization", () => {
    beforeEach(async () => {
        accounts = await hre.ethers.getSigners();
        beneficiary = accounts[1];
        owner = accounts[0];
        name = "A Great Cause";
        image = "http://thisdoesn'texist.com/image.png";
        description = "moving description";
        Fundraiser = await ethers.getContractFactory("Fundraiser");
        fundraiser = await Fundraiser.deploy(name, image, description, beneficiary.address, owner.address);
        await fundraiser.deployed();
    });

    it("gets the fundraiser name", async () => {
        const actual = await fundraiser.name();
        assert.equal(actual, name, "names should match");
    });

    it("gets the fundraiser image", async () => {
        const actual = await fundraiser.image();
        assert.equal(actual, image, "image should match");
    });

    it("gets the fundraiser description", async () => {
        const actual = await fundraiser.description();
        assert.equal(actual, description, "description should match");
    });

    it("gets the beneficiary", async () => {
        const actual = await fundraiser.beneficiary();
        assert.equal(actual, beneficiary.address, "beneficiary addresses should match");
    });

    it("gets the owner", async () => {
        const actual = await fundraiser.owner();
        assert.equal(actual, owner.address, "bios should match");
    });
});

describe("setBeneficiary", () => {
    beforeEach(async () => {
        accounts = await hre.ethers.getSigners();
        beneficiary = accounts[1];
        newBeneficiary = accounts[2];
        owner = accounts[0];
        name = "A Great Cause";
        image = "http://thisdoesn'texist.com/image.png";
        description = "moving description";
        Fundraiser = await ethers.getContractFactory("Fundraiser");
        fundraiser = await Fundraiser.deploy(name, image, description, beneficiary.address, owner.address);
        await fundraiser.deployed();
    });

    it("updated beneficiary when called by owner account", async () => {
        await fundraiser.setBeneficiary(newBeneficiary.address, { from: owner.address });
        const actualBeneficiary = await fundraiser.beneficiary();
        assert.equal(actualBeneficiary, newBeneficiary.address, "beneficiaries should match");
    });

    it("throws and error when called from a non-owner account", async () => {
        try {
            await fundraiser.setBeneficiary(newBeneficiary.address, { from: accounts[3].address });
            assert.fail("withdraw was not restricted to owners")
        } catch (err) {
            const expectedError = "Contract with a Signer cannot override from"
            const actualError = err.reason;
            assert.equal(actualError, expectedError, "should not be permitted")
        }
    });
});

describe("making donations", () => {
    beforeEach(async () => {
        accounts = await hre.ethers.getSigners();
        beneficiary = accounts[1];
        owner = accounts[0];
        value = ethers.utils.parseEther('0.1');
        donor = accounts[2];
        name = "A Great Cause";
        image = "http://thisdoesn'texist.com/image.png";
        description = "moving description";
        Fundraiser = await ethers.getContractFactory("Fundraiser");
        fundraiser = await Fundraiser.deploy(name, image, description, beneficiary.address, owner.address);
        await fundraiser.deployed();
    });


    it("increases myDonationsCount", async () => {
        const currentDonationsCount = await fundraiser.connect(donor).myDonationsCount();
        await fundraiser.connect(donor).donate({ value });
        const newDonationsCount = await fundraiser.connect(donor).myDonationsCount();

        assert.equal(
            1,
            newDonationsCount - currentDonationsCount,
            "myDonationsCount should increment by 1");
    });

    it("includes donation in myDonations", async () => {
        await fundraiser.connect(donor).donate({ value });
        const resp = await fundraiser.connect(donor).myDonations();
        const actual = resp[0][0];
        const date = resp[1][0];
        expect(value).to.equal(actual);
        assert(date, "date should be present");
    });

    it("increases the totalDonations amount", async () => {
        const currentTotalDonations = await fundraiser.totalDonations();
        await fundraiser.connect(donor).donate({ value });
        const newTotalDonations = await fundraiser.totalDonations();

        const diff = newTotalDonations - currentTotalDonations;

        assert.equal(
            diff,
            value,
            "difference should match the donation value"
        )
    });

    it("increases donationsCount", async () => {
        const currentDonationsCount = await fundraiser.donationsCount();
        await fundraiser.connect(donor).donate({ value });
        const newDonationsCount = await fundraiser.donationsCount();

        assert.equal(
            1,
            newDonationsCount - currentDonationsCount,
            "donationsCount should increment by 1");
    });
});

describe("withdrawing funds", () => {
    beforeEach(async () => {
        accounts = await hre.ethers.getSigners();
        beneficiary = accounts[1];
        owner = accounts[0];
        donor = accounts[2];
        name = "A Great Cause";
        image = "http://thisdoesn'texist.com/image.png";
        description = "moving description";
        Fundraiser = await ethers.getContractFactory("Fundraiser");
        fundraiser = await Fundraiser.deploy(name, image, description, beneficiary.address, owner.address);
        await fundraiser.deployed();
        await fundraiser.connect(donor).donate(
            { value: ethers.utils.parseEther('0.01') }
        );
    });
    it("transfers balance to beneficiary", async () => {
        const currentContractBalance = await ethers.provider.getBalance(fundraiser.address);
        const currentBeneficiaryBalance = await ethers.provider.getBalance(beneficiary.address);
        await fundraiser.withdraw();
        const newContractBalance = await ethers.provider.getBalance(fundraiser.address);
        const newBeneficiaryBalance = await ethers.provider.getBalance(beneficiary.address);
        const beneficiaryDifference = newBeneficiaryBalance.sub(currentBeneficiaryBalance);
        expect(newContractBalance).to.equal(0);
        expect(beneficiaryDifference).to.equal(currentContractBalance);
    });

});

describe("access controls", () => {
    beforeEach(async () => {
        accounts = await hre.ethers.getSigners();
        beneficiary = accounts[1];
        owner = accounts[0];
        nonOwner = accounts[3];
        name = "A Great Cause";
        image = "http://thisdoesn'texist.com/image.png";
        description = "moving description";
        Fundraiser = await ethers.getContractFactory("Fundraiser");
        fundraiser = await Fundraiser.deploy(name, image, description, beneficiary.address, owner.address);
        await fundraiser.deployed();
    });
    it("throws and error when called from a non-owner account", async () => {
        await expect(
            fundraiser.connect(nonOwner).withdraw()).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
    });

    it("permits the owner to call the function", async () => {
        try {
            await fundraiser.withdraw();
            assert(true, "no errors were thrown");
        } catch (err) {
            assert.fail("should not have thrown an error");
        }
    });
});

describe("fallback function", () => {
    beforeEach(async () => {
        accounts = await hre.ethers.getSigners();
        beneficiary = accounts[1];
        owner = accounts[0];
        donor = accounts[2];
        name = "A Great Cause";
        image = "http://thisdoesn'texist.com/image.png";
        description = "moving description";
        Fundraiser = await ethers.getContractFactory("Fundraiser");
        fundraiser = await Fundraiser.deploy(name, image, description, beneficiary.address, owner.address);
        await fundraiser.deployed();
    });
    const value = ethers.utils.parseEther('0.0289');

    it("increases the totalDonations amount", async () => {
        const currentTotalDonations = await fundraiser.totalDonations();
        await donor.sendTransaction(
            { to: fundraiser.address, value }
        );
        const newTotalDonations = await fundraiser.totalDonations();

        const diff = newTotalDonations - currentTotalDonations;

        assert.equal(
            diff,
            value,
            "difference should match the donation value"
        )
    });

    it("increases donationsCount", async () => {
        const currentDonationsCount = await fundraiser.donationsCount();
        await donor.sendTransaction(
            { to: fundraiser.address, value }
        );
        const newDonationsCount = await fundraiser.donationsCount();

        assert.equal(
            1,
            newDonationsCount - currentDonationsCount,
            "donationsCount should increment by 1");
    });
});
