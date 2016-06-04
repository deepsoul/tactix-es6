"use strict";

var Controller = require('../../base/Controller');
var Viewport = require('../../base/Viewport');
var Vector = require('../../base/Vector');
require('pepjs');

module.exports = Controller.extend({

    events: {
        'pointerdown .handle': onPointerDown,
        'click .handle': onClick
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.handle = this.el.querySelector('.handle');
        this.pointStart = new Vector(1,0,0);
        this.pointMove = new Vector(1,0,0);
        this.onInit = onInit.bind(this);
        this.onResize = onResize.bind(this);
        this.angle = 0;

        this.rootViewport = new Viewport(this.el, this.el);
        this.handleViewport = new Viewport(this.handle, this.handle);
        this.handleViewport
            .on(this.handleViewport.EVENT_TYPES.INIT,  this.onInit)
            .on(this.handleViewport.EVENT_TYPES.RESIZE, this.onResize);
    }
});

function onInit() {
    this.rootViewport.dimension.divideValueLocal(2);
    onPointerMove.bind(this)();
}

function onResize() {
    this.rootViewport.dimension.divideValueLocal(2);
    onPointerMove.bind(this)();
}

function onClick(e) {
    e.preventDefault();
}

function onPointerDown(e) {
    e.preventDefault();
    this.angle += this.pointStart.angleBetween(this.pointMove);
    this.pointStart.setX(e.pageX).setY(e.pageY)
        .subtractLocal(this.rootViewport.offset)
        .subtractLocal(this.rootViewport.dimension)
        .divideLocal(this.rootViewport.dimension)
        .multiplyValueLocal(-1);

    $(document).on('pointermove.' + this.cid, global.animationFrame.throttle('pointermove', onPointerMove.bind(this), onMeasure.bind(this)));
    $(document).on('pointerup.' + this.cid, onPointerUp.bind(this));
}

function onPointerMove() {
    this.handle.style.cssText = 'transform: rotateZ(' + (this.angle + this.pointStart.angleBetween(this.pointMove)) + 'rad) translate(-' + this.rootViewport.dimension.x + 'px, 0px);';
}

function onPointerUp(e) {
    e.preventDefault();
    $(document).off('pointermove.' + this.cid + ' pointerup.' + this.cid);
}

function onMeasure(e) {
    e.preventDefault();
    this.pointMove.setX(e.pageX).setY(e.pageY)
        .subtractLocal(this.rootViewport.offset)
        .subtractLocal(this.rootViewport.dimension)
        .divideLocal(this.rootViewport.dimension)
        .multiplyValueLocal(-1);
}
