(function() {
  'use strict';
  var UNSTABLE_CALLSITE_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_CALLSITE_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_get_callsite: function() {
      var PATH, URL, UTIL, debug, exports, get_app_details, get_callsite, get_callsite_path, internals, require_bricabrac_cfg, require_from_app_folder;
      //=========================================================================================================
      PATH = require('node:path');
      UTIL = require('node:util');
      URL = require('node:url');
      ({debug} = console);
      //---------------------------------------------------------------------------------------------------------
      internals = Object.freeze({});
      //---------------------------------------------------------------------------------------------------------
      get_app_details = function({delta = 1} = {}) {
        var error, name, package_json, package_path, path, version;
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
        ({name, version} = package_json);
        return {name, version, path, package_path, package_json};
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
          throw new Error(`Ω___1 unable to get path for callsite.scriptName: ${callsite.scriptName}`);
        }
        return URL.fileURLToPath(callsite.scriptName);
      };
      //---------------------------------------------------------------------------------------------------------
      require_from_app_folder = function({delta = 1, path} = {}) {
        var abspath, details;
        if ((typeof path) !== 'string') {
          throw new Error(`Ω___2 expected path to be a text, got ${path}`);
        }
        details = get_app_details({
          delta: delta + 1
        });
        abspath = PATH.resolve(PATH.join(details.path, path));
        return require(abspath);
      };
      //---------------------------------------------------------------------------------------------------------
      require_bricabrac_cfg = function({delta = 1} = {}) {
        return require_from_app_folder({
          delta: delta + 1,
          path: 'bricabrac.cfg.js'
        });
      };
      //=========================================================================================================
      internals = Object.freeze(internals);
      return exports = {get_callsite, get_callsite_path, get_app_details, require_from_app_folder, require_bricabrac_cfg, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_CALLSITE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWNhbGxzaXRlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx1QkFBQTs7Ozs7RUFLQSx1QkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxvQkFBQSxFQUFzQixRQUFBLENBQUEsQ0FBQTtBQUV4QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsZUFBQSxFQUFBLFlBQUEsRUFBQSxpQkFBQSxFQUFBLFNBQUEsRUFBQSxxQkFBQSxFQUFBLHVCQUFBOztNQUNJLElBQUEsR0FBYyxPQUFBLENBQVEsV0FBUjtNQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsV0FBUjtNQUNkLEdBQUEsR0FBYyxPQUFBLENBQVEsVUFBUjtNQUNkLENBQUEsQ0FBRSxLQUFGLENBQUEsR0FBYyxPQUFkLEVBSko7O01BT0ksU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBQSxDQUFkLEVBUGhCOztNQVVJLGVBQUEsR0FBa0IsUUFBQSxDQUFDLENBQUUsS0FBQSxHQUFRLENBQVYsSUFBYyxDQUFBLENBQWYsQ0FBQTtBQUN0QixZQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsWUFBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7UUFDTSxJQUFBLEdBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQkFBQSxDQUFrQjtVQUFFLEtBQUEsRUFBTyxLQUFBLEdBQVE7UUFBakIsQ0FBbEIsQ0FBYjtBQUVSLGVBQUEsSUFBQTtBQUVFOzs7WUFDRSxZQUFBLEdBQWdCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFnQixjQUFoQjtZQUNoQixZQUFBLEdBQWdCLE9BQUEsQ0FBUSxZQUFSO0FBQ2hCLGtCQUhGO1dBSUEsY0FBQTtZQUFNO1lBQ0osSUFBbUIsS0FBSyxDQUFDLElBQU4sS0FBYyxrQkFBakM7Y0FBQSxNQUFNLE1BQU47YUFERjs7VUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiO1FBUlQsQ0FITjs7UUFhTSxDQUFBLENBQUUsSUFBRixFQUNFLE9BREYsQ0FBQSxHQUNnQixZQURoQjtBQUVBLGVBQU8sQ0FBRSxJQUFGLEVBQVEsT0FBUixFQUFpQixJQUFqQixFQUF1QixZQUF2QixFQUFxQyxZQUFyQztNQWhCUyxFQVZ0Qjs7TUE2QkksWUFBQSxHQUFlLFFBQUEsQ0FBQyxDQUFFLEtBQUEsR0FBUSxDQUFWLElBQWMsQ0FBQSxDQUFmLENBQUE7QUFDbkIsWUFBQSxTQUFBLEVBQUE7UUFBTSxXQUFBLEdBQWlCLEtBQUEsR0FBUSxFQUFYLEdBQW1CLEVBQW5CLEdBQTJCO1FBQ3pDLFNBQUEsR0FBYyxJQUFJLENBQUMsWUFBTCxDQUFrQixHQUFsQjtBQUNkLGVBQU8sU0FBUyxDQUFFLEtBQUY7TUFISCxFQTdCbkI7O01BbUNJLGlCQUFBLEdBQW9CLFFBQUEsQ0FBQyxDQUFFLEtBQUEsR0FBUSxDQUFWLElBQWMsQ0FBQSxDQUFmLENBQUE7QUFDeEIsWUFBQTtRQUFNLFFBQUEsR0FBVyxZQUFBLENBQWE7VUFBRSxLQUFBLEVBQU8sS0FBQSxHQUFRO1FBQWpCLENBQWI7UUFDWCxLQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBcEIsQ0FBK0IsU0FBL0IsQ0FBUDtVQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSxrREFBQSxDQUFBLENBQXFELFFBQVEsQ0FBQyxVQUE5RCxDQUFBLENBQVYsRUFEUjs7QUFFQSxlQUFPLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFFBQVEsQ0FBQyxVQUEzQjtNQUpXLEVBbkN4Qjs7TUEwQ0ksdUJBQUEsR0FBMEIsUUFBQSxDQUFDLENBQUUsS0FBQSxHQUFRLENBQVYsRUFBYSxJQUFiLElBQXFCLENBQUEsQ0FBdEIsQ0FBQTtBQUM5QixZQUFBLE9BQUEsRUFBQTtRQUFNLElBQU8sQ0FBRSxPQUFPLElBQVQsQ0FBQSxLQUFtQixRQUExQjtVQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSxzQ0FBQSxDQUFBLENBQXlDLElBQXpDLENBQUEsQ0FBVixFQURSOztRQUVBLE9BQUEsR0FBVSxlQUFBLENBQWdCO1VBQUUsS0FBQSxFQUFPLEtBQUEsR0FBUTtRQUFqQixDQUFoQjtRQUNWLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBTyxDQUFDLElBQWxCLEVBQXdCLElBQXhCLENBQWI7QUFDVixlQUFPLE9BQUEsQ0FBUSxPQUFSO01BTGlCLEVBMUM5Qjs7TUFrREkscUJBQUEsR0FBd0IsUUFBQSxDQUFDLENBQUUsS0FBQSxHQUFRLENBQVYsSUFBZSxDQUFBLENBQWhCLENBQUE7QUFDdEIsZUFBTyx1QkFBQSxDQUF3QjtVQUFFLEtBQUEsRUFBTyxLQUFBLEdBQVEsQ0FBakI7VUFBb0IsSUFBQSxFQUFNO1FBQTFCLENBQXhCO01BRGUsRUFsRDVCOztNQXNESSxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkO0FBQ1osYUFBTyxPQUFBLEdBQVUsQ0FDZixZQURlLEVBQ0QsaUJBREMsRUFFZixlQUZlLEVBR2YsdUJBSGUsRUFHVSxxQkFIVixFQUlmLFNBSmU7SUF6REc7RUFBdEIsRUFWRjs7O0VBMkVBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLHVCQUE5QjtBQTNFQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQ0FMTFNJVEVfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9nZXRfY2FsbHNpdGU6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgUEFUSCAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgVVRJTCAgICAgICAgPSByZXF1aXJlICdub2RlOnV0aWwnXG4gICAgVVJMICAgICAgICAgPSByZXF1aXJlICdub2RlOnVybCdcbiAgICB7IGRlYnVnLCAgfSA9IGNvbnNvbGVcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIHt9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2FwcF9kZXRhaWxzID0gKHsgZGVsdGEgPSAxIH09e30pIC0+XG4gICAgICAjIGNhbGxzaXRlID0gZ2V0X2NhbGxzaXRlIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgcGF0aCAgPSBQQVRILmRpcm5hbWUgZ2V0X2NhbGxzaXRlX3BhdGggeyBkZWx0YTogZGVsdGEgKyAxLCB9XG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjIGJyZWFrXG4gICAgICAgIHRyeVxuICAgICAgICAgIHBhY2thZ2VfcGF0aCAgPSBQQVRILmpvaW4gcGF0aCwgJ3BhY2thZ2UuanNvbidcbiAgICAgICAgICBwYWNrYWdlX2pzb24gID0gcmVxdWlyZSBwYWNrYWdlX3BhdGhcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvci5jb2RlIGlzICdNT0RVTEVfTk9UX0ZPVU5EJ1xuICAgICAgICBwYXRoID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB7IG5hbWUsXG4gICAgICAgIHZlcnNpb24sICB9ID0gcGFja2FnZV9qc29uXG4gICAgICByZXR1cm4geyBuYW1lLCB2ZXJzaW9uLCBwYXRoLCBwYWNrYWdlX3BhdGgsIHBhY2thZ2VfanNvbiwgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jYWxsc2l0ZSA9ICh7IGRlbHRhID0gMSB9PXt9KSAtPlxuICAgICAgZnJhbWVfY291bnQgPSBpZiBkZWx0YSA8IDEwIHRoZW4gMTAgZWxzZSAyMDBcbiAgICAgIGNhbGxzaXRlcyAgID0gVVRJTC5nZXRDYWxsU2l0ZXMgMjAwXG4gICAgICByZXR1cm4gY2FsbHNpdGVzWyBkZWx0YSBdXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2NhbGxzaXRlX3BhdGggPSAoeyBkZWx0YSA9IDEgfT17fSkgLT5cbiAgICAgIGNhbGxzaXRlID0gZ2V0X2NhbGxzaXRlIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgdW5sZXNzIGNhbGxzaXRlLnNjcmlwdE5hbWUuc3RhcnRzV2l0aCAnZmlsZTovLydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18xIHVuYWJsZSB0byBnZXQgcGF0aCBmb3IgY2FsbHNpdGUuc2NyaXB0TmFtZTogI3tjYWxsc2l0ZS5zY3JpcHROYW1lfVwiXG4gICAgICByZXR1cm4gVVJMLmZpbGVVUkxUb1BhdGggY2FsbHNpdGUuc2NyaXB0TmFtZVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlcXVpcmVfZnJvbV9hcHBfZm9sZGVyID0gKHsgZGVsdGEgPSAxLCBwYXRoLCB9PXt9KSAtPlxuICAgICAgdW5sZXNzICggdHlwZW9mIHBhdGggKSBpcyAnc3RyaW5nJ1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzIgZXhwZWN0ZWQgcGF0aCB0byBiZSBhIHRleHQsIGdvdCAje3BhdGh9XCJcbiAgICAgIGRldGFpbHMgPSBnZXRfYXBwX2RldGFpbHMgeyBkZWx0YTogZGVsdGEgKyAxLCB9XG4gICAgICBhYnNwYXRoID0gUEFUSC5yZXNvbHZlIFBBVEguam9pbiBkZXRhaWxzLnBhdGgsIHBhdGhcbiAgICAgIHJldHVybiByZXF1aXJlIGFic3BhdGhcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXF1aXJlX2JyaWNhYnJhY19jZmcgPSAoeyBkZWx0YSA9IDEsIH09e30pIC0+XG4gICAgICByZXR1cm4gcmVxdWlyZV9mcm9tX2FwcF9mb2xkZXIgeyBkZWx0YTogZGVsdGEgKyAxLCBwYXRoOiAnYnJpY2FicmFjLmNmZy5qcycsIH1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgZ2V0X2NhbGxzaXRlLCBnZXRfY2FsbHNpdGVfcGF0aCxcbiAgICAgIGdldF9hcHBfZGV0YWlscyxcbiAgICAgIHJlcXVpcmVfZnJvbV9hcHBfZm9sZGVyLCByZXF1aXJlX2JyaWNhYnJhY19jZmcsXG4gICAgICBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0NBTExTSVRFX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-callsite-brics.coffee