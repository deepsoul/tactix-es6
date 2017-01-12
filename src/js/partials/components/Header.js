"use strict";

var ScrollDirectionObserver = require('../../base/scroll/DirectionObserver');
var Velocity = require('velocity-animate');

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
            Velocity(scope.el, {
                translateY: '0%'
            }, {
                duration: 350
            });
            // scope.tween.reverse();
        } else {
            // scope.tween.play();
            Velocity(scope.el, {
                translateY: '-100%'
            }, {
                duration: 350
            });
        }
    }

    scope.outOfViewport = flag;
}

function isOutOfViewport(bounds, viewportBounds) {
    // console.log(viewportBounds.min.y, bounds.max.y, bounds.min.y);
    return (viewportBounds.min.y < bounds.max.y - bounds.min.y);
}
