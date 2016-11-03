(function() {
  'use strict';

  function init(convertKeyboardKeysCyrillicToLatin, convertKeyboardKeysLatinToCyrillic, translitCyrillicToLatin, translitLatinToCyrillic) {
     function populateIndex(array, id, index) {
      var store = {
        key: ''
      };

      return array.reduce(function(result, letter) {
        store.key += letter.toLowerCase();
        store.keyConvert = convertKeyboardKeys(store.key);
        store.keyTranslit = translit(store.key);
        store.keyTranslitConvert = convertKeyboardKeys(store.keyTranslit);

        return Object.keys(store).reduce(function(accumulator, key) {
          if (accumulator[store[key]]) {
            accumulator[store[key]].push(id);
          }
          else {
            accumulator[store[key]] = [id];
          }

          return accumulator;
        }, result);
      }, index);
    }

    function convertKeyboardKeys(word) {
      var cyrillicToLatin = convertKeyboardKeysCyrillicToLatin(word);
      var latinToCyrillic = convertKeyboardKeysLatinToCyrillic(word);

      return cyrillicToLatin !== word
        ? cyrillicToLatin
        : latinToCyrillic !== word
          ? latinToCyrillic
          : '';
    }

    function translit(word) {
      var cyrillicToLatin = translitCyrillicToLatin(word);
      var latinToCyrillic = translitLatinToCyrillic(word);
      
      return cyrillicToLatin !== word
        ? cyrillicToLatin
        : latinToCyrillic !== word
          ? latinToCyrillic
          : '';
    }

    return populateIndex;
  }

  if (typeof window === 'undefined') {
    var convertKeyboardKeysCyrillicToLatin = require('./convertKeyboardKeysCyrillicToLatin.js');
    var convertKeyboardKeysLatinToCyrillic = require('./convertKeyboardKeysLatinToCyrillic.js');
    var translitCyrillicToLatin = require('./translitCyrillicToLatin.js');
    var translitLatinToCyrillic = require('./translitLatinToCyrillic.js');

    module.exports = init(convertKeyboardKeysCyrillicToLatin, convertKeyboardKeysLatinToCyrillic, translitCyrillicToLatin, translitLatinToCyrillic);
  }
  else {
    var id = setInterval(function() {
      if (typeof window.convertKeyboardKeysCyrillicToLatin === 'function'
        && typeof window.convertKeyboardKeysLatinToCyrillic === 'function'
        && typeof window.translitCyrillicToLatin === 'function'
        && typeof window.translitLatinToCyrillic === 'function') {
        clearInterval(id);

        (function(convertKeyboardKeysCyrillicToLatin, convertKeyboardKeysLatinToCyrillic, translitCyrillicToLatin, translitLatinToCyrillic) {
          window.populateIndex = init(convertKeyboardKeysCyrillicToLatin, convertKeyboardKeysLatinToCyrillic, translitCyrillicToLatin, translitLatinToCyrillic);
        })(window.convertKeyboardKeysCyrillicToLatin, window.convertKeyboardKeysLatinToCyrillic, window.translitCyrillicToLatin, window.translitLatinToCyrillic);
      }
    }, 0);
  }
})();
