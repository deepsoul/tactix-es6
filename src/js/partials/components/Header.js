"use strict";

var ScrollDirectionObserver = require('../../base/controller/ScrollDirectionObserver');

module.exports = ScrollDirectionObserver.extend({

    onInit: function() {
        updateClass(this, true);
    },

    onUp: function() {
        updateClass(this, true);
    },

    onDown: function(viewportBounds) {
        updateClass(this, isOutOfViewport(this.model.bounds, viewportBounds));
    }
});

function updateClass(scope, flag) {
    global.requestAnimationFrame(function() {
        scope.$el.toggleClass('js-slideDown', flag);
    });
}

function isOutOfViewport(bounds, viewportBounds) {
    return (viewportBounds.min.y < bounds.max.y - bounds.min.y);
}
