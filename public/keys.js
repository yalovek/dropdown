(function() {
  'use strict';

  if (!Object.keys) {
    Object.keys = function(object) {
      if (typeof object !== 'object') {
        throw new TypeError('argument should be an object');
      }

      var result = [];
      
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          result.push(key);
        }
      }

      return result;
    };
  }
})();
