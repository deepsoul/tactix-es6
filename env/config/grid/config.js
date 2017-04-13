"use strict";

var path = require('upath');

module.exports = [{
    name: 'default',
    options: {
        filePrefix: '',
        prefix: 'grid',
        columnPrefix: 'grid-col',
        columns: [12],
        breakpoints: {
            default: '20rem',
            xs: '30rem',
            sm: '48rem',
            md: '62rem',
            lg: '75rem'
        },
        gutters: {
            default: '0.9375rem'
        }
    },
    environments: [{
        name: 'variables',
        file: require('agency-environment/lib/tasks/grid/variables'),
        config: {
            variables: {}
        }
    }, {
        name: 'base',
        file: require('agency-environment/lib/tasks/grid/base'),
        config: {
            root: path.resolve('node_modules/purecss/build'),
            pureFiles: ['base', 'grids-core']
        }
    }],

    features: [{
            name: 'columns',
            file: require('agency-environment/lib/tasks/grid/columns')
        },
        {
            name: 'gutter',
            file: require('agency-environment/lib/tasks/grid/gutter')
        },
        {
            name: 'offset',
            file: require('agency-environment/lib/tasks/grid/offset')
        },
        {
            name: 'wrapper',
            file: require('agency-environment/lib/tasks/grid/wrapper'),
            config: {
                breakpoints: {
                    default: {
                        'min-width': '$screen-default'
                    },
                    xs: {
                        'margin-left': 'auto',
                        'margin-right': 'auto'
                    },
                    sm: {},
                    md: {
                        'max-width': '$screen-md'
                    },
                    lg: {
                        'max-width': '$screen-lg'
                    }
                }
            }
        },
        {
            name: 'visible-hidden',
            file: require('agency-environment/lib/tasks/grid/visible-hidden'),
            config: {
                important: false
            }
        }
    ]
}];
