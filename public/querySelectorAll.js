(function() {
  'use strict';

  if (!Element.prototype.querySelectorAll) {
    Element.prototype.querySelectorAll = function(selectors) {
      var style = document.createElement('style');
      var elements = [];
      var element;
      
      document.documentElement.firstChild.appendChild(style);
      document._qsa = [];

      style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
      
      window.scrollBy(0, 0);
      
      style.parentNode.removeChild(style);

      while (document._qsa.length) {
        element = document._qsa.shift();
        
        element.style.removeAttribute('x-qsa');

        elements.push(element);
      }

      document._qsa = null;

      return elements;
    };
  }
})();
