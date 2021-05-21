const { expect } = require('chai')

describe('CoinCoin Token', function () {
  let CoinCoin, coincoin, dev, owner, alice, bob, charlie, dan, eve
  const NAME = 'CoinCoin'
  const SYMBOL = 'COIN'
  const INITIAL_SUPPLY = ethers.utils.parseEther('8000000000')

  beforeEach(async function () {
    [dev, owner, alice, bob, charlie, dan, eve] = await ethers.getSigners()
    CoinCoin = await ethers.getContractFactory('CoinCoin')
    coincoin = await CoinCoin.connect(dev).deploy(owner.address, INITIAL_SUPPLY)
    await coincoin.deployed()
    /*
    Il faudra transférer des tokens à nos utilisateurs de tests lorsque la fonction transfer sera implementé
    await coincoin
      .connect(owner)
      .transfer(alice.address, ethers.utils.parseEther('100000000'))
      */
  })

  describe('Deployement', function () {
    it('Has name CoinCoin', async function () {
      expect(await coincoin.name()).to.equal(NAME)
    })
    it('Has symbol Coin', async function () {
      expect(await coincoin.symbol()).to.equal(SYMBOL)
    })
    it('mints initial Supply to owner', async function () {
      let coincoin = await CoinCoin.connect(dev).deploy(
        owner.address,
        INITIAL_SUPPLY
      )
      expect(await coincoin.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY)
    })

    it('emits event Transfer when mint totalSupply', async function () {
      /*
      Pb de récupération de l'event d'une transaction passée avec Waffle: Sofiane s'en occupe
      await expect(
        CoinCoin.connect(dev).deploy(
          owner.address,
          ethers.utils.parseEther('8000000000')
        )
      ).to.emit(, 'Transfer').withArgs(ethers.constants.AddressZero, owner.address, ethers.utils.parseEther('8000000000'));
      */
    })
  })

  describe('Approve system', function () {
    it('Approves new spender for owner', async function () {
      await expect(await coincoin.connect(owner).approve(alice.address, 500))
        .to.emit(coincoin, 'Approval')
        .withArgs(owner.address, alice.address, 500);
    })
    it('should amount allowance is right', async function () {
      await coincoin.connect(owner).approve(charlie.address, 500);
      expect(await coincoin.allowance(owner.address, charlie.address)).to.equal(500)
    })
    it("Should approve function revert for address zero spender", async function () {
      await expect(coincoin.connect(owner).approve(ethers.constants.AddressZero, 500)).to.be.revertedWith('CoinCoin: approve to the zero address');
    });
  })

  describe('Token transfers', async function () {

    it('transfers tokens from sender to recipient', async function () {
      const initialBobBalances = await coincoin.balanceOf(bob.address)
      await coincoin.connect(owner).transfer(bob.address, 1000)
      expect(await coincoin.balanceOf(bob.address)).to.equal(initialBobBalances + 1000);
    })
    it("Should transfer function revert for not enough funds to transfer", async function () {
      const overedBobBalances = await coincoin.balanceOf(bob.address) + 10
      await coincoin.connect(bob)
      await expect(coincoin.transfer(eve.address, overedBobBalances)).to.be.revertedWith('CoinCoin: Not enough Ether to transfer');
    });

    /*it('transferFrom tokens from sender to recipient', async function () {
      
    })
    */
    it('emits event Transfer when transfer token', async function () {
      await expect(coincoin.connect(owner).transfer(alice.address, 1000))
        .to.emit(coincoin, 'Transfer')
        .withArgs(owner.address, alice.address, 1000);
    })

    /*it('emits event Transfer when transferFrom token', async function () {
      
    })
    */
  })
})
