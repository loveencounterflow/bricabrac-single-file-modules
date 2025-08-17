(function() {
  'use strict';
  var UNSTABLE_CALLSITE_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_CALLSITE_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_get_callsite: function() {
      var PATH, URL, UTIL, debug, exports, get_app_details, get_callsite, get_callsite_path, internals;
      //=========================================================================================================
      PATH = require('node:path');
      UTIL = require('node:util');
      URL = require('node:url');
      ({debug} = console);
      //---------------------------------------------------------------------------------------------------------
      internals = Object.freeze({});
      //---------------------------------------------------------------------------------------------------------
      get_app_details = function({delta = 1} = {}) {
        var error, package_json, package_path, path;
        // callsite = get_callsite { delta: delta + 1, }
        path = PATH.dirname(get_callsite_path({
          delta: delta + 1
        }));
        while (true) {
          try {
            // break
            //.......................................................................................................
            package_path = PATH.join(path, 'package.json');
            package_json = require(package_path);
            break;
          } catch (error1) {
            error = error1;
            if (error.code !== 'MODULE_NOT_FOUND') {
              throw error;
            }
          }
          path = PATH.dirname(path);
        }
        //.......................................................................................................
        return {path, package_path, package_json};
      };
      //---------------------------------------------------------------------------------------------------------
      get_callsite = function({delta = 1} = {}) {
        var callsites, frame_count;
        frame_count = delta < 10 ? 10 : 200;
        callsites = UTIL.getCallSites(200);
        return callsites[delta];
      };
      //---------------------------------------------------------------------------------------------------------
      get_callsite_path = function({delta = 1} = {}) {
        var callsite;
        callsite = get_callsite({
          delta: delta + 1
        });
        if (!callsite.scriptName.startsWith('file://')) {
          throw new Error(`Ω___5 unable to get path for callsite.scriptName: ${callsite.scriptName}`);
        }
        return URL.fileURLToPath(callsite.scriptName);
      };
      //=========================================================================================================
      internals = Object.freeze(internals);
      return exports = {get_callsite, get_callsite_path, get_app_details, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_CALLSITE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWNhbGxzaXRlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx1QkFBQTs7Ozs7RUFLQSx1QkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxvQkFBQSxFQUFzQixRQUFBLENBQUEsQ0FBQTtBQUV4QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsZUFBQSxFQUFBLFlBQUEsRUFBQSxpQkFBQSxFQUFBLFNBQUE7O01BQ0ksSUFBQSxHQUFjLE9BQUEsQ0FBUSxXQUFSO01BQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxXQUFSO01BQ2QsR0FBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSO01BQ2QsQ0FBQSxDQUFFLEtBQUYsQ0FBQSxHQUFjLE9BQWQsRUFKSjs7TUFPSSxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFBLENBQWQsRUFQaEI7O01BVUksZUFBQSxHQUFrQixRQUFBLENBQUMsQ0FBRSxLQUFBLEdBQVEsQ0FBVixJQUFjLENBQUEsQ0FBZixDQUFBO0FBQ3RCLFlBQUEsS0FBQSxFQUFBLFlBQUEsRUFBQSxZQUFBLEVBQUEsSUFBQTs7UUFDTSxJQUFBLEdBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQkFBQSxDQUFrQjtVQUFFLEtBQUEsRUFBTyxLQUFBLEdBQVE7UUFBakIsQ0FBbEIsQ0FBYjtBQUVSLGVBQUEsSUFBQTtBQUVFOzs7WUFDRSxZQUFBLEdBQWdCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFnQixjQUFoQjtZQUNoQixZQUFBLEdBQWdCLE9BQUEsQ0FBUSxZQUFSO0FBQ2hCLGtCQUhGO1dBSUEsY0FBQTtZQUFNO1lBQ0osSUFBbUIsS0FBSyxDQUFDLElBQU4sS0FBYyxrQkFBakM7Y0FBQSxNQUFNLE1BQU47YUFERjs7VUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiO1FBUlQsQ0FITjs7QUFhTSxlQUFPLENBQUUsSUFBRixFQUFRLFlBQVIsRUFBc0IsWUFBdEI7TUFkUyxFQVZ0Qjs7TUEyQkksWUFBQSxHQUFlLFFBQUEsQ0FBQyxDQUFFLEtBQUEsR0FBUSxDQUFWLElBQWMsQ0FBQSxDQUFmLENBQUE7QUFDbkIsWUFBQSxTQUFBLEVBQUE7UUFBTSxXQUFBLEdBQWlCLEtBQUEsR0FBUSxFQUFYLEdBQW1CLEVBQW5CLEdBQTJCO1FBQ3pDLFNBQUEsR0FBYyxJQUFJLENBQUMsWUFBTCxDQUFrQixHQUFsQjtBQUNkLGVBQU8sU0FBUyxDQUFFLEtBQUY7TUFISCxFQTNCbkI7O01BaUNJLGlCQUFBLEdBQW9CLFFBQUEsQ0FBQyxDQUFFLEtBQUEsR0FBUSxDQUFWLElBQWMsQ0FBQSxDQUFmLENBQUE7QUFDeEIsWUFBQTtRQUFNLFFBQUEsR0FBVyxZQUFBLENBQWE7VUFBRSxLQUFBLEVBQU8sS0FBQSxHQUFRO1FBQWpCLENBQWI7UUFDWCxLQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBcEIsQ0FBK0IsU0FBL0IsQ0FBUDtVQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSxrREFBQSxDQUFBLENBQXFELFFBQVEsQ0FBQyxVQUE5RCxDQUFBLENBQVYsRUFEUjs7QUFFQSxlQUFPLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFFBQVEsQ0FBQyxVQUEzQjtNQUpXLEVBakN4Qjs7TUF3Q0ksU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtBQUNaLGFBQU8sT0FBQSxHQUFVLENBQUUsWUFBRixFQUFnQixpQkFBaEIsRUFBbUMsZUFBbkMsRUFBb0QsU0FBcEQ7SUEzQ0c7RUFBdEIsRUFWRjs7O0VBeURBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLHVCQUE5QjtBQXpEQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQ0FMTFNJVEVfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9nZXRfY2FsbHNpdGU6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgUEFUSCAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgVVRJTCAgICAgICAgPSByZXF1aXJlICdub2RlOnV0aWwnXG4gICAgVVJMICAgICAgICAgPSByZXF1aXJlICdub2RlOnVybCdcbiAgICB7IGRlYnVnLCAgfSA9IGNvbnNvbGVcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIHt9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2FwcF9kZXRhaWxzID0gKHsgZGVsdGEgPSAxIH09e30pIC0+XG4gICAgICAjIGNhbGxzaXRlID0gZ2V0X2NhbGxzaXRlIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgcGF0aCAgPSBQQVRILmRpcm5hbWUgZ2V0X2NhbGxzaXRlX3BhdGggeyBkZWx0YTogZGVsdGEgKyAxLCB9XG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjIGJyZWFrXG4gICAgICAgIHRyeVxuICAgICAgICAgIHBhY2thZ2VfcGF0aCAgPSBQQVRILmpvaW4gcGF0aCwgJ3BhY2thZ2UuanNvbidcbiAgICAgICAgICBwYWNrYWdlX2pzb24gID0gcmVxdWlyZSBwYWNrYWdlX3BhdGhcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvci5jb2RlIGlzICdNT0RVTEVfTk9UX0ZPVU5EJ1xuICAgICAgICBwYXRoID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICByZXR1cm4geyBwYXRoLCBwYWNrYWdlX3BhdGgsIHBhY2thZ2VfanNvbiwgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jYWxsc2l0ZSA9ICh7IGRlbHRhID0gMSB9PXt9KSAtPlxuICAgICAgZnJhbWVfY291bnQgPSBpZiBkZWx0YSA8IDEwIHRoZW4gMTAgZWxzZSAyMDBcbiAgICAgIGNhbGxzaXRlcyAgID0gVVRJTC5nZXRDYWxsU2l0ZXMgMjAwXG4gICAgICByZXR1cm4gY2FsbHNpdGVzWyBkZWx0YSBdXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2NhbGxzaXRlX3BhdGggPSAoeyBkZWx0YSA9IDEgfT17fSkgLT5cbiAgICAgIGNhbGxzaXRlID0gZ2V0X2NhbGxzaXRlIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgdW5sZXNzIGNhbGxzaXRlLnNjcmlwdE5hbWUuc3RhcnRzV2l0aCAnZmlsZTovLydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IHVuYWJsZSB0byBnZXQgcGF0aCBmb3IgY2FsbHNpdGUuc2NyaXB0TmFtZTogI3tjYWxsc2l0ZS5zY3JpcHROYW1lfVwiXG4gICAgICByZXR1cm4gVVJMLmZpbGVVUkxUb1BhdGggY2FsbHNpdGUuc2NyaXB0TmFtZVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgaW50ZXJuYWxzXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9jYWxsc2l0ZSwgZ2V0X2NhbGxzaXRlX3BhdGgsIGdldF9hcHBfZGV0YWlscywgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBVTlNUQUJMRV9DQUxMU0lURV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-callsite-brics.coffee