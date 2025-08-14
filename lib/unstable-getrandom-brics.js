(function() {
  'use strict';
  var UNSTABLE_GETRANDOM_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_GETRANDOM_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_random_tools: function() {
      var Get_random, chr_re, clean, dont_go_on, exports, go_on, hide, internals, max_rounds, set_getter;
      ({hide, set_getter} = (require('./various-brics')).require_managed_property_tools());
      /* TAINT replace */
      // { default: _get_unique_text,  } = require 'unique-string'
      chr_re = /^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$/v;
      // max_rounds = 9_999
      max_rounds = 1_000;
      go_on = Symbol('go_on');
      dont_go_on = Symbol('dont_go_on');
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
        max_rounds: max_rounds,
        go_on: go_on,
        clean: clean,
        //.......................................................................................................
        templates: Object.freeze({
          random_tools_cfg: Object.freeze({
            seed: null,
            max_rounds: max_rounds,
            // unique_count:   1_000
            on_stats: null,
            unicode_cid_range: Object.freeze([0x0000, 0x10ffff]),
            on_exhaustion: 'error'
          }),
          int_producer: {
            min: 0,
            max: 1,
            filter: null,
            on_exhaustion: 'error'
          },
          float_producer: {
            min: 0,
            max: 1,
            filter: null,
            on_exhaustion: 'error'
          },
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
            size: 2,
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
          stats: {
            float: {
              rounds: -1
            },
            integer: {
              rounds: -1
            },
            chr: {
              rounds: -1
            },
            text: {
              rounds: -1
            },
            set_of_chrs: {
              rounds: -1
            },
            set_of_texts: {
              rounds: -1
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
          constructor({name, on_exhaustion = 'error', on_stats = null, max_rounds = null}) {
            this.name = name;
            this.max_rounds = max_rounds != null ? max_rounds : internals.templates.random_tools_cfg.max_rounds;
            if (on_exhaustion == null) {
              on_exhaustion = 'error';
            }
            hide(this, '_finished', false);
            hide(this, '_rounds', 0);
            hide(this, 'on_exhaustion', (function() {
              switch (true) {
                case on_exhaustion === 'error':
                  return function() {
                    throw new Error("Ω___4 exhausted");
                  };
                case on_exhaustion === 'stop':
                  return function() {
                    return dont_go_on;
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
            this._rounds++;
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
                rounds: this.rounds,
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

        set_getter(Stats.prototype, 'rounds', function() {
          return this._rounds;
        });

        set_getter(Stats.prototype, 'exhausted', function() {
          return this._rounds > this.max_rounds;
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
        // float:    ({ min = 0, max = 1, }={}) -> min + @_float() * ( max - min )
        // integer:  ({ min = 0, max = 1, }={}) -> Math.round @float { min, max, }
        float(...P) {
          return (this.float_producer(...P))();
        }

        integer(...P) {
          return (this.integer_producer(...P))();
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
          ({min, max, filter, on_stats, on_exhaustion, max_rounds} = {...internals.templates.float_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          filter = this._get_filter(filter);
          //.....................................................................................................
          return float = () => {
            var R, sentinel, stats;
            stats = this._new_stats({
              name: 'float',
              ...(clean({on_stats, on_exhaustion, max_rounds}))
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
          ({min, max, filter, on_stats, on_exhaustion, max_rounds} = {...internals.templates.float_producer, ...cfg});
          //.....................................................................................................
          ({min, max} = this._get_min_max({min, max}));
          filter = this._get_filter(filter);
          //.....................................................................................................
          return integer = () => {
            var R, sentinel, stats;
            stats = this._new_stats({
              name: 'integer',
              ...(clean({on_stats, on_exhaustion, max_rounds}))
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
          ({min, max, prefilter, filter, on_stats, on_exhaustion, max_rounds} = {...internals.templates.chr_producer, ...cfg});
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
              ...(clean({on_stats, on_exhaustion, max_rounds}))
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
          ({min, max, length, min_length, max_length, filter, on_stats, on_exhaustion, max_rounds} = {...internals.templates.text_producer, ...cfg});
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
              ...(clean({on_stats, on_exhaustion, max_rounds}))
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
          ({min, max, size, on_stats, on_exhaustion, max_rounds} = {...internals.templates.set_of_chrs, ...cfg});
          stats = this._new_stats({
            name: 'set_of_chrs',
            on_stats,
            on_exhaustion,
            max_rounds
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
          ({min, max, length, size, min_length, max_length, filter, on_stats, on_exhaustion, max_rounds} = {...internals.templates.set_of_texts, ...cfg});
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          length_is_const = min_length === max_length;
          length = min_length;
          R = new Set();
          text = this.text_producer({min, max, length, min_length, max_length, filter});
          stats = this._new_stats({
            name: 'set_of_texts',
            on_stats,
            on_exhaustion,
            max_rounds
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
          var count, n, on_exhaustion, on_stats, producer, stats;
          ({producer, n, on_stats, on_exhaustion, max_rounds} = {...internals.templates.walk, ...cfg});
          count = 0;
          stats = this._new_stats({
            name: 'walk',
            on_stats,
            on_exhaustion,
            max_rounds
          });
          while (true) {
            count++;
            if (count > n) {
              break;
            }
            yield producer();
          }
          /* NODE any filtering &c happens in producer so no extraneous rounds are ever made by `walk()`,
                   therefore the `rounds` in the `walk` stats object always remains `0` */
          // return sentinel unless ( sentinel = stats.retry() ) is go_on
          return stats.finish(null);
        }

        //-------------------------------------------------------------------------------------------------------
        * walk_unique(cfg) {
          var Y, n, old_size, on_exhaustion, on_stats, producer, seen, sentinel, stats;
          // window,
          ({producer, seen, n, on_stats, on_exhaustion, max_rounds} = {...internals.templates.walk, ...cfg});
          if (seen == null) {
            seen = new Set();
          }
          stats = this._new_stats({
            name: 'walk_unique',
            on_stats,
            on_exhaustion,
            max_rounds
          });
          old_size = seen.size;
          while (true) {
            seen.add(Y = producer());
            if (seen.size > old_size) {
              yield Y;
              old_size = seen.size;
              if (seen.size >= n) {
                break;
              }
              continue;
            }
            if ((sentinel = stats.retry()) === go_on) {
              /* TAINT implement 'stop'ping the loop */
              continue;
            }
            if (sentinel === dont_go_on) {
              break;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWdldHJhbmRvbS1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7Ozs7O0VBS0Esd0JBQUEsR0FLRSxDQUFBOzs7O0lBQUEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxVQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQTtNQUFJLENBQUEsQ0FBRSxJQUFGLEVBQ0UsVUFERixDQUFBLEdBQ2tDLENBQUUsT0FBQSxDQUFRLGlCQUFSLENBQUYsQ0FBNkIsQ0FBQyw4QkFBOUIsQ0FBQSxDQURsQyxFQUFKOzs7TUFJSSxNQUFBLEdBQWMsb0RBSmxCOztNQU1JLFVBQUEsR0FBYztNQUNkLEtBQUEsR0FBYyxNQUFBLENBQU8sT0FBUDtNQUNkLFVBQUEsR0FBYyxNQUFBLENBQU8sWUFBUDtNQUNkLEtBQUEsR0FBYyxRQUFBLENBQUUsQ0FBRixDQUFBO0FBQVEsWUFBQSxDQUFBLEVBQUE7ZUFBQyxNQUFNLENBQUMsV0FBUDs7QUFBcUI7VUFBQSxLQUFBLE1BQUE7O2dCQUE2QjsyQkFBN0IsQ0FBRSxDQUFGLEVBQUssQ0FBTDs7VUFBQSxDQUFBOztZQUFyQjtNQUFULEVBVGxCOztNQVlJLFNBQUEsR0FDRSxDQUFBO1FBQUEsTUFBQSxFQUFvQixNQUFwQjtRQUNBLFVBQUEsRUFBb0IsVUFEcEI7UUFFQSxLQUFBLEVBQW9CLEtBRnBCO1FBR0EsS0FBQSxFQUFvQixLQUhwQjs7UUFLQSxTQUFBLEVBQVcsTUFBTSxDQUFDLE1BQVAsQ0FDVDtVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxNQUFQLENBQ2hCO1lBQUEsSUFBQSxFQUFvQixJQUFwQjtZQUNBLFVBQUEsRUFBb0IsVUFEcEI7O1lBR0EsUUFB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R0FNb0IsQ0FBRSxHQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBdEIsRUFBK0IsR0FBQSxHQUEvQixDQU5wQjs7WUFPQSxPQUFvQixJQUFJLEdBQUosQ0FBQTs7VUFDcEIsS0FBQSxHQUFvQixJQUFDLENBQUEsVUFBRCxDQUFZO1lBQUUsSUFBQSxFQUFNLGFBQVI7WUFBdUIsUUFBdkI7WUFBaUMsYUFBakM7WUFBZ0Q7VUFBaEQsQ0FBWjtVQUNwQixRQUFBLEdBQW9CLElBQUksQ0FBQztBQUN6QixpQkFBQSxJQUFBO1lBQ0UsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUssUUFBQSxDQUFBLENBQWQ7WUFDQSxJQUFHLElBQUksQ0FBQyxJQUFMLEdBQVksUUFBZjtjQUNFLE1BQU07Y0FDTixRQUFBLEdBQWMsSUFBSSxDQUFDO2NBQ25CLElBQVMsSUFBSSxDQUFDLElBQUwsSUFBYSxDQUF0QjtBQUFBLHNCQUFBOztBQUNBLHVCQUpGOztZQU1BLElBQVksQ0FBRSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFiLENBQUEsS0FBZ0MsS0FBNUM7O0FBQUEsdUJBQUE7O1lBQ0EsSUFBUyxRQUFBLEtBQVksVUFBckI7QUFBQSxvQkFBQTs7VUFURjtBQVVBLGlCQUFTLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBYjtRQXJCRTs7TUEvT2YsRUFwSko7O01BNFpJLFNBQUEsR0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQ7QUFDWixhQUFPLE9BQUEsR0FBVSxDQUFFLFVBQUYsRUFBYyxTQUFkO0lBOVpHO0VBQXRCLEVBVkY7OztFQTRhQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4Qix3QkFBOUI7QUE1YUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblVOU1RBQkxFX0dFVFJBTkRPTV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3JhbmRvbV90b29sczogLT5cbiAgICB7IGhpZGUsXG4gICAgICBzZXRfZ2V0dGVyLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyMjIFRBSU5UIHJlcGxhY2UgIyMjXG4gICAgIyB7IGRlZmF1bHQ6IF9nZXRfdW5pcXVlX3RleHQsICB9ID0gcmVxdWlyZSAndW5pcXVlLXN0cmluZydcbiAgICBjaHJfcmUgICAgICA9IC8vL14oPzpcXHB7TH18XFxwe1pzfXxcXHB7Wn18XFxwe019fFxccHtOfXxcXHB7UH18XFxwe1N9KSQvLy92XG4gICAgIyBtYXhfcm91bmRzID0gOV85OTlcbiAgICBtYXhfcm91bmRzICA9IDFfMDAwXG4gICAgZ29fb24gICAgICAgPSBTeW1ib2wgJ2dvX29uJ1xuICAgIGRvbnRfZ29fb24gID0gU3ltYm9sICdkb250X2dvX29uJ1xuICAgIGNsZWFuICAgICAgID0gKCB4ICkgLT4gT2JqZWN0LmZyb21FbnRyaWVzICggWyBrLCB2LCBdIGZvciBrLCB2IG9mIHggd2hlbiB2PyApXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0gIyBPYmplY3QuZnJlZXplXG4gICAgICBjaHJfcmU6ICAgICAgICAgICAgIGNocl9yZVxuICAgICAgbWF4X3JvdW5kczogICAgICAgICBtYXhfcm91bmRzXG4gICAgICBnb19vbjogICAgICAgICAgICAgIGdvX29uXG4gICAgICBjbGVhbjogICAgICAgICAgICAgIGNsZWFuXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgdGVtcGxhdGVzOiBPYmplY3QuZnJlZXplXG4gICAgICAgIHJhbmRvbV90b29sc19jZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgICBzZWVkOiAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBtYXhfcm91bmRzOiAgICAgICAgIG1heF9yb3VuZHNcbiAgICAgICAgICAjIHVuaXF1ZV9jb3VudDogICAxXzAwMFxuICAgICAgICAgIG9uX3N0YXRzOiAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHVuaWNvZGVfY2lkX3JhbmdlOiAgT2JqZWN0LmZyZWV6ZSBbIDB4MDAwMCwgMHgxMGZmZmYgXVxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBpbnRfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIGZsb2F0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBjaHJfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBwcmVmaWx0ZXI6ICAgICAgICAgIGNocl9yZVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICB0ZXh0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgbGVuZ3RoOiAgICAgICAgICAgICAxXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgbWluX2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHN0YXRzOlxuICAgICAgICAgIGZsb2F0OlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIGludGVnZXI6XG4gICAgICAgICAgICByb3VuZHM6ICAgICAgICAgIC0xXG4gICAgICAgICAgY2hyOlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICByb3VuZHM6ICAgICAgICAgIC0xXG4gICAgICAgICAgc2V0X29mX2NocnM6XG4gICAgICAgICAgICByb3VuZHM6ICAgICAgICAgIC0xXG4gICAgICAgICAgc2V0X29mX3RleHRzOlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGBgYFxuICAgIC8vIHRoeCB0byBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDc1OTMzMTYvNzU2ODA5MVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9zZWVkaW5nLXRoZS1yYW5kb20tbnVtYmVyLWdlbmVyYXRvci1pbi1qYXZhc2NyaXB0XG5cbiAgICAvLyBTcGxpdE1peDMyXG5cbiAgICAvLyBBIDMyLWJpdCBzdGF0ZSBQUk5HIHRoYXQgd2FzIG1hZGUgYnkgdGFraW5nIE11cm11ckhhc2gzJ3MgbWl4aW5nIGZ1bmN0aW9uLCBhZGRpbmcgYSBpbmNyZW1lbnRvciBhbmRcbiAgICAvLyB0d2Vha2luZyB0aGUgY29uc3RhbnRzLiBJdCdzIHBvdGVudGlhbGx5IG9uZSBvZiB0aGUgYmV0dGVyIDMyLWJpdCBQUk5HcyBzbyBmYXI7IGV2ZW4gdGhlIGF1dGhvciBvZlxuICAgIC8vIE11bGJlcnJ5MzIgY29uc2lkZXJzIGl0IHRvIGJlIHRoZSBiZXR0ZXIgY2hvaWNlLiBJdCdzIGFsc28ganVzdCBhcyBmYXN0LlxuXG4gICAgY29uc3Qgc3BsaXRtaXgzMiA9IGZ1bmN0aW9uICggYSApIHtcbiAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgIGEgfD0gMDtcbiAgICAgICBhID0gYSArIDB4OWUzNzc5YjkgfCAwO1xuICAgICAgIGxldCB0ID0gYSBeIGEgPj4+IDE2O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHgyMWYwYWFhZCk7XG4gICAgICAgdCA9IHQgXiB0ID4+PiAxNTtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4NzM1YTJkOTcpO1xuICAgICAgIHJldHVybiAoKHQgPSB0IF4gdCA+Pj4gMTUpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc3QgcHJuZyA9IHNwbGl0bWl4MzIoKE1hdGgucmFuZG9tKCkqMioqMzIpPj4+MClcbiAgICAvLyBmb3IobGV0IGk9MDsgaTwxMDsgaSsrKSBjb25zb2xlLmxvZyhwcm5nKCkpO1xuICAgIC8vXG4gICAgLy8gSSB3b3VsZCByZWNvbW1lbmQgdGhpcyBpZiB5b3UganVzdCBuZWVkIGEgc2ltcGxlIGJ1dCBnb29kIFBSTkcgYW5kIGRvbid0IG5lZWQgYmlsbGlvbnMgb2YgcmFuZG9tXG4gICAgLy8gbnVtYmVycyAoc2VlIEJpcnRoZGF5IHByb2JsZW0pLlxuICAgIC8vXG4gICAgLy8gTm90ZTogSXQgZG9lcyBoYXZlIG9uZSBwb3RlbnRpYWwgY29uY2VybjogaXQgZG9lcyBub3QgcmVwZWF0IHByZXZpb3VzIG51bWJlcnMgdW50aWwgeW91IGV4aGF1c3QgNC4zXG4gICAgLy8gYmlsbGlvbiBudW1iZXJzIGFuZCBpdCByZXBlYXRzIGFnYWluLiBXaGljaCBtYXkgb3IgbWF5IG5vdCBiZSBhIHN0YXRpc3RpY2FsIGNvbmNlcm4gZm9yIHlvdXIgdXNlXG4gICAgLy8gY2FzZS4gSXQncyBsaWtlIGEgbGlzdCBvZiByYW5kb20gbnVtYmVycyB3aXRoIHRoZSBkdXBsaWNhdGVzIHJlbW92ZWQsIGJ1dCB3aXRob3V0IGFueSBleHRyYSB3b3JrXG4gICAgLy8gaW52b2x2ZWQgdG8gcmVtb3ZlIHRoZW0uIEFsbCBvdGhlciBnZW5lcmF0b3JzIGluIHRoaXMgbGlzdCBkbyBub3QgZXhoaWJpdCB0aGlzIGJlaGF2aW9yLlxuICAgIGBgYFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIGludGVybmFscy5TdGF0c1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICh7IG5hbWUsIG9uX2V4aGF1c3Rpb24gPSAnZXJyb3InLCBvbl9zdGF0cyA9IG51bGwsIG1heF9yb3VuZHMgPSBudWxsIH0pIC0+XG4gICAgICAgIEBuYW1lICAgICAgICAgICAgICAgICAgID0gbmFtZVxuICAgICAgICBAbWF4X3JvdW5kcyAgICAgICAgICAgID0gbWF4X3JvdW5kcyA/IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy5tYXhfcm91bmRzXG4gICAgICAgIG9uX2V4aGF1c3Rpb24gICAgICAgICAgPz0gJ2Vycm9yJ1xuICAgICAgICBoaWRlIEAsICdfZmluaXNoZWQnLCAgICAgIGZhbHNlXG4gICAgICAgIGhpZGUgQCwgJ19yb3VuZHMnLCAgICAgICAgMFxuICAgICAgICBoaWRlIEAsICdvbl9leGhhdXN0aW9uJywgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiBvbl9leGhhdXN0aW9uICAgICAgICAgICAgaXMgJ2Vycm9yJyAgICB0aGVuIC0+IHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBleGhhdXN0ZWRcIlxuICAgICAgICAgIHdoZW4gb25fZXhoYXVzdGlvbiAgICAgICAgICAgIGlzICdzdG9wJyAgICAgdGhlbiAtPiBkb250X2dvX29uXG4gICAgICAgICAgd2hlbiAoIHR5cGVvZiBvbl9leGhhdXN0aW9uICkgaXMgJ2Z1bmN0aW9uJyB0aGVuIG9uX2V4aGF1c3Rpb25cbiAgICAgICAgICAjIyMgVEFJTlQgdXNlIHJwciwgdHlwaW5nICMjI1xuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IGlsbGVnYWwgdmFsdWUgZm9yIG9uX2V4aGF1c3Rpb246ICN7b25fZXhoYXVzdGlvbn1cIlxuICAgICAgICBoaWRlIEAsICdvbl9zdGF0cycsICAgICAgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiAoIHR5cGVvZiBvbl9zdGF0cyApIGlzICdmdW5jdGlvbicgIHRoZW4gb25fc3RhdHNcbiAgICAgICAgICB3aGVuICggbm90IG9uX3N0YXRzPyApICAgICAgICAgICAgICAgICAgdGhlbiBudWxsXG4gICAgICAgICAgIyMjIFRBSU5UIHVzZSBycHIsIHR5cGluZyAjIyNcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNiBpbGxlZ2FsIHZhbHVlIGZvciBvbl9zdGF0czogI3tvbl9zdGF0c31cIlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByZXRyeTogLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX183IHN0YXRzIGhhcyBhbHJlYWR5IGZpbmlzaGVkXCIgaWYgQF9maW5pc2hlZFxuICAgICAgICBAX3JvdW5kcysrXG4gICAgICAgIHJldHVybiBAb25fZXhoYXVzdGlvbigpIGlmIEBleGhhdXN0ZWRcbiAgICAgICAgcmV0dXJuIGdvX29uXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmaW5pc2g6ICggUiApIC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fOCBzdGF0cyBoYXMgYWxyZWFkeSBmaW5pc2hlZFwiIGlmIEBfZmluaXNoZWRcbiAgICAgICAgQF9maW5pc2hlZCA9IHRydWVcbiAgICAgICAgQG9uX3N0YXRzIHsgbmFtZTogQG5hbWUsIHJvdW5kczogQHJvdW5kcywgUiwgfSBpZiBAb25fc3RhdHM/XG4gICAgICAgIHJldHVybiBSXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2ZpbmlzaGVkJywgICAtPiBAX2ZpbmlzaGVkXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3JvdW5kcycsICAgIC0+IEBfcm91bmRzXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2V4aGF1c3RlZCcsICAtPiBAX3JvdW5kcyA+IEBtYXhfcm91bmRzXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgR2V0X3JhbmRvbVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGdldF9yYW5kb21fc2VlZDogLT4gKCBNYXRoLnJhbmRvbSgpICogMiAqKiAzMiApID4+PiAwXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBAY2ZnICAgICAgICA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5yYW5kb21fdG9vbHNfY2ZnLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgQGNmZy5zZWVkICA/PSBAY29uc3RydWN0b3IuZ2V0X3JhbmRvbV9zZWVkKClcbiAgICAgICAgaGlkZSBALCAnX2Zsb2F0Jywgc3BsaXRtaXgzMiBAY2ZnLnNlZWRcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIElOVEVSTkFMU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9uZXdfc3RhdHM6ICggY2ZnICkgLT5cbiAgICAgICAgcmV0dXJuIG5ldyBpbnRlcm5hbHMuU3RhdHMgeyBpbnRlcm5hbHMudGVtcGxhdGVzLl9uZXdfc3RhdHMuLi4sICggY2xlYW4gQGNmZyApLi4uLCBjZmcuLi4sIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heF9sZW5ndGg6ICh7IGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgaWYgbWluX2xlbmd0aD9cbiAgICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoOiAoIG1heF9sZW5ndGggPyBtaW5fbGVuZ3RoICogMiApLCB9XG4gICAgICAgIGVsc2UgaWYgbWF4X2xlbmd0aD9cbiAgICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoOiAoIG1pbl9sZW5ndGggPyAxICksIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogbGVuZ3RoLCBtYXhfbGVuZ3RoOiBsZW5ndGgsIH0gaWYgbGVuZ3RoP1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fMTIgbXVzdCBzZXQgYXQgbGVhc3Qgb25lIG9mIGBsZW5ndGhgLCBgbWluX2xlbmd0aGAsIGBtYXhfbGVuZ3RoYFwiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X3JhbmRvbV9sZW5ndGg6ICh7IGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4gbWluX2xlbmd0aCBpZiBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGggIyMjIE5PVEUgZG9uZSB0byBhdm9pZCBjaGFuZ2luZyBQUk5HIHN0YXRlICMjI1xuICAgICAgICByZXR1cm4gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4OiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBtaW4gID0gbWluLmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWluICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWF4ICA9IG1heC5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1heCApIGlzICdzdHJpbmcnXG4gICAgICAgIG1pbiA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAwIF1cbiAgICAgICAgbWF4ID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDEgXVxuICAgICAgICByZXR1cm4geyBtaW4sIG1heCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9maWx0ZXI6ICggZmlsdGVyICkgLT5cbiAgICAgICAgcmV0dXJuICggKCB4ICkgLT4gdHJ1ZSAgICAgICAgICAgICkgdW5sZXNzIGZpbHRlcj9cbiAgICAgICAgcmV0dXJuICggZmlsdGVyICAgICAgICAgICAgICAgICAgICkgaWYgKCB0eXBlb2YgZmlsdGVyICkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgICByZXR1cm4gKCAoIHggKSAtPiBmaWx0ZXIudGVzdCB4ICAgKSBpZiBmaWx0ZXIgaW5zdGFuY2VvZiBSZWdFeHBcbiAgICAgICAgIyMjIFRBSU5UIHVzZSBgcnByYCwgdHlwaW5nICMjI1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fMTMgdW5hYmxlIHRvIHR1cm4gYXJndW1lbnQgaW50byBhIGZpbHRlcjogI3thcmd1bWVudH1cIlxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIENPTlZFTklFTkNFXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyBmbG9hdDogICAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgIyBpbnRlZ2VyOiAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gTWF0aC5yb3VuZCBAZmxvYXQgeyBtaW4sIG1heCwgfVxuICAgICAgZmxvYXQ6ICAgICggUC4uLiApIC0+ICggQGZsb2F0X3Byb2R1Y2VyICAgUC4uLiApKClcbiAgICAgIGludGVnZXI6ICAoIFAuLi4gKSAtPiAoIEBpbnRlZ2VyX3Byb2R1Y2VyIFAuLi4gKSgpXG4gICAgICBjaHI6ICAgICAgKCBQLi4uICkgLT4gKCBAY2hyX3Byb2R1Y2VyICAgICBQLi4uICkoKVxuICAgICAgdGV4dDogICAgICggUC4uLiApIC0+ICggQHRleHRfcHJvZHVjZXIgICAgUC4uLiApKClcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBQUk9EVUNFUlNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmbG9hdF9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcywgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmZsb2F0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBmbG9hdCA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdmbG9hdCcsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBpbnRlZ2VyX3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzLCAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuZmxvYXRfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGludGVnZXIgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnaW50ZWdlcicsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBNYXRoLnJvdW5kIG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNocl9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgY29uc2lkZXIgdG8gY2FjaGUgcmVzdWx0ICMjI1xuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgcHJlZmlsdGVyLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5jaHJfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwcmVmaWx0ZXIgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBwcmVmaWx0ZXJcbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gY2hyID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ2NocicsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBTdHJpbmcuZnJvbUNvZGVQb2ludCBAaW50ZWdlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggcHJlZmlsdGVyIFIgKSBhbmQgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRleHRfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGNhY2hlIHJlc3VsdCAjIyNcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnRleHRfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgICB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgbGVuZ3RoX2lzX2NvbnN0ICAgPSBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGhcbiAgICAgICAgbGVuZ3RoICAgICAgICAgICAgPSBtaW5fbGVuZ3RoXG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIHRleHQgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAndGV4dCcsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxlbmd0aCA9IEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH0gdW5sZXNzIGxlbmd0aF9pc19jb25zdFxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSAoIEBjaHIgeyBtaW4sIG1heCwgfSBmb3IgXyBpbiBbIDEgLi4gbGVuZ3RoIF0gKS5qb2luICcnXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgU0VUU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl9jaHJzOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcywgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnNldF9vZl9jaHJzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdzZXRfb2ZfY2hycycsIG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9XG4gICAgICAgIFIgICAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgIGNociAgICAgICAgICAgICAgID0gQGNocl9wcm9kdWNlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsb29wXG4gICAgICAgICAgUi5hZGQgY2hyKClcbiAgICAgICAgICBicmVhayBpZiBSLnNpemUgPj0gc2l6ZVxuICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfb2ZfdGV4dHM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzLCAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX3RleHRzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICB0ZXh0ICAgICAgICAgICAgICA9IEB0ZXh0X3Byb2R1Y2VyIHsgbWluLCBtYXgsIGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgZmlsdGVyLCB9XG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnc2V0X29mX3RleHRzJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBSLmFkZCB0ZXh0KClcbiAgICAgICAgICBicmVhayBpZiBSLnNpemUgPj0gc2l6ZVxuICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgV0FMS0VSU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHdhbGs6ICggY2ZnICkgLT5cbiAgICAgICAgeyBwcm9kdWNlcixcbiAgICAgICAgICBuLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLndhbGsuLi4sIGNmZy4uLiwgfVxuICAgICAgICBjb3VudCAgICAgICAgICAgICA9IDBcbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd3YWxrJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgbG9vcFxuICAgICAgICAgIGNvdW50Kys7IGJyZWFrIGlmIGNvdW50ID4gblxuICAgICAgICAgIHlpZWxkIHByb2R1Y2VyKClcbiAgICAgICAgICAjIyMgTk9ERSBhbnkgZmlsdGVyaW5nICZjIGhhcHBlbnMgaW4gcHJvZHVjZXIgc28gbm8gZXh0cmFuZW91cyByb3VuZHMgYXJlIGV2ZXIgbWFkZSBieSBgd2FsaygpYCxcbiAgICAgICAgICB0aGVyZWZvcmUgdGhlIGByb3VuZHNgIGluIHRoZSBgd2Fsa2Agc3RhdHMgb2JqZWN0IGFsd2F5cyByZW1haW5zIGAwYCAjIyNcbiAgICAgICAgICAjIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3YWxrX3VuaXF1ZTogKCBjZmcgKSAtPlxuICAgICAgICB7IHByb2R1Y2VyLFxuICAgICAgICAgIHNlZW4sXG4gICAgICAgICAgIyB3aW5kb3csXG4gICAgICAgICAgbixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMgICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy53YWxrLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgc2VlbiAgICAgICAgICAgICA/PSBuZXcgU2V0KClcbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd3YWxrX3VuaXF1ZScsIG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9XG4gICAgICAgIG9sZF9zaXplICAgICAgICAgID0gc2Vlbi5zaXplXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBzZWVuLmFkZCBZICA9IHByb2R1Y2VyKClcbiAgICAgICAgICBpZiBzZWVuLnNpemUgPiBvbGRfc2l6ZVxuICAgICAgICAgICAgeWllbGQgWVxuICAgICAgICAgICAgb2xkX3NpemUgICAgPSBzZWVuLnNpemVcbiAgICAgICAgICAgIGJyZWFrIGlmIHNlZW4uc2l6ZSA+PSBuXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICMjIyBUQUlOVCBpbXBsZW1lbnQgJ3N0b3AncGluZyB0aGUgbG9vcCAjIyNcbiAgICAgICAgICBjb250aW51ZSBpZiAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgYnJlYWsgaWYgc2VudGluZWwgaXMgZG9udF9nb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0dFVFJBTkRPTV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-getrandom-brics.coffee