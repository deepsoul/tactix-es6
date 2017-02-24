"use strict";

var PositionObserver = require('../../base/scroll/PositionObserver');
var viewport = require('../../services/viewport');
var Vector = require('../../base/Vector');
var $ = require('jquery');
require('pepjs');

module.exports = PositionObserver.extend({

    events: {
        'pointerdown .masked-content': onPointerDown
    },

    initialize: function() {
        PositionObserver.prototype.initialize.apply(this, arguments);
        this.dimension = new Vector();
        this.movePoint = new Vector();
        this.mask = this.el.querySelector('.mask');

        this.onViewportMeasure = onViewportMeasure.bind(this);

        viewport
            .on(viewport.EVENT_TYPES.MEASURE, this.onViewportMeasure);
    },

    destroy: function() {
        viewport
            .off(viewport.EVENT_TYPES.MEASURE, this.onMeasure);
        PositionObserver.prototype.destroy.apply(this, arguments);
    }
});

function onViewportMeasure() {
    this.dimension = this.bounds.getDimension(this.dimension).divideValueLocal(2);
}

function onPointerDown() {
    global.animationFrame.addOnce(onPaint.bind(this));
    $(document).on('pointermove.' + this.cid, global.animationFrame.throttle(onPointerMeasure.bind(this), onPaint.bind(this)));
    $(document).on('pointerup.' + this.cid, onPointerUp.bind(this));
}

function onPointerUp() {
    $(document).off('pointermove.' + this.cid + ' pointerup.' + this.cid);
}

function onPointerMeasure(e) {
    e.preventDefault();
    this.movePoint.setX(e.pageX).setY(e.pageY)
        .subtractLocal(this.bounds.min)
        .subtractLocal(this.dimension)
        .divideLocal(this.dimension)
        .divideValueLocal(2)
        .multiplyValueLocal(100);
}

function onPaint() {
    this.mask.style.cssText = 'transform: translate(' + this.movePoint.x + '%, ' + this.movePoint.y + '%)';
}
