"use strict";

var StateObserver = require('../../base/scroll/StateObserver');

var anime = require('animejs');

module.exports = StateObserver.extend({
    tween: null,

    modelConstructor: StateObserver.prototype.modelConstructor.extend({
        session: {
            offset: {
                type: 'number',
                default: 0
            },
            triggered: {
                type: 'boolean',
                default: true
            }
        }
    }),

    initialize: function() {
        StateObserver.prototype.initialize.apply(this, arguments);

        var picture = this.el.querySelector('picture');

        this.tween = anime({
            targets: this.el.querySelector('figcaption'),
            translateY: {
                value: '100%',
                duration: 350
            },
            autoplay: true,
            direction: 'reverse'
        });

        this.model.on('change:triggered', function() {            
            this.tween.play();
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
