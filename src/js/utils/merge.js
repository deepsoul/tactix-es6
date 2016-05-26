"use strict";

var uniq = require('lodash/uniqBy');
var union = require('lodash/union');

module.exports = {
    collections: function(collectionA, collectionB, by) {
        return uniq(union(collectionB, collectionA), by);
    }
};
