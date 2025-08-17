(function() {
  'use strict';
  var UNSTABLE_CALLSITE_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_CALLSITE_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_get_callsite: function() {
      var PATH, URL, UTIL, debug, exports, get_app_details, get_callsite, get_callsite_path, internals, misfit, require_bricabrac_cfg, require_from_app_folder;
      //=========================================================================================================
      PATH = require('node:path');
      UTIL = require('node:util');
      URL = require('node:url');
      ({debug} = console);
      misfit = Symbol('misfit');
      //---------------------------------------------------------------------------------------------------------
      internals = Object.freeze({misfit});
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
          throw new Error(`Ω___1 unable to get path for callsite.scriptName: ${callsite.scriptName}`);
        }
        try {
          return URL.fileURLToPath(callsite.scriptName);
        } catch (error1) {
          error = error1;
          throw new Error(`Ω___2 when trying to resolve file URL ${callsite.scriptName}, an error was thrown`, {
            cause: error
          });
        }
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
      require_bricabrac_cfg = function({delta = 1, path = 'bricabrac.cfg.js', fallback = misfit} = {}) {
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
      return exports = {get_callsite, get_callsite_path, get_app_details, require_from_app_folder, require_bricabrac_cfg, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_CALLSITE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWNhbGxzaXRlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx1QkFBQTs7Ozs7RUFLQSx1QkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxvQkFBQSxFQUFzQixRQUFBLENBQUEsQ0FBQTtBQUV4QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsZUFBQSxFQUFBLFlBQUEsRUFBQSxpQkFBQSxFQUFBLFNBQUEsRUFBQSxNQUFBLEVBQUEscUJBQUEsRUFBQSx1QkFBQTs7TUFDSSxJQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7TUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7TUFDZCxHQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7TUFDZCxDQUFBLENBQUUsS0FBRixDQUFBLEdBQWMsT0FBZDtNQUNBLE1BQUEsR0FBYyxNQUFBLENBQU8sUUFBUCxFQUxsQjs7TUFRSSxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFFLE1BQUYsQ0FBZCxFQVJoQjs7TUFXSSxlQUFBLEdBQWtCLFFBQUEsQ0FBQyxDQUFFLEtBQUEsR0FBUSxDQUFWLElBQWMsQ0FBQSxDQUFmLENBQUE7QUFDdEIsWUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFlBQUEsRUFBQSxZQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7O1FBQ00sSUFBQSxHQUFRLElBQUksQ0FBQyxPQUFMLENBQWEsaUJBQUEsQ0FBa0I7VUFBRSxLQUFBLEVBQU8sS0FBQSxHQUFRO1FBQWpCLENBQWxCLENBQWI7QUFFUixlQUFBLElBQUE7QUFFRTs7O1lBQ0UsWUFBQSxHQUFnQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBZ0IsY0FBaEI7WUFDaEIsWUFBQSxHQUFnQixPQUFBLENBQVEsWUFBUjtBQUNoQixrQkFIRjtXQUlBLGNBQUE7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LE1BQU0sTUFBTjs7VUFDQSxJQUFlLFFBQUEsS0FBWSxNQUEzQjtZQUFBLE1BQU0sTUFBTjs7QUFDQSxpQkFBTyxTQUhUOztRQUlBLENBQUEsR0FBSSxDQUFFLEdBQUYsRUFBTyxHQUFBLENBQVAsRUFSVjs7O1FBV00sSUFBRyxtQkFBSDtVQUNFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBWixHQUF3QixDQUFBLENBQUEsQ0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxPQUFBO1VBQ3hCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBWixHQUF3QixJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBRyxDQUFDLElBQWQsRUFBb0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFoQyxDQUFiLEVBRjFCO1NBWE47O0FBZU0sZUFBTztNQWhCZSxFQXZENUI7O01BMEVJLFNBQUEsR0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQ7QUFDWixhQUFPLE9BQUEsR0FBVSxDQUNmLFlBRGUsRUFDRCxpQkFEQyxFQUVmLGVBRmUsRUFHZix1QkFIZSxFQUdVLHFCQUhWLEVBSWYsU0FKZTtJQTdFRztFQUF0QixFQVZGOzs7RUErRkEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsdUJBQTlCO0FBL0ZBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9DQUxMU0lURV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2dldF9jYWxsc2l0ZTogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBQQVRIICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbiAgICBVVElMICAgICAgICA9IHJlcXVpcmUgJ25vZGU6dXRpbCdcbiAgICBVUkwgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6dXJsJ1xuICAgIHsgZGVidWcsICB9ID0gY29uc29sZVxuICAgIG1pc2ZpdCAgICAgID0gU3ltYm9sICdtaXNmaXQnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IG1pc2ZpdCwgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9hcHBfZGV0YWlscyA9ICh7IGRlbHRhID0gMSB9PXt9KSAtPlxuICAgICAgIyBjYWxsc2l0ZSA9IGdldF9jYWxsc2l0ZSB7IGRlbHRhOiBkZWx0YSArIDEsIH1cbiAgICAgIHBhdGggID0gUEFUSC5kaXJuYW1lIGdldF9jYWxsc2l0ZV9wYXRoIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGxvb3BcbiAgICAgICAgIyBicmVha1xuICAgICAgICB0cnlcbiAgICAgICAgICBwYWNrYWdlX3BhdGggID0gUEFUSC5qb2luIHBhdGgsICdwYWNrYWdlLmpzb24nXG4gICAgICAgICAgcGFja2FnZV9qc29uICA9IHJlcXVpcmUgcGFja2FnZV9wYXRoXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICB0aHJvdyBlcnJvciB1bmxlc3MgZXJyb3IuY29kZSBpcyAnTU9EVUxFX05PVF9GT1VORCdcbiAgICAgICAgcGF0aCA9IFBBVEguZGlybmFtZSBwYXRoXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgeyBuYW1lLFxuICAgICAgICB2ZXJzaW9uLCAgfSA9IHBhY2thZ2VfanNvblxuICAgICAgcmV0dXJuIHsgbmFtZSwgdmVyc2lvbiwgcGF0aCwgcGFja2FnZV9wYXRoLCBwYWNrYWdlX2pzb24sIH1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY2FsbHNpdGUgPSAoeyBkZWx0YSA9IDEsIHNvdXJjZW1hcHBlZCA9IHRydWUsIH09e30pIC0+XG4gICAgICBmcmFtZV9jb3VudCA9IGlmIGRlbHRhIDwgMTAgdGhlbiAxMCBlbHNlIDIwMFxuICAgICAgY2FsbHNpdGVzICAgPSBVVElMLmdldENhbGxTaXRlcyBmcmFtZV9jb3VudCwgeyBzb3VyY2VNYXA6IHNvdXJjZW1hcHBlZCwgfVxuICAgICAgcmV0dXJuIGNhbGxzaXRlc1sgZGVsdGEgXVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jYWxsc2l0ZV9wYXRoID0gKHsgZGVsdGEgPSAxIH09e30pIC0+XG4gICAgICBjYWxsc2l0ZSA9IGdldF9jYWxsc2l0ZSB7IGRlbHRhOiBkZWx0YSArIDEsIH1cbiAgICAgIHVubGVzcyBjYWxsc2l0ZS5zY3JpcHROYW1lLnN0YXJ0c1dpdGggJ2ZpbGU6Ly8nXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fMSB1bmFibGUgdG8gZ2V0IHBhdGggZm9yIGNhbGxzaXRlLnNjcmlwdE5hbWU6ICN7Y2FsbHNpdGUuc2NyaXB0TmFtZX1cIlxuICAgICAgdHJ5XG4gICAgICAgIHJldHVybiBVUkwuZmlsZVVSTFRvUGF0aCBjYWxsc2l0ZS5zY3JpcHROYW1lXG4gICAgICBjYXRjaCBlcnJvclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzIgd2hlbiB0cnlpbmcgdG8gcmVzb2x2ZSBmaWxlIFVSTCAje2NhbGxzaXRlLnNjcmlwdE5hbWV9LCBhbiBlcnJvciB3YXMgdGhyb3duXCIsIFxcXG4gICAgICAgICAgeyBjYXVzZTogZXJyb3IsIH1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXF1aXJlX2Zyb21fYXBwX2ZvbGRlciA9ICh7IGRlbHRhID0gMSwgcGF0aCwgfT17fSkgLT5cbiAgICAgIHVubGVzcyAoIHR5cGVvZiBwYXRoICkgaXMgJ3N0cmluZydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18zIGV4cGVjdGVkIHBhdGggdG8gYmUgYSB0ZXh0LCBnb3QgI3twYXRofVwiXG4gICAgICBhcHAgICAgID0gZ2V0X2FwcF9kZXRhaWxzIHsgZGVsdGE6IGRlbHRhICsgMSwgfVxuICAgICAgYWJzcGF0aCA9IFBBVEgucmVzb2x2ZSBQQVRILmpvaW4gYXBwLnBhdGgsIHBhdGhcbiAgICAgIHJldHVybiByZXF1aXJlIGFic3BhdGhcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXF1aXJlX2JyaWNhYnJhY19jZmcgPSAoeyBkZWx0YSA9IDEsIHBhdGggPSAnYnJpY2FicmFjLmNmZy5qcycsIGZhbGxiYWNrID0gbWlzZml0LCB9PXt9KSAtPlxuICAgICAgYXBwICAgICA9IGdldF9hcHBfZGV0YWlscyB7IGRlbHRhOiBkZWx0YSArIDEsIH1cbiAgICAgIGFic3BhdGggPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIGFwcC5wYXRoLCBwYXRoXG4gICAgICB0cnlcbiAgICAgICAgUiA9IHJlcXVpcmUgYWJzcGF0aFxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgdGhyb3cgZXJyb3IgdW5sZXNzIGVycm9yLmNvZGUgaXMgJ01PRFVMRV9OT1RfRk9VTkQnXG4gICAgICAgIHRocm93IGVycm9yIGlmIGZhbGxiYWNrIGlzIG1pc2ZpdFxuICAgICAgICByZXR1cm4gZmFsbGJhY2tcbiAgICAgIFIgPSB7IGFwcCwgUi4uLiwgfVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHRlbXBsYXRlcyBmb3IgZGVmYXVsdCB2YWx1ZXMgIyMjXG4gICAgICBpZiBSLmRhdGFzdG9yZT9cbiAgICAgICAgUi5kYXRhc3RvcmUuZmlsZW5hbWUgID0gXCIje1IuZGF0YXN0b3JlLm5hbWV9LnNxbGl0ZVwiXG4gICAgICAgIFIuZGF0YXN0b3JlLnBhdGggICAgICA9IFBBVEgucmVzb2x2ZSBQQVRILmpvaW4gYXBwLnBhdGgsIFIuZGF0YXN0b3JlLmZpbGVuYW1lXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgcmV0dXJuIFJcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgZ2V0X2NhbGxzaXRlLCBnZXRfY2FsbHNpdGVfcGF0aCxcbiAgICAgIGdldF9hcHBfZGV0YWlscyxcbiAgICAgIHJlcXVpcmVfZnJvbV9hcHBfZm9sZGVyLCByZXF1aXJlX2JyaWNhYnJhY19jZmcsXG4gICAgICBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0NBTExTSVRFX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-callsite-brics.coffee