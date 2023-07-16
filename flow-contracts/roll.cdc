
access(all) contract RollOnFlow {
    pub fun generator(min: Int, max: Int): Int {
        let currentBlock = getCurrentBlock().height
        let randomSeed = UInt64(currentBlock + UInt64(getCurrentBlock().timestamp))
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
        pub var expiry: UFix64

        init(id: UInt64, numberOfDices: Int, eventNumeric: Int, operator: String, funds: UFix64, eventCreator: Address, expiry: UFix64) {
            self.id = id
            self.numberOfDices = numberOfDices
            self.eventCreator = eventCreator
            self.eventNumeric = eventNumeric
            self.operator = operator
            self.funds = funds
            self.expiry = expiry
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

    access(all) event RollPublisher(id: UInt64, winner: Address, outcome: String, generatedNumeric: Int)

    access(all) var events: {UInt64: Event}
    access(all) var eventCounter: UInt64
    access(all) var eventOutcome: {UInt64: EventOutcome}

    init() {
        self.events = {}
        self.eventCounter = 0
        self.eventOutcome = {}
    }

    pub fun createEvent(
        numberOfDices: Int,
        eventNumeric: Int,
        operator: String,
        expirySeconds: UFix64,
        address: Address,
        funds: UFix64
        ) {
        let currentBlockTime = getCurrentBlock().timestamp
        let expiry = currentBlockTime.saturatingAdd(expirySeconds)


        let newBet: Event = Event(
            id: self.eventCounter + 1,
            numberOfDices: numberOfDices,
            eventNumeric: eventNumeric,
            operator: operator,
            funds: funds,
            eventCreator: address,
            expiry: expiry
        )
        self.events[newBet.id] = newBet
        self.eventCounter = self.eventCounter + 1


    }

    pub fun getAllEvents(): {UInt64: Event} {
        return self.events
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

    pub fun roll(eventId: UInt64, address: Address) {
        let eventData = self.events[eventId]
        // check if event is valid
        assert(eventData != nil, message: "Event does not exists")
        let calculatedMax = eventData!.numberOfDices * 6;
        let generatedNumeric = self.generator(min: 1, max: calculatedMax)
        // check if creator is winner
        var winner = 0
        let op = eventData!.operator
        let numeric = eventData!.eventNumeric
        if op == "=" {
            if generatedNumeric == numeric {
                winner = 1
            }
        } else if op == ">" {
            if generatedNumeric > numeric {
                winner = 1
            }
        } else if op == "<" {
            if generatedNumeric < numeric {
                winner = 1
            }
        } else if op == ">=" {
            if generatedNumeric >= numeric {
                winner = 1
            }
        } else if op == "<=" {
            if generatedNumeric <= numeric {
                winner = 1
            }
        }

        if winner == 1 {
        // creator won
            let eventOutcome = EventOutcome(id: eventData!.id, winner: eventData!.eventCreator, outcome: "won", generatedNumeric: generatedNumeric)
            self.eventOutcome[eventId] = eventOutcome
            emit RollPublisher(id: eventData!.id, winner: eventData!.eventCreator, outcome: "won", generatedNumeric: generatedNumeric)
        } else {
            let eventOutcome = EventOutcome(id: eventData!.id, winner: address, outcome: "lost", generatedNumeric: generatedNumeric)
            self.eventOutcome[eventId] = eventOutcome
            emit RollPublisher(id: eventData!.id, winner: address, outcome: "lost", generatedNumeric: generatedNumeric)
        }

    }

}