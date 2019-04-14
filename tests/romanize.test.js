
var romanize = require('../src/index.js');

test("assert true === true", () => {
    expect(true).toBe(true)
})

// check all examples from the national institute
// https://www.korean.go.kr/front_eng/roman/roman_01.do
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
    ["학여울", "hangnyeoul"],
    ["항녀울", "hangnyeoul"],
    ["알약", "allyak"],
    // The case of palatalization
    ["해돋이", "haedoji"],
    ["같이", "gachi"],
    ["가치", "gachi"],
    ["굳히다", "guchida"],
    ["구치다", "guchida"],
    // The case when ㄱ, ㄷ, ㅂ, and ㅈ are adjacent to ㅎ
    ["좋고", "joko"],
    ["조코", "joko"],
    ["놓다", "nota"],
    ["노타", "nota"],
    ["잡혀", "japhyeo"], // ["잡혀", "japyeo"],
    ["자펴", "japyeo"],
    ["낳지", "nachi"],
    ["나치", "nachi"],
    // However, aspirated sounds are not transcribed in case of nouns where ㅎ follows ㄱ, ㄷ, and ㅂ, as in the examples below.
    ["묵호", "mukho"],
    ["집현전", "jiphyeonjeon"], // TODO: this one directly conflicts with 잡혀 will check later
    //Note: Tense (or glottalized) sounds are not transcribed in cases where morphemes are compounded, as in the examples below.
    ["압구정", "apgujeong",],
    ["낙동강", "nakdonggang",],	
    ["죽변", "jukbyeon",],	
    ["낙성대", "nakseongdae",],
    ["합정", "hapjeong",],	
    ["팔당", "paldang",],	
    ["샛별", "saetbyeol",],	
    ["울산", "ulsan",],
    // When there is the possibility of confusion in pronunciation, a hyphen ‘-’ may be used.
    // TODO: decide if we should support hyphen between all sylables 
    ["중앙", "jung-ang".replace("-", "")],	
    ["반구대", "ban-gudae".replace("-", "")],
    ["세운", "se-un".replace("-", "")],	
    ["해운대", "hae-undae".replace("-", "")],

    // The first letter is capitalized in proper names.
    // TODO: support ?

    // Personal names are written by family name first, 
    // followed by a space and the given name. As a rule, 
    // syllables in given names are not seperated by hyphen, 
    // but it is admitted to use a hyphen between syllables. 
    // (Transcription in (  ) is permitted.)
    // TODO: support ?

    // Assimilated sound changes between syllables in given names are not transcribed.
    // 한복남	Han Boknam (Han Bok-nam)	홍빛나	Hong Bitna (Hong Bit-na)
    // TODO: support ? 

    // Administrative units such as 도, 시, 군, 구, 읍, 면, 리, 동, and 가 
    // are transcribed respectively as do, si, gun, gu, eup, myeon, ri, dong, and ga, and are preceded by a hyphen. 
    // Assimilated sound changes before and after the hyphen are not transcribed.
    // TODO: support ? 
    /*
        충청북도	Chungcheongbuk-do	제주도	Jeju-do	의정부시	Uijeongbu-si
        양주군	Yangju-gun	도봉구	Dobong-gu	신창읍	Sinchang-eup
        삼죽면	Samjuk-myeon	인왕리	Inwang-ri	당산동	Dangsan-dong
        봉천1동	Bongcheon 1(il) -dong	종로 2가	Jongno 2(i) -ga	퇴계로 3가	Toegyero 3(sam) -ga
    */

    // Names of geographic features, cultural properties, and man-made structures may be written without hyphens.
    // TODO: support ? 
    /*
        남산	Namsan	속리산	Songnisan	금강	Geumgang
        독도	Dokdo	경복궁	Gyeongbokgung	무량수전	Muryangsujeon
        연화교	Yeonhwagyo	극락전	Geungnakjeon	안압지	Anapji
        남한산성	Namhansanseong	화랑대	Hwarangdae	불국사	Bulguksa
        현충사	Hyeonchungsa	독립문	Dongnimmun	오죽헌	Ojukheon
        촉석루	Chokseongnu	종묘	Jongmyo	다보탑	Dabotap
    */

    // When it is necessary to convert Romanized Korean back to Hangeul in special cases such as in academic articles, 
    // Romanization is done according to Hangeul spelling and not pronunciation.
    // Each Hangeul letter is Romanized as explained in section 2 
    // except that ㄱ, ㄷ, ㅂ, ㄹ are always written as g, d, b, l. 
    // When ㅇ has no sound value, it is replaced by a hyphen. 
    // It may also be used when it is necessary to distinguish between syllables.
    // TODO: support ? 
    /*
        집	jib	짚	jip
        밖	bakk	값	gabs
        붓꽃	buskkoch	먹는	meogneun
        독립	doglib	문리	munli
        물엿	mul-yeos	굳이	gud-i
        좋다	johda	가곡	gagog
        조랑말	jolangmal	없었습니다.	eobs-eoss-seubnida
    */
]
examples.map( (item) => {
    const [kr, en, _] = item;
    test(["Testing example", kr, "->", en].join(" "), () => {
        expect(romanize(kr).toLowerCase()).toBe(en)
    });
})

const punctuation_words = [
    ["안녕하세요?", "annyeonghaseyo?"]
];
punctuation_words.map( (item) => {
    const [kr, en] = item;
    test(["check words with punctuation", kr, "->", en].join(" "), () => {
        expect(romanize(kr).toLowerCase()).toBe(en)
    });
})

// [ "표기법", "pyogibeop"],
// 안녕하세요?