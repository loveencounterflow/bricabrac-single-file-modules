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
        max_attempts: 9999,
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
          if (failure_count > cfg.max_attempts) {
            throw new errors.TMP_exhaustion_error(`Ω___3 too many (${failure_count}) attempts; path ${rpr(R)} exists`);
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
            max_attempts: 1_000,
            // unique_count:   1_000
            on_stats: null,
            unicode_cid_range: Object.freeze([0x0000, 0x10ffff])
          }),
          stats: {
            chr: {
              attempts: 0
            },
            set_of_chrs: {
              attempts: 0
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
      Get_random = (function() {
        var get_texts_mapped_to_width_length;

        //=========================================================================================================
        class Get_random {
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
          text({min = 0, max = 1, length = 1} = {}) {
            var _;
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
              stats.attempts++;
              if (stats.attempts > this.cfg.max_attempts) {
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
            var R, finish, old_size, stats;
            ({stats, finish} = this._create_stats_for('set_of_chrs'));
            R = new Set();
            while (true) {
              //.....................................................................................................
              /* TAINT refactor */
              old_size = R.size;
              while (R.size === old_size) {
                stats.attempts++;
                if (stats.attempts > this.cfg.max_attempts) {
                  throw new Error("Ω___6 exhausted");
                }
                R.add(this.chr({min, max}));
              }
              if (R.size >= size) {
                break;
              }
            }
            return finish(R);
          }

        };

        // #-------------------------------------------------------------------------------------------------------
        // get_codepoi = ( cfg ) ->

        // #-------------------------------------------------------------------------------------------------------
        // get_unique_text = ( cfg ) ->
        //   cfg = { internals.templates.get_texts_mapped_to_width_length_cfg..., cfg..., }

        // _get_unique_text = ( min_length ) -> _get_unique_text()[ .. ( GUY.rnd.random_integer 1, 15 ) ]

        //-------------------------------------------------------------------------------------------------------
        get_texts_mapped_to_width_length = function(cfg) {
          var R, entry, old_size;
          cfg = {...internals.templates.get_texts_mapped_to_width_length_cfg, ...cfg};
          R = new Map();
          old_size = 0;
          while (true) {
            while (R.size === old_size) {
              entry = [get_unique_text(), GUY.rnd.random_integer(0, 10)];
              R.set(...entry);
            }
            old_size = R.size;
            if (old_size >= cfg.size) {
              break;
            }
          }
          return R;
        };

        return Get_random;

      }).call(this);
      //=========================================================================================================
      return exports = {Get_random, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxZQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFt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Q0FBQyxDQUFDLEdBQUYsQ0FBTSxHQUFBLEtBQU47WUFGRjtZQUdBLFFBQUEsR0FBVyxDQUFDLENBQUM7WUFDYixJQUFTLFFBQUEsSUFBWSxHQUFHLENBQUMsSUFBekI7QUFBQSxvQkFBQTs7VUFMRjtBQU1BLGlCQUFPO1FBVjBCOzs7O29CQWhKekM7O0FBNkpJLGFBQU8sT0FBQSxHQUFVLENBQUUsVUFBRixFQUFjLFNBQWQ7SUE5Skc7RUFqRnRCLEVBVkY7OztFQTZQQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixjQUE5QjtBQTdQQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9uZXh0X2ZyZWVfZmlsZW5hbWU6IC0+XG4gICAgY2ZnID1cbiAgICAgIG1heF9hdHRlbXB0czogICA5OTk5XG4gICAgICBwcmVmaXg6ICAgICAgICAgJ34uJ1xuICAgICAgc3VmZml4OiAgICAgICAgICcuYnJpY2FicmFjLWNhY2hlJ1xuICAgIGNhY2hlX2ZpbGVuYW1lX3JlID0gLy8vXG4gICAgICBeXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5wcmVmaXh9IClcbiAgICAgICg/PGZpcnN0Pi4qKVxuICAgICAgXFwuXG4gICAgICAoPzxucj5bMC05XXs0fSlcbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICAgJFxuICAgICAgLy8vdlxuICAgICMgY2FjaGVfc3VmZml4X3JlID0gLy8vXG4gICAgIyAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICMgICAkXG4gICAgIyAgIC8vL3ZcbiAgICBycHIgICAgICAgICAgICAgICA9ICggeCApIC0+XG4gICAgICByZXR1cm4gXCInI3t4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiIGlmICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJ30nXCJcbiAgICAgIHJldHVybiBcIiN7eH1cIlxuICAgIGVycm9ycyA9XG4gICAgICBUTVBfZXhoYXVzdGlvbl9lcnJvcjogY2xhc3MgVE1QX2V4aGF1c3Rpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgICAgVE1QX3ZhbGlkYXRpb25fZXJyb3I6IGNsYXNzIFRNUF92YWxpZGF0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICBGUyAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICBQQVRIICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpwYXRoJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZXhpc3RzID0gKCBwYXRoICkgLT5cbiAgICAgIHRyeSBGUy5zdGF0U3luYyBwYXRoIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwZSBjaGVja2luZyAjIyNcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzEgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgKCB0eXBlb2YgcGF0aCApIGlzICdzdHJpbmcnXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18yIGV4cGVjdGVkIGEgbm9uZW1wdHkgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzIHBhdGgubGVuZ3RoID4gMFxuICAgICAgZGlybmFtZSAgPSBQQVRILmRpcm5hbWUgcGF0aFxuICAgICAgYmFzZW5hbWUgPSBQQVRILmJhc2VuYW1lIHBhdGhcbiAgICAgIHVubGVzcyAoIG1hdGNoID0gYmFzZW5hbWUubWF0Y2ggY2FjaGVfZmlsZW5hbWVfcmUgKT9cbiAgICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2Jhc2VuYW1lfS4wMDAxI3tjZmcuc3VmZml4fVwiXG4gICAgICB7IGZpcnN0LCBuciwgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIG5yICAgICAgICAgICAgICA9IFwiI3soIHBhcnNlSW50IG5yLCAxMCApICsgMX1cIi5wYWRTdGFydCA0LCAnMCdcbiAgICAgIHBhdGggICAgICAgICAgICA9IGZpcnN0XG4gICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7Zmlyc3R9LiN7bnJ9I3tjZmcuc3VmZml4fVwiXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgIFIgICAgICAgICAgICAgPSBwYXRoXG4gICAgICBmYWlsdXJlX2NvdW50ID0gLTFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZhaWx1cmVfY291bnQrK1xuICAgICAgICBpZiBmYWlsdXJlX2NvdW50ID4gY2ZnLm1heF9hdHRlbXB0c1xuICAgICAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX2V4aGF1c3Rpb25fZXJyb3IgXCLOqV9fXzMgdG9vIG1hbnkgKCN7ZmFpbHVyZV9jb3VudH0pIGF0dGVtcHRzOyBwYXRoICN7cnByIFJ9IGV4aXN0c1wiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgUiA9IGdldF9uZXh0X2ZpbGVuYW1lIFJcbiAgICAgICAgYnJlYWsgdW5sZXNzIGV4aXN0cyBSXG4gICAgICByZXR1cm4gUlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBzd2FwX3N1ZmZpeCA9ICggcGF0aCwgc3VmZml4ICkgLT4gcGF0aC5yZXBsYWNlIGNhY2hlX3N1ZmZpeF9yZSwgc3VmZml4XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X25leHRfZnJlZV9maWxlbmFtZSwgZ2V0X25leHRfZmlsZW5hbWUsIGV4aXN0cywgY2FjaGVfZmlsZW5hbWVfcmUsIGVycm9ycywgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NvbW1hbmRfbGluZV90b29sczogLT5cbiAgICBDUCA9IHJlcXVpcmUgJ25vZGU6Y2hpbGRfcHJvY2VzcydcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCA9ICggY29tbWFuZCwgaW5wdXQgKSAtPlxuICAgICAgcmV0dXJuICggQ1AuZXhlY1N5bmMgY29tbWFuZCwgeyBlbmNvZGluZzogJ3V0Zi04JywgaW5wdXQsIH0gKS5yZXBsYWNlIC9cXG4kL3MsICcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoID0gKCB0ZXh0ICkgLT5cbiAgICAgICMjIyB0aHggdG8gaHR0cHM6Ly91bml4LnN0YWNrZXhjaGFuZ2UuY29tL2EvMjU4NTUxLzI4MDIwNCAjIyNcbiAgICAgIHJldHVybiBwYXJzZUludCAoIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ICd3YyAtLW1heC1saW5lLWxlbmd0aCcsIHRleHQgKSwgMTBcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9jb21tYW5kX2xpbmVfcmVzdWx0LCBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoLCB9XG5cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9yYW5kb21fdG9vbHM6IC0+XG4gICAgeyBoaWRlLFxuICAgICAgZ2V0X3NldHRlciwgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcycgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgICMjIyBUQUlOVCByZXBsYWNlICMjI1xuICAgICMgeyBkZWZhdWx0OiBfZ2V0X3VuaXF1ZV90ZXh0LCAgfSA9IHJlcXVpcmUgJ3VuaXF1ZS1zdHJpbmcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZVxuICAgICAgY2hyX3JlOiAvLy9eKD86XFxwe0x9fFxccHtac318XFxwe1p9fFxccHtNfXxcXHB7Tn18XFxwe1B9fFxccHtTfSkkLy8vdlxuICAgICAgdGVtcGxhdGVzOiBPYmplY3QuZnJlZXplXG4gICAgICAgIHJhbmRvbV90b29sc19jZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgICBzZWVkOiAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBzaXplOiAgICAgICAgICAgICAgIDFfMDAwXG4gICAgICAgICAgbWF4X2F0dGVtcHRzOiAgICAgICAxXzAwMFxuICAgICAgICAgICMgdW5pcXVlX2NvdW50OiAgIDFfMDAwXG4gICAgICAgICAgb25fc3RhdHM6ICAgICAgICAgICBudWxsXG4gICAgICAgICAgdW5pY29kZV9jaWRfcmFuZ2U6ICBPYmplY3QuZnJlZXplIFsgMHgwMDAwLCAweDEwZmZmZiBdXG4gICAgICAgIHN0YXRzOlxuICAgICAgICAgIGNocjpcbiAgICAgICAgICAgIGF0dGVtcHRzOiAgICAgICAgIDBcbiAgICAgICAgICBzZXRfb2ZfY2hyczpcbiAgICAgICAgICAgIGF0dGVtcHRzOiAgICAgICAgIDBcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBgYGBcbiAgICAvLyB0aHggdG8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NTkzMzE2Lzc1NjgwOTFcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvc2VlZGluZy10aGUtcmFuZG9tLW51bWJlci1nZW5lcmF0b3ItaW4tamF2YXNjcmlwdFxuXG4gICAgLy8gU3BsaXRNaXgzMlxuXG4gICAgLy8gQSAzMi1iaXQgc3RhdGUgUFJORyB0aGF0IHdhcyBtYWRlIGJ5IHRha2luZyBNdXJtdXJIYXNoMydzIG1peGluZyBmdW5jdGlvbiwgYWRkaW5nIGEgaW5jcmVtZW50b3IgYW5kXG4gICAgLy8gdHdlYWtpbmcgdGhlIGNvbnN0YW50cy4gSXQncyBwb3RlbnRpYWxseSBvbmUgb2YgdGhlIGJldHRlciAzMi1iaXQgUFJOR3Mgc28gZmFyOyBldmVuIHRoZSBhdXRob3Igb2ZcbiAgICAvLyBNdWxiZXJyeTMyIGNvbnNpZGVycyBpdCB0byBiZSB0aGUgYmV0dGVyIGNob2ljZS4gSXQncyBhbHNvIGp1c3QgYXMgZmFzdC5cblxuICAgIGNvbnN0IHNwbGl0bWl4MzIgPSBmdW5jdGlvbiAoIGEgKSB7XG4gICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICBhIHw9IDA7XG4gICAgICAgYSA9IGEgKyAweDllMzc3OWI5IHwgMDtcbiAgICAgICBsZXQgdCA9IGEgXiBhID4+PiAxNjtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4MjFmMGFhYWQpO1xuICAgICAgIHQgPSB0IF4gdCA+Pj4gMTU7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDczNWEyZDk3KTtcbiAgICAgICByZXR1cm4gKCh0ID0gdCBeIHQgPj4+IDE1KSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnN0IHBybmcgPSBzcGxpdG1peDMyKChNYXRoLnJhbmRvbSgpKjIqKjMyKT4+PjApXG4gICAgLy8gZm9yKGxldCBpPTA7IGk8MTA7IGkrKykgY29uc29sZS5sb2cocHJuZygpKTtcbiAgICAvL1xuICAgIC8vIEkgd291bGQgcmVjb21tZW5kIHRoaXMgaWYgeW91IGp1c3QgbmVlZCBhIHNpbXBsZSBidXQgZ29vZCBQUk5HIGFuZCBkb24ndCBuZWVkIGJpbGxpb25zIG9mIHJhbmRvbVxuICAgIC8vIG51bWJlcnMgKHNlZSBCaXJ0aGRheSBwcm9ibGVtKS5cbiAgICAvL1xuICAgIC8vIE5vdGU6IEl0IGRvZXMgaGF2ZSBvbmUgcG90ZW50aWFsIGNvbmNlcm46IGl0IGRvZXMgbm90IHJlcGVhdCBwcmV2aW91cyBudW1iZXJzIHVudGlsIHlvdSBleGhhdXN0IDQuM1xuICAgIC8vIGJpbGxpb24gbnVtYmVycyBhbmQgaXQgcmVwZWF0cyBhZ2Fpbi4gV2hpY2ggbWF5IG9yIG1heSBub3QgYmUgYSBzdGF0aXN0aWNhbCBjb25jZXJuIGZvciB5b3VyIHVzZVxuICAgIC8vIGNhc2UuIEl0J3MgbGlrZSBhIGxpc3Qgb2YgcmFuZG9tIG51bWJlcnMgd2l0aCB0aGUgZHVwbGljYXRlcyByZW1vdmVkLCBidXQgd2l0aG91dCBhbnkgZXh0cmEgd29ya1xuICAgIC8vIGludm9sdmVkIHRvIHJlbW92ZSB0aGVtLiBBbGwgb3RoZXIgZ2VuZXJhdG9ycyBpbiB0aGlzIGxpc3QgZG8gbm90IGV4aGliaXQgdGhpcyBiZWhhdmlvci5cbiAgICBgYGBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBHZXRfcmFuZG9tXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZ2V0X3JhbmRvbV9zZWVkOiAtPiAoIE1hdGgucmFuZG9tKCkgKiAyICoqIDMyICkgPj4+IDBcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAY2ZnLnNlZWQgID89IEBjb25zdHJ1Y3Rvci5nZXRfcmFuZG9tX3NlZWQoKVxuICAgICAgICBoaWRlIEAsICdfZmxvYXQnLCBzcGxpdG1peDMyIEBjZmcuc2VlZFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgU1RBVFNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfY3JlYXRlX3N0YXRzX2ZvcjogKCBuYW1lICkgLT5cbiAgICAgICAgdW5sZXNzICggdGVtcGxhdGUgPSBpbnRlcm5hbHMudGVtcGxhdGVzLnN0YXRzWyBuYW1lIF0gKT9cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgdW5rbm93biBzdGF0cyBuYW1lICN7bmFtZX1cIiAjIyMgVEFJTlQgdXNlIHJwcigpICMjI1xuICAgICAgICBzdGF0cyA9IHsgdGVtcGxhdGUuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmIEBjZmcub25fc3RhdHM/IHRoZW4gIGZpbmlzaCA9ICggUiApID0+IEBjZmcub25fc3RhdHMgeyBuYW1lLCBzdGF0cywgUiwgfTsgUlxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICBmaW5pc2ggPSAoIFIgKSA9PiBSXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4geyBzdGF0cywgZmluaXNoLCB9XG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXQ6ICAgICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgIGludGVnZXI6ICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBNYXRoLnJvdW5kIEBmbG9hdCB7IG1pbiwgbWF4LCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB0ZXh0OiAoeyBtaW4gPSAwLCBtYXggPSAxLCBsZW5ndGggPSAxLCB9PXt9KSAtPlxuICAgICAgICByZXR1cm4gKCBAY2hyIHsgbWluLCBtYXgsIH0gZm9yIF8gaW4gWyAxIC4uIGxlbmd0aCBdICkuam9pbiAnJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4OiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBtaW4gID0gbWluLmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWluICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWF4ICA9IG1heC5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1heCApIGlzICdzdHJpbmcnXG4gICAgICAgIG1pbiA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAwIF1cbiAgICAgICAgbWF4ID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDEgXVxuICAgICAgICByZXR1cm4geyBtaW4sIG1heCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY2hyOiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgIGZpbmlzaCwgICAgIH0gPSBAX2NyZWF0ZV9zdGF0c19mb3IgJ2NocidcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBzdGF0cy5hdHRlbXB0cysrXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IGV4aGF1c3RlZFwiIGlmIHN0YXRzLmF0dGVtcHRzID4gQGNmZy5tYXhfYXR0ZW1wdHNcbiAgICAgICAgICBSID0gU3RyaW5nLmZyb21Db2RlUG9pbnQgQGludGVnZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAgIHJldHVybiAoIGZpbmlzaCBSICkgaWYgaW50ZXJuYWxzLmNocl9yZS50ZXN0ICggUiApXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX2NocnM6ICh7IG1pbiA9IG51bGwsIG1heCA9IG51bGwsIHNpemUgPSAyIH09e30pIC0+XG4gICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnc2V0X29mX2NocnMnXG4gICAgICAgIFIgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgIyMjIFRBSU5UIHJlZmFjdG9yICMjI1xuICAgICAgICBsb29wXG4gICAgICAgICAgb2xkX3NpemUgPSBSLnNpemVcbiAgICAgICAgICB3aGlsZSAoIFIuc2l6ZSBpcyBvbGRfc2l6ZSApXG4gICAgICAgICAgICBzdGF0cy5hdHRlbXB0cysrXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzYgZXhoYXVzdGVkXCIgaWYgc3RhdHMuYXR0ZW1wdHMgPiBAY2ZnLm1heF9hdHRlbXB0c1xuICAgICAgICAgICAgUi5hZGQgQGNociB7IG1pbiwgbWF4LCB9XG4gICAgICAgICAgYnJlYWsgaWYgUi5zaXplID49IHNpemVcbiAgICAgICAgcmV0dXJuICggZmluaXNoIFIgKVxuXG4gICAgICAjICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIGdldF9jb2RlcG9pID0gKCBjZmcgKSAtPlxuXG4gICAgICAjICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIGdldF91bmlxdWVfdGV4dCA9ICggY2ZnICkgLT5cbiAgICAgICMgICBjZmcgPSB7IGludGVybmFscy50ZW1wbGF0ZXMuZ2V0X3RleHRzX21hcHBlZF90b193aWR0aF9sZW5ndGhfY2ZnLi4uLCBjZmcuLi4sIH1cblxuICAgICAgIyBfZ2V0X3VuaXF1ZV90ZXh0ID0gKCBtaW5fbGVuZ3RoICkgLT4gX2dldF91bmlxdWVfdGV4dCgpWyAuLiAoIEdVWS5ybmQucmFuZG9tX2ludGVnZXIgMSwgMTUgKSBdXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnZXRfdGV4dHNfbWFwcGVkX3RvX3dpZHRoX2xlbmd0aCA9ICggY2ZnICkgLT5cbiAgICAgICAgY2ZnICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmdldF90ZXh0c19tYXBwZWRfdG9fd2lkdGhfbGVuZ3RoX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIFIgICAgICAgICA9IG5ldyBNYXAoKVxuICAgICAgICBvbGRfc2l6ZSAgPSAwXG4gICAgICAgIGxvb3BcbiAgICAgICAgICB3aGlsZSBSLnNpemUgaXMgb2xkX3NpemVcbiAgICAgICAgICAgIGVudHJ5ID0gWyBnZXRfdW5pcXVlX3RleHQoKSwgKCBHVVkucm5kLnJhbmRvbV9pbnRlZ2VyIDAsIDEwICksIF1cbiAgICAgICAgICAgIFIuc2V0IGVudHJ5Li4uXG4gICAgICAgICAgb2xkX3NpemUgPSBSLnNpemVcbiAgICAgICAgICBicmVhayBpZiBvbGRfc2l6ZSA+PSBjZmcuc2l6ZVxuICAgICAgICByZXR1cm4gUlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-brics.coffee