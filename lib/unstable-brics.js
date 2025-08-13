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

      };
      //=========================================================================================================
      return exports = {Get_random, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxXQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBO01BRHRCO01BRUYsRUFBQSxHQUFnQixPQUFBLENBQVEsU0FBUjtNQUNoQixJQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLEVBeEJwQjs7TUEwQkksTUFBQSxHQUFTLFFBQUEsQ0FBRSxJQUFGLENBQUE7QUFDYixZQUFBO0FBQU07VUFBSSxFQUFFLENBQUMsUUFBSCxDQUFZLElBQVosRUFBSjtTQUFxQixjQUFBO1VBQU07QUFBVyxpQkFBTyxNQUF4Qjs7QUFDckIsZUFBTztNQUZBLEVBMUJiOztNQThCSSxpQkFBQSxHQUFvQixRQUFBLENBQUUsSUFBRixDQUFBO0FBQ3hCLFlBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBO1FBQ00sSUFBc0YsQ0FBRSxPQUFPLElBQVQsQ0FBQSxLQUFtQixRQUF6Rzs7VUFBQSxNQUFNLElBQUksTUFBTSxDQUFDLG9CQUFYLENBQWdDLENBQUEsMkJBQUEsQ0FBQSxDQUE4QixHQUFBLENBQUksSUFBSixDQUE5QixDQUFBLENBQWhDLEVBQU47O1FBQ0EsTUFBK0YsSUFBSSxDQUFDLE1BQUwsR0FBYyxFQUE3RztVQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSxvQ0FBQSxDQUFBLENBQXVDLEdBQUEsQ0FBSSxJQUFKLENBQXZDLENBQUEsQ0FBaEMsRUFBTjs7UUFDQSxPQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiO1FBQ1gsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZDtRQUNYLElBQU8sbURBQVA7QUFDRSxpQkFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxDQUFBLENBQUcsR0FBRyxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQWdCLFFBQWhCLENBQUEsS0FBQSxDQUFBLENBQWdDLEdBQUcsQ0FBQyxNQUFwQyxDQUFBLENBQW5CLEVBRFQ7O1FBRUEsQ0FBQSxDQUFFLEtBQUYsRUFBUyxFQUFULENBQUEsR0FBa0IsS0FBSyxDQUFDLE1BQXhCO1FBQ0EsRUFBQSxHQUFrQixDQUFBLENBQUEsQ0FBRyxDQUFFLFFBQUEsQ0FBUyxFQUFULEVBQWEsRUFBYixDQUFGLENBQUEsR0FBc0IsQ0FBekIsQ0FBQSxDQUE0QixDQUFDLFFBQTdCLENBQXNDLENBQXRDLEVBQXlDLEdBQXpDO1FBQ2xCLElBQUEsR0FBa0I7QUFDbEIsZUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxDQUFBLENBQUcsR0FBRyxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQWdCLEtBQWhCLENBQUEsQ0FBQSxDQUFBLENBQXlCLEVBQXpCLENBQUEsQ0FBQSxDQUE4QixHQUFHLENBQUMsTUFBbEMsQ0FBQSxDQUFuQjtNQVhXLEVBOUJ4Qjs7TUEyQ0ksc0JBQUEsR0FBeUIsUUFBQSxDQUFFLElBQUYsQ0FBQTtBQUM3QixZQUFBLENBQUEsRUFBQTtRQUFNLENBQUEsR0FBZ0I7UUFDaEIsYUFBQSxHQUFnQixDQUFDO0FBRWpCLGVBQUEsSUFBQSxHQUFBOzs7VUFFRSxhQUFBO1VBQ0EsSUFBRyxhQUFBLEdBQWdCLEdBQUcsQ0FBQyxXQUF2QjtZQUNHLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSxnQkFBQSxDQUFBLENBQW1CLGFBQW5CLENBQUEsaUJBQUEsQ0FBQSxDQUFvRCxHQUFBLENBQUksQ0FBSixDQUFwRCxDQUFBLE9BQUEsQ0FBaEMsRUFEVDtXQUZSOztVQUtRLENBQUEsR0FBSSxpQkFBQSxDQUFrQixDQUFsQjtVQUNKLEtBQWEsTUFBQSxDQUFPLENBQVAsQ0FBYjtBQUFBLGtCQUFBOztRQVBGO0FBUUEsZUFBTztNQVpnQixFQTNDN0I7Ozs7QUEyREksYUFBTyxPQUFBLEdBQVUsQ0FBRSxzQkFBRixFQUEwQixpQkFBMUIsRUFBNkMsTUFBN0MsRUFBcUQsaUJBQXJELEVBQXdFLE1BQXhFO0lBNURTLENBQTVCOzs7SUFnRUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsT0FBQSxFQUFBLHVCQUFBLEVBQUE7TUFBSSxFQUFBLEdBQUssT0FBQSxDQUFRLG9CQUFSLEVBQVQ7O01BRUksdUJBQUEsR0FBMEIsUUFBQSxDQUFFLE9BQUYsRUFBVyxLQUFYLENBQUE7QUFDeEIsZUFBTyxDQUFFLEVBQUUsQ0FBQyxRQUFILENBQVksT0FBWixFQUFxQjtVQUFFLFFBQUEsRUFBVSxPQUFaO1VBQXFCO1FBQXJCLENBQXJCLENBQUYsQ0FBc0QsQ0FBQyxPQUF2RCxDQUErRCxNQUEvRCxFQUF1RSxFQUF2RTtNQURpQixFQUY5Qjs7TUFNSSxzQkFBQSxHQUF5QixRQUFBLENBQUUsSUFBRixDQUFBLEVBQUE7O0FBRXZCLGVBQU8sUUFBQSxDQUFXLHVCQUFBLENBQXdCLHNCQUF4QixFQUFnRCxJQUFoRCxDQUFYLEVBQW1FLEVBQW5FO01BRmdCLEVBTjdCOztBQVdJLGFBQU8sT0FBQSxHQUFVLENBQUUsdUJBQUYsRUFBMkIsc0JBQTNCO0lBWlMsQ0FoRTVCOzs7SUFpRkEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsT0FBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUE7TUFBSSxDQUFBLENBQUUsSUFBRixFQUNFLFVBREYsQ0FBQSxHQUNrQyxDQUFFLE9BQUEsQ0FBUSxpQkFBUixDQUFGLENBQTZCLENBQUMsOEJBQTlCLENBQUEsQ0FEbEMsRUFBSjs7Ozs7TUFNSSxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQVAsQ0FDVjtRQUFBLE1BQUEsRUFBUSxtREFBUjtRQUNBLFNBQUEsRUFBVyxNQUFNLENBQUMsTUFBUCxDQUNUO1VBQUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLE1BQVAsQ0FDaEI7WUFBQSxJQUFBLEVBQW9CLElBQXBCO1lBQ0EsSUFBQSxFQUFvQixLQURwQjtZQUVBLFdBQUEsRUFBb0IsS0FGcEI7O1lBSUEsUUFBQSxFQUFvQixJQUpwQjtZQUtBLGlCQUFBLEVBQW9CLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBRSxNQUFGLEVBQVUsUUFBVixDQUFkO1VBTHBCLENBRGdCLENBQWxCO1VBT0EsS0FBQSxFQUNFO1lBQUEsR0FBQSxFQUNFO2NBQUEsT0FBQSxFQUFrQixDQUFDO1lBQW5CLENBREY7WUFFQSxXQUFBLEVBQ0U7Y0FBQSxPQUFBLEVBQWtCLENBQUM7WUFBbkIsQ0FIRjtZQUlBLFlBQUEsRUFDRTtjQUFBLE9BQUEsRUFBa0IsQ0FBQztZQUFuQjtVQUxGO1FBUkYsQ0FEUztNQURYLENBRFU7TUFtQlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXpCSjs7TUE0RFUsYUFBTixNQUFBLFdBQUEsQ0FBQTs7UUFHb0IsT0FBakIsZUFBaUIsQ0FBQSxDQUFBO2lCQUFHLENBQUUsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLENBQUEsSUFBSyxFQUF2QixDQUFBLEtBQWdDO1FBQW5DLENBRHhCOzs7UUFJTSxXQUFhLENBQUUsR0FBRixDQUFBO0FBQ25CLGNBQUE7VUFBUSxJQUFDLENBQUEsR0FBRCxHQUFjLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLGdCQUF0QixFQUEyQyxHQUFBLEdBQTNDOztnQkFDVixDQUFDLE9BQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxlQUFiLENBQUE7O1VBQ2QsSUFBQSxDQUFLLElBQUwsRUFBUSxRQUFSLEVBQWtCLFVBQUEsQ0FBVyxJQUFDLENBQUEsR0FBRyxDQUFDLElBQWhCLENBQWxCO0FBQ0EsaUJBQU87UUFKSSxDQUpuQjs7Ozs7UUFjTSxpQkFBbUIsQ0FBRSxJQUFGLENBQUE7QUFDekIsY0FBQSxNQUFBLEVBQUEsS0FDNkQscUJBRDdELEVBQUE7VUFBUSxJQUFPLG9EQUFQO1lBQ0UsTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLHlCQUFBLENBQUEsQ0FBNEIsSUFBNUIsQ0FBQSxDQUFWLEVBRFI7O1VBRUEsS0FBQSxHQUFRLENBQUUsR0FBQSxRQUFGLEVBRmhCOztVQUlRLElBQUcseUJBQUg7WUFBd0IsTUFBQSxHQUFTLENBQUUsQ0FBRixDQUFBLEdBQUE7Y0FBUyxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxDQUFFLElBQUYsRUFBUSxLQUFSLEVBQWUsQ0FBZixDQUFkO3FCQUFtQztZQUE1QyxFQUFqQztXQUFBLE1BQUE7WUFDd0IsTUFBQSxHQUFTLENBQUUsQ0FBRixDQUFBLEdBQUE7cUJBQVM7WUFBVCxFQURqQztXQUpSOztBQU9RLGlCQUFPLENBQUUsS0FBRixFQUFTLE1BQVQ7UUFSVSxDQWR6Qjs7Ozs7UUEyQk0sS0FBVSxDQUFDLENBQUUsR0FBQSxHQUFNLENBQVIsRUFBVyxHQUFBLEdBQU0sQ0FBakIsSUFBc0IsQ0FBQSxDQUF2QixDQUFBO2lCQUE4QixHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLEdBQVksQ0FBRSxHQUFBLEdBQU0sR0FBUjtRQUFoRDs7UUFDVixPQUFVLENBQUMsQ0FBRSxHQUFBLEdBQU0sQ0FBUixFQUFXLEdBQUEsR0FBTSxDQUFqQixJQUFzQixDQUFBLENBQXZCLENBQUE7aUJBQThCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFFLEdBQUYsRUFBTyxHQUFQLENBQVAsQ0FBWDtRQUE5QixDQTVCaEI7OztRQStCTSxtQkFBcUIsQ0FBQyxDQUFFLE1BQUEsR0FBUyxDQUFYLEVBQWMsVUFBQSxHQUFhLElBQTNCLEVBQWlDLFVBQUEsR0FBYSxJQUE5QyxJQUFzRCxDQUFBLENBQXZELENBQUE7VUFDbkIsSUFBRyxrQkFBSDtBQUNFLG1CQUFPO2NBQUUsVUFBRjtjQUFjLFVBQUEsdUJBQWMsYUFBYSxVQUFBLEdBQWE7WUFBdEQsRUFEVDtXQUFBLE1BRUssSUFBRyxrQkFBSDtBQUNILG1CQUFPO2NBQUUsVUFBQSx1QkFBYyxhQUFhLENBQTdCO2NBQWtDO1lBQWxDLEVBREo7O1VBRUwsSUFBc0QsY0FBdEQ7QUFBQSxtQkFBTztjQUFFLFVBQUEsRUFBWSxNQUFkO2NBQXNCLFVBQUEsRUFBWTtZQUFsQyxFQUFQOztVQUNBLE1BQU0sSUFBSSxLQUFKLENBQVUscUVBQVY7UUFOYSxDQS9CM0I7OztRQXdDTSxrQkFBb0IsQ0FBQyxDQUFFLE1BQUEsR0FBUyxDQUFYLEVBQWMsVUFBQSxHQUFhLElBQTNCLEVBQWlDLFVBQUEsR0FBYSxJQUE5QyxJQUFzRCxDQUFBLENBQXZELENBQUE7VUFDbEIsQ0FBQSxDQUFFLFVBQUYsRUFDRSxVQURGLENBQUEsR0FDa0IsSUFBQyxDQUFBLG1CQUFELENBQXFCLENBQUUsTUFBRixFQUFVLFVBQVYsRUFBc0IsVUFBdEIsQ0FBckIsQ0FEbEI7VUFFQSxJQUFxQixVQUFBLEtBQWMsVUFBVyw0Q0FBOUM7QUFBQSxtQkFBTyxXQUFQOztBQUNBLGlCQUFPLElBQUMsQ0FBQSxPQUFELENBQVM7WUFBRSxHQUFBLEVBQUssVUFBUDtZQUFtQixHQUFBLEVBQUs7VUFBeEIsQ0FBVDtRQUpXLENBeEMxQjs7O1FBK0NNLElBQU0sQ0FBQyxDQUFFLEdBQUEsR0FBTSxDQUFSLEVBQVcsR0FBQSxHQUFNLENBQWpCLEVBQW9CLE1BQUEsR0FBUyxDQUE3QixFQUFnQyxVQUFBLEdBQWEsSUFBN0MsRUFBbUQsVUFBQSxHQUFhLElBQWhFLElBQXdFLENBQUEsQ0FBekUsQ0FBQTtBQUNaLGNBQUE7VUFBUSxNQUFBLEdBQVMsSUFBQyxDQUFBLGtCQUFELENBQW9CLENBQUUsTUFBRixFQUFVLFVBQVYsRUFBc0IsVUFBdEIsQ0FBcEI7QUFDVCxpQkFBTzs7QUFBRTtZQUFBLEtBQTRCLG1GQUE1QjsyQkFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLENBQUUsR0FBRixFQUFPLEdBQVAsQ0FBTDtZQUFBLENBQUE7O3VCQUFGLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsRUFBckQ7UUFGSCxDQS9DWjs7O1FBb0RNLFlBQWMsQ0FBQyxDQUFFLEdBQUEsR0FBTSxJQUFSLEVBQWMsR0FBQSxHQUFNLElBQXBCLElBQTRCLENBQUEsQ0FBN0IsQ0FBQTtVQUNaLElBQTRCLENBQUUsT0FBTyxHQUFULENBQUEsS0FBa0IsUUFBOUM7WUFBQSxHQUFBLEdBQU8sR0FBRyxDQUFDLFdBQUosQ0FBZ0IsQ0FBaEIsRUFBUDs7VUFDQSxJQUE0QixDQUFFLE9BQU8sR0FBVCxDQUFBLEtBQWtCLFFBQTlDO1lBQUEsR0FBQSxHQUFPLEdBQUcsQ0FBQyxXQUFKLENBQWdCLENBQWhCLEVBQVA7OztZQUNBLE1BQU8sSUFBQyxDQUFBLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBRSxDQUFGOzs7WUFDN0IsTUFBTyxJQUFDLENBQUEsR0FBRyxDQUFDLGlCQUFpQixDQUFFLENBQUY7O0FBQzdCLGlCQUFPLENBQUUsR0FBRixFQUFPLEdBQVA7UUFMSyxDQXBEcEI7OztRQTRETSxHQUFLLENBQUMsQ0FBRSxHQUFBLEdBQU0sSUFBUixFQUFjLEdBQUEsR0FBTSxJQUFwQixJQUE0QixDQUFBLENBQTdCLENBQUE7QUFDWCxjQUFBLENBQUEsRUFBQSxNQUFBLEVBQUE7VUFBUSxDQUFBLENBQUUsS0FBRixFQUNFLE1BREYsQ0FBQSxHQUNrQixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsS0FBbkIsQ0FEbEIsRUFBUjs7VUFHUSxDQUFBLENBQUUsR0FBRixFQUNFLEdBREYsQ0FBQSxHQUNrQixJQUFDLENBQUEsWUFBRCxDQUFjLENBQUUsR0FBRixFQUFPLEdBQVAsQ0FBZCxDQURsQjtBQUdBLGlCQUFBLElBQUEsR0FBQTs7WUFDRSxLQUFLLENBQUMsT0FBTjtZQUNBLElBQXFDLEtBQUssQ0FBQyxPQUFOLEdBQWdCLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBMUQ7Y0FBQSxNQUFNLElBQUksS0FBSixDQUFVLGlCQUFWLEVBQU47O1lBQ0EsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxhQUFQLENBQXFCLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFULENBQXJCO1lBQ0osSUFBdUIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFqQixDQUF3QixDQUF4QixDQUF2QjtBQUFBLHFCQUFTLE1BQUEsQ0FBTyxDQUFQLEVBQVQ7O1VBSkYsQ0FOUjs7QUFZUSxpQkFBTztRQWJKLENBNURYOzs7UUE0RU0sV0FBYSxDQUFDLENBQUUsR0FBQSxHQUFNLElBQVIsRUFBYyxHQUFBLEdBQU0sSUFBcEIsRUFBMEIsSUFBQSxHQUFPLENBQWpDLElBQXFDLENBQUEsQ0FBdEMsQ0FBQTtBQUNuQixjQUFBLENBQUEsRUFBQSxNQUFBLEVBQUE7VUFBUSxDQUFBLENBQUUsS0FBRixFQUNFLE1BREYsQ0FBQSxHQUNrQixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsYUFBbkIsQ0FEbEI7VUFFQSxDQUFBLEdBQWtCLElBQUksR0FBSixDQUFBLEVBRjFCOztBQUlRLGlCQUFNLENBQUMsQ0FBQyxJQUFGLEdBQVMsSUFBZjtZQUNFLEtBQUssQ0FBQyxPQUFOO1lBQ0EsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsR0FBRCxDQUFLLENBQUUsR0FBRixFQUFPLEdBQVAsQ0FBTCxDQUFOO1VBRkY7QUFHQSxpQkFBUyxNQUFBLENBQU8sQ0FBUDtRQVJFLENBNUVuQjs7O1FBdUZNLFlBQWMsQ0FBQyxDQUFFLEdBQUEsR0FBTSxJQUFSLEVBQWMsR0FBQSxHQUFNLElBQXBCLEVBQTBCLE1BQUEsR0FBUyxDQUFuQyxFQUFzQyxVQUFBLEdBQWEsSUFBbkQsRUFBeUQsVUFBQSxHQUFhLElBQXRFLEVBQTRFLElBQUEsR0FBTyxDQUFuRixJQUF1RixDQUFBLENBQXhGLENBQUE7QUFDcEIsY0FBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLGVBQUEsRUFBQTtVQUFRLENBQUEsQ0FBRSxLQUFGLEVBQ0UsTUFERixDQUFBLEdBQ2tCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixjQUFuQixDQURsQjtVQUVBLENBQUEsQ0FBRSxVQUFGLEVBQ0UsVUFERixDQUFBLEdBQ2tCLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixDQUFFLE1BQUYsRUFBVSxVQUFWLEVBQXNCLFVBQXRCLENBQXJCLENBRGxCO1VBRUEsZUFBQSxHQUFrQixVQUFBLEtBQWM7VUFDaEMsTUFBQSxHQUFrQjtVQUNsQixDQUFBLEdBQWtCLElBQUksR0FBSixDQUFBLEVBTjFCOztBQVFRLGlCQUFNLENBQUMsQ0FBQyxJQUFGLEdBQVMsSUFBZjtZQUNFLEtBQUssQ0FBQyxPQUFOO1lBQ0EsS0FBK0QsZUFBL0Q7Y0FBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQUQsQ0FBUztnQkFBRSxHQUFBLEVBQUssVUFBUDtnQkFBbUIsR0FBQSxFQUFLO2NBQXhCLENBQVQsRUFBVDs7WUFDQSxDQUFDLENBQUMsR0FBRixDQUFNLElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBRSxHQUFGLEVBQU8sR0FBUCxFQUFZLE1BQVosQ0FBTixDQUFOO1VBSEY7QUFJQSxpQkFBUyxNQUFBLENBQU8sQ0FBUDtRQWJHOztNQXpGaEIsRUE1REo7O0FBcUtJLGFBQU8sT0FBQSxHQUFVLENBQUUsVUFBRixFQUFjLFNBQWQ7SUF0S0c7RUFqRnRCLEVBVkY7OztFQXFRQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixjQUE5QjtBQXJRQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9uZXh0X2ZyZWVfZmlsZW5hbWU6IC0+XG4gICAgY2ZnID1cbiAgICAgIG1heF9yZXRyaWVzOiAgICA5OTk5XG4gICAgICBwcmVmaXg6ICAgICAgICAgJ34uJ1xuICAgICAgc3VmZml4OiAgICAgICAgICcuYnJpY2FicmFjLWNhY2hlJ1xuICAgIGNhY2hlX2ZpbGVuYW1lX3JlID0gLy8vXG4gICAgICBeXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5wcmVmaXh9IClcbiAgICAgICg/PGZpcnN0Pi4qKVxuICAgICAgXFwuXG4gICAgICAoPzxucj5bMC05XXs0fSlcbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICAgJFxuICAgICAgLy8vdlxuICAgICMgY2FjaGVfc3VmZml4X3JlID0gLy8vXG4gICAgIyAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICMgICAkXG4gICAgIyAgIC8vL3ZcbiAgICBycHIgICAgICAgICAgICAgICA9ICggeCApIC0+XG4gICAgICByZXR1cm4gXCInI3t4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiIGlmICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJ30nXCJcbiAgICAgIHJldHVybiBcIiN7eH1cIlxuICAgIGVycm9ycyA9XG4gICAgICBUTVBfZXhoYXVzdGlvbl9lcnJvcjogY2xhc3MgVE1QX2V4aGF1c3Rpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgICAgVE1QX3ZhbGlkYXRpb25fZXJyb3I6IGNsYXNzIFRNUF92YWxpZGF0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICBGUyAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICBQQVRIICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpwYXRoJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZXhpc3RzID0gKCBwYXRoICkgLT5cbiAgICAgIHRyeSBGUy5zdGF0U3luYyBwYXRoIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwZSBjaGVja2luZyAjIyNcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzEgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgKCB0eXBlb2YgcGF0aCApIGlzICdzdHJpbmcnXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18yIGV4cGVjdGVkIGEgbm9uZW1wdHkgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzIHBhdGgubGVuZ3RoID4gMFxuICAgICAgZGlybmFtZSAgPSBQQVRILmRpcm5hbWUgcGF0aFxuICAgICAgYmFzZW5hbWUgPSBQQVRILmJhc2VuYW1lIHBhdGhcbiAgICAgIHVubGVzcyAoIG1hdGNoID0gYmFzZW5hbWUubWF0Y2ggY2FjaGVfZmlsZW5hbWVfcmUgKT9cbiAgICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2Jhc2VuYW1lfS4wMDAxI3tjZmcuc3VmZml4fVwiXG4gICAgICB7IGZpcnN0LCBuciwgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIG5yICAgICAgICAgICAgICA9IFwiI3soIHBhcnNlSW50IG5yLCAxMCApICsgMX1cIi5wYWRTdGFydCA0LCAnMCdcbiAgICAgIHBhdGggICAgICAgICAgICA9IGZpcnN0XG4gICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7Zmlyc3R9LiN7bnJ9I3tjZmcuc3VmZml4fVwiXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgIFIgICAgICAgICAgICAgPSBwYXRoXG4gICAgICBmYWlsdXJlX2NvdW50ID0gLTFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZhaWx1cmVfY291bnQrK1xuICAgICAgICBpZiBmYWlsdXJlX2NvdW50ID4gY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX2V4aGF1c3Rpb25fZXJyb3IgXCLOqV9fXzMgdG9vIG1hbnkgKCN7ZmFpbHVyZV9jb3VudH0pIHJldHJpZXM7ICBwYXRoICN7cnByIFJ9IGV4aXN0c1wiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgUiA9IGdldF9uZXh0X2ZpbGVuYW1lIFJcbiAgICAgICAgYnJlYWsgdW5sZXNzIGV4aXN0cyBSXG4gICAgICByZXR1cm4gUlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBzd2FwX3N1ZmZpeCA9ICggcGF0aCwgc3VmZml4ICkgLT4gcGF0aC5yZXBsYWNlIGNhY2hlX3N1ZmZpeF9yZSwgc3VmZml4XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X25leHRfZnJlZV9maWxlbmFtZSwgZ2V0X25leHRfZmlsZW5hbWUsIGV4aXN0cywgY2FjaGVfZmlsZW5hbWVfcmUsIGVycm9ycywgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NvbW1hbmRfbGluZV90b29sczogLT5cbiAgICBDUCA9IHJlcXVpcmUgJ25vZGU6Y2hpbGRfcHJvY2VzcydcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCA9ICggY29tbWFuZCwgaW5wdXQgKSAtPlxuICAgICAgcmV0dXJuICggQ1AuZXhlY1N5bmMgY29tbWFuZCwgeyBlbmNvZGluZzogJ3V0Zi04JywgaW5wdXQsIH0gKS5yZXBsYWNlIC9cXG4kL3MsICcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoID0gKCB0ZXh0ICkgLT5cbiAgICAgICMjIyB0aHggdG8gaHR0cHM6Ly91bml4LnN0YWNrZXhjaGFuZ2UuY29tL2EvMjU4NTUxLzI4MDIwNCAjIyNcbiAgICAgIHJldHVybiBwYXJzZUludCAoIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ICd3YyAtLW1heC1saW5lLWxlbmd0aCcsIHRleHQgKSwgMTBcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9jb21tYW5kX2xpbmVfcmVzdWx0LCBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoLCB9XG5cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9yYW5kb21fdG9vbHM6IC0+XG4gICAgeyBoaWRlLFxuICAgICAgZ2V0X3NldHRlciwgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcycgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgICMjIyBUQUlOVCByZXBsYWNlICMjI1xuICAgICMgeyBkZWZhdWx0OiBfZ2V0X3VuaXF1ZV90ZXh0LCAgfSA9IHJlcXVpcmUgJ3VuaXF1ZS1zdHJpbmcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZVxuICAgICAgY2hyX3JlOiAvLy9eKD86XFxwe0x9fFxccHtac318XFxwe1p9fFxccHtNfXxcXHB7Tn18XFxwe1B9fFxccHtTfSkkLy8vdlxuICAgICAgdGVtcGxhdGVzOiBPYmplY3QuZnJlZXplXG4gICAgICAgIHJhbmRvbV90b29sc19jZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgICBzZWVkOiAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBzaXplOiAgICAgICAgICAgICAgIDFfMDAwXG4gICAgICAgICAgbWF4X3JldHJpZXM6ICAgICAgICAxXzAwMFxuICAgICAgICAgICMgdW5pcXVlX2NvdW50OiAgIDFfMDAwXG4gICAgICAgICAgb25fc3RhdHM6ICAgICAgICAgICBudWxsXG4gICAgICAgICAgdW5pY29kZV9jaWRfcmFuZ2U6ICBPYmplY3QuZnJlZXplIFsgMHgwMDAwLCAweDEwZmZmZiBdXG4gICAgICAgIHN0YXRzOlxuICAgICAgICAgIGNocjpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG4gICAgICAgICAgc2V0X29mX2NocnM6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl90ZXh0czpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYGBgXG4gICAgLy8gdGh4IHRvIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NzU5MzMxNi83NTY4MDkxXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTIxMjk1L3NlZWRpbmctdGhlLXJhbmRvbS1udW1iZXItZ2VuZXJhdG9yLWluLWphdmFzY3JpcHRcblxuICAgIC8vIFNwbGl0TWl4MzJcblxuICAgIC8vIEEgMzItYml0IHN0YXRlIFBSTkcgdGhhdCB3YXMgbWFkZSBieSB0YWtpbmcgTXVybXVySGFzaDMncyBtaXhpbmcgZnVuY3Rpb24sIGFkZGluZyBhIGluY3JlbWVudG9yIGFuZFxuICAgIC8vIHR3ZWFraW5nIHRoZSBjb25zdGFudHMuIEl0J3MgcG90ZW50aWFsbHkgb25lIG9mIHRoZSBiZXR0ZXIgMzItYml0IFBSTkdzIHNvIGZhcjsgZXZlbiB0aGUgYXV0aG9yIG9mXG4gICAgLy8gTXVsYmVycnkzMiBjb25zaWRlcnMgaXQgdG8gYmUgdGhlIGJldHRlciBjaG9pY2UuIEl0J3MgYWxzbyBqdXN0IGFzIGZhc3QuXG5cbiAgICBjb25zdCBzcGxpdG1peDMyID0gZnVuY3Rpb24gKCBhICkge1xuICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgYSB8PSAwO1xuICAgICAgIGEgPSBhICsgMHg5ZTM3NzliOSB8IDA7XG4gICAgICAgbGV0IHQgPSBhIF4gYSA+Pj4gMTY7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDIxZjBhYWFkKTtcbiAgICAgICB0ID0gdCBeIHQgPj4+IDE1O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHg3MzVhMmQ5Nyk7XG4gICAgICAgcmV0dXJuICgodCA9IHQgXiB0ID4+PiAxNSkgPj4+IDApIC8gNDI5NDk2NzI5NjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zdCBwcm5nID0gc3BsaXRtaXgzMigoTWF0aC5yYW5kb20oKSoyKiozMik+Pj4wKVxuICAgIC8vIGZvcihsZXQgaT0wOyBpPDEwOyBpKyspIGNvbnNvbGUubG9nKHBybmcoKSk7XG4gICAgLy9cbiAgICAvLyBJIHdvdWxkIHJlY29tbWVuZCB0aGlzIGlmIHlvdSBqdXN0IG5lZWQgYSBzaW1wbGUgYnV0IGdvb2QgUFJORyBhbmQgZG9uJ3QgbmVlZCBiaWxsaW9ucyBvZiByYW5kb21cbiAgICAvLyBudW1iZXJzIChzZWUgQmlydGhkYXkgcHJvYmxlbSkuXG4gICAgLy9cbiAgICAvLyBOb3RlOiBJdCBkb2VzIGhhdmUgb25lIHBvdGVudGlhbCBjb25jZXJuOiBpdCBkb2VzIG5vdCByZXBlYXQgcHJldmlvdXMgbnVtYmVycyB1bnRpbCB5b3UgZXhoYXVzdCA0LjNcbiAgICAvLyBiaWxsaW9uIG51bWJlcnMgYW5kIGl0IHJlcGVhdHMgYWdhaW4uIFdoaWNoIG1heSBvciBtYXkgbm90IGJlIGEgc3RhdGlzdGljYWwgY29uY2VybiBmb3IgeW91ciB1c2VcbiAgICAvLyBjYXNlLiBJdCdzIGxpa2UgYSBsaXN0IG9mIHJhbmRvbSBudW1iZXJzIHdpdGggdGhlIGR1cGxpY2F0ZXMgcmVtb3ZlZCwgYnV0IHdpdGhvdXQgYW55IGV4dHJhIHdvcmtcbiAgICAvLyBpbnZvbHZlZCB0byByZW1vdmUgdGhlbS4gQWxsIG90aGVyIGdlbmVyYXRvcnMgaW4gdGhpcyBsaXN0IGRvIG5vdCBleGhpYml0IHRoaXMgYmVoYXZpb3IuXG4gICAgYGBgXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgR2V0X3JhbmRvbVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGdldF9yYW5kb21fc2VlZDogLT4gKCBNYXRoLnJhbmRvbSgpICogMiAqKiAzMiApID4+PiAwXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBAY2ZnICAgICAgICA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5yYW5kb21fdG9vbHNfY2ZnLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgQGNmZy5zZWVkICA/PSBAY29uc3RydWN0b3IuZ2V0X3JhbmRvbV9zZWVkKClcbiAgICAgICAgaGlkZSBALCAnX2Zsb2F0Jywgc3BsaXRtaXgzMiBAY2ZnLnNlZWRcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFNUQVRTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2NyZWF0ZV9zdGF0c19mb3I6ICggbmFtZSApIC0+XG4gICAgICAgIHVubGVzcyAoIHRlbXBsYXRlID0gaW50ZXJuYWxzLnRlbXBsYXRlcy5zdGF0c1sgbmFtZSBdICk/XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX180IHVua25vd24gc3RhdHMgbmFtZSAje25hbWV9XCIgIyMjIFRBSU5UIHVzZSBycHIoKSAjIyNcbiAgICAgICAgc3RhdHMgPSB7IHRlbXBsYXRlLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBpZiBAY2ZnLm9uX3N0YXRzPyB0aGVuICBmaW5pc2ggPSAoIFIgKSA9PiBAY2ZnLm9uX3N0YXRzIHsgbmFtZSwgc3RhdHMsIFIsIH07IFJcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgZmluaXNoID0gKCBSICkgPT4gUlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIHsgc3RhdHMsIGZpbmlzaCwgfVxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgI1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZsb2F0OiAgICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICBpbnRlZ2VyOiAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gTWF0aC5yb3VuZCBAZmxvYXQgeyBtaW4sIG1heCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4X2xlbmd0aDogKHsgbGVuZ3RoID0gMSwgbWluX2xlbmd0aCA9IG51bGwsIG1heF9sZW5ndGggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBpZiBtaW5fbGVuZ3RoP1xuICAgICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGgsIG1heF9sZW5ndGg6ICggbWF4X2xlbmd0aCA/IG1pbl9sZW5ndGggKiAyICksIH1cbiAgICAgICAgZWxzZSBpZiBtYXhfbGVuZ3RoP1xuICAgICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6ICggbWluX2xlbmd0aCA/IDEgKSwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoOiBsZW5ndGgsIG1heF9sZW5ndGg6IGxlbmd0aCwgfSBpZiBsZW5ndGg/XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNiBtdXN0IHNldCBhdCBsZWFzdCBvbmUgb2YgYGxlbmd0aGAsIGBtaW5fbGVuZ3RoYCwgYG1heF9sZW5ndGhgXCJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfcmFuZG9tX2xlbmd0aDogKHsgbGVuZ3RoID0gMSwgbWluX2xlbmd0aCA9IG51bGwsIG1heF9sZW5ndGggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiBtaW5fbGVuZ3RoIGlmIG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aCAjIyMgTk9URSBkb25lIHRvIGF2b2lkIGNoYW5naW5nIFBSTkcgc3RhdGUgIyMjXG4gICAgICAgIHJldHVybiBAaW50ZWdlciB7IG1pbjogbWluX2xlbmd0aCwgbWF4OiBtYXhfbGVuZ3RoLCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB0ZXh0OiAoeyBtaW4gPSAwLCBtYXggPSAxLCBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIGxlbmd0aCA9IEBfZ2V0X3JhbmRvbV9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuICggQGNociB7IG1pbiwgbWF4LCB9IGZvciBfIGluIFsgMSAuLiBsZW5ndGggXSApLmpvaW4gJydcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heDogKHsgbWluID0gbnVsbCwgbWF4ID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgbWluICA9IG1pbi5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1pbiApIGlzICdzdHJpbmcnXG4gICAgICAgIG1heCAgPSBtYXguY29kZVBvaW50QXQgMCBpZiAoIHR5cGVvZiBtYXggKSBpcyAnc3RyaW5nJ1xuICAgICAgICBtaW4gPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMCBdXG4gICAgICAgIG1heCA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAxIF1cbiAgICAgICAgcmV0dXJuIHsgbWluLCBtYXgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNocjogKHsgbWluID0gbnVsbCwgbWF4ID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgeyBzdGF0cyxcbiAgICAgICAgICBmaW5pc2gsICAgICB9ID0gQF9jcmVhdGVfc3RhdHNfZm9yICdjaHInXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsb29wXG4gICAgICAgICAgc3RhdHMucmV0cmllcysrXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IGV4aGF1c3RlZFwiIGlmIHN0YXRzLnJldHJpZXMgPiBAY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgUiA9IFN0cmluZy5mcm9tQ29kZVBvaW50IEBpbnRlZ2VyIHsgbWluLCBtYXgsIH1cbiAgICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApIGlmIGludGVybmFscy5jaHJfcmUudGVzdCAoIFIgKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl9jaHJzOiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCBzaXplID0gMiB9PXt9KSAtPlxuICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgIGZpbmlzaCwgICAgIH0gPSBAX2NyZWF0ZV9zdGF0c19mb3IgJ3NldF9vZl9jaHJzJ1xuICAgICAgICBSICAgICAgICAgICAgICAgPSBuZXcgU2V0KClcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHdoaWxlIFIuc2l6ZSA8IHNpemVcbiAgICAgICAgICBzdGF0cy5yZXRyaWVzKytcbiAgICAgICAgICBSLmFkZCBAY2hyIHsgbWluLCBtYXgsIH1cbiAgICAgICAgcmV0dXJuICggZmluaXNoIFIgKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX3RleHRzOiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIHNpemUgPSAyIH09e30pIC0+XG4gICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnc2V0X29mX3RleHRzJ1xuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCA9IG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aFxuICAgICAgICBsZW5ndGggICAgICAgICAgPSBtaW5fbGVuZ3RoXG4gICAgICAgIFIgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgd2hpbGUgUi5zaXplIDwgc2l6ZVxuICAgICAgICAgIHN0YXRzLnJldHJpZXMrK1xuICAgICAgICAgIGxlbmd0aCA9IEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH0gdW5sZXNzIGxlbmd0aF9pc19jb25zdFxuICAgICAgICAgIFIuYWRkIEB0ZXh0IHsgbWluLCBtYXgsIGxlbmd0aCwgfVxuICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEdldF9yYW5kb20sIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgVU5TVEFCTEVfQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-brics.coffee