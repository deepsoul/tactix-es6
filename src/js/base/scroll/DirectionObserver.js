"use strict";

var Controller = require('../Controller');
var DomModel = require('../DomModel');
var Bounds = require('../Bounds');
var dataTypeDefinition = require('../dataTypeDefinition');
var element = require('../../utils/element');

var viewport = require('../../services/viewport');

module.exports = Controller.extend({
    viewport: viewport,
    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {

        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.bounds = new Bounds();
        this.callbacks = [this.onUp.bind(this), this.onInit.bind(this), this.onDown.bind(this)];

        this.onMeasure = onMeasure.bind(this);
        this.onInit = onInit.bind(this);
        this.onResize = onResize.bind(this);
        this.onScroll = onScroll.bind(this);
        
        if(this.targetModel && this.targetModel.viewport) {
            this.viewport = this.targetModel.viewport;
        }

        this.viewport
            .on(this.viewport.EVENT_TYPES.MEASURE, this.onMeasure)
            .on(this.viewport.EVENT_TYPES.INIT, this.onInit)
            .on(this.viewport.EVENT_TYPES.RESIZE, this.onResize)
            .on(this.viewport.EVENT_TYPES.SCROLL, this.onScroll);
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
        this.viewport
            .off(this.viewport.EVENT_TYPES.MEASURE, this.onMeasure)
            .off(this.viewport.EVENT_TYPES.INIT, this.onInit)
            .off(this.viewport.EVENT_TYPES.RESIZE, this.onResize)
            .off(this.viewport.EVENT_TYPES.SCROLL, this.onScroll);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onMeasure() {
    element.updateBounds(this.el, this.bounds, this.viewport);
}

function onInit(viewportBounds, direction) {
    this.callbacks[1](viewportBounds, direction);
}

function onResize() {

}

function onScroll(viewportBounds, direction) {
    this.callbacks[direction.y + 1](viewportBounds, direction);
}
