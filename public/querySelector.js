(function() {
  'use strict';

  if (!Element.prototype.querySelector) {
    Element.prototype.querySelector = function(selectors) {
      var elements = this.querySelectorAll(selectors);

      return elements.length ? elements[0] : null;
    };
  }
})();
