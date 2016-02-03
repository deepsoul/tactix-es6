"use strict";

var nativeSupport = true;

module.exports = (function (window) {
    var lastTime = 0;
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame;


    // polyfill with setTimeout fallback
    // heavily inspired from @darius gist mod: https://gist.github.com/paulirish/1579671#comment-837945
    if (!requestAnimationFrame || !cancelAnimationFrame) {
        nativeSupport = false;
        requestAnimationFrame = function (callback) {
            var now = 0;
            if (Date.now) {
                now = +Date.now();
            } else {
                now = (new Date()).getTime();
            }

            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () {
                callback(lastTime = nextTime);
            }, nextTime - now);
        };

        cancelAnimationFrame = clearTimeout;
    }

    // export to window
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelRequestAnimationFrame = cancelAnimationFrame;

    return {
        add: function (callback) {
            window.requestAnimationFrame(callback);
        },

        addLoop: function (callback) {
            var handler = {
                id: null,
                callback: callback
            };
            (function animloop(time) {
                handler.id = window.requestAnimationFrame(animloop);
                handler.callback(time);
            })();
            return handler;
        },

        cancelLoop: function (handler) {
            window.cancelRequestAnimationFrame(handler.id);
        }
    };
})(global);
