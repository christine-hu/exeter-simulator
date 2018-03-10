/**
 * Basic rules
 * - Hello there fransss
 * - Credit goes to Toggl for writing this code; I adapted it...shamelessly
 * - Game consists of 12 terms.
 * - Each term consists of N cards.
 * - Each card has a question.
 * - Each card has 2 answer options: A and B
 * - Each option affects one of 3 resources in the game: Valuation (Ivy League Admittances), Happiness (GPA) , Time
 * - Time always goes in the negative direction.
 * - Once time runs out, the term is over, and time is reset for the new term.
 * - The aim is to get into 8 Ivy League colleges by increasing the valuation.
 * - The game ends when the weeks run out, or when your GPA dips too low. 
 */

var VALUATION_START_VALUE = 0 // The first card gives some
var VALUATION_GOAL = 8
var VALUATION_MULTIPLIER = 1
var POS_VALUATION_MULTIPLIER = 1.0
var HAPPINESS_START_VALUE = 5
var HAPPINESS_MULTIPLIER = 1
var TIME_MULTIPLIER = 1
var MAX_WEEKS = 12
var TIME_START_VALUE = 10

/**
 * Return a brand new deck
 */
function createCardDeck(cards) {
  return cards || window.cards.concat([])
}

/**
 * Parse a string of conditions into an object.
 * @param  {string}  conditions  week(123) & choice(73.a) & immediate
 * @return {object}             {week: 123, choice: '73.a', immediate: true}
 */
function parseConditions (conditions) {
  if (!_.trim(conditions)) return {}
  return _.reduce(conditions.split('&'), function (acc, item) {
    var name = _.trim(item.split('(')[0])
    var value = item.indexOf('(') !== -1 ? item.match(/\((.+)\)/)[1] : true // true for flags
    if ('' + parseInt(value) === value) value = parseInt(value)
    acc[name] = value
    return acc
  }, {})
}

/**
 * Parse and check card conditions against the game state
 */
function checkConditions(state, conditions) {
  if (conditions.beforeWeek && state.week >= conditions.beforeWeek - 1) return false
  if (conditions.afterWeek && state.week <= conditions.afterWeek - 1) return false
  if (conditions.belowHappiness && state.happiness >= conditions.belowHappiness) return false
  if (conditions.aboveHappiness && state.happiness <= conditions.aboveHappiness) return false
  if (conditions.belowValuation && state.valuation >= conditions.belowValuation) return false
  if (conditions.aboveValuation && state.valuation <= conditions.aboveValuation) return false
  if (conditions.card) {
    var prevCard = _.find(state.discarded, function (c) { return c.id === conditions.card })
    if (!prevCard) return false
  }
  if (conditions.choice) {
    var prevCardId = parseInt(conditions.choice, 10)
    var prevCardChoice = conditions.choice.split('.')[1]
    var prevCard = _.find(state.discarded, function (c) { return c.id === prevCardId })
    if (!prevCard || !prevCard.choices[prevCardChoice].picked) return false
  }
  return true
}

/**
 * Factory that creates the game api bound to a global game state.
 * Mutates the state in place as the game progresses.
 * Usage:
 * - api.reset()
 * - api.nextCard()
 * - api.pickA()
 * - api.nextCard()
 * - ...
 */
function apiFactory (state) {
  return {
    reset: function () {
      state.week = 0
      state.card = null
      state.volume = 1
      state.valuation = VALUATION_START_VALUE
      state.happiness = HAPPINESS_START_VALUE
      state.time = TIME_START_VALUE
      state.win = null
      state.cardDeck = createCardDeck()
      state.discarded = []
      state.defeatReason = null
    },

    /**
     * Push current card into discard pile, pick a new card, add it to state.card and remove it from the deck.
     */
    nextCard: function () {
      if (state.card) {
        state.discarded.push(state.card)
      }
      state.card = this._pickCard()
      // Fetching by id because we modify the card when picking (marking the choice)
      var cardInDeck = _.find(state.cardDeck, function (c) { return c.id === state.card.id })
      if (cardInDeck) {
        state.cardDeck.splice(state.cardDeck.indexOf(cardInDeck), 1) // Remove card from deck
      }
      return state.card
    },

    pickA: function () {
      if (!state.card) throw new Error("Can't pick anything. Card doesn't exist!")
      state.card.choices.a.picked = true
      this._applyChoice(state.card.choices.a.values)
      return this._checkGameState()
    },

    pickB: function () {
      if (!state.card) throw new Error("Can't pick anything. Card doesn't exist!")
      state.card.choices.b.picked = true
      this._applyChoice(state.card.choices.b.values)
      return this._checkGameState()
    },

    setVolume: function (v) {
      state.volume = v
    },

    _applyChoice: function (values) {
      // oh god
      if (state.card.id === 196) return state.valuation += 0 // first card should be 100 (or whatever) but multipliers RUIN EVERYTHING

      if (values.valuation) {
        var valuation = values.valuation
        if (valuation > 0) Math.floor(valuation *= POS_VALUATION_MULTIPLIER) // hack
        state.valuation += valuation * VALUATION_MULTIPLIER || 0
        if (parseInt(state.valuation) < 0) state.valuation = 0
      }
      if (values.happiness) {
        state.happiness += (values.happiness * HAPPINESS_MULTIPLIER) || 0
        if (state.happiness > 11) state.happiness = 11
      }
      if (values.time) {
        state.time += values.time * TIME_MULTIPLIER || 0
      }
    },

    /**
     * Pick a card from the deck.
     * NB! Returns a clone of the card!
     */
    _pickCard: function () {
      var card

      if (!state.cardDeck.length) throw new Error("Ran totally out of cards here!")

      // Attempt to pick an 'immediate'-flagged card first that passes all conditions
      card = _.find(state.cardDeck, function (c) {
        var conditions = parseConditions(c.conditions)
        return conditions && conditions.immediate && checkConditions(state, conditions)
      })
      if (card) return _.cloneDeep(card)

      // Pick random card from deck and only return it if it's applicable in the current state
      // Try for 200 iterations, then bail
      try{
        for (var i = 0; i < 120; i++) {
          // bias towards cards with conditions so it's more likely stories will happen
          var tries = 0
          do {
            card = state.cardDeck[Math.floor(Math.random() * state.cardDeck.length)]
          } while (tries++ < 10 && !_.includes(card.conditions, 'choice(') && !_.includes(card.conditions, 'card('))
          if (checkConditions(state, parseConditions(card.conditions))) return _.cloneDeep(card)
        }
      throw new Error("No applicable card to draw!")
      }
      catch(e){
        card = state.cardDeck[Math.floor(Math.random() * state.cardDeck.length)]
        return _.cloneDeep(card)
      }
      
    },

    _checkGameState: function () {
      if (state.time <= 0) {
        state.week += 1
        state.time = TIME_START_VALUE
      }
      if (state.valuation >= VALUATION_GOAL && state.week >= MAX_WEEKS) {
        state.win = true
      } else if (state.happiness <= 0) {
        state.win = false
        state.defeatReason = 'happiness'
      } else if (state.week >= MAX_WEEKS) {
        state.win = false
        state.defeatReason = 'time'
      }
      return state.win
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = apiFactory
}

$(document).ready(function () {
  $.clickyInit(100857897);
})