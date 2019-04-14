
var romanize = require('./romanization');

test("assert true === true", () => {
    expect(true).toBe(true)
})

//check all examples from the national institute
const examples = [
    ["구미", "gumi", ""],
    ["명동", "myeongdong", ""],
    ["영동", "yeongdong", ""],
    ["백암", "baegam", ""],
    ["옥천", "okcheon", ""],
    ["합덕", "hapdeok", ""],
    ["호법", "hobeop", ""],
    ["월곶", "wolgot", ""],
    ["월곧", "wolgot", ""],
    ["벚꽃", "beotkkot", ""],
    ["벋꼳", "beotkkot", ""],
    ["한밭", "hanbat", ""],
    ["한받", "hanbat", ""],
    ["구리", "guri",""],	
    ["설악", "seorak",""],
    ["칠곡", "chilgok",""],	
    ["임실", "imsil",""],
    ["울릉", "ulleung",""],	
    ["대관령", "daegwallyeong",""],
    ["대괄령", "daegwallyeong",""],
    // The case of assimilation of adjacent consonants
    ["백마", "baengma", "",],
    ["뱅마", "baengma", "",],
    // ["신문로", "sinmunno", "",],
    // ["신문노", "sinmunno", "",],	
    ["종로", "jongno", "",],
    ["종노", "jongno", "",],
    // ["왕십리", "wangsimni", "",],
    // ["왕심니", "wangsimni", "",],
    ["별내", "byeollae", "",],
    ["별래", "byeollae", "",],
    ["신라", "silla", "",],
    ["실라", "silla", "",],
    //The case of the epenthetic ㄴ and ㄹ
    ["학여울", "hangnyeoul", ""],
    ["항녀울", "hangnyeoul", ""],
    // ["알약", "allyak", ""],
    // ["알락", "allyak", ""],
    // Extra: 
    [ "표기법", "pyogibeop", ""],
]

examples.map( (item) => {
    const [kr, en, _] = item;
    test(["Testing example", kr, "->", en].join(" "), () => {
        expect(romanize(kr).toLowerCase()).toBe(en)
    });
})
