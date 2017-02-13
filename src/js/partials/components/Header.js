"use strict";

var ScrollDirectionObserver = require('../../base/scroll/DirectionObserver');
var anime = require('animejs');

module.exports = ScrollDirectionObserver.extend({
    outOfViewport: false,
    handler: null,
    tween: null,

    initialize: function() {
        ScrollDirectionObserver.prototype.initialize.apply(this, arguments);
        this.tween = anime({
            targets: this.el,
            translateY: {
                value: '-100%',
                duration: 350
            },
            autoplay: false,
            direction: 'reverse',
            easing: 'easeInOutQuad'
        });        
    },

    onInit: function() {
        this.classList = this.el.classList;
        updateClass(this, true);
        this.tween.pause();
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
            scope.tween.play();
        } else {
            scope.tween.play();
        }
    }
    scope.outOfViewport = flag;
}

function isOutOfViewport(bounds, viewportBounds) {
    return (viewportBounds.min.y < bounds.max.y - bounds.min.y);
}
