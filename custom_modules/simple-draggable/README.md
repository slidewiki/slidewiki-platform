
# simple-draggable

 [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/simple-draggable.svg)](https://www.npmjs.com/package/simple-draggable) [![Downloads](https://img.shields.io/npm/dt/simple-draggable.svg)](https://www.npmjs.com/package/simple-draggable) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> A tiny library to make elements draggable.

## :cloud: Installation

```sh
$ npm i --save simple-draggable
```


## :clipboard: Example



```js
SimpleDraggable(".cursor", {
    onlyX: false
  , onlyY: false
  , onStart: function (event, element) {
        // Do something on drag start
    }
  , onStop: function (event, element) {
        // Do something on drag stop
    }
  , onDrag: function (event, element) {
        // Do something on drag drag
    }
});
```

## :memo: Documentation


### `SimpleDraggable(selector, options)`
Initializes the draggable state.

#### Params
- **String** `selector`: The element query selector.
- **Object** `options`: An object containing:
 - `onStart` (Function): A function to run on drag start.
 - `onStop` (Function): A function to run on drag stop.
 - `onDrag` (Function): A function to run on drag move.
 - `onlyX` (Boolean): Drag the element only on the X axis.
 - `onlyY` (Boolean): Drag the element only on the Y axis.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2014#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
