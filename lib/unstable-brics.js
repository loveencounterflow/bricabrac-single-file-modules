(function() {
  'use strict';
  var UNSTABLE_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_next_free_filename: function() {
      var FS, PATH, TMP_exhaustion_error, TMP_validation_error, cache_filename_re, cfg, errors, exists, exports, get_next_filename, get_next_free_filename, rpr;
      cfg = {
        max_retries: 9999,
        prefix: '~.',
        suffix: '.bricabrac-cache'
      };
      cache_filename_re = RegExp(`^(?:${RegExp.escape(cfg.prefix)})(?<first>.*)\\.(?<nr>[0-9]{4})(?:${RegExp.escape(cfg.suffix)})$`, "v");
      // cache_suffix_re = ///
      //   (?: #{RegExp.escape cfg.suffix} )
      //   $
      //   ///v
      rpr = function(x) {
        return `'${(typeof x) === 'string' ? x.replace(/'/g, "\\'") : void 0}'`;
        return `${x}`;
      };
      errors = {
        TMP_exhaustion_error: TMP_exhaustion_error = class TMP_exhaustion_error extends Error {},
        TMP_validation_error: TMP_validation_error = class TMP_validation_error extends Error {}
      };
      FS = require('node:fs');
      PATH = require('node:path');
      //.......................................................................................................
      exists = function(path) {
        var error;
        try {
          FS.statSync(path);
        } catch (error1) {
          error = error1;
          return false;
        }
        return true;
      };
      //.......................................................................................................
      get_next_filename = function(path) {
        var basename, dirname, first, match, nr;
        if ((typeof path) !== 'string') {
          /* TAINT use proper type checking */
          throw new errors.TMP_validation_error(`Ω___1 expected a text, got ${rpr(path)}`);
        }
        if (!(path.length > 0)) {
          throw new errors.TMP_validation_error(`Ω___2 expected a nonempty text, got ${rpr(path)}`);
        }
        dirname = PATH.dirname(path);
        basename = PATH.basename(path);
        if ((match = basename.match(cache_filename_re)) == null) {
          return PATH.join(dirname, `${cfg.prefix}${basename}.0001${cfg.suffix}`);
        }
        ({first, nr} = match.groups);
        nr = `${(parseInt(nr, 10)) + 1}`.padStart(4, '0');
        path = first;
        return PATH.join(dirname, `${cfg.prefix}${first}.${nr}${cfg.suffix}`);
      };
      //.......................................................................................................
      get_next_free_filename = function(path) {
        var R, failure_count;
        R = path;
        failure_count = -1;
        while (true) {
          //...................................................................................................
          //.....................................................................................................
          failure_count++;
          if (failure_count > cfg.max_retries) {
            throw new errors.TMP_exhaustion_error(`Ω___3 too many (${failure_count}) retries;  path ${rpr(R)} exists`);
          }
          //...................................................................................................
          R = get_next_filename(R);
          if (!exists(R)) {
            break;
          }
        }
        return R;
      };
      //.......................................................................................................
      // swap_suffix = ( path, suffix ) -> path.replace cache_suffix_re, suffix
      //.......................................................................................................
      return exports = {get_next_free_filename, get_next_filename, exists, cache_filename_re, errors};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_command_line_tools: function() {
      var CP, exports, get_command_line_result, get_wc_max_line_length;
      CP = require('node:child_process');
      //-----------------------------------------------------------------------------------------------------------
      get_command_line_result = function(command, input) {
        return (CP.execSync(command, {
          encoding: 'utf-8',
          input
        })).replace(/\n$/s, '');
      };
      //-----------------------------------------------------------------------------------------------------------
      get_wc_max_line_length = function(text) {
        /* thx to https://unix.stackexchange.com/a/258551/280204 */
        return parseInt(get_command_line_result('wc --max-line-length', text), 10);
      };
      //.......................................................................................................
      return exports = {get_command_line_result, get_wc_max_line_length};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_random_tools: function() {
      var Get_random, exports, get_setter, hide, internals;
      ({hide, get_setter} = (require('./various-brics')).require_managed_property_tools());
      /* TAINT replace */
      // { default: _get_unique_text,  } = require 'unique-string'

      //---------------------------------------------------------------------------------------------------------
      internals = Object.freeze({
        chr_re: /^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$/v,
        templates: Object.freeze({
          random_tools_cfg: Object.freeze({
            seed: null,
            size: 1_000,
            max_retries: 1_000,
            // unique_count:   1_000
            on_stats: null,
            unicode_cid_range: Object.freeze([0x0000, 0x10ffff])
          }),
          stats: {
            chr: {
              retries: -1
            },
            set_of_chrs: {
              retries: -1
            },
            set_of_texts: {
              retries: -1
            }
          }
        })
      });
      
    // thx to https://stackoverflow.com/a/47593316/7568091
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

    // SplitMix32

    // A 32-bit state PRNG that was made by taking MurmurHash3's mixing function, adding a incrementor and
    // tweaking the constants. It's potentially one of the better 32-bit PRNGs so far; even the author of
    // Mulberry32 considers it to be the better choice. It's also just as fast.

    const splitmix32 = function ( a ) {
     return function() {
       a |= 0;
       a = a + 0x9e3779b9 | 0;
       let t = a ^ a >>> 16;
       t = Math.imul(t, 0x21f0aaad);
       t = t ^ t >>> 15;
       t = Math.imul(t, 0x735a2d97);
       return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
      }
    }

    // const prng = splitmix32((Math.random()*2**32)>>>0)
    // for(let i=0; i<10; i++) console.log(prng());
    //
    // I would recommend this if you just need a simple but good PRNG and don't need billions of random
    // numbers (see Birthday problem).
    //
    // Note: It does have one potential concern: it does not repeat previous numbers until you exhaust 4.3
    // billion numbers and it repeats again. Which may or may not be a statistical concern for your use
    // case. It's like a list of random numbers with the duplicates removed, but without any extra work
    // involved to remove them. All other generators in this list do not exhibit this behavior.
    //---------------------------------------------------------------------------------------------------------
    ;
      //=========================================================================================================
      Get_random = class Get_random {
        //-------------------------------------------------------------------------------------------------------
        static get_random_seed() {
          return (Math.random() * 2 ** 32) >>> 0;
        }

        //-------------------------------------------------------------------------------------------------------
        constructor(cfg) {
          var base;
          this.cfg = {...internals.templates.random_tools_cfg, ...cfg};
          if ((base = this.cfg).seed == null) {
            base.seed = this.constructor.get_random_seed();
          }
          hide(this, '_float', splitmix32(this.cfg.seed));
          return void 0;
        }

        //=======================================================================================================
        // STATS
        //-------------------------------------------------------------------------------------------------------
        _create_stats_for(name) {
          var finish, stats/* TAINT use rpr() */, template;
          if ((template = internals.templates.stats[name]) == null) {
            throw new Error(`Ω___4 unknown stats name ${name}`);
          }
          stats = {...template};
          //.....................................................................................................
          if (this.cfg.on_stats != null) {
            finish = (R) => {
              this.cfg.on_stats({name, stats, R});
              return R;
            };
          } else {
            finish = (R) => {
              return R;
            };
          }
          //.....................................................................................................
          return {stats, finish};
        }

        //=======================================================================================================

        //-------------------------------------------------------------------------------------------------------
        float({min = 0, max = 1} = {}) {
          return min + this._float() * (max - min);
        }

        integer({min = 0, max = 1} = {}) {
          return Math.round(this.float({min, max}));
        }

        //-------------------------------------------------------------------------------------------------------
        _get_min_max_length({length = 1, min_length = null, max_length = null} = {}) {
          if (min_length != null) {
            return {
              min_length,
              max_length: max_length != null ? max_length : min_length * 2
            };
          } else if (max_length != null) {
            return {
              min_length: min_length != null ? min_length : 1,
              max_length
            };
          }
          if (length != null) {
            return {
              min_length: length,
              max_length: length
            };
          }
          throw new Error("Ω___6 must set at least one of `length`, `min_length`, `max_length`");
        }

        //-------------------------------------------------------------------------------------------------------
        _get_random_length({length = 1, min_length = null, max_length = null} = {}) {
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          if (min_length === max_length/* NOTE done to avoid changing PRNG state */) {
            return min_length;
          }
          return this.integer({
            min: min_length,
            max: max_length
          });
        }

        //-------------------------------------------------------------------------------------------------------
        text({min = 0, max = 1, length = 1, min_length = null, max_length = null} = {}) {
          var _;
          length = this._get_random_length({length, min_length, max_length});
          return ((function() {
            var i, ref, results;
            results = [];
            for (_ = i = 1, ref = length; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
              results.push(this.chr({min, max}));
            }
            return results;
          }).call(this)).join('');
        }

        //-------------------------------------------------------------------------------------------------------
        _get_min_max({min = null, max = null} = {}) {
          if ((typeof min) === 'string') {
            min = min.codePointAt(0);
          }
          if ((typeof max) === 'string') {
            max = max.codePointAt(0);
          }
          if (min == null) {
            min = this.cfg.unicode_cid_range[0];
          }
          if (max == null) {
            max = this.cfg.unicode_cid_range[1];
          }
          return {min, max};
        }

        //-------------------------------------------------------------------------------------------------------
        chr({min = null, max = null} = {}) {
          var R, finish, stats;
          ({stats, finish} = this._create_stats_for('chr'));
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          while (true) {
            //.....................................................................................................
            stats.retries++;
            if (stats.retries > this.cfg.max_retries) {
              throw new Error("Ω___5 exhausted");
            }
            R = String.fromCodePoint(this.integer({min, max}));
            if (internals.chr_re.test(R)) {
              return finish(R);
            }
          }
          //.....................................................................................................
          return null;
        }

        //-------------------------------------------------------------------------------------------------------
        set_of_chrs({min = null, max = null, size = 2} = {}) {
          var R, finish, stats;
          ({stats, finish} = this._create_stats_for('set_of_chrs'));
          R = new Set();
          //.....................................................................................................
          while (R.size < size) {
            stats.retries++;
            R.add(this.chr({min, max}));
          }
          return finish(R);
        }

        //-------------------------------------------------------------------------------------------------------
        set_of_texts({min = null, max = null, length = 1, min_length = null, max_length = null, size = 2} = {}) {
          var R, finish, length_is_const, stats;
          ({stats, finish} = this._create_stats_for('set_of_texts'));
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          length_is_const = min_length === max_length;
          length = min_length;
          R = new Set();
          //.....................................................................................................
          while (R.size < size) {
            stats.retries++;
            if (!length_is_const) {
              length = this.integer({
                min: min_length,
                max: max_length
              });
            }
            R.add(this.text({min, max, length}));
          }
          return finish(R);
        }

        //-------------------------------------------------------------------------------------------------------
        * walk({producer, n = 1} = {}) {
          var count;
          count = 0;
          while (true) {
            count++;
            if (count > n) {
              break;
            }
            yield producer();
          }
          return null;
        }

      };
      //=========================================================================================================
      return exports = {Get_random, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxXQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFt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Y0FBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQUQsQ0FBUztnQkFBRSxHQUFBLEVBQUssVUFBUDtnQkFBbUIsR0FBQSxFQUFLO2NBQXhCLENBQVQsRUFBVDs7WUFDQSxDQUFDLENBQUMsR0FBRixDQUFNLElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBRSxHQUFGLEVBQU8sR0FBUCxFQUFZLE1BQVosQ0FBTixDQUFOO1VBSEY7QUFJQSxpQkFBUyxNQUFBLENBQU8sQ0FBUDtRQWJHLENBdkZwQjs7O1FBdUdZLEVBQU4sSUFBTSxDQUFDLENBQUUsUUFBRixFQUFZLENBQUEsR0FBSSxDQUFoQixJQUFxQixDQUFBLENBQXRCLENBQUE7QUFDWixjQUFBO1VBQVEsS0FBQSxHQUFRO0FBQ1IsaUJBQUEsSUFBQTtZQUNFLEtBQUE7WUFBUyxJQUFTLEtBQUEsR0FBUSxDQUFqQjtBQUFBLG9CQUFBOztZQUNULE1BQU0sUUFBQSxDQUFBO1VBRlI7QUFHQSxpQkFBTztRQUxIOztNQXpHUixFQTVESjs7QUE2S0ksYUFBTyxPQUFBLEdBQVUsQ0FBRSxVQUFGLEVBQWMsU0FBZDtJQTlLRztFQWpGdEIsRUFWRjs7O0VBNlFBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLGNBQTlCO0FBN1FBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX25leHRfZnJlZV9maWxlbmFtZTogLT5cbiAgICBjZmcgPVxuICAgICAgbWF4X3JldHJpZXM6ICAgIDk5OTlcbiAgICAgIHByZWZpeDogICAgICAgICAnfi4nXG4gICAgICBzdWZmaXg6ICAgICAgICAgJy5icmljYWJyYWMtY2FjaGUnXG4gICAgY2FjaGVfZmlsZW5hbWVfcmUgPSAvLy9cbiAgICAgIF5cbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnByZWZpeH0gKVxuICAgICAgKD88Zmlyc3Q+LiopXG4gICAgICBcXC5cbiAgICAgICg/PG5yPlswLTldezR9KVxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgICAkXG4gICAgICAvLy92XG4gICAgIyBjYWNoZV9zdWZmaXhfcmUgPSAvLy9cbiAgICAjICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgIyAgICRcbiAgICAjICAgLy8vdlxuICAgIHJwciAgICAgICAgICAgICAgID0gKCB4ICkgLT5cbiAgICAgIHJldHVybiBcIicje3gucmVwbGFjZSAvJy9nLCBcIlxcXFwnXCIgaWYgKCB0eXBlb2YgeCApIGlzICdzdHJpbmcnfSdcIlxuICAgICAgcmV0dXJuIFwiI3t4fVwiXG4gICAgZXJyb3JzID1cbiAgICAgIFRNUF9leGhhdXN0aW9uX2Vycm9yOiBjbGFzcyBUTVBfZXhoYXVzdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgICBUTVBfdmFsaWRhdGlvbl9lcnJvcjogY2xhc3MgVE1QX3ZhbGlkYXRpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgIEZTICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuICAgIFBBVEggICAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBleGlzdHMgPSAoIHBhdGggKSAtPlxuICAgICAgdHJ5IEZTLnN0YXRTeW5jIHBhdGggY2F0Y2ggZXJyb3IgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiB0cnVlXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB0eXBlIGNoZWNraW5nICMjI1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMSBleHBlY3RlZCBhIHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyAoIHR5cGVvZiBwYXRoICkgaXMgJ3N0cmluZydcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzIgZXhwZWN0ZWQgYSBub25lbXB0eSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgcGF0aC5sZW5ndGggPiAwXG4gICAgICBkaXJuYW1lICA9IFBBVEguZGlybmFtZSBwYXRoXG4gICAgICBiYXNlbmFtZSA9IFBBVEguYmFzZW5hbWUgcGF0aFxuICAgICAgdW5sZXNzICggbWF0Y2ggPSBiYXNlbmFtZS5tYXRjaCBjYWNoZV9maWxlbmFtZV9yZSApP1xuICAgICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7YmFzZW5hbWV9LjAwMDEje2NmZy5zdWZmaXh9XCJcbiAgICAgIHsgZmlyc3QsIG5yLCAgfSA9IG1hdGNoLmdyb3Vwc1xuICAgICAgbnIgICAgICAgICAgICAgID0gXCIjeyggcGFyc2VJbnQgbnIsIDEwICkgKyAxfVwiLnBhZFN0YXJ0IDQsICcwJ1xuICAgICAgcGF0aCAgICAgICAgICAgID0gZmlyc3RcbiAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tmaXJzdH0uI3tucn0je2NmZy5zdWZmaXh9XCJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgUiAgICAgICAgICAgICA9IHBhdGhcbiAgICAgIGZhaWx1cmVfY291bnQgPSAtMVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBsb29wXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZmFpbHVyZV9jb3VudCsrXG4gICAgICAgIGlmIGZhaWx1cmVfY291bnQgPiBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfZXhoYXVzdGlvbl9lcnJvciBcIs6pX19fMyB0b28gbWFueSAoI3tmYWlsdXJlX2NvdW50fSkgcmV0cmllczsgIHBhdGggI3tycHIgUn0gZXhpc3RzXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBSID0gZ2V0X25leHRfZmlsZW5hbWUgUlxuICAgICAgICBicmVhayB1bmxlc3MgZXhpc3RzIFJcbiAgICAgIHJldHVybiBSXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIHN3YXBfc3VmZml4ID0gKCBwYXRoLCBzdWZmaXggKSAtPiBwYXRoLnJlcGxhY2UgY2FjaGVfc3VmZml4X3JlLCBzdWZmaXhcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lLCBnZXRfbmV4dF9maWxlbmFtZSwgZXhpc3RzLCBjYWNoZV9maWxlbmFtZV9yZSwgZXJyb3JzLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY29tbWFuZF9saW5lX3Rvb2xzOiAtPlxuICAgIENQID0gcmVxdWlyZSAnbm9kZTpjaGlsZF9wcm9jZXNzJ1xuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ID0gKCBjb21tYW5kLCBpbnB1dCApIC0+XG4gICAgICByZXR1cm4gKCBDUC5leGVjU3luYyBjb21tYW5kLCB7IGVuY29kaW5nOiAndXRmLTgnLCBpbnB1dCwgfSApLnJlcGxhY2UgL1xcbiQvcywgJydcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF93Y19tYXhfbGluZV9sZW5ndGggPSAoIHRleHQgKSAtPlxuICAgICAgIyMjIHRoeCB0byBodHRwczovL3VuaXguc3RhY2tleGNoYW5nZS5jb20vYS8yNTg1NTEvMjgwMjA0ICMjI1xuICAgICAgcmV0dXJuIHBhcnNlSW50ICggZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgJ3djIC0tbWF4LWxpbmUtbGVuZ3RoJywgdGV4dCApLCAxMFxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQsIGdldF93Y19tYXhfbGluZV9sZW5ndGgsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3JhbmRvbV90b29sczogLT5cbiAgICB7IGhpZGUsXG4gICAgICBnZXRfc2V0dGVyLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyMjIFRBSU5UIHJlcGxhY2UgIyMjXG4gICAgIyB7IGRlZmF1bHQ6IF9nZXRfdW5pcXVlX3RleHQsICB9ID0gcmVxdWlyZSAndW5pcXVlLXN0cmluZydcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplXG4gICAgICBjaHJfcmU6IC8vL14oPzpcXHB7TH18XFxwe1pzfXxcXHB7Wn18XFxwe019fFxccHtOfXxcXHB7UH18XFxwe1N9KSQvLy92XG4gICAgICB0ZW1wbGF0ZXM6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcmFuZG9tX3Rvb2xzX2NmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICAgIHNlZWQ6ICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMV8wMDBcbiAgICAgICAgICBtYXhfcmV0cmllczogICAgICAgIDFfMDAwXG4gICAgICAgICAgIyB1bmlxdWVfY291bnQ6ICAgMV8wMDBcbiAgICAgICAgICBvbl9zdGF0czogICAgICAgICAgIG51bGxcbiAgICAgICAgICB1bmljb2RlX2NpZF9yYW5nZTogIE9iamVjdC5mcmVlemUgWyAweDAwMDAsIDB4MTBmZmZmIF1cbiAgICAgICAgc3RhdHM6XG4gICAgICAgICAgY2hyOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBzZXRfb2ZfY2hyczpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG4gICAgICAgICAgc2V0X29mX3RleHRzOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBgYGBcbiAgICAvLyB0aHggdG8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NTkzMzE2Lzc1NjgwOTFcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvc2VlZGluZy10aGUtcmFuZG9tLW51bWJlci1nZW5lcmF0b3ItaW4tamF2YXNjcmlwdFxuXG4gICAgLy8gU3BsaXRNaXgzMlxuXG4gICAgLy8gQSAzMi1iaXQgc3RhdGUgUFJORyB0aGF0IHdhcyBtYWRlIGJ5IHRha2luZyBNdXJtdXJIYXNoMydzIG1peGluZyBmdW5jdGlvbiwgYWRkaW5nIGEgaW5jcmVtZW50b3IgYW5kXG4gICAgLy8gdHdlYWtpbmcgdGhlIGNvbnN0YW50cy4gSXQncyBwb3RlbnRpYWxseSBvbmUgb2YgdGhlIGJldHRlciAzMi1iaXQgUFJOR3Mgc28gZmFyOyBldmVuIHRoZSBhdXRob3Igb2ZcbiAgICAvLyBNdWxiZXJyeTMyIGNvbnNpZGVycyBpdCB0byBiZSB0aGUgYmV0dGVyIGNob2ljZS4gSXQncyBhbHNvIGp1c3QgYXMgZmFzdC5cblxuICAgIGNvbnN0IHNwbGl0bWl4MzIgPSBmdW5jdGlvbiAoIGEgKSB7XG4gICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICBhIHw9IDA7XG4gICAgICAgYSA9IGEgKyAweDllMzc3OWI5IHwgMDtcbiAgICAgICBsZXQgdCA9IGEgXiBhID4+PiAxNjtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4MjFmMGFhYWQpO1xuICAgICAgIHQgPSB0IF4gdCA+Pj4gMTU7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDczNWEyZDk3KTtcbiAgICAgICByZXR1cm4gKCh0ID0gdCBeIHQgPj4+IDE1KSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnN0IHBybmcgPSBzcGxpdG1peDMyKChNYXRoLnJhbmRvbSgpKjIqKjMyKT4+PjApXG4gICAgLy8gZm9yKGxldCBpPTA7IGk8MTA7IGkrKykgY29uc29sZS5sb2cocHJuZygpKTtcbiAgICAvL1xuICAgIC8vIEkgd291bGQgcmVjb21tZW5kIHRoaXMgaWYgeW91IGp1c3QgbmVlZCBhIHNpbXBsZSBidXQgZ29vZCBQUk5HIGFuZCBkb24ndCBuZWVkIGJpbGxpb25zIG9mIHJhbmRvbVxuICAgIC8vIG51bWJlcnMgKHNlZSBCaXJ0aGRheSBwcm9ibGVtKS5cbiAgICAvL1xuICAgIC8vIE5vdGU6IEl0IGRvZXMgaGF2ZSBvbmUgcG90ZW50aWFsIGNvbmNlcm46IGl0IGRvZXMgbm90IHJlcGVhdCBwcmV2aW91cyBudW1iZXJzIHVudGlsIHlvdSBleGhhdXN0IDQuM1xuICAgIC8vIGJpbGxpb24gbnVtYmVycyBhbmQgaXQgcmVwZWF0cyBhZ2Fpbi4gV2hpY2ggbWF5IG9yIG1heSBub3QgYmUgYSBzdGF0aXN0aWNhbCBjb25jZXJuIGZvciB5b3VyIHVzZVxuICAgIC8vIGNhc2UuIEl0J3MgbGlrZSBhIGxpc3Qgb2YgcmFuZG9tIG51bWJlcnMgd2l0aCB0aGUgZHVwbGljYXRlcyByZW1vdmVkLCBidXQgd2l0aG91dCBhbnkgZXh0cmEgd29ya1xuICAgIC8vIGludm9sdmVkIHRvIHJlbW92ZSB0aGVtLiBBbGwgb3RoZXIgZ2VuZXJhdG9ycyBpbiB0aGlzIGxpc3QgZG8gbm90IGV4aGliaXQgdGhpcyBiZWhhdmlvci5cbiAgICBgYGBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBHZXRfcmFuZG9tXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZ2V0X3JhbmRvbV9zZWVkOiAtPiAoIE1hdGgucmFuZG9tKCkgKiAyICoqIDMyICkgPj4+IDBcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAY2ZnLnNlZWQgID89IEBjb25zdHJ1Y3Rvci5nZXRfcmFuZG9tX3NlZWQoKVxuICAgICAgICBoaWRlIEAsICdfZmxvYXQnLCBzcGxpdG1peDMyIEBjZmcuc2VlZFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgU1RBVFNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfY3JlYXRlX3N0YXRzX2ZvcjogKCBuYW1lICkgLT5cbiAgICAgICAgdW5sZXNzICggdGVtcGxhdGUgPSBpbnRlcm5hbHMudGVtcGxhdGVzLnN0YXRzWyBuYW1lIF0gKT9cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgdW5rbm93biBzdGF0cyBuYW1lICN7bmFtZX1cIiAjIyMgVEFJTlQgdXNlIHJwcigpICMjI1xuICAgICAgICBzdGF0cyA9IHsgdGVtcGxhdGUuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmIEBjZmcub25fc3RhdHM/IHRoZW4gIGZpbmlzaCA9ICggUiApID0+IEBjZmcub25fc3RhdHMgeyBuYW1lLCBzdGF0cywgUiwgfTsgUlxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICBmaW5pc2ggPSAoIFIgKSA9PiBSXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4geyBzdGF0cywgZmluaXNoLCB9XG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXQ6ICAgICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgIGludGVnZXI6ICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBNYXRoLnJvdW5kIEBmbG9hdCB7IG1pbiwgbWF4LCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X21pbl9tYXhfbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIGlmIG1pbl9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aCwgbWF4X2xlbmd0aDogKCBtYXhfbGVuZ3RoID8gbWluX2xlbmd0aCAqIDIgKSwgfVxuICAgICAgICBlbHNlIGlmIG1heF9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogKCBtaW5fbGVuZ3RoID8gMSApLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6IGxlbmd0aCwgbWF4X2xlbmd0aDogbGVuZ3RoLCB9IGlmIGxlbmd0aD9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX182IG11c3Qgc2V0IGF0IGxlYXN0IG9uZSBvZiBgbGVuZ3RoYCwgYG1pbl9sZW5ndGhgLCBgbWF4X2xlbmd0aGBcIlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9yYW5kb21fbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIG1pbl9sZW5ndGggaWYgbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoICMjIyBOT1RFIGRvbmUgdG8gYXZvaWQgY2hhbmdpbmcgUFJORyBzdGF0ZSAjIyNcbiAgICAgICAgcmV0dXJuIEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRleHQ6ICh7IG1pbiA9IDAsIG1heCA9IDEsIGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgbGVuZ3RoID0gQF9nZXRfcmFuZG9tX2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4gKCBAY2hyIHsgbWluLCBtYXgsIH0gZm9yIF8gaW4gWyAxIC4uIGxlbmd0aCBdICkuam9pbiAnJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4OiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBtaW4gID0gbWluLmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWluICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWF4ICA9IG1heC5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1heCApIGlzICdzdHJpbmcnXG4gICAgICAgIG1pbiA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAwIF1cbiAgICAgICAgbWF4ID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDEgXVxuICAgICAgICByZXR1cm4geyBtaW4sIG1heCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY2hyOiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgIGZpbmlzaCwgICAgIH0gPSBAX2NyZWF0ZV9zdGF0c19mb3IgJ2NocidcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBzdGF0cy5yZXRyaWVzKytcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgZXhoYXVzdGVkXCIgaWYgc3RhdHMucmV0cmllcyA+IEBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICBSID0gU3RyaW5nLmZyb21Db2RlUG9pbnQgQGludGVnZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAgIHJldHVybiAoIGZpbmlzaCBSICkgaWYgaW50ZXJuYWxzLmNocl9yZS50ZXN0ICggUiApXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX2NocnM6ICh7IG1pbiA9IG51bGwsIG1heCA9IG51bGwsIHNpemUgPSAyIH09e30pIC0+XG4gICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnc2V0X29mX2NocnMnXG4gICAgICAgIFIgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgd2hpbGUgUi5zaXplIDwgc2l6ZVxuICAgICAgICAgIHN0YXRzLnJldHJpZXMrK1xuICAgICAgICAgIFIuYWRkIEBjaHIgeyBtaW4sIG1heCwgfVxuICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfb2ZfdGV4dHM6ICh7IG1pbiA9IG51bGwsIG1heCA9IG51bGwsIGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgc2l6ZSA9IDIgfT17fSkgLT5cbiAgICAgICAgeyBzdGF0cyxcbiAgICAgICAgICBmaW5pc2gsICAgICB9ID0gQF9jcmVhdGVfc3RhdHNfZm9yICdzZXRfb2ZfdGV4dHMnXG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgbGVuZ3RoX2lzX2NvbnN0ID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICA9IG1pbl9sZW5ndGhcbiAgICAgICAgUiAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB3aGlsZSBSLnNpemUgPCBzaXplXG4gICAgICAgICAgc3RhdHMucmV0cmllcysrXG4gICAgICAgICAgbGVuZ3RoID0gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfSB1bmxlc3MgbGVuZ3RoX2lzX2NvbnN0XG4gICAgICAgICAgUi5hZGQgQHRleHQgeyBtaW4sIG1heCwgbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiAoIGZpbmlzaCBSIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHdhbGs6ICh7IHByb2R1Y2VyLCBuID0gMSwgfT17fSkgLT5cbiAgICAgICAgY291bnQgPSAwXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBjb3VudCsrOyBicmVhayBpZiBjb3VudCA+IG5cbiAgICAgICAgICB5aWVsZCBwcm9kdWNlcigpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEdldF9yYW5kb20sIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgVU5TVEFCTEVfQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-brics.coffee