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
      var Get_random, Stats, chr_re, exports, get_setter, hide, internals;
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
            unicode_cid_range: Object.freeze([0x0000, 0x10ffff]),
            on_exhaustion: 'error'
          }),
          chr_producer: {
            min: 0x000000,
            max: 0x10ffff,
            prefilter: chr_re,
            filter: null,
            on_exhaustion: 'error'
          },
          text_producer: {
            min: 0x000000,
            max: 0x10ffff,
            length: 1,
            min_length: null,
            max_length: null,
            filter: null,
            on_exhaustion: 'error'
          },
          set_of_chrs: {
            min: 0x000000,
            max: 0x10ffff,
            size: 2,
            on_exhaustion: 'error'
          },
          text_producer: {
            min: 0x000000,
            max: 0x10ffff,
            length: 1,
            size: 2,
            min_length: null,
            max_length: null,
            filter: null,
            on_exhaustion: 'error'
          },
          stats: {
            float: {
              retries: -1
            },
            integer: {
              retries: -1
            },
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
      Stats = (function() {
        //=========================================================================================================
        class Stats {
          //-------------------------------------------------------------------------------------------------------
          constructor({name, on_exhaustion = 'error', max_retries = null}) {
            this.name = name;
            this.max_retries = max_retries != null ? max_retries : internals.templates.random_tools_cfg.max_retries;
            if (on_exhaustion == null) {
              on_exhaustion = 'error';
            }
            hide(this, '_retries', 0);
            hide(this, 'on_exhaustion', (function() {
              switch (true) {
                case on_exhaustion === 'error':
                  return function() {
                    throw new Error("Ω__10 exhausted");
                  };
                case (typeof on_exhaustion) === 'function':
                  return on_exhaustion;
                default:
                  /* TAINT use rpr, typing */
                  throw new Error(`Ω__10 illegal value for on_exhaustion: ${on_exhaustion}`);
              }
            })());
            return void 0;
          }

        };

        //-------------------------------------------------------------------------------------------------------
        Object.defineProperty(Stats.prototype, 'retries', {
          get: function() {
            return this._retries;
          },
          set: function(value) {
            if (value > this.max_retries) {
              return this.on_exhaustion();
            }
            this._retries = value;
            return value;
          }
        });

        return Stats;

      }).call(this);
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
        _create_stats_for(name, on_exhaustion = 'error') {
          var finish, stats/* TAINT use rpr() */, template;
          stats = new Stats({name, on_exhaustion});
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
        // INTERNALS
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
          throw new Error(`Ω___6 unable to turn argument into a filter: ${argument}`);
        }

        //=======================================================================================================
        // CONVENIENCE
        //-------------------------------------------------------------------------------------------------------
        float({min = 0, max = 1} = {}) {
          return min + this._float() * (max - min);
        }

        integer({min = 0, max = 1} = {}) {
          return Math.round(this.float({min, max}));
        }

        chr(...P) {
          return (this.chr_producer(...P))();
        }

        text(...P) {
          return (this.text_producer(...P))();
        }

        //=======================================================================================================
        // PRODUCERS
        //-------------------------------------------------------------------------------------------------------
        float_producer(cfg) {
          var filter, float, max, min;
          ({min, max, filter} = {...internals.templates.float_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          filter = this._get_filter(filter);
          //.....................................................................................................
          return float = () => {
            var R, finish, stats;
            ({stats, finish} = this._create_stats_for('float'));
            while (true) {
              //.....................................................................................................
              stats.retries++;
              if (stats.retries > this.cfg.max_retries) {
                throw new Error("Ω___7 exhausted");
              }
              R = min + this._float() * (max - min);
              if (filter(R)) {
                return finish(R);
              }
            }
            //.....................................................................................................
            return null;
          };
        }

        //-------------------------------------------------------------------------------------------------------
        integer_producer(cfg) {
          var filter, integer, max, min;
          ({min, max, filter} = {...internals.templates.float_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          filter = this._get_filter(filter);
          //.....................................................................................................
          return integer = () => {
            var R, finish, stats;
            ({stats, finish} = this._create_stats_for('integer'));
            while (true) {
              //.....................................................................................................
              stats.retries++;
              if (stats.retries > this.cfg.max_retries) {
                throw new Error("Ω___8 exhausted");
              }
              R = Math.round(min + this._float() * (max - min));
              if (filter(R)) {
                return finish(R);
              }
            }
            //.....................................................................................................
            return null;
          };
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
                throw new Error("Ω___9 exhausted");
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
        text_producer(cfg) {
          /* TAINT consider to cache result */
          var filter, length, length_is_const, max, max_length, min, min_length, on_exhaustion, text;
          ({min, max, length, min_length, max_length, filter, on_exhaustion} = {...internals.templates.text_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          //.....................................................................................................
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          length_is_const = min_length === max_length;
          length = min_length;
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

        //=======================================================================================================
        // SETS
        //-------------------------------------------------------------------------------------------------------
        set_of_chrs(cfg) {
          var R, chr, finish, max, min, size, stats;
          ({stats, finish} = this._create_stats_for('set_of_chrs'));
          ({min, max, size} = {...internals.templates.set_of_chrs, ...cfg});
          R = new Set();
          chr = this.chr_producer({min, max});
          //.....................................................................................................
          while (R.size < size) {
            stats.retries++;
            if (stats.retries > this.cfg.max_retries) {
              throw new Error("Ω__11 exhausted");
            }
            R.add(chr());
          }
          return finish(R);
        }

        //-------------------------------------------------------------------------------------------------------
        set_of_texts(cfg) {
          var R, filter, finish, length, length_is_const, max, max_length, min, min_length, size, stats, text;
          ({stats, finish} = this._create_stats_for('set_of_texts'));
          ({min, max, length, size, min_length, max_length, filter} = {...internals.templates.set_of_texts, ...cfg});
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          length_is_const = min_length === max_length;
          length = min_length;
          R = new Set();
          text = this.text_producer({min, max, length, min_length, max_length, filter});
          //.....................................................................................................
          while (R.size < size) {
            stats.retries++;
            if (stats.retries > this.cfg.max_retries) {
              throw new Error("Ω__12 exhausted");
            }
            R.add(text());
          }
          return finish(R);
        }

        //=======================================================================================================
        // WALKERS
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxXQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFt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T0FBTixHQUFnQixJQUFDLENBQUEsR0FBRyxDQUFDLFdBQTFEO2NBQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVixFQUFOOztZQUNqQixDQUFDLENBQUMsR0FBRixDQUFNLElBQUEsQ0FBQSxDQUFOO1VBRkY7QUFHQSxpQkFBUyxNQUFBLENBQU8sQ0FBUDtRQXBCRyxDQTlMcEI7Ozs7O1FBd05ZLEVBQU4sSUFBTSxDQUFDLENBQUUsUUFBRixFQUFZLENBQUEsR0FBSSxDQUFoQixJQUFxQixDQUFBLENBQXRCLENBQUE7QUFDWixjQUFBO1VBQVEsS0FBQSxHQUFRO0FBQ1IsaUJBQUEsSUFBQTtZQUNFLEtBQUE7WUFBUyxJQUFTLEtBQUEsR0FBUSxDQUFqQjtBQUFBLG9CQUFBOztZQUNULE1BQU0sUUFBQSxDQUFBO1VBRlI7QUFHQSxpQkFBTztRQUxIOztNQTFOUixFQXhISjs7QUEwVkksYUFBTyxPQUFBLEdBQVUsQ0FBRSxVQUFGLEVBQWMsU0FBZDtJQTNWRztFQWpGdEIsRUFWRjs7O0VBMGJBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLGNBQTlCO0FBMWJBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX25leHRfZnJlZV9maWxlbmFtZTogLT5cbiAgICBjZmcgPVxuICAgICAgbWF4X3JldHJpZXM6ICAgIDk5OTlcbiAgICAgIHByZWZpeDogICAgICAgICAnfi4nXG4gICAgICBzdWZmaXg6ICAgICAgICAgJy5icmljYWJyYWMtY2FjaGUnXG4gICAgY2FjaGVfZmlsZW5hbWVfcmUgPSAvLy9cbiAgICAgIF5cbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnByZWZpeH0gKVxuICAgICAgKD88Zmlyc3Q+LiopXG4gICAgICBcXC5cbiAgICAgICg/PG5yPlswLTldezR9KVxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgICAkXG4gICAgICAvLy92XG4gICAgIyBjYWNoZV9zdWZmaXhfcmUgPSAvLy9cbiAgICAjICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgIyAgICRcbiAgICAjICAgLy8vdlxuICAgIHJwciAgICAgICAgICAgICAgID0gKCB4ICkgLT5cbiAgICAgIHJldHVybiBcIicje3gucmVwbGFjZSAvJy9nLCBcIlxcXFwnXCIgaWYgKCB0eXBlb2YgeCApIGlzICdzdHJpbmcnfSdcIlxuICAgICAgcmV0dXJuIFwiI3t4fVwiXG4gICAgZXJyb3JzID1cbiAgICAgIFRNUF9leGhhdXN0aW9uX2Vycm9yOiBjbGFzcyBUTVBfZXhoYXVzdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgICBUTVBfdmFsaWRhdGlvbl9lcnJvcjogY2xhc3MgVE1QX3ZhbGlkYXRpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgIEZTICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuICAgIFBBVEggICAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBleGlzdHMgPSAoIHBhdGggKSAtPlxuICAgICAgdHJ5IEZTLnN0YXRTeW5jIHBhdGggY2F0Y2ggZXJyb3IgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiB0cnVlXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB0eXBlIGNoZWNraW5nICMjI1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMSBleHBlY3RlZCBhIHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyAoIHR5cGVvZiBwYXRoICkgaXMgJ3N0cmluZydcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzIgZXhwZWN0ZWQgYSBub25lbXB0eSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgcGF0aC5sZW5ndGggPiAwXG4gICAgICBkaXJuYW1lICA9IFBBVEguZGlybmFtZSBwYXRoXG4gICAgICBiYXNlbmFtZSA9IFBBVEguYmFzZW5hbWUgcGF0aFxuICAgICAgdW5sZXNzICggbWF0Y2ggPSBiYXNlbmFtZS5tYXRjaCBjYWNoZV9maWxlbmFtZV9yZSApP1xuICAgICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7YmFzZW5hbWV9LjAwMDEje2NmZy5zdWZmaXh9XCJcbiAgICAgIHsgZmlyc3QsIG5yLCAgfSA9IG1hdGNoLmdyb3Vwc1xuICAgICAgbnIgICAgICAgICAgICAgID0gXCIjeyggcGFyc2VJbnQgbnIsIDEwICkgKyAxfVwiLnBhZFN0YXJ0IDQsICcwJ1xuICAgICAgcGF0aCAgICAgICAgICAgID0gZmlyc3RcbiAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tmaXJzdH0uI3tucn0je2NmZy5zdWZmaXh9XCJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgUiAgICAgICAgICAgICA9IHBhdGhcbiAgICAgIGZhaWx1cmVfY291bnQgPSAtMVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBsb29wXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZmFpbHVyZV9jb3VudCsrXG4gICAgICAgIGlmIGZhaWx1cmVfY291bnQgPiBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfZXhoYXVzdGlvbl9lcnJvciBcIs6pX19fMyB0b28gbWFueSAoI3tmYWlsdXJlX2NvdW50fSkgcmV0cmllczsgIHBhdGggI3tycHIgUn0gZXhpc3RzXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBSID0gZ2V0X25leHRfZmlsZW5hbWUgUlxuICAgICAgICBicmVhayB1bmxlc3MgZXhpc3RzIFJcbiAgICAgIHJldHVybiBSXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIHN3YXBfc3VmZml4ID0gKCBwYXRoLCBzdWZmaXggKSAtPiBwYXRoLnJlcGxhY2UgY2FjaGVfc3VmZml4X3JlLCBzdWZmaXhcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lLCBnZXRfbmV4dF9maWxlbmFtZSwgZXhpc3RzLCBjYWNoZV9maWxlbmFtZV9yZSwgZXJyb3JzLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY29tbWFuZF9saW5lX3Rvb2xzOiAtPlxuICAgIENQID0gcmVxdWlyZSAnbm9kZTpjaGlsZF9wcm9jZXNzJ1xuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ID0gKCBjb21tYW5kLCBpbnB1dCApIC0+XG4gICAgICByZXR1cm4gKCBDUC5leGVjU3luYyBjb21tYW5kLCB7IGVuY29kaW5nOiAndXRmLTgnLCBpbnB1dCwgfSApLnJlcGxhY2UgL1xcbiQvcywgJydcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF93Y19tYXhfbGluZV9sZW5ndGggPSAoIHRleHQgKSAtPlxuICAgICAgIyMjIHRoeCB0byBodHRwczovL3VuaXguc3RhY2tleGNoYW5nZS5jb20vYS8yNTg1NTEvMjgwMjA0ICMjI1xuICAgICAgcmV0dXJuIHBhcnNlSW50ICggZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgJ3djIC0tbWF4LWxpbmUtbGVuZ3RoJywgdGV4dCApLCAxMFxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQsIGdldF93Y19tYXhfbGluZV9sZW5ndGgsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3JhbmRvbV90b29sczogLT5cbiAgICB7IGhpZGUsXG4gICAgICBnZXRfc2V0dGVyLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyMjIFRBSU5UIHJlcGxhY2UgIyMjXG4gICAgIyB7IGRlZmF1bHQ6IF9nZXRfdW5pcXVlX3RleHQsICB9ID0gcmVxdWlyZSAndW5pcXVlLXN0cmluZydcbiAgICBjaHJfcmUgPSAvLy9eKD86XFxwe0x9fFxccHtac318XFxwe1p9fFxccHtNfXxcXHB7Tn18XFxwe1B9fFxccHtTfSkkLy8vdlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemVcbiAgICAgIGNocl9yZTogY2hyX3JlXG4gICAgICB0ZW1wbGF0ZXM6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcmFuZG9tX3Rvb2xzX2NmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICAgIHNlZWQ6ICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMV8wMDBcbiAgICAgICAgICBtYXhfcmV0cmllczogICAgICAgIDFfMDAwXG4gICAgICAgICAgIyB1bmlxdWVfY291bnQ6ICAgMV8wMDBcbiAgICAgICAgICBvbl9zdGF0czogICAgICAgICAgIG51bGxcbiAgICAgICAgICB1bmljb2RlX2NpZF9yYW5nZTogIE9iamVjdC5mcmVlemUgWyAweDAwMDAsIDB4MTBmZmZmIF1cbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgY2hyX3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgcHJlZmlsdGVyOiAgICAgICAgICBjaHJfcmVcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgdGV4dF9wcm9kdWNlcjpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIGxlbmd0aDogICAgICAgICAgICAgMVxuICAgICAgICAgIG1pbl9sZW5ndGg6ICAgICAgICAgbnVsbFxuICAgICAgICAgIG1heF9sZW5ndGg6ICAgICAgICAgbnVsbFxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBzZXRfb2ZfY2hyczpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMlxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICB0ZXh0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgbGVuZ3RoOiAgICAgICAgICAgICAxXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgbWluX2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHN0YXRzOlxuICAgICAgICAgIGZsb2F0OlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBpbnRlZ2VyOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBjaHI6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBzZXRfb2ZfdGV4dHM6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGBgYFxuICAgIC8vIHRoeCB0byBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDc1OTMzMTYvNzU2ODA5MVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9zZWVkaW5nLXRoZS1yYW5kb20tbnVtYmVyLWdlbmVyYXRvci1pbi1qYXZhc2NyaXB0XG5cbiAgICAvLyBTcGxpdE1peDMyXG5cbiAgICAvLyBBIDMyLWJpdCBzdGF0ZSBQUk5HIHRoYXQgd2FzIG1hZGUgYnkgdGFraW5nIE11cm11ckhhc2gzJ3MgbWl4aW5nIGZ1bmN0aW9uLCBhZGRpbmcgYSBpbmNyZW1lbnRvciBhbmRcbiAgICAvLyB0d2Vha2luZyB0aGUgY29uc3RhbnRzLiBJdCdzIHBvdGVudGlhbGx5IG9uZSBvZiB0aGUgYmV0dGVyIDMyLWJpdCBQUk5HcyBzbyBmYXI7IGV2ZW4gdGhlIGF1dGhvciBvZlxuICAgIC8vIE11bGJlcnJ5MzIgY29uc2lkZXJzIGl0IHRvIGJlIHRoZSBiZXR0ZXIgY2hvaWNlLiBJdCdzIGFsc28ganVzdCBhcyBmYXN0LlxuXG4gICAgY29uc3Qgc3BsaXRtaXgzMiA9IGZ1bmN0aW9uICggYSApIHtcbiAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgIGEgfD0gMDtcbiAgICAgICBhID0gYSArIDB4OWUzNzc5YjkgfCAwO1xuICAgICAgIGxldCB0ID0gYSBeIGEgPj4+IDE2O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHgyMWYwYWFhZCk7XG4gICAgICAgdCA9IHQgXiB0ID4+PiAxNTtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4NzM1YTJkOTcpO1xuICAgICAgIHJldHVybiAoKHQgPSB0IF4gdCA+Pj4gMTUpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc3QgcHJuZyA9IHNwbGl0bWl4MzIoKE1hdGgucmFuZG9tKCkqMioqMzIpPj4+MClcbiAgICAvLyBmb3IobGV0IGk9MDsgaTwxMDsgaSsrKSBjb25zb2xlLmxvZyhwcm5nKCkpO1xuICAgIC8vXG4gICAgLy8gSSB3b3VsZCByZWNvbW1lbmQgdGhpcyBpZiB5b3UganVzdCBuZWVkIGEgc2ltcGxlIGJ1dCBnb29kIFBSTkcgYW5kIGRvbid0IG5lZWQgYmlsbGlvbnMgb2YgcmFuZG9tXG4gICAgLy8gbnVtYmVycyAoc2VlIEJpcnRoZGF5IHByb2JsZW0pLlxuICAgIC8vXG4gICAgLy8gTm90ZTogSXQgZG9lcyBoYXZlIG9uZSBwb3RlbnRpYWwgY29uY2VybjogaXQgZG9lcyBub3QgcmVwZWF0IHByZXZpb3VzIG51bWJlcnMgdW50aWwgeW91IGV4aGF1c3QgNC4zXG4gICAgLy8gYmlsbGlvbiBudW1iZXJzIGFuZCBpdCByZXBlYXRzIGFnYWluLiBXaGljaCBtYXkgb3IgbWF5IG5vdCBiZSBhIHN0YXRpc3RpY2FsIGNvbmNlcm4gZm9yIHlvdXIgdXNlXG4gICAgLy8gY2FzZS4gSXQncyBsaWtlIGEgbGlzdCBvZiByYW5kb20gbnVtYmVycyB3aXRoIHRoZSBkdXBsaWNhdGVzIHJlbW92ZWQsIGJ1dCB3aXRob3V0IGFueSBleHRyYSB3b3JrXG4gICAgLy8gaW52b2x2ZWQgdG8gcmVtb3ZlIHRoZW0uIEFsbCBvdGhlciBnZW5lcmF0b3JzIGluIHRoaXMgbGlzdCBkbyBub3QgZXhoaWJpdCB0aGlzIGJlaGF2aW9yLlxuICAgIGBgYFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIFN0YXRzXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKHsgbmFtZSwgb25fZXhoYXVzdGlvbiA9ICdlcnJvcicsIG1heF9yZXRyaWVzID0gbnVsbCB9KSAtPlxuICAgICAgICBAbmFtZSAgICAgICAgICAgICAgICAgICA9IG5hbWVcbiAgICAgICAgQG1heF9yZXRyaWVzICAgICAgICAgICAgPSBtYXhfcmV0cmllcyA/IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy5tYXhfcmV0cmllc1xuICAgICAgICBvbl9leGhhdXN0aW9uICAgICAgICAgID89ICdlcnJvcidcbiAgICAgICAgaGlkZSBALCAnX3JldHJpZXMnLCAgICAgICAwXG4gICAgICAgIGhpZGUgQCwgJ29uX2V4aGF1c3Rpb24nLCAgc3dpdGNoIHRydWVcbiAgICAgICAgICB3aGVuIG9uX2V4aGF1c3Rpb24gICAgICAgICAgICBpcyAnZXJyb3InICAgIHRoZW4gLT4gdGhyb3cgbmV3IEVycm9yIFwizqlfXzEwIGV4aGF1c3RlZFwiXG4gICAgICAgICAgd2hlbiAoIHR5cGVvZiBvbl9leGhhdXN0aW9uICkgaXMgJ2Z1bmN0aW9uJyB0aGVuIG9uX2V4aGF1c3Rpb25cbiAgICAgICAgICAjIyMgVEFJTlQgdXNlIHJwciwgdHlwaW5nICMjI1xuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlfXzEwIGlsbGVnYWwgdmFsdWUgZm9yIG9uX2V4aGF1c3Rpb246ICN7b25fZXhoYXVzdGlvbn1cIlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQDo6LCAncmV0cmllcycsXG4gICAgICAgIGdldDogLT4gQF9yZXRyaWVzXG4gICAgICAgIHNldDogKCB2YWx1ZSApIC0+XG4gICAgICAgICAgcmV0dXJuIEBvbl9leGhhdXN0aW9uKCkgaWYgdmFsdWUgPiBAbWF4X3JldHJpZXNcbiAgICAgICAgICBAX3JldHJpZXMgPSB2YWx1ZVxuICAgICAgICAgIHJldHVybiB2YWx1ZVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEdldF9yYW5kb21cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBnZXRfcmFuZG9tX3NlZWQ6IC0+ICggTWF0aC5yYW5kb20oKSAqIDIgKiogMzIgKSA+Pj4gMFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgQGNmZyAgICAgICAgPSB7IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEBjZmcuc2VlZCAgPz0gQGNvbnN0cnVjdG9yLmdldF9yYW5kb21fc2VlZCgpXG4gICAgICAgIGhpZGUgQCwgJ19mbG9hdCcsIHNwbGl0bWl4MzIgQGNmZy5zZWVkXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBTVEFUU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9jcmVhdGVfc3RhdHNfZm9yOiAoIG5hbWUsIG9uX2V4aGF1c3Rpb24gPSAnZXJyb3InICkgLT5cbiAgICAgICAgc3RhdHMgPSBuZXcgU3RhdHMgeyBuYW1lLCBvbl9leGhhdXN0aW9uLCB9XG4gICAgICAgIHVubGVzcyAoIHRlbXBsYXRlID0gaW50ZXJuYWxzLnRlbXBsYXRlcy5zdGF0c1sgbmFtZSBdICk/XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX180IHVua25vd24gc3RhdHMgbmFtZSAje25hbWV9XCIgIyMjIFRBSU5UIHVzZSBycHIoKSAjIyNcbiAgICAgICAgc3RhdHMgPSB7IHRlbXBsYXRlLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBpZiBAY2ZnLm9uX3N0YXRzPyB0aGVuICBmaW5pc2ggPSAoIFIgKSA9PiBAY2ZnLm9uX3N0YXRzIHsgbmFtZSwgc3RhdHMsIFIsIH07IFJcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgZmluaXNoID0gKCBSICkgPT4gUlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIHsgc3RhdHMsIGZpbmlzaCwgfVxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIElOVEVSTkFMU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heF9sZW5ndGg6ICh7IGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgaWYgbWluX2xlbmd0aD9cbiAgICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoOiAoIG1heF9sZW5ndGggPyBtaW5fbGVuZ3RoICogMiApLCB9XG4gICAgICAgIGVsc2UgaWYgbWF4X2xlbmd0aD9cbiAgICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoOiAoIG1pbl9sZW5ndGggPyAxICksIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogbGVuZ3RoLCBtYXhfbGVuZ3RoOiBsZW5ndGgsIH0gaWYgbGVuZ3RoP1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgbXVzdCBzZXQgYXQgbGVhc3Qgb25lIG9mIGBsZW5ndGhgLCBgbWluX2xlbmd0aGAsIGBtYXhfbGVuZ3RoYFwiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X3JhbmRvbV9sZW5ndGg6ICh7IGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4gbWluX2xlbmd0aCBpZiBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGggIyMjIE5PVEUgZG9uZSB0byBhdm9pZCBjaGFuZ2luZyBQUk5HIHN0YXRlICMjI1xuICAgICAgICByZXR1cm4gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4OiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBtaW4gID0gbWluLmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWluICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWF4ICA9IG1heC5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1heCApIGlzICdzdHJpbmcnXG4gICAgICAgIG1pbiA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAwIF1cbiAgICAgICAgbWF4ID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDEgXVxuICAgICAgICByZXR1cm4geyBtaW4sIG1heCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9maWx0ZXI6ICggZmlsdGVyICkgLT5cbiAgICAgICAgcmV0dXJuICggKCB4ICkgLT4gdHJ1ZSAgICAgICAgICAgICkgdW5sZXNzIGZpbHRlcj9cbiAgICAgICAgcmV0dXJuICggZmlsdGVyICAgICAgICAgICAgICAgICAgICkgaWYgKCB0eXBlb2YgZmlsdGVyICkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgICByZXR1cm4gKCAoIHggKSAtPiBmaWx0ZXIudGVzdCB4ICAgKSBpZiBmaWx0ZXIgaW5zdGFuY2VvZiBSZWdFeHBcbiAgICAgICAgIyMjIFRBSU5UIHVzZSBgcnByYCwgdHlwaW5nICMjI1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzYgdW5hYmxlIHRvIHR1cm4gYXJndW1lbnQgaW50byBhIGZpbHRlcjogI3thcmd1bWVudH1cIlxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIENPTlZFTklFTkNFXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXQ6ICAgICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgIGludGVnZXI6ICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBNYXRoLnJvdW5kIEBmbG9hdCB7IG1pbiwgbWF4LCB9XG4gICAgICBjaHI6ICAgICAgKCBQLi4uICkgLT4gKCBAY2hyX3Byb2R1Y2VyIFAuLi4gKSgpXG4gICAgICB0ZXh0OiAgICAgKCBQLi4uICkgLT4gKCBAdGV4dF9wcm9kdWNlciBQLi4uICkoKVxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFBST0RVQ0VSU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZsb2F0X3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBmaWx0ZXIsICAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmZsb2F0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGZsb2F0ID0gPT5cbiAgICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnZmxvYXQnXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgc3RhdHMucmV0cmllcysrOyB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzcgZXhoYXVzdGVkXCIgaWYgc3RhdHMucmV0cmllcyA+IEBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICAgIFIgPSBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBpbnRlZ2VyX3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBmaWx0ZXIsICAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmZsb2F0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGludGVnZXIgPSA9PlxuICAgICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgICBmaW5pc2gsICAgICB9ID0gQF9jcmVhdGVfc3RhdHNfZm9yICdpbnRlZ2VyJ1xuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIHN0YXRzLnJldHJpZXMrKzsgdGhyb3cgbmV3IEVycm9yIFwizqlfX184IGV4aGF1c3RlZFwiIGlmIHN0YXRzLnJldHJpZXMgPiBAY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgICBSID0gTWF0aC5yb3VuZCBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjaHJfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGNhY2hlIHJlc3VsdCAjIyNcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIHByZWZpbHRlcixcbiAgICAgICAgICBmaWx0ZXIsICAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmNocl9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwcmVmaWx0ZXIgICAgICAgPSBAX2dldF9maWx0ZXIgcHJlZmlsdGVyXG4gICAgICAgIGZpbHRlciAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBjaHIgPSA9PlxuICAgICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgICBmaW5pc2gsICAgICB9ID0gQF9jcmVhdGVfc3RhdHNfZm9yICdjaHInXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgc3RhdHMucmV0cmllcysrOyB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzkgZXhoYXVzdGVkXCIgaWYgc3RhdHMucmV0cmllcyA+IEBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICAgIFIgPSBTdHJpbmcuZnJvbUNvZGVQb2ludCBAaW50ZWdlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApIGlmICggcHJlZmlsdGVyIFIgKSBhbmQgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRleHRfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGNhY2hlIHJlc3VsdCAjIyNcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24gfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy50ZXh0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiB0ZXh0ID0gPT5cbiAgICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAndGV4dCdcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsZW5ndGggPSBAaW50ZWdlciB7IG1pbjogbWluX2xlbmd0aCwgbWF4OiBtYXhfbGVuZ3RoLCB9IHVubGVzcyBsZW5ndGhfaXNfY29uc3RcbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBzdGF0cy5yZXRyaWVzKys7IHRocm93IG5ldyBFcnJvciBcIs6pX18xMCBleGhhdXN0ZWRcIiBpZiBzdGF0cy5yZXRyaWVzID4gQGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICAgUiA9ICggQGNociB7IG1pbiwgbWF4LCB9IGZvciBfIGluIFsgMSAuLiBsZW5ndGggXSApLmpvaW4gJydcbiAgICAgICAgICAgIHJldHVybiAoIGZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBTRVRTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX2NocnM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBzdGF0cyxcbiAgICAgICAgICBmaW5pc2gsICAgICB9ID0gQF9jcmVhdGVfc3RhdHNfZm9yICdzZXRfb2ZfY2hycydcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIHNpemUsICAgICAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX2NocnMuLi4sIGNmZy4uLiwgfVxuICAgICAgICBSICAgICAgICAgICAgICAgPSBuZXcgU2V0KClcbiAgICAgICAgY2hyICAgICAgICAgICAgID0gQGNocl9wcm9kdWNlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB3aGlsZSBSLnNpemUgPCBzaXplXG4gICAgICAgICAgc3RhdHMucmV0cmllcysrOyB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fMTEgZXhoYXVzdGVkXCIgaWYgc3RhdHMucmV0cmllcyA+IEBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICBSLmFkZCBjaHIoKVxuICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfb2ZfdGV4dHM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBzdGF0cyxcbiAgICAgICAgICBmaW5pc2gsICAgICB9ID0gQF9jcmVhdGVfc3RhdHNfZm9yICdzZXRfb2ZfdGV4dHMnXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgc2l6ZSxcbiAgICAgICAgICBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsXG4gICAgICAgICAgZmlsdGVyLCAgICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5zZXRfb2ZfdGV4dHMuLi4sIGNmZy4uLiwgfVxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCA9IG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aFxuICAgICAgICBsZW5ndGggICAgICAgICAgPSBtaW5fbGVuZ3RoXG4gICAgICAgIFIgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICB0ZXh0ICAgICAgICAgICAgPSBAdGV4dF9wcm9kdWNlciB7IG1pbiwgbWF4LCBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIGZpbHRlciwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgd2hpbGUgUi5zaXplIDwgc2l6ZVxuICAgICAgICAgIHN0YXRzLnJldHJpZXMrKzsgdGhyb3cgbmV3IEVycm9yIFwizqlfXzEyIGV4aGF1c3RlZFwiIGlmIHN0YXRzLnJldHJpZXMgPiBAY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgUi5hZGQgdGV4dCgpXG4gICAgICAgIHJldHVybiAoIGZpbmlzaCBSIClcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBXQUxLRVJTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgd2FsazogKHsgcHJvZHVjZXIsIG4gPSAxLCB9PXt9KSAtPlxuICAgICAgICBjb3VudCA9IDBcbiAgICAgICAgbG9vcFxuICAgICAgICAgIGNvdW50Kys7IGJyZWFrIGlmIGNvdW50ID4gblxuICAgICAgICAgIHlpZWxkIHByb2R1Y2VyKClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgR2V0X3JhbmRvbSwgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBVTlNUQUJMRV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-brics.coffee