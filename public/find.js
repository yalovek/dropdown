(function() {
  'use strict';

  if (!Array.prototype.find) {
    Array.prototype.find = function(callback, _this) {
      if (typeof callback !== 'function') {
        throw new TypeError('argument should be a function');
      }

      for (var key in this) {
        if (callback.call(_this || this, this[key], parseInt(key), this)) {
          return this[key];
        }
      }
    };
  }
})();
