(function() {
  'use strict';

  var FIRST_ITEM_KEY = 0;
  var STEP_ONE = 1;
  var STEP_TWO = 2;
  var LETTERS_MAP = {
    'a': 'а',
    'b': 'б',
    'c': 'ц',
    'ch': 'ч',
    'd': 'д',
    'e': 'е',
    'eh': 'э',
    'f': 'ф',
    'g': 'г',
    'h': 'х',
    'i': 'и',
    'ia': 'я',
    'ie': 'е',
    'iu': 'ю',
    'iy': 'ий',
    'j': 'й',
    'ja': 'я',
    'jo': 'ё',
    'ju': 'ю',
    'k': 'к',
    'kh': 'х',
    'l': 'л',
    'm': 'м',
    'n': 'н',
    'o': 'о',
    'p': 'п',
    'r': 'р',
    's': 'с',
    'sch': 'щ',
    'sh': 'ш',
    't': 'т',
    'ts': 'ц',
    'u': 'у',
    'v': 'в',
    'y': 'ы',
    'ya': 'я',
    'yo': 'ё',
    'z': 'з',
    'zh': 'ж',
    "'": 'ь'
  };

  function getPreviousLetter(key, step, array) {
    var previousKey = key - step;

    return previousKey >= FIRST_ITEM_KEY && array[previousKey];
  }

  function getNextLetter(key, step, array) {
    var nextKey = key + step;

    return nextKey < array.length && array[nextKey];
  }

  function translitLatinToCyrillic(word) {
    return word.toLowerCase()
      .split('')
      .map(function(letter, key, array) {
        var previousLetter = getPreviousLetter(key, STEP_ONE, array);
        var previousLetterStepTwo = getPreviousLetter(key, STEP_TWO, array);
        var nextLetter = getNextLetter(key, STEP_ONE, array);
        var nextLetterStepTwo = getNextLetter(key, STEP_TWO, array);

        if (letter === 's' && nextLetter === 'c' && nextLetterStepTwo === 'h') {return LETTERS_MAP[letter + nextLetter + nextLetterStepTwo];
        }
        else if (previousLetter === 's' && letter === 'c' && nextLetter === 'h') {return '';
        }
        else if (previousLetterStepTwo === 's' && previousLetter === 'c' && letter === 'h') {return '';
        }
        else if ((letter === 'c' && nextLetter === 'h')
          || (letter === 'e' && nextLetter === 'h')
          || (letter === 'i' && nextLetter === 'a')
          || (letter === 'i' && nextLetter === 'e')
          || (letter === 'i' && nextLetter === 'u')
          || (letter === 'i' && nextLetter === 'y')
          || (letter === 'j' && nextLetter === 'a')
          || (letter === 'j' && nextLetter === 'o')
          || (letter === 'j' && nextLetter === 'u')
          || (letter === 'k' && nextLetter === 'h')
          || (letter === 's' && nextLetter === 'h') || (letter === 't' && nextLetter === 's') || (letter === 'y' && nextLetter === 'a')
          || (letter === 'y' && nextLetter === 'o')
          || (letter === 'z' && nextLetter === 'h')) {
          return LETTERS_MAP[letter + nextLetter];
        }
        else if ((letter === 'h' && previousLetter === 'c')
          || (letter === 'h' && previousLetter === 'e')
          || (letter === 'a' && previousLetter === 'i')
          || (letter === 'e' && previousLetter === 'i')
          || (letter === 'y' && previousLetter === 'i')
          || (letter === 'a' && previousLetter === 'j')
          || (letter === 'o' && previousLetter === 'j')
          || (letter === 'u' && previousLetter === 'j')
          || (letter === 'h' && previousLetter === 'k')
          || (letter === 'h' && previousLetter === 's') || (letter === 's' && previousLetter === 't') || (letter === 'a' && previousLetter === 'y')
          || (letter === 'o' && previousLetter === 'y')
          || (letter === 'h' && previousLetter === 'z')) {
          return '';
        }

        return LETTERS_MAP[letter] || letter;
      })
      .join('');
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = translitLatinToCyrillic;
  }
  else {
    window.translitLatinToCyrillic = translitLatinToCyrillic;
  }
})();
