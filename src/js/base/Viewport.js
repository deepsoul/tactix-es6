"use strict";

var AmpersandState = require('ampersand-state');
var dataTypeDefinition = require('./dataTypeDefinition');
var Enum = require('enum');
var remove = require('lodash/remove');
var throttle = require('lodash/throttle');

module.exports = AmpersandState.extend(dataTypeDefinition, {
    EVENT_TYPES: new Enum(['RESIZE', 'SCROLL', 'INIT']),

    session: {
        init: {
            type: 'boolean',
            required: true,
            setOnce: true,
            values: [true, false]
        },

        frame: {
            type: 'HTMLElement',
            required: true,
            default: function() {
                return global;
            }
        },

        content: {
            type: 'HTMLElement',
            required: true,
            default: function() {
                return document.body;
            }
        },

        dimension: {
            type: 'Vector',
            required: true
        },

        offset: {
            type: 'Vector',
            required: true
        },

        bounds: {
            type: 'Bounds',
            required: true
        },

        scrollPosition: {
            type: 'Vector',
            required: true
        },

        scrollDirection: {
            type: 'Vector',
            required: true
        },

        scrollDimension: {
            type: 'Dimension',
            required: true
        },

        scrollRange: {
            type: 'Dimension',
            required: true
        },

        callbacks: {
            type: 'array',
            required: true,
            default: function() {
                return [];
            }
        }
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);

        if (global.addEventListener) {
            global.addEventListener('resize', throttle(onResize.bind(this), 200), false);
            global.addEventListener('scroll', onScroll.bind(this), false);
        } else {
            global.attachEvent('onresize', throttle(onResize.bind(this), 200));
            global.attachEvent('scroll', onScroll.bind(this));
        }

        updateOffset(this.offset, this.content);
        updateDimension(this.dimension, this.frame);
        updateScroll(this.content, this.scrollPosition, this.scrollRange, this.scrollDimension, this.dimension);
        update(onInit.bind(this), this.bounds, this.scrollPosition, this.offset, this.dimension);
    },

    register: function(fn, scope) {
        this.callbacks.push({id: scope.cid, fn: fn});
        if(this.init) {
            (fn.INIT || function() {})(this.bounds, this.scrollDirection);
        }
    },

    unregister: function(scope) {
        remove(this.callbacks, function(callback) {
            return callback.id === scope.cid;
        });
    }
});

function onInit() {
    this.scrollDirection.resetValues(0,0,0);
    triggerUpdate.bind(this, this.EVENT_TYPES.INIT)();
    this.init = true;
}

function onResize() {
    updateOffset(this.offset, this.content);
    updateDimension(this.dimension, this.frame);
    this.scrollDirection.reset(this.scrollPosition);
    updateScroll(this.content, this.scrollPosition, this.scrollRange, this.scrollDimension, this.dimension);
    updateScrollDirection(this.scrollDirection, this.scrollPosition);
    update(triggerUpdate.bind(this, this.EVENT_TYPES.RESIZE), this.bounds, this.scrollPosition, this.offset, this.dimension);
}

function onScroll() {
    this.scrollDirection.reset(this.scrollPosition);
    updateScrollPosition(this.content, this.scrollPosition);
    updateScrollDirection(this.scrollDirection, this.scrollPosition);
    update(triggerUpdate.bind(this, this.EVENT_TYPES.SCROLL), this.bounds, this.scrollPosition, this.offset, this.dimension);
}

function update(fn, bounds, scrollPosition, offset, dimension) {
    updateBounds(bounds, scrollPosition, offset, dimension);
    global.requestAnimationFrame(fn);
}

function triggerUpdate(eventType) {
    var callbacks = this.callbacks;
    var bounds = this.bounds;
    var scrollDirection = this.scrollDirection;

    for(var i = 0, l = callbacks.length; i < l; i++) {
        (callbacks[i].fn[eventType] || function() {})(bounds, scrollDirection);
    }
}

function updateOffset(offset, content) {
    offset.setX(content.offsetLeft).setY(content.offsetTop);
}

function updateBounds(bounds, position, offset, dimension) {
    // auf jeden fall korrekt, auf der Verrechnung baut Drag&Drop auf
    bounds.min.resetValues(position.x + offset.x, position.y + offset.y, position.z + offset.z);
    bounds.max.resetValues(dimension.x + position.x + offset.x, dimension.y + position.y + offset.y, dimension.z + position.z + offset.z);
}

function updateScroll(content, scrollPosition, scrollRange, scrollDimension, viewportDimension) {
    updateScrollDimension(content, scrollDimension);
    updateScrollRange(scrollRange, scrollDimension, viewportDimension);
    updateScrollPosition(content, scrollPosition);
}

function updateDimension(dimension, frame) {
    dimension.resetValues(frame.innerWidth || frame.offsetWidth || frame.clientWidth, frame.innerHeight || frame.offsetHeight || frame.clientHeight, 0);
}

function updateScrollDirection(direction, position) {
    direction.subtractLocal(position).multiplyValueLocal(-1).divideValuesLocal(
        Math.abs(direction.x),
        Math.abs(direction.y),
        Math.abs(direction.z)
    );
}

function updateScrollDimension(content, dimension) {
    dimension.resetValues(content.scrollWidth, content.scrollHeight, 0);
}

function updateScrollRange(range, scrollDimension, viewportDimension) {
    range.resetValues(scrollDimension.x, scrollDimension.y, 0);
    range.subtractLocal(viewportDimension);
}

function updateScrollPosition(content, position) {
    position.resetValues(content.pageXOffset || content.scrollLeft, content.pageYOffset || content.scrollTop, 0);
}
