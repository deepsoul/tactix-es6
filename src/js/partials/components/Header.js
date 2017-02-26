"use strict";

import ScrollDirectionObserver from '../../base/scroll/DirectionObserver';
import anime from 'animejs';
import Template from '../../base/Template';
import linkTmpl from '../../../tmpl/partials/elements/link.hbs';
import test from '../../../pcss/partials/elements.pcss';
var tmpl = new Template(linkTmpl);

export default ScrollDirectionObserver.extend({
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
        console.log(test);
        console.log(tmpl.toText({}));
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
        scope.tween.play();
    }
    scope.outOfViewport = flag;
}

function isOutOfViewport(bounds, viewportBounds) {
    return (viewportBounds.min.y < bounds.max.y - bounds.min.y);
}
