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
      var Get_random, chr_re, exports, get_setter, hide, internals;
      ({hide, get_setter} = (require('./various-brics')).require_managed_property_tools());
      /* TAINT replace */
      // { default: _get_unique_text,  } = require 'unique-string'
      chr_re = /^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$/v;
      //---------------------------------------------------------------------------------------------------------
      internals = Object.freeze({
        chr_re: chr_re,
        templates: Object.freeze({
          random_tools_cfg: Object.freeze({
            seed: null,
            size: 1_000,
            max_retries: 1_000,
            // unique_count:   1_000
            on_stats: null,
            unicode_cid_range: Object.freeze([0x0000, 0x10ffff])
          }),
          chr_producer: {
            min: 0x000000,
            max: 0x10ffff,
            prefilter: chr_re,
            filter: null
          },
          text_producer: {
            min: 0x000000,
            max: 0x10ffff,
            length: 1,
            min_length: null,
            max_length: null,
            filter: null
          },
          stats: {
            chr: {
              retries: -1
            },
            text: {
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
          throw new Error("Ω___5 must set at least one of `length`, `min_length`, `max_length`");
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
        text_producer(cfg) {
          /* TAINT consider to cache result */
          var filter, length, length_is_const, max, max_length, min, min_length, text;
          ({min, max, length, min_length, max_length, filter} = {...internals.templates.text_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          //.....................................................................................................
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          length_is_const = min_length === max_length;
          length = min_length;
          //.....................................................................................................
          filter = this._get_filter(filter);
          //.....................................................................................................
          return text = () => {
            var R, _, finish, stats;
            ({stats, finish} = this._create_stats_for('text'));
            if (!length_is_const) {
              //.....................................................................................................
              length = this.integer({
                min: min_length,
                max: max_length
              });
            }
            while (true) {
              stats.retries++;
              if (stats.retries > this.cfg.max_retries) {
                throw new Error("Ω__10 exhausted");
              }
              R = ((function() {
                var i, ref, results;
                results = [];
                for (_ = i = 1, ref = length; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
                  results.push(this.chr({min, max}));
                }
                return results;
              }).call(this)).join('');
              if (filter(R)) {
                return finish(R);
              }
            }
            //.....................................................................................................
            return null;
          };
        }

        //-------------------------------------------------------------------------------------------------------
        text(...P) {
          return (this.text_producer(...P))();
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
        _get_filter(filter) {
          if (filter == null) {
            return (function(x) {
              return true;
            });
          }
          if ((typeof filter) === 'function') {
            return filter;
          }
          if (filter instanceof RegExp) {
            return (function(x) {
              return filter.test(x);
            });
          }
          /* TAINT use `rpr`, typing */
          throw new Error(`Ω__11 unable to turn argument into a filter: ${argument}`);
        }

        //-------------------------------------------------------------------------------------------------------
        chr_producer(cfg) {
          /* TAINT consider to cache result */
          var chr, filter, max, min, prefilter;
          ({min, max, prefilter, filter} = {...internals.templates.chr_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          //.....................................................................................................
          prefilter = this._get_filter(prefilter);
          filter = this._get_filter(filter);
          //.....................................................................................................
          return chr = () => {
            var R, finish, stats;
            ({stats, finish} = this._create_stats_for('chr'));
            while (true) {
              //.....................................................................................................
              stats.retries++;
              if (stats.retries > this.cfg.max_retries) {
                throw new Error("Ω__12 exhausted");
              }
              R = String.fromCodePoint(this.integer({min, max}));
              if ((prefilter(R)) && (filter(R))) {
                return finish(R);
              }
            }
            //.....................................................................................................
            return null;
          };
        }

        //-------------------------------------------------------------------------------------------------------
        chr(...P) {
          return (this.chr_producer(...P))();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxXQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFt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bUJBQUQsQ0FBcUIsQ0FBRSxNQUFGLEVBQVUsVUFBVixFQUFzQixVQUF0QixDQUFyQixDQURsQjtVQUVBLGVBQUEsR0FBa0IsVUFBQSxLQUFjO1VBQ2hDLE1BQUEsR0FBa0I7VUFDbEIsQ0FBQSxHQUFrQixJQUFJLEdBQUosQ0FBQSxFQU4xQjs7QUFRUSxpQkFBTSxDQUFDLENBQUMsSUFBRixHQUFTLElBQWY7WUFDRSxLQUFLLENBQUMsT0FBTjtZQUNBLEtBQStELGVBQS9EO2NBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFELENBQVM7Z0JBQUUsR0FBQSxFQUFLLFVBQVA7Z0JBQW1CLEdBQUEsRUFBSztjQUF4QixDQUFULEVBQVQ7O1lBQ0EsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsSUFBRCxDQUFNLENBQUUsR0FBRixFQUFPLEdBQVAsRUFBWSxNQUFaLENBQU4sQ0FBTjtVQUhGO0FBSUEsaUJBQVMsTUFBQSxDQUFPLENBQVA7UUFiRyxDQXpJcEI7OztRQXlKWSxFQUFOLElBQU0sQ0FBQyxDQUFFLFFBQUYsRUFBWSxDQUFBLEdBQUksQ0FBaEIsSUFBcUIsQ0FBQSxDQUF0QixDQUFBO0FBQ1osY0FBQTtVQUFRLEtBQUEsR0FBUTtBQUNSLGlCQUFBLElBQUE7WUFDRSxLQUFBO1lBQVMsSUFBUyxLQUFBLEdBQVEsQ0FBakI7QUFBQSxvQkFBQTs7WUFDVCxNQUFNLFFBQUEsQ0FBQTtVQUZSO0FBR0EsaUJBQU87UUFMSDs7TUEzSlIsRUEzRUo7O0FBOE9JLGFBQU8sT0FBQSxHQUFVLENBQUUsVUFBRixFQUFjLFNBQWQ7SUEvT0c7RUFqRnRCLEVBVkY7OztFQThVQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixjQUE5QjtBQTlVQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9uZXh0X2ZyZWVfZmlsZW5hbWU6IC0+XG4gICAgY2ZnID1cbiAgICAgIG1heF9yZXRyaWVzOiAgICA5OTk5XG4gICAgICBwcmVmaXg6ICAgICAgICAgJ34uJ1xuICAgICAgc3VmZml4OiAgICAgICAgICcuYnJpY2FicmFjLWNhY2hlJ1xuICAgIGNhY2hlX2ZpbGVuYW1lX3JlID0gLy8vXG4gICAgICBeXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5wcmVmaXh9IClcbiAgICAgICg/PGZpcnN0Pi4qKVxuICAgICAgXFwuXG4gICAgICAoPzxucj5bMC05XXs0fSlcbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICAgJFxuICAgICAgLy8vdlxuICAgICMgY2FjaGVfc3VmZml4X3JlID0gLy8vXG4gICAgIyAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICMgICAkXG4gICAgIyAgIC8vL3ZcbiAgICBycHIgICAgICAgICAgICAgICA9ICggeCApIC0+XG4gICAgICByZXR1cm4gXCInI3t4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiIGlmICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJ30nXCJcbiAgICAgIHJldHVybiBcIiN7eH1cIlxuICAgIGVycm9ycyA9XG4gICAgICBUTVBfZXhoYXVzdGlvbl9lcnJvcjogY2xhc3MgVE1QX2V4aGF1c3Rpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgICAgVE1QX3ZhbGlkYXRpb25fZXJyb3I6IGNsYXNzIFRNUF92YWxpZGF0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICBGUyAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICBQQVRIICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpwYXRoJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZXhpc3RzID0gKCBwYXRoICkgLT5cbiAgICAgIHRyeSBGUy5zdGF0U3luYyBwYXRoIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwZSBjaGVja2luZyAjIyNcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzEgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgKCB0eXBlb2YgcGF0aCApIGlzICdzdHJpbmcnXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18yIGV4cGVjdGVkIGEgbm9uZW1wdHkgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzIHBhdGgubGVuZ3RoID4gMFxuICAgICAgZGlybmFtZSAgPSBQQVRILmRpcm5hbWUgcGF0aFxuICAgICAgYmFzZW5hbWUgPSBQQVRILmJhc2VuYW1lIHBhdGhcbiAgICAgIHVubGVzcyAoIG1hdGNoID0gYmFzZW5hbWUubWF0Y2ggY2FjaGVfZmlsZW5hbWVfcmUgKT9cbiAgICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2Jhc2VuYW1lfS4wMDAxI3tjZmcuc3VmZml4fVwiXG4gICAgICB7IGZpcnN0LCBuciwgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIG5yICAgICAgICAgICAgICA9IFwiI3soIHBhcnNlSW50IG5yLCAxMCApICsgMX1cIi5wYWRTdGFydCA0LCAnMCdcbiAgICAgIHBhdGggICAgICAgICAgICA9IGZpcnN0XG4gICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7Zmlyc3R9LiN7bnJ9I3tjZmcuc3VmZml4fVwiXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgIFIgICAgICAgICAgICAgPSBwYXRoXG4gICAgICBmYWlsdXJlX2NvdW50ID0gLTFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZhaWx1cmVfY291bnQrK1xuICAgICAgICBpZiBmYWlsdXJlX2NvdW50ID4gY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX2V4aGF1c3Rpb25fZXJyb3IgXCLOqV9fXzMgdG9vIG1hbnkgKCN7ZmFpbHVyZV9jb3VudH0pIHJldHJpZXM7ICBwYXRoICN7cnByIFJ9IGV4aXN0c1wiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgUiA9IGdldF9uZXh0X2ZpbGVuYW1lIFJcbiAgICAgICAgYnJlYWsgdW5sZXNzIGV4aXN0cyBSXG4gICAgICByZXR1cm4gUlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBzd2FwX3N1ZmZpeCA9ICggcGF0aCwgc3VmZml4ICkgLT4gcGF0aC5yZXBsYWNlIGNhY2hlX3N1ZmZpeF9yZSwgc3VmZml4XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X25leHRfZnJlZV9maWxlbmFtZSwgZ2V0X25leHRfZmlsZW5hbWUsIGV4aXN0cywgY2FjaGVfZmlsZW5hbWVfcmUsIGVycm9ycywgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NvbW1hbmRfbGluZV90b29sczogLT5cbiAgICBDUCA9IHJlcXVpcmUgJ25vZGU6Y2hpbGRfcHJvY2VzcydcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCA9ICggY29tbWFuZCwgaW5wdXQgKSAtPlxuICAgICAgcmV0dXJuICggQ1AuZXhlY1N5bmMgY29tbWFuZCwgeyBlbmNvZGluZzogJ3V0Zi04JywgaW5wdXQsIH0gKS5yZXBsYWNlIC9cXG4kL3MsICcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoID0gKCB0ZXh0ICkgLT5cbiAgICAgICMjIyB0aHggdG8gaHR0cHM6Ly91bml4LnN0YWNrZXhjaGFuZ2UuY29tL2EvMjU4NTUxLzI4MDIwNCAjIyNcbiAgICAgIHJldHVybiBwYXJzZUludCAoIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ICd3YyAtLW1heC1saW5lLWxlbmd0aCcsIHRleHQgKSwgMTBcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9jb21tYW5kX2xpbmVfcmVzdWx0LCBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoLCB9XG5cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9yYW5kb21fdG9vbHM6IC0+XG4gICAgeyBoaWRlLFxuICAgICAgZ2V0X3NldHRlciwgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcycgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgICMjIyBUQUlOVCByZXBsYWNlICMjI1xuICAgICMgeyBkZWZhdWx0OiBfZ2V0X3VuaXF1ZV90ZXh0LCAgfSA9IHJlcXVpcmUgJ3VuaXF1ZS1zdHJpbmcnXG4gICAgY2hyX3JlID0gLy8vXig/OlxccHtMfXxcXHB7WnN9fFxccHtafXxcXHB7TX18XFxwe059fFxccHtQfXxcXHB7U30pJC8vL3ZcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplXG4gICAgICBjaHJfcmU6IGNocl9yZVxuICAgICAgdGVtcGxhdGVzOiBPYmplY3QuZnJlZXplXG4gICAgICAgIHJhbmRvbV90b29sc19jZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgICBzZWVkOiAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBzaXplOiAgICAgICAgICAgICAgIDFfMDAwXG4gICAgICAgICAgbWF4X3JldHJpZXM6ICAgICAgICAxXzAwMFxuICAgICAgICAgICMgdW5pcXVlX2NvdW50OiAgIDFfMDAwXG4gICAgICAgICAgb25fc3RhdHM6ICAgICAgICAgICBudWxsXG4gICAgICAgICAgdW5pY29kZV9jaWRfcmFuZ2U6ICBPYmplY3QuZnJlZXplIFsgMHgwMDAwLCAweDEwZmZmZiBdXG4gICAgICAgIGNocl9wcm9kdWNlcjpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIHByZWZpbHRlcjogICAgICAgICAgY2hyX3JlXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgIHRleHRfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBsZW5ndGg6ICAgICAgICAgICAgIDFcbiAgICAgICAgICBtaW5fbGVuZ3RoOiAgICAgICAgIG51bGxcbiAgICAgICAgICBtYXhfbGVuZ3RoOiAgICAgICAgIG51bGxcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgc3RhdHM6XG4gICAgICAgICAgY2hyOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBzZXRfb2ZfY2hyczpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG4gICAgICAgICAgc2V0X29mX3RleHRzOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBgYGBcbiAgICAvLyB0aHggdG8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NTkzMzE2Lzc1NjgwOTFcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvc2VlZGluZy10aGUtcmFuZG9tLW51bWJlci1nZW5lcmF0b3ItaW4tamF2YXNjcmlwdFxuXG4gICAgLy8gU3BsaXRNaXgzMlxuXG4gICAgLy8gQSAzMi1iaXQgc3RhdGUgUFJORyB0aGF0IHdhcyBtYWRlIGJ5IHRha2luZyBNdXJtdXJIYXNoMydzIG1peGluZyBmdW5jdGlvbiwgYWRkaW5nIGEgaW5jcmVtZW50b3IgYW5kXG4gICAgLy8gdHdlYWtpbmcgdGhlIGNvbnN0YW50cy4gSXQncyBwb3RlbnRpYWxseSBvbmUgb2YgdGhlIGJldHRlciAzMi1iaXQgUFJOR3Mgc28gZmFyOyBldmVuIHRoZSBhdXRob3Igb2ZcbiAgICAvLyBNdWxiZXJyeTMyIGNvbnNpZGVycyBpdCB0byBiZSB0aGUgYmV0dGVyIGNob2ljZS4gSXQncyBhbHNvIGp1c3QgYXMgZmFzdC5cblxuICAgIGNvbnN0IHNwbGl0bWl4MzIgPSBmdW5jdGlvbiAoIGEgKSB7XG4gICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICBhIHw9IDA7XG4gICAgICAgYSA9IGEgKyAweDllMzc3OWI5IHwgMDtcbiAgICAgICBsZXQgdCA9IGEgXiBhID4+PiAxNjtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4MjFmMGFhYWQpO1xuICAgICAgIHQgPSB0IF4gdCA+Pj4gMTU7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDczNWEyZDk3KTtcbiAgICAgICByZXR1cm4gKCh0ID0gdCBeIHQgPj4+IDE1KSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnN0IHBybmcgPSBzcGxpdG1peDMyKChNYXRoLnJhbmRvbSgpKjIqKjMyKT4+PjApXG4gICAgLy8gZm9yKGxldCBpPTA7IGk8MTA7IGkrKykgY29uc29sZS5sb2cocHJuZygpKTtcbiAgICAvL1xuICAgIC8vIEkgd291bGQgcmVjb21tZW5kIHRoaXMgaWYgeW91IGp1c3QgbmVlZCBhIHNpbXBsZSBidXQgZ29vZCBQUk5HIGFuZCBkb24ndCBuZWVkIGJpbGxpb25zIG9mIHJhbmRvbVxuICAgIC8vIG51bWJlcnMgKHNlZSBCaXJ0aGRheSBwcm9ibGVtKS5cbiAgICAvL1xuICAgIC8vIE5vdGU6IEl0IGRvZXMgaGF2ZSBvbmUgcG90ZW50aWFsIGNvbmNlcm46IGl0IGRvZXMgbm90IHJlcGVhdCBwcmV2aW91cyBudW1iZXJzIHVudGlsIHlvdSBleGhhdXN0IDQuM1xuICAgIC8vIGJpbGxpb24gbnVtYmVycyBhbmQgaXQgcmVwZWF0cyBhZ2Fpbi4gV2hpY2ggbWF5IG9yIG1heSBub3QgYmUgYSBzdGF0aXN0aWNhbCBjb25jZXJuIGZvciB5b3VyIHVzZVxuICAgIC8vIGNhc2UuIEl0J3MgbGlrZSBhIGxpc3Qgb2YgcmFuZG9tIG51bWJlcnMgd2l0aCB0aGUgZHVwbGljYXRlcyByZW1vdmVkLCBidXQgd2l0aG91dCBhbnkgZXh0cmEgd29ya1xuICAgIC8vIGludm9sdmVkIHRvIHJlbW92ZSB0aGVtLiBBbGwgb3RoZXIgZ2VuZXJhdG9ycyBpbiB0aGlzIGxpc3QgZG8gbm90IGV4aGliaXQgdGhpcyBiZWhhdmlvci5cbiAgICBgYGBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBHZXRfcmFuZG9tXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZ2V0X3JhbmRvbV9zZWVkOiAtPiAoIE1hdGgucmFuZG9tKCkgKiAyICoqIDMyICkgPj4+IDBcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAY2ZnLnNlZWQgID89IEBjb25zdHJ1Y3Rvci5nZXRfcmFuZG9tX3NlZWQoKVxuICAgICAgICBoaWRlIEAsICdfZmxvYXQnLCBzcGxpdG1peDMyIEBjZmcuc2VlZFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgU1RBVFNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfY3JlYXRlX3N0YXRzX2ZvcjogKCBuYW1lICkgLT5cbiAgICAgICAgdW5sZXNzICggdGVtcGxhdGUgPSBpbnRlcm5hbHMudGVtcGxhdGVzLnN0YXRzWyBuYW1lIF0gKT9cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgdW5rbm93biBzdGF0cyBuYW1lICN7bmFtZX1cIiAjIyMgVEFJTlQgdXNlIHJwcigpICMjI1xuICAgICAgICBzdGF0cyA9IHsgdGVtcGxhdGUuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmIEBjZmcub25fc3RhdHM/IHRoZW4gIGZpbmlzaCA9ICggUiApID0+IEBjZmcub25fc3RhdHMgeyBuYW1lLCBzdGF0cywgUiwgfTsgUlxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICBmaW5pc2ggPSAoIFIgKSA9PiBSXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4geyBzdGF0cywgZmluaXNoLCB9XG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXQ6ICAgICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgIGludGVnZXI6ICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBNYXRoLnJvdW5kIEBmbG9hdCB7IG1pbiwgbWF4LCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X21pbl9tYXhfbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIGlmIG1pbl9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aCwgbWF4X2xlbmd0aDogKCBtYXhfbGVuZ3RoID8gbWluX2xlbmd0aCAqIDIgKSwgfVxuICAgICAgICBlbHNlIGlmIG1heF9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogKCBtaW5fbGVuZ3RoID8gMSApLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6IGxlbmd0aCwgbWF4X2xlbmd0aDogbGVuZ3RoLCB9IGlmIGxlbmd0aD9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IG11c3Qgc2V0IGF0IGxlYXN0IG9uZSBvZiBgbGVuZ3RoYCwgYG1pbl9sZW5ndGhgLCBgbWF4X2xlbmd0aGBcIlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9yYW5kb21fbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIG1pbl9sZW5ndGggaWYgbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoICMjIyBOT1RFIGRvbmUgdG8gYXZvaWQgY2hhbmdpbmcgUFJORyBzdGF0ZSAjIyNcbiAgICAgICAgcmV0dXJuIEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRleHRfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGNhY2hlIHJlc3VsdCAjIyNcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsXG4gICAgICAgICAgZmlsdGVyLCAgICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy50ZXh0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgbGVuZ3RoX2lzX2NvbnN0ID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICA9IG1pbl9sZW5ndGhcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZpbHRlciAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiB0ZXh0ID0gPT5cbiAgICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAndGV4dCdcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsZW5ndGggPSBAaW50ZWdlciB7IG1pbjogbWluX2xlbmd0aCwgbWF4OiBtYXhfbGVuZ3RoLCB9IHVubGVzcyBsZW5ndGhfaXNfY29uc3RcbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBzdGF0cy5yZXRyaWVzKys7IHRocm93IG5ldyBFcnJvciBcIs6pX18xMCBleGhhdXN0ZWRcIiBpZiBzdGF0cy5yZXRyaWVzID4gQGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICAgUiA9ICggQGNociB7IG1pbiwgbWF4LCB9IGZvciBfIGluIFsgMSAuLiBsZW5ndGggXSApLmpvaW4gJydcbiAgICAgICAgICAgIHJldHVybiAoIGZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRleHQ6ICggUC4uLiApIC0+ICggQHRleHRfcHJvZHVjZXIgUC4uLiApKClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heDogKHsgbWluID0gbnVsbCwgbWF4ID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgbWluICA9IG1pbi5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1pbiApIGlzICdzdHJpbmcnXG4gICAgICAgIG1heCAgPSBtYXguY29kZVBvaW50QXQgMCBpZiAoIHR5cGVvZiBtYXggKSBpcyAnc3RyaW5nJ1xuICAgICAgICBtaW4gPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMCBdXG4gICAgICAgIG1heCA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAxIF1cbiAgICAgICAgcmV0dXJuIHsgbWluLCBtYXgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfZmlsdGVyOiAoIGZpbHRlciApIC0+XG4gICAgICAgIHJldHVybiAoICggeCApIC0+IHRydWUgICAgICAgICAgICApIHVubGVzcyBmaWx0ZXI/XG4gICAgICAgIHJldHVybiAoIGZpbHRlciAgICAgICAgICAgICAgICAgICApIGlmICggdHlwZW9mIGZpbHRlciApIGlzICdmdW5jdGlvbidcbiAgICAgICAgcmV0dXJuICggKCB4ICkgLT4gZmlsdGVyLnRlc3QgeCAgICkgaWYgZmlsdGVyIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgICAgICMjIyBUQUlOVCB1c2UgYHJwcmAsIHR5cGluZyAjIyNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfXzExIHVuYWJsZSB0byB0dXJuIGFyZ3VtZW50IGludG8gYSBmaWx0ZXI6ICN7YXJndW1lbnR9XCJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNocl9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgY29uc2lkZXIgdG8gY2FjaGUgcmVzdWx0ICMjI1xuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgcHJlZmlsdGVyLFxuICAgICAgICAgIGZpbHRlciwgICAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuY2hyX3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHByZWZpbHRlciAgICAgICA9IEBfZ2V0X2ZpbHRlciBwcmVmaWx0ZXJcbiAgICAgICAgZmlsdGVyICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGNociA9ID0+XG4gICAgICAgICAgeyBzdGF0cyxcbiAgICAgICAgICAgIGZpbmlzaCwgICAgIH0gPSBAX2NyZWF0ZV9zdGF0c19mb3IgJ2NocidcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBzdGF0cy5yZXRyaWVzKys7IHRocm93IG5ldyBFcnJvciBcIs6pX18xMiBleGhhdXN0ZWRcIiBpZiBzdGF0cy5yZXRyaWVzID4gQGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICAgUiA9IFN0cmluZy5mcm9tQ29kZVBvaW50IEBpbnRlZ2VyIHsgbWluLCBtYXgsIH1cbiAgICAgICAgICAgIHJldHVybiAoIGZpbmlzaCBSICkgaWYgKCBwcmVmaWx0ZXIgUiApIGFuZCAoIGZpbHRlciBSIClcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY2hyOiAoIFAuLi4gKSAtPiAoIEBjaHJfcHJvZHVjZXIgUC4uLiApKClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl9jaHJzOiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCBzaXplID0gMiB9PXt9KSAtPlxuICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgIGZpbmlzaCwgICAgIH0gPSBAX2NyZWF0ZV9zdGF0c19mb3IgJ3NldF9vZl9jaHJzJ1xuICAgICAgICBSICAgICAgICAgICAgICAgPSBuZXcgU2V0KClcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHdoaWxlIFIuc2l6ZSA8IHNpemVcbiAgICAgICAgICBzdGF0cy5yZXRyaWVzKytcbiAgICAgICAgICBSLmFkZCBAY2hyIHsgbWluLCBtYXgsIH1cbiAgICAgICAgcmV0dXJuICggZmluaXNoIFIgKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX3RleHRzOiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIHNpemUgPSAyIH09e30pIC0+XG4gICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnc2V0X29mX3RleHRzJ1xuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCA9IG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aFxuICAgICAgICBsZW5ndGggICAgICAgICAgPSBtaW5fbGVuZ3RoXG4gICAgICAgIFIgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgd2hpbGUgUi5zaXplIDwgc2l6ZVxuICAgICAgICAgIHN0YXRzLnJldHJpZXMrK1xuICAgICAgICAgIGxlbmd0aCA9IEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH0gdW5sZXNzIGxlbmd0aF9pc19jb25zdFxuICAgICAgICAgIFIuYWRkIEB0ZXh0IHsgbWluLCBtYXgsIGxlbmd0aCwgfVxuICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3YWxrOiAoeyBwcm9kdWNlciwgbiA9IDEsIH09e30pIC0+XG4gICAgICAgIGNvdW50ID0gMFxuICAgICAgICBsb29wXG4gICAgICAgICAgY291bnQrKzsgYnJlYWsgaWYgY291bnQgPiBuXG4gICAgICAgICAgeWllbGQgcHJvZHVjZXIoKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-brics.coffee