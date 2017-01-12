"use strict";



var Controller = require('../../base/Controller');

module.exports = Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        require("style!outdated-browser/outdatedbrowser/outdatedbrowser.css");
        global.animationFrame.addOnce(function() {
            var outdatedBrowser = require('exports?outdatedBrowser!outdated-browser/outdatedbrowser/outdatedbrowser');
            outdatedBrowser({
                bgColor: '#f25648',
                color: '#ffffff',
                lowerThan: 'IE9',
                languagePath: ''
            });
            // this.el.classList.remove('js-hidden');
        }.bind(this));
    }
});
