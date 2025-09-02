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
      //.......................................................................................................
      return exports = {clean, clean_all, clean_assign};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLW9iamVjdC10b29scy1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUE7OztFQUdBLENBQUEsQ0FBRSxLQUFGLENBQUEsR0FBYSxPQUFiLEVBSEE7Ozs7O0VBU0EsS0FBQSxHQUlFLENBQUE7OztJQUFBLG9CQUFBLEVBQXNCLFFBQUEsQ0FBQSxDQUFBO0FBRXhCLFVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxZQUFBLEVBQUEsT0FBQTs7TUFDSSxLQUFBLEdBQVEsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNaLFlBQUEsQ0FBQSxFQUFBO1FBQU0sSUFBNEQsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEIsQ0FBNUQ7VUFBQSxNQUFNLElBQUksS0FBSixDQUFVLHdDQUFWLEVBQU47O1FBQ0EsS0FBQSxNQUFBOztjQUFpQyxDQUFBLEtBQUs7WUFBdEMsT0FBTyxDQUFDLENBQUUsQ0FBRjs7UUFBUjtBQUNBLGVBQU87TUFIRCxFQURaOztNQU9JLFNBQUEsR0FBWSxRQUFBLENBQUEsR0FBRSxDQUFGLENBQUE7QUFBVyxZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBO0FBQUc7UUFBQSxLQUFBLG1DQUFBOzt1QkFBRSxLQUFBLENBQU0sQ0FBTjtRQUFGLENBQUE7O01BQWQsRUFQaEI7O01BVUksWUFBQSxHQUFnQixRQUFBLENBQUUsTUFBRixFQUFBLEdBQVUsQ0FBVixDQUFBO0FBQ3BCLFlBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtRQUFNLENBQUEsR0FBSSxLQUFBLENBQU0sTUFBTjtRQUNKLEtBQUEsbUNBQUE7O1VBQ0UsS0FBQSxNQUFBOztnQkFBOEIsQ0FBQSxLQUFPO2NBQXJDLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBUzs7VUFBVDtRQURGO0FBRUEsZUFBTztNQUpPLEVBVnBCOztBQWlCSSxhQUFPLE9BQUEsR0FBVSxDQUFFLEtBQUYsRUFBUyxTQUFULEVBQW9CLFlBQXBCO0lBbkJHLENBQXRCOzs7SUF1QkEsYUFBQSxFQUFlLFFBQUEsQ0FBQSxDQUFBO0FBRWpCLFVBQUEsT0FBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTs7O01BRUksWUFBQSxHQUFlLFFBQUEsQ0FBRSxDQUFGLENBQUE7ZUFBUyxDQUFFLE1BQU0sQ0FBQSxTQUFFLENBQUEsUUFBUSxDQUFDLElBQWpCLENBQXNCLENBQXRCLENBQUYsQ0FBQSxLQUErQjtNQUF4QyxFQUZuQjs7TUFLSSxJQUFBLEdBQU8sTUFBQSxDQUFPLE1BQVAsRUFMWDs7TUFRSSxLQUFBLEdBQVEsUUFBQSxDQUFFLENBQUYsRUFBSyxPQUFMLENBQUE7QUFDWixZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLFlBQUEsRUFBQSxhQUFBLEVBQUEsR0FBQSxFQUFBO1FBQU0sSUFBNEQsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEIsQ0FBNUQ7VUFBQSxNQUFNLElBQUksS0FBSixDQUFVLHdDQUFWLEVBQU47O1FBQ0EsYUFBQSxHQUFnQixNQUFNLENBQUMsbUJBQVAsQ0FBMkIsQ0FBM0I7UUFDaEIsR0FBQSxHQUFnQixDQUFBO1FBQ2hCLEtBQUEsK0NBQUE7O1VBQ0UsVUFBQSxpREFBOEM7QUFDOUMsa0JBQU8sSUFBUDtBQUFBLGlCQUNPLFVBQUEsS0FBYyxJQURyQjtjQUNzQztBQUEvQjtBQURQLGlCQUVPLFlBQUEsQ0FBYSxVQUFiLENBRlA7Y0FFc0MsTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFkLEVBQW1CLFVBQUEsQ0FBVyxDQUFDLENBQUUsWUFBRixDQUFaLEVBQThCLFlBQTlCLENBQW5CO0FBQS9CO0FBRlA7Y0FHc0MsR0FBRyxDQUFFLFVBQUYsQ0FBSCxHQUFvQixDQUFDLENBQUUsWUFBRjtBQUgzRDtVQUlBLE9BQU8sQ0FBQyxDQUFFLFlBQUY7UUFOVjtBQU9BLGVBQU8sTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLEdBQWpCO01BWEQsRUFSWjs7QUFzQkksYUFBTyxPQUFBLEdBQVUsQ0FBRSxLQUFGLEVBQVMsSUFBVDtJQXhCSjtFQXZCZixFQWJGOzs7RUErREEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsS0FBOUI7QUEvREEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG57IGRlYnVnLCB9ID0gY29uc29sZVxuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5CUklDUyA9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NsZWFuX2Fzc2lnbjogLT5cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYW4gPSAoIHggKSAtPlxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlyY2FfX18xIHVuYWJsZSB0byBjbGVhbiBmcm96ZW4gb2JqZWN0XCIgaWYgT2JqZWN0LmlzRnJvemVuIHhcbiAgICAgIGRlbGV0ZSB4WyBrIF0gZm9yIGssIHYgb2YgeCB3aGVuIHYgaXMgdW5kZWZpbmVkXG4gICAgICByZXR1cm4geFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhbl9hbGwgPSAoIFAuLi4gKSAtPiAoICggY2xlYW4geCApIGZvciB4IGluIFAgKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhbl9hc3NpZ24gID0gKCB0YXJnZXQsIFAuLi4gICkgLT5cbiAgICAgIFIgPSBjbGVhbiB0YXJnZXRcbiAgICAgIGZvciBwIGluIFBcbiAgICAgICAgUlsgayBdID0gdiBmb3IgaywgdiBvZiBwIHdoZW4gdiBpc250IHVuZGVmaW5lZFxuICAgICAgcmV0dXJuIFJcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGNsZWFuLCBjbGVhbl9hbGwsIGNsZWFuX2Fzc2lnbiwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9yZW1hcDogLT5cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIFRBSU5UIHVzZSBtb2R1bGUgIyMjXG4gICAgaXNhX2Z1bmN0aW9uID0gKCB4ICkgLT4gKCBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgeCApIGlzICdbb2JqZWN0IEZ1bmN0aW9uXSdcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgb21pdCA9IFN5bWJvbCAnb21pdCdcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVtYXAgPSAoIHgsIG1hcHBpbmcgKSAtPlxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlyY2FfX18yIHVuYWJsZSB0byByZW1hcCBmcm96ZW4gb2JqZWN0XCIgaWYgT2JqZWN0LmlzRnJvemVuIHhcbiAgICAgIG9yaWdpbmFsX2tleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB4XG4gICAgICB0bXAgICAgICAgICAgID0ge31cbiAgICAgIGZvciBvcmlnaW5hbF9rZXkgaW4gb3JpZ2luYWxfa2V5c1xuICAgICAgICBtYXBwZWRfa2V5ICAgICAgICA9IG1hcHBpbmdbIG9yaWdpbmFsX2tleSBdID8gb3JpZ2luYWxfa2V5XG4gICAgICAgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiBtYXBwZWRfa2V5IGlzIG9taXQgICAgICAgdGhlbiAgbnVsbFxuICAgICAgICAgIHdoZW4gaXNhX2Z1bmN0aW9uIG1hcHBlZF9rZXkgIHRoZW4gIE9iamVjdC5hc3NpZ24gdG1wLCBtYXBwZWRfa2V5IHhbIG9yaWdpbmFsX2tleSBdLCBvcmlnaW5hbF9rZXlcbiAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBbIG1hcHBlZF9rZXkgXSA9IHhbIG9yaWdpbmFsX2tleSBdXG4gICAgICAgIGRlbGV0ZSB4WyBvcmlnaW5hbF9rZXkgXVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24geCwgdG1wXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyByZW1hcCwgb21pdCwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEJSSUNTXG5cbiJdfQ==
