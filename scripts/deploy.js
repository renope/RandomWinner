const { ethers } = require("hardhat");
const { verify } = require("./utils/verifier.js")

  async function deploy() {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const ticketPrice = (10 ** 16).toString()  // 0.01 ETH
    const duration = (24 * 60 * 60).toString() // 24 hours
      
    // deploy
    const Cont = await ethers.getContractFactory("RandomWinner");
    const rw = await Cont.deploy(
      ticketPrice,
      duration
    );

    console.log("Cont address : ", rw.address);

    await delay(5000);
    await verify(rw.address, [ticketPrice, duration])
  }

  deploy();