/**
 * Created by Boris Horn  (boris.horn@grabarzundpartner.de)
 * on Tue Jun 06 2017 12:07:07 GMT+0200.
 */
/*jshint esversion: 6 */
"use strict";


import Controller from '../../../base/Controller';
import DomModel from '../../../base/DomModel';

import * as TestCollection from '../../../collections/TestCollection';
import Player from '../../../models/Player';

import PlayerListItem from './view/PlayerListItem';

import pepjs from 'pepjs';
var scope;
export default Controller.extend({

    modelConstructor: DomModel.extend({

    }),

    events: {
      'pointerdown .player-item' : 'onPlayerClick'
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        scope = this;
        TestCollection.default.initApp() ;
        var players = TestCollection.default.database.ref('players/');
        players.on('value', (snapshot) => {

            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                var p = childData;
                p.uuid = childKey;
                var view = new PlayerListItem({model:new Player(p)});
                scope.el.append(view.render().el);
            });

            //this.displayPlayers(snapshot.val());
        });
    },
    displayPlayers: function (players) {
        var uuid = 0;
        for (var player of players) {
            var p = player;
            p.uuid = uuid++;
            var view = new PlayerListItem({model:new Player(p)});
            this.el.append(view.render().el);

        }
    },
    onPlayerClick: function (e) {
        var userId = e.delegateTarget.dataset.playerUuid;

        TestCollection.default.database.ref('players/' + userId).update({
            active: 'bix',
            author: 'james',
            bild: 'http://apps.vizar.de/tactix/app/assets/images/defaultImages/player/phillip.jpg'

        });

        // we can also chain the two calls together
        var newPlayer  = TestCollection.default.database.ref('players/');
        newPlayer.push().set({
            author: "alanisawesome",
            title: "The Turing Machine",
            bild: 'http://tactixapp.com/images/defaultImages/default_scs.jpg'
        });
    }
});


