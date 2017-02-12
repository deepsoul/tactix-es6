"use strict";

var Controller = require('../Controller');
var DomModel = require('../DomModel');
var dataTypeDefinition = require('../dataTypeDefinition');
var Vector = require('../Vector');
var Bounds = require('../Bounds');

var element = require('../../utils/element');
var viewport = require('../../services/viewport');

var objectDimension = new Vector();

module.exports = Controller.extend({
    operation: 'subtractLocal',
    viewport: viewport,

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

        this.bounds = new Bounds();
        this.outOfViewportInfo = null;

        if(this.model.extendedRange) {
            this.operation = 'addLocal';
        }

        this.onMeasure = onMeasure.bind(this);
        this.onInit = onInit.bind(this);
        this.onResize = onResize.bind(this);
        this.onScroll = onScroll.bind(this);

        this.viewportDimension = new Vector();

        if(this.targetModel && this.targetModel.viewport) {
            this.viewport = this.targetModel.viewport;
        }

        this.viewport
            .on(this.viewport.EVENT_TYPES.MEASURE, this.onMeasure)
            .on(this.viewport.EVENT_TYPES.INIT, this.onInit)
            .on(this.viewport.EVENT_TYPES.RESIZE, this.onResize)
            .on(this.viewport.EVENT_TYPES.SCROLL, this.onScroll);
    },

    onActive: function() {
        // console.log('HUI', info.y, direction.y); 
    },

    onInactive: function() {
//        console.log('BOOM', info.y);
    },

    destroy: function() {
        this.viewport
            .off(this.viewport.EVENT_TYPES.MEASURE, this.onMeasure)
            .off(this.viewport.EVENT_TYPES.INIT, this.onInit)
            .off(this.viewport.EVENT_TYPES.RESIZE, this.onResize)
            .off(this.viewport.EVENT_TYPES.SCROLL, this.onScroll);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onScroll(viewportBounds, direction) {
    if(this.bounds.intersects(viewportBounds)) {
        this.outOfViewportInfo = null;
        this.onActive(getIntersectionInfo(this.bounds, viewportBounds, this.viewportDimension, this.operation), direction);
    } else {
        if(!this.outOfViewportInfo) {
            this.outOfViewportInfo = new Vector();
            this.outOfViewportInfo.reset(getIntersectionInfo(this.bounds, viewportBounds, this.viewportDimension, this.operation)).clampLocal(-1, 1);
            this.onInactive(this.outOfViewportInfo, direction);
        }
    }
}

function onMeasure() {
    element.updateBounds(this.el, this.bounds, this.viewport);
}

function onInit(viewportBounds, direction) {
    this.viewportDimension = viewportBounds.getDimension(this.viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function onResize(viewportBounds, direction) {
    this.viewportDimension = viewportBounds.getDimension(this.viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function getIntersectionInfo(bounds, viewportBounds, viewportDimension, operation) {
    return normalizeIntersectionInfoByRange(bounds.getIntersectionInfo(viewportBounds), getRange(bounds, viewportDimension, operation));
}

function getRange(bounds, viewportDimension, operation) {
    return bounds.getDimension(objectDimension)[operation](viewportDimension);
}

function normalizeIntersectionInfoByRange(intersectionInfo, range) {
    return intersectionInfo.divideLocal(range.absLocal());
}
