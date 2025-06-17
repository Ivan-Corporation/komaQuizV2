const { expect } = require("chai");

describe("XPToken", function () {
  let XPToken, xp, owner, addr1;

  beforeEach(async function () {
    XPToken = await ethers.getContractFactory("XPToken");
    [owner, addr1] = await ethers.getSigners();
    xp = await XPToken.deploy();
    await xp.deployed();
  });

  it("Should assign the total supply to the owner", async function () {
    const ownerBalance = await xp.balanceOf(owner.address);
    expect(await xp.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    await xp.transfer(addr1.address, 1000);
    expect(await xp.balanceOf(addr1.address)).to.equal(1000);
  });
});
