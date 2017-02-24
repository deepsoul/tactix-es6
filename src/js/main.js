"use strict";
// require('swiper');
require('jquery/../event');
require('jquery/../event/trigger');
require('jquery/../data');

var js = require('./services/parser/js');
require('./services/touchIndicator');

js.parse();
global.picture.ready(function() {
    console.log('READY');
});

// var f = ([a, b] = [1, 2], {x: c} = {x: a + b}) => a + b + c;
// f();  // 6
