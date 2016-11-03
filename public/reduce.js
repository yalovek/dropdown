(function() {
  'use strict';

  if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback, result) {
      if (typeof callback !== 'function') {
        throw new TypeError('first argument should be a function');
      }

      result = result || [];

      for (var key in this) {
        result = callback(result, this[key], parseInt(key), this);
      }

      return result;
    };
  }
})();
