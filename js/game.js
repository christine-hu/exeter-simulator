var $body = $('body')
var $loadingScreen = $('#screen-loading')
var $startScreen = $('#screen-start')
var $startBtn = $('.button-start-game', $startScreen)
var $shareItButton = $('.button-share-facebook', $startScreen)
var $tutorialScreen = $('#screen-tutorial')
var $tutorialBtn = $('.button', $tutorialScreen)
var $gameScreen = $('#screen-game')
var $creditsScreen = $('#screen-creits')

var screens = {
  'loading': $loadingScreen,
  'start': $startScreen,
  'tutorial': $tutorialScreen,
  'game': $gameScreen,
  'credits': $creditsScreen
}

var state = { cardDeck : _.clone(window.cards) }
var api = apiFactory(state)
var Storage = StorageFactory()
var sound = soundFactory()
var debugCard = 0

var imagesLoaded = false
var soundsLoaded = false

sound.init(function () {
  soundsLoaded = true
  showStart()
})
sound.instructions()

function preloadImages (urls, allImagesLoadedCallback) {
  var loadedCounter = 0
  var toBeLoadedNumber = urls.length

  urls.forEach(function (url) {
    preloadImage(url, function () {
      loadedCounter++
      if (loadedCounter == toBeLoadedNumber) {
        allImagesLoadedCallback()
      }
    })
  })

  function preloadImage (url, anImageLoadedCallback) {
    var img = new Image()
    img.src = 'img/' + url
    img.onload = anImageLoadedCallback
  }
}

preloadImages([
  'grade-05.png',
  'coach.png',
  'famous-runner.png',
  'grade-06.png',
  'sparkle0.png',
  'backend-dev-01.png',
  'grade-07.png',
  'sparkle1.png',
  'bad-consequence.png',
  'grade-08.png',
  'start-screen-logo.png',
  'card.png',
  'support-01.png',
  'cfo.png',
  'karen-womansteam.png',
  'pre-lives.png',
  'journalist.png',
  'title-screen-background.png',
  'cloud-01.png',
  'muted.png',
  'toggl_header_about.png',
  'cloud-02.png',
  'professor.png',
  'toggl_header.png',
  'defeat-default.png',
  'product-manager.png',
  'toggl_header_upsell.png',
  'defeat-time.png',
  'rapper-01.png',
  'toggl-small-logo.png',
  'designer-01.png',
  'rapper-02.png',
  'twitter-bird.png',
  'designer-02.png',
  'rapper-03.png',
  'unmuted.png',
  'good-consequence.png',
  'richard-branson.png',
  'vc-fred.png',
  'grade-00.png',
  'roy-sales.png',
  'vc-mike.png',
  'grade-01.png',
  'seagull-sheet-large.png',
  'roommate.png',
  'tanya.png',
  'mom.png',
  'teammate.png',
  'tony-physics.png',
  'grade-02.png',
  'seagull-sheet.png',
  'victor-frontend.png',
  'grade-03.png',
  'season-01.png',
  'victory-01.png',
  'grade-04.png',
  'season-02.png'
], function () {
  imagesLoaded = true
  showStart()
})

// Page visibility stuff
var hidden, visibilityChange
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden"
  visibilityChange = "visibilitychange"
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden"
  visibilityChange = "msvisibilitychange"
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden"
  visibilityChange = "webkitvisibilitychange"
}

function handleVisibilityChange () {
  if (document[hidden]) {
    sound.pause()
  } else {
    sound.play()
  }
}

if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
  console.log("Page Visibility API not supported.")
} else {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false)
}

function sparkleAt (x, y) {
  var delay = 50
  var setSparkle = function (x1, y1, which) {
    x1 += ($('.logo').width() - 262) / 2
    $('.sparkle').css('left', x1 + 'px')
    $('.sparkle').css('top', y1 + 'px')
    $('.sparkle0').css('display', (which === 0) ? 'block' : 'none')
    $('.sparkle1').css('display', (which === 1) ? 'block' : 'none')
  }

  setSparkle(x, y, 0)
  window.setTimeout(function () {
    setSparkle(x, y, 1)
    window.setTimeout(function () {
      setSparkle(x, y, 0)
      window.setTimeout(function () {
        setSparkle(x, y, -1)
      }, delay)
    }, delay)
  }, delay)
}

window.setTimeout(function () { sparkleAt(110, 15) }, 1000)
window.setTimeout(function () { sparkleAt(200, 140) }, 2000)
window.setTimeout(function () { sparkleAt(150, 60) }, 2500)
window.setTimeout(function () { sparkleAt(96, 75) }, 4000)
window.setTimeout(function () { sparkleAt(110, 15) }, 8000)
window.setTimeout(function () { sparkleAt(110, 15) }, 15000)

api.reset()

// === Start screen ===
$startBtn.on('click', startTutorial)
if (Storage.getHighscore() !== null) {

  // show highscore if there is on
  var hs = Storage.getHighscore()
  Renderer.renderHighscore(hs)
}

// === Tutorial screen ===
$tutorialBtn.on('click', startGame)

// === Game screen ===
$buttonA.on('click', function () {
  disableButtons()
  $buttonA.addClass('picked')
  var win = api.pickA()
  nextTurn(win)
})
$buttonB.on('click', function () {
  disableButtons()
  $buttonB.addClass('picked')
  var win = api.pickB()
  nextTurn(win)
})
$muteBtn.on('click', function () {
  var muted = sound.toggleMuting()
})

// === Gameover ===
$playAgainBtn.on('click', resetGame)
$shareBtn.on('click', function facebookShare (e) {
  e.preventDefault()
  window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A//christinehu.org/exeter-simulator/')
})

// === Credits ===
$('.button-about').on('click', function () {
  showScreen('credits')
})
$('.button-credits-to-start').on('click', function () {
  showScreen('start')
})

function disableButtons () {
  $($buttonA).attr('disabled', 'disabled')
  $($buttonB).attr('disabled', 'disabled')
}

/**
 * Show start screen if assets are preloaded
 */
function showStart () {
  if (!imagesLoaded || !soundsLoaded) return
  showScreen('start')
}

/**
 * Starts tutorial
 */
function startTutorial () {
  showScreen('tutorial')
}

/**
 * Begins the actual game and initiates the first turn
 */
function startGame () {
  showScreen('game')
  sound.game()
  nextTurn()
}

/**
 * Ends the game, going to gameover screen and saving score
 */
function gameOver () {
  Storage.setHighscore(state.valuation)
  Renderer.renderGameOver()

  sound.stop()
  if (state.win) {
    sound.victory()
    sound.credits()
  } else {
    sound.defeat()
  }
}

function resetGame () {
  api.reset()
  Renderer.renderHighscore(Storage.getHighscore()) // may have changed
  Renderer.renderTime(state.time)
  Renderer.renderHappiness(state.happiness)
  Renderer.renderWeek(state.week)
  showScreen('start')
  sound.instructions()
  Renderer.toggleGameoverButtons()
}

/**
 * Processes the next turn (picking a card is expected to already have been done)
 * Next card will be drawn, UI will be updated and animated.
 * If the game has ended, goes to gameover screen instead.
 * @param  {string|null} win Result of applying the users choice
 */
function nextTurn (win) {
  if (typeof win !== 'undefined' && win !== null) {
    refreshStats()
    return gameOver()
  }

  var card = api.nextCard()

  refreshStats()

  setTimeout(function() {
    Renderer.renderCard(card)
    Renderer.renderButtons(card.choices.a.label, card.choices.b.label)
  }, 200)
}

function debugNextCard () {
  state.card = state.cardDeck[debugCard++]
  Renderer.renderCard(state.card)
}

function refreshStats () {
  Renderer.renderWeek(state.week)
  Renderer.renderTime(state.time)
  Renderer.renderValuation(state.valuation)
  Renderer.renderHappiness(state.happiness)
}

/**
 * Shows given screen
 * @param  {string} screen Screen to show
 */
function showScreen(screen) {
  if (!screens[screen]) return console.error('Invalid screen "%s"', screen)

  $body
    .removeClass(Object.keys(screens).join(' '))
    .addClass(screen)
}