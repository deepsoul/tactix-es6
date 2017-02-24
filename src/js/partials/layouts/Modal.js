"use strict";

var ContentManager = require('../../base/controller/ContentManager');
var browserHistory = require('../../services/history');
var preventOverscroll = require('prevent-overscroll');
var Viewport = require('../../base/Viewport');
var $ = require('jquery');

module.exports = ContentManager.extend({

    modelConstructor: ContentManager.prototype.modelConstructor.extend({
        session: {
            viewport: {
                type: 'object',
                default: function() {
                    return null;
                }
            },
            open: {
                type: 'boolean',
                required: true,
                default: false
            }
        }
    }),

    events: {
        'click': clickOutside
    },

    initialize: function() {
        ContentManager.prototype.initialize.apply(this, arguments);
        var cleanup = null;

        this.onMeasure = onMeasure.bind(this);
        this.onInit = onInit.bind(this);
        this.onResize = onResize.bind(this);
        this.onScroll = onScroll.bind(this);

        this.model.viewport = new Viewport(this.el.querySelector('.content'), this.el.querySelector('.content > .document'));
        this.model.viewport
            .on(this.model.viewport.EVENT_TYPES.MEASURE, this.onMeasure)
            .on(this.model.viewport.EVENT_TYPES.INIT, this.onInit)
            .on(this.model.viewport.EVENT_TYPES.RESIZE, this.onResize)
            .on(this.model.viewport.EVENT_TYPES.SCROLL, this.onScroll);

        browserHistory.register(this.model.deep, function(value) {
            if(value !== null) {
                addBodyScrollbarOffset();
                document.documentElement.classList.add('js-modal-active');
                this.model.open = true;
                cleanup = preventOverscroll(this.el.querySelector('div.content'));
                this.model.viewport.update();
            } else {
                removeBodyScrollbarOffset();
                document.documentElement.classList.remove('js-modal-active');
                this.model.open = false;
                (cleanup || function(){})();
            }
        }.bind(this));
    },

    onContentAdded: function() {
        ContentManager.prototype.onContentAdded.apply(this, arguments);
    },

    onContentRemoved: function() {
        ContentManager.prototype.onContentRemoved.apply(this, arguments);
    }
});

function onMeasure() {

}

function onInit() {

}

function onResize() {

}

function onScroll() {

}

//close modal when user clicks outside of modal content
function clickOutside(e) {
    e.preventDefault();

    if(!e.target.closest('.content', this.el)) {
        $('>a.close', this.el).trigger('click');
    }
}

//prevent bouncing content by disabling scrollbar (overflow: hidden)
function addBodyScrollbarOffset() {
    document.documentElement.style.cssText = 'margin-right: ' + (window.innerWidth - document.documentElement.clientWidth) + 'px';
}

function removeBodyScrollbarOffset() {
    document.documentElement.style.cssText = '';
}
