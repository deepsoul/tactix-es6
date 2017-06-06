/**
 * Created by Boris Horn  (boris.horn@grabarzundpartner.de)
 * on Tue Jun 06 2017 12:07:07 GMT+0200.
 */
/*jshint esversion: 6 */
"use strict";


import Controller from '../../../base/Controller';
import DomModel from '../../../base/DomModel';

import * as TestCollection from '../../../collections/TestCollection';



export default Controller.extend({

    modelConstructor: DomModel.extend({

    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        TestCollection.default.initApp() ;
        var players = TestCollection.default.database.ref('players/');
        players.on('value', (snapshot) => {
            this.displayPlayers(snapshot.val());
        });
    },
    displayPlayers: function (players) {
        for (var player of players) {
            console.log(player);
        }
    }
});


