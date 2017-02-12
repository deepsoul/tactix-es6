"use strict";

var ScrollDirectionObserver = require('../../base/scroll/DirectionObserver');
var anime = require('animejs');

module.exports = ScrollDirectionObserver.extend({
    outOfViewport: false,
    handler: null,
    tween: null,

    onInit: function() {
        this.classList = this.el.classList;
        updateClass(this, true);
    },

    onUp: function() {

        updateClass(this, true);
    },

    onDown: function(viewportBounds) {
        updateClass(this, isOutOfViewport(this.bounds, viewportBounds));
    }
});

function updateClass(scope, flag) {
    if(scope.outOfViewport !== flag) {
        if(flag === true) {
            anime({
                targets: scope.el,
                translateY: {
                    value: '0%',
                    duration: 350
                },
                easing: 'easeInOutQuad'
            });
        } else {
            anime({
                targets: scope.el,
                translateY: {
                    value: '-100%',
                    duration: 350
                },
                easing: 'easeInOutQuad'
            });
        }
    }
    scope.outOfViewport = flag;
}

function isOutOfViewport(bounds, viewportBounds) {
    // console.log(viewportBounds.min.y, bounds.max.y, bounds.min.y);
    return (viewportBounds.min.y < bounds.max.y - bounds.min.y);
}
