(function() {
  'use strict';
  //===========================================================================================================
  Object.assign(module.exports, require('./various-brics'));

  Object.assign(module.exports, require('./ansi-brics'));

  Object.assign(module.exports, {
    unstable: require('./unstable-brics')
  });

}).call(this);

//# sourceMappingURL=main.js.map