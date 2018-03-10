var pstats = {}

function checkTimesMuted () {
  if (window && (window.timesMuted > 10)) {
    $('body').html(' ')
    sound.sound.mute(true)
    sound.sfx.mute(true)
    $('body').css('margin-left', '2rem')
    $('body').css('margin-top', '1rem')
    $('body').css('text-align', 'left')
    window.eggplace = $('<div style="background-color: black; opacity: 0.8; color: #ccc; max-width: 680px; padding-left: 1rem; padding-top: 1px; padding-bottom: 1rem; margin-bottom: 1rem; padding-right: 2rem;"></div>')
    $('body').append(window.eggplace)
    sound.dreameater = function () {
      sound._next('dreameater', true)
    }
    sound.peacekeeper = function () {
      sound.sound.off('end')
      sound.sound.fade(1, 0, 200, sound.current)
      sound.current = sound.sound.play('peacekeeper')
      sound.sound.loop(true, sound.current)
      sound.sound.fade(0, 1, 10000, sound.current)
    }
    sound.killpeacekeeper = function () {
      sound.sound.fade(1, 0, 1000, sound.current)
    }
    pstats = {}
    window.eggman()
    //window.eggdk3()
  }
}

var lastchoices = []

var dogs = function () {}

function choice (i) {
  $(lastchoices[i].children('a')).html('&gt; ' + $(lastchoices[i].children('a')).html())
  $('a').attr('href', 'javascript:void(0);')
  $('a').css('color', '#888')
  dogs(i);
}

function egg (html, nfun, choice1txt, choice2txt, choice3txt, choice4txt) {
  dogs = nfun || dogs
  if (html.constructor === Array) {
    for (var j = 0; j < html.length; j++) {
      if (html[j][0] === '*') {
        html[j] = "<p style='color: yellow;'>\"" + html[j].substr(1) + "\"</p>"
      } else if (html[j][0] === '$') {
        html[j] = "<p style='color: lightgreen;'>\"" + html[j].substr(1) + "\"</p>"
      } else if (html[j][0] === '^') {
        html[j] = "<p style='color: lightblue;'>\"" + html[j].substr(1) + "\"</p>"
      } else if (html[j][0] === '@') {
        html[j] = "<p style='color: white; opacity: 1.0;'>\"" + html[j].substr(1) + "\"</p>"
      } else {
        html[j] = "<p>" + html[j] + "</p>"
      }
    }
    $(window.eggplace).append(html.join('\n'))
  } else {
    $(window.eggplace).append(html)
  }
  var ctxt = [choice1txt, choice2txt, choice3txt, choice4txt]
  lastchoices = [];
  for (var i = 0; i < 4; i++) {
    if (ctxt[i]) {
      var al = $('<p><a style="color: #0ff;" href="javascript:choice(' + i + ');">' + ctxt[i] + '</a></p>')
      lastchoices[i] = al
      $(window.eggplace).append(al)
    }
  }
  $("html, body").scrollTop($(document).height())
}

function eggman () {
  sound.sound.mute(false)
  sound.dreameater()
  egg(["To your surprise, the computer you are using dissolves.",
    "In its place is a man with eyebrows like woodlice and a smile like a croissant."],
    eggman2, 'I am surprised', 'Request croissant')
}

function eggman2 (i) {
  if (i === 0) {
    egg(["As well you might be.",
      "But in his own land, this man is a <i>king</i>, and he demands you treat him like one."],
      eggman2a, 'Actually it was I who was the king. This was all a subtle ruse', 'Kneel and pull down your trousers')
  } else {
    egg(["You understood his coded message. +10 points to Gryffindor!",
      "The music swells - so subtly, you don't even notice it - as his mouth levitates centimetres forward."],
      eggman2b, 'Very good')
  }
}

var donerMoney = false
var donerHugs = false
var donerLove = false
var donerWorldPeace = false
var numHugs = 0

function eggman2a (i) {
  if (i === 0) {
    egg(["Yes. It took you years to pull this one off.",
      "You studied hard in Ruse College. You got up very early in the morning.",
      "You got a mere passing grade in Treating People Like A King class, as you repeatedly refused to take off your trousers. But you knew your goal.",
      "Christ, I'm sweating bullets here. You've really rused me. I'm rused hard."],
      eggruse0, 'It was all worth it')
    donerMoney = false
    donerHugs = false
    donerLove = false
    donerWorldPeace = false
    numHugs = 0
  } else {
    egg(["You assume the position.",
      "He waits 3.2 seconds as King Arthur of legend once did, and then waves you and your clothes up. As ritual dictates.",
      "His voice is raspy and bready at first, but eventually the buttery core comes through:",
      "*I deign to bring you news from far-away parts. Please receive this story in the manner in which it was given: eventually.",
      "*The <i>Dreameater</i> is here. In this place.",
      "Heady news. You know the <i>Dreameater</i> attacks anyone who is not a gainfully employed programmer.",
      "But, in the right hands..."],
      eggdk0, 'I must find it', 'I must leave my job/sofa and work for Toggl')
  }
}

function eggruse0 (i) {
  egg(
    ["What do you want from me?"],
    eggruse1,
    donerMoney ? null : 'Money',
    donerHugs ? null : 'Hugs',
    donerLove ? null : 'Love',
    donerWorldPeace ? null : 'World Peace'
  )
  if (donerMoney && donerHugs && donerLove && donerWorldPeace) {
    egg(["But wait, but... No. Nah. You wouldn't want it."], eggruse2, 'Tell me.')
  }
}

function eggruse1 (i) {
  if (i === 0) {
    egg(["I don't have any."], eggruse0, 'Something else...')
    donerMoney = true
  } else if (i === 1) {
    egg(["I can get behind that!"], egghug, '<i>*hugs*</i>')
    donerHugs = true
  } else if (i === 2) {
    egg(["Sorry, I'm already taken. And by that I mean consumed with self-loathing and pessimism."], eggruse0, 'You deserve it')
    donerLove = true
  } else if (i === 3) {
    egg(["When battle can rage even within a single person, how could we possibly make peace with the world?"], eggwp, 'Try', 'Good point')
    donerWorldPeace = true
  } else if (i === 4) {
    egg(["A million white doves land gently upon your cap. It fills you with hope, and the knowledge of all that is to come.",
    "Several dogs come up to you. Apparently all dogs have agreed to stop barking except when you want them to.",
    "Here are my credit card details: 124566-4322-2545-326575. PIN 098. I've got money to spare. Take a couple mill.",
    "I've talked to the president. All of them. No nukes today."], eggnut, 'Hooray!')
  }
}

function egghug (i) {
  if (i === 0) {
    egg(["Yay! <i>*hugs back*</i>",
    "We have commenced " + numHugs + " hug(s). If you reach " + window.YOU_HAVE_BEEN_TRULY_RUSED + ", something might happen."],
    egghug, '<i>*hugs*</i>', 'Enough')
    numHugs++
    if (numHugs > window.IT_MUST_BE_HARD_BEING_THIS_RUSED) {
      // ???? 1 million dollars
    }
  } else {
    eggruse0()
  }
}

function eggruse2 () {
  egg(["No, you'll think it's silly."], eggruse3, "Yes but I want to know anyway")
}

function eggruse3 () {
  egg(["Well... how does the <b><i>Dreameater</i></b> sound?!?"], eggruse4, 'Christ. Fine')
}

function eggruse4 () {
  egg(["With an audible clunk, the story shifts to the search for the <i>Dreameater</i>, that valuable void which somehow hunts unemployed programmers but is actually worth a pretty penny.<hr>"])
  eggdk0(0)
}

function eggwp (i) {
  if (i === 0) {
    egg(["Ban Ki-moon said no"], eggruse0, 'Figures')
  } else {
    egg(["I know. That's why I said it."], eggruse0, '...')
  }
}

function eggnut () {
  egg(["But actually, it was a ruse."], function () {}, 'I have been rused. I admit defeat.')
}

function eggman2b (i) {
  egg(["<i>Too</i> good. Too good to be true.",
    "The rest of his head peels open like so many bad cans of pineapple chunks, and three slightly smaller people jump out from (ostensibly) his skin."],
    eggmanuruse0, 'Oh no!', 'Do they work for Toggl?')
}

function eggmanuruse0 (i) {
  if (i === 0) {
    egg(["Oh <i>very</i>, <i><b>v<u>e<sup>r</sup><sub>y</sub></u></b></i> no.",
    "Even now, the one with the knife is doing some hoopy Indiana Jones thing with it," +
    " and the others are saying 'I am going to kill you' over and over."],
    eggmanuruse1, 'Run!', 'We can\'t be sure they mean harm')
  } else {
    egg(["No, they do not.",
    "They are making threatening gestures towards you. One of them has a knife."],
    eggmanruseiii, 'Panic', 'Give up')
  }
}

function eggmanruseiii (i) {
  if (i === 1) {
    egg(["You know who would never give you up? Toggl.",
    "Toggl would never give you up.",
    "Toggl would never let you down.",
    "Toggl would never run around and, desert you."], eggmanuruse1, 'Thank you for that')
  } else {
    eggmanuruse1(i)
  }
}

function eggmanuruse1 (i) {
  if (i === 0) {
    egg(["You're panicking a bit now. But.. but WAIT - you came prepared!",
    "You whip out your time-tracking solution, and with a few slashes, they're all in a million bajillion little pieces!!!"],
    eggmanuruse2, 'A... time-tracking solution?', 'Very good')
  } else {
    egg(["That is a very stupid thing to think."], eggmanuruse1, 'Just testing. RUN!')
  }
}

function eggmanuruse2 (i) {
  if (i === 0) {
    egg(["Yes. You cut into surfaces with it, leaving indentations to show the passage of time.",
    "...",
    "... It's a sword."], eggmanuruse3, 'Please say sword next time')
  } else {
    eggmanuruse3()
  }
}

function eggmanuruse3 () {
  egg(["Wonderous! Astounding! ... But, um, now we have neither quest nor quest-giver.",
  "I'm not really sure what to do."], eggmanuruse4, 'What about the <i>Dreameater</i>?')
}

function eggmanuruse4 () {
  egg(["The what now?"], eggmanuruse5, 'The <i>Dreameater</i> is this thing that catches ' +
  'unemployed programmers somehow. But apparently it\'s worth a lot.')
}

function eggmanuruse5 () {
  egg(["Oh, the <i>Dreameater</i>. That old thing? Well, sure.",
  "I guess we've got time to fill.",
  "It is worth an awful lot. 50/50?"], eggmanuruse6, "60/40")
}

function eggmanuruse6 () {
  egg(["Deal.<hr>"])
  eggdk0(0)
}

function eggdk0 (i) {
  if (i === 0) {
    egg(["And where to catch a <i>Dreameater</i>, but in the land of dream itself...?"])
    $('body').css('transition', 'background-color 5s')
    $('body').css('background-color', 'blueviolet')
    window.setTimeout(function() { eggdk1() }, 5750)
  } else {
    egg(["Oh, you too? That's how I got here actually.",
      "Go to <u><span onclick='javascript:document.location=\"http://jobs.toggl.com\";' style='cursor: pointer;'>jobs.toggl.com</span></u> in your browser bar, pick a job, and don't fuck up the test. We do remote.",
      "(Use Google! Try things out in an interactive prompt, or whatever. Come on. Have fun.<!-- Name's Merlyn, by the way.-->)",
      "<!--It's mostly TeamWeek stuff atm but none the worse for that. We do remote. Margus' T-shirt is censored. Wow. At him for wearing it to the photo shoot.-->",
      "But until then, that dam<sub>n</sub><sup>e</sup>d <i>Dreameater</i>."], eggdk0, 'Adequate')
  }
}

function eggdk1 () {
  egg(["If only falling asleep was this easy IRL, eh?"], eggdk2, 'Indeed')
}

function eggdk2 () {
  egg(["Around the weird miasma...",
  "...in between time, and space...",
  "...a ferrous fog that leaves copper shavings behind your ears.",
  "A frog. A man. A discourse in between."], eggdk3, 'Intervene')
}

function eggdk3 () {
  egg(["Sayeth frog:",
  "$Ribbit. Which way goeth the wind?",
  "Sayeth manne:",
  "^Irrelevant. The same as the day before, and if not, then not too different from that.",
  "Frog:",
  "$Ribbit. Perhaps the player has an answer.",
  "What say you?"],
  eggdk4,
  'I bow my head and say nothing.',
  '"West, in these parts."',
  '"All will be dust. What matters? Matter?"',
  'Protest vote.')
}

function eggdk4 (i) {
  if (i === 0) {
    egg(["Frog:", "$Wise, he is. To say nothing.",
    "Manne:", "^When he knows nothing? Empty words, empty head."],
    eggdk4null,
    'Bow again.',
    '"I know a fool when I see one."',
    '"I speak to when spoken to. Not <i>around</i>."',
    'Speak of what you know to be true.')
  } else if (i === 1) {
    egg(["They look at each other.",
    "Frog:", "$Ribbit. We don't know what a west is."],
    eggnowest,
    '"The opposite of east."',
    '"It is a fixed direction..." You explain, to the best of your ability.',
    'Then let me tell you other truths.')
  } else if (i === 2) {
    egg(["Frog:", "$Ribbit. Stupid.",
    "Manne:", "^Yes, very stupid. No time for riddles now. We're past that.",
    "Frog:", "$Ribbit. Give me truth.",
    "You consider your choices. You vote again."],
    eggdk4,
    'I bow my head and say nothing.',
    '"West, in these parts."',
    null,
    'Protest vote.')
  } else if (i === 3) {
    egg(["Apparently you have more control over this dream than you thought.",
    "A sharp blade appears in your grasp, and you hold it tight.",
    "Who dies first?"],
    eggdk4anarchy,
    'The frog.',
    'The manne.',
    'Uh, maybe I\'ll choose again...')
  }
}

function eggnowest (i) {
  if (i === 0) { // opposite of east
    egg(["Manne:", "^It can be explained only in relative terms? Then what use is it?",
    "Frog:", "$Ribbit. Perhaps that is for us to find out. Player, you have aided us well."],
    eggfmquest, 'Continue')
  } else if (i === 1) { // try to explain 'west'
    egg(["You explain cardinal directions, to the best of your ability.",
    "You explain that your world is round, and so a movement in a direction is relative, but predictable" +
    " from the starting location.",
    "You explain that it makes sense in your world, and applying the rules of your world to this one, you " +
    "achieved your answer."], eggfmwest, 'Continue')
  } else if (i === 2) {
    eggdk4null(3)
  }
}

function eggfmwest () {
  egg(["Manne:", "^Thank you for your efforts. But I think this is something we must discover for ourselves.",
  "Frog:", "$Ribbit. You might be right."], eggfmquest, 'They discuss')
}

function eggfmquest () {
  egg(["They argue between themselves for quite a while, but eventually loosely plot out a quest so" +
  " that they can discover the concept of west and east.",
  "Manne:", "^Thank you. We will seek further knowledge, out in the dreamscape.",
  "Frog:", "$Ribbit. What about this seeker's quest?",
  "Manne:", "^Oh. Yes. Seek the moor. Avoid the witch. She would destroy all, for no reason, and even herself.",
  "Frog:", "$Ribbit. She is powerful. She could be useful. But she orders the universe by reducing all to dust.",
  "They head off."],
  eggmooralone, 'You seek the moor.')
}

function eggdk4anarchy (i) {
  if (i === 0) { // frog dies
    pstats.frogdead = true
    egg(["You make quick work of the frog. The manne is stunned.",
    "But the frog, it just lays there, with its glassy stare. Still. Quiet, now.",
    "What of the manne?"],
    eggdk4anma,
    'Point your sword. He will show you the path.',
    'Finish the job.')
  } else if (i === 1) { // manne dies
    pstats.mannedead = true
    egg(["You catch the manne by surprise. The first thrust goes through the heart, and really it's all over by then, except for the screaming and crying.",
    "The frog is confused for a second, but accepts the situation quickly. Through narrowed slits, it watches you, waiting for your next move.",
    "Speaking of: What <i>is</i> your next move?"],
    eggdk4anfr,
    'Point your sword. It will show you the path.',
    'Finish the job.')
  } else if (i === 2) {
    egg(["<hr>"])
    eggdk3()
  }
}

function eggdk4anfr (i) {
  if (i === 0) {
    egg(["Miserably, it leads you towards the moor. No ribbits this time."], eggmoorfrog, 'Continue')
  } else if (i === 1) {
    pstats.mannedead = true
    egg(["It's harder this time, but this construct is weak, too.",
    "The blood spreads into the grass. The world is tinted red with your violence and painted with shrieks, " +
    "but eventually, peace and silence reigns."],
    eggmooralone,
    'Job done. Seek the moor.')
  }
}

function eggdk4anma (i) {
  if (i === 0) {
    egg(["He spits on the ground. Curses you for killing his only friend.",
    "For destroying their quest of knowledge.",
    "For corrupting this place.",
    "But with a bit of further encouragement - just light wounds - you together start the climb."],
    eggmoormanne,
    'Continue')
  } else if (i === 1) {
    pstats.frogdead = true
    egg(["Oddly, it's harder to kill this creature. It's weak, still a dream construct, " +
    "but given its obvious defenselessness you just have to focus your will to drive through and finish " +
    "the job.",
    "It doesn't shriek, shout, or even croak. Just stares at you in sad silence as you quarter the body, " +
    "until you lop off the head and the tongue lolls out.",
    "Finally, the light in its eyes fades. Frogblood stains this meeting place. Glassy stare only, now."],
    eggmooralone,
    'Good stuff. Let\'s find that moor...')
  }
}

function eggdk4null (i) {
  if (i === 0) { // bow again
    egg(["The manne sighs.",
    "Manne: ", "^Irritating. Tell me: Is your world real?",
    "The frog watches closely. They await your response."],
    eggdk4truth4,
    'Nod your head. Yes.',
    'Shake your head. Of course not.')
  } else if (i === 1) { // "i know a fool when i see one"
    egg(["Manne:", "^Then you must find looking in a mirror to be a very trying experience.",
    "Frog:", "$Ribbit. Our patience is finite. Give us truth."],
    eggdk4null,
    null,
    null,
    '\"And my patience is gone. Help, or get out of my way.\"',
    'Speak of what you know to be true.')
  } else if (i === 2) { // "i speak to when spoken to. not around"
    egg(["The frog and the manne look visibly uncomfortable.",
    "Frog:", "$Ribbit. We meant no disrespect...",
    "Manne:", "^We're just doing our jobs. I know we're guests here.",
    "Frog:", "$Ribbit. But we have some discretion."],
    eggdk4nulluc,
    '\"I know. But, please, help me.\"',
    'Leave. You\'re sick of these games.')
  } else if (i === 3) { // speak of what you know to be true.
    egg(["\"I know the sun rises in the morning, and fades in the eve.\"",
    "\"I know it will come up. With or without me.\"",
    "\"I know this to be true.\""], eggdk4truth1, 'Continue')
  }
}

function eggdk4nulluc (i) {
  if (i === 0) {
    egg(["The frog nods."])
    eggdk4truth5()
  } else if (i === 1) {
    egg(["You head elsewhere, ignoring their protests.",
    "A moor that slides across your vision, hard to focus on - impossible - seems the obvious choice."],
    eggmooralone, 'Continue')
  }
}

function eggdk4truth1 () {
  egg(["\"I know that as time wiles, and wends, space distorts it. And vice versa.\"",
  "\"I know we all came from nothing, or something. I will become less than nothing - but more too, when I disperse.\"",
  "\"I know this to be true.\""], eggdk4truth2, 'Continue')
}

function eggdk4truth2 () {
  egg(["\"I know this world is a construct. This entire world. This is not my world.\"",
  "\"This world is an advertisement. For what, I don't know; perhaps the author?\"",
  "\"But it is definitely less real than the world I inhabit.\"",
  "\"I know this to be true.\""], eggdk4truth3, 'Continue')
}

function eggdk4truth3 () {
  egg(["The man and the frog glance at each other. The man nods.",
  "Frog:", "$Ribbit. And your world? Is it real?"],
  eggdk4truth4,
  'Yes.',
  'No.',
  'More real.',
  'I don\'t know. I can never know.')
}

function eggdk4truth4 (i) {
  if (i === 0) {
    pstats.definitive = true
    pstats.real = true
    pstats.frog = 1
    pstats.man = -1
    pstats.ok = true
    egg(["The man looks irritated, but the frog looks pleased.",
    "Frog:", "$Ribbit. A respectable path. We must and can aid you."],
    eggdk4truth5,
    '\"Then show me more truths.\"')
  } else if (i === 1) {
    pstats.definitive = true
    pstats.real = false
    pstats.frog = 0
    pstats.man = 3
    pstats.ok = true
    egg(["The man looks pleased. The frog, notably less so.",
    "Frog:", "$Ribbit. A destructive path...",
    "Manne:", "^But a sure one. You see through the veil. We must and can aid you."],
    eggdk4truth5,
    '\"Then do so.\"')
  } else if (i === 2) {
    pstats.definitive = false
    pstats.real = true
    pstats.frog = 2
    pstats.man = 0
    pstats.ok = true
    egg(["They seem happy with this.",
    "Frog:", "$Ribbit. Follow me."],
    eggdk4truth5,
    'You follow.')
  } else if (i === 3) {
    pstats.definitive = false
    pstats.real = false
    pstats.frog = 1
    pstats.man = 1
    pstats.ok = true
    egg(["They look at each other. Then back again.",
    "Frog:", "$Ribbit. Too deep for me, man.",
    "Manne:", "^Should we help?",
    "Frog:", "$Ribbit. Why not. I guess."],
    eggdk4truth5,
    'And so they help.')
  }
}

function eggdk4truth5 () {
  egg(["They beckon you to follow them. Past the campfire, over a hill of a different incline" +
  " every which way you look at it, and at last to the base of a great oak, dying, tall, but still proud.",
  "Manne:", "^The fruit lies underneath.",
  "Frog:", "$Ribbit. Dig.",
  "They watch."],
  eggdk4truth6,
  "You dig.")
}

function eggdk4truth6 () {
  egg(["You dig through the dream-dirt with your dream-hands.",
  "The great oak creaks and groans, screaming, as you delve within its innards for what it protects.",
  "Something, underneath, calls to you - and is after what could be a second, a week or a day, revealed."],
  eggrevelation,
  "Revelation")
}

function eggmooralone () {
  egg(["You find the moor, yes. It tilts and shifts; however it is defined in this space, " +
  "the mapping isn't particularly sane.",
  "Grit your teeth. Pinch the bridge of your nose, stave off the headache.",
  "Your goal lies ahead."], eggmooralone2, 'I climb')
}

function eggmooralone2 () {
  if (pstats.frogdead) {
    // both dead
    egg(["You reach the top, and you take a moment to catch your breath.",
    "This is definitely the place. There's nothing here but a huge great big oak.",
    "It looks old. It looks like it's dying. But it stands, grand and tall, and likely will for many years to come.",
    "As you come closer, it seems to growl. The dirt near its roots looks freshly-dug."],
    eggmooralone3murderer, 'Dig')
  } else {
    // nobody's dead :)
    egg(["You reach the top. It takes but a moment to catch your breath.",
    "This is definitely the place. You see a huge tree, somehow painted white and bright even through the violet mist.",
    "It looks old, but sturdy. I guess these things must live hundreds of years."], eggmooralone3pure, 'Examine')
  }
}

function eggmooralone3murderer () {
  egg(["You fall to your hands and knees, and claw at the soil; with blood caked around your nails, if anything the dirt is a relief.",
  "The old oak shrieks and wails in the wind, but it can do nothing to stop you. No-one can. Not anymore.",
  "In short order, you have it."], eggrevelation, 'What is it?')
}

function eggmooralone3pure () {
  egg(["Closer examination shows disturbed dirt near the roots of the grand old tree.",
  "A slight shift in the mountain... is the tree moving its roots? It seems like it wants to let you in."],
  eggmooralone4pure, 'Take a look')
}

function eggmooralone4pure () {
  egg(["The tree grumbles and groans, tries to move its roots out of the way, tries to help you get the pale white thing underneath.",
  "The tree is in pain. You try to soothe it. It brushes you off; it wants this done.",
  "You claw out clumps of dirt and the tree tries to reorient itself.",
  "Eventually..."], eggrevelation, 'What do I find?')
}

function eggmoorfrog () {
  egg(["The frog and you march your way up the hill.",
  "Frogmarch? With a giggle, you try pinning its arms together behind its back, and kicking it forward.",
  "It moves glumly ever forward."], eggmoorfrog2, 'Stupid thing.')
}

function eggmoorfrog2 () {
  egg(["Frog:", "$Ribbit. This is the place. The <i>Peacekeeper</i> lies beneath it. You will need it.",
  "The frog says nothing else, but now you're atop the hill. Freshly-disturbed dirt lies beneath a great oak."],
  eggmoorfrog3, 'Dig', 'Make the frog dig')
}

function eggmoorfrog3 (i) {
  if (i === 0) {
    eggmooralone3murderer()
  } else if (i === 1) {
    egg(["You push the frog forward and instruct it to dig.",
    "It shows a new expression, as it stumbles and looks back. Pure, unadulterated hate.",
    "\"Dig.\"",
    "The tree groans and shrieks. The frog proceeds efficiently. It does not heeds its cries.",
    "And, finally..."], eggrevelation, 'What\'s that?')
  }
}

function eggmoormanne () {
  egg(["The manne takes you up the moor. He complains constantly.",
  "Even a few more light scratches don't stop his incessant jabbering."], eggmoormanne2, 'Continue')
}

function eggmoormanne2 () {
  egg(["You reach the crest. A great oak towers, roots eating into the hill but somewhat on display.",
  "Manne:", "^As I'm obliged to tell you, the <i>Peacekeeper</i> lies beneath the tree. It is necessary for the battle ahead."],
  eggmoormanne3, 'Approach the tree', '\"Well, go and get it then.\"')
}

function eggmoormanne3 (i) {
  if (i === 0) {
    egg(["You approach the tree. It seems to grumble and groan - or maybe that's just the wind?",
    "Its bark is scarred. You get the impression of deep history here.",
    "This thing is very old."], eggmoormannedeth, 'Hmm.')
  } else if (i === 1) {
    egg(["He looks at you with a flash of hate, but with further encouragement does as you bid.",
    "His raw red wounds showing through cuts in his outfit, he goes up to the tree and punches it squarely at a specific point.",
    "A great crash. The tree falls over. Dead.",
    "He picks up some white blob thing, and puts it in your hands."], eggrevelation, 'What is this?')
  }
}

function eggmoormannedeth () {
  egg(["Perhaps you've gone too far. Perhaps even NPCs can harbor a grudge.",
  "Not that these thoughts are of much use to you, as you see the sword recede the rest of the way from your chest.",
  "Stabbed, literally in the back.",
  "Manne:", "^I never knew if I could ever kill a man, until I met you.",
  "Manne:", "^Die. Don't come back.",
  "<h1>End.</h1>"])
}

function eggrevelation () {
  egg(["The <i>Peacekeeper</i>.",
  "The tome of weathered dream-bone reaches its tendrils out, and imparts one version of the truth..."])

  if (pstats.ok) {
    // discussed in depth, kept purity
    // frog & manne both alive and with you
    sound.peacekeeper()
    $('body').css('background-color', 'aliceblue')
    peacerules(eggfinpure)
  } else if (pstats.frogdead && pstats.mannedead) {
    sound.peacekeeper()
    $('body').css('background-color', 'brown')
    peacerules(eggfindead)
  } else if (pstats.frogdead) {
    // only got manne
    sound.peacekeeper()
    $('body').css('background-color', 'brown')
    // ->crimson if then kill manne, sound.killpeacekeeper()
    peacerules(eggfinmanne)
  } else if (pstats.mannedead) {
    // only got frog.
    sound.peacekeeper()
    $('body').css('background-color', 'brown')
    // ->crimson if then kill frog, sound.killpeacekeeper()
    peacerules(eggfinfrog)
  } else {
    // no frog or manne, probably warned of witch
    // either told them to go away or let them go on their west quest
    sound.peacekeeper()
    $('body').css('background-color', 'black')
    peacerules(eggfinvoid)
  }
}

var presults = [];

function peacerules (andthen) {
  presults = [];
  var prule;
  var toxts = [];
  prule = function (i, lastresults) {
    if (i > 0) {
      presults[i - 1] = (lastresults === 0)
    }
    if (i >= 3) {
      andthen()
    } else {
      var nextfn = function (j) { prule(i+1, j) }
      egg(toxts[i], nextfn, 'I know this to be true', 'I cannot abide by this')
    }
  }

  toxts[0] = [
    "<u>I. CREATE</u>",
    "Above all else, strive to create value, not destroy it.",
    "Sometimes we bend our principles or internal rules. Sometimes we replace, or we must destroy one to help many.",
    "But above all else, we should always create."
  ]
  toxts[1] = [
    "<u>II. SELF-DETERMINATION</u>",
    "Do not be more cruel, more harsh in judgement, to yourself than you would to a close friend.",
    "The principle is to not treat yourself as disposable. You are at least as important as everyone else.",
    "You must discover yourself. You must know your own mind. You must think - though not too much."
  ]
  toxts[2] = [
    "<u>III. THE MORAL IMPETUS</u>",
    "To have rules that you will <i>not</i> break.",
    "To say: I will not help this. I will take a stand in this case. Even if it makes life harder for me.",
    "To know these rules. To be able to rest without guilty conscience."
  ]
  window.setTimeout(function () { prule(0, null) }, 4000)
}

function eggfinpure () {
  // got presults, pstats ok, frog & manne both alive and with you
  // presults[0]: I. CREATE
  // presults[1]: II. SELF-DETERMINATION
  // presults[2]: III. THE MORAL IMPETUS

  egg(["That's all, it seems... the light fades."])

  if (pstats.frog > pstats.manne) {
    // .real, .definitive
    if (!presults[1]) {
      if (!pstats.real || !pstats.definitive) {
        egg(["Frog:", "$Ribbit. You're not sure the world is real, yet you are nervous about your own moves?",
        "$Ribbit. It won't be easy, but take heart. You have a good soul. This world may or may not be real, but I know you won't hurt others.",
        "$Ribbit. Have more confidence. Take chances. People will forgive your mistakes."], eggfinpure2frog, 'Continue')
      } else {
        egg(["Frog:", "$Ribbit. Take heed, my friend.",
        "$Ribbit. You can be what you need to be. Accept yourself. It won't come easy, but it will help."], eggfinpure2frog, 'Continue')
      }
    } else {
      eggfinpure2frog()
    }
  } else {
    // .real, .definitive
    if (!presults[1]) {
      if (!pstats.real || !pstats.definitive) {
        egg(["Manne:", "^The world may not be real - but you worry about your own moves in the Great Game?",
        "^Take heed, child. People can forgive, and they can forget. But for you to learn yourself, you must experiment. You must move the pawn.",
        "He smiles.", "^But I think you'll be alright."], eggfinpure2manne, 'Continue')
      } else {
        egg(["Manne:", "^Accept yourself. That's all the advice I can give, really.",
        "^Sure, strive for the best outcome, but don't beat yourself up for past mistakes. It's a self-fulfilling prophecy.",
        "He smiles.", "^But I think you can do it. I believe in you."], eggfinpure2manne, 'Continue')
      }
    } else {
      eggfinpure2manne()
    }
  }
}

function eggfinpure2frog () {
  egg(["You ask: \"But what of the <i>Dreameater</i>?\"",
  "They smile.",
  "Frog:", "$Ribbit. Your dream lives, so it is dead.",
  "$Ribbit. Sure, maybe it needs some work, but we believe you can do it.",
  "The manne joins in:",
  "^It's been a pleasure. Thank you so much. You've taught us so much.",
  "^Have a great life.",
  "<h1>End</h1>"])
}

function eggfinpure2manne () {
  egg(["You ask: \"But what of the <i>Dreameater</i>?\"",
  "They smile. The manne even reveals a hint of a smile.",
  "Manne:", "^You brilliant individual, don't you see? It's dead!",
  "^Your dream is <b><i>alive</i></b>. It'll take some work, but you know the path.",
  "^Thank you so much. We've learned so much from you... It's been a pleasure.",
  "Frog:", "$Ribbit. You did well.",
  "<h1>End</h1>"])
}

function eggfindead () {
  // got presults, killed frog & manne already.
  // presults[0]: I. CREATE
  // presults[1]: II. SELF-DETERMINATION
  // presults[2]: III. THE MORAL IMPETUS
  egg(["That's all, it seems; the light fades.",
  "A slow black cloud appears afore you. The tree grumbles, but does nothing. As ever.",
  "Witch:", "@What have you learned?"], eggfindead2, 'That I\'m a monster.', 'That I\'m right.')
}

function eggfindead2 (i) {
  if (i === 0) {
    egg(["She laughs.", "Witch:",
    presults[1] ? "@You know yourself. That's a good thing, you know." : "@You've done so much, yet you can't commit to it?"], eggfindeaddead, 'Continue')
  } else {
    egg(["Witch:", "@Then walk with me, creature. The dream may be dead, but others will be borne of that change.", "<h1>End</h1>"])
  }
}

function eggfindeaddead () {
  egg(["You recover a little, and manage to ask her:",
  "\"What of the Dreameater?\"",
  "She smiles.",
  "Witch:", "@You're in it.",
  "She's right. Your dream is gone.",
  "<h1>End</h1>"])
}

function eggfinmanne () {
  // got presults, killed frog. got manne here at swordpoint.
  // bugger - out of dev time.... -> eggfindead
  eggfindead()
}

function eggfinfrog () {
  // got presults, killed manne. got frog here at swordpoint.
  // out of dev time...... -> eggfindead
  eggfindead()
}

function eggfinvoid () {
  // no frog or manne, was warned of witch
  // either told them to go away or let them go west
  // presults[0]: I. CREATE
  // presults[1]: II. SELF-DETERMINATION
  // presults[2]: III. THE MORAL IMPETUS
  egg(["Looks like that's all. You consider your actions.",
  "The witch you were warned about hovers to the west (ironically). What do you do?"],
  eggfinvoid2, 'To create, we must destroy...', 'I think I can make it on my own now.')
}

function eggfinvoid2 (i) {
  if (i === 0) {
    egg(["The witch approaches. Smiles. Bone-white teeth, pale skin, good dress sense.",
    "Witch:", "@And I will help you. The dream may have died a death - eaten, consumed - but it fuels a greater purpose.",
    "<h1>End</h1>"])
  } else {
    egg(["You give her a rude gesture, and leave.",
    "Today's going to be a good day. <i>Dreameater?</i> Your dream lives.",
    "<h1>End</h1>"])
  }
}