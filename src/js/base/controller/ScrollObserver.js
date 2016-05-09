"use strict";

var Controller = require('../Controller');
var DomModel = require('../DomModel');
var dataTypeDefinition = require('../dataTypeDefinition');
var Vector = require('../Vector');
var Bounds = require('../Bounds');
var throttle = require('lodash/throttle');

var viewport = require('../../services/viewport');

var viewportDimension = new Vector();
var objectDimension = new Vector();

module.exports = Controller.extend({
    $el: null,
    operation: 'subtractLocal',

    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            extendedRange: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.$el = $(this.el);
        this.bounds = new Bounds();
        this.position = new Vector();
        this.dimension = new Vector();
        this.offset = new Vector();

        if(this.model.extendedRange) {
            this.operation = 'addLocal';
        }

        viewport.register({
            INIT: onInit.bind(this),
            RESIZE: onResize.bind(this),
            SCROLL: onScroll.bind(this)
        }, this);
    },

    onActive: function(info, direction) {
        console.log('HUI', info.y, direction.y);
    },

    onInactive: function() {
//        console.log('BOOM', info.y);
    },

    destroy: function() {
        viewport.unregister(this);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onScroll(viewportBounds, direction) {
    if(this.bounds.intersectsY(viewportBounds)) {
        this.onActive(getIntersectionInfo(this.bounds, viewportBounds, this.operation), direction);
    } else {
        this.onInactive(direction);
    }
}

function onInit(viewportBounds, direction) {
    var bounds = this.bounds;
    updateBounds(this.$el, this.position, this.dimension, bounds, this.offset);
    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function onResize(viewportBounds, direction) {
    var bounds = this.bounds;
    updateBounds(this.$el, this.position, this.dimension, bounds, this.offset);
    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function updateBounds(node, position, dimension, bounds, offset) {
    var off = getOffset(offset, node.get(0));
    position.resetValues(off.x, off.y, 0);
    dimension.resetValues(node.outerWidth(), node.outerHeight(), 0);
    bounds.setMin(position).max.resetValues(dimension.x + position.x, dimension.y + position.y, dimension.z + position.z);
}

function getIntersectionInfo(bounds, viewportBounds, operation) {
    return normalizeIntersectionInfoByRange(bounds.getIntersectionInfo(viewportBounds), getRange(bounds, operation));
}

function getRange(bounds, operation) {
    return bounds.getDimension(objectDimension)[operation](viewportDimension);
}

function normalizeIntersectionInfoByRange(intersectionInfo, range) {
    return intersectionInfo.divideLocal(range.absLocal());
}

function getOffset(offset, node) {
    var box = node.getBoundingClientRect();
    var top = Math.max(box.top + node.clientTop, 0);
    var left = Math.max(box.left + node.clientLeft, 0);
    return offset.setX(left).setY(top);
}
