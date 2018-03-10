//this is a port from clicky-loader with some customizations

(function($) {

$.extend({
  clickyInit: function() {
    doClickyCall("init", arguments);
  },

  clickyLog: function() {
    doClickyCall("log", arguments);
  },

  clickyGoal: function() {
    doClickyCall("goal", arguments);
  },

  clickySetVisitorData: function() {
    doClickyCall("setVisitorData", arguments);
  },

  clickyConfigureAllGoals: function(token) {
    if (!goalsConfigured) {
      $.clickyInit(token);

      $('body').on('click', '[data-custom-analytics-event]', function(e) {
        var goal = $(e.currentTarget).data('custom-analytics-event');
        var avoidQueue = true;
        return $.clickyGoal(goal, null, avoidQueue);
      });

      goalsConfigured = true;
    }
  }
});

var loaded = false;
var postLoadCalls = [];
var goalsConfigured = false;

/**
 * Make a call on the window.togglstats object if it is loaded. Queue the call to run
 * when the JS loads if it is not yet loaded.
 *
 * @param  {string} funcName Name of the funciton on window.togglstats to call
 * @param  {array}  funcArgs Arglist (array or arguments object)
 * @return {void}
 */
function doClickyCall(funcName, funcArgs) {
  if (loaded) {
    window.togglstats[funcName].apply(window.togglstats, funcArgs);
  } else {
    postLoadCalls.push({
      funcName : funcName,
      funcArgs : funcArgs
    });
  }
}

/**
 * [runPostLoadCalls description]
 * @return {[type]} [description]
 */
function runPostLoadCalls() {
  postLoadCalls.forEach(function(postLoadCall) {
    doClickyCall(postLoadCall.funcName, postLoadCall.funcArgs);
  });
}

function clickyLoaded() {
  loaded = true;

  if (!window.togglstats.setVisitorData) {
    // Patch setVisitorData into window.togglstats
    window.togglstats.setVisitorData = setVisitorData;
  }

  runPostLoadCalls();
}

if (!window.togglstats) {
  clickyLoader(clickyLoaded);
} else {
  clickyLoaded();
}

function setVisitorData(data) {
  if (!window.togglstats_custom) {
    window.togglstats_custom = {};
  }

  if (!window.togglstats_custom.visitor) {
    window.togglstats_custom.visitor = {};
  }

  for (var key in data) {
    window.togglstats_custom.visitor[key] = data[key];
  }

  window.togglstats.custom_data();
}

function clickyLoader(callback) {
  var script = document.createElement('script');
  var loaded = false;

  //script.setAttribute('src', '//togglstats.toggl.com/js');
  //script.setAttribute('type', 'text/javascript');
  //script.setAttribute('async', true);

  if (callback) {
    script.onload = function() {
      if (!loaded) {
        callback();
      }

      loaded = true;
    };
  }

  var parentEl = (
    document.getElementsByTagName('head')[0] ||
    document.getElementsByTagName('body')[0]
  );

  parentEl.appendChild(script);
}

})(jQuery);