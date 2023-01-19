const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Units tests of Bank smart contract", function () {
        let accounts;
        let bank;

        before(async() => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
        })

        describe("Deposit", function() {
            beforeEach(async() => {
                await deployments.fixture(["bank"])
                bank = await ethers.getContract("Bank")
            })

            it("should NOT deposit ethers if not enough funds are deposited", async function() {
                await expect(bank.deposit()).to.be.revertedWith("Not enough funds deposited")
            })

            it("should deposit ethers on the smart contract if enough funds/ethers are deposited", async function() {
                //deployer deposits 1000 Wei
                await expect(await bank.deposit({ value: 1000 })).to.emit(
                    bank,
                    "etherDeposited"
                )
                let account = await bank.getBalanceAndLastDeposit()
                assert(account.balance.toString() === "1000");
                assert(account.lastDeposit.toString().length === 10)
            })

            it("should deposit ethers on the smart contract if enough funds/ethers are deposited and the user is not the owner", async function() {
                await expect(await bank.connect(accounts[1]).deposit({ value: 10000 })).to.emit(
                    bank,
                    "etherDeposited"
                )
                let account = await bank.connect(accounts[1]).getBalanceAndLastDeposit()
                assert(account.balance.toString() === "10000");
                assert(account.lastDeposit.toString().length === 10)
            })
        })

        describe("Withdraw", function() {
            beforeEach(async() => {
                await deployments.fixture(["bank"])
                bank = await ethers.getContract("Bank")
                await bank.deposit({ value: 1000 })
                await bank.connect(accounts[1]).deposit({ value: 10000 })
            })

            it("should NOT withdraw if no ethers are on the smart contract for this address", async function() {
                await expect(bank.connect(accounts[2]).withdraw(1000)).to.be.revertedWith("Not enough funds")
            })

            it("should NOT withdraw if the account is trying to withdraw more ethers than what he deposited on the smart contract", async function() {
                await expect(bank.withdraw(1200)).to.be.revertedWith("Not enough funds")
            })

            it("should withdraw if enough ethers are deposited by this account on the smart contract", async function() {
                const balanceOfDeployer = await deployer.getBalance()
                
                // GAS COST
                const transactionResponse = await bank.withdraw(900)
                const transactionReceipt = await transactionResponse.wait()
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
    
                let bn900 = ethers.BigNumber.from("900")
                let newBalanceOfDeployer = await deployer.getBalance()
    
                let result = balanceOfDeployer.add(bn900).sub(gasCost)
                assert.equal(result.toString(), newBalanceOfDeployer.toString())
    
                let account = await bank.getBalanceAndLastDeposit()
                assert(account.balance.toString() === "100");
                assert(account.lastDeposit.toString().length === 10)
            })

            it("should withdraw if enough ethers are deposited by this account on the smart contract and account not the owner", async function() {
                const balanceOfAccount1 = await accounts[1].getBalance()
                
                // GAS COST
                const transactionResponse = await bank.connect(accounts[1]).withdraw(10000)
                const transactionReceipt = await transactionResponse.wait()
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
    
                let bn10000 = ethers.BigNumber.from("10000")
                let newBalanceOfAccount1 = await accounts[1].getBalance()
    
                let result = balanceOfAccount1.add(bn10000).sub(gasCost)
                assert.equal(result.toString(), newBalanceOfAccount1.toString())
    
                let account = await bank.connect(accounts[1]).getBalanceAndLastDeposit()
                assert(account.balance.toString() === "0");
                assert(account.lastDeposit.toString().length === 10)
            })
        })

        describe("Workflow status Tests", function() {
            before(async() => {
                await deployments.fixture(["bank"])
                bank = await ethers.getContract("Bank")
            })

            it("should deposit ethers on the smart contract if enough funds/ethers are deposited", async function() {
                //deployer deposits 1000 Wei
                await expect(await bank.deposit({ value: 1000 })).to.emit(
                    bank,
                    "etherDeposited"
                )
                let account = await bank.getBalanceAndLastDeposit()
                assert(account.balance.toString() === "1000");
                assert(account.lastDeposit.toString().length === 10)
            })

            it("should withdraw if enough ethers are deposited by this account on the smart contract", async function() {
                const balanceOfDeployer = await deployer.getBalance()
                //GAS COST
                const transactionResponse = await bank.withdraw(900)
                const transactionReceipt = await transactionResponse.wait()
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
    
                let bn900 = ethers.BigNumber.from("900")
                let newBalanceOfDeployer = await deployer.getBalance()
    
                let result = balanceOfDeployer.add(bn900).sub(gasCost)
                assert.equal(result.toString(), newBalanceOfDeployer.toString())
    
                let account = await bank.getBalanceAndLastDeposit()
                assert(account.balance.toString() === "100");
                assert(account.lastDeposit.toString().length === 10)
            })
        })


    })

        