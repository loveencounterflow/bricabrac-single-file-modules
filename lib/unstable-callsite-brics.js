(function() {
  'use strict';
  var UNSTABLE_CALLSITE_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_CALLSITE_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_get_callsite: function() {
      var URL, UTIL, debug, exports, get_callsite, get_callsite_path, internals;
      //=========================================================================================================
      UTIL = require('node:util');
      URL = require('node:url');
      ({debug} = console);
      //---------------------------------------------------------------------------------------------------------
      internals = {};
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
        var R;
        R = (get_callsite({
          delta: delta + 1
        })).scriptName;
        if (R.startsWith('file://')) {
          R = URL.fileURLToPath(R);
        }
        return R;
      };
      //=========================================================================================================
      internals = Object.freeze(internals);
      return exports = {get_callsite, get_callsite_path, internals};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_get_app_details: function() {
      var CS, PATH, URL, UTIL, debug, exports, get_app_details, get_bricabrac_cfg, internals, misfit, require_from_app_folder;
      //=========================================================================================================
      PATH = require('node:path');
      UTIL = require('node:util');
      URL = require('node:url');
      ({debug} = console);
      misfit = Symbol('misfit');
      CS = UNSTABLE_CALLSITE_BRICS.require_get_callsite();
      //---------------------------------------------------------------------------------------------------------
      internals = {misfit};
      //---------------------------------------------------------------------------------------------------------
      get_app_details = function({delta = 1} = {}) {
        var error, name, package_json, package_path, path, version;
        // callsite = get_callsite { delta: delta + 1, }
        path = PATH.dirname(CS.get_callsite_path({
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
      require_from_app_folder = function({delta = 1, path} = {}) {
        var abspath, app;
        if ((typeof path) !== 'string') {
          throw new Error(`Ω___3 expected path to be a text, got ${path}`);
        }
        app = get_app_details({
          delta: delta + 1
        });
        abspath = PATH.resolve(PATH.join(app.path, path));
        return require(abspath);
      };
      //---------------------------------------------------------------------------------------------------------
      get_bricabrac_cfg = function({delta = 1, path = 'bricabrac.cfg.js', fallback = misfit} = {}) {
        var R, abspath, app, error;
        app = get_app_details({
          delta: delta + 1
        });
        abspath = PATH.resolve(PATH.join(app.path, path));
        try {
          R = require(abspath);
        } catch (error1) {
          error = error1;
          if (error.code !== 'MODULE_NOT_FOUND') {
            throw error;
          }
          if (fallback === misfit) {
            throw error;
          }
          return fallback;
        }
        R = {app, ...R};
        //.......................................................................................................
        /* TAINT use proper templates for default values */
        if (R.datastore != null) {
          R.datastore.filename = `${R.datastore.name}.sqlite`;
          R.datastore.path = PATH.resolve(PATH.join(app.path, R.datastore.filename));
        }
        //.......................................................................................................
        return R;
      };
      //=========================================================================================================
      internals = Object.freeze(internals);
      return exports = {get_app_details, require_from_app_folder, get_bricabrac_cfg, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_CALLSITE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWNhbGxzaXRlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx1QkFBQTs7Ozs7RUFLQSx1QkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxvQkFBQSxFQUFzQixRQUFBLENBQUEsQ0FBQTtBQUV4QixVQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEVBQUEsaUJBQUEsRUFBQSxTQUFBOztNQUNJLElBQUEsR0FBYyxPQUFBLENBQVEsV0FBUjtNQUNkLEdBQUEsR0FBYyxPQUFBLENBQVEsVUFBUjtNQUNkLENBQUEsQ0FBRSxLQUFGLENBQUEsR0FBYyxPQUFkLEVBSEo7O01BTUksU0FBQSxHQUFZLENBQUEsRUFOaEI7O01BU0ksWUFBQSxHQUFlLFFBQUEsQ0FBQyxDQUFFLEtBQUEsR0FBUSxDQUFWLEVBQWEsWUFBQSxHQUFlLElBQTVCLElBQW9DLENBQUEsQ0FBckMsQ0FBQTtBQUNuQixZQUFBLFNBQUEsRUFBQTtRQUFNLFdBQUEsR0FBaUIsS0FBQSxHQUFRLEVBQVgsR0FBbUIsRUFBbkIsR0FBMkI7UUFDekMsU0FBQSxHQUFjLElBQUksQ0FBQyxZQUFMLENBQWtCLFdBQWxCLEVBQStCO1VBQUUsU0FBQSxFQUFXO1FBQWIsQ0FBL0I7QUFDZCxlQUFPLFNBQVMsQ0FBRSxLQUFGO01BSEgsRUFUbkI7O01BZUksaUJBQUEsR0FBb0IsUUFBQSxDQUFDLENBQUUsS0FBQSxHQUFRLENBQVYsSUFBYyxDQUFBLENBQWYsQ0FBQTtBQUN4QixZQUFBO1FBQU0sQ0FBQSxHQUFJLENBQUUsWUFBQSxDQUFhO1VBQUUsS0FBQSxFQUFPLEtBQUEsR0FBUTtRQUFqQixDQUFiLENBQUYsQ0FBc0MsQ0FBQztRQUMzQyxJQUEyQixDQUFDLENBQUMsVUFBRixDQUFhLFNBQWIsQ0FBM0I7VUFBQSxDQUFBLEdBQUksR0FBRyxD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QUksQ0FBQyxJQUFMLENBQVUsR0FBRyxDQUFDLElBQWQsRUFBb0IsSUFBcEIsQ0FBYjtBQUNWO1VBQ0UsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxPQUFSLEVBRE47U0FFQSxjQUFBO1VBQU07VUFDSixJQUFtQixLQUFLLENBQUMsSUFBTixLQUFjLGtCQUFqQztZQUFBLE1BQU0sTUFBTjs7VUFDQSxJQUFlLFFBQUEsS0FBWSxNQUEzQjtZQUFBLE1BQU0sTUFBTjs7QUFDQSxpQkFBTyxTQUhUOztRQUlBLENBQUEsR0FBSSxDQUFFLEdBQUYsRUFBTyxHQUFBLENBQVAsRUFSVjs7O1FBV00sSUFBRyxtQkFBSDtVQUNFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBWixHQUF3QixDQUFBLENBQUEsQ0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxPQUFBO1VBQ3hCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBWixHQUF3QixJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBRyxDQUFDLElBQWQsRUFBb0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFoQyxDQUFiLEVBRjFCO1NBWE47O0FBZU0sZUFBTztNQWhCVyxFQXZDeEI7O01BMERJLFNBQUEsR0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQ7QUFDWixhQUFPLE9BQUEsR0FBVSxDQUNmLGVBRGUsRUFDRSx1QkFERixFQUMyQixpQkFEM0IsRUFDOEMsU0FEOUM7SUE3RE07RUE5QnpCLEVBVkY7OztFQTBHQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4Qix1QkFBOUI7QUExR0EiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblVOU1RBQkxFX0NBTExTSVRFX0JSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfZ2V0X2NhbGxzaXRlOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIFVUSUwgICAgICAgID0gcmVxdWlyZSAnbm9kZTp1dGlsJ1xuICAgIFVSTCAgICAgICAgID0gcmVxdWlyZSAnbm9kZTp1cmwnXG4gICAgeyBkZWJ1ZywgIH0gPSBjb25zb2xlXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0ge31cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY2FsbHNpdGUgPSAoeyBkZWx0YSA9IDEsIHNvdXJjZW1hcHBlZCA9IHRydWUsIH09e30pIC0+XG4gICAgICBmcmFtZV9jb3VudCA9IGlmIGRlbHRhIDwgMTAgdGhlbiAxMCBlbHNlIDIwMFxuICAgICAgY2FsbHNpdGVzICAgPSBVVElMLmdldENhbGxTaXRlcyBmcmFtZV9jb3VudCwgeyBzb3VyY2VNYXA6IHNvdXJjZW1hcHBlZCwgfVxuICAgICAgcmV0dXJuIGNhbGxzaXRlc1sgZGVsdGEgXVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jYWxsc2l0ZV9wYXRoID0gKHsgZGVsdGEgPSAxIH09e30pIC0+XG4gICAgICBSID0gKCBnZXRfY2FsbHNpdGUgeyBkZWx0YTogZGVsdGEgKyAxLCB9ICkuc2NyaXB0TmFtZVxuICAgICAgUiA9IFVSTC5maWxlVVJMVG9QYXRoIFIgaWYgUi5zdGFydHNXaXRoICdmaWxlOi8vJ1xuICAgICAgcmV0dXJuIFJcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgZ2V0X2NhbGxzaXRlLCBnZXRfY2FsbHNpdGVfcGF0aCwgaW50ZXJuYWxzLCB9XG5cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9nZXRfYXBwX2RldGFpbHM6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgUEFUSCAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgVVRJTCAgICAgICAgPSByZXF1aXJlICdub2RlOnV0aWwnXG4gICAgVVJMICAgICAgICAgPSByZXF1aXJlICdub2RlOnVybCdcbiAgICB7IGRlYnVnLCAgfSA9IGNvbnNvbGVcbiAgICBtaXNmaXQgICAgICA9IFN5bWJvbCAnbWlzZml0J1xuICAgIENTICAgICAgICAgID0gVU5TVEFCTEVfQ0FMTFNJVEVfQlJJQ1MucmVxdWlyZV9nZXRfY2FsbHNpdGUoKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGludGVybmFscyA9IHsgbWlzZml0LCB9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2FwcF9kZXRhaWxzID0gKHsgZGVsdGEgPSAxIH09e30pIC0+XG4gICAgICAjIGNhbGxzaXRlID0gZ2V0X2NhbGxzaXRlIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgcGF0aCAgPSBQQVRILmRpcm5hbWUgQ1MuZ2V0X2NhbGxzaXRlX3BhdGggeyBkZWx0YTogZGVsdGEgKyAxLCB9XG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjIGJyZWFrXG4gICAgICAgIHRyeVxuICAgICAgICAgIHBhY2thZ2VfcGF0aCAgPSBQQVRILmpvaW4gcGF0aCwgJ3BhY2thZ2UuanNvbidcbiAgICAgICAgICBwYWNrYWdlX2pzb24gID0gcmVxdWlyZSBwYWNrYWdlX3BhdGhcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvci5jb2RlIGlzICdNT0RVTEVfTk9UX0ZPVU5EJ1xuICAgICAgICBwYXRoID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB7IG5hbWUsXG4gICAgICAgIHZlcnNpb24sICB9ID0gcGFja2FnZV9qc29uXG4gICAgICByZXR1cm4geyBuYW1lLCB2ZXJzaW9uLCBwYXRoLCBwYWNrYWdlX3BhdGgsIHBhY2thZ2VfanNvbiwgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlcXVpcmVfZnJvbV9hcHBfZm9sZGVyID0gKHsgZGVsdGEgPSAxLCBwYXRoLCB9PXt9KSAtPlxuICAgICAgdW5sZXNzICggdHlwZW9mIHBhdGggKSBpcyAnc3RyaW5nJ1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzMgZXhwZWN0ZWQgcGF0aCB0byBiZSBhIHRleHQsIGdvdCAje3BhdGh9XCJcbiAgICAgIGFwcCAgICAgPSBnZXRfYXBwX2RldGFpbHMgeyBkZWx0YTogZGVsdGEgKyAxLCB9XG4gICAgICBhYnNwYXRoID0gUEFUSC5yZXNvbHZlIFBBVEguam9pbiBhcHAucGF0aCwgcGF0aFxuICAgICAgcmV0dXJuIHJlcXVpcmUgYWJzcGF0aFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9icmljYWJyYWNfY2ZnID0gKHsgZGVsdGEgPSAxLCBwYXRoID0gJ2JyaWNhYnJhYy5jZmcuanMnLCBmYWxsYmFjayA9IG1pc2ZpdCwgfT17fSkgLT5cbiAgICAgIGFwcCAgICAgPSBnZXRfYXBwX2RldGFpbHMgeyBkZWx0YTogZGVsdGEgKyAxLCB9XG4gICAgICBhYnNwYXRoID0gUEFUSC5yZXNvbHZlIFBBVEguam9pbiBhcHAucGF0aCwgcGF0aFxuICAgICAgdHJ5XG4gICAgICAgIFIgPSByZXF1aXJlIGFic3BhdGhcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvci5jb2RlIGlzICdNT0RVTEVfTk9UX0ZPVU5EJ1xuICAgICAgICB0aHJvdyBlcnJvciBpZiBmYWxsYmFjayBpcyBtaXNmaXRcbiAgICAgICAgcmV0dXJuIGZhbGxiYWNrXG4gICAgICBSID0geyBhcHAsIFIuLi4sIH1cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB0ZW1wbGF0ZXMgZm9yIGRlZmF1bHQgdmFsdWVzICMjI1xuICAgICAgaWYgUi5kYXRhc3RvcmU/XG4gICAgICAgIFIuZGF0YXN0b3JlLmZpbGVuYW1lICA9IFwiI3tSLmRhdGFzdG9yZS5uYW1lfS5zcWxpdGVcIlxuICAgICAgICBSLmRhdGFzdG9yZS5wYXRoICAgICAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIGFwcC5wYXRoLCBSLmRhdGFzdG9yZS5maWxlbmFtZVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHJldHVybiBSXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSBpbnRlcm5hbHNcbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIGdldF9hcHBfZGV0YWlscywgcmVxdWlyZV9mcm9tX2FwcF9mb2xkZXIsIGdldF9icmljYWJyYWNfY2ZnLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0NBTExTSVRFX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-callsite-brics.coffee