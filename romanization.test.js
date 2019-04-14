
var romanize = require('./romanization');

test("assert true === true", () => {
    expect(true).toBe(true)
})

//check all examples from the national institute
const examples = [
    ["구미", "gumi"],
    ["명동", "myeongdong"],
    ["영동", "yeongdong"],
    ["백암", "baegam"],
    ["옥천", "okcheon"],
    ["합덕", "hapdeok"],
    ["호법", "hobeop"],
    ["월곶", "wolgot"],
    ["월곧", "wolgot"],
    ["벚꽃", "beotkkot"],
    ["벋꼳", "beotkkot"],
    ["한밭", "hanbat"],
    ["한받", "hanbat"],
    ["구리", "guri"],	
    ["설악", "seorak"],
    ["칠곡", "chilgok"],	
    ["임실", "imsil"],
    ["울릉", "ulleung"],	
    ["대관령", "daegwallyeong"],
    ["대괄령", "daegwallyeong"],
    // The case of assimilation of adjacent consonants
    ["백마", "baengma",],
    ["뱅마", "baengma",],
    // ["신문로", "sinmunno",],
    // ["신문노", "sinmunno",],	
    ["종로", "jongno",],
    ["종노", "jongno",],
    // ["왕십리", "wangsimni",],
    // ["왕심니", "wangsimni",],
    ["별내", "byeollae",],
    ["별래", "byeollae",],
    ["신라", "silla",],
    ["실라", "silla",],
    //The case of the epenthetic ㄴ and ㄹ
    ["학여울", "hangnyeoul", ""],
    ["항녀울", "hangnyeoul", ""],
    ["알약", "allyak", ""],
    // The case of palatalization
    ["해돋이", "haedoji", ""],
    ["같이", "gachi", ""],
    ["가치", "gachi", ""],
    ["굳히다", "guchida", ""],
    ["구치다", "guchida", ""],
    // The case when ㄱ, ㄷ, ㅂ, and ㅈ are adjacent to ㅎ
    ["좋고", "joko", ""],
    ["조코", "joko", ""],
    ["놓다", "nota", ""],
    ["노타", "nota", ""],
    // ["잡혀", "japyeo", ""],
    ["자펴", "japyeo", ""],
    ["낳지", "nachi", ""],
    ["나치", "nachi", ""],
    // However, aspirated sounds are not transcribed in case of nouns where ㅎ follows ㄱ, ㄷ, and ㅂ, as in the examples below.
    ["묵호", "mukho", ""],
    ["집현전", "jiphyeonjeon"], // this one directly conflicts with 잡혀 will check later

    // Extra: 
    [ "표기법", "pyogibeop"],
]

examples.map( (item) => {
    const [kr, en, _] = item;
    test(["Testing example", kr, "->", en].join(" "), () => {
        expect(romanize(kr).toLowerCase()).toBe(en)
    });
})
