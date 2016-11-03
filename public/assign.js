(function() {
  'use strict';

  if (typeof Object.assign !== 'function') {
    Object.assign = function(object) {
      if (typeof object !== 'object') {
        throw new TypeError('first argument should be an object or null');
      }

      var args = Array.prototype.slice.call(arguments);

      for (var index in args) {
        var source = args[index];

        if (source) {
          for (var key in source) {
            if (source.hasOwnProperty(key)) {
              object[key] = source[key];
            }
          }
        }
      }

      return object;
    };
  }
})();
