"use strict";

var ScrollDirectionObserver = require('../../base/controller/ScrollDirectionObserver');
// var TweenMax = require('gsap');

module.exports = ScrollDirectionObserver.extend({
    outOfViewport: false,
    handler: null,
    tween: null,

    onInit: function() {
        this.classList = this.el.classList;
        // this.tween = new TweenMax(this.el, 0.35, {
        //     css: {y:'-100%'},
        //     paused: true,
        //     yoyo:true
        // });
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

        // if(flag === true) {
        //     scope.tween.reverse();
        // } else {
        //     scope.tween.play();
        // }

        if(flag) {
            scope.classList.add('js-slideDown');
        } else {
            scope.classList.remove('js-slideDown');
        }
    }

    scope.outOfViewport = flag;
}

function isOutOfViewport(bounds, viewportBounds) {
    return (viewportBounds.min.y < bounds.max.y - bounds.min.y);
}
