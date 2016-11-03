(function() {
  'use strict';

  if (!Array.prototype.map) {
    Array.prototype.map = function(callback, _this) {
      if (typeof callback !== 'function') {
        throw new TypeError('argument should be a function');
      }

      var result = [];

      for (var key in this) {
        result = callback.call(_this || this, this[key], key, this);
      }

      return result;
    };
  }
})();
