"use strict";

var Controller = require('../../base/Controller');
var blockAdBlock = require('exports?blockAdBlock!blockadblock');

module.exports = Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        blockAdBlock.onDetected(function() {
            this.el.classList.add('js-active');
        }.bind(this));
    }
});
