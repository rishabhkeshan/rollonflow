import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"

access(all) contract RollOnFlow_v02 {
    pub fun generator(min: Int, max: Int, randomizer: Int): Int {
        let currentBlock = getCurrentBlock().height
        let randomSeed = UInt64(currentBlock + UInt64(getCurrentBlock().timestamp) + UInt64(randomizer))
        let random = (randomSeed % UInt64(max - min + 1)) + UInt64(min)
        return Int(random)
    }


    access(all) struct Event {
        pub var id: UInt64
        pub var numberOfDices: Int
        pub var eventNumeric: Int
        pub var operator: String
        pub var funds: UFix64
        pub var eventCreator: Address
        pub var dices: [Int]
        pub var expired: Bool
        pub var expiry: UFix64

        init(id: UInt64, numberOfDices: Int, eventNumeric: Int, operator: String, funds: UFix64, eventCreator: Address, expiry: UFix64) {
            self.id = id
            self.numberOfDices = numberOfDices
            self.eventCreator = eventCreator
            self.eventNumeric = eventNumeric
            self.operator = operator
            self.funds = funds
            self.expiry = expiry
            self.expired = false
            self.dices = [0,0,0,0,0,0]
        }

        pub fun setDices(newDices: [Int]) {
            self.dices = newDices
        }

        pub fun eventExpired() {
            self.expired = true
        }
    }

    access(all) struct EventOutcome {
        pub var id: UInt64
        pub var outcome: String
        pub var winner: Address
        pub var generatedNumeric: Int


        init(id: UInt64, winner: Address, outcome: String, generatedNumeric: Int) {
            self.id = id
            self.outcome = outcome
            self.winner = winner
            self.generatedNumeric = generatedNumeric
        }
    }

    access(all) event RollPublisher(id: UInt64, winner: Address, outcome: String, sum: Int, dices: [Int])
    access(all) event PayementPublisher(id: UInt64, amount: UFix64, winner: Address)
    access(all) event RoulettePublisher(address: Address, result: Int, outcome: String, type: String)

    access(all) var events: {UInt64: Event}
    access(all) var eventCounter: UInt64
    access(all) var eventOutcome: {UInt64: EventOutcome}
    access(all) var rouletteRed: [Int]
    access(all) var rouletteCol1: [Int]
    access(all) var rouletteCol2: [Int]
    access(all) var rouletteCol3: [Int]

    init() {
        self.events = {}
        self.eventCounter = 0
        self.eventOutcome = {}
        self.rouletteCol1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
        self.rouletteCol2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]
        self.rouletteCol3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
        self.rouletteRed = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3]
    }

    pub fun createEvent(
        numberOfDices: Int,
        eventNumeric: Int,
        operator: String,
        expirySeconds: UFix64,
        amount: UFix64,
        payment: @FungibleToken.Vault,
        address: Address
        ) {
        let vaultRef = getAccount(self.account.address).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            .borrow()
            ?? panic("Could not borrow reference to the Vault")
        vaultRef.deposit(from: <- payment)
            
        let currentBlockTime = getCurrentBlock().timestamp
        let expiry = currentBlockTime.saturatingAdd(expirySeconds)


        let newBet: Event = Event(
            id: self.eventCounter + 1,
            numberOfDices: numberOfDices,
            eventNumeric: eventNumeric,
            operator: operator,
            funds: amount,
            eventCreator: address,
            expiry: expiry
        )
        self.events[newBet.id] = newBet
        self.eventCounter = self.eventCounter + 1
    }

    pub fun getAllEvents(): {UInt64: Event} {
        return self.events
    }

    pub fun getLiveEvents(): [Event] {
        var live: [Event] = []
        for key in self.events.keys {
            let value = self.events[key]
            let currentBlockTime = getCurrentBlock().timestamp
            if value!.expiry > currentBlockTime && !(value!.expired) {
                live.append(value!)
            }
        }
        return live
    }

    pub fun getEvent(eventId: UInt64): Event? {
        return self.events[eventId]
    }

    pub fun getCounter(): UInt64 {
        return self.eventCounter
    }

    pub fun getAllOutcomes(): {UInt64: EventOutcome} {
        return self.eventOutcome
    }

    pub fun getOutcome(eventId: UInt64): EventOutcome? {
        return self.eventOutcome[eventId]
    }

    pub fun roll(eventId: UInt64, payment: @FungibleToken.Vault, address: Address) {
        let balance = payment.balance
        let vaultRef = getAccount(self.account.address).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            .borrow()
            ?? panic("Could not borrow reference to the Vault")
        vaultRef.deposit(from: <- payment)


        let eventData = self.events[eventId]
        
        // check if event is valid
        assert(eventData != nil, message: "Event does not exists")
        let currentBlockTime = getCurrentBlock().timestamp
        assert(eventData!.expiry > currentBlockTime , message: "Event has expired")

        var a = 0
        var sum = 0
        var newDices: [Int] = []
        while a < eventData!.numberOfDices {
            let generatedNumeric = self.generator(min: 1, max: 6, randomizer: a)
            newDices.insert(at: a, generatedNumeric)
            sum = sum + generatedNumeric
            a = a+1
        }
        eventData!.setDices(newDices: newDices)
        eventData!.eventExpired()
        // check if creator is winner
        var winner = 0
        let op = eventData!.operator
        let numeric = eventData!.eventNumeric
        if op == "=" {
            if sum == numeric {
                winner = 1
            }
        } else if op == ">" {
            if sum > numeric {
                winner = 1
            }
        } else if op == "<" {
            if sum < numeric {
                winner = 1
            }
        } else if op == ">=" {
            if sum >= numeric {
                winner = 1
            }
        } else if op == "<=" {
            if sum <= numeric {
                winner = 1
            }
        }

        if winner == 1 {
        // creator won
            let eventOutcome = EventOutcome(id: eventData!.id, winner: eventData!.eventCreator, outcome: "won", generatedNumeric: sum)
            self.eventOutcome[eventId] = eventOutcome
            self.send(to: eventData!.eventCreator, amount: eventData!.funds.saturatingAdd(balance))
            emit PayementPublisher(id: eventData!.id, amount: eventData!.funds.saturatingAdd(balance), winner: eventData!.eventCreator)
            emit RollPublisher(id: eventData!.id, winner: eventData!.eventCreator, outcome: "won", sum: sum, dices: eventData!.dices)
        } else {
            let eventOutcome = EventOutcome(id: eventData!.id, winner: address, outcome: "lost", generatedNumeric: sum)
            self.eventOutcome[eventId] = eventOutcome
            self.send(to: address, amount: eventData!.funds.saturatingAdd(balance))
            emit PayementPublisher(id: eventData!.id, amount: eventData!.funds.saturatingAdd(balance), winner: address)
            emit RollPublisher(id: eventData!.id, winner: address, outcome: "lost", sum: sum, dices: eventData!.dices)
        }
        // setting back updated event data
        self.events[eventData!.id] = eventData
    }

    pub fun roulette(eventType: String, numeric: Int,  payment: @FungibleToken.Vault, address: Address): Int {
        let balance = payment.balance
        let vaultRef = getAccount(self.account.address).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            .borrow()
            ?? panic("Could not borrow reference to the Vault")
        vaultRef.deposit(from: <- payment)

        let generatedNumeric = self.generator(min: 1, max: 36, randomizer: 5)
        var winner = 0
        if eventType == "even" {
            if generatedNumeric % 2 == 0 {
                winner = 1
            }
        } else if eventType == "col1" {
            if self.rouletteCol1.contains(generatedNumeric) {
                winner = 1
            }
        } else if eventType == "col2" {
            if self.rouletteCol2.contains(generatedNumeric) {
                winner = 1
            }
        } else if eventType == "col3" {
            if self.rouletteCol3.contains(generatedNumeric){
                winner = 1
            }
        } else if eventType == "odd" {
            if generatedNumeric % 2 != 0 {
                winner = 1
            }
        } else if eventType == "red" {
            if self.rouletteRed.contains(generatedNumeric) {
                winner = 1
            }
        } else if eventType == "black" {
            if !self.rouletteRed.contains(generatedNumeric) {
                winner = 1
            }
        } else if eventType == "high" {
            if generatedNumeric >= numeric {
                winner = 1
            }
        } else if eventType == "low" {
            if generatedNumeric <= numeric {
                winner = 1
            }
        }

        if winner == 1 {
            //creator won
            self.send(to: address, amount: balance.saturatingMultiply(2.0))
            emit PayementPublisher(id: 0, amount: balance.saturatingMultiply(2.0), winner: address)
            emit RoulettePublisher(address: address, result: generatedNumeric, outcome: "won", type: eventType)
        } else {
            emit RoulettePublisher(address: address, result: generatedNumeric, outcome: "lost", type: eventType)
        }
        return winner
    }

    pub fun getBalance(): UFix64 {
        let vaultRef = getAccount(self.account.address)
            .getCapability(/public/flowTokenBalance)
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")
        return vaultRef.balance
    }

    pub fun send(to: Address, amount: UFix64) {
        let mainFlowVault = self.account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("cannot borrow flowtoken valut from acct storage")
        let vaultRef = getAccount(to).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            .borrow()
            ?? panic("Could not borrow reference to the Vault")
        vaultRef.deposit(from: <- mainFlowVault.withdraw(amount: amount))
    }
}