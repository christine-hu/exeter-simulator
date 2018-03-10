function StorageFactory () {
  var HIGH_SCORE = 'highestValuation'
  var MUTE = 'mute'

  var Storage = {
    _get: function (key) {
      return (window.localStorage && window.localStorage.getItem(key)) || null
    },
    _getBool: function (key) {
      return this._get(key) === '1'
    },

    _set: function (key, value) {
      window.localStorage && window.localStorage.setItem(key, value)
    },
    _setBool: function (key, value) {
      window.localStorage && window.localStorage.setItem(key, value ? 1 : 0)
    },

    getMute: function () {
      return this._getBool('mute')
    },
    setMute: function (val) {
      this._setBool('mute', val)
    },

    getHighscore: function () {
      var score = this._get(HIGH_SCORE)
      return score !== null ? parseInt(score) : null
    },
    
    setHighscore: function (score) {
      var current = this.getHighscore()
      if (current !== null) {
        if (current < score) {
          this._set(HIGH_SCORE, score)
        }
      } else {
        this._set(HIGH_SCORE, score)
      }
    },
  }

  return Storage
}