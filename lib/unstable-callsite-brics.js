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
      get_callsite = function({delta = 1, sourcemapped = true} = {}) {
        var callsites, frame_count;
        frame_count = delta < 10 ? 10 : 200;
        callsites = UTIL.getCallSites(frame_count, {
          sourceMap: sourcemapped
        });
        return callsites[delta];
      };
      //---------------------------------------------------------------------------------------------------------
      get_callsite_path = function({delta = 1} = {}) {
        var callsite, error;
        callsite = get_callsite({
          delta: delta + 1
        });
        if (!callsite.scriptName.startsWith('file://')) {
          throw new Error(`Ω___2 unable to get path for callsite.scriptName: ${callsite.scriptName}`);
        }
        try {
          return URL.fileURLToPath(callsite.scriptName);
        } catch (error1) {
          error = error1;
          throw new Error(`Ω___1 when trying to resolve file URL ${callsite.scriptName}, an error was thrown`, {
            cause: error
          });
        }
      };
      //---------------------------------------------------------------------------------------------------------
      require_from_app_folder = function({delta = 1, path} = {}) {
        var abspath, details;
        if ((typeof path) !== 'string') {
          throw new Error(`Ω___3 expected path to be a text, got ${path}`);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWNhbGxzaXRlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx1QkFBQTs7Ozs7RUFLQSx1QkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxvQkFBQSxFQUFzQixRQUFBLENBQUEsQ0FBQTtBQUV4QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsZUFBQSxFQUFBLFlBQUEsRUFBQSxpQkFBQSxFQUFBLFNBQUEsRUFBQSxxQkFBQSxFQUFBLHVCQUFBOztNQUNJLElBQUEsR0FBYyxPQUFBLENBQVEsV0FBUjtNQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsV0FBUjtNQUNkLEdBQUEsR0FBYyxPQUFBLENBQVEsVUFBUjtNQUNkLENBQUEsQ0FBRSxLQUFGLENBQUEsR0FBYyxPQUFkLEVBSko7O01BT0ksU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBQSxDQUFkLEVBUGhCOztNQVVJLGVBQUEsR0FBa0IsUUFBQSxDQUFDLENBQUUsS0FBQSxHQUFRLENBQVYsSUFBYyxDQUFBLENBQWYsQ0FBQTtBQUN0QixZQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsWUFBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7UUFDTSxJQUFBLEdBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQkFBQSxDQUFrQjtVQUFFLEtBQUEsRUFBTyxLQUFBLEdBQVE7UUFBakIsQ0FBbEIsQ0FBYjtBQUVSLGVBQUEsSUFBQTtBQUVFOzs7WUFDRSxZQUFBLEdBQWdCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFnQixjQUFoQjtZQUNoQixZQUFBLEdBQWdCLE9BQUEsQ0FBUSxZQUFSO0FBQ2hCLGtCQUhGO1dBSUEsY0FBQTtZQUFNO1lBQ0osSUFBbUIsS0FBSyxDQUFDLElBQU4sS0FBYyxrQkFBakM7Y0FBQSxNQUFNLE1BQU47YUFERjs7VUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiO1FBUlQsQ0FITjs7UUFhTSxDQUFBLENBQUUsSUFBRixFQUNFLE9BREYsQ0FBQSxHQUNnQixZQURoQjtBQUVBLGVBQU8sQ0FBRSxJQUFGLEVBQVEsT0FBUixFQUFpQixJQUFqQixFQUF1QixZQUF2QixFQUFxQyxZQUFyQztNQWhCUyxFQVZ0Qjs7TUE2QkksWUFBQSxHQUFlLFFBQUEsQ0FBQyxDQUFFLEtBQUEsR0FBUSxDQUFWLEVBQWEsWUFBQSxHQUFlLElBQTVCLElBQW9DLENBQUEsQ0FBckMsQ0FBQTtBQUNuQixZQUFBLFNBQUEsRUFBQTtRQUFNLFdBQUEsR0FBaUIsS0FBQSxHQUFRLEVBQVgsR0FBbUIsRUFBbkIsR0FBMkI7UUFDekMsU0FBQSxHQUFjLElBQUksQ0FBQyxZQUFMLENBQWtCLFdBQWxCLEVBQStCO1VBQUUsU0FBQSxFQUFXO1FBQWIsQ0FBL0I7QUFDZCxlQUFPLFNBQVMsQ0FBRSxLQUFGO01BSEgsRUE3Qm5COztNQW1DSSxpQkFBQSxHQUFvQixRQUFBLENBQUMsQ0FBRSxLQUFBLEdBQVEsQ0FBVixJQUFjLENBQUEsQ0FBZixDQUFBO0FBQ3hCLFlBQUEsUUFBQSxFQUFBO1FBQU0sUUFBQSxHQUFXLFlBQUEsQ0FBYTtVQUFFLEtBQUEsRUFBTyxLQUFBLEdBQVE7UUFBakIsQ0FBYjtRQUNYLEtBQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFwQixDQUErQixTQUEvQixDQUFQO1VBQ0UsTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLGtEQUFBLENBQUEsQ0FBcUQsUUFBUSxDQUFDLFVBQTlELENBQUEsQ0FBVixFQURSOztBQUVBO0FBQ0UsaUJBQU8sR0FBRyxDQUFDLGFBQUosQ0FBa0IsUUFBUSxDQUFDLFVBQTNCLEVBRFQ7U0FFQSxjQUFBO1VBQU07VUFDSixNQUFNLElBQUksS0FBSixDQUFVLENBQUEsc0NBQUEsQ0FBQSxDQUF5QyxRQUFRLENBQUMsVUFBbEQsQ0FBQSxxQkFBQSxDQUFWLEVBQ0o7WUFBRSxLQUFBLEVBQU87VUFBVCxDQURJLEVBRFI7O01BTmtCLEVBbkN4Qjs7TUE4Q0ksdUJBQUEsR0FBMEIsUUFBQSxDQUFDLENBQUUsS0FBQSxHQUFRLENBQVYsRUFBYSxJQUFiLElBQXFCLENBQUEsQ0FBdEIsQ0FBQTtBQUM5QixZQUFBLE9BQUEsRUFBQTtRQUFNLElBQU8sQ0FBRSxPQUFPLElBQVQsQ0FBQSxLQUFtQixRQUExQjtVQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSxzQ0FBQSxDQUFBLENBQXlDLElBQXpDLENBQUEsQ0FBVixFQURSOztRQUVBLE9BQUEsR0FBVSxlQUFBLENBQWdCO1VBQUUsS0FBQSxFQUFPLEtBQUEsR0FBUTtRQUFqQixDQUFoQjtRQUNWLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBTyxDQUFDLElBQWxCLEVBQXdCLElBQXhCLENBQWI7QUFDVixlQUFPLE9BQUEsQ0FBUSxPQUFSO01BTGlCLEVBOUM5Qjs7TUFzREkscUJBQUEsR0FBd0IsUUFBQSxDQUFDLENBQUUsS0FBQSxHQUFRLENBQVYsSUFBZSxDQUFBLENBQWhCLENBQUE7QUFDdEIsZUFBTyx1QkFBQSxDQUF3QjtVQUFFLEtBQUEsRUFBTyxLQUFBLEdBQVEsQ0FBakI7VUFBb0IsSUFBQSxFQUFNO1FBQTFCLENBQXhCO01BRGUsRUF0RDVCOztNQTBESSxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkO0FBQ1osYUFBTyxPQUFBLEdBQVUsQ0FDZixZQURlLEVBQ0QsaUJBREMsRUFFZixlQUZlLEVBR2YsdUJBSGUsRUFHVSxxQkFIVixFQUlmLFNBSmU7SUE3REc7RUFBdEIsRUFWRjs7O0VBK0VBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLHVCQUE5QjtBQS9FQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQ0FMTFNJVEVfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9nZXRfY2FsbHNpdGU6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgUEFUSCAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgVVRJTCAgICAgICAgPSByZXF1aXJlICdub2RlOnV0aWwnXG4gICAgVVJMICAgICAgICAgPSByZXF1aXJlICdub2RlOnVybCdcbiAgICB7IGRlYnVnLCAgfSA9IGNvbnNvbGVcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIHt9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2FwcF9kZXRhaWxzID0gKHsgZGVsdGEgPSAxIH09e30pIC0+XG4gICAgICAjIGNhbGxzaXRlID0gZ2V0X2NhbGxzaXRlIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgcGF0aCAgPSBQQVRILmRpcm5hbWUgZ2V0X2NhbGxzaXRlX3BhdGggeyBkZWx0YTogZGVsdGEgKyAxLCB9XG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjIGJyZWFrXG4gICAgICAgIHRyeVxuICAgICAgICAgIHBhY2thZ2VfcGF0aCAgPSBQQVRILmpvaW4gcGF0aCwgJ3BhY2thZ2UuanNvbidcbiAgICAgICAgICBwYWNrYWdlX2pzb24gID0gcmVxdWlyZSBwYWNrYWdlX3BhdGhcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvci5jb2RlIGlzICdNT0RVTEVfTk9UX0ZPVU5EJ1xuICAgICAgICBwYXRoID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB7IG5hbWUsXG4gICAgICAgIHZlcnNpb24sICB9ID0gcGFja2FnZV9qc29uXG4gICAgICByZXR1cm4geyBuYW1lLCB2ZXJzaW9uLCBwYXRoLCBwYWNrYWdlX3BhdGgsIHBhY2thZ2VfanNvbiwgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jYWxsc2l0ZSA9ICh7IGRlbHRhID0gMSwgc291cmNlbWFwcGVkID0gdHJ1ZSwgfT17fSkgLT5cbiAgICAgIGZyYW1lX2NvdW50ID0gaWYgZGVsdGEgPCAxMCB0aGVuIDEwIGVsc2UgMjAwXG4gICAgICBjYWxsc2l0ZXMgICA9IFVUSUwuZ2V0Q2FsbFNpdGVzIGZyYW1lX2NvdW50LCB7IHNvdXJjZU1hcDogc291cmNlbWFwcGVkLCB9XG4gICAgICByZXR1cm4gY2FsbHNpdGVzWyBkZWx0YSBdXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2NhbGxzaXRlX3BhdGggPSAoeyBkZWx0YSA9IDEgfT17fSkgLT5cbiAgICAgIGNhbGxzaXRlID0gZ2V0X2NhbGxzaXRlIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgdW5sZXNzIGNhbGxzaXRlLnNjcmlwdE5hbWUuc3RhcnRzV2l0aCAnZmlsZTovLydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18yIHVuYWJsZSB0byBnZXQgcGF0aCBmb3IgY2FsbHNpdGUuc2NyaXB0TmFtZTogI3tjYWxsc2l0ZS5zY3JpcHROYW1lfVwiXG4gICAgICB0cnlcbiAgICAgICAgcmV0dXJuIFVSTC5maWxlVVJMVG9QYXRoIGNhbGxzaXRlLnNjcmlwdE5hbWVcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fMSB3aGVuIHRyeWluZyB0byByZXNvbHZlIGZpbGUgVVJMICN7Y2FsbHNpdGUuc2NyaXB0TmFtZX0sIGFuIGVycm9yIHdhcyB0aHJvd25cIiwgXFxcbiAgICAgICAgICB7IGNhdXNlOiBlcnJvciwgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlcXVpcmVfZnJvbV9hcHBfZm9sZGVyID0gKHsgZGVsdGEgPSAxLCBwYXRoLCB9PXt9KSAtPlxuICAgICAgdW5sZXNzICggdHlwZW9mIHBhdGggKSBpcyAnc3RyaW5nJ1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzMgZXhwZWN0ZWQgcGF0aCB0byBiZSBhIHRleHQsIGdvdCAje3BhdGh9XCJcbiAgICAgIGRldGFpbHMgPSBnZXRfYXBwX2RldGFpbHMgeyBkZWx0YTogZGVsdGEgKyAxLCB9XG4gICAgICBhYnNwYXRoID0gUEFUSC5yZXNvbHZlIFBBVEguam9pbiBkZXRhaWxzLnBhdGgsIHBhdGhcbiAgICAgIHJldHVybiByZXF1aXJlIGFic3BhdGhcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXF1aXJlX2JyaWNhYnJhY19jZmcgPSAoeyBkZWx0YSA9IDEsIH09e30pIC0+XG4gICAgICByZXR1cm4gcmVxdWlyZV9mcm9tX2FwcF9mb2xkZXIgeyBkZWx0YTogZGVsdGEgKyAxLCBwYXRoOiAnYnJpY2FicmFjLmNmZy5qcycsIH1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgZ2V0X2NhbGxzaXRlLCBnZXRfY2FsbHNpdGVfcGF0aCxcbiAgICAgIGdldF9hcHBfZGV0YWlscyxcbiAgICAgIHJlcXVpcmVfZnJvbV9hcHBfZm9sZGVyLCByZXF1aXJlX2JyaWNhYnJhY19jZmcsXG4gICAgICBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0NBTExTSVRFX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-callsite-brics.coffee