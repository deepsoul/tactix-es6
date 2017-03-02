"use strict";

var packages = require('../../packages');
var req = null;

module.exports = global.js = {
    parse: function (node) {
        node = node || document.documentElement;
        var nodes = Array.prototype.slice.call(node.querySelectorAll('.controller[data-controller]'));
        if(matches(node, '.controller[data-controller]')) {
            nodes.push(node);
        }
        return render(nodes);
    }
};

function render(nodes) {
    // reverse the initializing order to initialize inner elements before outer elements
    Array.prototype.reverse.call(nodes);
    return new Promise(function (fulfill, reject) {
        nodes.forEach(function(node) {
            try {
                initController(node);
            } catch (e) {
                reject(e);
            }
        });
        fulfill(true);
    });
}

function initController(node) {
    if (!node.init) {
        node.init = true;
        var targetNode = null;
        var targetSelector = node.dataset.target || node.getAttribute('data-target');
        if (targetSelector) {
            targetNode = document.querySelector(targetSelector);
            if (matches(targetNode, '.controller[data-controller]')) {
                initController(targetNode);
            }
        }

        var controllerClass = packages.find(function(controller) {
            return controller.name === node.getAttribute('data-controller');
        });

        if(controllerClass && controllerClass.controller) {
            new controllerClass.controller({el: node, target: targetNode});
        }
    }
}

function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
}
