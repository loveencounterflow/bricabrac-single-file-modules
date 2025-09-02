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
      //-------------------------------------------------------------------------------------------------------
      clean = function(x) {
        var k, v;
        if (Object.isFrozen(x)) {
          throw new Error("Ωrca__1 unable to clean frozen object");
        }
        for (k in x) {
          v = x[k];
          if (v === void 0) {
            delete x[k];
          }
        }
        return x;
      };
      //-------------------------------------------------------------------------------------------------------
      clean_all = function(...P) {
        var i, len, results, x;
        results = [];
        for (i = 0, len = P.length; i < len; i++) {
          x = P[i];
          results.push(clean(x));
        }
        return results;
      };
      //-------------------------------------------------------------------------------------------------------
      clean_assign = function(target, ...P) {
        var R, i, k, len, p, v;
        R = clean(target);
        for (i = 0, len = P.length; i < len; i++) {
          p = P[i];
          for (k in p) {
            v = p[k];
            if (v !== void 0) {
              R[k] = v;
            }
          }
        }
        return R;
      };
      //.......................................................................................................
      return exports = {clean, clean_all, clean_assign};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWNsZWFuLWFzc2lnbi1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUE7OztFQUdBLENBQUEsQ0FBRSxLQUFGLENBQUEsR0FBYSxPQUFiLEVBSEE7Ozs7O0VBU0EsS0FBQSxHQUlFLENBQUE7OztJQUFBLG9CQUFBLEVBQXNCLFFBQUEsQ0FBQSxDQUFBO0FBRXhCLFVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxZQUFBLEVBQUEsT0FBQTs7TUFDSSxLQUFBLEdBQVEsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNaLFlBQUEsQ0FBQSxFQUFBO1FBQU0sSUFBMkQsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEIsQ0FBM0Q7VUFBQSxNQUFNLElBQUksS0FBSixDQUFVLHVDQUFWLEVBQU47O1FBQ0EsS0FBQSxNQUFBOztjQUFpQyxDQUFBLEtBQUs7WUFBdEMsT0FBTyxDQUFDLENBQUUsQ0FBRjs7UUFBUjtBQUNBLGVBQU87TUFIRCxFQURaOztNQU9JLFNBQUEsR0FBWSxRQUFBLENBQUEsR0FBRSxDQUFGLENBQUE7QUFBVyxZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBO0FBQUc7UUFBQSxLQUFBLG1DQUFBOzt1QkFBRSxLQUFBLENBQU0sQ0FBTjtRQUFGLENBQUE7O01BQWQsRUFQaEI7O01BVUksWUFBQSxHQUFnQixRQUFBLENBQUUsTUFBRixFQUFBLEdBQVUsQ0FBVixDQUFBO0FBQ3BCLFlBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtRQUFNLENBQUEsR0FBSSxLQUFBLENBQU0sTUFBTjtRQUNKLEtBQUEsbUNBQUE7O1VBQ0UsS0FBQSxNQUFBOztnQkFBOEIsQ0FBQSxLQUFPO2NBQXJDLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBUzs7VUFBVDtRQURGO0FBRUEsZUFBTztNQUpPLEVBVnBCOztBQWlCSSxhQUFPLE9BQUEsR0FBVSxDQUFFLEtBQUYsRUFBUyxTQUFULEVBQW9CLFlBQXBCO0lBbkJHO0VBQXRCLEVBYkY7OztFQW1DQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQW5DQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnsgZGVidWcsIH0gPSBjb25zb2xlXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY2xlYW5fYXNzaWduOiAtPlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhbiA9ICggeCApIC0+XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqXJjYV9fMSB1bmFibGUgdG8gY2xlYW4gZnJvemVuIG9iamVjdFwiIGlmIE9iamVjdC5pc0Zyb3plbiB4XG4gICAgICBkZWxldGUgeFsgayBdIGZvciBrLCB2IG9mIHggd2hlbiB2IGlzIHVuZGVmaW5lZFxuICAgICAgcmV0dXJuIHhcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYW5fYWxsID0gKCBQLi4uICkgLT4gKCAoIGNsZWFuIHggKSBmb3IgeCBpbiBQIClcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYW5fYXNzaWduICA9ICggdGFyZ2V0LCBQLi4uICApIC0+XG4gICAgICBSID0gY2xlYW4gdGFyZ2V0XG4gICAgICBmb3IgcCBpbiBQXG4gICAgICAgIFJbIGsgXSA9IHYgZm9yIGssIHYgb2YgcCB3aGVuIHYgaXNudCB1bmRlZmluZWRcbiAgICAgIHJldHVybiBSXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBjbGVhbiwgY2xlYW5fYWxsLCBjbGVhbl9hc3NpZ24sIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBCUklDU1xuXG4iXX0=
