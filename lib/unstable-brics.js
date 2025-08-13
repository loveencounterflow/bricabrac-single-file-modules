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
      var Get_random, chr_re, clean, exports, go_on, hide, internals, max_retries, set_getter;
      ({hide, set_getter} = (require('./various-brics')).require_managed_property_tools());
      /* TAINT replace */
      // { default: _get_unique_text,  } = require 'unique-string'
      chr_re = /^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$/v;
      // max_retries = 9_999
      max_retries = 1_000;
      go_on = Symbol('go_on');
      clean = function(x) {
        var k, v;
        return Object.fromEntries((function() {
          var results;
          results = [];
          for (k in x) {
            v = x[k];
            if (v != null) {
              results.push([k, v]);
            }
          }
          return results;
        })());
      };
      //---------------------------------------------------------------------------------------------------------
      internals = { // Object.freeze
        chr_re: chr_re,
        max_retries: max_retries,
        go_on: go_on,
        clean: clean,
        //.......................................................................................................
        templates: Object.freeze({
          random_tools_cfg: Object.freeze({
            seed: null,
            size: 1_000,
            max_retries: max_retries,
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
      };
      
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
      internals.Stats = (function() {
        //=========================================================================================================
        class Stats {
          //-------------------------------------------------------------------------------------------------------
          constructor({name, on_exhaustion = 'error', on_stats = null, max_retries = null}) {
            this.name = name;
            this.max_retries = max_retries != null ? max_retries : internals.templates.random_tools_cfg.max_retries;
            if (on_exhaustion == null) {
              on_exhaustion = 'error';
            }
            hide(this, '_finished', false);
            hide(this, '_retries', 0);
            hide(this, 'on_exhaustion', (function() {
              switch (true) {
                case on_exhaustion === 'error':
                  return function() {
                    throw new Error("Ω___4 exhausted");
                  };
                case (typeof on_exhaustion) === 'function':
                  return on_exhaustion;
                default:
                  /* TAINT use rpr, typing */
                  throw new Error(`Ω___5 illegal value for on_exhaustion: ${on_exhaustion}`);
              }
            })());
            hide(this, 'on_stats', (function() {
              switch (true) {
                case (typeof on_stats) === 'function':
                  return on_stats;
                case on_stats == null:
                  return null;
                default:
                  /* TAINT use rpr, typing */
                  throw new Error(`Ω___6 illegal value for on_stats: ${on_stats}`);
              }
            })());
            return void 0;
          }

          //-------------------------------------------------------------------------------------------------------
          retry() {
            if (this._finished) {
              throw new Error("Ω___7 stats has already finished");
            }
            this._retries++;
            if (this.exhausted) {
              return this.on_exhaustion();
            }
            return go_on;
          }

          //-------------------------------------------------------------------------------------------------------
          finish(R) {
            if (this._finished) {
              throw new Error("Ω___8 stats has already finished");
            }
            this._finished = true;
            if (this.on_stats != null) {
              this.on_stats({
                name: this.name,
                retries: this.retries,
                R
              });
            }
            return R;
          }

        };

        //-------------------------------------------------------------------------------------------------------
        set_getter(Stats.prototype, 'finished', function() {
          return this._finished;
        });

        set_getter(Stats.prototype, 'retries', function() {
          return this._retries;
        });

        set_getter(Stats.prototype, 'exhausted', function() {
          return this._retries > this.max_retries;
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
        // INTERNALS
        //-------------------------------------------------------------------------------------------------------
        _new_stats(cfg) {
          return new internals.Stats({...internals.templates._new_stats, ...(clean(this.cfg)), ...cfg});
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
          throw new Error("Ω__12 must set at least one of `length`, `min_length`, `max_length`");
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
          throw new Error(`Ω__13 unable to turn argument into a filter: ${argument}`);
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
          var filter, float, max, min, on_exhaustion, on_stats;
          ({min, max, filter, on_stats, on_exhaustion, max_retries} = {...internals.templates.float_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          filter = this._get_filter(filter);
          //.....................................................................................................
          return float = () => {
            var R, sentinel, stats;
            stats = this._new_stats({
              name: 'float',
              ...(clean({on_stats, on_exhaustion, max_retries}))
            });
            while (true) {
              //...................................................................................................
              R = min + this._float() * (max - min);
              if (filter(R)) {
                return stats.finish(R);
              }
              if ((sentinel = stats.retry()) !== go_on) {
                return sentinel;
              }
            }
            //...................................................................................................
            return null;
          };
        }

        //-------------------------------------------------------------------------------------------------------
        integer_producer(cfg) {
          var filter, integer, max, min, on_exhaustion, on_stats;
          ({min, max, filter, on_stats, on_exhaustion, max_retries} = {...internals.templates.float_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          filter = this._get_filter(filter);
          //.....................................................................................................
          return integer = () => {
            var R, sentinel, stats;
            stats = this._new_stats({
              name: 'integer',
              ...(clean({on_stats, on_exhaustion, max_retries}))
            });
            while (true) {
              //...................................................................................................
              R = Math.round(min + this._float() * (max - min));
              if (filter(R)) {
                return stats.finish(R);
              }
              if ((sentinel = stats.retry()) !== go_on) {
                return sentinel;
              }
            }
            //...................................................................................................
            return null;
          };
        }

        //-------------------------------------------------------------------------------------------------------
        chr_producer(cfg) {
          /* TAINT consider to cache result */
          var chr, filter, max, min, on_exhaustion, on_stats, prefilter;
          ({min, max, prefilter, filter, on_stats, on_exhaustion, max_retries} = {...internals.templates.chr_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          //.....................................................................................................
          prefilter = this._get_filter(prefilter);
          filter = this._get_filter(filter);
          //.....................................................................................................
          return chr = () => {
            var R, sentinel, stats;
            stats = this._new_stats({
              name: 'chr',
              ...(clean({on_stats, on_exhaustion, max_retries}))
            });
            while (true) {
              //...................................................................................................
              R = String.fromCodePoint(this.integer({min, max}));
              if ((prefilter(R)) && (filter(R))) {
                return stats.finish(R);
              }
              if ((sentinel = stats.retry()) !== go_on) {
                return sentinel;
              }
            }
            //...................................................................................................
            return null;
          };
        }

        //-------------------------------------------------------------------------------------------------------
        text_producer(cfg) {
          /* TAINT consider to cache result */
          var filter, length, length_is_const, max, max_length, min, min_length, on_exhaustion, on_stats, text;
          ({min, max, length, min_length, max_length, filter, on_stats, on_exhaustion, max_retries} = {...internals.templates.text_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          //.....................................................................................................
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          length_is_const = min_length === max_length;
          length = min_length;
          filter = this._get_filter(filter);
          //.....................................................................................................
          return text = () => {
            var R, _, sentinel, stats;
            stats = this._new_stats({
              name: 'text',
              ...(clean({on_stats, on_exhaustion, max_retries}))
            });
            if (!length_is_const) {
              //...................................................................................................
              length = this.integer({
                min: min_length,
                max: max_length
              });
            }
            while (true) {
              R = ((function() {
                var i, ref, results;
                results = [];
                for (_ = i = 1, ref = length; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
                  results.push(this.chr({min, max}));
                }
                return results;
              }).call(this)).join('');
              if (filter(R)) {
                return stats.finish(R);
              }
              if ((sentinel = stats.retry()) !== go_on) {
                return sentinel;
              }
            }
            //...................................................................................................
            return null;
          };
        }

        //=======================================================================================================
        // SETS
        //-------------------------------------------------------------------------------------------------------
        set_of_chrs(cfg) {
          var R, chr, max, min, on_exhaustion, on_stats, sentinel, size, stats;
          ({min, max, size, on_stats, on_exhaustion, max_retries} = {...internals.templates.set_of_chrs, ...cfg});
          stats = this._new_stats({
            name: 'set_of_chrs',
            on_stats,
            on_exhaustion,
            max_retries
          });
          R = new Set();
          chr = this.chr_producer({min, max});
          while (true) {
            //.....................................................................................................
            R.add(chr());
            if (R.size >= size) {
              break;
            }
            if ((sentinel = stats.retry()) !== go_on) {
              return sentinel;
            }
          }
          return stats.finish(R);
        }

        //-------------------------------------------------------------------------------------------------------
        set_of_texts(cfg) {
          var R, filter, length, length_is_const, max, max_length, min, min_length, on_exhaustion, on_stats, sentinel, size, stats, text;
          ({min, max, length, size, min_length, max_length, filter, on_stats, on_exhaustion, max_retries} = {...internals.templates.set_of_texts, ...cfg});
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          length_is_const = min_length === max_length;
          length = min_length;
          R = new Set();
          text = this.text_producer({min, max, length, min_length, max_length, filter});
          stats = this._new_stats({
            name: 'set_of_texts',
            on_stats,
            on_exhaustion,
            max_retries
          });
          while (true) {
            //.....................................................................................................
            R.add(text());
            if (R.size >= size) {
              break;
            }
            if ((sentinel = stats.retry()) !== go_on) {
              return sentinel;
            }
          }
          return stats.finish(R);
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
      internals = Object.freeze(internals);
      return exports = {Get_random, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxXQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBO01BRHRCO01BRUYsRUFBQSxHQUFnQixPQUFBLENBQVEsU0FBUjtNQUNoQixJQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLEVBeEJwQjs7TUEwQkksTUFBQSxHQUFTLFFBQUEsQ0FBRSxJQUFGLENBQUE7QUFDYixZQUFBO0FBQU07VUFBSSxFQUFFLENBQUMsUUFBSCxDQUFZLElBQVosRUFBSjtTQUFxQixjQUFBO1VBQU07QUFBVyxpQkFBTyxNQUF4Qjs7QUFDckIsZUFBTztNQUZBLEVBMUJiOztNQThCSSxpQkFBQSxHQUFvQixRQUFBLENBQUUsSUFBRixDQUFBO0FBQ3hCLFlBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBO1FBQ00sSUFBc0YsQ0FBRSxPQUFPLElBQVQsQ0FBQSxLQUFtQixRQUF6Rzs7VUFBQSxNQUFNLElBQUksTUFBTSxDQUFDLG9CQUFYLENBQWdDLENBQUEsMkJBQUEsQ0FBQSxDQUE4QixHQUFBLENBQUksSUFBSixDQUE5QixDQUFBLENBQWhDLEVBQU47O1FBQ0EsTUFBK0YsSUFBSSxDQUFDLE1BQUwsR0FBYyxFQUE3RztVQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSxvQ0FBQSxDQUFBLENBQXVDLEdBQUEsQ0FBSSxJQUFKLENBQXZDLENBQUEsQ0FBaEMsRUFBTjs7UUFDQSxPQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiO1FBQ1gsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZDtRQUNYLElBQU8sbURBQVA7QUFDRSxpQkFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxDQUFBLENBQUcsR0FBRyxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQWdCLFFBQWhCLENBQUEsS0FBQSxDQUFBLENBQWdDLEdBQUcsQ0FBQyxNQUFwQyxDQUFBLENBQW5CLEVBRFQ7O1FBRUEsQ0FBQSxDQUFFLEtBQUYsRUFBUyxFQUFULENBQUEsR0FBa0IsS0FBSyxDQUFDLE1BQXhCO1FBQ0EsRUFBQSxHQUFrQixDQUFBLENBQUEsQ0FBRyxDQUFFLFFBQUEsQ0FBUyxFQUFULEVBQWEsRUFBYixDQUFGLENBQUEsR0FBc0IsQ0FBekIsQ0FBQSxDQUE0QixDQUFDLFFBQTdCLENBQXNDLENBQXRDLEVBQXlDLEdBQXpDO1FBQ2xCLElBQUEsR0FBa0I7QUFDbEIsZUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxDQUFBLENBQUcsR0FBRyxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQWdCLEtBQWhCLENBQUEsQ0FBQSxDQUFBLENBQXlCLEVBQXpCLENBQUEsQ0FBQSxDQUE4QixHQUFHLENBQUMsTUFBbEMsQ0FBQSxDQUFuQjtNQVhXLEVBOUJ4Qjs7TUEyQ0ksc0JBQUEsR0FBeUIsUUFBQSxDQUFFLElBQUYsQ0FBQTtBQUM3QixZQUFBLENBQUEsRUFBQTtRQUFNLENBQUEsR0FBZ0I7UUFDaEIsYUFBQSxHQUFnQixDQUFDO0FBRWpCLGVBQUEsSUFBQSxHQUFBOzs7VUFFRSxhQUFBO1VBQ0EsSUFBRyxhQUFBLEdBQWdCLEdBQUcsQ0FBQyxXQUF2QjtZQUNHLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSxnQkFBQSxDQUFBLENBQW1CLGFBQW5CLENBQUEsaUJBQUEsQ0FBQSxDQUFvRCxHQUFBLENBQUksQ0FBSixDQUFwRCxDQUFBLE9BQUEsQ0FBaEMsRUFEVDtXQUZSOztVQUtRLENBQUEsR0FBSSxpQkFBQSxDQUFrQixDQUFsQjtVQUNKLEtBQWEsTUFBQSxDQUFPLENBQVAsQ0FBYjtBQUFBLGtCQUFBOztRQVBGO0FBUUEsZUFBTztNQVpnQixFQTNDN0I7Ozs7QUEyREksYUFBTyxPQUFBLEdBQVUsQ0FBRSxzQkFBRixFQUEwQixpQkFBMUIsRUFBNkMsTUFBN0MsRUFBcUQsaUJBQXJELEVBQXdFLE1BQXhFO0lBNURTLENBQTVCOzs7SUFnRUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsT0FBQSxFQUFBLHVCQUFBLEVBQUE7TUFBSSxFQUFBLEdBQUssT0FBQSxDQUFRLG9CQUFSLEVBQVQ7O01BRUksdUJBQUEsR0FBMEIsUUFBQSxDQUFFLE9BQUYsRUFBVyxLQUFYLENBQUE7QUFDeEIsZUFBTyxDQUFFLEVBQUUsQ0FBQyxRQUFILENBQVksT0FBWixFQUFxQjtVQUFFLFFBQUEsRUFBVSxPQUFaO1VBQXFCO1FBQXJCLENBQXJCLENBQUYsQ0FBc0QsQ0FBQyxPQUF2RCxDQUErRCxNQUEvRCxFQUF1RSxFQUF2RTtNQURpQixFQUY5Qjs7TUFNSSxzQkFBQSxHQUF5QixRQUFBLENBQUUsSUFBRixDQUFBLEVBQUE7O0FBRXZCLGVBQU8sUUFBQSxDQUFXLHVCQUFBLENBQXdCLHNCQUF4QixFQUFnRCxJQUFoRCxDQUFYLEVBQW1FLEVBQW5FO01BRmdCLEVBTjdCOztBQVdJLGFBQU8sT0FBQSxHQUFVLENBQUUsdUJBQUYsRUFBMkIsc0JBQTNCO0lBWlMsQ0FoRTVCOzs7SUFpRkEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBO01BQUksQ0FBQSxDQUFFLElBQUYsRUFDRSxVQURGLENBQUEsR0FDa0MsQ0FBRSxPQUFBLENBQVEsaUJBQVIsQ0FBRixDQUE2QixDQUFDLDhCQUE5QixDQUFBLENBRGxDLEVBQUo7OztNQUlJLE1BQUEsR0FBYyxvREFKbEI7O01BTUksV0FBQSxHQUFjO01BQ2QsS0FBQSxHQUFjLE1BQUEsQ0FBTyxPQUFQO01BQ2QsS0FBQSxHQUFjLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFBUSxZQUFBLENBQUEsRUFBQTtlQUFDLE1BQU0sQ0FBQyxXQUFQOztBQUFxQjtVQUFBLEtBQUEsTUFBQTs7Z0JBQTZCOzJCQUE3QixDQUFFLENBQUYsRUFBSyxDQUFMOztVQUFBLENBQUE7O1lBQXJCO01BQVQsRUFSbEI7O01BV0ksU0FBQSxHQUNFLENBQUE7UUFBQSxNQUFBLEVBQW9CLE1BQXBCO1FBQ0EsV0FBQSxFQUFvQixXQURwQjtRQUVBLEtBQUEsRUFBb0IsS0FGcEI7UUFHQSxLQUFBLEVBQW9CLEtBSHBCOztRQUtBLFNBQUEsRUFBVyxNQUFNLENBQUMsTUFBUCxDQUNUO1VBQUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLE1BQVAsQ0FDaEI7WUFBQSxJQUFBLEVBQW9CLElBQXBCO1lBQ0EsSUFBQSxFQUFvQixLQURwQjtZQUVBLFdBQUEsRUFBb0IsV0FGcEI7O1lBSUEsUUFBQSxFQUFvQixJQUpwQjtZQUtBLGlCQUFBLEVBQW9CLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBRSxNQUFGLEVBQVUsUUFBVixDQUFkLENBTHBCO1lBTUEsYUFBQSxFQUFvQjtVQU5wQixDQURnQixDQUFsQjtVQVFBLFlBQUEsRUFDRTtZQUFBLEdBQUEsRUFBb0IsUUFBcEI7WUFDQSxHQUFBLEVBQW9CLFFBRHBCO1lBRUEsU0FBQSxFQUFvQixNQUZwQjtZQUdBLE1BQUEsRUFBb0IsSUFIcEI7WUFJQSxhQUFBLEVBQW9CO1VBSnBCLENBVEY7VUFjQSxhQUFBLEVBQ0U7WUFBQSxHQUFBLEVBQW9CLFFBQXBCO1lBQ0EsR0FBQSxFQUFvQixRQURwQjtZQUVBLE1BQUEsRUFBb0IsQ0FGcEI7WUFHQSxVQUFBLEVBQW9CLElBSHBCO1lBSUEsVUFBQSxFQUFvQixJQUpwQjtZQUtBLE1BQUEsRUFBb0IsSUFMcEI7WUFNQSxhQUFBLEVBQW9CO1VBTnBCLENBZkY7VUFzQkEsV0FBQSxFQUNFO1lBQUEsR0FBQSxFQUFvQixRQUFwQjtZQUNBLEdBQUEsRUFBb0IsUUFEcEI7WUFFQSxJQUFBLEVBQW9CLENBRnBCO1lBR0EsYUFBQSxFQUFvQjtVQUhwQixDQXZCRjtVQTJCQSxhQUFBLEVBQ0U7WUFBQSxHQUFBLEVBQW9CLFFBQXBCO1lBQ0EsR0FBQSxFQUFvQixRQURwQjtZQUVBLE1BQUEsRUFBb0IsQ0FGcEI7WUFHQSxJQUFBLEVBQW9CLENBSHBCO1lBSUEsVUFBQSxFQUFvQixJQUpwQjtZQUtBLFVBQUEsRUFBb0IsSUFMcEI7WUFNQSxNQUFBLEVBQW9CLElBTnBCO1lBT0EsYUFBQSxFQUFvQjtVQVBwQixDQTVCRjtVQW9DQSxLQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQ0U7Y0FBQSxPQUFBLEVBQWtCLENBQUM7WUFBbkIsQ0FERjtZQUVBLE9BQUEsRUFDRTtjQUFBLE9BQUEsRUFBa0IsQ0FBQztZQUFuQixDQUhGO1lBSUEsR0FBQSxFQUNFO2NBQUEsT0FBQSxFQUFrQixDQUFDO1lBQW5CLENBTEY7WUFNQSxJQUFBLEVBQ0U7Y0FBQSxPQUFBLEVBQWtCLENBQUM7WUFBbkIsQ0FQRjtZQVFBLFdBQUEsRUFDRTtjQUFBLE9BQUEsRUFBa0IsQ0FBQztZQUFuQixDQVRGO1lBVUEsWUFBQSxFQUNFO2NBQUEsT0FBQSxFQUFrQixDQUFDO1lBQW5CO1VBWEY7UUFyQ0YsQ0FEUztNQUxYO01BeURGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BbUNNLFNBQVMsQ0FBQzs7UUFBaEIsTUFBQSxNQUFBLENBQUE7O1VBR0UsV0FBYSxDQUFDLENBQUUsSUFBRixFQUFRLGFBQUEsR0FBZ0IsT0FBeEIsRUFBaUMsUUFBQSxHQUFXLElBQTVDLEVBQWtELFdBQUEsR0FBYyxJQUFoRSxDQUFELENBQUE7WUFDWCxJQUFDLENBQUEsSUFBRCxHQUEwQjtZQUMxQixJQUFDLENBQUEsV0FBRCx5QkFBMEIsY0FBYyxTQUFTLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDOztjQUM3RSxnQkFBMEI7O1lBQzFCLElBQUEsQ0FBSyxJQUFMLEVBQVEsV0FBUixFQUEwQixLQUExQjtZQUNBLElBQUEsQ0FBSyxJQUFMLEVBQVEsVUFBUixFQUEwQixDQUExQjtZQUNBLElBQUEsQ0FBSyxJQUFMLEVBQVEsZUFBUjtBQUEwQixzQkFBTyxJQUFQO0FBQUEscUJBQ25CLGFBQUEsS0FBNEIsT0FEVDt5QkFDeUIsUUFBQSxDQUFBLENBQUE7b0JBQUcsTUFBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVjtrQkFBVDtBQUR6QixxQkFFbkIsQ0FBRSxPQUFPLGFBQVQsQ0FBQSxLQUE0QixVQUZUO3lCQUV5QjtBQUZ6Qjs7a0JBSW5CLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSx1Q0FBQSxDQUFBLENBQTBDLGFBQTFDLENBQUEsQ0FBVjtBQUphO2dCQUExQjtZQUtBLElBQUEsQ0FBSyxJQUFMLEVBQVEsVUFBUjtBQUEwQixzQkFBTyxJQUFQO0FBQUEscUJBQ25CLENBQUUsT0FBTyxRQUFULENBQUEsS0FBdUIsVUFESjt5QkFDcUI7QUFEckIscUJBRWIsZ0JBRmE7eUJBRXFCO0FBRnJCOztrQkFJbkIsTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLGtDQUFBLENBQUEsQ0FBcUMsUUFBckMsQ0FBQSxDQUFWO0FBSmE7Z0JBQTFCO0FBS0EsbUJBQU87VUFoQkksQ0FEbkI7OztVQW9CTSxLQUFPLENBQUEsQ0FBQTtZQUNMLElBQXNELElBQUMsQ0FBQSxTQUF2RDtjQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsa0NBQVYsRUFBTjs7WUFDQSxJQUFDLENBQUEsUUFBRDtZQUNBLElBQTJCLElBQUMsQ0FBQSxTQUE1QjtBQUFBLHFCQUFPLElBQUMsQ0FBQSxhQUFELENBQUEsRUFBUDs7QUFDQSxtQkFBTztVQUpGLENBcEJiOzs7VUEyQk0sTUFBUSxDQUFFLENBQUYsQ0FBQTtZQUNOLElBQXNELElBQUMsQ0FBQSxTQUF2RDtjQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsa0NBQVYsRUFBTjs7WUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhO1lBQ2IsSUFBb0QscUJBQXBEO2NBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVTtnQkFBRSxJQUFBLEVBQU0sSUFBQyxDQUFBLElBQVQ7Z0JBQWUsT0FBQSxFQUFTLElBQUMsQ0FBQSxPQUF6QjtnQkFBa0M7Y0FBbEMsQ0FBVixFQUFBOztBQUNBLG1CQUFPO1VBSkQ7O1FBN0JWOzs7UUFvQ0UsVUFBQSxDQUFXLEtBQUMsQ0FBQSxTQUFaLEVBQWdCLFVBQWhCLEVBQThCLFFBQUEsQ0FBQSxDQUFBO2lCQUFHLElBQUMsQ0FBQTtRQUFKLENBQTlCOztRQUNBLFVBQUEsQ0FBVyxLQUFDLENBQUEsU0FBWixFQUFnQixTQUFoQixFQUE4QixRQUFBLENBQUEsQ0FBQTtpQkFBRyxJQUFDLENBQUE7UUFBSixDQUE5Qjs7UUFDQSxVQUFBLENBQVcsS0FBQyxDQUFBLFNBQVosRUFBZ0IsV0FBaEIsRUFBOEIsUUFBQSxDQUFBLENBQUE7aUJBQUcsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUE7UUFBaEIsQ0FBOUI7Ozs7b0JBOUlOOztNQWlKVSxhQUFOLE1BQUEsV0FBQSxDQUFBOztRQUdvQixPQUFqQixlQUFpQixDQUFBLENBQUE7aUJBQUcsQ0FBRSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBQSxJQUFLLEVBQXZCLENBQUEsS0FBZ0M7UUFBbkMsQ0FEeEI7OztRQUlNLFdBQWEsQ0FBRSxHQUFGLENBQUE7QUFDbkIsY0FBQTtVQUFRLElBQUMsQ0FBQSxHQUFELEdBQWMsQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsZ0JBQXRCLEVBQTJDLEdBQUEsR0FBM0M7O2dCQUNWLENBQUMsT0FBUyxJQUFDLENBQUEsV0FBVyxDQUFDLGVBQWIsQ0FBQTs7VUFDZCxJQUFBLENBQUssSUFBTCxFQUFRLFFBQVIsRUFBa0IsVUFBQSxDQUFXLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBaEIsQ0FBbEI7QUFDQSxpQkFBTztRQUpJLENBSm5COzs7OztRQWNNLFVBQVksQ0FBRSxHQUFGLENBQUE7QUFDVixpQkFBTyxJQUFJLFNBQVMsQ0FBQyxLQUFkLENBQW9CLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQXRCLEVBQXFDLEdBQUEsQ0FBRSxLQUFBLENBQU0sSUFBQyxDQUFBLEdBQVAsQ0FBRixDQUFyQyxFQUF3RCxHQUFBLEdBQXhELENBQXBCO1FBREcsQ0FkbEI7OztRQWtCTSxtQkFBcUIsQ0FBQyxDQUFFLE1BQUEsR0FBUyxDQUFYLEVBQWMsVUFBQSxHQUFhLElBQTNCLEVBQWlDLFVBQUEsR0FBYSxJQUE5QyxJQUFzRCxDQUFBLENBQXZELENBQUE7VUFDbkIsSUFBRyxrQkFBSDtBQUNFLG1CQUFPO2NBQUUsVUFBRjtjQUFjLFVBQUEsdUJBQWMsYUFBYSxVQUFBLEdBQWE7WUFBdEQsRUFEVDtXQUFBLE1BRUssSUFBRyxrQkFBSDtBQUNILG1CQUFPO2NBQUUsVUFBQSx1QkFBYyxhQUFhLENBQTdCO2NBQWtDO1lBQWxDLEVBREo7O1VBRUwsSUFBc0QsY0FBdEQ7QUFBQSxtQkFBTztjQUFFLFVBQUEsRUFBWSxNQUFkO2NBQXNCLFVBQUEsRUFBWTtZQUFsQyxFQUFQOztVQUNBLE1BQU0sSUFBSSxLQUFKLENBQVUscUVBQVY7UUFOYSxDQWxCM0I7OztRQTJCTSxrQkFBb0IsQ0FBQyxDQUFFLE1BQUEsR0FBUyxDQUFYLEVBQWMsVUFBQSxHQUFhLElBQTNCLEVBQWlDLFVBQUEsR0FBYSxJQUE5QyxJQUFzRCxDQUFBLENBQXZELENBQUE7VUFDbEIsQ0FBQSxDQUFFLFVBQUYsRUFDRSxVQURGLENBQUEsR0FDa0IsSUFBQyxDQUFBLG1CQUFELENBQXFCLENBQUUsTUFBRixFQUFVLFVBQVYsRUFBc0IsVUFBdEIsQ0FBckIsQ0FEbEI7VUFFQSxJQUFxQixVQUFBLEtBQWMsVUFBVyw0Q0FBOUM7QUFBQSxtQkFBTyxXQUFQOztBQUNBLGlCQUFPLElBQUMsQ0FBQSxPQUFELENBQVM7WUFBRSxHQUFBLEVBQUssVUFBUDtZQUFtQixHQUFBLEVBQUs7VUFBeEIsQ0FBVDtRQUpXLENBM0IxQjs7O1FBa0NNLFlBQWMsQ0FBQyxDQUFFLEdBQUEsR0FBTSxJQUFSLEVBQWMsR0FBQSxHQUFNLElBQXBCLElBQTRCLENBQUEsQ0FBN0IsQ0FBQTtVQUNaLElBQTRCLENBQUUsT0FBTyxHQUFULENBQUEsS0FBa0IsUUFBOUM7WUFBQSxHQUFBLEdBQU8sR0FBRyxDQUFDLFdBQUosQ0FBZ0IsQ0FBaEIsRUFBUDs7VUFDQSxJQUE0QixDQUFFLE9BQU8sR0FBVCxDQUFBLEtBQWtCLFFBQTlDO1lBQUEsR0FBQSxHQUFPLEdBQUcsQ0FBQyxXQUFKLENBQWdCLENBQWhCLEVBQVA7OztZQUNBLE1BQU8sSUFBQyxDQUFBLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBRSxDQUFGOzs7WUFDN0IsTUFBTyxJQUFDLENBQUEsR0FBRyxDQUFDLGlCQUFpQixDQUFFLENBQUY7O0FBQzdCLGlCQUFPLENBQUUsR0FBRixFQUFPLEdBQVA7UUFMSyxDQWxDcEI7OztRQTBDTSxXQUFhLENBQUUsTUFBRixDQUFBO1VBQ1gsSUFBMkMsY0FBM0M7QUFBQSxtQkFBTyxDQUFFLFFBQUEsQ0FBRSxDQUFGLENBQUE7cUJBQVM7WUFBVCxDQUFGLEVBQVA7O1VBQ0EsSUFBdUMsQ0FBRSxPQUFPLE1BQVQsQ0FBQSxLQUFxQixVQUE1RDtBQUFBLG1CQUFTLE9BQVQ7O1VBQ0EsSUFBdUMsTUFBQSxZQUFrQixNQUF6RDtBQUFBLG1CQUFPLENBQUUsUUFBQSxDQUFFLENBQUYsQ0FBQTtxQkFBUyxNQUFNLENBQUMsSUFBUCxDQUFZLENBQVo7WUFBVCxDQUFGLEVBQVA7V0FGUjs7VUFJUSxNQUFNLElBQUksS0FBSixDQUFVLENBQUEsNkNBQUEsQ0FBQSxDQUFnRCxRQUFoRCxDQUFBLENBQVY7UUFMSyxDQTFDbkI7Ozs7O1FBcURNLEtBQVUsQ0FBQyxDQUFFLEdBQUEsR0FBTSxDQUFSLEVBQVcsR0FBQSxHQUFNLENBQWpCLElBQXNCLENBQUEsQ0FBdkIsQ0FBQTtpQkFBOEIsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxHQUFZLENBQUUsR0FBQSxHQUFNLEdBQVI7UUFBaEQ7O1FBQ1YsT0FBVSxDQUFDLENBQUUsR0FBQSxHQUFNLENBQVIsRUFBVyxHQUFBLEdBQU0sQ0FBakIsSUFBc0IsQ0FBQSxDQUF2QixDQUFBO2lCQUE4QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFQLENBQVg7UUFBOUI7O1FBQ1YsR0FBVSxDQUFBLEdBQUUsQ0FBRixDQUFBO2lCQUFZLENBQUUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxHQUFBLENBQWQsQ0FBRixDQUFBLENBQUE7UUFBWjs7UUFDVixJQUFVLENBQUEsR0FBRSxDQUFGLENBQUE7aUJBQVksQ0FBRSxJQUFDLENBQUEsYUFBRCxDQUFlLEdBQUEsQ0FBZixDQUFGLENBQUEsQ0FBQTtRQUFaLENBeERoQjs7Ozs7UUE4RE0sY0FBZ0IsQ0FBRSxHQUFGLENBQUE7QUFDdEIsY0FBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsYUFBQSxFQUFBO1VBQVEsQ0FBQSxDQUFFLEdBQUYsRUFDRSxHQURGLEVBRUUsTUFGRixFQUdFLFFBSEYsRUFJRSxhQUpGLEVBS0UsV0FMRixDQUFBLEdBS29CLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQXRCLEVBQXlDLEdBQUEsR0FBekMsQ0FMcEIsRUFBUjs7VUFPUSxDQUFBLENBQUUsR0FBRixFQUNFLEdBREYsQ0FBQSxHQUNvQixJQUFDLENBQUEsWUFBRCxDQUFjLENBQUUsR0FBRixFQUFPLEdBQVAsQ0FBZCxDQURwQjtVQUVBLE1BQUEsR0FBb0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBVDVCOztBQVdRLGlCQUFPLEtBQUEsR0FBUSxDQUFBLENBQUEsR0FBQTtBQUN2QixnQkFBQSxDQUFBLEVBQUEsUUFBQSxFQUFBO1lBQVUsS0FBQSxHQUFRLElBQUMsQ0FBQSxVQUFELENBQVk7Y0FBRSxJQUFBLEVBQU0sT0FBUjtjQUFpQixHQUFBLENBQUUsS0FBQSxDQUFNLENBQUUsUUFBRixFQUFZLGFBQVosRUFBMkIsV0FBM0IsQ0FBTixDQUFGO1lBQWpCLENBQVo7QUFFUixtQkFBQSxJQUFBLEdBQUE7O2NBQ0UsQ0FBQSxHQUFJLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsR0FBWSxDQUFFLEdBQUEsR0FBTSxHQUFSO2NBQ3RCLElBQStCLE1BQUEsQ0FBTyxDQUFQLENBQS9CO0FBQUEsdUJBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFiLEVBQVQ7O2NBQ0EsSUFBdUIsQ0FBRSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFiLENBQUEsS0FBZ0MsS0FBdkQ7QUFBQSx1QkFBTyxTQUFQOztZQUhGLENBRlY7O0FBT1UsbUJBQU87VUFSTTtRQVpELENBOUR0Qjs7O1FBcUZNLGdCQUFrQixDQUFFLEdBQUYsQ0FBQTtBQUN4QixjQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxhQUFBLEVBQUE7VUFBUSxDQUFBLENBQUUsR0FBRixFQUNFLEdBREYsRUFFRSxNQUZGLEVBR0UsUUFIRixFQUlFLGFBSkYsRUFLRSxXQUxGLENBQUEsR0FLb0IsQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsY0FBdEIsRUFBeUMsR0FBQSxHQUF6QyxDQUxwQixFQUFSOztVQU9RLENBQUEsQ0FBRSxHQUFGLEVBQ0UsR0FERixDQUFBLEdBQ29CLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFkLENBRHBCO1VBRUEsTUFBQSxHQUFvQixJQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFUNUI7O0FBV1EsaUJBQU8sT0FBQSxHQUFVLENBQUEsQ0FBQSxHQUFBO0FBQ3pCLGdCQUFBLENBQUEsRUFBQSxRQUFBLEVBQUE7WUFBVSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQUQsQ0FBWTtjQUFFLElBQUEsRUFBTSxTQUFSO2NBQW1CLEdBQUEsQ0FBRSxLQUFBLENBQU0sQ0FBRSxRQUFGLEVBQVksYUFBWixFQUEyQixXQUEzQixDQUFOLENBQUY7WUFBbkIsQ0FBWjtBQUVSLG1CQUFBLElBQUEsR0FBQTs7Y0FDRSxDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLEdBQVksQ0FBRSxHQUFBLEdBQU0sR0FBUixDQUE3QjtjQUNKLElBQStCLE1BQUEsQ0FBTyxDQUFQLENBQS9CO0FBQUEsdUJBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFiLEVBQVQ7O2NBQ0EsSUFBdUIsQ0FBRSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFiLENBQUEsS0FBZ0MsS0FBdkQ7QUFBQSx1QkFBTyxTQUFQOztZQUhGLENBRlY7O0FBT1UsbUJBQU87VUFSUTtRQVpELENBckZ4Qjs7O1FBNEdNLFlBQWMsQ0FBRSxHQUFGLENBQUEsRUFBQTs7QUFDcEIsY0FBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsYUFBQSxFQUFBLFFBQUEsRUFBQTtVQUNRLENBQUEsQ0FBRSxHQUFGLEVBQ0UsR0FERixFQUVFLFNBRkYsRUFHRSxNQUhGLEVBSUUsUUFKRixFQUtFLGFBTEYsRUFNRSxXQU5GLENBQUEsR0FNb0IsQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsWUFBdEIsRUFBdUMsR0FBQSxHQUF2QyxDQU5wQixFQURSOztVQVNRLENBQUEsQ0FBRSxHQUFGLEVBQ0UsR0FERixDQUFBLEdBQ29CLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFkLENBRHBCLEVBVFI7O1VBWVEsU0FBQSxHQUFvQixJQUFDLENBQUEsV0FBRCxDQUFhLFNBQWI7VUFDcEIsTUFBQSxHQUFvQixJQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFiNUI7O0FBZVEsaUJBQU8sR0FBQSxHQUFNLENBQUEsQ0FBQSxHQUFBO0FBQ3JCLGdCQUFBLENBQUEsRUFBQSxRQUFBLEVBQUE7WUFBVSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQUQsQ0FBWTtjQUFFLElBQUEsRUFBTSxLQUFSO2NBQWUsR0FBQSxDQUFFLEtBQUEsQ0FBTSxDQUFFLFFBQUYsRUFBWSxhQUFaLEVBQTJCLFdBQTNCLENBQU4sQ0FBRjtZQUFmLENBQVo7QUFFUixtQkFBQSxJQUFBLEdBQUE7O2NBQ0UsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxhQUFQLENBQXFCLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFULENBQXJCO2NBQ0osSUFBNkIsQ0FBRSxTQUFBLENBQVUsQ0FBVixDQUFGLENBQUEsSUFBb0IsQ0FBRSxNQUFBLENBQU8sQ0FBUCxDQUFGLENBQWpEO0FBQUEsdUJBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFiLEVBQVQ7O2NBQ0EsSUFBdUIsQ0FBRSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFiLENBQUEsS0FBZ0MsS0FBdkQ7QUFBQSx1QkFBTyxTQUFQOztZQUhGLENBRlY7O0FBT1UsbUJBQU87VUFSSTtRQWhCRCxDQTVHcEI7OztRQXVJTSxhQUFlLENBQUUsR0FBRixDQUFBLEVBQUE7O0FBQ3JCLGNBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxlQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxRQUFBLEVBQUE7VUFDUSxDQUFBLENBQUUsR0FBRixFQUNFLEdBREYsRUFFRSxNQUZGLEVBR0UsVUFIRixFQUlFLFVBSkYsRUFLRSxNQUxGLEVBTUUsUUFORixFQU9FLGFBUEYsRUFRRSxXQVJGLENBQUEsR0FRb0IsQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBdEIsRUFBd0MsR0FBQSxHQUF4QyxDQVJwQixFQURSOztVQVdRLENBQUEsQ0FBRSxHQUFGLEVBQ0UsR0FERixDQUFBLEdBQ29CLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFkLENBRHBCLEVBWFI7O1VBY1EsQ0FBQSxDQUFFLFVBQUYsRUFDRSxVQURGLENBQUEsR0FDb0IsSUFBQyxDQUFBLG1CQUFELENBQXFCLENBQUUsTUFBRixFQUFVLFVBQVYsRUFBc0IsVUFBdEIsQ0FBckIsQ0FEcEI7VUFFQSxlQUFBLEdBQW9CLFVBQUEsS0FBYztVQUNsQyxNQUFBLEdBQW9CO1VBQ3BCLE1BQUEsR0FBb0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBbEI1Qjs7QUFvQlEsaUJBQU8sSUFBQSxHQUFPLENBQUEsQ0FBQSxHQUFBO0FBQ3RCLGdCQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsUUFBQSxFQUFBO1lBQVUsS0FBQSxHQUFRLElBQUMsQ0FBQSxVQUFELENBQVk7Y0FBRSxJQUFBLEVBQU0sTUFBUjtjQUFnQixHQUFBLENBQUUsS0FBQSxDQUFNLENBQUUsUUFBRixFQUFZLGFBQVosRUFBMkIsV0FBM0IsQ0FBTixDQUFGO1lBQWhCLENBQVo7WUFFUixLQUErRCxlQUEvRDs7Y0FBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQUQsQ0FBUztnQkFBRSxHQUFBLEVBQUssVUFBUDtnQkFBbUIsR0FBQSxFQUFLO2NBQXhCLENBQVQsRUFBVDs7QUFDQSxtQkFBQSxJQUFBO2NBQ0UsQ0FBQSxHQUFJOztBQUFFO2dCQUFBLEtBQTRCLG1GQUE1QjsrQkFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLENBQUUsR0FBRixFQUFPLEdBQVAsQ0FBTDtnQkFBQSxDQUFBOzsyQkFBRixDQUErQyxDQUFDLElBQWhELENBQXFELEVBQXJEO2NBQ0osSUFBK0IsTUFBQSxDQUFPLENBQVAsQ0FBL0I7QUFBQSx1QkFBUyxLQUFLLENBQUMsTUFBTixDQUFhLENBQWIsRUFBVDs7Y0FDQSxJQUF1QixDQUFFLFFBQUEsR0FBVyxLQUFLLENBQUMsS0FBTixDQUFBLENBQWIsQ0FBQSxLQUFnQyxLQUF2RDtBQUFBLHVCQUFPLFNBQVA7O1lBSEYsQ0FIVjs7QUFRVSxtQkFBTztVQVRLO1FBckJELENBdklyQjs7Ozs7UUEyS00sV0FBYSxDQUFFLEdBQUYsQ0FBQTtBQUNuQixjQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxhQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLEVBQUE7VUFBUSxDQUFBLENBQUUsR0FBRixFQUNFLEdBREYsRUFFRSxJQUZGLEVBR0UsUUFIRixFQUlFLGFBSkYsRUFLRSxXQUxGLENBQUEsR0FLb0IsQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBdEIsRUFBc0MsR0FBQSxHQUF0QyxDQUxwQjtVQU1BLEtBQUEsR0FBb0IsSUFBQyxDQUFBLFVBQUQsQ0FBWTtZQUFFLElBQUEsRUFBTSxhQUFSO1lBQXVCLFFBQXZCO1lBQWlDLGFBQWpDO1lBQWdEO1VBQWhELENBQVo7VUFDcEIsQ0FBQSxHQUFvQixJQUFJLEdBQUosQ0FBQTtVQUNwQixHQUFBLEdBQW9CLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFkO0FBRXBCLGlCQUFBLElBQUEsR0FBQTs7WUFDRSxDQUFDLENBQUMsR0FBRixDQUFNLEdBQUEsQ0FBQSxDQUFOO1lBQ0EsSUFBUyxDQUFDLENBQUMsSUFBRixJQUFVLElBQW5CO0FBQUEsb0JBQUE7O1lBQ0EsSUFBdUIsQ0FBRSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFiLENBQUEsS0FBZ0MsS0FBdkQ7QUFBQSxxQkFBTyxTQUFQOztVQUhGO0FBSUEsaUJBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFiO1FBZkUsQ0EzS25COzs7UUE2TE0sWUFBYyxDQUFFLEdBQUYsQ0FBQTtBQUNwQixjQUFBLENBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLGVBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsYUFBQSxFQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQTtVQUFRLENBQUEsQ0FBRSxHQUFGLEVBQ0UsR0FERixFQUVFLE1BRkYsRUFHRSxJQUhGLEVBSUUsVUFKRixFQUtFLFVBTEYsRUFNRSxNQU5GLEVBT0UsUUFQRixFQVFFLGFBUkYsRUFTRSxXQVRGLENBQUEsR0FTb0IsQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsWUFBdEIsRUFBdUMsR0FBQSxHQUF2QyxDQVRwQjtVQVVBLENBQUEsQ0FBRSxVQUFGLEVBQ0UsVUFERixDQUFBLEdBQ29CLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixDQUFFLE1BQUYsRUFBVSxVQUFWLEVBQXNCLFVBQXRCLENBQXJCLENBRHBCO1VBRUEsZUFBQSxHQUFvQixVQUFBLEtBQWM7VUFDbEMsTUFBQSxHQUFvQjtVQUNwQixDQUFBLEdBQW9CLElBQUksR0FBSixDQUFBO1VBQ3BCLElBQUEsR0FBb0IsSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFFLEdBQUYsRUFBTyxHQUFQLEVBQVksTUFBWixFQUFvQixVQUFwQixFQUFnQyxVQUFoQyxFQUE0QyxNQUE1QyxDQUFmO1VBQ3BCLEtBQUEsR0FBb0IsSUFBQyxDQUFBLFVBQUQsQ0FBWTtZQUFFLElBQUEsRUFBTSxjQUFSO1lBQXdCLFFBQXhCO1lBQWtDLGFBQWxDO1lBQWlEO1VBQWpELENBQVo7QUFFcEIsaUJBQUEsSUFBQSxHQUFBOztZQUNFLENBQUMsQ0FBQyxHQUFGLENBQU0sSUFBQSxDQUFBLENBQU47WUFDQSxJQUFTLENBQUMsQ0FBQyxJQUFGLElBQVUsSUFBbkI7QUFBQSxvQkFBQTs7WUFDQSxJQUF1QixDQUFFLFFBQUEsR0FBVyxLQUFLLENBQUMsS0FBTixDQUFBLENBQWIsQ0FBQSxLQUFnQyxLQUF2RDtBQUFBLHFCQUFPLFNBQVA7O1VBSEY7QUFJQSxpQkFBUyxLQUFLLENBQUMsTUFBTixDQUFhLENBQWI7UUF2QkcsQ0E3THBCOzs7OztRQTBOWSxFQUFOLElBQU0sQ0FBQyxDQUFFLFFBQUYsRUFBWSxDQUFBLEdBQUksQ0FBaEIsSUFBcUIsQ0FBQSxDQUF0QixDQUFBO0FBQ1osY0FBQTtVQUFRLEtBQUEsR0FBUTtBQUNSLGlCQUFBLElBQUE7WUFDRSxLQUFBO1lBQVMsSUFBUyxLQUFBLEdBQVEsQ0FBakI7QUFBQSxvQkFBQTs7WUFDVCxNQUFNLFFBQUEsQ0FBQTtVQUZSO0FBR0EsaUJBQU87UUFMSDs7TUE1TlIsRUFqSko7O01BcVhJLFNBQUEsR0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQ7QUFDWixhQUFPLE9BQUEsR0FBVSxDQUFFLFVBQUYsRUFBYyxTQUFkO0lBdlhHO0VBakZ0QixFQVZGOzs7RUFzZEEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsY0FBOUI7QUF0ZEEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblVOU1RBQkxFX0JSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfbmV4dF9mcmVlX2ZpbGVuYW1lOiAtPlxuICAgIGNmZyA9XG4gICAgICBtYXhfcmV0cmllczogICAgOTk5OVxuICAgICAgcHJlZml4OiAgICAgICAgICd+LidcbiAgICAgIHN1ZmZpeDogICAgICAgICAnLmJyaWNhYnJhYy1jYWNoZSdcbiAgICBjYWNoZV9maWxlbmFtZV9yZSA9IC8vL1xuICAgICAgXlxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcucHJlZml4fSApXG4gICAgICAoPzxmaXJzdD4uKilcbiAgICAgIFxcLlxuICAgICAgKD88bnI+WzAtOV17NH0pXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAgICRcbiAgICAgIC8vL3ZcbiAgICAjIGNhY2hlX3N1ZmZpeF9yZSA9IC8vL1xuICAgICMgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAjICAgJFxuICAgICMgICAvLy92XG4gICAgcnByICAgICAgICAgICAgICAgPSAoIHggKSAtPlxuICAgICAgcmV0dXJuIFwiJyN7eC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIiBpZiAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZyd9J1wiXG4gICAgICByZXR1cm4gXCIje3h9XCJcbiAgICBlcnJvcnMgPVxuICAgICAgVE1QX2V4aGF1c3Rpb25fZXJyb3I6IGNsYXNzIFRNUF9leGhhdXN0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICAgIFRNUF92YWxpZGF0aW9uX2Vycm9yOiBjbGFzcyBUTVBfdmFsaWRhdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgRlMgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4gICAgUEFUSCAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGV4aXN0cyA9ICggcGF0aCApIC0+XG4gICAgICB0cnkgRlMuc3RhdFN5bmMgcGF0aCBjYXRjaCBlcnJvciB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHR5cGUgY2hlY2tpbmcgIyMjXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18xIGV4cGVjdGVkIGEgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzICggdHlwZW9mIHBhdGggKSBpcyAnc3RyaW5nJ1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMiBleHBlY3RlZCBhIG5vbmVtcHR5IHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyBwYXRoLmxlbmd0aCA+IDBcbiAgICAgIGRpcm5hbWUgID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgIGJhc2VuYW1lID0gUEFUSC5iYXNlbmFtZSBwYXRoXG4gICAgICB1bmxlc3MgKCBtYXRjaCA9IGJhc2VuYW1lLm1hdGNoIGNhY2hlX2ZpbGVuYW1lX3JlICk/XG4gICAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tiYXNlbmFtZX0uMDAwMSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICAgeyBmaXJzdCwgbnIsICB9ID0gbWF0Y2guZ3JvdXBzXG4gICAgICBuciAgICAgICAgICAgICAgPSBcIiN7KCBwYXJzZUludCBuciwgMTAgKSArIDF9XCIucGFkU3RhcnQgNCwgJzAnXG4gICAgICBwYXRoICAgICAgICAgICAgPSBmaXJzdFxuICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2ZpcnN0fS4je25yfSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZnJlZV9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICBSICAgICAgICAgICAgID0gcGF0aFxuICAgICAgZmFpbHVyZV9jb3VudCA9IC0xXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGxvb3BcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmYWlsdXJlX2NvdW50KytcbiAgICAgICAgaWYgZmFpbHVyZV9jb3VudCA+IGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF9leGhhdXN0aW9uX2Vycm9yIFwizqlfX18zIHRvbyBtYW55ICgje2ZhaWx1cmVfY291bnR9KSByZXRyaWVzOyAgcGF0aCAje3JwciBSfSBleGlzdHNcIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIFIgPSBnZXRfbmV4dF9maWxlbmFtZSBSXG4gICAgICAgIGJyZWFrIHVubGVzcyBleGlzdHMgUlxuICAgICAgcmV0dXJuIFJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgc3dhcF9zdWZmaXggPSAoIHBhdGgsIHN1ZmZpeCApIC0+IHBhdGgucmVwbGFjZSBjYWNoZV9zdWZmaXhfcmUsIHN1ZmZpeFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUsIGdldF9uZXh0X2ZpbGVuYW1lLCBleGlzdHMsIGNhY2hlX2ZpbGVuYW1lX3JlLCBlcnJvcnMsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9jb21tYW5kX2xpbmVfdG9vbHM6IC0+XG4gICAgQ1AgPSByZXF1aXJlICdub2RlOmNoaWxkX3Byb2Nlc3MnXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgPSAoIGNvbW1hbmQsIGlucHV0ICkgLT5cbiAgICAgIHJldHVybiAoIENQLmV4ZWNTeW5jIGNvbW1hbmQsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIGlucHV0LCB9ICkucmVwbGFjZSAvXFxuJC9zLCAnJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X3djX21heF9saW5lX2xlbmd0aCA9ICggdGV4dCApIC0+XG4gICAgICAjIyMgdGh4IHRvIGh0dHBzOi8vdW5peC5zdGFja2V4Y2hhbmdlLmNvbS9hLzI1ODU1MS8yODAyMDQgIyMjXG4gICAgICByZXR1cm4gcGFyc2VJbnQgKCBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCAnd2MgLS1tYXgtbGluZS1sZW5ndGgnLCB0ZXh0ICksIDEwXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCwgZ2V0X3djX21heF9saW5lX2xlbmd0aCwgfVxuXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfcmFuZG9tX3Rvb2xzOiAtPlxuICAgIHsgaGlkZSxcbiAgICAgIHNldF9nZXR0ZXIsICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICAjIyMgVEFJTlQgcmVwbGFjZSAjIyNcbiAgICAjIHsgZGVmYXVsdDogX2dldF91bmlxdWVfdGV4dCwgIH0gPSByZXF1aXJlICd1bmlxdWUtc3RyaW5nJ1xuICAgIGNocl9yZSAgICAgID0gLy8vXig/OlxccHtMfXxcXHB7WnN9fFxccHtafXxcXHB7TX18XFxwe059fFxccHtQfXxcXHB7U30pJC8vL3ZcbiAgICAjIG1heF9yZXRyaWVzID0gOV85OTlcbiAgICBtYXhfcmV0cmllcyA9IDFfMDAwXG4gICAgZ29fb24gICAgICAgPSBTeW1ib2wgJ2dvX29uJ1xuICAgIGNsZWFuICAgICAgID0gKCB4ICkgLT4gT2JqZWN0LmZyb21FbnRyaWVzICggWyBrLCB2LCBdIGZvciBrLCB2IG9mIHggd2hlbiB2PyApXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0gIyBPYmplY3QuZnJlZXplXG4gICAgICBjaHJfcmU6ICAgICAgICAgICAgIGNocl9yZVxuICAgICAgbWF4X3JldHJpZXM6ICAgICAgICBtYXhfcmV0cmllc1xuICAgICAgZ29fb246ICAgICAgICAgICAgICBnb19vblxuICAgICAgY2xlYW46ICAgICAgICAgICAgICBjbGVhblxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHRlbXBsYXRlczogT2JqZWN0LmZyZWV6ZVxuICAgICAgICByYW5kb21fdG9vbHNfY2ZnOiBPYmplY3QuZnJlZXplXG4gICAgICAgICAgc2VlZDogICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAxXzAwMFxuICAgICAgICAgIG1heF9yZXRyaWVzOiAgICAgICAgbWF4X3JldHJpZXNcbiAgICAgICAgICAjIHVuaXF1ZV9jb3VudDogICAxXzAwMFxuICAgICAgICAgIG9uX3N0YXRzOiAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHVuaWNvZGVfY2lkX3JhbmdlOiAgT2JqZWN0LmZyZWV6ZSBbIDB4MDAwMCwgMHgxMGZmZmYgXVxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBjaHJfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBwcmVmaWx0ZXI6ICAgICAgICAgIGNocl9yZVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICB0ZXh0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgbGVuZ3RoOiAgICAgICAgICAgICAxXG4gICAgICAgICAgbWluX2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHRleHRfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBsZW5ndGg6ICAgICAgICAgICAgIDFcbiAgICAgICAgICBzaXplOiAgICAgICAgICAgICAgIDJcbiAgICAgICAgICBtaW5fbGVuZ3RoOiAgICAgICAgIG51bGxcbiAgICAgICAgICBtYXhfbGVuZ3RoOiAgICAgICAgIG51bGxcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgc3RhdHM6XG4gICAgICAgICAgZmxvYXQ6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIGludGVnZXI6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIGNocjpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG4gICAgICAgICAgdGV4dDpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG4gICAgICAgICAgc2V0X29mX2NocnM6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl90ZXh0czpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYGBgXG4gICAgLy8gdGh4IHRvIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NzU5MzMxNi83NTY4MDkxXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTIxMjk1L3NlZWRpbmctdGhlLXJhbmRvbS1udW1iZXItZ2VuZXJhdG9yLWluLWphdmFzY3JpcHRcblxuICAgIC8vIFNwbGl0TWl4MzJcblxuICAgIC8vIEEgMzItYml0IHN0YXRlIFBSTkcgdGhhdCB3YXMgbWFkZSBieSB0YWtpbmcgTXVybXVySGFzaDMncyBtaXhpbmcgZnVuY3Rpb24sIGFkZGluZyBhIGluY3JlbWVudG9yIGFuZFxuICAgIC8vIHR3ZWFraW5nIHRoZSBjb25zdGFudHMuIEl0J3MgcG90ZW50aWFsbHkgb25lIG9mIHRoZSBiZXR0ZXIgMzItYml0IFBSTkdzIHNvIGZhcjsgZXZlbiB0aGUgYXV0aG9yIG9mXG4gICAgLy8gTXVsYmVycnkzMiBjb25zaWRlcnMgaXQgdG8gYmUgdGhlIGJldHRlciBjaG9pY2UuIEl0J3MgYWxzbyBqdXN0IGFzIGZhc3QuXG5cbiAgICBjb25zdCBzcGxpdG1peDMyID0gZnVuY3Rpb24gKCBhICkge1xuICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgYSB8PSAwO1xuICAgICAgIGEgPSBhICsgMHg5ZTM3NzliOSB8IDA7XG4gICAgICAgbGV0IHQgPSBhIF4gYSA+Pj4gMTY7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDIxZjBhYWFkKTtcbiAgICAgICB0ID0gdCBeIHQgPj4+IDE1O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHg3MzVhMmQ5Nyk7XG4gICAgICAgcmV0dXJuICgodCA9IHQgXiB0ID4+PiAxNSkgPj4+IDApIC8gNDI5NDk2NzI5NjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zdCBwcm5nID0gc3BsaXRtaXgzMigoTWF0aC5yYW5kb20oKSoyKiozMik+Pj4wKVxuICAgIC8vIGZvcihsZXQgaT0wOyBpPDEwOyBpKyspIGNvbnNvbGUubG9nKHBybmcoKSk7XG4gICAgLy9cbiAgICAvLyBJIHdvdWxkIHJlY29tbWVuZCB0aGlzIGlmIHlvdSBqdXN0IG5lZWQgYSBzaW1wbGUgYnV0IGdvb2QgUFJORyBhbmQgZG9uJ3QgbmVlZCBiaWxsaW9ucyBvZiByYW5kb21cbiAgICAvLyBudW1iZXJzIChzZWUgQmlydGhkYXkgcHJvYmxlbSkuXG4gICAgLy9cbiAgICAvLyBOb3RlOiBJdCBkb2VzIGhhdmUgb25lIHBvdGVudGlhbCBjb25jZXJuOiBpdCBkb2VzIG5vdCByZXBlYXQgcHJldmlvdXMgbnVtYmVycyB1bnRpbCB5b3UgZXhoYXVzdCA0LjNcbiAgICAvLyBiaWxsaW9uIG51bWJlcnMgYW5kIGl0IHJlcGVhdHMgYWdhaW4uIFdoaWNoIG1heSBvciBtYXkgbm90IGJlIGEgc3RhdGlzdGljYWwgY29uY2VybiBmb3IgeW91ciB1c2VcbiAgICAvLyBjYXNlLiBJdCdzIGxpa2UgYSBsaXN0IG9mIHJhbmRvbSBudW1iZXJzIHdpdGggdGhlIGR1cGxpY2F0ZXMgcmVtb3ZlZCwgYnV0IHdpdGhvdXQgYW55IGV4dHJhIHdvcmtcbiAgICAvLyBpbnZvbHZlZCB0byByZW1vdmUgdGhlbS4gQWxsIG90aGVyIGdlbmVyYXRvcnMgaW4gdGhpcyBsaXN0IGRvIG5vdCBleGhpYml0IHRoaXMgYmVoYXZpb3IuXG4gICAgYGBgXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgaW50ZXJuYWxzLlN0YXRzXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKHsgbmFtZSwgb25fZXhoYXVzdGlvbiA9ICdlcnJvcicsIG9uX3N0YXRzID0gbnVsbCwgbWF4X3JldHJpZXMgPSBudWxsIH0pIC0+XG4gICAgICAgIEBuYW1lICAgICAgICAgICAgICAgICAgID0gbmFtZVxuICAgICAgICBAbWF4X3JldHJpZXMgICAgICAgICAgICA9IG1heF9yZXRyaWVzID8gaW50ZXJuYWxzLnRlbXBsYXRlcy5yYW5kb21fdG9vbHNfY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgIG9uX2V4aGF1c3Rpb24gICAgICAgICAgPz0gJ2Vycm9yJ1xuICAgICAgICBoaWRlIEAsICdfZmluaXNoZWQnLCAgICAgIGZhbHNlXG4gICAgICAgIGhpZGUgQCwgJ19yZXRyaWVzJywgICAgICAgMFxuICAgICAgICBoaWRlIEAsICdvbl9leGhhdXN0aW9uJywgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiBvbl9leGhhdXN0aW9uICAgICAgICAgICAgaXMgJ2Vycm9yJyAgICB0aGVuIC0+IHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBleGhhdXN0ZWRcIlxuICAgICAgICAgIHdoZW4gKCB0eXBlb2Ygb25fZXhoYXVzdGlvbiApIGlzICdmdW5jdGlvbicgdGhlbiBvbl9leGhhdXN0aW9uXG4gICAgICAgICAgIyMjIFRBSU5UIHVzZSBycHIsIHR5cGluZyAjIyNcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNSBpbGxlZ2FsIHZhbHVlIGZvciBvbl9leGhhdXN0aW9uOiAje29uX2V4aGF1c3Rpb259XCJcbiAgICAgICAgaGlkZSBALCAnb25fc3RhdHMnLCAgICAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gKCB0eXBlb2Ygb25fc3RhdHMgKSBpcyAnZnVuY3Rpb24nICB0aGVuIG9uX3N0YXRzXG4gICAgICAgICAgd2hlbiAoIG5vdCBvbl9zdGF0cz8gKSAgICAgICAgICAgICAgICAgIHRoZW4gbnVsbFxuICAgICAgICAgICMjIyBUQUlOVCB1c2UgcnByLCB0eXBpbmcgIyMjXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzYgaWxsZWdhbCB2YWx1ZSBmb3Igb25fc3RhdHM6ICN7b25fc3RhdHN9XCJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcmV0cnk6IC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNyBzdGF0cyBoYXMgYWxyZWFkeSBmaW5pc2hlZFwiIGlmIEBfZmluaXNoZWRcbiAgICAgICAgQF9yZXRyaWVzKytcbiAgICAgICAgcmV0dXJuIEBvbl9leGhhdXN0aW9uKCkgaWYgQGV4aGF1c3RlZFxuICAgICAgICByZXR1cm4gZ29fb25cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZpbmlzaDogKCBSICkgLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX184IHN0YXRzIGhhcyBhbHJlYWR5IGZpbmlzaGVkXCIgaWYgQF9maW5pc2hlZFxuICAgICAgICBAX2ZpbmlzaGVkID0gdHJ1ZVxuICAgICAgICBAb25fc3RhdHMgeyBuYW1lOiBAbmFtZSwgcmV0cmllczogQHJldHJpZXMsIFIsIH0gaWYgQG9uX3N0YXRzP1xuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdmaW5pc2hlZCcsICAgLT4gQF9maW5pc2hlZFxuICAgICAgc2V0X2dldHRlciBAOjosICdyZXRyaWVzJywgICAgLT4gQF9yZXRyaWVzXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2V4aGF1c3RlZCcsICAtPiBAX3JldHJpZXMgPiBAbWF4X3JldHJpZXNcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBHZXRfcmFuZG9tXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZ2V0X3JhbmRvbV9zZWVkOiAtPiAoIE1hdGgucmFuZG9tKCkgKiAyICoqIDMyICkgPj4+IDBcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAY2ZnLnNlZWQgID89IEBjb25zdHJ1Y3Rvci5nZXRfcmFuZG9tX3NlZWQoKVxuICAgICAgICBoaWRlIEAsICdfZmxvYXQnLCBzcGxpdG1peDMyIEBjZmcuc2VlZFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgSU5URVJOQUxTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX25ld19zdGF0czogKCBjZmcgKSAtPlxuICAgICAgICByZXR1cm4gbmV3IGludGVybmFscy5TdGF0cyB7IGludGVybmFscy50ZW1wbGF0ZXMuX25ld19zdGF0cy4uLiwgKCBjbGVhbiBAY2ZnICkuLi4sIGNmZy4uLiwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4X2xlbmd0aDogKHsgbGVuZ3RoID0gMSwgbWluX2xlbmd0aCA9IG51bGwsIG1heF9sZW5ndGggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBpZiBtaW5fbGVuZ3RoP1xuICAgICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGgsIG1heF9sZW5ndGg6ICggbWF4X2xlbmd0aCA/IG1pbl9sZW5ndGggKiAyICksIH1cbiAgICAgICAgZWxzZSBpZiBtYXhfbGVuZ3RoP1xuICAgICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6ICggbWluX2xlbmd0aCA/IDEgKSwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoOiBsZW5ndGgsIG1heF9sZW5ndGg6IGxlbmd0aCwgfSBpZiBsZW5ndGg/XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX18xMiBtdXN0IHNldCBhdCBsZWFzdCBvbmUgb2YgYGxlbmd0aGAsIGBtaW5fbGVuZ3RoYCwgYG1heF9sZW5ndGhgXCJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfcmFuZG9tX2xlbmd0aDogKHsgbGVuZ3RoID0gMSwgbWluX2xlbmd0aCA9IG51bGwsIG1heF9sZW5ndGggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiBtaW5fbGVuZ3RoIGlmIG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aCAjIyMgTk9URSBkb25lIHRvIGF2b2lkIGNoYW5naW5nIFBSTkcgc3RhdGUgIyMjXG4gICAgICAgIHJldHVybiBAaW50ZWdlciB7IG1pbjogbWluX2xlbmd0aCwgbWF4OiBtYXhfbGVuZ3RoLCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X21pbl9tYXg6ICh7IG1pbiA9IG51bGwsIG1heCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIG1pbiAgPSBtaW4uY29kZVBvaW50QXQgMCBpZiAoIHR5cGVvZiBtaW4gKSBpcyAnc3RyaW5nJ1xuICAgICAgICBtYXggID0gbWF4LmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWF4ICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWluID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDAgXVxuICAgICAgICBtYXggPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMSBdXG4gICAgICAgIHJldHVybiB7IG1pbiwgbWF4LCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X2ZpbHRlcjogKCBmaWx0ZXIgKSAtPlxuICAgICAgICByZXR1cm4gKCAoIHggKSAtPiB0cnVlICAgICAgICAgICAgKSB1bmxlc3MgZmlsdGVyP1xuICAgICAgICByZXR1cm4gKCBmaWx0ZXIgICAgICAgICAgICAgICAgICAgKSBpZiAoIHR5cGVvZiBmaWx0ZXIgKSBpcyAnZnVuY3Rpb24nXG4gICAgICAgIHJldHVybiAoICggeCApIC0+IGZpbHRlci50ZXN0IHggICApIGlmIGZpbHRlciBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgICAjIyMgVEFJTlQgdXNlIGBycHJgLCB0eXBpbmcgIyMjXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX18xMyB1bmFibGUgdG8gdHVybiBhcmd1bWVudCBpbnRvIGEgZmlsdGVyOiAje2FyZ3VtZW50fVwiXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgQ09OVkVOSUVOQ0VcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmbG9hdDogICAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgaW50ZWdlcjogICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IE1hdGgucm91bmQgQGZsb2F0IHsgbWluLCBtYXgsIH1cbiAgICAgIGNocjogICAgICAoIFAuLi4gKSAtPiAoIEBjaHJfcHJvZHVjZXIgUC4uLiApKClcbiAgICAgIHRleHQ6ICAgICAoIFAuLi4gKSAtPiAoIEB0ZXh0X3Byb2R1Y2VyIFAuLi4gKSgpXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgUFJPRFVDRVJTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXRfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzLCAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gZmxvYXQgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnZmxvYXQnLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGludGVnZXJfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzLCAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gaW50ZWdlciA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdpbnRlZ2VyJywgKCBjbGVhbiB7IG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcmV0cmllcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBNYXRoLnJvdW5kIG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNocl9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgY29uc2lkZXIgdG8gY2FjaGUgcmVzdWx0ICMjI1xuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgcHJlZmlsdGVyLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzLCAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5jaHJfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwcmVmaWx0ZXIgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBwcmVmaWx0ZXJcbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gY2hyID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ2NocicsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JldHJpZXMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gU3RyaW5nLmZyb21Db2RlUG9pbnQgQGludGVnZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIHByZWZpbHRlciBSICkgYW5kICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB0ZXh0X3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgICMjIyBUQUlOVCBjb25zaWRlciB0byBjYWNoZSByZXN1bHQgIyMjXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy50ZXh0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiB0ZXh0ID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3RleHQnLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbGVuZ3RoID0gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfSB1bmxlc3MgbGVuZ3RoX2lzX2NvbnN0XG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9ICggQGNociB7IG1pbiwgbWF4LCB9IGZvciBfIGluIFsgMSAuLiBsZW5ndGggXSApLmpvaW4gJydcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBTRVRTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX2NocnM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIHNpemUsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcywgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX2NocnMuLi4sIGNmZy4uLiwgfVxuICAgICAgICBzdGF0cyAgICAgICAgICAgICA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3NldF9vZl9jaHJzJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9XG4gICAgICAgIFIgICAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgIGNociAgICAgICAgICAgICAgID0gQGNocl9wcm9kdWNlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsb29wXG4gICAgICAgICAgUi5hZGQgY2hyKClcbiAgICAgICAgICBicmVhayBpZiBSLnNpemUgPj0gc2l6ZVxuICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfb2ZfdGV4dHM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcywgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX3RleHRzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICB0ZXh0ICAgICAgICAgICAgICA9IEB0ZXh0X3Byb2R1Y2VyIHsgbWluLCBtYXgsIGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgZmlsdGVyLCB9XG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnc2V0X29mX3RleHRzJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsb29wXG4gICAgICAgICAgUi5hZGQgdGV4dCgpXG4gICAgICAgICAgYnJlYWsgaWYgUi5zaXplID49IHNpemVcbiAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKVxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFdBTEtFUlNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3YWxrOiAoeyBwcm9kdWNlciwgbiA9IDEsIH09e30pIC0+XG4gICAgICAgIGNvdW50ID0gMFxuICAgICAgICBsb29wXG4gICAgICAgICAgY291bnQrKzsgYnJlYWsgaWYgY291bnQgPiBuXG4gICAgICAgICAgeWllbGQgcHJvZHVjZXIoKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgaW50ZXJuYWxzXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEdldF9yYW5kb20sIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgVU5TVEFCTEVfQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-brics.coffee