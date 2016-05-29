"use strict";

var StateObserver = require('../../base/scroll/StateObserver');
var modernizr = require('modernizr');

module.exports = StateObserver.extend({

    modelConstructor: StateObserver.prototype.modelConstructor.extend({
        session: {
            offset: {
                type: 'number',
                default: 0
            }
        }
    }),

    initialize: function() {
        StateObserver.prototype.initialize.apply(this, arguments);

        var picture = this.el.querySelector('picture');

        this.pictureStyle = picture.style;
        this.prefixedAttr = modernizr.prefixedCSS('transform');
    },

    onActive: function(info) {
        StateObserver.prototype.onActive.apply(this, arguments);
        this.pictureStyle.cssText = this.prefixedAttr + ': translateY(' + info.y * -10 + '%);';
    },

    onInactive: function(info) {
        StateObserver.prototype.onInactive.apply(this, arguments);
        // console.log('inactive',info);
    }
});
