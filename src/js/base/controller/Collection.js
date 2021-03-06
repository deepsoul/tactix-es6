"use strict";

import Controller from '../Controller';
import DomModel from '../DomModel';
import AmpersandCollection from 'ampersand-collection';

export default Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            selector: {
                type: 'string',
                required: true,
                default: '> *'
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.collection = new AmpersandCollection();
        $(this.model.selector, this.el).each(function(index, item) {
            this.collection.add($(item).data('controller').model);
        }.bind(this));
    }
});
