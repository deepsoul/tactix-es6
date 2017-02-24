"use strict";

var handlebars = require('handlebars/runtime');
handlebars.registerHelper(require('handlebars-layouts')(handlebars));

function Template(hbs) {
    this.hbs = hbs;
}

Template.prototype.toText = function(data) {
    return this.hbs(data).replace(/(---[^><]+---)/gi, '');
};

Template.prototype.toFragment = function(data) {
    return document.createRange().createContextualFragment(this.toText(data));
};

module.exports = Template;
