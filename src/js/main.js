"use strict";

var js = require('./services/parser/js');
require('./services/touchIndicator');

// document.addEventListener( "DOMContentLoaded", function() {
    global.picture.ready(function() {
        console.log('READY');

        // var count = 0;
        // var task = global.animationFrame.add(function(step, time) {
        //     if(++count === 120) {
        //         global.animationFrame.remove(task);
        //     }
        //     console.log('Loop', step, time);
        // });
        //
        // global.animationFrame.add(function(step, time) {
        //     console.log('Sequence', step, time);
        // }, 2000);
        //
        // global.animationFrame.addOnce(function(time) {
        //     console.log('Single', time);
        // });
    });
    js.parse();
// }, false);

// $(function() {



// });
