/**
 * Created by boris.horn on 06.06.17.
 */


import AmpersandView from 'ampersand-view';
import pepjs from 'pepjs';

var template = require('./playerListView.hbs');

var PlayerListView = AmpersandView.extend({
    autoRender: true,

    template: function() {
        return template(this.model);
    },

    initialize: function () {
        //console.log("TEST", this.model.adresse)
    },

    events: {
        'pointerdown' : 'onPointerDown',
        'pointerover' : 'onPointerOver'
    },

    onPointerDown: function (e) {
        console.log("TEST" , this.model);
    },
    onPointerOver: function (e) {
        console.log("over");
    }

});

export default PlayerListView;