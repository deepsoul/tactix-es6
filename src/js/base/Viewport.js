"use strict";

var Vector = require('./Vector');
var Bounds = require('./Bounds');
var Enum = require('enum');

var Viewport = function(frameNode, contentNode) {
    this.init = false;

    this.frameNode = frameNode || this.frameNode;
    this.contentNode = contentNode || this.contentNode;
    if (this.frameNode !== global) {
        this.scrollNode = this.contentNode;
    }

    this.dimensionKeyName = {
        width: null,
        height: null
    };
    this.scrollKeyName = {
        x: null,
        y: null
    };
    this.scrollX = 0;
    this.scrollY = 0;

    this.dimension = new Vector();
    this.offset = new Vector();
    this.bounds = new Bounds();
    this.scrollPosition = new Vector();
    this.scrollDirection = new Vector();
    this.scrollDimension = new Vector();
    this.scrollRange = new Vector();
    this.callbacks = this.EVENT_TYPES.enums.reduce(function(result, value) {
        result[value.key] = [];
        return result;
    }, {});

    if ('innerWidth' in this.frameNode) {
        this.dimensionKeyName.width = 'innerWidth';
        this.dimensionKeyName.height = 'innerHeight';
    } else if ('offsetWidth' in this.frameNode) {
        this.dimensionKeyName.width = 'offsetWidth';
        this.dimensionKeyName.height = 'offsetHeight';
    } else {
        this.dimensionKeyName.width = 'clientWidth';
        this.dimensionKeyName.height = 'clientHeight';
    }

    if ('scrollX' in this.scrollNode) {
        this.scrollKeyName.x = 'scrollX';
        this.scrollKeyName.y = 'scrollY';
    } else if ('pageXOffset' in this.frameNode) {
        this.scrollKeyName.x = 'pageXOffset';
        this.scrollKeyName.y = 'pageYOffset';
    } else {
        this.scrollKeyName.x = 'scrollLeft';
        this.scrollKeyName.y = 'scrollTop';
    }

    global.addEventListener('resize', global.animationFrame.throttle(onMeasure.bind(this), onResize.bind(this)), false);
    this.frameNode.addEventListener('scroll', global.animationFrame.throttle(onMeasure.bind(this), onScroll.bind(this)), false);

    global.picture.ready(onImageLoad.bind(this));
};

Viewport.prototype.EVENT_TYPES = new Enum(['RESIZE', 'SCROLL', 'INIT', 'MEASURE']);
Viewport.prototype.init = false;
Viewport.prototype.frameNode = global;
Viewport.prototype.scrollNode = global;
Viewport.prototype.contentNode = (document.documentElement || document.body.parentNode || document.body);
Viewport.prototype.dimensionKeyName = {
    width: null,
    height: null
};
Viewport.prototype.scrollKeyName = {
    x: null,
    y: null
};
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
    onMeasure.bind(this)({
        stopImmediatePropagation: function() {},
        stopPropagation: function() {}
    });
    onResize.bind(this)();
};

Viewport.prototype.on = function(name, fn) {
    this.callbacks[name.toString()].push(fn);
    if (this.EVENT_TYPES.INIT.is(name) && this.init) {
        fn(this.bounds, this.scrollDirection);
    }
    return this;
};

Viewport.prototype.off = function(name, fn) {
    this.callbacks[name] = this.callbacks[name].reduce(function(result, callback) {
        if(callback !== fn) {
            result.push(callback);
        }
        return result;
    }, []);
    return this;
};

module.exports = Viewport;

function onImageLoad() {
    onMeasure.bind(this)({
        stopImmediatePropagation: function() {},
        stopPropagation: function() {}
    });
    global.animationFrame.addOnce(onInit.bind(this));    
}

function onInit() {
    this.scrollDirection.resetValues(0, 0, 0);
    update(triggerUpdate.bind(this, this.EVENT_TYPES.INIT), this.bounds, this.scrollPosition, this.offset, this.dimension);
    this.init = true;
}

function onResize() {
    update(triggerUpdate.bind(this, this.EVENT_TYPES.RESIZE), this.bounds, this.scrollPosition, this.offset, this.dimension);
}

function onScroll() {
    update(triggerScroll.bind(this), this.bounds, this.scrollPosition, this.offset, this.dimension);
}

function onMeasure(e) {
    if (e.type === 'scroll') {
        e.stopImmediatePropagation();
    }
    this.scrollX = this.frameNode[this.scrollKeyName.x];
    this.scrollY = this.frameNode[this.scrollKeyName.y];
    updateOffset(this);
    updateDimension(this.dimension, this.frameNode, this.dimensionKeyName);
    this.scrollDirection.reset(this.scrollPosition);
    updateScroll(this.scrollX, this.scrollY, this.contentNode, this.scrollPosition, this.scrollRange, this.scrollDimension, this.dimension);
    updateScrollDirection(this.scrollDirection, this.scrollPosition);
    update(triggerMeasure.bind(this), this.bounds, this.scrollPosition, this.offset, this.dimension);
}

function update(fn, bounds, scrollPosition, offset, dimension) {
    updateBounds(bounds, scrollPosition, offset, dimension);
    fn();
}

function triggerMeasure() {
    triggerUpdate.bind(this)(this.EVENT_TYPES.MEASURE);
}

function triggerScroll() {
    triggerUpdate.bind(this)(this.EVENT_TYPES.SCROLL);
}

function triggerUpdate(eventType) {
    for (var i = 0, l = this.callbacks[eventType].length; i < l; i++) {
        (this.callbacks[eventType][i])(this.bounds, this.scrollDirection);
    }
}

function updateOffset(scope) {
    var box = scope.contentNode.getBoundingClientRect();

    var top = box.top + scope.scrollY;
    var left = box.left + scope.scrollX;

    scope.offset.setX(left).setY(top);
}

function updateBounds(bounds, position, offset, dimension) {
    // auf jeden fall korrekt, auf der Verrechnung baut Drag&Drop auf
    bounds.min.resetValues(position.x - offset.x, position.y - offset.y, position.z - offset.z);
    bounds.max.resetValues(position.x + dimension.x - offset.x, position.y + dimension.y - offset.y, position.z + dimension.z - offset.z);
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
