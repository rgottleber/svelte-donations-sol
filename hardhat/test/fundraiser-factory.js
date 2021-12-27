const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

let accounts;
let beneficiary;
let owner;
let name;
let image;
let description;
let FundraiserFactory;
let fundraiserFactory;

describe("FundraiserFactory: deploy", () => {
    it("has been deployed", async () => {
        FundraiserFactory = await ethers.getContractFactory("FundraiserFactory");
        fundraiserFactory = await FundraiserFactory.deploy();
        await fundraiserFactory.deployed();
        assert(fundraiserFactory, "address should be set");
    });
})
describe("FundraiserFactory: createFundraiser", () => {
    beforeEach(async () => {
        accounts = await hre.ethers.getSigners();
        beneficiary = accounts[1];
        owner = accounts[0];
        name = "A Great Cause";
        image = "http://thisdoesn'texist.com/image.png";
        description = "moving description";
        FundraiserFactory = await ethers.getContractFactory("FundraiserFactory");
        fundraiserFactory = await FundraiserFactory.deploy();
        await fundraiserFactory.deployed();

    })
    it("increments the fundraiserCount", async () => {
        const currentFundraiserCount = await fundraiserFactory.fundraiserCount();
        await fundraiserFactory.createFundraiser(name, image, description, beneficiary.address);
        const newFundraiserCount = await fundraiserFactory.fundraiserCount();
        console.log(currentFundraiserCount, newFundraiserCount);
        assert(newFundraiserCount.eq(currentFundraiserCount + 1), "fundraiser count should increase by 1");
    });
});