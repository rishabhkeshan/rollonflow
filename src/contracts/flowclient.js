import * as fcl from "@onflow/fcl";

class FlowClient {
  rollOnFlow = "0x995a5c89574e5e95";
  fungibleToken = "0x9a0766d93b6608b7";
  constructor(fclUser) {
    this.fclUser = fclUser;
  }
  async getUserFlowBalance() {
    const cadence = `
      import FlowToken from ${this.fungibleToken}
      
      pub fun main(address: Address): UFix64 {
        let vaultRef = getAccount(address)
          .getCapability<&FlowToken.Vault{FlowToken.Balance}>(/public/flowTokenBalance)
          .borrow()
          ?? panic("Could not borrow Balance reference to the Vault");
        return vaultRef.balance;
      }
    `;
      console.log("hi", this.fclUser.addr);
    try {
      const result = await fcl.send([
        fcl.script(cadence),
        fcl.args([fcl.arg(this.fclUser.addr, { type: "Address" })]),
      ]);

      const balance = fcl.decode(result);
      return balance;
    } catch (error) {
      console.error("Error fetching Flow balance:", error);
      return 0;
    }
  }

  async createDiceEvent(
    dices,
    eventNumeric,
    operator,
    expirySeconds,
    amount,
    address
  ) {
    const cadence = `
    import RollOnFlow_v02 from ${this.rollOnFlow}
    import FungibleToken from ${this.fungibleToken}
    
    transaction {
      let paymentVault: @FungibleToken.Vault
    
      prepare(acct: AuthAccount) {
        let mainFlowVault = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("cannot borrow flowtoken valut from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: ${parseFloat(
          amount
        ).toFixed(1)})
      }
    
      execute {
        log(RollOnFlow_v02.createEvent(numberOfDices: ${dices}, eventNumeric: ${eventNumeric}, operator: "${operator}", expirySeconds: ${parseFloat(
      expirySeconds
    ).toFixed(1)}, amount: ${parseFloat(amount).toFixed(
      1
    )}, payment: <- self.paymentVault, address: ${address}))
      }
    }
    `;
    return await this.executeMutation(cadence);
  }

  async roll(eventID, amount, address) {
    const cadence = `
    import RollOnFlow_v02 from ${this.rollOnFlow}
    import FungibleToken from ${this.fungibleToken}
    
    transaction {
      let paymentVault: @FungibleToken.Vault
      prepare(acct: AuthAccount) {
        let mainFlowVault = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("cannot borrow flowtoken valut from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: ${parseFloat(
          amount
        ).toFixed(1)})
      }
      execute {
        log(RollOnFlow_v02.roll(eventId: ${eventID}, payment: <- self.paymentVault, address: ${address}))
      }
    }
    `;
    return await this.executeMutation(cadence);
  }

  async roulette(eventType, numeric, amount, address) {
    const cadence = `
    import RollOnFlow_v02 from ${this.rollOnFlow}
    import FungibleToken from ${this.fungibleToken}
    
    transaction {
      let paymentVault: @FungibleToken.Vault
      prepare(acct: AuthAccount) {
        let mainFlowVault = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("cannot borrow flowtoken valut from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: ${parseFloat(
          amount
        ).toFixed(1)})
      }
      execute {
        log(RollOnFlow_v02.roulette(eventType: "${eventType}", numeric: ${numeric}, payment: <- self.paymentVault, address: ${address}))
      }
    }
    `;
    return await this.executeMutation(cadence);
  }

  async helloWorld() {
    const cadence = `
    transaction {
        prepare(acct: AuthAccount) {
          log("Hello from prepare")
        }
        execute {
          log("Hello from execute")
        }
      }   
    `;
    return await this.executeMutation(cadence);
  }

  async getAllEvents() {
    const cadence = `
    import RollOnFlow_v02 from ${this.rollOnFlow}
    pub fun main(): [RollOnFlow_v02.Event] {
        return RollOnFlow_v02.getLiveEvents()
    }
    `;
    return await this.executeQuery(cadence);
  }

  eventsList() {
    const mapper = {};
    const contractAddress = "995a5c89574e5e95";
    const contractName = "RollOnFlow_v02";
    const rollPublisher = "RollPublisher";
    const paymentPublisher = "PaymentPublisher";
    const roulettePublisher = "RoulettePublisher";

    mapper.rollPublisherEvent = `A.${contractAddress}.${contractName}.${rollPublisher}`;
    mapper.paymentPublisherEvent = `A.${contractAddress}.${contractName}.${paymentPublisher}`;
    mapper.roulettePublisherEvent = `A.${contractAddress}.${contractName}.${roulettePublisher}`;
    return mapper;
  }

  async executeMutation(script) {
    const transactionId = await fcl.mutate({
      cadence: script,
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 100,
    });
    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);
    return transaction;
  }

  async executeQuery(script) {
    const result = await fcl.query({
      cadence: script,
    });
    return result;
  }
}

export default FlowClient
