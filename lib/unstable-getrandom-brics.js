(function() {
  'use strict';
  var UNSTABLE_GETRANDOM_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_GETRANDOM_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_get_random: function() {
      var Get_random, chr_re, clean, dont_go_on, exports, go_on, hide, internals, max_rounds, set_getter, trim_set;
      ({hide, set_getter} = (require('./various-brics')).require_managed_property_tools());
      /* TAINT replace */
      // { default: _get_unique_text,  } = require 'unique-string'
      chr_re = /^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$/v;
      // max_rounds = 9_999
      max_rounds = 1_000;
      go_on = Symbol('go_on');
      dont_go_on = Symbol('dont_go_on');
      //---------------------------------------------------------------------------------------------------------
      /* NOTE Candidates for Future Single-File Module */
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
      trim_set = function(set, purview) {
        var delta, i, len, ref, value;
        if (!((delta = set.size - purview) > 0)) {
          return null;
        }
        /* TAINT questionable micro-optimization? */
        if (delta === 1) {
          for (value of set) {
            set.delete(value);
            break;
          }
        } else {
          ref = [...set].slice(0, delta);
          for (i = 0, len = ref.length; i < len; i++) {
            value = ref[i];
            set.delete(value);
          }
        }
        return null;
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
          walk: {
            producer: null,
            n: 2e308
          },
          walk_unique: {
            producer: null,
            n: 2e308,
            purview: 2e308
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
                    throw new Error("Ω___1 exhausted");
                  };
                case on_exhaustion === 'stop':
                  return function() {
                    return dont_go_on;
                  };
                case (typeof on_exhaustion) === 'function':
                  return on_exhaustion;
                default:
                  /* TAINT use rpr, typing */
                  throw new Error(`Ω___2 illegal value for on_exhaustion: ${on_exhaustion}`);
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
                  throw new Error(`Ω___3 illegal value for on_stats: ${on_stats}`);
              }
            })());
            return void 0;
          }

          //-------------------------------------------------------------------------------------------------------
          retry() {
            if (this._finished) {
              throw new Error("Ω___4 stats has already finished");
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
              throw new Error("Ω___5 stats has already finished");
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
          throw new Error(`Ω___7 unable to turn argument into a filter: ${argument}`);
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
          var R, chr, max, min, on_exhaustion, on_stats, producer, size, stats;
          ({min, max, size, on_stats, on_exhaustion, max_rounds} = {...internals.templates.set_of_chrs, ...cfg});
          stats = this._new_stats({
            name: 'set_of_chrs',
            on_stats,
            on_exhaustion,
            max_rounds
          });
          R = new Set();
          producer = this.chr_producer({min, max, on_stats, on_exhaustion, max_rounds});
          R = new Set();
//.....................................................................................................
          for (chr of this.walk_unique({
            producer,
            n: size,
            seen: R,
            on_stats,
            on_exhaustion,
            max_rounds
          })) {
            null;
          }
          return stats.finish(R);
        }

        //-------------------------------------------------------------------------------------------------------
        set_of_texts(cfg) {
          var R, filter, length, length_is_const, max, max_length, min, min_length, on_exhaustion, on_stats, producer, size, stats, text;
          ({min, max, length, size, min_length, max_length, filter, on_stats, on_exhaustion, max_rounds} = {...internals.templates.set_of_texts, ...cfg});
          ({min_length, max_length} = this._get_min_max_length({length, min_length, max_length}));
          length_is_const = min_length === max_length;
          length = min_length;
          R = new Set();
          producer = this.text_producer({min, max, length, min_length, max_length, filter});
          stats = this._new_stats({
            name: 'set_of_texts',
            on_stats,
            on_exhaustion,
            max_rounds
          });
          R = new Set();
//.....................................................................................................
          for (text of this.walk_unique({
            producer,
            n: size,
            seen: R,
            on_stats,
            on_exhaustion,
            max_rounds
          })) {
            null;
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
          var Y, count, n, old_size, on_exhaustion, on_stats, producer, purview, seen, sentinel, stats;
          ({producer, seen, purview, n, on_stats, on_exhaustion, max_rounds} = {...internals.templates.walk_unique, ...cfg});
          if (seen == null) {
            seen = new Set();
          }
          stats = this._new_stats({
            name: 'walk_unique',
            on_stats,
            on_exhaustion,
            max_rounds
          });
          count = 0;
          while (true) {
            //.....................................................................................................
            trim_set(seen, purview);
            old_size = seen.size;
            seen.add((Y = producer()));
            if (seen.size > old_size) {
              yield Y;
              count++;
              if (count >= n) {
                break;
              }
              continue;
            }
            if ((sentinel = stats.retry()) === go_on) {
              continue;
            }
            if (sentinel === dont_go_on) {
              sentinel = null;
              break;
            }
          }
          return stats.finish(sentinel);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWdldHJhbmRvbS1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7Ozs7O0VBS0Esd0JBQUEsR0FLRSxDQUFBOzs7O0lBQUEsa0JBQUEsRUFBb0IsUUFBQSxDQUFBLENBQUE7QUFDdEIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxVQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxVQUFBLEVBQUE7TUFBSSxDQUFBLENBQUUsSUFBRixFQUNFLFVBREYsQ0FBQSxHQUNrQyxDQUFFLE9BQUEsQ0FBUSxpQkFBUixDQUFGLENBQTZCLENBQUMsOEJBQTlCLENBQUEsQ0FEbEMsRUFBSjs7O01BSUksTUFBQSxHQUFjLG9EQUpsQjs7TUFNSSxVQUFBLEdBQWM7TUFDZCxLQUFBLEdBQWMsTUFBQSxDQUFPLE9BQVA7TUFDZCxVQUFBLEdBQWMsTUFBQSxDQUFPLFlBQVAsRUFSbEI7OztNQVdJLEtBQUEsR0FBYyxRQUFBLENBQUUsQ0FBRixDQUFBO0FBQVEsWUFBQSxDQUFBLEVBQUE7ZUFBQyxNQUFNLENBQUMsV0FBUDs7QUFBcUI7VUFBQSxLQUFBLE1BQUE7O2dCQUE2QjsyQkFBN0IsQ0FBRSxDQUFGLEVBQUssQ0FBTDs7VUFBQSxDQUFBOztZQUFyQjtNQUFUO01BQ2QsUUFBQSxHQUFjLFFBQUEsQ0FBRSxHQUFGLEVBQU8sT0FBUCxDQUFBO0FBQ2xCLFlBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBO1FBQU0sTUFBbUIsQ0FBRSxLQUFBLEdBQVEsR0FBRyxDQUFDLElBQUosR0FBVyxPQUFyQixDQUFBLEdBQWlDLEVBQXBEO0FBQUEsaUJBQU8sS0FBUDtTQUFOOztRQUVNLElBQUcsS0FBQSxLQUFTLENBQVo7VUFDRSxLQUFBLFlB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VztBQUNYLG9CQUZGOztVQVZGO0FBYUEsaUJBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxRQUFiO1FBekJFOztNQTVPZixFQXZLSjs7TUFnYkksU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtBQUNaLGFBQU8sT0FBQSxHQUFVLENBQUUsVUFBRixFQUFjLFNBQWQ7SUFsYkM7RUFBcEIsRUFWRjs7O0VBZ2NBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLHdCQUE5QjtBQWhjQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfR0VUUkFORE9NX0JSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfZ2V0X3JhbmRvbTogLT5cbiAgICB7IGhpZGUsXG4gICAgICBzZXRfZ2V0dGVyLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyMjIFRBSU5UIHJlcGxhY2UgIyMjXG4gICAgIyB7IGRlZmF1bHQ6IF9nZXRfdW5pcXVlX3RleHQsICB9ID0gcmVxdWlyZSAndW5pcXVlLXN0cmluZydcbiAgICBjaHJfcmUgICAgICA9IC8vL14oPzpcXHB7TH18XFxwe1pzfXxcXHB7Wn18XFxwe019fFxccHtOfXxcXHB7UH18XFxwe1N9KSQvLy92XG4gICAgIyBtYXhfcm91bmRzID0gOV85OTlcbiAgICBtYXhfcm91bmRzICA9IDFfMDAwXG4gICAgZ29fb24gICAgICAgPSBTeW1ib2wgJ2dvX29uJ1xuICAgIGRvbnRfZ29fb24gID0gU3ltYm9sICdkb250X2dvX29uJ1xuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgTk9URSBDYW5kaWRhdGVzIGZvciBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICAgIGNsZWFuICAgICAgID0gKCB4ICkgLT4gT2JqZWN0LmZyb21FbnRyaWVzICggWyBrLCB2LCBdIGZvciBrLCB2IG9mIHggd2hlbiB2PyApXG4gICAgdHJpbV9zZXQgICAgPSAoIHNldCwgcHVydmlldyApIC0+XG4gICAgICByZXR1cm4gbnVsbCB1bmxlc3MgKCBkZWx0YSA9IHNldC5zaXplIC0gcHVydmlldyApID4gMFxuICAgICAgIyMjIFRBSU5UIHF1ZXN0aW9uYWJsZSBtaWNyby1vcHRpbWl6YXRpb24/ICMjI1xuICAgICAgaWYgZGVsdGEgaXMgMVxuICAgICAgICBmb3IgdmFsdWUgZnJvbSBzZXRcbiAgICAgICAgICBzZXQuZGVsZXRlIHZhbHVlXG4gICAgICAgICAgYnJlYWtcbiAgICAgIGVsc2VcbiAgICAgICAgc2V0LmRlbGV0ZSB2YWx1ZSBmb3IgdmFsdWUgaW4gWyBzZXQuLi4sIF1bIDAgLi4uIGRlbHRhIF1cbiAgICAgIHJldHVybiBudWxsXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0gIyBPYmplY3QuZnJlZXplXG4gICAgICBjaHJfcmU6ICAgICAgICAgICAgIGNocl9yZVxuICAgICAgbWF4X3JvdW5kczogICAgICAgICBtYXhfcm91bmRzXG4gICAgICBnb19vbjogICAgICAgICAgICAgIGdvX29uXG4gICAgICBjbGVhbjogICAgICAgICAgICAgIGNsZWFuXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgdGVtcGxhdGVzOiBPYmplY3QuZnJlZXplXG4gICAgICAgIHJhbmRvbV90b29sc19jZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgICBzZWVkOiAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBtYXhfcm91bmRzOiAgICAgICAgIG1heF9yb3VuZHNcbiAgICAgICAgICAjIHVuaXF1ZV9jb3VudDogICAxXzAwMFxuICAgICAgICAgIG9uX3N0YXRzOiAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHVuaWNvZGVfY2lkX3JhbmdlOiAgT2JqZWN0LmZyZWV6ZSBbIDB4MDAwMCwgMHgxMGZmZmYgXVxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBpbnRfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIGZsb2F0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBjaHJfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBwcmVmaWx0ZXI6ICAgICAgICAgIGNocl9yZVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICB0ZXh0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgbGVuZ3RoOiAgICAgICAgICAgICAxXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgbWluX2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHdhbGs6XG4gICAgICAgICAgcHJvZHVjZXI6ICAgICAgICAgICBudWxsXG4gICAgICAgICAgbjogICAgICAgICAgICAgICAgICBJbmZpbml0eVxuICAgICAgICB3YWxrX3VuaXF1ZTpcbiAgICAgICAgICBwcm9kdWNlcjogICAgICAgICAgIG51bGxcbiAgICAgICAgICBuOiAgICAgICAgICAgICAgICAgIEluZmluaXR5XG4gICAgICAgICAgcHVydmlldzogICAgICAgICAgICBJbmZpbml0eVxuICAgICAgICBzdGF0czpcbiAgICAgICAgICBmbG9hdDpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICBpbnRlZ2VyOlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIGNocjpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl90ZXh0czpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBgYGBcbiAgICAvLyB0aHggdG8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NTkzMzE2Lzc1NjgwOTFcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvc2VlZGluZy10aGUtcmFuZG9tLW51bWJlci1nZW5lcmF0b3ItaW4tamF2YXNjcmlwdFxuXG4gICAgLy8gU3BsaXRNaXgzMlxuXG4gICAgLy8gQSAzMi1iaXQgc3RhdGUgUFJORyB0aGF0IHdhcyBtYWRlIGJ5IHRha2luZyBNdXJtdXJIYXNoMydzIG1peGluZyBmdW5jdGlvbiwgYWRkaW5nIGEgaW5jcmVtZW50b3IgYW5kXG4gICAgLy8gdHdlYWtpbmcgdGhlIGNvbnN0YW50cy4gSXQncyBwb3RlbnRpYWxseSBvbmUgb2YgdGhlIGJldHRlciAzMi1iaXQgUFJOR3Mgc28gZmFyOyBldmVuIHRoZSBhdXRob3Igb2ZcbiAgICAvLyBNdWxiZXJyeTMyIGNvbnNpZGVycyBpdCB0byBiZSB0aGUgYmV0dGVyIGNob2ljZS4gSXQncyBhbHNvIGp1c3QgYXMgZmFzdC5cblxuICAgIGNvbnN0IHNwbGl0bWl4MzIgPSBmdW5jdGlvbiAoIGEgKSB7XG4gICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICBhIHw9IDA7XG4gICAgICAgYSA9IGEgKyAweDllMzc3OWI5IHwgMDtcbiAgICAgICBsZXQgdCA9IGEgXiBhID4+PiAxNjtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4MjFmMGFhYWQpO1xuICAgICAgIHQgPSB0IF4gdCA+Pj4gMTU7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDczNWEyZDk3KTtcbiAgICAgICByZXR1cm4gKCh0ID0gdCBeIHQgPj4+IDE1KSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnN0IHBybmcgPSBzcGxpdG1peDMyKChNYXRoLnJhbmRvbSgpKjIqKjMyKT4+PjApXG4gICAgLy8gZm9yKGxldCBpPTA7IGk8MTA7IGkrKykgY29uc29sZS5sb2cocHJuZygpKTtcbiAgICAvL1xuICAgIC8vIEkgd291bGQgcmVjb21tZW5kIHRoaXMgaWYgeW91IGp1c3QgbmVlZCBhIHNpbXBsZSBidXQgZ29vZCBQUk5HIGFuZCBkb24ndCBuZWVkIGJpbGxpb25zIG9mIHJhbmRvbVxuICAgIC8vIG51bWJlcnMgKHNlZSBCaXJ0aGRheSBwcm9ibGVtKS5cbiAgICAvL1xuICAgIC8vIE5vdGU6IEl0IGRvZXMgaGF2ZSBvbmUgcG90ZW50aWFsIGNvbmNlcm46IGl0IGRvZXMgbm90IHJlcGVhdCBwcmV2aW91cyBudW1iZXJzIHVudGlsIHlvdSBleGhhdXN0IDQuM1xuICAgIC8vIGJpbGxpb24gbnVtYmVycyBhbmQgaXQgcmVwZWF0cyBhZ2Fpbi4gV2hpY2ggbWF5IG9yIG1heSBub3QgYmUgYSBzdGF0aXN0aWNhbCBjb25jZXJuIGZvciB5b3VyIHVzZVxuICAgIC8vIGNhc2UuIEl0J3MgbGlrZSBhIGxpc3Qgb2YgcmFuZG9tIG51bWJlcnMgd2l0aCB0aGUgZHVwbGljYXRlcyByZW1vdmVkLCBidXQgd2l0aG91dCBhbnkgZXh0cmEgd29ya1xuICAgIC8vIGludm9sdmVkIHRvIHJlbW92ZSB0aGVtLiBBbGwgb3RoZXIgZ2VuZXJhdG9ycyBpbiB0aGlzIGxpc3QgZG8gbm90IGV4aGliaXQgdGhpcyBiZWhhdmlvci5cbiAgICBgYGBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBpbnRlcm5hbHMuU3RhdHNcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoeyBuYW1lLCBvbl9leGhhdXN0aW9uID0gJ2Vycm9yJywgb25fc3RhdHMgPSBudWxsLCBtYXhfcm91bmRzID0gbnVsbCB9KSAtPlxuICAgICAgICBAbmFtZSAgICAgICAgICAgICAgICAgICA9IG5hbWVcbiAgICAgICAgQG1heF9yb3VuZHMgICAgICAgICAgICA9IG1heF9yb3VuZHMgPyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcubWF4X3JvdW5kc1xuICAgICAgICBvbl9leGhhdXN0aW9uICAgICAgICAgID89ICdlcnJvcidcbiAgICAgICAgaGlkZSBALCAnX2ZpbmlzaGVkJywgICAgICBmYWxzZVxuICAgICAgICBoaWRlIEAsICdfcm91bmRzJywgICAgICAgIDBcbiAgICAgICAgaGlkZSBALCAnb25fZXhoYXVzdGlvbicsICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gb25fZXhoYXVzdGlvbiAgICAgICAgICAgIGlzICdlcnJvcicgICAgdGhlbiAtPiB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzEgZXhoYXVzdGVkXCJcbiAgICAgICAgICB3aGVuIG9uX2V4aGF1c3Rpb24gICAgICAgICAgICBpcyAnc3RvcCcgICAgIHRoZW4gLT4gZG9udF9nb19vblxuICAgICAgICAgIHdoZW4gKCB0eXBlb2Ygb25fZXhoYXVzdGlvbiApIGlzICdmdW5jdGlvbicgdGhlbiBvbl9leGhhdXN0aW9uXG4gICAgICAgICAgIyMjIFRBSU5UIHVzZSBycHIsIHR5cGluZyAjIyNcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fMiBpbGxlZ2FsIHZhbHVlIGZvciBvbl9leGhhdXN0aW9uOiAje29uX2V4aGF1c3Rpb259XCJcbiAgICAgICAgaGlkZSBALCAnb25fc3RhdHMnLCAgICAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gKCB0eXBlb2Ygb25fc3RhdHMgKSBpcyAnZnVuY3Rpb24nICB0aGVuIG9uX3N0YXRzXG4gICAgICAgICAgd2hlbiAoIG5vdCBvbl9zdGF0cz8gKSAgICAgICAgICAgICAgICAgIHRoZW4gbnVsbFxuICAgICAgICAgICMjIyBUQUlOVCB1c2UgcnByLCB0eXBpbmcgIyMjXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzMgaWxsZWdhbCB2YWx1ZSBmb3Igb25fc3RhdHM6ICN7b25fc3RhdHN9XCJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcmV0cnk6IC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBzdGF0cyBoYXMgYWxyZWFkeSBmaW5pc2hlZFwiIGlmIEBfZmluaXNoZWRcbiAgICAgICAgQF9yb3VuZHMrK1xuICAgICAgICByZXR1cm4gQG9uX2V4aGF1c3Rpb24oKSBpZiBAZXhoYXVzdGVkXG4gICAgICAgIHJldHVybiBnb19vblxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmluaXNoOiAoIFIgKSAtPlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgc3RhdHMgaGFzIGFscmVhZHkgZmluaXNoZWRcIiBpZiBAX2ZpbmlzaGVkXG4gICAgICAgIEBfZmluaXNoZWQgPSB0cnVlXG4gICAgICAgIEBvbl9zdGF0cyB7IG5hbWU6IEBuYW1lLCByb3VuZHM6IEByb3VuZHMsIFIsIH0gaWYgQG9uX3N0YXRzP1xuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdmaW5pc2hlZCcsICAgLT4gQF9maW5pc2hlZFxuICAgICAgc2V0X2dldHRlciBAOjosICdyb3VuZHMnLCAgICAtPiBAX3JvdW5kc1xuICAgICAgc2V0X2dldHRlciBAOjosICdleGhhdXN0ZWQnLCAgLT4gQF9yb3VuZHMgPiBAbWF4X3JvdW5kc1xuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEdldF9yYW5kb21cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBnZXRfcmFuZG9tX3NlZWQ6IC0+ICggTWF0aC5yYW5kb20oKSAqIDIgKiogMzIgKSA+Pj4gMFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgQGNmZyAgICAgICAgPSB7IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEBjZmcuc2VlZCAgPz0gQGNvbnN0cnVjdG9yLmdldF9yYW5kb21fc2VlZCgpXG4gICAgICAgIGhpZGUgQCwgJ19mbG9hdCcsIHNwbGl0bWl4MzIgQGNmZy5zZWVkXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBJTlRFUk5BTFNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfbmV3X3N0YXRzOiAoIGNmZyApIC0+XG4gICAgICAgIHJldHVybiBuZXcgaW50ZXJuYWxzLlN0YXRzIHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5fbmV3X3N0YXRzLi4uLCAoIGNsZWFuIEBjZmcgKS4uLiwgY2ZnLi4uLCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X21pbl9tYXhfbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIGlmIG1pbl9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aCwgbWF4X2xlbmd0aDogKCBtYXhfbGVuZ3RoID8gbWluX2xlbmd0aCAqIDIgKSwgfVxuICAgICAgICBlbHNlIGlmIG1heF9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogKCBtaW5fbGVuZ3RoID8gMSApLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6IGxlbmd0aCwgbWF4X2xlbmd0aDogbGVuZ3RoLCB9IGlmIGxlbmd0aD9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX182IG11c3Qgc2V0IGF0IGxlYXN0IG9uZSBvZiBgbGVuZ3RoYCwgYG1pbl9sZW5ndGhgLCBgbWF4X2xlbmd0aGBcIlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9yYW5kb21fbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIG1pbl9sZW5ndGggaWYgbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoICMjIyBOT1RFIGRvbmUgdG8gYXZvaWQgY2hhbmdpbmcgUFJORyBzdGF0ZSAjIyNcbiAgICAgICAgcmV0dXJuIEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heDogKHsgbWluID0gbnVsbCwgbWF4ID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgbWluICA9IG1pbi5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1pbiApIGlzICdzdHJpbmcnXG4gICAgICAgIG1heCAgPSBtYXguY29kZVBvaW50QXQgMCBpZiAoIHR5cGVvZiBtYXggKSBpcyAnc3RyaW5nJ1xuICAgICAgICBtaW4gPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMCBdXG4gICAgICAgIG1heCA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAxIF1cbiAgICAgICAgcmV0dXJuIHsgbWluLCBtYXgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfZmlsdGVyOiAoIGZpbHRlciApIC0+XG4gICAgICAgIHJldHVybiAoICggeCApIC0+IHRydWUgICAgICAgICAgICApIHVubGVzcyBmaWx0ZXI/XG4gICAgICAgIHJldHVybiAoIGZpbHRlciAgICAgICAgICAgICAgICAgICApIGlmICggdHlwZW9mIGZpbHRlciApIGlzICdmdW5jdGlvbidcbiAgICAgICAgcmV0dXJuICggKCB4ICkgLT4gZmlsdGVyLnRlc3QgeCAgICkgaWYgZmlsdGVyIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgICAgICMjIyBUQUlOVCB1c2UgYHJwcmAsIHR5cGluZyAjIyNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX183IHVuYWJsZSB0byB0dXJuIGFyZ3VtZW50IGludG8gYSBmaWx0ZXI6ICN7YXJndW1lbnR9XCJcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBDT05WRU5JRU5DRVxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMgZmxvYXQ6ICAgICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICMgaW50ZWdlcjogICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IE1hdGgucm91bmQgQGZsb2F0IHsgbWluLCBtYXgsIH1cbiAgICAgIGZsb2F0OiAgICAoIFAuLi4gKSAtPiAoIEBmbG9hdF9wcm9kdWNlciAgIFAuLi4gKSgpXG4gICAgICBpbnRlZ2VyOiAgKCBQLi4uICkgLT4gKCBAaW50ZWdlcl9wcm9kdWNlciBQLi4uICkoKVxuICAgICAgY2hyOiAgICAgICggUC4uLiApIC0+ICggQGNocl9wcm9kdWNlciAgICAgUC4uLiApKClcbiAgICAgIHRleHQ6ICAgICAoIFAuLi4gKSAtPiAoIEB0ZXh0X3Byb2R1Y2VyICAgIFAuLi4gKSgpXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgUFJPRFVDRVJTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXRfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gZmxvYXQgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnZmxvYXQnLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIGZpbHRlciBSIClcbiAgICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgaW50ZWdlcl9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcywgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmZsb2F0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBpbnRlZ2VyID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ2ludGVnZXInLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gTWF0aC5yb3VuZCBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjaHJfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGNhY2hlIHJlc3VsdCAjIyNcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIHByZWZpbHRlcixcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzLCAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuY2hyX3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcHJlZmlsdGVyICAgICAgICAgPSBAX2dldF9maWx0ZXIgcHJlZmlsdGVyXG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGNociA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdjaHInLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gU3RyaW5nLmZyb21Db2RlUG9pbnQgQGludGVnZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIHByZWZpbHRlciBSICkgYW5kICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB0ZXh0X3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgICMjIyBUQUlOVCBjb25zaWRlciB0byBjYWNoZSByZXN1bHQgIyMjXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMgICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy50ZXh0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiB0ZXh0ID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3RleHQnLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsZW5ndGggPSBAaW50ZWdlciB7IG1pbjogbWluX2xlbmd0aCwgbWF4OiBtYXhfbGVuZ3RoLCB9IHVubGVzcyBsZW5ndGhfaXNfY29uc3RcbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gKCBAY2hyIHsgbWluLCBtYXgsIH0gZm9yIF8gaW4gWyAxIC4uIGxlbmd0aCBdICkuam9pbiAnJ1xuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIGZpbHRlciBSIClcbiAgICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFNFVFNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfb2ZfY2hyczogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgc2l6ZSxcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5zZXRfb2ZfY2hycy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnc2V0X29mX2NocnMnLCBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfVxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICBwcm9kdWNlciAgICAgICAgICA9IEBjaHJfcHJvZHVjZXIgeyBtaW4sIG1heCwgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgUiAgICAgICAgICAgICAgICAgPSBuZXcgU2V0KClcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvciBjaHIgZnJvbSBAd2Fsa191bmlxdWUgeyBwcm9kdWNlciwgbjogc2l6ZSwgc2VlbjogUiwgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgICBudWxsXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl90ZXh0czogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgIHNpemUsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5zZXRfb2ZfdGV4dHMuLi4sIGNmZy4uLiwgfVxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgICB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgbGVuZ3RoX2lzX2NvbnN0ICAgPSBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGhcbiAgICAgICAgbGVuZ3RoICAgICAgICAgICAgPSBtaW5fbGVuZ3RoXG4gICAgICAgIFIgICAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgIHByb2R1Y2VyICAgICAgICAgID0gQHRleHRfcHJvZHVjZXIgeyBtaW4sIG1heCwgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCBmaWx0ZXIsIH1cbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdzZXRfb2ZfdGV4dHMnLCBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfVxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm9yIHRleHQgZnJvbSBAd2Fsa191bmlxdWUgeyBwcm9kdWNlciwgbjogc2l6ZSwgc2VlbjogUiwgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgICBudWxsXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSIClcblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgV0FMS0VSU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHdhbGs6ICggY2ZnICkgLT5cbiAgICAgICAgeyBwcm9kdWNlcixcbiAgICAgICAgICBuLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLndhbGsuLi4sIGNmZy4uLiwgfVxuICAgICAgICBjb3VudCAgICAgICAgICAgICA9IDBcbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd3YWxrJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgbG9vcFxuICAgICAgICAgIGNvdW50Kys7IGJyZWFrIGlmIGNvdW50ID4gblxuICAgICAgICAgIHlpZWxkIHByb2R1Y2VyKClcbiAgICAgICAgICAjIyMgTk9ERSBhbnkgZmlsdGVyaW5nICZjIGhhcHBlbnMgaW4gcHJvZHVjZXIgc28gbm8gZXh0cmFuZW91cyByb3VuZHMgYXJlIGV2ZXIgbWFkZSBieSBgd2FsaygpYCxcbiAgICAgICAgICB0aGVyZWZvcmUgdGhlIGByb3VuZHNgIGluIHRoZSBgd2Fsa2Agc3RhdHMgb2JqZWN0IGFsd2F5cyByZW1haW5zIGAwYCAjIyNcbiAgICAgICAgICAjIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3YWxrX3VuaXF1ZTogKCBjZmcgKSAtPlxuICAgICAgICB7IHByb2R1Y2VyLFxuICAgICAgICAgIHNlZW4sXG4gICAgICAgICAgcHVydmlldyxcbiAgICAgICAgICBuLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLndhbGtfdW5pcXVlLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgc2VlbiAgICAgICAgICAgICA/PSBuZXcgU2V0KClcbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd3YWxrX3VuaXF1ZScsIG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9XG4gICAgICAgIGNvdW50ICAgICAgICAgICAgID0gMFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbG9vcFxuICAgICAgICAgIHRyaW1fc2V0IHNlZW4sIHB1cnZpZXdcbiAgICAgICAgICBvbGRfc2l6ZSA9IHNlZW4uc2l6ZVxuICAgICAgICAgIHNlZW4uYWRkICggWSA9IHByb2R1Y2VyKCkgKVxuICAgICAgICAgIGlmIHNlZW4uc2l6ZSA+IG9sZF9zaXplXG4gICAgICAgICAgICB5aWVsZCBZXG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgICAgICBicmVhayBpZiBjb3VudCA+PSBuXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIGNvbnRpbnVlIGlmICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICBpZiBzZW50aW5lbCBpcyBkb250X2dvX29uXG4gICAgICAgICAgICBzZW50aW5lbCA9IG51bGxcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBzZW50aW5lbCApXG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0dFVFJBTkRPTV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-getrandom-brics.coffee