(function() {
  'use strict';

  if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback, _this) {
      if (typeof callback !== 'function') {
        throw new TypeError('argument should be a function');
      }

      var result = [];

      for (var key in this) {
        if (callback.call(_this || this, this[key], parseInt(key), this)) {
          result.push(this[key]);
        }
      }

      return result;
    };
  }
})();
