/**
 * Created by boris.horn on 06.06.17.
 */

"use strict";

import * as firebase from 'firebase';

var TestCollection = {
    foo: "bar",
    initApp: function () {
        var config = {
            apiKey: "AIzaSyAOFNFf3ao0mhsmpwSIM8MUh81lLEKoqRE",
            authDomain: "tactix-app.firebaseapp.com",
            databaseURL: "https://tactix-app.firebaseio.com",
            projectId: "tactix-app",
            storageBucket: "tactix-app.appspot.com",
            messagingSenderId: "9423653577"
        };
        firebase.initializeApp(config);

        this.database = firebase.database();

    }
}

export default TestCollection;








