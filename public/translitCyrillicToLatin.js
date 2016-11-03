(function() {
  'use strict';

  var FIRST_ITEM_KEY = 0;
  var STEP_ONE = 1;
  var LETTERS_MAP = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'ий': 'iy',
    'й': 'j',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sch',
    'ъ': "'",
    'ы': 'y',
    'ь': "'",
    'э': 'e',
    'ю': 'ju',
    'я': 'ja'
  };

  function getPreviousLetter(key, step, array) {
    var previousKey = key - step;

    return previousKey >= FIRST_ITEM_KEY && array[previousKey];
  }

  function getNextLetter(key, step, array) {
    var nextKey = key + step;

    return nextKey < array.length && array[nextKey];
  }

  function translitCyrillicToLatin(word) {
    return word.toLowerCase()
      .split('')
      .map(function(letter, key, array) {
        var previousLetter = getPreviousLetter(key, STEP_ONE, array);
        var nextLetter = getNextLetter(key, STEP_ONE, array);

        if (letter === 'и' && nextLetter === 'й') {
          return LETTERS_MAP[letter + nextLetter];
        }
        else if (letter === 'й' && previousLetter === 'и') {
          return '';
        }

        return LETTERS_MAP[letter] || letter;
      })
      .join('');
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = translitCyrillicToLatin;
  }
  else {
    window.translitCyrillicToLatin = translitCyrillicToLatin;
  }
})();
