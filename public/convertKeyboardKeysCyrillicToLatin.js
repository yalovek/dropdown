(function() {
  'use strict';

  var LETTERS_MAP = {
    'ф': 'a',
    'и': 'b',
    'с': 'c',
    'в': 'd',
    'у': 'e',
    'а': 'f',
    'п': 'g',
    'р': 'h',
    'ш': 'i',
    'о': 'j',
    'л': 'k',
    'д': 'l',
    'ь': 'm',
    'т': 'n',
    'щ': 'o',
    'з': 'p',
    'й': 'q',
    'к': 'r',
    'ы': 's',
    'е': 't',
    'г': 'u',
    'м': 'v',
    'ц': 'w',
    'ч': 'x',
    'н': 'y',
    'я': 'z',
    'б': ',',
    'б': '<',
    'ю': '.',
    'ю': '>',
    'ж': ';',
    'ж': ':',
    'э': "'",
    'э': '"',
    'ё': '|',
    'х': '[',
    'х': '{',
    'ъ': ']',
    'ъ': '}'
  };

  function convertKeyboardKeysCyrillicToLatin(word) {
    return word.toLowerCase()
      .split('')
      .map(function(letter) {
        return LETTERS_MAP[letter] || letter;
      })
      .join('');
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = convertKeyboardKeysCyrillicToLatin;
  }
  else {
    window.convertKeyboardKeysCyrillicToLatin = convertKeyboardKeysCyrillicToLatin;
  }
})();
