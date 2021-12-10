const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictBTC", function () {

  let predict;

  beforeEach(async function () {
    const PredictBTC = await ethers.getContractFactory("PredictBTC");
    predict = await PredictBTC.deploy();
    await predict.deployed();
  });

  it("ERC20Token check", async function () {
    expect(await predict.name()).to.equal("PredictBitcoinToken");
    expect(await predict.symbol()).to.equal("PBT");
  });

  it("block.timestamp check", async function () {
    console.log((await predict.deadline_time()).toString());
    console.log((await predict.snapshot_time()).toString());
  });

  it("Play index check", async function () {
    expect(await predict.index()).to.equal(0);
    expect(await predict.avg()).to.equal(0);
    const PlayTx = await predict.play(100);
    await PlayTx.wait();
    expect(await predict.index()).to.equal(1);
    expect(await predict.avg()).to.equal(100);
  });

  it("Play price check", async function () {
    expect(await predict.getPredictPrice()).to.equal(0);
    const PlayTx = await predict.play(100);
    await PlayTx.wait();
    expect(await predict.getPredictPrice()).to.equal(100);
  });

  it("Double Play check", async function () {
    const PlayTx = await predict.play(100);
    await PlayTx.wait();
    try {
      await predict.play(100);
    } catch(error) {
      console.log(error.message);
    }
  });

  it("Distributer check", async function () {
    try {
      await predict.snapshot();
    } catch (error) {
      console.log(error.message);
    }
  })

  it("Calcuration check", async function () {
    expect(await predict.calculate(1000, 1000)).to.equal(50000);
    expect(await predict.calculate(1000, 995)).to.equal(20000);
    expect(await predict.calculate(1000, 1010)).to.equal(10000);
    expect(await predict.calculate(1000, 960)).to.equal(5000);
    expect(await predict.calculate(1000, 1070)).to.equal(2000);
    expect(await predict.calculate(1000, 910)).to.equal(1000);
    expect(await predict.calculate(1000, 1199)).to.equal(500);
    expect(await predict.calculate(1000, 100)).to.equal(0);
  })
});
