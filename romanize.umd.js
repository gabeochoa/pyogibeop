(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.romanize = factory());
}(this, function () { 'use strict';

	var Hangul = {

		alphabets: [
			['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
			['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
			['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
		],

		disassemble: function(text, options) {
			options = options || {};
			var flatten = options.flatten || false;
			if (typeof text !== 'string') return null;
			if (text.length === 0) return '';
			return Hangul._disassembleMultipleCharacters(text, flatten);
		},

		toString: function(text) {
			return Hangul.disassemble(text, {flatten: true}).join('');
		},

		isHangul: function(text) {
			const hangul = Hangul.disassemble(text.replace(/[a-zA-Z0-9 ]/g, ''));
			for (var i in hangul) {
				if (typeof hangul[i] === 'object') return true;
				if (Hangul.isConsonant(hangul[i]) || Hangul.isVowel(hangul[i])) return true;
			}
			return false;
		},

		equals: function(a, b) {
			if (a === b) return true;
			return Hangul.toString(a) === Hangul.toString(b);
		},

		isVowel: function(character) {
			if (!character) return false;
			for (var i in Hangul.alphabets[1]) {
				if (character === Hangul.alphabets[1][i]) return true;
			}
			return false;
		},

		isConsonant: function(character) {
			if (!character) return false;
			for (var i in Hangul.alphabets[0]) {
				if (character === Hangul.alphabets[0][i]) return true;
			}
			for (var j in Hangul.alphabets[2]) {
				if (character === Hangul.alphabets[2][j]) return true;
			}
			return false;
		},

		_disassembleSingleCharacter: function(singleCharacter, flatten) {
			var code = singleCharacter.charCodeAt(0);
			if (code === 32 || code === 39 || code === 44) return singleCharacter;
			if (Hangul.isConsonant(singleCharacter) || Hangul.isVowel(singleCharacter)) {
				if (flatten) return [singleCharacter];
				else return null;
			}
			if (code < 0xAC00 || code > 0xD7A3) return singleCharacter;
			code = code - 0xAC00;

			var last = code % 28;
			var vowel = ((code - last) / 28) % 21;
			var first = (((code - last) / 28) - vowel) / 21;
			var result = {
				first: Hangul.alphabets[0][first],
				vowel: Hangul.alphabets[1][vowel],
				last: Hangul.alphabets[2][last]
			};

			if (!flatten) return result;

			var flat = [];
			if (result.first) flat.push(result.first);
			if (result.vowel) flat.push(result.vowel);
			if (result.last) flat.push(result.last);

			return flat;
		},

		_disassembleMultipleCharacters: function(multipleCharacters, flatten) {
			var result = [];
			for (var i = 0; i < multipleCharacters.length; i++) {
				var disassembled = Hangul._disassembleSingleCharacter(multipleCharacters.charAt(i), flatten);
				if (flatten) result = result.concat(disassembled);
				else result.push(disassembled);
			}
			return result;
		}

	};

	var hangulDisassemble = Hangul;

	// var Hangul = require('hangul-disassemble');
	const simple_vowels = {
	  "ㅏ": "a",
	  "ㅓ": "eo",
	  "ㅗ": "o",
	  "ㅜ": "u",
	  "ㅡ": "eu",
	  "ㅣ": "i",
	  "ㅐ": "ae",
	  "ㅔ": "e",
	  "ㅚ": "oe",
	  "ㅟ": "w"
	};
	const diphtongs = {
	  "ㅑ": "ya",
	  "ㅕ": "yeo",
	  "ㅛ": "yo",
	  "ㅠ": "yu",
	  "ㅒ": "yae",
	  "ㅖ": "ye",
	  "ㅘ": "wa",
	  "ㅙ": "wae",
	  "ㅝ": "wo",
	  "ㅟ": "wo",
	  "ㅞ": "we",
	  "ㅢ": "ui"
	};
	const plosives = {
	  "ㄱ": ["g", "k"],
	  "ㄲ": ["kk"],
	  "ㅋ": ["k"],
	  "ㄷ": ["d", "t"],
	  "ㄸ": ["tt"],
	  "ㅌ": ["t"],
	  "ㅂ": ["b", "p"],
	  "ㅃ": ["pp"],
	  "ㅍ": ["p"]
	};
	const affricates = {
	  "ㅈ": "j",
	  "ㅉ": "jj",
	  "ㅊ": "ch"
	};
	const fricatives = {
	  "ㅅ": "s",
	  "ㅆ": "ss",
	  "ㅎ": "h"
	};
	const nasals = {
	  "ㄴ": "n",
	  "ㅁ": "m",
	  "ㅇ": "ng"
	};
	const liquids = {
	  "ㄹ": ["r", "l"]
	};
	const consonants = { ...plosives,
	  ...affricates,
	  ...fricatives,
	  ...nasals,
	  ...liquids
	};

	function romanize_plosive(jamo, options, next, prev) {
	  // The case of assimilation of adjacent consonants; 
	  if (options.last // is a final plosive
	  && next.is_nasal // followed by a nasal
	  && !( // that is not a simple solo vowel
	  next.is_ieung && next.is_simple_vowel) && ['ㄱ'].includes(jamo)) {
	    return ["ng", {}];
	  } // 같이 


	  if (options.last // is a final plosive
	  && next.is_ieung // followed by a ㅇ 
	  && ['ㅌ'].includes(jamo) // 
	  ) {
	      return ["ch", {}];
	    } // 굳히다 - we are doing back to front


	  if (['ㄷ'].includes(jamo) // check if there is a ㄷ
	  && options.last // in the badchim  
	  && !options.final // but not the final
	  && ['ㅎ'].includes(next.jamo) // next to a hieut
	  ) {
	      return ["", {}];
	    } // 돋이 


	  if (['ㄷ'].includes(jamo) // check if there is a ㄷ
	  && options.last // in the badchim  
	  && !options.final // but not the final
	  && next.is_ieung // next to a hieut
	  ) {
	      return ["j", {}];
	    }

	  if (['ㅎ'].includes(prev.jamo)) {
	    return [plosives[jamo][plosives[jamo].length - 1], {}];
	  } // General cases ... 
	  // Note 1 : The sounds ㄱ, ㄷ, and ㅂ are transcribed respectively as g, d, and b before a vowel;


	  if (next.is_vowel || options.first) {
	    return [plosives[jamo][0], {}];
	  } // they are transcribed as k, t, and p when they appear before another consonant 
	  // or as the last sound of a word


	  if (next.is_consonant || options.final) {
	    return [plosives[jamo][plosives[jamo].length - 1], {}];
	  }

	  return ["#", {}];
	}

	function romanize_liquids(jamo, options, next, prev) {
	  // Handle case where ㄹ followed by 야 여 ... 
	  if (next.is_ieung && Object.keys(diphtongs).includes(next.vowel)) {
	    return ['ll', {}];
	  } // Jongno 


	  if (prev.is_ieung) {
	    return ["n", {}];
	  } // as l before a consonant or at the end of a word: ㄹㄹ is transcribed as ll.


	  if (next.is_consonant && !next.is_ieung) {
	    return ["l", {}];
	  }

	  if (prev.is_riel) {
	    return ["l", {}];
	  } //Note 2 : ㄹ is transcribed as r before a vowel, 


	  if (options.last && next.is_simple_vowel) {
	    return ["r", {}];
	  }

	  if (options.first && Object.keys(simple_vowels).includes(options.me.vowel)) {
	    return ["r", {}];
	  }

	  return ["l", {}];
	}

	function romanize_cons(jamo, _options, next, prev) {
	  const options = { ..._options
	  }; // console.log("Consonant", jamo, options, next, prev)

	  if (jamo in plosives) {
	    return romanize_plosive(jamo, options, next, prev);
	  }

	  if (jamo in affricates) {
	    if (options.final || options.last) {
	      if (['ㅈ', 'ㅊ'].includes(jamo)) {
	        return ["t", {}];
	      }
	    }

	    if (['ㅈ'].includes(jamo) && ['ㅎ'].includes(prev.jamo)) {
	      return ["ch", {}];
	    }

	    return [affricates[jamo], {}];
	  }

	  if (jamo in nasals) {
	    if (options.first && jamo === "ㅇ") return ["", {
	      first: true
	    }];

	    if (next.is_riel && ['ㄴ'].includes(jamo) || prev.is_riel && ['ㄴ'].includes(jamo) && !options.last) {
	      return ["l", {}];
	    }

	    return [nasals[jamo], {}];
	  } // NOTE: liquids is just ㄹ  


	  if (jamo in liquids) {
	    return romanize_liquids(jamo, options, next, prev);
	  }

	  if (jamo in fricatives) {
	    // 굳히다 
	    if (['ㅎ'].includes(jamo) && ['ㄷ'].includes(prev.jamo)) {
	      return ["ch", {}];
	    } // if the ㅎ is in the badchim, just ignore it
	    // we will handle on the right side 


	    if (['ㅎ'].includes(jamo) && options.last) {
	      return ["", {}];
	    }

	    if (['ㅅ'].includes(jamo) && options.last && !next.is_ieung) {
	      return ["t", {}];
	    }

	    return [fricatives[jamo], {}];
	  }

	  return [consonants[jamo], {}];
	}

	function romanize_vowel(jamo, options, next, prev) {
	  let out = "@"; // console.log("vowel", jamo)

	  if (jamo in simple_vowels) {
	    out = simple_vowels[jamo];
	  }

	  if (jamo in diphtongs) {
	    if (['ㄱ'].includes(prev.jamo) && ['ㅇ'].includes(options.me.first)) {
	      out = "n" + diphtongs[jamo];
	    } else {
	      out = diphtongs[jamo];
	    }
	  }

	  return [out, {}];
	}

	function get_default(object, key, default_val) {
	  if (object == null || object == undefined) return default_val;
	  return object[key];
	}

	function romanize_jamo(jamo, options, next_syl, prev_syl) {
	  // console.log("r_jamo" , jamo, options, next_syl, prev_syl)
	  if (jamo === "") {
	    return ["", {
	      first: true
	    }];
	  }

	  const next_jamo = get_default(next_syl, "first", "");
	  const next_vowel = get_default(next_syl, "vowel", "");
	  const prev_jamo = get_default(prev_syl, "last", "");
	  const prev_vowel = get_default(prev_syl, "vowel", "");
	  const next = {
	    jamo: next_jamo,
	    vowel: next_vowel,
	    is_vowel: next_jamo === "ㅇ",
	    is_simple_vowel: Object.keys(simple_vowels).includes(next_vowel),
	    is_ieung: next_jamo === "ㅇ",
	    is_consonant: next_jamo in consonants,
	    is_nasal: next_jamo in nasals,
	    is_riel: next_jamo === "ㄹ"
	  };
	  const prev = {
	    jamo: prev_jamo,
	    vowel: prev_vowel,
	    is_consonant: prev_jamo in consonants,
	    is_riel: prev_jamo === "ㄹ",
	    is_ieung: prev_jamo === "ㅇ"
	  };

	  if (options.vowel) {
	    return romanize_vowel(jamo, options, next, prev);
	  }

	  return romanize_cons(jamo, options, next, prev);
	}

	function romanize(word) {
	  let syllables = hangulDisassemble.disassemble(word); // console.log(syllables)

	  let output = [];
	  let tmp = "";
	  let res = ["", {
	    first: true,
	    hard: false
	  }];

	  for (let i = syllables.length - 1; i >= 0; i--) {
	    if (Object.keys(syllables[i]).length != 3) {
	      output.push(syllables[i]);
	      continue;
	    }

	    const {
	      first,
	      vowel,
	      last
	    } = syllables[i];
	    let next = syllables[i + 1];
	    let prev = syllables[i - 1]; // console.log("Syllable", syllables[i], prev, next)

	    let opts = {
	      me: syllables[i],
	      first: true
	    };
	    res = romanize_jamo(first, opts, next, prev);
	    tmp += res[0];
	    opts = {
	      me: syllables[i],
	      vowel: true
	    };
	    res = romanize_jamo(vowel, opts, next, prev);
	    tmp += res[0];
	    opts = {
	      me: syllables[i],
	      last: true,
	      final: i === syllables.length - 1
	    };
	    res = romanize_jamo(last, opts, next, prev);
	    tmp += res[0];
	    output.push(tmp);
	    tmp = "";
	  }

	  let romanized = output.reverse().join(''); // because im going backwards... maybe we need to do two pass?

	  romanized = romanized.replace(/lr/g, "ll"); // console.log("output", output, romanized)

	  return romanized;
	}

	return romanize;

}));
