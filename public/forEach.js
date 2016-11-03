(function() {
  'use strict';

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, _this) {
      if (typeof callback !== 'function') {
        throw new TypeError('argument should be a function');
      }

      for (var key in this) {
        if (this.hasOwnProperty(key)) {
          callback.call(_this || this, this[key], parseInt(key), this);
        }
      }
    };
  }
})();
