"use strict";

var Vector = require('./Vector');
var Bounds = require('./Bounds');
var Enum = require('enum');
var remove = require('lodash/remove');
var animationFrame = global.animationFrame;

var Viewport = function(frame, content) {
    this.frame = frame || this.frame;
    this.content = content || this.content;

    if(this.frame.innerWidth) {
        this.dimensionKeyName.width = 'innerWidth';
        this.dimensionKeyName.height = 'innerHeight';
    } else if(this.frame.offsetWidth) {
        this.dimensionKeyName.width = 'offsetWidth';
        this.dimensionKeyName.height = 'offsetHeight';
    } else {
        this.dimensionKeyName.width = 'clientWidth';
        this.dimensionKeyName.height = 'clientHeight';
    }

    if('scrollX' in this.frame) {
        this.scrollKeyName.x = 'scrollX';
        this.scrollKeyName.y = 'scrollY';
    } else if('pageXOffset' in this.frame) {
        this.scrollKeyName.x = 'pageXOffset';
        this.scrollKeyName.y = 'pageYOffset';
    } else {
        this.scrollKeyName.x = 'scrollLeft';
        this.scrollKeyName.y = 'scrollTop';
    }

    if (global.addEventListener) {
        global.addEventListener('resize', animationFrame.throttle('viewport-resize', onResize.bind(this), onMeasure.bind(this)), false);
        global.addEventListener('scroll', animationFrame.throttle('viewport-scroll',onScroll.bind(this), onMeasure.bind(this)), true);
        // document.addEventListener('wheel', onMeasure.bind(this), false);
    } else {
        global.attachEvent('onresize', animationFrame.throttle('viewport-resize', onResize.bind(this), onMeasure.bind(this)));
        global.attachEvent('scroll', animationFrame.throttle('viewport-scroll', onScroll.bind(this), onMeasure.bind(this)));
    }

    animationFrame.add(function() {
        onMeasure.bind(this)();
        onInit.bind(this)();
    }.bind(this));
};

Viewport.prototype.EVENT_TYPES = new Enum(['RESIZE', 'SCROLL', 'INIT']);
Viewport.prototype.init = false;
Viewport.prototype.frame = global;
Viewport.prototype.content = (document.documentElement || document.body.parentNode || document.body);
Viewport.prototype.dimensionKeyName = {width: null, height: null};
Viewport.prototype.scrollKeyName = {x: null, y: null};
Viewport.prototype.scrollX = 0;
Viewport.prototype.scrollY = 0;

Viewport.prototype.dimension = new Vector();
Viewport.prototype.offset = new Vector();
Viewport.prototype.bounds = new Bounds();
Viewport.prototype.scrollPosition = new Vector();
Viewport.prototype.scrollDirection = new Vector();
Viewport.prototype.scrollDimension = new Vector();
Viewport.prototype.scrollRange = new Vector();
Viewport.prototype.callbacks = [];

Viewport.prototype.update = function() {
    onResize.bind(this)();
};

Viewport.prototype.register = function(fn, scope) {
    this.callbacks.push({
        id: scope.cid,
        fn: fn
    });
    if (this.init) {
        (fn.INIT || function() {})(this.bounds, this.scrollDirection);
    }
};

Viewport.prototype.unregister = function(scope) {
    remove(this.callbacks, function(callback) {
        return callback.id === scope.cid;
    });
};

module.exports = Viewport;

function onInit() {
    updateOffset(this);
    updateDimension(this.dimension, this.frame, this.dimensionKeyName);
    updateScroll(this.scrollX, this.scrollY, this.content, this.scrollPosition, this.scrollRange, this.scrollDimension, this.dimension);
    this.scrollDirection.resetValues(0, 0, 0);
    update(triggerUpdate.bind(this, this.EVENT_TYPES.INIT), this.bounds, this.scrollPosition, this.offset, this.dimension);
    this.init = true;
}

function onResize() {
    updateOffset(this);
    updateDimension(this.dimension, this.frame, this.dimensionKeyName);
    this.scrollDirection.reset(this.scrollPosition);
    updateScroll(this.scrollX, this.scrollY, this.content, this.scrollPosition, this.scrollRange, this.scrollDimension, this.dimension);
    updateScrollDirection(this.scrollDirection, this.scrollPosition);
    update(triggerUpdate.bind(this, this.EVENT_TYPES.RESIZE), this.bounds, this.scrollPosition, this.offset, this.dimension);
}

function onScroll() {
    this.scrollDirection.reset(this.scrollPosition);
    updateScrollPosition(this.scrollX, this.scrollY, this.scrollPosition);
    updateScrollDirection(this.scrollDirection, this.scrollPosition);
    update(triggerScroll.bind(this), this.bounds, this.scrollPosition, this.offset, this.dimension);
}

function onMeasure() {
    this.scrollX = this.frame[this.scrollKeyName.x];
    this.scrollY = this.frame[this.scrollKeyName.y];
}

function update(fn, bounds, scrollPosition, offset, dimension) {
    updateBounds(bounds, scrollPosition, offset, dimension);
    fn();
}

function triggerScroll() {
    triggerUpdate.bind(this)(this.EVENT_TYPES.SCROLL);
}

function triggerUpdate(eventType) {
    for (var i = 0, l = this.callbacks.length; i < l; i++) {
        (this.callbacks[i].fn[eventType])(this.bounds, this.scrollDirection);
    }
}

function updateOffset(scope) {
    var box = scope.content.getBoundingClientRect();

    var top = Math.max(box.top + scope.content.clientTop, 0);
    var left = Math.max(box.left + scope.content.clientLeft, 0);

    scope.offset.setX(left).setY(top);
}

function updateBounds(bounds, position, offset, dimension) {
    // auf jeden fall korrekt, auf der Verrechnung baut Drag&Drop auf
    bounds.min.resetValues(position.x + offset.x, position.y + offset.y, position.z + offset.z);
    bounds.max.resetValues(dimension.x + position.x + offset.x, dimension.y + position.y + offset.y, dimension.z + position.z + offset.z);
}

function updateScroll(scrollX, scrollY, content, scrollPosition, scrollRange, scrollDimension, viewportDimension) {
    updateScrollDimension(content, scrollDimension);
    updateScrollRange(scrollRange, scrollDimension, viewportDimension);
    updateScrollPosition(scrollX, scrollY, scrollPosition);
}

function updateDimension(dimension, frame, dimensionKeyName) {
    dimension.resetValues(frame[dimensionKeyName.width], frame[dimensionKeyName.height], 0);
}

function updateScrollDirection(direction, position) {
    direction.subtractLocal(position).multiplyValueLocal(-1).signLocal();
}

function updateScrollDimension(content, dimension) {
    dimension.resetValues(content.scrollWidth, content.scrollHeight, 0);
}

function updateScrollRange(range, scrollDimension, viewportDimension) {
    range.resetValues(scrollDimension.x, scrollDimension.y, 0);
    range.subtractLocal(viewportDimension);
}

function updateScrollPosition(scrollX, scrollY, position) {
    position.resetValues(scrollX, scrollY, 0);
}
