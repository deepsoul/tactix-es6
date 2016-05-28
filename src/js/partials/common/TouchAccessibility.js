'use strict';

var Controller = require('../../base/Controller');
require('pepjs');

module.exports = Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
    }
});
