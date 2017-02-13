"use strict";

require('jquery/src/event');
require('jquery/src/event/trigger');
require('jquery/src/data');

var js = require('./services/parser/js');
require('./services/touchIndicator');

js.parse();
global.picture.ready(function() {
    console.log('READY');
});
