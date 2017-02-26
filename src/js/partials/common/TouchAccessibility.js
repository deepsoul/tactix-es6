'use strict';

import Controller from '../../base/Controller';


export default Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        // $(document).on('click', 'a', function(e) {
        //     // console.log('CLICK',e);
        // });
    }
});
