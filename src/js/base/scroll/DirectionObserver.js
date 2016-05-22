"use strict";

var Controller = require('../Controller');
var DomModel = require('../DomModel');
var Bounds = require('../Bounds');
var dataTypeDefinition = require('../dataTypeDefinition');
var element = require('../../utils/element');

var viewport = require('../../services/viewport');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend(dataTypeDefinition, {

    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.bounds = new Bounds();
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
    element.updateBounds(this.el, this.bounds);
    this.callbacks[1](viewportBounds, direction);
}

function onResize() {
    element.updateBounds(this.el, this.bounds);
    // this.callbacks[direction.y + 1](viewportBounds, direction);
}

function onScroll(viewportBounds, direction) {
    this.callbacks[direction.y + 1](viewportBounds, direction);
}
