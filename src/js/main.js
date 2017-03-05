"use strict";

import 'jquery/../event';
import 'jquery/../event/trigger';
import 'jquery/../data';
import 'modernizr-loader!modernizr';
import js from './services/parser/js';
import './services/touchIndicator';

js.parse();
global.picture.ready(function() {
    console.log('READY Hurra!!!');
});



var f = ([a, b] = [1, 2], {x: c} = {x: a + b}) => console.log(a + b + c);
f();  // 6
