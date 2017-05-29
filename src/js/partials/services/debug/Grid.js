"use strict";

import Controller from '../../../base/Controller';
import DomModel from '../../../base/DomModel';

import Template from '../../../base/Template';
import '../../../../pcss/services/debug/grid.pcss';
import template from './tmpl/columns.hbs';

var parameterRegex = /[&?]?grid=true/;
export default Controller.extend({

    columnsTmpl: new Template(template),

    modelConstructor: DomModel.extend({
        session: {
            columns: {
                type: 'number',
                required: true,
                default: 12
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        var columns = [];
        for (var i = 0; i < this.model.columns; i++) {
            columns.push(i);
        }
        this.columnsEl = this.queryByHook('columns');
        global.animationFrame.addOnce(function() {
            this.columnsEl.innerHTML = this.columnsTmpl.toText(columns);
            if (global.location.href.match(parameterRegex)) {
                document.body.parentElement.classList.add('js-grid-helper-visible');
            }
        }.bind(this));
    }
});
