/* global describe it before ethers */

const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { assert, expect } = require('chai')


describe('Random winner test', async function () {

    let deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10

    const ticketPrice = (10 ** 16).toString()  // 0.01 ETH
    const duration = 24 * 60 * 60 // 24 hours
    let rw
      

    before(async function () {
        const accounts = await ethers.getSigners();
        [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10] = accounts
    }) 

    it('should deploy contract without any Errors', async () => {
        const Cont = await ethers.getContractFactory("RandomWinner");
        rw = await Cont.deploy(
          ticketPrice,
          duration
        );
    })
    
    it('purchase first ticket', async () => {
        assert.equal(await rw.balance(), 0)
        assert.equal(await rw.ticketCounter(), 0)
        assert.equal((await rw.userTickets(user1.address)).length, 0)

        await expect(
            rw.connect(user1).purchaseTicket()
        ).to.be.revertedWith("RandomWinner: insufficient fee")

        await rw.connect(user1).purchaseTicket({value : (10 ** 16).toString()});

        assert.equal(await rw.balance(), (10 ** 16).toString())
        assert.equal(await rw.ticketCounter(), 1)
        assert.equal((await rw.userTickets(user1.address)).length, 1)
    })
    
    it('purchase 3 tickets by user2', async () => {
        assert.equal((await rw.userTickets(user2.address)).length, 0)

        await rw.connect(user2).purchaseTicket({value : (10 ** 16).toString()});
        await rw.connect(user2).purchaseTicket({value : (10 ** 16).toString()});
        await rw.connect(user2).purchaseTicket({value : (10 ** 16).toString()});

        assert.equal(await rw.balance(), (4 * 10 ** 16).toString())
        assert.equal(await rw.ticketCounter(), 4)
        assert.equal((await rw.userTickets(user2.address)).length, 3)
    })
    
    it('purchase 2 tickets by user3', async () => {
        await rw.connect(user3).purchaseTicket({value : (10 ** 16).toString()});
        await rw.connect(user3).purchaseTicket({value : (10 ** 16).toString()});
        await rw.connect(user3).purchaseTicket({value : (10 ** 16).toString()});
    })
    
    it('roll dice', async () => {
        await expect(
            rw.rollDice()
        ).to.be.revertedWith("RandomWinner: The deadline has not yet arrived.")

        await time.increase(duration)

        await rw.rollDice()

        assert.equal(await rw.balance(), 0)

        console.log(await rw.winner())
    })
})