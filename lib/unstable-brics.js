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
      var Get_random, chr_re, exports, go_on, hide, internals, max_retries, set_getter;
      ({hide, set_getter} = (require('./various-brics')).require_managed_property_tools());
      /* TAINT replace */
      // { default: _get_unique_text,  } = require 'unique-string'
      chr_re = /^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$/v;
      // max_retries = 9_999
      max_retries = 1_000;
      go_on = Symbol('go_on');
      //---------------------------------------------------------------------------------------------------------
      internals = { // Object.freeze
        chr_re: chr_re,
        max_retries: max_retries,
        go_on: go_on,
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
            this._retries++;
            if (this.exhausted) {
              return this.on_exhaustion();
            }
            return go_on;
          }

          //-------------------------------------------------------------------------------------------------------
          finish(return_value) {
            if (this.on_stats != null) {
              /* TAINT don't use `stats` prop, use `retries` */
              this.on_stats({
                name,
                stats: this,
                R: return_value
              });
            }
            return R;
          }

        };

        //-------------------------------------------------------------------------------------------------------
        set_getter(Stats.prototype, 'retries', function() {
          return this._retries;
        });

        set_getter(Stats.prototype, 'exhausted', function() {
          return this._retries >= this.max_retries;
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

        // #=======================================================================================================
        // # STATS
        // #-------------------------------------------------------------------------------------------------------
        // _create_stats_for: ( name, on_exhaustion = 'error' ) ->
        //   stats = new Stats { name, on_exhaustion, }
        //   unless ( template = internals.templates.stats[ name ] )?
        //     throw new Error "Ω___7 unknown stats name #{name}" ### TAINT use rpr() ###
        //   stats = { template..., }
        //   #.....................................................................................................
        //   if @cfg.on_stats? then  finish = ( R ) => @cfg.on_stats { name, stats, R, }; R
        //   else                    finish = ( R ) => R
        //   #.....................................................................................................
        //   return { stats, finish, }

          //=======================================================================================================
        // INTERNALS
        //-------------------------------------------------------------------------------------------------------
        _new_stats() {
          return new Stats();
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
          throw new Error("Ω___8 must set at least one of `length`, `min_length`, `max_length`");
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
          throw new Error(`Ω___9 unable to turn argument into a filter: ${argument}`);
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
                throw new Error("Ω__10 exhausted");
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
                throw new Error("Ω__11 exhausted");
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
                throw new Error("Ω__13 exhausted");
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
          var R, chr, finish, max, min, sentinel, size, stats;
          ({stats, finish} = this._create_stats_for('set_of_chrs'));
          ({min, max, size} = {...internals.templates.set_of_chrs, ...cfg});
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
              throw new Error("Ω__14 exhausted");
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
      internals = Object.freeze(internals);
      return exports = {Get_random, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxXQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBO01BRHRCO01BRUYsRUFBQSxHQUFnQixPQUFBLENBQVEsU0FBUjtNQUNoQixJQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLEVBeEJwQjs7TUEwQkksTUFBQSxHQUFTLFFBQUEsQ0FBRSxJQUFGLENBQUE7QUFDYixZQUFBO0FBQU07VUFBSSxFQUFFLENBQUMsUUFBSCxDQUFZLElBQVosRUFBSjtTQUFxQixjQUFBO1VBQU07QUFBVyxpQkFBTyxNQUF4Qjs7QUFDckIsZUFBTztNQUZBLEVBMUJiOztNQThCSSxpQkFBQSxHQUFvQixRQUFBLENBQUUsSUFBRixDQUFBO0FBQ3hCLFlBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBO1FBQ00sSUFBc0YsQ0FBRSxPQUFPLElBQVQsQ0FBQSxLQUFtQixRQUF6Rzs7VUFBQSxNQUFNLElBQUksTUFBTSxDQUFDLG9CQUFYLENBQWdDLENBQUEsMkJBQUEsQ0FBQSxDQUE4QixHQUFBLENBQUksSUFBSixDQUE5QixDQUFBLENBQWhDLEVBQU47O1FBQ0EsTUFBK0YsSUFBSSxDQUFDLE1BQUwsR0FBYyxFQUE3RztVQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSxvQ0FBQSxDQUFBLENBQXVDLEdBQUEsQ0FBSSxJQUFKLENBQXZDLENBQUEsQ0FBaEMsRUFBTjs7UUFDQSxPQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiO1FBQ1gsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZDtRQUNYLElBQU8sbURBQVA7QUFDRSxpQkFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxDQUFBLENBQUcsR0FBRyxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQWdCLFFBQWhCLENBQUEsS0FBQSxDQUFBLENBQWdDLEdBQUcsQ0FBQyxNQUFwQyxDQUFBLENBQW5CLEVBRFQ7O1FBRUEsQ0FBQSxDQUFFLEtBQUYsRUFBUyxFQUFULENBQUEsR0FBa0IsS0FBSyxDQUFDLE1BQXhCO1FBQ0EsRUFBQSxHQUFrQixDQUFBLENBQUEsQ0FBRyxDQUFFLFFBQUEsQ0FBUyxFQUFULEVBQWEsRUFBYixDQUFGLENBQUEsR0FBc0IsQ0FBekIsQ0FBQSxDQUE0QixDQUFDLFFBQTdCLENBQXNDLENBQXRDLEVBQXlDLEdBQXpDO1FBQ2xCLElBQUEsR0FBa0I7QUFDbEIsZUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxDQUFBLENBQUcsR0FBRyxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQWdCLEtBQWhCLENBQUEsQ0FBQSxDQUFBLENBQXlCLEVBQXpCLENBQUEsQ0FBQSxDQUE4QixHQUFHLENBQUMsTUFBbEMsQ0FBQSxDQUFuQjtNQVhXLEVBOUJ4Qjs7TUEyQ0ksc0JBQUEsR0FBeUIsUUFBQSxDQUFFLElBQUYsQ0FBQTtBQUM3QixZQUFBLENBQUEsRUFBQTtRQUFNLENBQUEsR0FBZ0I7UUFDaEIsYUFBQSxHQUFnQixDQUFDO0FBRWpCLGVBQUEsSUFBQSxHQUFBOzs7VUFFRSxhQUFBO1VBQ0EsSUFBRyxhQUFBLEdBQWdCLEdBQUcsQ0FBQyxXQUF2QjtZQUNHLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSxnQkFBQSxDQUFBLENBQW1CLGFBQW5CLENBQUEsaUJBQUEsQ0FBQSxDQUFvRCxHQUFBLENBQUksQ0FBSixDQUFwRCxDQUFBLE9BQUEsQ0FBaEMsRUFEVDtXQUZSOztVQUtRLENBQUEsR0FBSSxpQkFBQSxDQUFrQixDQUFsQjtVQUNKLEtBQWEsTUFBQSxDQUFPLENBQVAsQ0FBYjtBQUFBLGtCQUFBOztRQVBGO0FBUUEsZUFBTztNQVpnQixFQTNDN0I7Ozs7QUEyREksYUFBTyxPQUFBLEdBQVUsQ0FBRSxzQkFBRixFQUEwQixpQkFBMUIsRUFBNkMsTUFBN0MsRUFBcUQsaUJBQXJELEVBQXdFLE1BQXhFO0lBNURTLENBQTVCOzs7SUFnRUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsT0FBQSxFQUFBLHVCQUFBLEVBQUE7TUFBSSxFQUFBLEdBQUssT0FBQSxDQUFRLG9CQUFSLEVBQVQ7O01BRUksdUJBQUEsR0FBMEIsUUFBQSxDQUFFLE9BQUYsRUFBVyxLQUFYLENBQUE7QUFDeEIsZUFBTyxDQUFFLEVBQUUsQ0FBQyxRQUFILENBQVksT0FBWixFQUFxQjtVQUFFLFFBQUEsRUFBVSxPQUFaO1VBQXFCO1FBQXJCLENBQXJCLENBQUYsQ0FBc0QsQ0FBQyxPQUF2RCxDQUErRCxNQUEvRCxFQUF1RSxFQUF2RTtNQURpQixFQUY5Qjs7TUFNSSxzQkFBQSxHQUF5QixRQUFBLENBQUUsSUFBRixDQUFBLEVBQUE7O0FBRXZCLGVBQU8sUUFBQSxDQUFXLHVCQUFBLENBQXdCLHNCQUF4QixFQUFnRCxJQUFoRCxDQUFYLEVBQW1FLEVBQW5FO01BRmdCLEVBTjdCOztBQVdJLGFBQU8sT0FBQSxHQUFVLENBQUUsdUJBQUYsRUFBMkIsc0JBQTNCO0lBWlMsQ0FoRTVCOzs7SUFpRkEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxXQUFBLEVBQUE7TUFBSSxDQUFBLENBQUUsSUFBRixFQUNFLFVBREYsQ0FBQSxHQUNrQyxDQUFFLE9BQUEsQ0FBUSxpQkFBUixDQUFGLENBQTZCLENBQUMsOEJBQTlCLENBQUEsQ0FEbEMsRUFBSjs7O01BSUksTUFBQSxHQUFjLG9EQUpsQjs7TUFNSSxXQUFBLEdBQWM7TUFDZCxLQUFBLEdBQWMsTUFBQSxDQUFPLE9BQVAsRUFQbEI7O01BVUksU0FBQSxHQUNFLENBQUE7UUFBQSxNQUFBLEVBQW9CLE1BQXBCO1FBQ0EsV0FBQSxFQUFvQixXQURwQjtRQUVBLEtBQUEsRUFBb0IsS0FGcEI7O1FBSUEsU0FBQSxFQUFXLE1BQU0sQ0FBQyxNQUFQLENBQ1Q7VUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsTUFBUCxDQUNoQjtZQUFBLElBQUEsRUFBb0IsSUFBcEI7WUFDQSxJQUFBLEVBQW9CLEtBRHBCO1lBRUEsV0FBQSxFQUFvQixXQUZwQjs7WUFJQSxRQUFBLEVBQW9CLElBSnBCO1lBS0EsaUJBQUEsRUFBb0IsTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFFLE1BQUYsRUFBVSxRQUFWLENBQWQsQ0FMcEI7WUFNQSxhQUFBLEVBQW9CO1VBTnBCLENBRGdCLENBQWxCO1VBUUEsWUFBQSxFQUNFO1lBQUEsR0FBQSxFQUFvQixRQUFwQjtZQUNBLEdBQUEsRUFBb0IsUUFEcEI7WUFFQSxTQUFBLEVBQW9CLE1BRnBCO1lBR0EsTUFBQSxFQUFvQixJQUhwQjtZQUlBLGFBQUEsRUFBb0I7VUFKcEIsQ0FURjtVQWNBLGFBQUEsRUFDRTtZQUFBLEdBQUEsRUFBb0IsUUFBcEI7WUFDQSxHQUFBLEVBQW9CLFFBRHBCO1lBRUEsTUFBQSxFQUFvQixDQUZwQjtZQUdBLFVBQUEsRUFBb0IsSUFIcEI7WUFJQSxVQUFBLEVBQW9CLElBSnBCO1lBS0EsTUFBQSxFQUFvQixJQUxwQjtZQU1BLGFBQUEsRUFBb0I7VUFOcEIsQ0FmRjtVQXNCQSxXQUFBLEVBQ0U7WUFBQSxHQUFBLEVBQW9CLFFBQXBCO1lBQ0EsR0FBQSxFQUFvQixRQURwQjtZQUVBLElBQUEsRUFBb0IsQ0FGcEI7WUFHQSxhQUFBLEVBQW9CO1VBSHBCLENBdkJGO1VBMkJBLGFBQUEsRUFDRTtZQUFBLEdBQUEsRUFBb0IsUUFBcEI7WUFDQSxHQUFBLEVBQW9CLFFBRHBCO1lBRUEsTUFBQSxFQUFvQixDQUZwQjtZQUdBLElBQUEsRUFBb0IsQ0FIcEI7WUFJQSxVQUFBLEVBQW9CLElBSnBCO1lBS0EsVUFBQSxFQUFvQixJQUxwQjtZQU1BLE1BQUEsRUFBb0IsSUFOcEI7WUFPQSxhQUFBLEVBQW9CO1VBUHBCLENBNUJGO1VBb0NBLEtBQUEsRUFDRTtZQUFBLEtBQUEsRUFDRTtjQUFBLE9BQUEsRUFBa0IsQ0FBQztZQUFuQixDQURGO1lBRUEsT0FBQSxFQUNFO2NBQUEsT0FBQSxFQUFrQixDQUFDO1lBQW5CLENBSEY7WUFJQSxHQUFBLEVBQ0U7Y0FBQSxPQUFBLEVBQWtCLENBQUM7WUFBbkIsQ0FMRjtZQU1BLElBQUEsRUFDRTtjQUFBLE9BQUEsRUFBa0IsQ0FBQztZQUFuQixDQVBGO1lBUUEsV0FBQSxFQUNFO2NBQUEsT0FBQSxFQUFrQixDQUFDO1lBQW5CLENBVEY7WUFVQSxZQUFBLEVBQ0U7Y0FBQSxPQUFBLEVBQWtCLENBQUM7WUFBbkI7VUFYRjtRQXJDRixDQURTO01BSlg7TUF3REY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFtQ00sU0FBUyxDQUFDOztRQUFoQixNQUFBLE1BQUEsQ0FBQTs7VUFHRSxXQUFhLENBQUMsQ0FBRSxJQUFGLEVBQVEsYUFBQSxHQUFnQixPQUF4QixFQUFpQyxRQUFBLEdBQVcsSUFBNUMsRUFBa0QsV0FBQSxHQUFjLElBQWhFLENBQUQsQ0FBQTtZQUNYLElBQUMsQ0FBQSxJQUFELEdBQTBCO1lBQzFCLElBQUMsQ0FBQSxXQUFELHlCQUEwQixjQUFjLFNBQVMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUM7O2NBQzdFLGdCQUEwQjs7WUFDMUIsSUFBQSxDQUFLLElBQUwsRUFBUSxVQUFSLEVBQTBCLENBQTFCO1lBQ0EsSUFBQSxDQUFLLElBQUwsRUFBUSxlQUFSO0FBQTBCLHNCQUFPLElBQVA7QUFBQSxxQkFDbkIsYUFBQSxLQUE0QixPQURUO3lCQUN5QixRQUFBLENBQUEsQ0FBQTtvQkFBRyxNQUFNLElBQUksS0FBSixDQUFVLGlCQUFWO2tCQUFUO0FBRHpCLHFCQUVuQixDQUFFLE9BQU8sYUFBVCxDQUFBLEtBQTRCLFVBRlQ7eUJBRXlCO0FBRnpCOztrQkFJbkIsTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLHVDQUFBLENBQUEsQ0FBMEMsYUFBMUMsQ0FBQSxDQUFWO0FBSmE7Z0JBQTFCO1lBS0EsSUFBQSxDQUFLLElBQUwsRUFBUSxVQUFSO0FBQTBCLHNCQUFPLElBQVA7QUFBQSxxQkFDbkIsQ0FBRSxPQUFPLFFBQVQsQ0FBQSxLQUF1QixVQURKO3lCQUNxQjtBQURyQixxQkFFYixnQkFGYTt5QkFFcUI7QUFGckI7O2tCQUluQixNQUFNLElBQUksS0FBSixDQUFVLENBQUEsa0NBQUEsQ0FBQSxDQUFxQyxRQUFyQyxDQUFBLENBQVY7QUFKYTtnQkFBMUI7QUFLQSxtQkFBTztVQWZJLENBRG5COzs7VUFtQk0sS0FBTyxDQUFBLENBQUE7WUFDTCxJQUFDLENBQUEsUUFBRDtZQUNBLElBQTJCLElBQUMsQ0FBQSxTQUE1QjtBQUFBLHFCQUFPLElBQUMsQ0FBQSxhQUFELENBQUEsRUFBUDs7QUFDQSxtQkFBTztVQUhGLENBbkJiOzs7VUF5Qk0sTUFBUSxDQUFFLFlBQUYsQ0FBQTtZQUVOLElBQWtELHFCQUFsRDs7Y0FBQSxJQUFDLENBQUEsUUFBRCxDQUFVO2dCQUFFLElBQUY7Z0JBQVEsS0FBQSxFQUFPLElBQWY7Z0JBQWtCLENBQUEsRUFBRztjQUFyQixDQUFWLEVBQUE7O0FBQ0EsbUJBQU87VUFIRDs7UUEzQlY7OztRQWlDRSxVQUFBLENBQVcsS0FBQyxDQUFBLFNBQVosRUFBZ0IsU0FBaEIsRUFBOEIsUUFBQSxDQUFBLENBQUE7aUJBQUcsSUFBQyxDQUFBO1FBQUosQ0FBOUI7O1FBQ0EsVUFBQSxDQUFXLEtBQUMsQ0FBQSxTQUFaLEVBQWdCLFdBQWhCLEVBQThCLFFBQUEsQ0FBQSxDQUFBO2lCQUFHLElBQUMsQ0FBQSxRQUFELElBQWEsSUFBQyxDQUFBO1FBQWpCLENBQTlCOzs7O29CQXhJTjs7TUEySVUsYUFBTixNQUFBLFdBQUEsQ0FBQTs7UUFHb0IsT0FBakIsZUFBaUIsQ0FBQSxDQUFBO2lCQUFHLENBQUUsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLENBQUEsSUFBSyxFQUF2QixDQUFBLEtBQWdDO1FBQW5DLENBRHhCOzs7UUFJTSxXQUFhLENBQUUsR0FBRixDQUFBO0FBQ25CLGNBQUE7VUFBUSxJQUFDLENBQUEsR0FBRCxHQUFjLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLGdCQUF0QixFQUEyQyxHQUFBLEdBQTNDOztnQkFDVixDQUFDLE9BQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxlQUFiLENBQUE7O1VBQ2QsSUFBQSxDQUFLLElBQUwsRUFBUSxRQUFSLEVBQWtCLFVBQUEsQ0FBVyxJQUFDLENBQUEsR0FBRyxDQUFDLElBQWhCLENBQWxCO0FBQ0EsaUJBQU87UUFKSSxDQUpuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQTZCTSxVQUFZLENBQUEsQ0FBQTtpQkFBRyxJQUFJLEtBQUosQ0FBQTtRQUFILENBN0JsQjs7O1FBZ0NNLG1CQUFxQixDQUFDLENBQUUsTUFBQSxHQUFTLENBQVgsRUFBYyxVQUFBLEdBQWEsSUFBM0IsRUFBaUMsVUFBQSxHQUFhLElBQTlDLElBQXNELENBQUEsQ0FBdkQsQ0FBQTtVQUNuQixJQUFHLGtCQUFIO0FBQ0UsbUJBQU87Y0FBRSxVQUFGO2NBQWMsVUFBQSx1QkFBYyxhQUFhLFVBQUEsR0FBYTtZQUF0RCxFQURUO1dBQUEsTUFFSyxJQUFHLGtCQUFIO0FBQ0gsbUJBQU87Y0FBRSxVQUFBLHVCQUFjLGFBQWEsQ0FBN0I7Y0FBa0M7WUFBbEMsRUFESjs7VUFFTCxJQUFzRCxjQUF0RDtBQUFBLG1CQUFPO2NBQUUsVUFBQSxFQUFZLE1BQWQ7Y0FBc0IsVUFBQSxFQUFZO1lBQWxDLEVBQVA7O1VBQ0EsTUFBTSxJQUFJLEtBQUosQ0FBVSxxRUFBVjtRQU5hLENBaEMzQjs7O1FBeUNNLGtCQUFvQixDQUFDLENBQUUsTUFBQSxHQUFTLENBQVgsRUFBYyxVQUFBLEdBQWEsSUFBM0IsRUFBaUMsVUFBQSxHQUFhLElBQTlDLElBQXNELENBQUEsQ0FBdkQsQ0FBQTtVQUNsQixDQUFBLENBQUUsVUFBRixFQUNFLFVBREYsQ0FBQSxHQUNrQixJQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBRSxNQUFGLEVBQVUsVUFBVixFQUFzQixVQUF0QixDQUFyQixDQURsQjtVQUVBLElBQXFCLFVBQUEsS0FBYyxVQUFXLDRDQUE5QztBQUFBLG1CQUFPLFdBQVA7O0FBQ0EsaUJBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBUztZQUFFLEdBQUEsRUFBSyxVQUFQO1lBQW1CLEdBQUEsRUFBSztVQUF4QixDQUFUO1FBSlcsQ0F6QzFCOzs7UUFnRE0sWUFBYyxDQUFDLENBQUUsR0FBQSxHQUFNLElBQVIsRUFBYyxHQUFBLEdBQU0sSUFBcEIsSUFBNEIsQ0FBQSxDQUE3QixDQUFBO1VBQ1osSUFBNEIsQ0FBRSxPQUFPLEdBQVQsQ0FBQSxLQUFrQixRQUE5QztZQUFBLEdBQUEsR0FBTyxHQUFHLENBQUMsV0FBSixDQUFnQixDQUFoQixFQUFQOztVQUNBLElBQTRCLENBQUUsT0FBTyxHQUFULENBQUEsS0FBa0IsUUFBOUM7WUFBQSxHQUFBLEdBQU8sR0FBRyxDQUFDLFdBQUosQ0FBZ0IsQ0FBaEIsRUFBUDs7O1lBQ0EsTUFBTyxJQUFDLENBQUEsR0FBRyxDQUFDLGlCQUFpQixDQUFFLENBQUY7OztZQUM3QixNQUFPLElBQUMsQ0FBQSxHQUFHLENBQUMsaUJBQWlCLENBQUUsQ0FBRjs7QUFDN0IsaUJBQU8sQ0FBRSxHQUFGLEVBQU8sR0FBUDtRQUxLLENBaERwQjs7O1FBd0RNLFdBQWEsQ0FBRSxNQUFGLENBQUE7VUFDWCxJQUEyQyxjQUEzQztBQUFBLG1CQUFPLENBQUUsUUFBQSxDQUFFLENBQUYsQ0FBQTtxQkFBUztZQUFULENBQUYsRUFBUDs7VUFDQSxJQUF1QyxDQUFFLE9BQU8sTUFBVCxDQUFBLEtBQXFCLFVBQTVEO0FBQUEsbUJBQVMsT0FBVDs7VUFDQSxJQUF1QyxNQUFBLFlBQWtCLE1BQXpEO0FBQUEsbUJBQU8sQ0FBRSxRQUFBLENBQUUsQ0FBRixDQUFBO3FCQUFTLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBWjtZQUFULENBQUYsRUFBUDtXQUZSOztVQUlRLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSw2Q0FBQSxDQUFBLENBQWdELFFBQWhELENBQUEsQ0FBVjtRQUxLLENBeERuQjs7Ozs7UUFtRU0sS0FBVSxDQUFDLENBQUUsR0FBQSxHQUFNLENBQVIsRUFBVyxHQUFBLEdBQU0sQ0FBakIsSUFBc0IsQ0FBQSxDQUF2QixDQUFBO2lCQUE4QixHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLEdBQVksQ0FBRSxHQUFBLEdBQU0sR0FBUjtRQUFoRDs7UUFDVixPQUFVLENBQUMsQ0FBRSxHQUFBLEdBQU0sQ0FBUixFQUFXLEdBQUEsR0FBTSxDQUFqQixJQUFzQixDQUFBLENBQXZCLENBQUE7aUJBQThCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFFLEdBQUYsRUFBTyxHQUFQLENBQVAsQ0FBWDtRQUE5Qjs7UUFDVixHQUFVLENBQUEsR0FBRSxDQUFGLENBQUE7aUJBQVksQ0FBRSxJQUFDLENBQUEsWUFBRCxDQUFjLEdBQUEsQ0FBZCxDQUFGLENBQUEsQ0FBQTtRQUFaOztRQUNWLElBQVUsQ0FBQSxHQUFFLENBQUYsQ0FBQTtpQkFBWSxDQUFFLElBQUMsQ0FBQSxhQUFELENBQWUsR0FBQSxDQUFmLENBQUYsQ0FBQSxDQUFBO1FBQVosQ0F0RWhCOzs7OztRQTRFTSxjQUFnQixDQUFFLEdBQUYsQ0FBQTtBQUN0QixjQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBO1VBQVEsQ0FBQSxDQUFFLEdBQUYsRUFDRSxHQURGLEVBRUUsTUFGRixDQUFBLEdBRWtCLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQXRCLEVBQXlDLEdBQUEsR0FBekMsQ0FGbEIsRUFBUjs7VUFJUSxDQUFBLENBQUUsR0FBRixFQUNFLEdBREYsQ0FBQSxHQUNrQixJQUFDLENBQUEsWUFBRCxDQUFjLENBQUUsR0FBRixFQUFPLEdBQVAsQ0FBZCxDQURsQjtVQUVBLE1BQUEsR0FBa0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBTjFCOztBQVFRLGlCQUFPLEtBQUEsR0FBUSxDQUFBLENBQUEsR0FBQTtBQUN2QixnQkFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBO1lBQVUsQ0FBQSxDQUFFLEtBQUYsRUFDRSxNQURGLENBQUEsR0FDa0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLE9BQW5CLENBRGxCO0FBR0EsbUJBQUEsSUFBQSxHQUFBOztjQUNFLEtBQUssQ0FBQyxPQUFOO2NBQWlCLElBQXFDLEtBQUssQ0FBQyxPQUFOLEdBQWdCLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBMUQ7Z0JBQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVixFQUFOOztjQUNqQixDQUFBLEdBQUksR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxHQUFZLENBQUUsR0FBQSxHQUFNLEdBQVI7Y0FDdEIsSUFBeUIsTUFBQSxDQUFPLENBQVAsQ0FBekI7QUFBQSx1QkFBUyxNQUFBLENBQU8sQ0FBUCxFQUFUOztZQUhGLENBSFY7O0FBUVUsbUJBQU87VUFUTTtRQVRELENBNUV0Qjs7O1FBaUdNLGdCQUFrQixDQUFFLEdBQUYsQ0FBQTtBQUN4QixjQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBO1VBQVEsQ0FBQSxDQUFFLEdBQUYsRUFDRSxHQURGLEVBRUUsTUFGRixDQUFBLEdBRWtCLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQXRCLEVBQXlDLEdBQUEsR0FBekMsQ0FGbEIsRUFBUjs7VUFJUSxDQUFBLENBQUUsR0FBRixFQUNFLEdBREYsQ0FBQSxHQUNrQixJQUFDLENBQUEsWUFBRCxDQUFjLENBQUUsR0FBRixFQUFPLEdBQVAsQ0FBZCxDQURsQjtVQUVBLE1BQUEsR0FBa0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBTjFCOztBQVFRLGlCQUFPLE9BQUEsR0FBVSxDQUFBLENBQUEsR0FBQTtBQUN6QixnQkFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBO1lBQVUsQ0FBQSxDQUFFLEtBQUYsRUFDRSxNQURGLENBQUEsR0FDa0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLFNBQW5CLENBRGxCO0FBR0EsbUJBQUEsSUFBQSxHQUFBOztjQUNFLEtBQUssQ0FBQyxPQUFOO2NBQWlCLElBQXFDLEtBQUssQ0FBQyxPQUFOLEdBQWdCLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBMUQ7Z0JBQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVixFQUFOOztjQUNqQixDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLEdBQVksQ0FBRSxHQUFBLEdBQU0sR0FBUixDQUE3QjtjQUNKLElBQXlCLE1BQUEsQ0FBTyxDQUFQLENBQXpCO0FBQUEsdUJBQVMsTUFBQSxDQUFPLENBQVAsRUFBVDs7WUFIRixDQUhWOztBQVFVLG1CQUFPO1VBVFE7UUFURCxDQWpHeEI7OztRQXNITSxZQUFjLENBQUUsR0FBRixDQUFBLEVBQUE7O0FBQ3BCLGNBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBO1VBQ1EsQ0FBQSxDQUFFLEdBQUYsRUFDRSxHQURGLEVBRUUsU0FGRixFQUdFLE1BSEYsQ0FBQSxHQUdrQixDQUFFLEdBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUF0QixFQUF1QyxHQUFBLEdBQXZDLENBSGxCLEVBRFI7O1VBTVEsQ0FBQSxDQUFFLEdBQUYsRUFDRSxHQURGLENBQUEsR0FDa0IsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFFLEdBQUYsRUFBTyxHQUFQLENBQWQsQ0FEbEIsRUFOUjs7VUFTUSxTQUFBLEdBQWtCLElBQUMsQ0FBQSxXQUFELENBQWEsU0FBYjtVQUNsQixNQUFBLEdBQWtCLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQVYxQjs7QUFZUSxpQkFBTyxHQUFBLEdBQU0sQ0FBQSxDQUFBLEdBQUE7QUFDckIsZ0JBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQTtZQUFVLENBQUEsQ0FBRSxLQUFGLEVBQ0UsTUFERixDQUFBLEdBQ2tCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFuQixDQURsQjtBQUdBLG1CQUFBLElBQUEsR0FBQTs7Y0FDRSxLQUFLLENBQUMsT0FBTjtjQUFpQixJQUFxQyxLQUFLLENBQUMsT0FBTixHQUFnQixJQUFDLENBQUEsR0FBRyxDQUFDLFdBQTFEO2dCQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsaUJBQVYsRUFBTjs7Y0FDakIsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxhQUFQLENBQXFCLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFULENBQXJCO2NBQ0osSUFBdUIsQ0FBRSxTQUFBLENBQVUsQ0FBVixDQUFGLENBQUEsSUFBb0IsQ0FBRSxNQUFBLENBQU8sQ0FBUCxDQUFGLENBQTNDO0FBQUEsdUJBQVMsTUFBQSxDQUFPLENBQVAsRUFBVDs7WUFIRixDQUhWOztBQVFVLG1CQUFPO1VBVEk7UUFiRCxDQXRIcEI7OztRQStJTSxhQUFlLENBQUUsR0FBRixDQUFBLEVBQUE7O0FBQ3JCLGNBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxlQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQTtVQUNRLENBQUEsQ0FBRSxHQUFGLEVBQ0UsR0FERixFQUVFLE1BRkYsRUFHRSxVQUhGLEVBSUUsVUFKRixFQUtFLE1BTEYsRUFNRSxhQU5GLENBQUEsR0FNb0IsQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBdEIsRUFBd0MsR0FBQSxHQUF4QyxDQU5wQixFQURSOztVQVNRLENBQUEsQ0FBRSxHQUFGLEVBQ0UsR0FERixDQUFBLEdBQ29CLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFkLENBRHBCLEVBVFI7O1VBWVEsQ0FBQSxDQUFFLFVBQUYsRUFDRSxVQURGLENBQUEsR0FDb0IsSUFBQyxDQUFBLG1CQUFELENBQXFCLENBQUUsTUFBRixFQUFVLFVBQVYsRUFBc0IsVUFBdEIsQ0FBckIsQ0FEcEI7VUFFQSxlQUFBLEdBQW9CLFVBQUEsS0FBYztVQUNsQyxNQUFBLEdBQW9CO1VBQ3BCLE1BQUEsR0FBb0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBaEI1Qjs7QUFrQlEsaUJBQU8sSUFBQSxHQUFPLENBQUEsQ0FBQSxHQUFBO0FBQ3RCLGdCQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBO1lBQVUsQ0FBQSxDQUFFLEtBQUYsRUFDRSxNQURGLENBQUEsR0FDa0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLE1BQW5CLENBRGxCO1lBR0EsS0FBK0QsZUFBL0Q7O2NBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFELENBQVM7Z0JBQUUsR0FBQSxFQUFLLFVBQVA7Z0JBQW1CLEdBQUEsRUFBSztjQUF4QixDQUFULEVBQVQ7O0FBQ0EsbUJBQUEsSUFBQTtjQUNFLEtBQUssQ0FBQyxPQUFOO2NBQWlCLElBQXFDLEtBQUssQ0FBQyxPQUFOLEdBQWdCLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBMUQ7Z0JBQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVixFQUFOOztjQUNqQixDQUFBLEdBQUk7O0FBQUU7Z0JBQUEsS0FBNEIsbUZBQTVCOytCQUFBLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFMO2dCQUFBLENBQUE7OzJCQUFGLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsRUFBckQ7Y0FDSixJQUF5QixNQUFBLENBQU8sQ0FBUCxDQUF6QjtBQUFBLHVCQUFTLE1BQUEsQ0FBTyxDQUFQLEVBQVQ7O1lBSEYsQ0FKVjs7QUFTVSxtQkFBTztVQVZLO1FBbkJELENBL0lyQjs7Ozs7UUFrTE0sV0FBYSxDQUFFLEdBQUYsQ0FBQTtBQUNuQixjQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQTtVQUFRLENBQUEsQ0FBRSxLQUFGLEVBQ0UsTUFERixDQUFBLEdBQ2tCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixhQUFuQixDQURsQjtVQUVBLENBQUEsQ0FBRSxHQUFGLEVBQ0UsR0FERixFQUVFLElBRkYsQ0FBQSxHQUVrQixDQUFFLEdBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxXQUF0QixFQUFzQyxHQUFBLEdBQXRDLENBRmxCO1VBR0EsQ0FBQSxHQUFrQixJQUFJLEdBQUosQ0FBQTtVQUNsQixHQUFBLEdBQWtCLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFkO0FBRWxCLGlCQUFBLElBQUEsR0FBQTs7WUFDRSxDQUFDLENBQUMsR0FBRixDQUFNLEdBQUEsQ0FBQSxDQUFOO1lBQ0EsSUFBUyxDQUFDLENBQUMsSUFBRixJQUFVLElBQW5CO0FBQUEsb0JBQUE7O1lBQ0EsSUFBdUIsQ0FBRSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFiLENBQUEsS0FBZ0MsS0FBdkQ7QUFBQSxxQkFBTyxTQUFQOztVQUhGO0FBSUEsaUJBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFiO1FBYkUsQ0FsTG5COzs7UUFrTU0sWUFBYyxDQUFFLEdBQUYsQ0FBQTtBQUNwQixjQUFBLENBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxlQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUE7VUFBUSxDQUFBLENBQUUsS0FBRixFQUNFLE1BREYsQ0FBQSxHQUNrQixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsY0FBbkIsQ0FEbEI7VUFFQSxDQUFBLENBQUUsR0FBRixFQUNFLEdBREYsRUFFRSxNQUZGLEVBR0UsSUFIRixFQUlFLFVBSkYsRUFLRSxVQUxGLEVBTUUsTUFORixDQUFBLEdBTWtCLENBQUUsR0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLFlBQXRCLEVBQXVDLEdBQUEsR0FBdkMsQ0FObEI7VUFPQSxDQUFBLENBQUUsVUFBRixFQUNFLFVBREYsQ0FBQSxHQUNrQixJQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBRSxNQUFGLEVBQVUsVUFBVixFQUFzQixVQUF0QixDQUFyQixDQURsQjtVQUVBLGVBQUEsR0FBa0IsVUFBQSxLQUFjO1VBQ2hDLE1BQUEsR0FBa0I7VUFDbEIsQ0FBQSxHQUFrQixJQUFJLEdBQUosQ0FBQTtVQUNsQixJQUFBLEdBQWtCLElBQUMsQ0FBQSxhQUFELENBQWUsQ0FBRSxHQUFGLEVBQU8sR0FBUCxFQUFZLE1BQVosRUFBb0IsVUFBcEIsRUFBZ0MsVUFBaEMsRUFBNEMsTUFBNUMsQ0FBZixFQWQxQjs7QUFnQlEsaUJBQU0sQ0FBQyxDQUFDLElBQUYsR0FBUyxJQUFmO1lBQ0UsS0FBSyxDQUFDLE9BQU47WUFBaUIsSUFBcUMsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUExRDtjQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsaUJBQVYsRUFBTjs7WUFDakIsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFBLENBQUEsQ0FBTjtVQUZGO0FBR0EsaUJBQVMsTUFBQSxDQUFPLENBQVA7UUFwQkcsQ0FsTXBCOzs7OztRQTROWSxFQUFOLElBQU0sQ0FBQyxDQUFFLFFBQUYsRUFBWSxDQUFBLEdBQUksQ0FBaEIsSUFBcUIsQ0FBQSxDQUF0QixDQUFBO0FBQ1osY0FBQTtVQUFRLEtBQUEsR0FBUTtBQUNSLGlCQUFBLElBQUE7WUFDRSxLQUFBO1lBQVMsSUFBUyxLQUFBLEdBQVEsQ0FBakI7QUFBQSxvQkFBQTs7WUFDVCxNQUFNLFFBQUEsQ0FBQTtVQUZSO0FBR0EsaUJBQU87UUFMSDs7TUE5TlIsRUEzSUo7O01BaVhJLFNBQUEsR0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQ7QUFDWixhQUFPLE9BQUEsR0FBVSxDQUFFLFVBQUYsRUFBYyxTQUFkO0lBblhHO0VBakZ0QixFQVZGOzs7RUFrZEEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsY0FBOUI7QUFsZEEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblVOU1RBQkxFX0JSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfbmV4dF9mcmVlX2ZpbGVuYW1lOiAtPlxuICAgIGNmZyA9XG4gICAgICBtYXhfcmV0cmllczogICAgOTk5OVxuICAgICAgcHJlZml4OiAgICAgICAgICd+LidcbiAgICAgIHN1ZmZpeDogICAgICAgICAnLmJyaWNhYnJhYy1jYWNoZSdcbiAgICBjYWNoZV9maWxlbmFtZV9yZSA9IC8vL1xuICAgICAgXlxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcucHJlZml4fSApXG4gICAgICAoPzxmaXJzdD4uKilcbiAgICAgIFxcLlxuICAgICAgKD88bnI+WzAtOV17NH0pXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAgICRcbiAgICAgIC8vL3ZcbiAgICAjIGNhY2hlX3N1ZmZpeF9yZSA9IC8vL1xuICAgICMgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAjICAgJFxuICAgICMgICAvLy92XG4gICAgcnByICAgICAgICAgICAgICAgPSAoIHggKSAtPlxuICAgICAgcmV0dXJuIFwiJyN7eC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIiBpZiAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZyd9J1wiXG4gICAgICByZXR1cm4gXCIje3h9XCJcbiAgICBlcnJvcnMgPVxuICAgICAgVE1QX2V4aGF1c3Rpb25fZXJyb3I6IGNsYXNzIFRNUF9leGhhdXN0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICAgIFRNUF92YWxpZGF0aW9uX2Vycm9yOiBjbGFzcyBUTVBfdmFsaWRhdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgRlMgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4gICAgUEFUSCAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGV4aXN0cyA9ICggcGF0aCApIC0+XG4gICAgICB0cnkgRlMuc3RhdFN5bmMgcGF0aCBjYXRjaCBlcnJvciB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHR5cGUgY2hlY2tpbmcgIyMjXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18xIGV4cGVjdGVkIGEgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzICggdHlwZW9mIHBhdGggKSBpcyAnc3RyaW5nJ1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMiBleHBlY3RlZCBhIG5vbmVtcHR5IHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyBwYXRoLmxlbmd0aCA+IDBcbiAgICAgIGRpcm5hbWUgID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgIGJhc2VuYW1lID0gUEFUSC5iYXNlbmFtZSBwYXRoXG4gICAgICB1bmxlc3MgKCBtYXRjaCA9IGJhc2VuYW1lLm1hdGNoIGNhY2hlX2ZpbGVuYW1lX3JlICk/XG4gICAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tiYXNlbmFtZX0uMDAwMSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICAgeyBmaXJzdCwgbnIsICB9ID0gbWF0Y2guZ3JvdXBzXG4gICAgICBuciAgICAgICAgICAgICAgPSBcIiN7KCBwYXJzZUludCBuciwgMTAgKSArIDF9XCIucGFkU3RhcnQgNCwgJzAnXG4gICAgICBwYXRoICAgICAgICAgICAgPSBmaXJzdFxuICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2ZpcnN0fS4je25yfSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZnJlZV9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICBSICAgICAgICAgICAgID0gcGF0aFxuICAgICAgZmFpbHVyZV9jb3VudCA9IC0xXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGxvb3BcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmYWlsdXJlX2NvdW50KytcbiAgICAgICAgaWYgZmFpbHVyZV9jb3VudCA+IGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF9leGhhdXN0aW9uX2Vycm9yIFwizqlfX18zIHRvbyBtYW55ICgje2ZhaWx1cmVfY291bnR9KSByZXRyaWVzOyAgcGF0aCAje3JwciBSfSBleGlzdHNcIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIFIgPSBnZXRfbmV4dF9maWxlbmFtZSBSXG4gICAgICAgIGJyZWFrIHVubGVzcyBleGlzdHMgUlxuICAgICAgcmV0dXJuIFJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgc3dhcF9zdWZmaXggPSAoIHBhdGgsIHN1ZmZpeCApIC0+IHBhdGgucmVwbGFjZSBjYWNoZV9zdWZmaXhfcmUsIHN1ZmZpeFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUsIGdldF9uZXh0X2ZpbGVuYW1lLCBleGlzdHMsIGNhY2hlX2ZpbGVuYW1lX3JlLCBlcnJvcnMsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9jb21tYW5kX2xpbmVfdG9vbHM6IC0+XG4gICAgQ1AgPSByZXF1aXJlICdub2RlOmNoaWxkX3Byb2Nlc3MnXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgPSAoIGNvbW1hbmQsIGlucHV0ICkgLT5cbiAgICAgIHJldHVybiAoIENQLmV4ZWNTeW5jIGNvbW1hbmQsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIGlucHV0LCB9ICkucmVwbGFjZSAvXFxuJC9zLCAnJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X3djX21heF9saW5lX2xlbmd0aCA9ICggdGV4dCApIC0+XG4gICAgICAjIyMgdGh4IHRvIGh0dHBzOi8vdW5peC5zdGFja2V4Y2hhbmdlLmNvbS9hLzI1ODU1MS8yODAyMDQgIyMjXG4gICAgICByZXR1cm4gcGFyc2VJbnQgKCBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCAnd2MgLS1tYXgtbGluZS1sZW5ndGgnLCB0ZXh0ICksIDEwXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCwgZ2V0X3djX21heF9saW5lX2xlbmd0aCwgfVxuXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfcmFuZG9tX3Rvb2xzOiAtPlxuICAgIHsgaGlkZSxcbiAgICAgIHNldF9nZXR0ZXIsICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICAjIyMgVEFJTlQgcmVwbGFjZSAjIyNcbiAgICAjIHsgZGVmYXVsdDogX2dldF91bmlxdWVfdGV4dCwgIH0gPSByZXF1aXJlICd1bmlxdWUtc3RyaW5nJ1xuICAgIGNocl9yZSAgICAgID0gLy8vXig/OlxccHtMfXxcXHB7WnN9fFxccHtafXxcXHB7TX18XFxwe059fFxccHtQfXxcXHB7U30pJC8vL3ZcbiAgICAjIG1heF9yZXRyaWVzID0gOV85OTlcbiAgICBtYXhfcmV0cmllcyA9IDFfMDAwXG4gICAgZ29fb24gICAgICAgPSBTeW1ib2wgJ2dvX29uJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGludGVybmFscyA9ICMgT2JqZWN0LmZyZWV6ZVxuICAgICAgY2hyX3JlOiAgICAgICAgICAgICBjaHJfcmVcbiAgICAgIG1heF9yZXRyaWVzOiAgICAgICAgbWF4X3JldHJpZXNcbiAgICAgIGdvX29uOiAgICAgICAgICAgICAgZ29fb25cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB0ZW1wbGF0ZXM6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcmFuZG9tX3Rvb2xzX2NmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICAgIHNlZWQ6ICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMV8wMDBcbiAgICAgICAgICBtYXhfcmV0cmllczogICAgICAgIG1heF9yZXRyaWVzXG4gICAgICAgICAgIyB1bmlxdWVfY291bnQ6ICAgMV8wMDBcbiAgICAgICAgICBvbl9zdGF0czogICAgICAgICAgIG51bGxcbiAgICAgICAgICB1bmljb2RlX2NpZF9yYW5nZTogIE9iamVjdC5mcmVlemUgWyAweDAwMDAsIDB4MTBmZmZmIF1cbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgY2hyX3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgcHJlZmlsdGVyOiAgICAgICAgICBjaHJfcmVcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgdGV4dF9wcm9kdWNlcjpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIGxlbmd0aDogICAgICAgICAgICAgMVxuICAgICAgICAgIG1pbl9sZW5ndGg6ICAgICAgICAgbnVsbFxuICAgICAgICAgIG1heF9sZW5ndGg6ICAgICAgICAgbnVsbFxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBzZXRfb2ZfY2hyczpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMlxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICB0ZXh0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgbGVuZ3RoOiAgICAgICAgICAgICAxXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgbWluX2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHN0YXRzOlxuICAgICAgICAgIGZsb2F0OlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBpbnRlZ2VyOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBjaHI6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBzZXRfb2ZfdGV4dHM6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGBgYFxuICAgIC8vIHRoeCB0byBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDc1OTMzMTYvNzU2ODA5MVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9zZWVkaW5nLXRoZS1yYW5kb20tbnVtYmVyLWdlbmVyYXRvci1pbi1qYXZhc2NyaXB0XG5cbiAgICAvLyBTcGxpdE1peDMyXG5cbiAgICAvLyBBIDMyLWJpdCBzdGF0ZSBQUk5HIHRoYXQgd2FzIG1hZGUgYnkgdGFraW5nIE11cm11ckhhc2gzJ3MgbWl4aW5nIGZ1bmN0aW9uLCBhZGRpbmcgYSBpbmNyZW1lbnRvciBhbmRcbiAgICAvLyB0d2Vha2luZyB0aGUgY29uc3RhbnRzLiBJdCdzIHBvdGVudGlhbGx5IG9uZSBvZiB0aGUgYmV0dGVyIDMyLWJpdCBQUk5HcyBzbyBmYXI7IGV2ZW4gdGhlIGF1dGhvciBvZlxuICAgIC8vIE11bGJlcnJ5MzIgY29uc2lkZXJzIGl0IHRvIGJlIHRoZSBiZXR0ZXIgY2hvaWNlLiBJdCdzIGFsc28ganVzdCBhcyBmYXN0LlxuXG4gICAgY29uc3Qgc3BsaXRtaXgzMiA9IGZ1bmN0aW9uICggYSApIHtcbiAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgIGEgfD0gMDtcbiAgICAgICBhID0gYSArIDB4OWUzNzc5YjkgfCAwO1xuICAgICAgIGxldCB0ID0gYSBeIGEgPj4+IDE2O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHgyMWYwYWFhZCk7XG4gICAgICAgdCA9IHQgXiB0ID4+PiAxNTtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4NzM1YTJkOTcpO1xuICAgICAgIHJldHVybiAoKHQgPSB0IF4gdCA+Pj4gMTUpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc3QgcHJuZyA9IHNwbGl0bWl4MzIoKE1hdGgucmFuZG9tKCkqMioqMzIpPj4+MClcbiAgICAvLyBmb3IobGV0IGk9MDsgaTwxMDsgaSsrKSBjb25zb2xlLmxvZyhwcm5nKCkpO1xuICAgIC8vXG4gICAgLy8gSSB3b3VsZCByZWNvbW1lbmQgdGhpcyBpZiB5b3UganVzdCBuZWVkIGEgc2ltcGxlIGJ1dCBnb29kIFBSTkcgYW5kIGRvbid0IG5lZWQgYmlsbGlvbnMgb2YgcmFuZG9tXG4gICAgLy8gbnVtYmVycyAoc2VlIEJpcnRoZGF5IHByb2JsZW0pLlxuICAgIC8vXG4gICAgLy8gTm90ZTogSXQgZG9lcyBoYXZlIG9uZSBwb3RlbnRpYWwgY29uY2VybjogaXQgZG9lcyBub3QgcmVwZWF0IHByZXZpb3VzIG51bWJlcnMgdW50aWwgeW91IGV4aGF1c3QgNC4zXG4gICAgLy8gYmlsbGlvbiBudW1iZXJzIGFuZCBpdCByZXBlYXRzIGFnYWluLiBXaGljaCBtYXkgb3IgbWF5IG5vdCBiZSBhIHN0YXRpc3RpY2FsIGNvbmNlcm4gZm9yIHlvdXIgdXNlXG4gICAgLy8gY2FzZS4gSXQncyBsaWtlIGEgbGlzdCBvZiByYW5kb20gbnVtYmVycyB3aXRoIHRoZSBkdXBsaWNhdGVzIHJlbW92ZWQsIGJ1dCB3aXRob3V0IGFueSBleHRyYSB3b3JrXG4gICAgLy8gaW52b2x2ZWQgdG8gcmVtb3ZlIHRoZW0uIEFsbCBvdGhlciBnZW5lcmF0b3JzIGluIHRoaXMgbGlzdCBkbyBub3QgZXhoaWJpdCB0aGlzIGJlaGF2aW9yLlxuICAgIGBgYFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIGludGVybmFscy5TdGF0c1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICh7IG5hbWUsIG9uX2V4aGF1c3Rpb24gPSAnZXJyb3InLCBvbl9zdGF0cyA9IG51bGwsIG1heF9yZXRyaWVzID0gbnVsbCB9KSAtPlxuICAgICAgICBAbmFtZSAgICAgICAgICAgICAgICAgICA9IG5hbWVcbiAgICAgICAgQG1heF9yZXRyaWVzICAgICAgICAgICAgPSBtYXhfcmV0cmllcyA/IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy5tYXhfcmV0cmllc1xuICAgICAgICBvbl9leGhhdXN0aW9uICAgICAgICAgID89ICdlcnJvcidcbiAgICAgICAgaGlkZSBALCAnX3JldHJpZXMnLCAgICAgICAwXG4gICAgICAgIGhpZGUgQCwgJ29uX2V4aGF1c3Rpb24nLCAgc3dpdGNoIHRydWVcbiAgICAgICAgICB3aGVuIG9uX2V4aGF1c3Rpb24gICAgICAgICAgICBpcyAnZXJyb3InICAgIHRoZW4gLT4gdGhyb3cgbmV3IEVycm9yIFwizqlfX180IGV4aGF1c3RlZFwiXG4gICAgICAgICAgd2hlbiAoIHR5cGVvZiBvbl9leGhhdXN0aW9uICkgaXMgJ2Z1bmN0aW9uJyB0aGVuIG9uX2V4aGF1c3Rpb25cbiAgICAgICAgICAjIyMgVEFJTlQgdXNlIHJwciwgdHlwaW5nICMjI1xuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IGlsbGVnYWwgdmFsdWUgZm9yIG9uX2V4aGF1c3Rpb246ICN7b25fZXhoYXVzdGlvbn1cIlxuICAgICAgICBoaWRlIEAsICdvbl9zdGF0cycsICAgICAgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiAoIHR5cGVvZiBvbl9zdGF0cyApIGlzICdmdW5jdGlvbicgIHRoZW4gb25fc3RhdHNcbiAgICAgICAgICB3aGVuICggbm90IG9uX3N0YXRzPyApICAgICAgICAgICAgICAgICAgdGhlbiBudWxsXG4gICAgICAgICAgIyMjIFRBSU5UIHVzZSBycHIsIHR5cGluZyAjIyNcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNiBpbGxlZ2FsIHZhbHVlIGZvciBvbl9zdGF0czogI3tvbl9zdGF0c31cIlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByZXRyeTogLT5cbiAgICAgICAgQF9yZXRyaWVzKytcbiAgICAgICAgcmV0dXJuIEBvbl9leGhhdXN0aW9uKCkgaWYgQGV4aGF1c3RlZFxuICAgICAgICByZXR1cm4gZ29fb25cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZpbmlzaDogKCByZXR1cm5fdmFsdWUgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgZG9uJ3QgdXNlIGBzdGF0c2AgcHJvcCwgdXNlIGByZXRyaWVzYCAjIyNcbiAgICAgICAgQG9uX3N0YXRzIHsgbmFtZSwgc3RhdHM6IEAsIFI6IHJldHVybl92YWx1ZSwgfSBpZiBAb25fc3RhdHM/XG4gICAgICAgIHJldHVybiBSXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3JldHJpZXMnLCAgICAtPiBAX3JldHJpZXNcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnZXhoYXVzdGVkJywgIC0+IEBfcmV0cmllcyA+PSBAbWF4X3JldHJpZXNcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBHZXRfcmFuZG9tXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZ2V0X3JhbmRvbV9zZWVkOiAtPiAoIE1hdGgucmFuZG9tKCkgKiAyICoqIDMyICkgPj4+IDBcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAY2ZnLnNlZWQgID89IEBjb25zdHJ1Y3Rvci5nZXRfcmFuZG9tX3NlZWQoKVxuICAgICAgICBoaWRlIEAsICdfZmxvYXQnLCBzcGxpdG1peDMyIEBjZmcuc2VlZFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgICAgIyAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyAjIFNUQVRTXG4gICAgICAjICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIF9jcmVhdGVfc3RhdHNfZm9yOiAoIG5hbWUsIG9uX2V4aGF1c3Rpb24gPSAnZXJyb3InICkgLT5cbiAgICAgICMgICBzdGF0cyA9IG5ldyBTdGF0cyB7IG5hbWUsIG9uX2V4aGF1c3Rpb24sIH1cbiAgICAgICMgICB1bmxlc3MgKCB0ZW1wbGF0ZSA9IGludGVybmFscy50ZW1wbGF0ZXMuc3RhdHNbIG5hbWUgXSApP1xuICAgICAgIyAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX183IHVua25vd24gc3RhdHMgbmFtZSAje25hbWV9XCIgIyMjIFRBSU5UIHVzZSBycHIoKSAjIyNcbiAgICAgICMgICBzdGF0cyA9IHsgdGVtcGxhdGUuLi4sIH1cbiAgICAgICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMgICBpZiBAY2ZnLm9uX3N0YXRzPyB0aGVuICBmaW5pc2ggPSAoIFIgKSA9PiBAY2ZnLm9uX3N0YXRzIHsgbmFtZSwgc3RhdHMsIFIsIH07IFJcbiAgICAgICMgICBlbHNlICAgICAgICAgICAgICAgICAgICBmaW5pc2ggPSAoIFIgKSA9PiBSXG4gICAgICAjICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAjICAgcmV0dXJuIHsgc3RhdHMsIGZpbmlzaCwgfVxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIElOVEVSTkFMU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9uZXdfc3RhdHM6IC0+IG5ldyBTdGF0cygpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X21pbl9tYXhfbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIGlmIG1pbl9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aCwgbWF4X2xlbmd0aDogKCBtYXhfbGVuZ3RoID8gbWluX2xlbmd0aCAqIDIgKSwgfVxuICAgICAgICBlbHNlIGlmIG1heF9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogKCBtaW5fbGVuZ3RoID8gMSApLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6IGxlbmd0aCwgbWF4X2xlbmd0aDogbGVuZ3RoLCB9IGlmIGxlbmd0aD9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX184IG11c3Qgc2V0IGF0IGxlYXN0IG9uZSBvZiBgbGVuZ3RoYCwgYG1pbl9sZW5ndGhgLCBgbWF4X2xlbmd0aGBcIlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9yYW5kb21fbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIG1pbl9sZW5ndGggaWYgbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoICMjIyBOT1RFIGRvbmUgdG8gYXZvaWQgY2hhbmdpbmcgUFJORyBzdGF0ZSAjIyNcbiAgICAgICAgcmV0dXJuIEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heDogKHsgbWluID0gbnVsbCwgbWF4ID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgbWluICA9IG1pbi5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1pbiApIGlzICdzdHJpbmcnXG4gICAgICAgIG1heCAgPSBtYXguY29kZVBvaW50QXQgMCBpZiAoIHR5cGVvZiBtYXggKSBpcyAnc3RyaW5nJ1xuICAgICAgICBtaW4gPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMCBdXG4gICAgICAgIG1heCA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAxIF1cbiAgICAgICAgcmV0dXJuIHsgbWluLCBtYXgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfZmlsdGVyOiAoIGZpbHRlciApIC0+XG4gICAgICAgIHJldHVybiAoICggeCApIC0+IHRydWUgICAgICAgICAgICApIHVubGVzcyBmaWx0ZXI/XG4gICAgICAgIHJldHVybiAoIGZpbHRlciAgICAgICAgICAgICAgICAgICApIGlmICggdHlwZW9mIGZpbHRlciApIGlzICdmdW5jdGlvbidcbiAgICAgICAgcmV0dXJuICggKCB4ICkgLT4gZmlsdGVyLnRlc3QgeCAgICkgaWYgZmlsdGVyIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgICAgICMjIyBUQUlOVCB1c2UgYHJwcmAsIHR5cGluZyAjIyNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX185IHVuYWJsZSB0byB0dXJuIGFyZ3VtZW50IGludG8gYSBmaWx0ZXI6ICN7YXJndW1lbnR9XCJcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBDT05WRU5JRU5DRVxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZsb2F0OiAgICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICBpbnRlZ2VyOiAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gTWF0aC5yb3VuZCBAZmxvYXQgeyBtaW4sIG1heCwgfVxuICAgICAgY2hyOiAgICAgICggUC4uLiApIC0+ICggQGNocl9wcm9kdWNlciBQLi4uICkoKVxuICAgICAgdGV4dDogICAgICggUC4uLiApIC0+ICggQHRleHRfcHJvZHVjZXIgUC4uLiApKClcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBQUk9EVUNFUlNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmbG9hdF9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgZmlsdGVyLCAgICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgIGZpbHRlciAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBmbG9hdCA9ID0+XG4gICAgICAgICAgeyBzdGF0cyxcbiAgICAgICAgICAgIGZpbmlzaCwgICAgIH0gPSBAX2NyZWF0ZV9zdGF0c19mb3IgJ2Zsb2F0J1xuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIHN0YXRzLnJldHJpZXMrKzsgdGhyb3cgbmV3IEVycm9yIFwizqlfXzEwIGV4aGF1c3RlZFwiIGlmIHN0YXRzLnJldHJpZXMgPiBAY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgICBSID0gbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgICAgICAgcmV0dXJuICggZmluaXNoIFIgKSBpZiAoIGZpbHRlciBSIClcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgaW50ZWdlcl9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgZmlsdGVyLCAgICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgIGZpbHRlciAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBpbnRlZ2VyID0gPT5cbiAgICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnaW50ZWdlcidcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBzdGF0cy5yZXRyaWVzKys7IHRocm93IG5ldyBFcnJvciBcIs6pX18xMSBleGhhdXN0ZWRcIiBpZiBzdGF0cy5yZXRyaWVzID4gQGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICAgUiA9IE1hdGgucm91bmQgbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgICAgICAgcmV0dXJuICggZmluaXNoIFIgKSBpZiAoIGZpbHRlciBSIClcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY2hyX3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgICMjIyBUQUlOVCBjb25zaWRlciB0byBjYWNoZSByZXN1bHQgIyMjXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBwcmVmaWx0ZXIsXG4gICAgICAgICAgZmlsdGVyLCAgICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5jaHJfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcHJlZmlsdGVyICAgICAgID0gQF9nZXRfZmlsdGVyIHByZWZpbHRlclxuICAgICAgICBmaWx0ZXIgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gY2hyID0gPT5cbiAgICAgICAgICB7IHN0YXRzLFxuICAgICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnY2hyJ1xuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIHN0YXRzLnJldHJpZXMrKzsgdGhyb3cgbmV3IEVycm9yIFwizqlfXzEyIGV4aGF1c3RlZFwiIGlmIHN0YXRzLnJldHJpZXMgPiBAY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgICBSID0gU3RyaW5nLmZyb21Db2RlUG9pbnQgQGludGVnZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAgICAgcmV0dXJuICggZmluaXNoIFIgKSBpZiAoIHByZWZpbHRlciBSICkgYW5kICggZmlsdGVyIFIgKVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB0ZXh0X3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgICMjIyBUQUlOVCBjb25zaWRlciB0byBjYWNoZSByZXN1bHQgIyMjXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9leGhhdXN0aW9uIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMudGV4dF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCAgIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICBsZW5ndGhfaXNfY29uc3QgICA9IG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aFxuICAgICAgICBsZW5ndGggICAgICAgICAgICA9IG1pbl9sZW5ndGhcbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gdGV4dCA9ID0+XG4gICAgICAgICAgeyBzdGF0cyxcbiAgICAgICAgICAgIGZpbmlzaCwgICAgIH0gPSBAX2NyZWF0ZV9zdGF0c19mb3IgJ3RleHQnXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbGVuZ3RoID0gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfSB1bmxlc3MgbGVuZ3RoX2lzX2NvbnN0XG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgc3RhdHMucmV0cmllcysrOyB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fMTMgZXhoYXVzdGVkXCIgaWYgc3RhdHMucmV0cmllcyA+IEBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICAgIFIgPSAoIEBjaHIgeyBtaW4sIG1heCwgfSBmb3IgXyBpbiBbIDEgLi4gbGVuZ3RoIF0gKS5qb2luICcnXG4gICAgICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgU0VUU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl9jaHJzOiAoIGNmZyApIC0+XG4gICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnc2V0X29mX2NocnMnXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBzaXplLCAgICAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnNldF9vZl9jaHJzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgUiAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgIGNociAgICAgICAgICAgICA9IEBjaHJfcHJvZHVjZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbG9vcFxuICAgICAgICAgIFIuYWRkIGNocigpXG4gICAgICAgICAgYnJlYWsgaWYgUi5zaXplID49IHNpemVcbiAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX3RleHRzOiAoIGNmZyApIC0+XG4gICAgICAgIHsgc3RhdHMsXG4gICAgICAgICAgZmluaXNoLCAgICAgfSA9IEBfY3JlYXRlX3N0YXRzX2ZvciAnc2V0X29mX3RleHRzJ1xuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgIHNpemUsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlciwgICAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX3RleHRzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICBsZW5ndGhfaXNfY29uc3QgPSBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGhcbiAgICAgICAgbGVuZ3RoICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBSICAgICAgICAgICAgICAgPSBuZXcgU2V0KClcbiAgICAgICAgdGV4dCAgICAgICAgICAgID0gQHRleHRfcHJvZHVjZXIgeyBtaW4sIG1heCwgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCBmaWx0ZXIsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHdoaWxlIFIuc2l6ZSA8IHNpemVcbiAgICAgICAgICBzdGF0cy5yZXRyaWVzKys7IHRocm93IG5ldyBFcnJvciBcIs6pX18xNCBleGhhdXN0ZWRcIiBpZiBzdGF0cy5yZXRyaWVzID4gQGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgIFIuYWRkIHRleHQoKVxuICAgICAgICByZXR1cm4gKCBmaW5pc2ggUiApXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgV0FMS0VSU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHdhbGs6ICh7IHByb2R1Y2VyLCBuID0gMSwgfT17fSkgLT5cbiAgICAgICAgY291bnQgPSAwXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBjb3VudCsrOyBicmVhayBpZiBjb3VudCA+IG5cbiAgICAgICAgICB5aWVsZCBwcm9kdWNlcigpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSBpbnRlcm5hbHNcbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgR2V0X3JhbmRvbSwgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBVTlNUQUJMRV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-brics.coffee