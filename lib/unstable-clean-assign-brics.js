(function() {
  'use strict';
  var BRICS, debug;

  //===========================================================================================================
  ({debug} = console);

  //###########################################################################################################

  //===========================================================================================================
  BRICS = {
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_clean_assign: function() {
      var clean, clean_all, clean_assign, exports;
      // { show_no_colors: rpr,  } = ( require '..' ).unstable.require_show()

      //-------------------------------------------------------------------------------------------------------
      clean = function(x) {
        var k, v;
        return Object.fromEntries((function() {
          var results;
          results = [];
          for (k in x) {
            v = x[k];
            if (v !== void 0) {
              results.push([k, v]);
            }
          }
          return results;
        })());
      };
      clean_all = function(...P) {
        var i, len, results, x;
        results = [];
        for (i = 0, len = P.length; i < len; i++) {
          x = P[i];
          results.push(clean(x));
        }
        return results;
      };
      clean_assign = function(...P) {
        return Object.assign(...(clean_all(...P)));
      };
      //.......................................................................................................
      return exports = {clean, clean_all, clean_assign};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWNsZWFuLWFzc2lnbi1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUE7OztFQUdBLENBQUEsQ0FBRSxLQUFGLENBQUEsR0FBYSxPQUFiLEVBSEE7Ozs7O0VBU0EsS0FBQSxHQUlFLENBQUE7OztJQUFBLG9CQUFBLEVBQXNCLFFBQUEsQ0FBQSxDQUFBO0FBQ3hCLFVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxZQUFBLEVBQUEsT0FBQTs7OztNQUdJLEtBQUEsR0FBZ0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUFXLFlBQUEsQ0FBQSxFQUFBO2VBQUMsTUFBTSxDQUFDLFdBQVA7O0FBQXFCO1VBQUEsS0FBQSxNQUFBOztnQkFBNkIsQ0FBQSxLQUFPOzJCQUFwQyxDQUFFLENBQUYsRUFBSyxDQUFMOztVQUFBLENBQUE7O1lBQXJCO01BQVo7TUFDaEIsU0FBQSxHQUFnQixRQUFBLENBQUEsR0FBRSxDQUFGLENBQUE7QUFBVyxZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBO0FBQUc7UUFBQSxLQUFBLG1DQUFBOzt1QkFBRSxLQUFBLENBQU0sQ0FBTjtRQUFGLENBQUE7O01BQWQ7TUFDaEIsWUFBQSxHQUFnQixRQUFBLENBQUEsR0FBRSxDQUFGLENBQUE7ZUFBWSxNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUEsQ0FBRSxTQUFBLENBQVUsR0FBQSxDQUFWLENBQUYsQ0FBZDtNQUFaLEVBTHBCOztBQVFJLGFBQU8sT0FBQSxHQUFVLENBQUUsS0FBRixFQUFTLFNBQVQsRUFBb0IsWUFBcEI7SUFURztFQUF0QixFQWJGOzs7RUF5QkEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsS0FBOUI7QUF6QkEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG57IGRlYnVnLCB9ID0gY29uc29sZVxuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5CUklDUyA9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NsZWFuX2Fzc2lnbjogLT5cbiAgICAjIHsgc2hvd19ub19jb2xvcnM6IHJwciwgIH0gPSAoIHJlcXVpcmUgJy4uJyApLnVuc3RhYmxlLnJlcXVpcmVfc2hvdygpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFuICAgICAgICAgPSAoIHggICAgKSAtPiBPYmplY3QuZnJvbUVudHJpZXMgKCBbIGssIHYsIF0gZm9yIGssIHYgb2YgeCB3aGVuIHYgaXNudCB1bmRlZmluZWQgKVxuICAgIGNsZWFuX2FsbCAgICAgPSAoIFAuLi4gKSAtPiAoICggY2xlYW4geCApIGZvciB4IGluIFAgKVxuICAgIGNsZWFuX2Fzc2lnbiAgPSAoIFAuLi4gKSAtPiBPYmplY3QuYXNzaWduICggY2xlYW5fYWxsIFAuLi4gKS4uLlxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgY2xlYW4sIGNsZWFuX2FsbCwgY2xlYW5fYXNzaWduLCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
