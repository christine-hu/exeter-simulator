function updateMuteBtn (muted) {
  if (muted) {
    $($muteBtn).addClass('muted')
  } else {
    $($muteBtn).removeClass('muted')
  }
  if (window && window.timesMuted && window.checkTimesMuted) {
    window.timesMuted++
    window.checkTimesMuted()
  }
}

function soundFactory () {
  return {
    init: function (cb) {
      if (window) {
        window.timesMuted = 1
        window.setInterval(function() { window.timesMuted = 1 }, 5000)
      }
      this.muted = Storage.getMute() || false
      updateMuteBtn(this.muted)
      this.load(cb)
    },
    load: function (cb) {
      var sounds = ['sound', 'sfx']
      var soundsLoaded = 0
      var soundLoaded = function () {
        if (++soundsLoaded === sounds.length) cb()
      }
      for (var i = 0; i < sounds.length; i++) {
        var soundName = sounds[i]
        this[soundName] = new Howl(window['_' + soundName])
        this[soundName].once('load', soundLoaded)
        this[soundName].mute(this.muted)
      }
    },
    credits: function () {
      var self = this
      this._next('credits', true)
    },
    instructions: function () {
      var self = this
      this._next('instructions', false, function(id) {
        self.sound.once('end', function() {
          self._next('instructions_loop', true)
        }, id)
      })
    },
    game: function () {
    },
    victory: function () {
      this.playSfx('cheer1')
    },
    defeat: function () {
      this.playSfx('boo')
    },

    _play: function (sound, loop, cb) {
      var id = this.sound.play(sound)
      this.sound.loop(loop, id)
      this.current = id
      if (cb) cb(id)
    },
    _next: function (sound, loop, cb) {
      var self = this
      // remove all event listeners
      self.sound.off('end')
      if (self.current && self.sound.playing(self.current)) {
        self.sound.fade(1, 0, 200, self.current)
        self.sound.once('fade', function () {
          self._play(sound, loop, cb)
        }, self.current)
      } else {
        self._play(sound, loop, cb)
      }
    },
    toggleMuting: function () {
      this.muted = !this.muted
      this.sound.mute(this.muted)
      this.sfx.mute(this.muted)
      Storage.setMute(this.muted)
      updateMuteBtn(this.muted)
      return this.muted
    },
    pause: function () {
      this.sound.pause()
    },
    stop: function () {
      this.sound.stop()
    },
    play: function () {
      this.sound.play(this.current)
    },
    playSfx: function (name) {
      this.sfx.play(name)
    }
  }
}