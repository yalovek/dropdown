(function() {
  'use strict';

  var LETTERS_MAP = {
    'a': 'ф',
    'b': 'и',
    'c': 'c',
    'd': 'в',
    'e': 'у',
    'f': 'а',
    'g': 'п',
    'h': 'р',
    'i': 'ш',
    'j': 'о',
    'k': 'л',
    'l': 'д',
    'm': 'ь',
    'n': 'т',
    'o': 'щ',
    'p': 'з',
    'q': 'й',
    'r': 'к',
    's': 'ы',
    't': 'е',
    'u': 'г',
    'v': 'м',
    'w': 'ц',
    'x': 'ч',
    'y': 'н',
    'z': 'я',
    ',': 'б',
    '<': 'б',
    '.': 'ю',
    '>': 'ю',
    ';': 'ж',
    ':': 'ж',
    "'": 'э',
    '"': 'э',
    '|': 'ё',
    '[': 'х',
    '{': 'х',
    ']': 'ъ',
    '}': 'ъ'
  };

  function convertKeyboardKeysLatinToCyrillic(word) {
    return word.toLowerCase()
      .split('')
      .map(function(letter) {
        return LETTERS_MAP[letter] || letter;
      })
      .join('');
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = convertKeyboardKeysLatinToCyrillic;
  }
  else {
    window.convertKeyboardKeysLatinToCyrillic = convertKeyboardKeysLatinToCyrillic;
  }
})();
