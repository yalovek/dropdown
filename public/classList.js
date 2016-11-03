(function() {
  if (!'classList' in Element.prototype) {
    Element.proptype.classList = function() {
      var _this = this;
      var ClassList = function() {};

      ClassList.prototype.add = function(addClass) {
        _this.className = _this.className.trim().split(' ').concat(addClass).join(' ');
      };

      ClassList.prototype.contains = function(findClass) {
        return !!_this.className.trim().split(' ').find(function(listClass) {
          return listClass === findClass
        });
      };

      ClassList.prototype.remove = function(removeClass) {
        _this.className = _this.className.trim().split(' ').reduce(function(result, listClass) {
          if (listClass !== removeClass) {
            result.push(listClass);
          }

          return result;
        });
      };

      return new ClassList();
    };
  }
})();
