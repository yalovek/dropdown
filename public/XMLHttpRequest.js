(function() {
  'use strict';

  if (!window.XMLHttpRequest) {
    function XMLHttpRequest() {
      var _this = this;
      
      this.xhr = typeof XDomainRequest !== 'undefined'
        ? new XDomainRequest() : new ActiveXObject('MSXML2.XMLHTTP.3.0');

      this.xhr.onreadystatechange = function() {
        _this.readyState = _this.xhr.readyState;

        var readyState = _this.readyState === 4;

        _this.response = _this.responseText = readyState ? _this.xhr.responseText : null;
        _this.status = readyState ? _this.xhr.status : null;
        _this.statusText = readyState ? _this.xhr.statusText : null;

        _this.dispatchEvent(new Event('readystatechange'));

        if (readyState) {
          _this.dispatchEvent(new Event('load'));
        }
      };

      if ('onerror' in xhr) {
        _this.xhr.onerror = function () {
          _this.dispatchEvent(new Event('error'));
        };
      }
    };

    XMLHttpRequest.prototype.addEventListener = window.addEventListener;
    XMLHttpRequest.prototype.removeEventListener = window.removeEventListener;
    XMLHttpRequest.prototype.dispatchEvent = window.dispatchEvent;

    XMLHttpRequest.prototype.abort = function() {
      return this.xhr.abort();
    };

    XMLHttpRequest.prototype.getAllResponseHeaders = function() {
      return this.xhr.getAllResponseHeaders();
    };

    XMLHttpRequest.prototype.getResponseHeader = function(header) {
      return this.xhr.getResponseHeader(header);
    };

    XMLHttpRequest.prototype.open = function(method, url, async, username, password) {
      this.xhr.open(method, url, async, username, password);
    };

    XMLHttpRequest.prototype.overrideMimeType = function(mimetype) {
      this.xhr.overrideMimeType(mimetype);
    };

    XMLHttpRequest.prototype.send = function(body) {
      this.xhr.send(body || null);
    };

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
      this.xhr.setRequestHeader(header, value);
    };

    window.XMLHttpRequest = XMLHttpRequest;
  }
})();
