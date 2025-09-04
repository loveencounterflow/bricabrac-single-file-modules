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
          throw new Error("Ωrca___1 unable to clean frozen object");
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
      //-------------------------------------------------------------------------------------------------------
      return exports = {clean, clean_all, clean_assign};
    },
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_pick: function() {
      var exports, pick;
      //-------------------------------------------------------------------------------------------------------
      pick = function(x, keys) {
        var key;
        return Object.fromEntries((function() {
          var results;
          results = [];
          for (key of keys) {
            results.push([key, x[key]]);
          }
          return results;
        })());
      };
      //-------------------------------------------------------------------------------------------------------
      return exports = {pick};
    },
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_remap: function() {
      var exports, isa_function, omit, remap;
      //-------------------------------------------------------------------------------------------------------
      /* TAINT use module */
      isa_function = function(x) {
        return (Object.prototype.toString.call(x)) === '[object Function]';
      };
      //-------------------------------------------------------------------------------------------------------
      omit = Symbol('omit');
      //-------------------------------------------------------------------------------------------------------
      remap = function(x, mapping) {
        var i, len, mapped_key, original_key, original_keys, ref, tmp;
        if (Object.isFrozen(x)) {
          throw new Error("Ωrca___2 unable to remap frozen object");
        }
        original_keys = Object.getOwnPropertyNames(x);
        tmp = {};
        for (i = 0, len = original_keys.length; i < len; i++) {
          original_key = original_keys[i];
          mapped_key = (ref = mapping[original_key]) != null ? ref : original_key;
          switch (true) {
            case mapped_key === omit:
              null;
              break;
            case isa_function(mapped_key):
              Object.assign(tmp, mapped_key(x[original_key], original_key));
              break;
            default:
              tmp[mapped_key] = x[original_key];
          }
          delete x[original_key];
        }
        return Object.assign(x, tmp);
      };
      //.......................................................................................................
      return exports = {remap, omit};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLW9iamVjdC10b29scy1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUE7OztFQUdBLENBQUEsQ0FBRSxLQUFGLENBQUEsR0FBYSxPQUFiLEVBSEE7Ozs7O0VBU0EsS0FBQSxHQUlFLENBQUE7OztJQUFBLG9CQUFBLEVBQXNCLFFBQUEsQ0FBQSxDQUFBO0FBRXhCLFVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxZQUFBLEVBQUEsT0FBQTs7TUFDSSxLQUFBLEdBQVEsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNaLFlBQUEsQ0FBQSxFQUFBO1FBQU0sSUFBNEQsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEIsQ0FBNUQ7VUFBQSxNQUFNLElBQUksS0FBSixDQUFVLHdDQUFWLEVBQU47O1FBQ0EsS0FBQSxNQUFBOztjQUFpQyxDQUFBLEtBQUs7WUFBdEMsT0FBTyxDQUFDLENBQUUsQ0FBRjs7UUFBUjtBQUNBLGVBQU87TUFIRCxFQURaOztNQU9JLFNBQUEsR0FBWSxRQUFBLENBQUEsR0FBRSxDQUFGLENBQUE7QUFBVyxZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBO0FBQUc7UUFBQSxLQUFBLG1DQUFBOzt1QkFBRSxLQUFBLENBQU0sQ0FBTjtRQUFGLENBQUE7O01BQWQsRUFQaEI7O01BVUksWUFBQSxHQUFnQixRQUFBLENBQUUsTUFBRixFQUFBLEdBQVUsQ0FBVixDQUFBO0FBQ3BCLFlBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtRQUFNLENBQUEsR0FBSSxLQUFBLENBQU0sTUFBTjtRQUNKLEtBQUEsbUNBQUE7O1VBQ0UsS0FBQSxNQUFBOztnQkFBOEIsQ0FBQSxLQUFPO2NBQXJDLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBUzs7VUFBVDtRQURGO0FBRUEsZUFBTztNQUpPLEVBVnBCOztBQWlCSSxhQUFPLE9BQUEsR0FBVSxDQUFFLEtBQUYsRUFBUyxTQUFULEVBQW9CLFlBQXBCO0lBbkJHLENBQXRCOzs7SUF1QkEsWUFBQSxFQUFjLFFBQUEsQ0FBQSxDQUFBO0FBRWhCLFVBQUEsT0FBQSxFQUFBLElBQUE7O01BQ0ksSUFBQSxHQUFPLFFBQUEsQ0FBRSxDQUFGLEVBQUssSUFBTCxDQUFBO0FBQ1gsWUFBQTtBQUFNLGVBQU8sTUFBTSxDQUFDLFdBQVA7O0FBQXFCO1VBQUEsS0FBQSxXQUFBO3lCQUFBLENBQUUsR0FBRixFQUFPLENBQUMsQ0FBRSxHQUFGLENBQVI7VUFBQSxDQUFBOztZQUFyQjtNQURGLEVBRFg7O0FBS0ksYUFBTyxPQUFBLEdBQVUsQ0FBRSxJQUFGO0lBUEwsQ0F2QmQ7OztJQWtDQSxhQUFBLEVBQWUsUUFBQSxDQUFBLENBQUE7QUFFakIsVUFBQSxPQUFBLEVBQUEsWUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBOzs7TUFFSSxZQUFBLEdBQWUsUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLENBQUUsTUFBTSxDQUFBLFNBQUUsQ0FBQSxRQUFRLENBQUMsSUFBakIsQ0FBc0IsQ0FBdEIsQ0FBRixDQUFBLEtBQStCO01BQXhDLEVBRm5COztNQUtJLElBQUEsR0FBTyxNQUFBLENBQU8sTUFBUCxFQUxYOztNQVFJLEtBQUEsR0FBUSxRQUFBLENBQUUsQ0FBRixFQUFLLE9BQUwsQ0FBQTtBQUNaLFlBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsWUFBQSxFQUFBLGFBQUEsRUFBQSxHQUFBLEVBQUE7UUFBTSxJQUE0RCxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixDQUE1RDtVQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsd0NBQVYsRUFBTjs7UUFDQSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixDQUEzQjtRQUNoQixHQUFBLEdBQWdCLENBQUE7UUFDaEIsS0FBQSwrQ0FBQTs7VUFDRSxVQUFBLGlEQUE4QztBQUM5QyxrQkFBTyxJQUFQO0FBQUEsaUJBQ08sVUFBQSxLQUFjLElBRHJCO2NBQ3NDO0FBQS9CO0FBRFAsaUJBRU8sWUFBQSxDQUFhLFVBQWIsQ0FGUDtjQUVzQyxNQUFNLENBQUMsTUFBUCxDQUFjLEdBQWQsRUFBbUIsVUFBQSxDQUFXLENBQUMsQ0FBRSxZQUFGLENBQVosRUFBOEIsWUFBOUIsQ0FBbkI7QUFBL0I7QUFGUDtjQUdzQyxHQUFHLENBQUUsVUFBRixDQUFILEdBQW9CLENBQUMsQ0FBRSxZQUFGO0FBSDNEO1VBSUEsT0FBTyxDQUFDLENBQUUsWUFBRjtRQU5WO0FBT0EsZUFBTyxNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsRUFBaUIsR0FBakI7TUFYRCxFQVJaOztBQXNCSSxhQUFPLE9BQUEsR0FBVSxDQUFFLEtBQUYsRUFBUyxJQUFUO0lBeEJKO0VBbENmLEVBYkY7OztFQTBFQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQTFFQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnsgZGVidWcsIH0gPSBjb25zb2xlXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY2xlYW5fYXNzaWduOiAtPlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhbiA9ICggeCApIC0+XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqXJjYV9fXzEgdW5hYmxlIHRvIGNsZWFuIGZyb3plbiBvYmplY3RcIiBpZiBPYmplY3QuaXNGcm96ZW4geFxuICAgICAgZGVsZXRlIHhbIGsgXSBmb3IgaywgdiBvZiB4IHdoZW4gdiBpcyB1bmRlZmluZWRcbiAgICAgIHJldHVybiB4XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFuX2FsbCA9ICggUC4uLiApIC0+ICggKCBjbGVhbiB4ICkgZm9yIHggaW4gUCApXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFuX2Fzc2lnbiAgPSAoIHRhcmdldCwgUC4uLiAgKSAtPlxuICAgICAgUiA9IGNsZWFuIHRhcmdldFxuICAgICAgZm9yIHAgaW4gUFxuICAgICAgICBSWyBrIF0gPSB2IGZvciBrLCB2IG9mIHAgd2hlbiB2IGlzbnQgdW5kZWZpbmVkXG4gICAgICByZXR1cm4gUlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgY2xlYW4sIGNsZWFuX2FsbCwgY2xlYW5fYXNzaWduLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3BpY2s6IC0+XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHBpY2sgPSAoIHgsIGtleXMgKSAtPlxuICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyAoIFsga2V5LCB4WyBrZXkgXSwgXSBmb3Iga2V5IGZyb20ga2V5cyApXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJldHVybiBleHBvcnRzID0geyBwaWNrLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3JlbWFwOiAtPlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgVEFJTlQgdXNlIG1vZHVsZSAjIyNcbiAgICBpc2FfZnVuY3Rpb24gPSAoIHggKSAtPiAoIE9iamVjdDo6dG9TdHJpbmcuY2FsbCB4ICkgaXMgJ1tvYmplY3QgRnVuY3Rpb25dJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBvbWl0ID0gU3ltYm9sICdvbWl0J1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZW1hcCA9ICggeCwgbWFwcGluZyApIC0+XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqXJjYV9fXzIgdW5hYmxlIHRvIHJlbWFwIGZyb3plbiBvYmplY3RcIiBpZiBPYmplY3QuaXNGcm96ZW4geFxuICAgICAgb3JpZ2luYWxfa2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHhcbiAgICAgIHRtcCAgICAgICAgICAgPSB7fVxuICAgICAgZm9yIG9yaWdpbmFsX2tleSBpbiBvcmlnaW5hbF9rZXlzXG4gICAgICAgIG1hcHBlZF9rZXkgICAgICAgID0gbWFwcGluZ1sgb3JpZ2luYWxfa2V5IF0gPyBvcmlnaW5hbF9rZXlcbiAgICAgICAgc3dpdGNoIHRydWVcbiAgICAgICAgICB3aGVuIG1hcHBlZF9rZXkgaXMgb21pdCAgICAgICB0aGVuICBudWxsXG4gICAgICAgICAgd2hlbiBpc2FfZnVuY3Rpb24gbWFwcGVkX2tleSAgdGhlbiAgT2JqZWN0LmFzc2lnbiB0bXAsIG1hcHBlZF9rZXkgeFsgb3JpZ2luYWxfa2V5IF0sIG9yaWdpbmFsX2tleVxuICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcFsgbWFwcGVkX2tleSBdID0geFsgb3JpZ2luYWxfa2V5IF1cbiAgICAgICAgZGVsZXRlIHhbIG9yaWdpbmFsX2tleSBdXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiB4LCB0bXBcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IHJlbWFwLCBvbWl0LCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
