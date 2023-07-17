import * as fcl from "@onflow/fcl";

class FlowClient {
  rollOnFlow = "0x995a5c89574e5e95"
  fungibleToken = "0x9a0766d93b6608b7"
  constructor(fclUser) {
    this.fclUser = fclUser;
  }


  async createDiceEvent(dices, eventNumeric, operator, expirySeconds, amount) {
    const cadence = `
    import RollOnFlow from ${this.rollOnFlow}
    import FungibleToken from ${this.fungibleToken}
    
    transaction {
      let paymentVault: @FungibleToken.Vault
    
      prepare(acct: AuthAccount) {
        let mainFlowVault = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("cannot borrow flowtoken valut from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: 0.1)
      }
    
      execute {
        log(RollOnFlow.createEvent(numberOfDices: ${dices}, eventNumeric: ${eventNumeric}, operator: "${operator}", expirySeconds: ${expirySeconds}, amount: ${amount}, payment: <- self.paymentVault))
      }
    }
    `
    return await this.executeMutation(cadence)
  }

  async roll(eventID) {
    const cadence = `
    import RollOnFlow from ${this.rollOnFlow}
    import FungibleToken from ${this.fungibleToken}
    
    transaction {
      let paymentVault: @FungibleToken.Vault
      prepare(acct: AuthAccount) {
        let mainFlowVault = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("cannot borrow flowtoken valut from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: 0.1)
      }
      execute {
        log(RollOnFlow.roll(eventId: ${eventID}, payment: <- self.paymentVault))
      }
    }
    `
    return await this.executeMutation(cadence)    
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
    `
    return await this.executeMutation(cadence)
  }

  async getAllEvents() {
    const cadence = `
    import RollOnFlow from ${this.rollOnFlow}
    pub fun main(): {UInt64: RollOnFlow.Event} {
        return RollOnFlow.getAllEvents()
    }
    `
    return await this.executeQuery(cadence)
  }

  async eventsList() {
    const mapper = {}
    const contractAddress = "0x995a5c89574e5e95";
    const contractName = "RollOnFlow";
    const rollPublisher = "RollPublisher";
    const paymentPublisher = "PaymentPublisher";
    const roulettePublisher = "RoulettePublisher";

    mapper.rollPublisherEvent = `A.${contractAddress}.${contractName}.${rollPublisher}`;
    mapper.paymentPublisherEvent = `A.${contractAddress}.${contractName}.${paymentPublisher}`;
    mapper.roulettePublisherEvent = `A.${contractAddress}.${contractName}.${roulettePublisher}`;
    return mapper
  }

  async executeMutation(script) {
    const transactionId = await fcl.mutate({
      cadence: script,
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 50,
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
