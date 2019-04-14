//https://www.korean.go.kr/front_eng/roman/roman_01.do
var Hangul = require('hangul-disassemble');
var _ = require('lodash');

const simple_vowels = {
    "ㅏ": "a",
    "ㅓ": "eo",
    "ㅗ": "o",
    "ㅜ": "u",
    "ㅡ": "eu",
    "ㅣ": "i",
    "ㅐ": "ae",
    "ㅔ": "a",
    "ㅚ": "oe",
    "ㅟ": "w",
}

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
    "ㅢ": "ui",
}

const plosives = {
    "ㄱ": ["g", "k"],
    "ㄲ": ["kk"],
    "ㅋ": ["k"],
    "ㄷ": ["d", "t"],
    "ㄸ": ["tt"],
    "ㅌ": ["t"],
    "ㅂ": ["b", "p"],
    "ㅃ": ["pp"],
    "ㅍ": ["p"],
}

const affricates = {   
    "ㅈ":"j",
    "ㅉ":"jj",
    "ㅊ":"ch",
}

const fricatives = {
    "ㅅ":"s",
    "ㅆ":"ss",
    "ㅎ":"h",
}    

const nasals = {
    "ㄴ":"n",
    "ㅁ":"m",
    "ㅇ":"ng",
}

const liquids = {
    "ㄹ": ["r", "l"],
}

const consonants = {
    ...plosives,
    ...affricates,
    ...fricatives,
    ...nasals,
    ...liquids
};

function romanize_plosive(jamo, options, next, prev){
    // The case of assimilation of adjacent consonants; 
    if( 
        options.last             // is a final plosive
        && next.is_nasal         // followed by a nasal
        && !(                    // that is not a simple solo vowel
            next.is_ieung 
            && next.is_simple_vowel  
        )
        && ['ㄱ'].includes(jamo)
    ){
        return ["ng", {}]
    }

    // 같이 
    if( 
        options.last             // is a final plosive
        && next.is_ieung         // followed by a ㅇ 
        && ['ㅌ'].includes(jamo)  // 
    ){
        return ["ch", {}]
    }

    // 굳히다 - we are doing back to front
    if(
        ['ㄷ'].includes(jamo)          // check if there is a ㄷ
        && options.last               // in the badchim  
        && !options.final             // but not the final
        && ['ㅎ'].includes(next.jamo) // next to a hieut
    ){
        return ["", {}]
    }

    // 돋이 
    if(
        ['ㄷ'].includes(jamo) // check if there is a ㄷ
        && options.last      // in the badchim  
        && !options.final    // but not the final
        && next.is_ieung     // next to a hieut
    ){
        return ["j", {}]
    }

    if(
        ['ㅎ'].includes(prev.jamo)
    ){
        return [plosives[jamo][plosives[jamo].length-1], {}]
    }

    // General cases ... 

    // Note 1 : The sounds ㄱ, ㄷ, and ㅂ are transcribed respectively as g, d, and b before a vowel;
    if(next.is_vowel || options.first){
        return [plosives[jamo][0], {}]
    }

    // they are transcribed as k, t, and p when they appear before another consonant 
    // or as the last sound of a word
    if( next.is_consonant || options.final){
        return [plosives[jamo][plosives[jamo].length-1], {}] 
    }
    return ["#", {}]
}

function romanize_liquids(jamo, options, next, prev){

    // Handle case where ㄹ followed by 야 여 ... 
    if(next.is_ieung && Object.keys(diphtongs).includes(next.vowel)){
        return ['ll', {}]
    }

    // Jongno 
    if(prev.is_ieung){
        return ["n", {}]
    }
    
    // as l before a consonant or at the end of a word: ㄹㄹ is transcribed as ll.
    if(next.is_consonant && !next.is_ieung){
        return ["l", {}]
    }

    if(prev.is_riel){
        return ["l", {}]
    }

    //Note 2 : ㄹ is transcribed as r before a vowel, 
    if(options.last && next.is_simple_vowel){
        return ["r", {}]
    }

    if(options.first && Object.keys(simple_vowels).includes(options.me.vowel)){
        return ["r", {}]
    }
    
    return ["l", {}]
}

function romanize_cons(jamo, _options, next, prev){
    const options = {
        ..._options,
    }
    // console.log("Consonant", jamo, options, next, prev)
 
    if(jamo in plosives)
    {   
        return romanize_plosive(jamo, options, next, prev)
    }

    if(jamo in affricates){
        if(options.final || options.last){
            if(['ㅈ', 'ㅊ'].includes(jamo)){
                return ["t", {}]
            }
        }

        if(
            ['ㅈ'].includes(jamo)
            && ['ㅎ'].includes(prev.jamo)
        ){
            return ["ch", {}]
        }

        return [affricates[jamo], {}] 
    }

    if(jamo in nasals){
        if(options.first && jamo === "ㅇ") return ["", {first: true}]

        if( 
               next.is_riel && ['ㄴ'].includes(jamo)
            || prev.is_riel && ['ㄴ'].includes(jamo)
            && !options.last
        ){
            return ["l", {}]
        }
        return [nasals[jamo], {}]
    }

    // NOTE: liquids is just ㄹ  
    if (jamo in liquids){
        return romanize_liquids(jamo, options, next, prev)
    }

    if(jamo in fricatives){

        // 굳히다 
        if(
            ['ㅎ'].includes(jamo)
            && ['ㄷ'].includes(prev.jamo)
        ){
            return ["ch", {}]
        }

        // if the ㅎ is in the badchim, just ignore it
        // we will handle on the right side 
        if(
            ['ㅎ'].includes(jamo) 
            && options.last
        ){
            return ["", {}]
        }

        if(
            ['ㅅ'].includes(jamo)
            && options.last
            && !next.is_ieung
        ){
            return ["t", {}]
        }

        return [fricatives[jamo], {}]
    }

    return [consonants[jamo], {}]
}

function romanize_vowel(jamo, options, next, prev){
    let out = "@"
    // console.log("vowel", jamo)
    if(jamo in simple_vowels){
        out = simple_vowels[jamo]
    }
    if(jamo in diphtongs){
        if(
            ['ㄱ'].includes(prev.jamo)
            && ['ㅇ'].includes(options.me.first)
        ){
            out = "n" + diphtongs[jamo]
        }
        else{
            out = diphtongs[jamo]
        }
    }
    if (options.first){ out = cap(out)}
    return [out, {}]
}

function romanize_jamo(jamo, options, next_syl, prev_syl){
    // console.log("r_jamo" , jamo, options, next_syl, prev_syl)
    if(jamo === ""){
        return ["", {first: true}]
    }

    const next_jamo = _.get(next_syl, "first", "")
    const next_vowel = _.get(next_syl, "vowel", "")
    const prev_jamo = _.get(prev_syl, "last", "")
    const prev_vowel = _.get(prev_syl, "vowel", "")
    
    const next = {
        jamo: next_jamo,
        vowel: next_vowel,
        is_vowel: next_jamo === "ㅇ",
        is_simple_vowel: Object.keys(simple_vowels).includes(next_vowel),
        is_ieung: next_jamo === "ㅇ",
        is_consonant: next_jamo in consonants,
        is_nasal: next_jamo in nasals,
        is_riel: next_jamo === "ㄹ",
    }
    const prev = {
        jamo: prev_jamo,
        vowel: prev_vowel,
        is_consonant: prev_jamo in consonants,
        is_riel: prev_jamo === "ㄹ",
        is_ieung: prev_jamo === "ㅇ",
    }

    if(options.vowel){
        return romanize_vowel(jamo, options, next, prev)
    }
    return romanize_cons(jamo, options, next, prev)
}

export function romanize(word){
    let syllables =  Hangul.disassemble(word)
    let output = []
    let tmp = ""
    let res = ["", {first: true, hard: false}]
    for (let i = syllables.length-1; i >= 0; i--) {
        const {first, vowel, last} = syllables[i];
        let next = syllables[i+1]
        let prev = syllables[i-1]

        // console.log("Syllable", syllables[i], prev, next)
        let opts = { me: syllables[i], first: true}
        res = romanize_jamo(first, opts, next, prev)
        tmp += res[0]
        opts = { me: syllables[i], vowel: true}
        res = romanize_jamo(vowel, opts, next, prev)
        tmp += res[0]
        opts = { me: syllables[i], last: true, final: (i===syllables.length-1)}
        res = romanize_jamo(last, opts, next, prev)
        tmp += res[0]
        output.push( tmp )
        tmp = ""
    }

    let romanized = output.reverse().join('');

    // because im going backwards... maybe we need to do two pass?
    romanized = romanized.replace(/lr/g, "ll")

    // console.log("output", output, romanized)
    return romanized
}

module.exports = romanize;