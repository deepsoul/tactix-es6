"use strict";

var PositionObserver = require('../../base/scroll/PositionObserver');
var modernizr = require('modernizr');

module.exports = PositionObserver.extend({

    modelConstructor: PositionObserver.prototype.modelConstructor.extend({
        session: {
            offset: {
                type: 'number',
                default: 0
            }
        }
    }),

    initialize: function() {
        PositionObserver.prototype.initialize.apply(this, arguments);

        var picture = this.el.querySelector('picture');

        this.pictureStyle = picture.style;
        this.prefixedAttr = modernizr.prefixedCSS('box-shadow');

    },

    onActive: function(info) {
        this.pictureStyle.cssText = this.prefixedAttr + ': 0px ' + (info.y * 10) + 'px 10px rgba(0, 0, 0, 0.5);';
    },

    onInactive: function(info) {
        // console.log('inactive',info);
    }
});
