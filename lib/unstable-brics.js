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
        var _get_unique_text, get_codepoi, get_texts_mapped_to_width_length, get_unique_text;

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
            hide(this, '_stats', new Map());
            return void 0;
          }

          //=======================================================================================================
          // STATS
          //-------------------------------------------------------------------------------------------------------
          _reset_stats() {
            this._stats.clear();
            return null;
          }

          //-------------------------------------------------------------------------------------------------------
          _create_stats_for(name) {
            var finish, stats, template;
            this._reset_stats();
            if ((template = internals.templates.stats[name]) == null) {
              /* TAINT use rpr() */
              throw new Error(`Ω___5 unknown stats name ${name}`);
            }
            this._stats.set(name, (stats = {...template}));
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
          chr({min = null, max = null} = {}) {
            var R, finish, stats;
            ({stats, finish} = this._create_stats_for('chr'));
            if ((typeof min) === 'string') {
              //.....................................................................................................
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

          // #-------------------------------------------------------------------------------------------------------
          // unique_float: ({ min = 0, max = 1, }) ->
          //   ### TAINT refactor ###
          //   cache = @_seen.float
          //   if cache.size >= @cfg.unique_count
          //     for e from cache
          //       cache.delete e
          //       break
          //   #.....................................................................................................
          //   ### TAINT refactor ###
          //   old_size = cache.size
          //   while cache.size is old_size
          //     R = @_float()
          //     cache.add R
          //   #.....................................................................................................
          //   return R if min is 0 and max is 1
          //   return min + R * ( max - min )

            //-------------------------------------------------------------------------------------------------------
          get_unique_random() {}

        };

        //-------------------------------------------------------------------------------------------------------
        get_codepoi = function(cfg) {};

        //-------------------------------------------------------------------------------------------------------
        get_unique_text = function(cfg) {
          return cfg = {...internals.templates.get_texts_mapped_to_width_length_cfg, ...cfg};
        };

        _get_unique_text = function(min_length) {
          return _get_unique_text().slice(0, +(GUY.rnd.random_integer(1, 15)) + 1 || 9e9);
        };

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxZQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBO01BRHRCO01BRUYsRUFBQSxHQUFnQixPQUFBLENBQVEsU0FBUjtNQUNoQixJQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLEVBeEJwQjs7TUEwQkksTUFBQSxHQUFTLFFBQUEsQ0FBRSxJQUFGLENBQUE7QUFDYixZQUFBO0FBQU07VUFBSSxFQUFFLENBQUMsUUFBSCxDQUFZLElBQVosRUFBSjtTQUFxQixjQUFBO1VBQU07QUFBVyxpQkFBTyxNQUF4Qjs7QUFDckIsZUFBTztNQUZBLEVBMUJiOztNQThCSSxpQkFBQSxHQUFvQixRQUFBLENBQUUsSUFBRixDQUFBO0FBQ3hCLFlBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBO1FBQ00sSUFBc0YsQ0FBRSxPQUFPLElBQVQsQ0FBQSxLQUFtQixRQUF6Rzs7VUFBQSxNQUFNLElBQUksTUFBTSxDQUFDLG9CQUFYLENBQWdDLENBQUEsMkJBQUEsQ0FBQSxDQUE4QixHQUFBLENBQUksSUFBSixDQUE5QixDQUFBLENBQWhDLEVBQU47O1FBQ0EsTUFBK0YsSUFBSSxDQUFDLE1BQUwsR0FBYyxFQUE3RztVQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSxvQ0FBQSxDQUFBLENBQXVDLEdBQUEsQ0FBSSxJQUFKLENBQXZDLENBQUEsQ0FBaEMsRUFBTjs7UUFDQSxPQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiO1FBQ1gsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZDtRQUNYLElBQU8sbURBQVA7QUFDRSxpQkFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxDQUFBLENBQUcsR0FBRyxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQWdCLFFBQWhCLENBQUEsS0FBQSxDQUFBLENBQWdDLEdBQUcsQ0FBQyxNQUFwQyxDQUFBLENBQW5CLEVBRFQ7O1FBRUEsQ0FBQSxDQUFFLEtBQUYsRUFBUyxFQUFULENBQUEsR0FBa0IsS0FBSyxDQUFDLE1BQXhCO1FBQ0EsRUFBQSxHQUFrQixDQUFBLENBQUEsQ0FBRyxDQUFFLFFBQUEsQ0FBUyxFQUFULEVBQWEsRUFBYixDQUFGLENBQUEsR0FBc0IsQ0FBekIsQ0FBQSxDQUE0QixDQUFDLFFBQTdCLENBQXNDLENBQXRDLEVBQXlDLEdBQXpDO1FBQ2xCLElBQUEsR0FBa0I7QUFDbEIsZUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxDQUFBLENBQUcsR0FBRyxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQWdCLEtBQWhCLENBQUEsQ0FBQSxDQUFBLENBQXlCLEVBQXpCLENBQUEsQ0FBQSxDQUE4QixHQUFHLENBQUMsTUFBbEMsQ0FBQSxDQUFuQjtNQVhXLEVBOUJ4Qjs7TUEyQ0ksc0JBQUEsR0FBeUIsUUFBQSxDQUFFLElBQUYsQ0FBQTtBQUM3QixZQUFBLENBQUEsRUFBQTtRQUFNLENBQUEsR0FBZ0I7UUFDaEIsYUFBQSxHQUFnQixDQUFDO0FBRWpCLGVBQUEsSUFBQSxHQUFBOzs7VUFFRSxhQUFBO1VBQ0EsSUFBRyxhQUFBLEdBQWdCLEdBQUcsQ0FBQyxZQUF2QjtZQUNFLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSxnQkFBQSxDQUFBLENBQW1CLGFBQW5CLENBQUEsaUJBQUEsQ0FBQSxDQUFvRCxHQUFBLENBQUksQ0FBSixDQUFwRCxDQUFBLE9BQUEsQ0FBaEMsRUFEUjtXQUZSOztVQUtRLENBQUEsR0FBSSxpQkFBQSxDQUFrQixDQUFsQjtVQUNKLEtBQWEsTUFBQSxDQUFPLENBQVAsQ0FBYjtBQUFBLGtCQUFBOztRQVBGO0FBUUEsZUFBTztNQVpnQixFQTNDN0I7Ozs7QUEyREksYUFBTyxPQUFBLEdBQVUsQ0FBRSxzQkFBRixFQUEwQixpQkFBMUIsRUFBNkMsTUFBN0MsRUFBcUQsaUJBQXJELEVBQXdFLE1BQXhFO0lBNURTLENBQTVCOzs7SUFnRUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsT0FBQSxFQUFBLHVCQUFBLEVBQUE7TUFBSSxFQUFBLEdBQUssT0FBQSxDQUFRLG9CQUFSLEVBQVQ7O01BRUksdUJBQUEsR0FBMEIsUUFBQSxDQUFFLE9BQUYsRUFBVyxLQUFYLENBQUE7QUFDeEIsZUFBTyxDQUFFLEVBQUUsQ0FBQyxRQUFILENBQVksT0FBWixFQUFxQjtVQUFFLFFBQUEsRUFBVSxPQUFaO1VBQXFCO1FBQXJCLENBQXJCLENBQUYsQ0FBc0QsQ0FBQyxPQUF2RCxDQUErRCxNQUEvRCxFQUF1RSxFQUF2RTtNQURpQixFQUY5Qjs7TUFNSSxzQkFBQSxHQUF5QixRQUFBLENBQUUsSUFBRixDQUFBLEVBQUE7O0FBRXZCLGVBQU8sUUFBQSxDQUFXLHVCQUFBLENBQXdCLHNCQUF4QixFQUFnRCxJQUFoRCxDQUFYLEVBQW1FLEVBQW5FO01BRmdCLEVBTjdCOztBQVdJLGFBQU8sT0FBQSxHQUFVLENBQUUsdUJBQUYsRUFBMkIsc0JBQTNCO0lBWlMsQ0FoRTVCOzs7SUFpRkEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsT0FBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUE7TUFBSSxDQUFBLENBQUUsSUFBRixFQUNFLFVBREYsQ0FBQSxHQUNrQyxDQUFFLE9BQUEsQ0FBUSxpQkFBUixDQUFGLENBQTZCLENBQUMsOEJBQTlCLENBQUEsQ0FEbEMsRUFBSjs7Ozs7TUFNSSxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQVAsQ0FDVjtRQUFBLE1BQUEsRUFBUSxtREFBUjtRQUNBLFNBQUEsRUFBVyxNQUFNLENBQUMsTUFBUCxDQUNUO1VBQUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLE1BQVAsQ0FDaEI7WUFBQSxJQUFBLEVBQW9CLElBQXBCO1lBQ0EsSUFBQSxFQUFvQixLQURwQjtZQUVBLFlBQUEsRUFBb0IsS0FGcEI7O1lBSUEsUUFBQSxFQUFvQixJQUpwQjtZQUtBLGlCQUFBLEVBQW9CLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBRSxNQUFGLEVBQVUsUUFBVixDQUFkO1VBTHBCLENBRGdCLENBQWxCO1VBT0EsS0FBQSxFQUNFO1lBQUEsR0FBQSxFQUNFO2NBQUEsUUFBQSxFQUFrQjtZQUFsQjtVQURGO1FBUkYsQ0FEUztNQURYLENBRFU7TUFlWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW1DTTs7OztRQUFOLE1BQUEsV0FBQSxDQUFBOztVQUdvQixPQUFqQixlQUFpQixDQUFBLENBQUE7bUJBQUcsQ0FBRSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBQSxJQUFLLEVBQXZCLENBQUEsS0FBZ0M7VUFBbkMsQ0FEeEI7OztVQUlNLFdBQWEsQ0FBRSxHQUFGLENBQUE7QUFDbkIsZ0JBQUE7WUFBUSxJQUFDLENBQUEsR0FBRCxHQUFjLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLGdCQUF0QixFQUEyQyxHQUFBLEdBQTNDOztrQkFDVixDQUFDLE9BQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxlQUFiLENBQUE7O1lBQ2QsSUFBQSxDQUFLLElBQUwsRUFBUSxRQUFSLEVBQWtCLFVBQUEsQ0FBVyxJQUFDLENBQUEsR0FBRyxDQUFDLElBQWhCLENBQWxCO1lBQ0EsSUFBQSxDQUFLLElBQUwsRUFBUSxRQUFSLEVBQWtCLElBQUksR0FBSixDQUFBLENBQWxCO0FBQ0EsbUJBQU87VUFMSSxDQUpuQjs7Ozs7VUFlTSxZQUFjLENBQUEsQ0FBQTtZQUNaLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFBO0FBQ0EsbUJBQU87VUFGSyxDQWZwQjs7O1VBb0JNLGlCQUFtQixDQUFFLElBQUYsQ0FBQTtBQUN6QixnQkFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBO1lBQVEsSUFBQyxDQUFBLFlBQUQsQ0FBQTtZQUNBLElBQU8sb0RBQVA7O2NBRUUsTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLHlCQUFBLENBQUEsQ0FBNEIsSUFBNUIsQ0FBQSxDQUFWLEVBRlI7O1lBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLENBQVksSUFBWixFQUFrQixDQUFFLEtBQUEsR0FBUSxDQUFFLEdBQUEsUUFBRixDQUFWLENBQWxCLEVBSlI7O1lBTVEsSUFBRyx5QkFBSDtjQUF3QixNQUFBLEdBQVMsQ0FBRSxDQUFGLENBQUEsR0FBQTtnQkFBUyxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxDQUFFLElBQUYsRUFBUSxLQUFSLEVBQWUsQ0FBZixDQUFkO3VCQUFtQztjQUE1QyxFQUFqQzthQUFBLE1BQUE7Y0FDd0IsTUFBQSxHQUFTLENBQUUsQ0FBRixDQUFBLEdBQUE7dUJBQVM7Y0FBVCxFQURqQzthQU5SOztBQVNRLG1CQUFPLENBQUUsS0FBRixFQUFTLE1BQVQ7VUFWVSxDQXBCekI7Ozs7O1VBbUNNLEtBQVUsQ0FBQyxDQUFFLEdBQUEsR0FBTSxDQUFSLEVBQVcsR0FBQSxHQUFNLENBQWpCLElBQXNCLENBQUEsQ0FBdkIsQ0FBQTttQkFBOEIsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxHQUFZLENBQUUsR0FBQSxHQUFNLEdBQVI7VUFBaEQ7O1VBQ1YsT0FBVSxDQUFDLENBQUUsR0FBQSxHQUFNLENBQVIsRUFBVyxHQUFBLEdBQU0sQ0FBakIsSUFBc0IsQ0FBQSxDQUF2QixDQUFBO21CQUE4QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFQLENBQVg7VUFBOUIsQ0FwQ2hCOzs7VUF1Q00sSUFBTSxDQUFDLENBQUUsR0FBQSxHQUFNLENBQVIsRUFBVyxHQUFBLEdBQU0sQ0FBakIsRUFBb0IsTUFBQSxHQUFTLENBQTdCLElBQWtDLENBQUEsQ0FBbkMsQ0FBQTtBQUNaLGdCQUFBO0FBQVEsbUJBQU87O0FBQUU7Y0FBQSxLQUE0QixtRkFBNUI7NkJBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFFLEdBQUYsRUFBTyxHQUFQLENBQUw7Y0FBQSxDQUFBOzt5QkFBRixDQUErQyxDQUFDLElBQWhELENBQXFELEVBQXJEO1VBREgsQ0F2Q1o7OztVQTJDTSxHQUFLLENBQUMsQ0FBRSxHQUFBLEdBQU0sSUFBUixFQUFjLEdBQUEsR0FBTSxJQUFwQixJQUE0QixDQUFBLENBQTdCLENBQUE7QUFDWCxnQkFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBO1lBQVEsQ0FBQSxDQUFFLEtBQUYsRUFDRSxNQURGLENBQUEsR0FDa0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLEtBQW5CLENBRGxCO1lBR0EsSUFBdUMsQ0FBRSxPQUFPLEdBQVQsQ0FBQSxLQUFrQixRQUF6RDs7Y0FBQSxHQUFBLEdBQWtCLEdBQUcsQ0FBQyxXQUFKLENBQWdCLENBQWhCLEVBQWxCOztZQUNBLElBQXVDLENBQUUsT0FBTyxHQUFULENBQUEsS0FBa0IsUUFBekQ7Y0FBQSxHQUFBLEdBQWtCLEdBQUcsQ0FBQyxXQUFKLENBQWdCLENBQWhCLEVBQWxCOzs7Y0FDQSxNQUFrQixJQUFDLENBQUEsR0FBRyxDQUFDLGlCQUFpQixDQUFFLENBQUY7OztjQUN4QyxNQUFrQixJQUFDLENBQUEsR0FBRyxDQUFDLGlCQUFpQixDQUFFLENBQUY7O0FBRXhDLG1CQUFBLElBQUEsR0FBQTs7Y0FDRSxLQUFLLENBQUMsUUFBTjtjQUNBLElBQXFDLEtBQUssQ0FBQyxRQUFOLEdBQWlCLElBQUMsQ0FBQSxHQUFHLENBQUMsWUFBM0Q7Z0JBQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVixFQUFOOztjQUNBLENBQUEsR0FBSSxNQUFNLENBQUMsYUFBUCxDQUFxQixJQUFDLENBQUEsT0FBRCxDQUFTLENBQUUsR0FBRixFQUFPLEdBQVAsQ0FBVCxDQUFyQjtjQUNKLElBQXVCLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBakIsQ0FBd0IsQ0FBeEIsQ0FBdkI7QUFBQSx1QkFBUyxNQUFBLENBQU8sQ0FBUCxFQUFUOztZQUpGLENBUlI7O0FBY1EsbUJBQU87VUFmSixDQTNDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBK0VNLGlCQUFtQixDQUFBLENBQUEsRUFBQTs7UUFqRnJCOzs7UUFvRkUsV0FBQSxHQUFjLFFBQUEsQ0FBRSxHQUFGLENBQUEsRUFBQTs7O1FBR2QsZUFBQSxHQUFrQixRQUFBLENBQUUsR0FBRixDQUFBO2lCQUNoQixHQUFBLEdBQU0sQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsb0NBQXRCLEVBQStELEdBQUEsR0FBL0Q7UUFEVTs7UUFHbEIsZ0JBQUEsR0FBbUIsUUFBQSxDQUFFLFVBQUYsQ0FBQTtpQkFBa0IsZ0JBQUEsQ0FBQSxDQUFrQjtRQUFwQzs7O1FBR25CLGdDQUFBLEdBQW1DLFFBQUEsQ0FBRSxHQUFGLENBQUE7QUFDekMsY0FBQSxDQUFBLEVBQUEsS0FBQSxFQUFBO1VBQVEsR0FBQSxHQUFZLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLG9DQUF0QixFQUErRCxHQUFBLEdBQS9EO1VBQ1osQ0FBQSxHQUFZLElBQUksR0FBSixDQUFBO1VBQ1osUUFBQSxHQUFZO0FBQ1osaUJBQUEsSUFBQTtBQUNFLG1CQUFNLENBQUMsQ0FBQyxJQUFGLEtBQVUsUUFBaEI7Y0FDRSxLQUFBLEdBQVEsQ0FBRSxlQUFBLENBQUEsQ0FBRixFQUF1QixHQUFHLENBQUMsR0FBRyxDQUFDLGNBQVIsQ0FBdUIsQ0FBdkIsRUFBMEIsRUFBMUIsQ0FBdkI7Y0FDUixDQUFDLENBQUMsR0FBRixDQUFNLEdBQUEsS0FBTjtZQUZGO1lBR0EsUUFBQSxHQUFXLENBQUMsQ0FBQztZQUNiLElBQVMsUUFBQSxJQUFZLEdBQUcsQ0FBQyxJQUF6QjtBQUFBLG9CQUFBOztVQUxGO0FBTUEsaUJBQU87UUFWMEI7Ozs7b0JBckp6Qzs7QUFrS0ksYUFBTyxPQUFBLEdBQVUsQ0FBRSxVQUFGLEVBQWMsU0FBZDtJQW5LRztFQWpGdEIsRUFWRjs7O0VBa1FBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLGNBQTlCO0FBbFFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX25leHRfZnJlZV9maWxlbmFtZTogLT5cbiAgICBjZmcgPVxuICAgICAgbWF4X2F0dGVtcHRzOiAgIDk5OTlcbiAgICAgIHByZWZpeDogICAgICAgICAnfi4nXG4gICAgICBzdWZmaXg6ICAgICAgICAgJy5icmljYWJyYWMtY2FjaGUnXG4gICAgY2FjaGVfZmlsZW5hbWVfcmUgPSAvLy9cbiAgICAgIF5cbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnByZWZpeH0gKVxuICAgICAgKD88Zmlyc3Q+LiopXG4gICAgICBcXC5cbiAgICAgICg/PG5yPlswLTldezR9KVxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgICAkXG4gICAgICAvLy92XG4gICAgIyBjYWNoZV9zdWZmaXhfcmUgPSAvLy9cbiAgICAjICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgIyAgICRcbiAgICAjICAgLy8vdlxuICAgIHJwciAgICAgICAgICAgICAgID0gKCB4ICkgLT5cbiAgICAgIHJldHVybiBcIicje3gucmVwbGFjZSAvJy9nLCBcIlxcXFwnXCIgaWYgKCB0eXBlb2YgeCApIGlzICdzdHJpbmcnfSdcIlxuICAgICAgcmV0dXJuIFwiI3t4fVwiXG4gICAgZXJyb3JzID1cbiAgICAgIFRNUF9leGhhdXN0aW9uX2Vycm9yOiBjbGFzcyBUTVBfZXhoYXVzdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgICBUTVBfdmFsaWRhdGlvbl9lcnJvcjogY2xhc3MgVE1QX3ZhbGlkYXRpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgIEZTICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuICAgIFBBVEggICAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBleGlzdHMgPSAoIHBhdGggKSAtPlxuICAgICAgdHJ5IEZTLnN0YXRTeW5jIHBhdGggY2F0Y2ggZXJyb3IgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiB0cnVlXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB0eXBlIGNoZWNraW5nICMjI1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMSBleHBlY3RlZCBhIHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyAoIHR5cGVvZiBwYXRoICkgaXMgJ3N0cmluZydcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzIgZXhwZWN0ZWQgYSBub25lbXB0eSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgcGF0aC5sZW5ndGggPiAwXG4gICAgICBkaXJuYW1lICA9IFBBVEguZGlybmFtZSBwYXRoXG4gICAgICBiYXNlbmFtZSA9IFBBVEguYmFzZW5hbWUgcGF0aFxuICAgICAgdW5sZXNzICggbWF0Y2ggPSBiYXNlbmFtZS5tYXRjaCBjYWNoZV9maWxlbmFtZV9yZSApP1xuICAgICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7YmFzZW5hbWV9LjAwMDEje2NmZy5zdWZmaXh9XCJcbiAgICAgIHsgZmlyc3QsIG5yLCAgfSA9IG1hdGNoLmdyb3Vwc1xuICAgICAgbnIgICAgICAgICAgICAgID0gXCIjeyggcGFyc2VJbnQgbnIsIDEwICkgKyAxfVwiLnBhZFN0YXJ0IDQsICcwJ1xuICAgICAgcGF0aCAgICAgICAgICAgID0gZmlyc3RcbiAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tmaXJzdH0uI3tucn0je2NmZy5zdWZmaXh9XCJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgUiAgICAgICAgICAgICA9IHBhdGhcbiAgICAgIGZhaWx1cmVfY291bnQgPSAtMVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBsb29wXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZmFpbHVyZV9jb3VudCsrXG4gICAgICAgIGlmIGZhaWx1cmVfY291bnQgPiBjZmcubWF4X2F0dGVtcHRzXG4gICAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfZXhoYXVzdGlvbl9lcnJvciBcIs6pX19fMyB0b28gbWFueSAoI3tmYWlsdXJlX2NvdW50fSkgYXR0ZW1wdHM7IHBhdGggI3tycHIgUn0gZXhpc3RzXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBSID0gZ2V0X25leHRfZmlsZW5hbWUgUlxuICAgICAgICBicmVhayB1bmxlc3MgZXhpc3RzIFJcbiAgICAgIHJldHVybiBSXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIHN3YXBfc3VmZml4ID0gKCBwYXRoLCBzdWZmaXggKSAtPiBwYXRoLnJlcGxhY2UgY2FjaGVfc3VmZml4X3JlLCBzdWZmaXhcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lLCBnZXRfbmV4dF9maWxlbmFtZSwgZXhpc3RzLCBjYWNoZV9maWxlbmFtZV9yZSwgZXJyb3JzLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY29tbWFuZF9saW5lX3Rvb2xzOiAtPlxuICAgIENQID0gcmVxdWlyZSAnbm9kZTpjaGlsZF9wcm9jZXNzJ1xuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ID0gKCBjb21tYW5kLCBpbnB1dCApIC0+XG4gICAgICByZXR1cm4gKCBDUC5leGVjU3luYyBjb21tYW5kLCB7IGVuY29kaW5nOiAndXRmLTgnLCBpbnB1dCwgfSApLnJlcGxhY2UgL1xcbiQvcywgJydcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF93Y19tYXhfbGluZV9sZW5ndGggPSAoIHRleHQgKSAtPlxuICAgICAgIyMjIHRoeCB0byBodHRwczovL3VuaXguc3RhY2tleGNoYW5nZS5jb20vYS8yNTg1NTEvMjgwMjA0ICMjI1xuICAgICAgcmV0dXJuIHBhcnNlSW50ICggZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgJ3djIC0tbWF4LWxpbmUtbGVuZ3RoJywgdGV4dCApLCAxMFxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQsIGdldF93Y19tYXhfbGluZV9sZW5ndGgsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3JhbmRvbV90b29sczogLT5cbiAgICB7IGhpZGUsXG4gICAgICBnZXRfc2V0dGVyLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyMjIFRBSU5UIHJlcGxhY2UgIyMjXG4gICAgIyB7IGRlZmF1bHQ6IF9nZXRfdW5pcXVlX3RleHQsICB9ID0gcmVxdWlyZSAndW5pcXVlLXN0cmluZydcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplXG4gICAgICBjaHJfcmU6IC8vL14oPzpcXHB7TH18XFxwe1pzfXxcXHB7Wn18XFxwe019fFxccHtOfXxcXHB7UH18XFxwe1N9KSQvLy92XG4gICAgICB0ZW1wbGF0ZXM6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcmFuZG9tX3Rvb2xzX2NmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICAgIHNlZWQ6ICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMV8wMDBcbiAgICAgICAgICBtYXhfYXR0ZW1wdHM6ICAgICAgIDFfMDAwXG4gICAgICAgICAgIyB1bmlxdWVfY291bnQ6ICAgMV8wMDBcbiAgICAgICAgICBvbl9zdGF0czogICAgICAgICAgIG51bGxcbiAgICAgICAgICB1bmljb2RlX2NpZF9yYW5nZTogIE9iamVjdC5mcmVlemUgWyAweDAwMDAsIDB4MTBmZmZmIF1cbiAgICAgICAgc3RhdHM6XG4gICAgICAgICAgY2hyOlxuICAgICAgICAgICAgYXR0ZW1wdHM6ICAgICAgICAgMFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGBgYFxuICAgIC8vIHRoeCB0byBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDc1OTMzMTYvNzU2ODA5MVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9zZWVkaW5nLXRoZS1yYW5kb20tbnVtYmVyLWdlbmVyYXRvci1pbi1qYXZhc2NyaXB0XG5cbiAgICAvLyBTcGxpdE1peDMyXG5cbiAgICAvLyBBIDMyLWJpdCBzdGF0ZSBQUk5HIHRoYXQgd2FzIG1hZGUgYnkgdGFraW5nIE11cm11ckhhc2gzJ3MgbWl4aW5nIGZ1bmN0aW9uLCBhZGRpbmcgYSBpbmNyZW1lbnRvciBhbmRcbiAgICAvLyB0d2Vha2luZyB0aGUgY29uc3RhbnRzLiBJdCdzIHBvdGVudGlhbGx5IG9uZSBvZiB0aGUgYmV0dGVyIDMyLWJpdCBQUk5HcyBzbyBmYXI7IGV2ZW4gdGhlIGF1dGhvciBvZlxuICAgIC8vIE11bGJlcnJ5MzIgY29uc2lkZXJzIGl0IHRvIGJlIHRoZSBiZXR0ZXIgY2hvaWNlLiBJdCdzIGFsc28ganVzdCBhcyBmYXN0LlxuXG4gICAgY29uc3Qgc3BsaXRtaXgzMiA9IGZ1bmN0aW9uICggYSApIHtcbiAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgIGEgfD0gMDtcbiAgICAgICBhID0gYSArIDB4OWUzNzc5YjkgfCAwO1xuICAgICAgIGxldCB0ID0gYSBeIGEgPj4+IDE2O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHgyMWYwYWFhZCk7XG4gICAgICAgdCA9IHQgXiB0ID4+PiAxNTtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4NzM1YTJkOTcpO1xuICAgICAgIHJldHVybiAoKHQgPSB0IF4gdCA+Pj4gMTUpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc3QgcHJuZyA9IHNwbGl0bWl4MzIoKE1hdGgucmFuZG9tKCkqMioqMzIpPj4+MClcbiAgICAvLyBmb3IobGV0IGk9MDsgaTwxMDsgaSsrKSBjb25zb2xlLmxvZyhwcm5nKCkpO1xuICAgIC8vXG4gICAgLy8gSSB3b3VsZCByZWNvbW1lbmQgdGhpcyBpZiB5b3UganVzdCBuZWVkIGEgc2ltcGxlIGJ1dCBnb29kIFBSTkcgYW5kIGRvbid0IG5lZWQgYmlsbGlvbnMgb2YgcmFuZG9tXG4gICAgLy8gbnVtYmVycyAoc2VlIEJpcnRoZGF5IHByb2JsZW0pLlxuICAgIC8vXG4gICAgLy8gTm90ZTogSXQgZG9lcyBoYXZlIG9uZSBwb3RlbnRpYWwgY29uY2VybjogaXQgZG9lcyBub3QgcmVwZWF0IHByZXZpb3VzIG51bWJlcnMgdW50aWwgeW91IGV4aGF1c3QgNC4zXG4gICAgLy8gYmlsbGlvbiBudW1iZXJzIGFuZCBpdCByZXBlYXRzIGFnYWluLiBXaGljaCBtYXkgb3IgbWF5IG5vdCBiZSBhIHN0YXRpc3RpY2FsIGNvbmNlcm4gZm9yIHlvdXIgdXNlXG4gICAgLy8gY2FzZS4gSXQncyBsaWtlIGEgbGlzdCBvZiByYW5kb20gbnVtYmVycyB3aXRoIHRoZSBkdXBsaWNhdGVzIHJlbW92ZWQsIGJ1dCB3aXRob3V0IGFueSBleHRyYSB3b3JrXG4gICAgLy8gaW52b2x2ZWQgdG8gcmVtb3ZlIHRoZW0uIEFsbCBvdGhlciBnZW5lcmF0b3JzIGluIHRoaXMgbGlzdCBkbyBub3QgZXhoaWJpdCB0aGlzIGJlaGF2aW9yLlxuICAgIGBgYFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEdldF9yYW5kb21cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBnZXRfcmFuZG9tX3NlZWQ6IC0+ICggTWF0aC5yYW5kb20oKSAqIDIgKiogMzIgKSA+Pj4gMFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgQGNmZyAgICAgICAgPSB7IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEBjZmcuc2VlZCAgPz0gQGNvbnN0cnVjdG9yLmdldF9yYW5kb21fc2VlZCgpXG4gICAgICAgIGhpZGUgQCwgJ19mbG9hdCcsIHNwbGl0bWl4MzIgQGNmZy5zZWVkXG4gICAgICAgIGhpZGUgQCwgJ19zdGF0cycsIG5ldyBNYXAoKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgU1RBVFNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfcmVzZXRfc3RhdHM6IC0+XG4gICAgICAgIEBfc3RhdHMuY2xlYXIoKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2NyZWF0ZV9zdGF0c19mb3I6ICggbmFtZSApIC0+XG4gICAgICAgIEBfcmVzZXRfc3RhdHMoKVxuICAgICAgICB1bmxlc3MgKCB0ZW1wbGF0ZSA9IGludGVybmFscy50ZW1wbGF0ZXMuc3RhdHNbIG5hbWUgXSApP1xuICAgICAgICAgICMjIyBUQUlOVCB1c2UgcnByKCkgIyMjXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IHVua25vd24gc3RhdHMgbmFtZSAje25hbWV9XCJcbiAgICAgICAgQF9zdGF0cy5zZXQgbmFtZSwgKCBzdGF0cyA9IHsgdGVtcGxhdGUuLi4sIH0gKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgaWYgQGNmZy5vbl9zdGF0cz8gdGhlbiAgZmluaXNoID0gKCBSICkgPT4gQGNmZy5vbl9zdGF0cyB7IG5hbWUsIHN0YXRzLCBSLCB9OyBSXG4gICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgIGZpbmlzaCA9ICggUiApID0+IFJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiB7IHN0YXRzLCBmaW5pc2gsIH1cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmbG9hdDogICAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgaW50ZWdlcjogICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IE1hdGgucm91bmQgQGZsb2F0IHsgbWluLCBtYXgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRleHQ6ICh7IG1pbiA9IDAsIG1heCA9IDEsIGxlbmd0aCA9IDEsIH09e30pIC0+XG4gICAgICAgIHJldHVybiAoIEBjaHIgeyBtaW4sIG1heCwgfSBmb3IgXyBpbiBbIDEgLi4gbGVuZ3RoIF0gKS5qb2luICcnXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjaHI6ICh7IG1pbiA9IG51bGwsIG1heCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnY2hyJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbWluICAgICAgICAgICAgID0gbWluLmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWluICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWF4ICAgICAgICAgICAgID0gbWF4LmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWF4ICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWluICAgICAgICAgICAgPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMCBdXG4gICAgICAgIG1heCAgICAgICAgICAgID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDEgXVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbG9vcFxuICAgICAgICAgIHN0YXRzLmF0dGVtcHRzKytcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgZXhoYXVzdGVkXCIgaWYgc3RhdHMuYXR0ZW1wdHMgPiBAY2ZnLm1heF9hdHRlbXB0c1xuICAgICAgICAgIFIgPSBTdHJpbmcuZnJvbUNvZGVQb2ludCBAaW50ZWdlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICAgcmV0dXJuICggZmluaXNoIFIgKSBpZiBpbnRlcm5hbHMuY2hyX3JlLnRlc3QgKCBSIClcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMgdW5pcXVlX2Zsb2F0OiAoeyBtaW4gPSAwLCBtYXggPSAxLCB9KSAtPlxuICAgICAgIyAgICMjIyBUQUlOVCByZWZhY3RvciAjIyNcbiAgICAgICMgICBjYWNoZSA9IEBfc2Vlbi5mbG9hdFxuICAgICAgIyAgIGlmIGNhY2hlLnNpemUgPj0gQGNmZy51bmlxdWVfY291bnRcbiAgICAgICMgICAgIGZvciBlIGZyb20gY2FjaGVcbiAgICAgICMgICAgICAgY2FjaGUuZGVsZXRlIGVcbiAgICAgICMgICAgICAgYnJlYWtcbiAgICAgICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMgICAjIyMgVEFJTlQgcmVmYWN0b3IgIyMjXG4gICAgICAjICAgb2xkX3NpemUgPSBjYWNoZS5zaXplXG4gICAgICAjICAgd2hpbGUgY2FjaGUuc2l6ZSBpcyBvbGRfc2l6ZVxuICAgICAgIyAgICAgUiA9IEBfZmxvYXQoKVxuICAgICAgIyAgICAgY2FjaGUuYWRkIFJcbiAgICAgICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMgICByZXR1cm4gUiBpZiBtaW4gaXMgMCBhbmQgbWF4IGlzIDFcbiAgICAgICMgICByZXR1cm4gbWluICsgUiAqICggbWF4IC0gbWluIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGdldF91bmlxdWVfcmFuZG9tOiAtPlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZ2V0X2NvZGVwb2kgPSAoIGNmZyApIC0+XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnZXRfdW5pcXVlX3RleHQgPSAoIGNmZyApIC0+XG4gICAgICAgIGNmZyA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5nZXRfdGV4dHNfbWFwcGVkX3RvX3dpZHRoX2xlbmd0aF9jZmcuLi4sIGNmZy4uLiwgfVxuXG4gICAgICBfZ2V0X3VuaXF1ZV90ZXh0ID0gKCBtaW5fbGVuZ3RoICkgLT4gX2dldF91bmlxdWVfdGV4dCgpWyAuLiAoIEdVWS5ybmQucmFuZG9tX2ludGVnZXIgMSwgMTUgKSBdXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnZXRfdGV4dHNfbWFwcGVkX3RvX3dpZHRoX2xlbmd0aCA9ICggY2ZnICkgLT5cbiAgICAgICAgY2ZnICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmdldF90ZXh0c19tYXBwZWRfdG9fd2lkdGhfbGVuZ3RoX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIFIgICAgICAgICA9IG5ldyBNYXAoKVxuICAgICAgICBvbGRfc2l6ZSAgPSAwXG4gICAgICAgIGxvb3BcbiAgICAgICAgICB3aGlsZSBSLnNpemUgaXMgb2xkX3NpemVcbiAgICAgICAgICAgIGVudHJ5ID0gWyBnZXRfdW5pcXVlX3RleHQoKSwgKCBHVVkucm5kLnJhbmRvbV9pbnRlZ2VyIDAsIDEwICksIF1cbiAgICAgICAgICAgIFIuc2V0IGVudHJ5Li4uXG4gICAgICAgICAgb2xkX3NpemUgPSBSLnNpemVcbiAgICAgICAgICBicmVhayBpZiBvbGRfc2l6ZSA+PSBjZmcuc2l6ZVxuICAgICAgICByZXR1cm4gUlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-brics.coffee