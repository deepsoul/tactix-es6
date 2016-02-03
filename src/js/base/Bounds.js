"use strict";

var Vector = require('./Vector');

var intersectionInfo = new Vector();
/*
 * Bounds Object
 * Contains the min and max Coordinates of an Object
 *
 * Instance Example:
 * new Bounds(min<Vector>, max<Vector>);
 *
 * Functions:
 * <Self> setMin(<Vector>)
 * <Self> setMax(<Vector>)
 */

function Bounds (min, max){
    if (!(this instanceof Bounds)) {
        return new Bounds(min, max);
    }

    this.min = min || new Vector();
    this.max = max || new Vector();
}

Bounds.prototype.min = new Vector();
Bounds.prototype.max = new Vector();

Bounds.prototype.setMin = function(vector){
    this.min = vector;
    return this;
};

Bounds.prototype.setMax = function(vector){
    this.max = vector;
    return this;
};

Bounds.prototype.reset = function(min, max){
    this.min = min;
    this.max = max;
    return this;
};

Bounds.prototype.getDimension = function(dimension) {
//    if(dimension instanceof Dimension) {
        return dimension.resetValues(this.max.x - this.min.x, this.max.y - this.min.y, this.max.z - this.min.z);
//    } else {
//        return new Dimension(this.max.x - this.min.x, this.max.y - this.min.y, this.max.z - this.min.z);
//    }
};

Bounds.prototype.getCenter = function(){
    return new Vector((this.max.x + this.min.x) / 2, (this.max.y + this.min.y) / 2, (this.max.z + this.min.z) / 2);
};

Bounds.prototype.getIntersectionInfo = function(bounds) {
    intersectionInfo.x = (bounds.max.x - this.min.x) - (this.max.x - bounds.min.x);
    intersectionInfo.y = (bounds.max.y - this.min.y) - (this.max.y - bounds.min.y);
    intersectionInfo.z = (bounds.max.z - this.min.z) - (this.max.z - bounds.min.z);
    return intersectionInfo;
};

Bounds.prototype.contains = function(arg) {
    if(arg.constructor === Vector) {
        return arg.x >= this.min.x && arg.y >= this.min.y && arg.z >= this.min.z && arg.x <= this.max.x && arg.y <= this.max.y && arg.z <= this.max.z;
    } else if(arg.constructor === Bounds) {
        return arg.min.x >= this.min.x && arg.min.y >= this.min.y && arg.min.z >= this.min.z && arg.max.x <= this.max.x && arg.max.y <= this.max.y && arg.max.z <= this.max.z;
    }
    return false;
};

Bounds.prototype.intersects = function(bounds) {
    return !(bounds.max.x < this.min.x || bounds.min.x > this.max.x || bounds.max.y < this.min.y || bounds.min.y > this.max.y || bounds.max.z < this.min.z || bounds.min.z > this.max.z);
};

module.exports = Bounds;
