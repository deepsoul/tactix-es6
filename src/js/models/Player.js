/**
 * Created by boris.horn on 06.06.17.
 */

import AmpersandModel from 'ampersand-model';

var Player = AmpersandModel.extend({
    props: {
        active: 'string',
        adresse: 'string',
        bild: 'string',
        email: 'string',
        id: 'string',
        creation_date: 'string',
        team_id: 'string',
        festnetz_tel : 'string',
        mobil_tel: 'string',
        vorname: 'string',
        nachname: 'string',
        funktion: 'string',
        passnummer: 'string',
        uuid: 'string'

    }
});

export default Player;