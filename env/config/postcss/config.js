"use strict";

module.exports = {
  parser: false,
  plugins: [
      require('postcss-import'),
      require('postcss-url'),
      require('precss'),
      require('postcss-cssnext')({
        'browsers': ['> 2%', 'last 2 versions', 'IE 11', 'Firefox ESR']
      }),
      require('postcss-calc'),
      require('postcss-clearfix'),
      require('postcss-discard-comments'),
      require('cssnano')({
        zindex: false,
        autoprefixer: false
      }),
      require('postcss-browser-reporter'),
      require('postcss-reporter')
  ]
};
