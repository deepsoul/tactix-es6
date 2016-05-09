"use strict";

var Controller = require('../Controller');
var DomModel = require('../DomModel');
var Vector = require('../Vector');
var Bounds = require('../Bounds');
var dataTypeDefinition = require('../dataTypeDefinition');

var viewport = require('../../services/viewport');

module.exports = Controller.extend({
    $el: null,

    modelConstructor: DomModel.extend(dataTypeDefinition, {

    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.$el = $(this.el);
        this.position = new Vector();
        this.bounds = new Bounds();
        this.dimension = new Vector();
        this.offset = new Vector();

        this.callbacks = [this.onUp.bind(this), this.onInit.bind(this), this.onDown.bind(this)];

        viewport.register({
            INIT: onInit.bind(this),
            RESIZE: onResize.bind(this),
            SCROLL: onScroll.bind(this)
        }, this);

    },

    onInit: function() {
        console.log('init');
    },

    onUp: function() {
        console.log('scroll up');
    },

    onDown: function() {
        console.log('scroll down');
    },

    destroy: function() {
        viewport.unregister(this);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onInit(viewportBounds, direction) {
    updateBounds(this.$el, this.position, this.dimension, this.bounds, this.offset);
    this.callbacks[1](viewportBounds, direction);
}

function onResize(viewportBounds, direction) {
    updateBounds(this.$el, this.position, this.dimension, this.bounds, this.offset);
    this.callbacks[direction.y + 1](viewportBounds, direction);
}

function onScroll(viewportBounds, direction) {
    this.callbacks[direction.y + 1](viewportBounds, direction);
}

function updateBounds(node, position, dimension, bounds, offset) {
    var off = getOffset(offset, node.get(0));
    position.resetValues(off.x, off.y, 0);
    dimension.resetValues(node.outerWidth(), node.outerHeight(), 0);
    bounds.setMin(position).max.resetValues(dimension.x + position.x, dimension.y + position.y, dimension.z + position.z);
}

function getOffset(offset, node) {
    var box = node.getBoundingClientRect();
    var top = Math.max(box.top + node.clientTop, 0);
    var left = Math.max(box.left + node.clientLeft, 0);
    return offset.setX(left).setY(top);
}
