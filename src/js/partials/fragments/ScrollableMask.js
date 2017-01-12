"use strict";

var StateObserver = require('../../base/scroll/StateObserver');

var Velocity = require('velocity-animate');

module.exports = StateObserver.extend({
    tween: null,

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

        Velocity(this.el.querySelector('figcaption'), {
            translateY: '100%'
        }, 350);

        this.model.on('change:triggered', function(model, value) {            
            if(value) {
                Velocity(this.el.querySelector('figcaption'), {
                    translateY: '0%'
                }, 350);
            } else {
                Velocity(this.el.querySelector('figcaption'), {
                    translateY: '100%'
                }, 350);
            }
        }.bind(this));

        this.pictureStyle = picture.style;
    },

    onActive: function(info) {
        StateObserver.prototype.onActive.apply(this, arguments);
        if(this.pictureStyle) {
            this.pictureStyle.cssText = global.prefix.css + 'transform' + ': translateY(' + info.y * -10 + '%);';
        }
    },

    onInactive: function() {
        StateObserver.prototype.onInactive.apply(this, arguments);
        // console.log('inactive',info);
    }
});
