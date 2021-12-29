const main = async () => {
    const FundraiserFactory = await hre.ethers.getContractFactory("FundraiserFactory");
    const fundraiserFactoryContract = await FundraiserFactory.deploy();
    await fundraiserFactoryContract.deployed();
    console.log("Contract deployed to: ", fundraiserFactoryContract.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

runMain();