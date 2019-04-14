# @gabeochoa/pyogibeop

![npm (scoped)](https://img.shields.io/npm/v/@gabeochoa/pyogibeop.svg)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@gabeochoa/pyogibeop.svg)
![npm](https://img.shields.io/npm/dt/@gabeochoa/pyogibeop.svg)


Korean romanization utility for JavaScript

## Usage

### HTML

Include `romanize.js` into your HTML page. All is set!

```js
<script type="text/javascript" src="romanize.min.umd.js"></script>
<script type="text/javascript">
    // Converts to Latin script
    romanize("안녕하세요?") //annyeonghaseyo?
</script>
```

### Node.js / React

This module can be installed via npm:

```sh
$ npm install @gabeochoa/pyogibeop --save
```

```js
var romanize = require('@gabeochoa/pyogibeop');
// Converts to Latin script
romanize("안녕하세요?") // annyeonghaseyo?
```

## License

pyogibeop is released under the MIT License.<br />
&copy; 2019 gabeochoa


## Notes

- all rules came from the [National Institute of Korean Language](https://www.korean.go.kr/front_eng/roman/roman_01.do)
- check you answers on [here](http://roman.cs.pusan.ac.kr/input_eng.aspx?) as they provide different romanizations depending on use 

## Changelog 

#### 0.1.9

* Reduce package size (was 4.41kb) 

#### 0.1.7

* Change way of compiling js to support usage

#### 0.1.1

* Fix issue where punctuation would add 'undefined' to string

#### 0.1.0

* Public release
