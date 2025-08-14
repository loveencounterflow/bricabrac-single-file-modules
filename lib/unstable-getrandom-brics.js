(function() {
  'use strict';
  var UNSTABLE_GETRANDOM_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_GETRANDOM_BRICS = {
    
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
        * walk(cfg) {
          var count, n, on_exhaustion, on_stats, producer, sentinel, stats;
          ({producer, n, on_stats, on_exhaustion, max_retries} = {...internals.templates.walk, ...cfg});
          count = 0;
          stats = this._new_stats({
            name: 'walk',
            on_stats,
            on_exhaustion,
            max_retries
          });
          while (true) {
            count++;
            if (count > n) {
              break;
            }
            yield producer();
            if ((sentinel = stats.retry()) !== go_on) {
              return sentinel;
            }
          }
          return stats.finish(null);
        }

        //-------------------------------------------------------------------------------------------------------
        * walk_unique(cfg) {
          var Y, n, old_size, on_exhaustion, on_stats, producer, seen, sentinel, stats, window;
          ({producer, seen, window, n, on_stats, on_exhaustion, max_retries} = {...internals.templates.walk, ...cfg});
          if (seen == null) {
            seen = new Set();
          }
          stats = this._new_stats({
            name: 'walk_unique',
            on_stats,
            on_exhaustion,
            max_retries
          });
          old_size = seen.size;
          while (true) {
            seen.add(Y = text());
            if (seen.size > old_size) {
              yield Y;
            }
            old_size = seen.size;
            if (seen.size >= n) {
              break;
            }
            if ((sentinel = stats.retry()) === go_on) {
              /* TAINT implement 'stop'ping the loop */
              continue;
            }
            if (on_exhaustion !== 'stop') {
              yield sentinel;
            }
          }
          return stats.finish(null);
        }

      };
      //=========================================================================================================
      internals = Object.freeze(internals);
      return exports = {Get_random, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_GETRANDOM_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWdldHJhbmRvbS1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7Ozs7O0VBS0Esd0JBQUEsR0FLRSxDQUFBOzs7O0lBQUEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBO01BQUksQ0FBQSxDQUFFLElBQUYsRUFDRSxVQURGLENBQUEsR0FDa0MsQ0FBRSxPQUFBLENBQVEsaUJBQVIsQ0FBRixDQUE2QixDQUFDLDhCQUE5QixDQUFBLENBRGxDLEVBQUo7OztNQUlJLE1BQUEsR0FBYyxvREFKbEI7O01BTUksV0FBQSxHQUFjO01BQ2QsS0FBQSxHQUFjLE1BQUEsQ0FBTyxPQUFQO01BQ2QsS0FBQSxHQUFjLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFBUSxZQUFBLENBQUEsRUFBQTtlQUFDLE1BQU0sQ0FBQyxXQUFQOztBQUFxQjtVQUFBLEtBQUEsTUFBQTs7Z0JBQTZCOzJCQUE3QixDQUFFLENBQUYsRUFBSyxDQUFMOztVQUFBLENBQUE7O1lBQXJCO01BQVQsRUFSbEI7O01BV0ksU0FBQSxHQUNFLENBQUE7UUFBQSxNQUFBLEVBQW9CLE1BQXBCO1FBQ0EsV0FBQSxFQUFvQixXQURwQjtRQUVBLEtBQUEsRUFBb0IsS0FGcEI7UUFHQSxLQUFBLEVBQW9CLEtBSHBCOztRQUtBLFNBQUEsRUFBVyxNQUFNLENBQUMsTUFBUCxDQUNUO1VBQUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLE1BQVAsQ0FDaEI7WUFBQSxJQUFBLEVBQW9CLElBQXBCO1lBQ0EsV0FBQSxFQUFvQixXQURwQjs7WUFHQSxRQUFBLEVBQW9CLElBSHBCO1lBSUEsaUJBQUEsRUFBb0IsTUFBTSxDQUFD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QUFFLFFBQUYsRUFDRSxJQURGLEVBRUUsTUFGRixFQUdFLENBSEYsRUFJRSxRQUpGLEVBS0UsYUFMRixFQU1FLFdBTkYsQ0FBQSxHQU1vQixDQUFFLEdBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUF0QixFQUErQixHQUFBLEdBQS9CLENBTnBCOztZQU9BLE9BQW9CLElBQUksR0FBSixDQUFBOztVQUNwQixLQUFBLEdBQW9CLElBQUMsQ0FBQSxVQUFELENBQVk7WUFBRSxJQUFBLEVBQU0sYUFBUjtZQUF1QixRQUF2QjtZQUFpQyxhQUFqQztZQUFnRDtVQUFoRCxDQUFaO1VBQ3BCLFFBQUEsR0FBb0IsSUFBSSxDQUFDO0FBQ3pCLGlCQUFBLElBQUE7WUFDRSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSyxJQUFBLENBQUEsQ0FBZDtZQUNBLElBQVcsSUFBSSxDQUFDLElBQUwsR0FBWSxRQUF2QjtjQUFBLE1BQU0sRUFBTjs7WUFDQSxRQUFBLEdBQWMsSUFBSSxDQUFDO1lBQ25CLElBQVMsSUFBSSxDQUFDLElBQUwsSUFBYSxDQUF0QjtBQUFBLG9CQUFBOztZQUVBLElBQVksQ0FBRSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFiLENBQUEsS0FBZ0MsS0FBNUM7O0FBQUEsdUJBQUE7O1lBQ0EsSUFBc0IsYUFBQSxLQUFpQixNQUF2QztjQUFBLE1BQU0sU0FBTjs7VUFQRjtBQVFBLGlCQUFTLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBYjtRQW5CRTs7TUEzT2YsRUFoSko7O01Ba1pJLFNBQUEsR0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQ7QUFDWixhQUFPLE9BQUEsR0FBVSxDQUFFLFVBQUYsRUFBYyxTQUFkO0lBcFpHO0VBQXRCLEVBVkY7OztFQWthQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4Qix3QkFBOUI7QUFsYUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblVOU1RBQkxFX0dFVFJBTkRPTV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3JhbmRvbV90b29sczogLT5cbiAgICB7IGhpZGUsXG4gICAgICBzZXRfZ2V0dGVyLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyMjIFRBSU5UIHJlcGxhY2UgIyMjXG4gICAgIyB7IGRlZmF1bHQ6IF9nZXRfdW5pcXVlX3RleHQsICB9ID0gcmVxdWlyZSAndW5pcXVlLXN0cmluZydcbiAgICBjaHJfcmUgICAgICA9IC8vL14oPzpcXHB7TH18XFxwe1pzfXxcXHB7Wn18XFxwe019fFxccHtOfXxcXHB7UH18XFxwe1N9KSQvLy92XG4gICAgIyBtYXhfcmV0cmllcyA9IDlfOTk5XG4gICAgbWF4X3JldHJpZXMgPSAxXzAwMFxuICAgIGdvX29uICAgICAgID0gU3ltYm9sICdnb19vbidcbiAgICBjbGVhbiAgICAgICA9ICggeCApIC0+IE9iamVjdC5mcm9tRW50cmllcyAoIFsgaywgdiwgXSBmb3IgaywgdiBvZiB4IHdoZW4gdj8gKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGludGVybmFscyA9ICMgT2JqZWN0LmZyZWV6ZVxuICAgICAgY2hyX3JlOiAgICAgICAgICAgICBjaHJfcmVcbiAgICAgIG1heF9yZXRyaWVzOiAgICAgICAgbWF4X3JldHJpZXNcbiAgICAgIGdvX29uOiAgICAgICAgICAgICAgZ29fb25cbiAgICAgIGNsZWFuOiAgICAgICAgICAgICAgY2xlYW5cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB0ZW1wbGF0ZXM6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcmFuZG9tX3Rvb2xzX2NmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICAgIHNlZWQ6ICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG1heF9yZXRyaWVzOiAgICAgICAgbWF4X3JldHJpZXNcbiAgICAgICAgICAjIHVuaXF1ZV9jb3VudDogICAxXzAwMFxuICAgICAgICAgIG9uX3N0YXRzOiAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHVuaWNvZGVfY2lkX3JhbmdlOiAgT2JqZWN0LmZyZWV6ZSBbIDB4MDAwMCwgMHgxMGZmZmYgXVxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBjaHJfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBwcmVmaWx0ZXI6ICAgICAgICAgIGNocl9yZVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICB0ZXh0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgbGVuZ3RoOiAgICAgICAgICAgICAxXG4gICAgICAgICAgbWluX2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHRleHRfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBsZW5ndGg6ICAgICAgICAgICAgIDFcbiAgICAgICAgICBzaXplOiAgICAgICAgICAgICAgIDJcbiAgICAgICAgICBtaW5fbGVuZ3RoOiAgICAgICAgIG51bGxcbiAgICAgICAgICBtYXhfbGVuZ3RoOiAgICAgICAgIG51bGxcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgc3RhdHM6XG4gICAgICAgICAgZmxvYXQ6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIGludGVnZXI6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIGNocjpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG4gICAgICAgICAgdGV4dDpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG4gICAgICAgICAgc2V0X29mX2NocnM6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl90ZXh0czpcbiAgICAgICAgICAgIHJldHJpZXM6ICAgICAgICAgIC0xXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYGBgXG4gICAgLy8gdGh4IHRvIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NzU5MzMxNi83NTY4MDkxXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTIxMjk1L3NlZWRpbmctdGhlLXJhbmRvbS1udW1iZXItZ2VuZXJhdG9yLWluLWphdmFzY3JpcHRcblxuICAgIC8vIFNwbGl0TWl4MzJcblxuICAgIC8vIEEgMzItYml0IHN0YXRlIFBSTkcgdGhhdCB3YXMgbWFkZSBieSB0YWtpbmcgTXVybXVySGFzaDMncyBtaXhpbmcgZnVuY3Rpb24sIGFkZGluZyBhIGluY3JlbWVudG9yIGFuZFxuICAgIC8vIHR3ZWFraW5nIHRoZSBjb25zdGFudHMuIEl0J3MgcG90ZW50aWFsbHkgb25lIG9mIHRoZSBiZXR0ZXIgMzItYml0IFBSTkdzIHNvIGZhcjsgZXZlbiB0aGUgYXV0aG9yIG9mXG4gICAgLy8gTXVsYmVycnkzMiBjb25zaWRlcnMgaXQgdG8gYmUgdGhlIGJldHRlciBjaG9pY2UuIEl0J3MgYWxzbyBqdXN0IGFzIGZhc3QuXG5cbiAgICBjb25zdCBzcGxpdG1peDMyID0gZnVuY3Rpb24gKCBhICkge1xuICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgYSB8PSAwO1xuICAgICAgIGEgPSBhICsgMHg5ZTM3NzliOSB8IDA7XG4gICAgICAgbGV0IHQgPSBhIF4gYSA+Pj4gMTY7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDIxZjBhYWFkKTtcbiAgICAgICB0ID0gdCBeIHQgPj4+IDE1O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHg3MzVhMmQ5Nyk7XG4gICAgICAgcmV0dXJuICgodCA9IHQgXiB0ID4+PiAxNSkgPj4+IDApIC8gNDI5NDk2NzI5NjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zdCBwcm5nID0gc3BsaXRtaXgzMigoTWF0aC5yYW5kb20oKSoyKiozMik+Pj4wKVxuICAgIC8vIGZvcihsZXQgaT0wOyBpPDEwOyBpKyspIGNvbnNvbGUubG9nKHBybmcoKSk7XG4gICAgLy9cbiAgICAvLyBJIHdvdWxkIHJlY29tbWVuZCB0aGlzIGlmIHlvdSBqdXN0IG5lZWQgYSBzaW1wbGUgYnV0IGdvb2QgUFJORyBhbmQgZG9uJ3QgbmVlZCBiaWxsaW9ucyBvZiByYW5kb21cbiAgICAvLyBudW1iZXJzIChzZWUgQmlydGhkYXkgcHJvYmxlbSkuXG4gICAgLy9cbiAgICAvLyBOb3RlOiBJdCBkb2VzIGhhdmUgb25lIHBvdGVudGlhbCBjb25jZXJuOiBpdCBkb2VzIG5vdCByZXBlYXQgcHJldmlvdXMgbnVtYmVycyB1bnRpbCB5b3UgZXhoYXVzdCA0LjNcbiAgICAvLyBiaWxsaW9uIG51bWJlcnMgYW5kIGl0IHJlcGVhdHMgYWdhaW4uIFdoaWNoIG1heSBvciBtYXkgbm90IGJlIGEgc3RhdGlzdGljYWwgY29uY2VybiBmb3IgeW91ciB1c2VcbiAgICAvLyBjYXNlLiBJdCdzIGxpa2UgYSBsaXN0IG9mIHJhbmRvbSBudW1iZXJzIHdpdGggdGhlIGR1cGxpY2F0ZXMgcmVtb3ZlZCwgYnV0IHdpdGhvdXQgYW55IGV4dHJhIHdvcmtcbiAgICAvLyBpbnZvbHZlZCB0byByZW1vdmUgdGhlbS4gQWxsIG90aGVyIGdlbmVyYXRvcnMgaW4gdGhpcyBsaXN0IGRvIG5vdCBleGhpYml0IHRoaXMgYmVoYXZpb3IuXG4gICAgYGBgXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgaW50ZXJuYWxzLlN0YXRzXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKHsgbmFtZSwgb25fZXhoYXVzdGlvbiA9ICdlcnJvcicsIG9uX3N0YXRzID0gbnVsbCwgbWF4X3JldHJpZXMgPSBudWxsIH0pIC0+XG4gICAgICAgIEBuYW1lICAgICAgICAgICAgICAgICAgID0gbmFtZVxuICAgICAgICBAbWF4X3JldHJpZXMgICAgICAgICAgICA9IG1heF9yZXRyaWVzID8gaW50ZXJuYWxzLnRlbXBsYXRlcy5yYW5kb21fdG9vbHNfY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgIG9uX2V4aGF1c3Rpb24gICAgICAgICAgPz0gJ2Vycm9yJ1xuICAgICAgICBoaWRlIEAsICdfZmluaXNoZWQnLCAgICAgIGZhbHNlXG4gICAgICAgIGhpZGUgQCwgJ19yZXRyaWVzJywgICAgICAgMFxuICAgICAgICBoaWRlIEAsICdvbl9leGhhdXN0aW9uJywgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiBvbl9leGhhdXN0aW9uICAgICAgICAgICAgaXMgJ2Vycm9yJyAgICB0aGVuIC0+IHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBleGhhdXN0ZWRcIlxuICAgICAgICAgIHdoZW4gKCB0eXBlb2Ygb25fZXhoYXVzdGlvbiApIGlzICdmdW5jdGlvbicgdGhlbiBvbl9leGhhdXN0aW9uXG4gICAgICAgICAgIyMjIFRBSU5UIHVzZSBycHIsIHR5cGluZyAjIyNcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNSBpbGxlZ2FsIHZhbHVlIGZvciBvbl9leGhhdXN0aW9uOiAje29uX2V4aGF1c3Rpb259XCJcbiAgICAgICAgaGlkZSBALCAnb25fc3RhdHMnLCAgICAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gKCB0eXBlb2Ygb25fc3RhdHMgKSBpcyAnZnVuY3Rpb24nICB0aGVuIG9uX3N0YXRzXG4gICAgICAgICAgd2hlbiAoIG5vdCBvbl9zdGF0cz8gKSAgICAgICAgICAgICAgICAgIHRoZW4gbnVsbFxuICAgICAgICAgICMjIyBUQUlOVCB1c2UgcnByLCB0eXBpbmcgIyMjXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzYgaWxsZWdhbCB2YWx1ZSBmb3Igb25fc3RhdHM6ICN7b25fc3RhdHN9XCJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcmV0cnk6IC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNyBzdGF0cyBoYXMgYWxyZWFkeSBmaW5pc2hlZFwiIGlmIEBfZmluaXNoZWRcbiAgICAgICAgQF9yZXRyaWVzKytcbiAgICAgICAgcmV0dXJuIEBvbl9leGhhdXN0aW9uKCkgaWYgQGV4aGF1c3RlZFxuICAgICAgICByZXR1cm4gZ29fb25cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZpbmlzaDogKCBSICkgLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX184IHN0YXRzIGhhcyBhbHJlYWR5IGZpbmlzaGVkXCIgaWYgQF9maW5pc2hlZFxuICAgICAgICBAX2ZpbmlzaGVkID0gdHJ1ZVxuICAgICAgICBAb25fc3RhdHMgeyBuYW1lOiBAbmFtZSwgcmV0cmllczogQHJldHJpZXMsIFIsIH0gaWYgQG9uX3N0YXRzP1xuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdmaW5pc2hlZCcsICAgLT4gQF9maW5pc2hlZFxuICAgICAgc2V0X2dldHRlciBAOjosICdyZXRyaWVzJywgICAgLT4gQF9yZXRyaWVzXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2V4aGF1c3RlZCcsICAtPiBAX3JldHJpZXMgPiBAbWF4X3JldHJpZXNcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBHZXRfcmFuZG9tXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZ2V0X3JhbmRvbV9zZWVkOiAtPiAoIE1hdGgucmFuZG9tKCkgKiAyICoqIDMyICkgPj4+IDBcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAY2ZnLnNlZWQgID89IEBjb25zdHJ1Y3Rvci5nZXRfcmFuZG9tX3NlZWQoKVxuICAgICAgICBoaWRlIEAsICdfZmxvYXQnLCBzcGxpdG1peDMyIEBjZmcuc2VlZFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgSU5URVJOQUxTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX25ld19zdGF0czogKCBjZmcgKSAtPlxuICAgICAgICByZXR1cm4gbmV3IGludGVybmFscy5TdGF0cyB7IGludGVybmFscy50ZW1wbGF0ZXMuX25ld19zdGF0cy4uLiwgKCBjbGVhbiBAY2ZnICkuLi4sIGNmZy4uLiwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4X2xlbmd0aDogKHsgbGVuZ3RoID0gMSwgbWluX2xlbmd0aCA9IG51bGwsIG1heF9sZW5ndGggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBpZiBtaW5fbGVuZ3RoP1xuICAgICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGgsIG1heF9sZW5ndGg6ICggbWF4X2xlbmd0aCA/IG1pbl9sZW5ndGggKiAyICksIH1cbiAgICAgICAgZWxzZSBpZiBtYXhfbGVuZ3RoP1xuICAgICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6ICggbWluX2xlbmd0aCA/IDEgKSwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoOiBsZW5ndGgsIG1heF9sZW5ndGg6IGxlbmd0aCwgfSBpZiBsZW5ndGg/XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX18xMiBtdXN0IHNldCBhdCBsZWFzdCBvbmUgb2YgYGxlbmd0aGAsIGBtaW5fbGVuZ3RoYCwgYG1heF9sZW5ndGhgXCJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfcmFuZG9tX2xlbmd0aDogKHsgbGVuZ3RoID0gMSwgbWluX2xlbmd0aCA9IG51bGwsIG1heF9sZW5ndGggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiBtaW5fbGVuZ3RoIGlmIG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aCAjIyMgTk9URSBkb25lIHRvIGF2b2lkIGNoYW5naW5nIFBSTkcgc3RhdGUgIyMjXG4gICAgICAgIHJldHVybiBAaW50ZWdlciB7IG1pbjogbWluX2xlbmd0aCwgbWF4OiBtYXhfbGVuZ3RoLCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X21pbl9tYXg6ICh7IG1pbiA9IG51bGwsIG1heCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIG1pbiAgPSBtaW4uY29kZVBvaW50QXQgMCBpZiAoIHR5cGVvZiBtaW4gKSBpcyAnc3RyaW5nJ1xuICAgICAgICBtYXggID0gbWF4LmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWF4ICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWluID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDAgXVxuICAgICAgICBtYXggPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMSBdXG4gICAgICAgIHJldHVybiB7IG1pbiwgbWF4LCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X2ZpbHRlcjogKCBmaWx0ZXIgKSAtPlxuICAgICAgICByZXR1cm4gKCAoIHggKSAtPiB0cnVlICAgICAgICAgICAgKSB1bmxlc3MgZmlsdGVyP1xuICAgICAgICByZXR1cm4gKCBmaWx0ZXIgICAgICAgICAgICAgICAgICAgKSBpZiAoIHR5cGVvZiBmaWx0ZXIgKSBpcyAnZnVuY3Rpb24nXG4gICAgICAgIHJldHVybiAoICggeCApIC0+IGZpbHRlci50ZXN0IHggICApIGlmIGZpbHRlciBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgICAjIyMgVEFJTlQgdXNlIGBycHJgLCB0eXBpbmcgIyMjXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX18xMyB1bmFibGUgdG8gdHVybiBhcmd1bWVudCBpbnRvIGEgZmlsdGVyOiAje2FyZ3VtZW50fVwiXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgQ09OVkVOSUVOQ0VcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmbG9hdDogICAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgaW50ZWdlcjogICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IE1hdGgucm91bmQgQGZsb2F0IHsgbWluLCBtYXgsIH1cbiAgICAgIGNocjogICAgICAoIFAuLi4gKSAtPiAoIEBjaHJfcHJvZHVjZXIgUC4uLiApKClcbiAgICAgIHRleHQ6ICAgICAoIFAuLi4gKSAtPiAoIEB0ZXh0X3Byb2R1Y2VyIFAuLi4gKSgpXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgUFJPRFVDRVJTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXRfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzLCAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gZmxvYXQgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnZmxvYXQnLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGludGVnZXJfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzLCAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gaW50ZWdlciA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdpbnRlZ2VyJywgKCBjbGVhbiB7IG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcmV0cmllcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBNYXRoLnJvdW5kIG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNocl9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgY29uc2lkZXIgdG8gY2FjaGUgcmVzdWx0ICMjI1xuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgcHJlZmlsdGVyLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzLCAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5jaHJfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwcmVmaWx0ZXIgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBwcmVmaWx0ZXJcbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gY2hyID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ2NocicsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JldHJpZXMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gU3RyaW5nLmZyb21Db2RlUG9pbnQgQGludGVnZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIHByZWZpbHRlciBSICkgYW5kICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB0ZXh0X3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgICMjIyBUQUlOVCBjb25zaWRlciB0byBjYWNoZSByZXN1bHQgIyMjXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy50ZXh0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiB0ZXh0ID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3RleHQnLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbGVuZ3RoID0gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfSB1bmxlc3MgbGVuZ3RoX2lzX2NvbnN0XG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9ICggQGNociB7IG1pbiwgbWF4LCB9IGZvciBfIGluIFsgMSAuLiBsZW5ndGggXSApLmpvaW4gJydcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBTRVRTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX2NocnM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIHNpemUsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcywgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX2NocnMuLi4sIGNmZy4uLiwgfVxuICAgICAgICBzdGF0cyAgICAgICAgICAgICA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3NldF9vZl9jaHJzJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9XG4gICAgICAgIFIgICAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgIGNociAgICAgICAgICAgICAgID0gQGNocl9wcm9kdWNlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsb29wXG4gICAgICAgICAgUi5hZGQgY2hyKClcbiAgICAgICAgICBicmVhayBpZiBSLnNpemUgPj0gc2l6ZVxuICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfb2ZfdGV4dHM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcywgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX3RleHRzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICB0ZXh0ICAgICAgICAgICAgICA9IEB0ZXh0X3Byb2R1Y2VyIHsgbWluLCBtYXgsIGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgZmlsdGVyLCB9XG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnc2V0X29mX3RleHRzJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsb29wXG4gICAgICAgICAgUi5hZGQgdGV4dCgpXG4gICAgICAgICAgYnJlYWsgaWYgUi5zaXplID49IHNpemVcbiAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKVxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFdBTEtFUlNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3YWxrOiAoIGNmZyApIC0+XG4gICAgICAgIHsgcHJvZHVjZXIsXG4gICAgICAgICAgbixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yZXRyaWVzICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy53YWxrLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgY291bnQgICAgICAgICAgICAgPSAwXG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnd2FsaycsIG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcmV0cmllcywgfVxuICAgICAgICBsb29wXG4gICAgICAgICAgY291bnQrKzsgYnJlYWsgaWYgY291bnQgPiBuXG4gICAgICAgICAgeWllbGQgcHJvZHVjZXIoKVxuICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3YWxrX3VuaXF1ZTogKCBjZmcgKSAtPlxuICAgICAgICB7IHByb2R1Y2VyLFxuICAgICAgICAgIHNlZW4sXG4gICAgICAgICAgd2luZG93LFxuICAgICAgICAgIG4sXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcyAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMud2Fsay4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIHNlZW4gICAgICAgICAgICAgPz0gbmV3IFNldCgpXG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnd2Fsa191bmlxdWUnLCBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JldHJpZXMsIH1cbiAgICAgICAgb2xkX3NpemUgICAgICAgICAgPSBzZWVuLnNpemVcbiAgICAgICAgbG9vcFxuICAgICAgICAgIHNlZW4uYWRkIFkgID0gdGV4dCgpXG4gICAgICAgICAgeWllbGQgWSBpZiBzZWVuLnNpemUgPiBvbGRfc2l6ZVxuICAgICAgICAgIG9sZF9zaXplICAgID0gc2Vlbi5zaXplXG4gICAgICAgICAgYnJlYWsgaWYgc2Vlbi5zaXplID49IG5cbiAgICAgICAgICAjIyMgVEFJTlQgaW1wbGVtZW50ICdzdG9wJ3BpbmcgdGhlIGxvb3AgIyMjXG4gICAgICAgICAgY29udGludWUgaWYgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgIHlpZWxkIHNlbnRpbmVsIHVubGVzcyBvbl9leGhhdXN0aW9uIGlzICdzdG9wJ1xuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0dFVFJBTkRPTV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-getrandom-brics.coffee