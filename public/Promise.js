(function() {
  if (!window.Promise) {
    function noop() {}

    function Promise(fn) {
      if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      
      this._state = 0;
      this._handled = false;
      this._value = undefined;
      this._deferreds = [];

      doResolve(fn, this);
    }

    function handle(self, deferred) {
      while (self._state === 3) {
        self = self._value;
      }

      if (self._state === 0) {
        self._deferreds.push(deferred);
        return;
      }

      self._handled = true;

      setTimeout(function() {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        
        if (cb === null) {
          (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
          
          return;
        }

        var ret;

        try {
          ret = cb(self._value);
        }
        catch (e) {
          reject(deferred.promise, e);

          return;
        }

        resolve(deferred.promise, ret);
      }, 0);
    }

    function resolve(self, newValue) {
      try {
        if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
        
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          
          if (newValue instanceof Promise) {
            self._state = 3;
            self._value = newValue;
          
            finale(self);
          
            return;
          }
          else if (typeof then === 'function') {
            doResolve(then.bind(newValue), self);
            
            return;
          }
        }

        self._state = 1;
        self._value = newValue;

        finale(self);
      }
      catch (e) {
        reject(self, e);
      }
    }

    function reject(self, newValue) {
      self._state = 2;
      self._value = newValue;

      finale(self);
    }

    function finale(self) {
      for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
      }

      self._deferreds = null;
    }

    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.promise = promise;
    }

    function doResolve(fn, self) {
      var done = false;
      
      try {
        fn(function(value) {
          if (done) return;
          
          done = true;
          
          resolve(self, value);
        }, function (reason) {
          if (done) return;
          
          done = true;
          
          reject(self, reason);
        });
      }
      catch (ex) {
        if (done) return;
        
        done = true;
        
        reject(self, ex);
      }
    }

    Promise.prototype['catch'] = function(onRejected) {
      return this.then(null, onRejected);
    };

    Promise.prototype.then = function(onFulfilled, onRejected) {
      var prom = new (this.constructor)(noop);

      handle(this, new Handler(onFulfilled, onRejected, prom));

      return prom;
    };

    Promise.all = function(arr) {
      var args = Array.prototype.slice.call(arr);

      return new Promise(function(resolve, reject) {
        if (args.length === 0) return resolve([]);
        
        var remaining = args.length;

        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              
              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }

            args[i] = val;

            if (--remaining === 0) {
              resolve(args);
            }

          }
          catch (ex) {
            reject(ex);
          }
        }

        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };

    Promise.resolve = function(value) {
      if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
      }

      return new Promise(function(resolve) {
        resolve(value);
      });
    };

    Promise.reject = function(value) {
      return new Promise(function(resolve, reject) {
        reject(value);
      });
    };

    Promise.race = function(values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };
    
    window.Promise = Promise;
  }
})();
