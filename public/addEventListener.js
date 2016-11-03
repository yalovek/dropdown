(function() {
  'use strict';

  if (!Element.prototype.addEventListener) {
    Element.prototype.addEventListener = function(event, callback) {
      var _this = this;

      this.attachEvent('on' + event, function(e) {
        e.target = e.srcElement;
        e.currentTarget = _this;

        if (callback.handleEvent) {
          callback.handleEvent(e);
        }
        else {
          callback.call(_this, e);
        }
      });
    };
  }
})();
