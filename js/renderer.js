var $cards = {
  0: {
    $el: $('.card0'),
    $image: $('.card0 .card-picture-image'),
    $character: $('.card0 .card-description-character'),
    $description: $('.card0 .card-description-question')
  },
  1: {
    $el: $('.card1'),
    $image: $('.card1 .card-picture-image'),
    $character: $('.card1 .card-description-character'),
    $description: $('.card1 .card-description-question')
  }
}

var $week = $('.calendar-week')
var $weekProgress = $('.calendar-bar-fill')
var $weekProgressDelta = $('.calendar-bar-delta')

var $valuationValue = $('.valuation-value')
var $valuationUnit = $('.valuation-unit')
var $valuationChange = $('.valuation-change')
var $valuationChangeValue = $('.valuation-change-value')
var $happinessValue = $('.happiness-value > img')

var $buttonA = $('.button-yes')
var $buttonB = $('.button-no')
var $gameButtons = $($buttonA).parents('.buttons')
var $gameoverButtons = $('.buttons-gameover')
var $playAgainBtn = $('.button-restart')
var $shareBtn = $('.button-share')
var $muteBtn = $('.button-mute')
var $twitterLink = $('.share-twitter')

var months = {
  0: 'Prep Fall',
  1: 'Prep Winter',
  2: 'Prep Spring',
  3: 'Lower Fall',
  4: 'Lower Winter',
  5: 'Lower Spring',
  6: 'Upper Fall',
  7: 'Upper Winter',
  8: 'Upper Spring',
  9: 'Senior Fall',
  10: 'Senior Winter',
  11: 'Senior Spring',
  12: 'Graduation',
}

var prevValuation = 0
var prevTime = 100

/**
 * Writes given text to the element a few characters at a time, giving
 * the effect of it being typed out.
 * Adapted from https://codepen.io/voronianski/pen/aicwk
 */
function textWriter() {
  // Change this to print more/less chars at a time. More = choppier but a bit better perf.
  // Also the timeout value.
  var increment = 3
  var timeout = 30

  var lastText = ''
  var timeoutId = null

  return function (el, text, n) {
    if (!text || !text.length) return

    // maybe buttons are being tapped quickly
    if (text !== lastText && timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    if (text && n < (text.length)) {
      el.html(text.substring(0, n + 4))
      n += 4
      timeoutId = setTimeout(function() {
        typeWriter(el, text, n)
      }, timeout)
    }
  }
}
var typeWriter = textWriter()

var characterMap = {
  'principal' : 'Principal',
  'teacher': 'Teacher',
  'assembly-speaker': 'Assembly Speaker',
  'dorm-faculty': 'Dorm Faculty',
  'prep': 'Prep',
  'lower': 'Lower',
  'upper': 'Upper',
  'senior': 'Senior',
  'andover-kid': 'Andover Kid',
  'mom': 'Mom',
  'chad': 'Chad, Classmate',
  'charles': 'Charles, Classmate',
  'roommate': 'Roommate',
  'college-counselor': 'College Counselor',

  'UNKNOWN': 'NOT IMPLEMENTED'
}

var currentCardIndex = 0

var Renderer = {
  renderCard: function (card) {
    var iCurrent = currentCardIndex % 2 // 0 or 1
    var iNext = (currentCardIndex + 1) % 2 // 1 or 0
    var c = $cards[iCurrent] // currently visible card
    var cNext = $cards[iNext] // next card

    if (currentCardIndex === 0) {
      // For the first card there is no "current" card, only next
      c.$el.css({ transform: 'translateX(-140%)'}).prop({_rot: 0})
    } else {
      // Animate current card away
      c.$el.css({ transform: 'translateX(0px)'}).prop({_rot: 0})
      c.$el.stop().animate({ _rot: 140 }, {
        duration: 230,
        easing: 'swing',
        step: function (now, fx) {
          $(this).css('transform', 'translateX(' + (-now) + '%)');
        }
      })
    }
    // Animate next card in
    var characters = card.character.replace(' ', '').split(',')
    var character = characters[Math.floor(Math.random() * characters.length)] || 'journalist'
    cNext.$character.text(card.title ? card.title : characterMap[character] || 'NOT IMPLEMENTED PERSON')
    cNext.$image.css('background-image', 'url(img/characters/' + character + '.png)')
    cNext.$description.text('') // clear text otherwise the 2nd previous card text will still be there

    cNext.$el.css({ transition: 'translateX(140%)'}).prop({_rot: 0 })
    cNext.$el.toggleClass('defeat', card.win === false)
    cNext.$el.stop().animate({ _rot: 140 }, {
      duration: 230,
      easing: 'swing',
      step: function (now, fx) {
        $(this).css('transform', 'translateX(' + (140 - now) + '%)')
      },
      complete: function() {
        typeWriter(cNext.$description, card.description, 0)
      }
    })

    currentCardIndex++
  },

  renderWeek (weekNumber) {
    $week.text(months[weekNumber])
  },

  renderTime (value) {
    const viewValue = value * 10
    const delta = prevTime - viewValue
    prevTime = viewValue

    if (delta > 0) { // Normal decrease
      $weekProgress.css('width', viewValue + '%')
      $weekProgressDelta.css('width', delta + '%')
      setTimeout(function() {
        $weekProgressDelta.animate({ width: '0%' }, 200)
      }, 300)
    } else if (viewValue === 100) { // New month special case
      $weekProgressDelta.css('width', $weekProgress.width())
      $weekProgress.css('width', '0%')
      setTimeout(function() {
        $weekProgressDelta.animate({ width: '0%' }, 200, function() {
          $weekProgress.css({
            width: viewValue + '%',
            opacity: 0
          }).animate({opacity: 1}, 300)
        })
      }, 300)
    }
  },

  renderButtons (aText, bText) {
    $buttonA.show().removeClass('picked').removeAttr('disabled').find('.button-middle-content').text(aText)
    $buttonB.show().removeClass('picked').removeAttr('disabled').find('.button-middle-content').text(bText)

    if (aText === bText) $buttonB.hide()
  },

  renderValuation (value) {
    var viewValue = value
    var viewUnit = ''

    $valuationValue.text(viewValue)
    $valuationUnit.text(viewUnit)

    // Float valuation difference red/green when it changes
    if (value !== prevValuation) {
      var difference = value - prevValuation
      var viewDifference = difference > 1000 ? Math.floor(difference / 1000) : difference

      $valuationChangeValue.text(viewDifference < 0 ? viewDifference + viewUnit : '+' + viewDifference + viewUnit)
      $valuationChange
        .css('display', 'block')
        .css('color', value > prevValuation ? '#26bb26' : 'red')
        .animate({
          opacity: 0,
          top: '-=30px'
        }, {
          duration: 1200,
          complete: function onValuationAnimationComplete () {
            $(this)
              .css('display', 'none')
              .css('opacity', 100)
              .css('top', '-10px')
          }
        })
    }
    prevValuation = value
  },

  renderHappiness (value) {
    $happinessValue.removeClass('RAGE JOY')

    if (value <= 0) {
      $happinessValue.prop('src', 'img/grades/grade-00.png')
    } else {
      var level = value
      if (level < 10) level = '0' + level
      $happinessValue.prop('src', 'img/grades/grade-' + level + '.png')

      if (level <= 3) {
        $happinessValue.addClass('RAGE')
      } else if (level >= 9) {
        $happinessValue.addClass('JOY')
      }
    }
  },

  renderGameOver () {
    var win = state.win
    var defeatReason = state.defeatReason
    var valuation = state.valuation
    var currentCard = $cards[currentCardIndex % 2]
    var image = win ? 'victory-01' : 'defeat-default'

    var title = 'You win!'
    var copy = 'You attend Harvard university and burn out in your freshman year!'

    switch (defeatReason) {
      case 'happiness':
        title = 'Your grades blow'
        opts = [
          'Your dreams of Ivy League glory are over, but at least you have daddy\'s trust fund.',
          'You go back to public school and unleash your regrets on the Exeter meme page.'
        ]
        copy = opts[Math.floor(Math.random() * opts.length)]
        break
      case 'time':
        title = 'Out of time'
        image = 'defeat-time'
        if (valuation > 0) {
          copy = 'You were pretty smart, but you\'re just not cool enough to get into all the Ivy Leagues'
        } else {
          copy = 'Not getting into a single Ivy League isn\'t sexy and the prep school world soon forgets about you'
        }
        break
    }

    setupTwitterShareButton(copy, image)
    this.renderCard({
      description: copy,
      title: title,
      character: image,
      win: win
    })
    this.toggleGameoverButtons()
  },

  renderHighscore (hs) {
    if (hs === null) {
      $('.start-highscore').text(0)
      return
    }
    $('.start-highscore').show()
    $('.start-highscore-value').text(hs)
  },

  toggleGameoverButtons: function () {
    $gameButtons.toggle()
    $gameoverButtons.toggle()
  }
}

window.Renderer = Renderer

function setupTwitterShareButton (copy) {
  var url = 'https://twitter.com/home?status='
  // Oh god forgive for what I've done. Some copies didn't leave room for the hashtag and everything else...
  if (copy === 'You raise a lot of money, but being valued at less than a billion is not sexy and the tech world soon forgets about your startup') {
    copy = 'My startup failed to become a unicorn. Not sexy.'
  }
  if (copy === 'Your startup is worth over a billion dollars! You still don\'t have revenue, but who cares - UNICORN, BABY!') {
    copy = 'My startup is worth a billion dollars! Still no profits, but who cares - Unicorn, baby!'
  }
  $twitterLink.attr('href', url + encodeURI(copy) + '%20%23college-simulator%20%40flashframe.io%20' + window.location.href)
}