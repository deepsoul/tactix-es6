"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');
var dataTypeDefinition = require('../../base/dataTypeDefinition');
var Vector = require('../../base/Vector');
var Bounds = require('../../base/Bounds');

var element = require('../../utils/element');
var viewport = require('../../services/viewport');

var viewportDimension = new Vector();
var objectDimension = new Vector();

module.exports = Controller.extend({
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

        this.bounds = new Bounds();
        this.headerBounds = new Bounds();
        this.footerBounds = new Bounds();

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
        if(info.y > -1) {
            this.el.querySelector('.bottom').classList.add('js-scroll-sticky-bottom');
        } else {
            this.el.querySelector('.bottom').classList.remove('js-scroll-sticky-bottom');
        }
    },

    onInactive: function() {
        this.el.querySelector('.bottom').classList.remove('js-scroll-sticky-bottom');
//        console.log('BOOM', info.y);
    },

    destroy: function() { 
        viewport.unregister(this);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onScroll(viewportBounds, direction) {
    if(this.bounds.intersectsY(viewportBounds)) {
        this.onActive(getIntersectionInfo(this.bounds, viewportBounds, 'addLocal'), direction);
    } else {
        this.onInactive(direction);
    }
}

function onInit(viewportBounds, direction) {
    element.updateBounds(this.el, this.bounds);
    element.updateBounds(this.el.querySelector('.top'), this.headerBounds);
    element.updateBounds(this.el.querySelector('.bottom'), this.footerBounds);
    this.bounds.min.addValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);
    this.bounds.max.subtractValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);

    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function onResize(viewportBounds, direction) {
    element.updateBounds(this.el, this.bounds);
    element.updateBounds(this.el.querySelector('.top'), this.headerBounds);
    element.updateBounds(this.el.querySelector('.bottom'), this.footerBounds);
    this.bounds.min.addValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);
    this.bounds.max.subtractValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);

    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
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
