"use strict";

var nativeSupport = true;
var loopingTasks = [];
var singleTasks = [];
var handler;
var step;

global.animationFrame = (function (window) {
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
        add: function(fn, duration) {
            var start = 0;
            if(!duration) {
                start = -1;
            }
            var task = {
                mutate: fn,
                duration: duration || 0,
                start: start
            };
            loopingTasks.push(task);
            return task;
        },

        remove: function(task) {
            loopingTasks = loopingTasks.filter(function(item) {
                if (item !== task) {
                    return item;
                }
            });
        },

        throttle: function(measure, mutate) {
            var handler = {mutate: mutate, running: false};

            return function(e) {
                measure(e);
                if (handler.running) {
                    return;
                }
                singleTasks.push(handler);
                handler.running = true;
            };
        },

        addOnce: function(mutate) {
            // global.requestAnimationFrame(function() {
                singleTasks.push({mutate: mutate, running: true});
            // });
        }
    };
})(global);

export default global.animationFrame;

global.requestAnimationFrame(function loop(time) {
    runSingleTasks(time);
    runLoopingTasks(time);
    global.requestAnimationFrame(loop);
});

function runSingleTasks(time) {
    while(singleTasks.length) {
        handler = singleTasks.shift();
        handler.mutate(time);
        handler.running = false;
    }
}

function runLoopingTasks(time) {
    loopingTasks.forEach(function(task) {
        task.start = task.start || time;
        step = (time - task.start) / task.duration;
        task.mutate(step, time);
        if(step >= 1 && step !== Infinity) {
            global.animationFrame.remove(task);
        }
    });
}
