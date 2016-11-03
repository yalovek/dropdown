(function() {
  'use strict';

  if (!Array.isArray) {
    Array.isArray = function(array) {
      return Object.prototype.toString.call(array) === '[object Array]';
    };
  }
})();
