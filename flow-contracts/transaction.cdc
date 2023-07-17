import RollOnFlow_v0.1 from "RollOnFlow_v0.1"
import FungibleToken from "FungibleToken"

transaction {
  // let paymentVault: @FungibleToken.Vault

  prepare(acct: AuthAccount) {
    // let mainFlowVault = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("cannot borrow flowtoken valut from acct storage")
    // self.paymentVault <- mainFlowVault.withdraw(amount: 0.1)
  }

  execute {
    // log(RollOnFlow_v0.1.createEvent(numberOfDices: 6, eventNumeric: 1, operator: ">=", expirySeconds: 1000.0, amount: 0.1, address: 0xf8d6e0586b0a20c7, payment: <- self.paymentVault))
    // log(RollOnFlow_v0.1.getAllEvents())
    //log(RollOnFlow_v0.1.roll(eventId: 1, address: 0x0ae53cb6e3f42a79, payment: <- self.paymentVault))
    log(RollOnFlow_v0.1.getAllOutcomes())
    // log(RollOnFlow_v0.1.getOutcome(eventId: 3))
    // log(RollOnFlow_v0.1.getAllOutcomes())
    //log(RollOnFlow_v0.1.gg(payment: <- self.paymentVault))
    //log(RollOnFlow_v0.1.getBalance())
    // log(RollOnFlow_v0.1.sendLmao(to: 0x0ae53cb6e3f42a79, amount: 0.1))
    // log(RollOnFlow_v0.1.getBalance())
  }
}