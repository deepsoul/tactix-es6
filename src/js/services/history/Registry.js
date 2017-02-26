"use strict";

import AmpersandCollection from 'ampersand-collection';
import parse from 'url-parse';
import Entry from './Entry';

export default AmpersandCollection.extend({
    mainIndex: 'name',
    model: Entry,

    initialize: function() {
        AmpersandCollection.prototype.initialize.apply(this, arguments);

        var query = parse(global.location.href, true).query;
        for(var key in query) {
            if (query.hasOwnProperty(key)) {
                this.add({name: key, value: query[key]});
            }
        }
    }
});
