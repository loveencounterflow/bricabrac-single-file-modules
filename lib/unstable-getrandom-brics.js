(function() {
  'use strict';
  var UNSTABLE_GETRANDOM_BRICS, debug;

  //===========================================================================================================
  ({debug} = console);

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
      max_rounds = 10_000;
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

        //=======================================================================================================
        // SHUFFLE
        //-------------------------------------------------------------------------------------------------------
        // shuffle: ( list, ratio = 1 ) ->
        //   ### Shuffles the elements of a list randomly. After the call, the elements of will be—most of the
        //   time—reordered (but this is not guaranteed, as there is a realistic probability for recurrence
        //   of orderings with short lists).

          //   This is an implementation of the renowned Fisher-Yates algorithm, but with a twist: You may pass in
        //   a `ratio` as second argument (which should be a float in the range `0 <= ratio <= 1`); if set to a
        //   value less than one, a random number will be used to decide whether or not to perform a given step
        //   in the shuffling process, so lists shuffled with zero-ish ratios will show less disorder than lists
        //   shuffled with a one-ish ratio.

          //   Implementation gleaned from http://stackoverflow.com/a/962890/256361. ###
        //   #.........................................................................................................
        //   return list if ( this_idx = list.length ) < 2
        //   return @_shuffle list, ratio #, Math.random, @random_integer.bind @

          // # #-----------------------------------------------------------------------------------------------------------
        // # get_shuffle: ( seed_0 = 0, seed_1 = 1 ) ->
        // #   ### This method works similar to `get_rnd`; it accepts two `seed`s which are used to produce random number
        // #   generators and returns a predictable shuffling function that accepts arguments like Bits'N'Pieces
        // #   `shuffle`. ###
        // #   rnd             = @get_rnd      seed_0
        // #   random_integer  = @get_rnd_int  seed_1
        // #   return ( list, ratio = 1 ) => @_shuffle list, ratio, rnd, random_integer

          // #-----------------------------------------------------------------------------------------------------------
        // _shuffle: ( list, ratio, rnd = null, random_integer = null ) ->
        //   #.........................................................................................................
        //   return list if ( this_idx = list.length ) < 2
        //   #.........................................................................................................
        //   rnd             = => @float()
        //   random_integer  = ( min, max ) => @integer min, max
        //   #.........................................................................................................
        //   loop
        //     this_idx += -1
        //     return list if this_idx < 1
        //     if ratio >= 1 or rnd() <= ratio
        //       # return list if this_idx < 1
        //       that_idx = random_integer 0, this_idx
        //       [ list[ that_idx ], list[ this_idx ] ] = [ list[ this_idx ], list[ that_idx ] ]
        //   #.........................................................................................................
        //   return list

          //-----------------------------------------------------------------------------------------------------
        shuffle(list, factor = 1) {
          var count, get_random_idx, i, max_count, ref, that_idx, this_idx;
          if ((this_idx = list.length) < 2) {
            //...................................................................................................
            return list;
          }
          //...................................................................................................
          get_random_idx = this.integer_producer({
            min: 0,
            max: list.length - 1
          });
          max_count = Math.ceil(list.length * factor);
//...................................................................................................
          for (count = i = 1, ref = max_count; (1 <= ref ? i <= ref : i >= ref); count = 1 <= ref ? ++i : --i) {
            this_idx = get_random_idx();
            that_idx = get_random_idx();
            [list[that_idx], list[this_idx]] = [list[this_idx], list[that_idx]];
          }
          //...................................................................................................
          return list;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWdldHJhbmRvbS1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUEsRUFBQSxLQUFBOzs7RUFHQSxDQUFBLENBQUUsS0FBRixDQUFBLEdBQWEsT0FBYixFQUhBOzs7OztFQVNBLHdCQUFBLEdBS0UsQ0FBQTs7OztJQUFBLGtCQUFBLEVBQW9CLFFBQUEsQ0FBQSxDQUFBO0FBQ3RCLFVBQUEsVUFBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsVUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBO01BQUksQ0FBQSxDQUFFLElBQUYsRUFDRSxVQURGLENBQUEsR0FDa0MsQ0FBRSxPQUFBLENBQVEsaUJBQVIsQ0FBRixDQUE2QixDQUFDLDhCQUE5QixDQUFBLENBRGxDLEVBQUo7OztNQUlJLE1BQUEsR0FBYyxvREFKbEI7O01BTUksVUFBQSxHQUFjO01BQ2QsS0FBQSxHQUFjLE1BQUEsQ0FBTyxPQUFQO01BQ2QsVUFBQSxHQUFjLE1BQUEsQ0FBTyxZQUFQLEVBUmxCOzs7TUFXSSxLQUFBLEdBQWMsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUFRLFlBQUEsQ0FBQSxFQUFBO2VBQUMsTUFBTSxDQUFDLFdBQVA7O0FBQXFCO1VBQUEsS0FBQSxNQUFBOztnQkFBNkI7MkJBQTdCLENBQUUsQ0FBRixFQUFLLENBQUw7O1VBQUEsQ0FBQTs7WUFBckI7TUFBVDtNQUNkLFFBQUEsR0FBYyxRQUFBLENBQUUsR0FBRixFQUFPLE9BQVAsQ0FBQTtBQUNsQixZQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQTtRQUFNLE1BQW1CLENBQUUsS0FBQSxHQUFRLEdBQUcsQ0FBQyxJQUFKLEdBQVcsT0FBckIsQ0FBQSxHQUFpQyxFQUFwRDtBQUFBLGlC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LE9BQXJCLEVBQThCLHdCQUE5QjtBQWpnQkEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG57IGRlYnVnLCB9ID0gY29uc29sZVxuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9HRVRSQU5ET01fQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9nZXRfcmFuZG9tOiAtPlxuICAgIHsgaGlkZSxcbiAgICAgIHNldF9nZXR0ZXIsICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICAjIyMgVEFJTlQgcmVwbGFjZSAjIyNcbiAgICAjIHsgZGVmYXVsdDogX2dldF91bmlxdWVfdGV4dCwgIH0gPSByZXF1aXJlICd1bmlxdWUtc3RyaW5nJ1xuICAgIGNocl9yZSAgICAgID0gLy8vXig/OlxccHtMfXxcXHB7WnN9fFxccHtafXxcXHB7TX18XFxwe059fFxccHtQfXxcXHB7U30pJC8vL3ZcbiAgICAjIG1heF9yb3VuZHMgPSA5Xzk5OVxuICAgIG1heF9yb3VuZHMgID0gMTBfMDAwXG4gICAgZ29fb24gICAgICAgPSBTeW1ib2wgJ2dvX29uJ1xuICAgIGRvbnRfZ29fb24gID0gU3ltYm9sICdkb250X2dvX29uJ1xuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgTk9URSBDYW5kaWRhdGVzIGZvciBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICAgIGNsZWFuICAgICAgID0gKCB4ICkgLT4gT2JqZWN0LmZyb21FbnRyaWVzICggWyBrLCB2LCBdIGZvciBrLCB2IG9mIHggd2hlbiB2PyApXG4gICAgdHJpbV9zZXQgICAgPSAoIHNldCwgcHVydmlldyApIC0+XG4gICAgICByZXR1cm4gbnVsbCB1bmxlc3MgKCBkZWx0YSA9IHNldC5zaXplIC0gcHVydmlldyApID4gMFxuICAgICAgIyMjIFRBSU5UIHF1ZXN0aW9uYWJsZSBtaWNyby1vcHRpbWl6YXRpb24/ICMjI1xuICAgICAgaWYgZGVsdGEgaXMgMVxuICAgICAgICBmb3IgdmFsdWUgZnJvbSBzZXRcbiAgICAgICAgICBzZXQuZGVsZXRlIHZhbHVlXG4gICAgICAgICAgYnJlYWtcbiAgICAgIGVsc2VcbiAgICAgICAgc2V0LmRlbGV0ZSB2YWx1ZSBmb3IgdmFsdWUgaW4gWyBzZXQuLi4sIF1bIDAgLi4uIGRlbHRhIF1cbiAgICAgIHJldHVybiBudWxsXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0gIyBPYmplY3QuZnJlZXplXG4gICAgICBjaHJfcmU6ICAgICAgICAgICAgIGNocl9yZVxuICAgICAgbWF4X3JvdW5kczogICAgICAgICBtYXhfcm91bmRzXG4gICAgICBnb19vbjogICAgICAgICAgICAgIGdvX29uXG4gICAgICBjbGVhbjogICAgICAgICAgICAgIGNsZWFuXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgdGVtcGxhdGVzOiBPYmplY3QuZnJlZXplXG4gICAgICAgIHJhbmRvbV90b29sc19jZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgICBzZWVkOiAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBtYXhfcm91bmRzOiAgICAgICAgIG1heF9yb3VuZHNcbiAgICAgICAgICAjIHVuaXF1ZV9jb3VudDogICAxXzAwMFxuICAgICAgICAgIG9uX3N0YXRzOiAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHVuaWNvZGVfY2lkX3JhbmdlOiAgT2JqZWN0LmZyZWV6ZSBbIDB4MDAwMCwgMHgxMGZmZmYgXVxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBpbnRfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIGZsb2F0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBjaHJfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBwcmVmaWx0ZXI6ICAgICAgICAgIGNocl9yZVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICB0ZXh0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgbGVuZ3RoOiAgICAgICAgICAgICAxXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgbWluX2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHdhbGs6XG4gICAgICAgICAgcHJvZHVjZXI6ICAgICAgICAgICBudWxsXG4gICAgICAgICAgbjogICAgICAgICAgICAgICAgICBJbmZpbml0eVxuICAgICAgICB3YWxrX3VuaXF1ZTpcbiAgICAgICAgICBwcm9kdWNlcjogICAgICAgICAgIG51bGxcbiAgICAgICAgICBuOiAgICAgICAgICAgICAgICAgIEluZmluaXR5XG4gICAgICAgICAgcHVydmlldzogICAgICAgICAgICBJbmZpbml0eVxuICAgICAgICBzdGF0czpcbiAgICAgICAgICBmbG9hdDpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICBpbnRlZ2VyOlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIGNocjpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl90ZXh0czpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBgYGBcbiAgICAvLyB0aHggdG8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NTkzMzE2Lzc1NjgwOTFcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvc2VlZGluZy10aGUtcmFuZG9tLW51bWJlci1nZW5lcmF0b3ItaW4tamF2YXNjcmlwdFxuXG4gICAgLy8gU3BsaXRNaXgzMlxuXG4gICAgLy8gQSAzMi1iaXQgc3RhdGUgUFJORyB0aGF0IHdhcyBtYWRlIGJ5IHRha2luZyBNdXJtdXJIYXNoMydzIG1peGluZyBmdW5jdGlvbiwgYWRkaW5nIGEgaW5jcmVtZW50b3IgYW5kXG4gICAgLy8gdHdlYWtpbmcgdGhlIGNvbnN0YW50cy4gSXQncyBwb3RlbnRpYWxseSBvbmUgb2YgdGhlIGJldHRlciAzMi1iaXQgUFJOR3Mgc28gZmFyOyBldmVuIHRoZSBhdXRob3Igb2ZcbiAgICAvLyBNdWxiZXJyeTMyIGNvbnNpZGVycyBpdCB0byBiZSB0aGUgYmV0dGVyIGNob2ljZS4gSXQncyBhbHNvIGp1c3QgYXMgZmFzdC5cblxuICAgIGNvbnN0IHNwbGl0bWl4MzIgPSBmdW5jdGlvbiAoIGEgKSB7XG4gICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICBhIHw9IDA7XG4gICAgICAgYSA9IGEgKyAweDllMzc3OWI5IHwgMDtcbiAgICAgICBsZXQgdCA9IGEgXiBhID4+PiAxNjtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4MjFmMGFhYWQpO1xuICAgICAgIHQgPSB0IF4gdCA+Pj4gMTU7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDczNWEyZDk3KTtcbiAgICAgICByZXR1cm4gKCh0ID0gdCBeIHQgPj4+IDE1KSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnN0IHBybmcgPSBzcGxpdG1peDMyKChNYXRoLnJhbmRvbSgpKjIqKjMyKT4+PjApXG4gICAgLy8gZm9yKGxldCBpPTA7IGk8MTA7IGkrKykgY29uc29sZS5sb2cocHJuZygpKTtcbiAgICAvL1xuICAgIC8vIEkgd291bGQgcmVjb21tZW5kIHRoaXMgaWYgeW91IGp1c3QgbmVlZCBhIHNpbXBsZSBidXQgZ29vZCBQUk5HIGFuZCBkb24ndCBuZWVkIGJpbGxpb25zIG9mIHJhbmRvbVxuICAgIC8vIG51bWJlcnMgKHNlZSBCaXJ0aGRheSBwcm9ibGVtKS5cbiAgICAvL1xuICAgIC8vIE5vdGU6IEl0IGRvZXMgaGF2ZSBvbmUgcG90ZW50aWFsIGNvbmNlcm46IGl0IGRvZXMgbm90IHJlcGVhdCBwcmV2aW91cyBudW1iZXJzIHVudGlsIHlvdSBleGhhdXN0IDQuM1xuICAgIC8vIGJpbGxpb24gbnVtYmVycyBhbmQgaXQgcmVwZWF0cyBhZ2Fpbi4gV2hpY2ggbWF5IG9yIG1heSBub3QgYmUgYSBzdGF0aXN0aWNhbCBjb25jZXJuIGZvciB5b3VyIHVzZVxuICAgIC8vIGNhc2UuIEl0J3MgbGlrZSBhIGxpc3Qgb2YgcmFuZG9tIG51bWJlcnMgd2l0aCB0aGUgZHVwbGljYXRlcyByZW1vdmVkLCBidXQgd2l0aG91dCBhbnkgZXh0cmEgd29ya1xuICAgIC8vIGludm9sdmVkIHRvIHJlbW92ZSB0aGVtLiBBbGwgb3RoZXIgZ2VuZXJhdG9ycyBpbiB0aGlzIGxpc3QgZG8gbm90IGV4aGliaXQgdGhpcyBiZWhhdmlvci5cbiAgICBgYGBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBpbnRlcm5hbHMuU3RhdHNcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoeyBuYW1lLCBvbl9leGhhdXN0aW9uID0gJ2Vycm9yJywgb25fc3RhdHMgPSBudWxsLCBtYXhfcm91bmRzID0gbnVsbCB9KSAtPlxuICAgICAgICBAbmFtZSAgICAgICAgICAgICAgICAgICA9IG5hbWVcbiAgICAgICAgQG1heF9yb3VuZHMgICAgICAgICAgICA9IG1heF9yb3VuZHMgPyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcubWF4X3JvdW5kc1xuICAgICAgICBvbl9leGhhdXN0aW9uICAgICAgICAgID89ICdlcnJvcidcbiAgICAgICAgaGlkZSBALCAnX2ZpbmlzaGVkJywgICAgICBmYWxzZVxuICAgICAgICBoaWRlIEAsICdfcm91bmRzJywgICAgICAgIDBcbiAgICAgICAgaGlkZSBALCAnb25fZXhoYXVzdGlvbicsICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gb25fZXhoYXVzdGlvbiAgICAgICAgICAgIGlzICdlcnJvcicgICAgdGhlbiAtPiB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzEgZXhoYXVzdGVkXCJcbiAgICAgICAgICB3aGVuIG9uX2V4aGF1c3Rpb24gICAgICAgICAgICBpcyAnc3RvcCcgICAgIHRoZW4gLT4gZG9udF9nb19vblxuICAgICAgICAgIHdoZW4gKCB0eXBlb2Ygb25fZXhoYXVzdGlvbiApIGlzICdmdW5jdGlvbicgdGhlbiBvbl9leGhhdXN0aW9uXG4gICAgICAgICAgIyMjIFRBSU5UIHVzZSBycHIsIHR5cGluZyAjIyNcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fMiBpbGxlZ2FsIHZhbHVlIGZvciBvbl9leGhhdXN0aW9uOiAje29uX2V4aGF1c3Rpb259XCJcbiAgICAgICAgaGlkZSBALCAnb25fc3RhdHMnLCAgICAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gKCB0eXBlb2Ygb25fc3RhdHMgKSBpcyAnZnVuY3Rpb24nICB0aGVuIG9uX3N0YXRzXG4gICAgICAgICAgd2hlbiAoIG5vdCBvbl9zdGF0cz8gKSAgICAgICAgICAgICAgICAgIHRoZW4gbnVsbFxuICAgICAgICAgICMjIyBUQUlOVCB1c2UgcnByLCB0eXBpbmcgIyMjXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzMgaWxsZWdhbCB2YWx1ZSBmb3Igb25fc3RhdHM6ICN7b25fc3RhdHN9XCJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcmV0cnk6IC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBzdGF0cyBoYXMgYWxyZWFkeSBmaW5pc2hlZFwiIGlmIEBfZmluaXNoZWRcbiAgICAgICAgQF9yb3VuZHMrK1xuICAgICAgICByZXR1cm4gQG9uX2V4aGF1c3Rpb24oKSBpZiBAZXhoYXVzdGVkXG4gICAgICAgIHJldHVybiBnb19vblxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmluaXNoOiAoIFIgKSAtPlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgc3RhdHMgaGFzIGFscmVhZHkgZmluaXNoZWRcIiBpZiBAX2ZpbmlzaGVkXG4gICAgICAgIEBfZmluaXNoZWQgPSB0cnVlXG4gICAgICAgIEBvbl9zdGF0cyB7IG5hbWU6IEBuYW1lLCByb3VuZHM6IEByb3VuZHMsIFIsIH0gaWYgQG9uX3N0YXRzP1xuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdmaW5pc2hlZCcsICAgLT4gQF9maW5pc2hlZFxuICAgICAgc2V0X2dldHRlciBAOjosICdyb3VuZHMnLCAgICAtPiBAX3JvdW5kc1xuICAgICAgc2V0X2dldHRlciBAOjosICdleGhhdXN0ZWQnLCAgLT4gQF9yb3VuZHMgPiBAbWF4X3JvdW5kc1xuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEdldF9yYW5kb21cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBnZXRfcmFuZG9tX3NlZWQ6IC0+ICggTWF0aC5yYW5kb20oKSAqIDIgKiogMzIgKSA+Pj4gMFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgQGNmZyAgICAgICAgPSB7IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEBjZmcuc2VlZCAgPz0gQGNvbnN0cnVjdG9yLmdldF9yYW5kb21fc2VlZCgpXG4gICAgICAgIGhpZGUgQCwgJ19mbG9hdCcsIHNwbGl0bWl4MzIgQGNmZy5zZWVkXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBJTlRFUk5BTFNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfbmV3X3N0YXRzOiAoIGNmZyApIC0+XG4gICAgICAgIHJldHVybiBuZXcgaW50ZXJuYWxzLlN0YXRzIHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5fbmV3X3N0YXRzLi4uLCAoIGNsZWFuIEBjZmcgKS4uLiwgY2ZnLi4uLCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X21pbl9tYXhfbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIGlmIG1pbl9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aCwgbWF4X2xlbmd0aDogKCBtYXhfbGVuZ3RoID8gbWluX2xlbmd0aCAqIDIgKSwgfVxuICAgICAgICBlbHNlIGlmIG1heF9sZW5ndGg/XG4gICAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogKCBtaW5fbGVuZ3RoID8gMSApLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6IGxlbmd0aCwgbWF4X2xlbmd0aDogbGVuZ3RoLCB9IGlmIGxlbmd0aD9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX182IG11c3Qgc2V0IGF0IGxlYXN0IG9uZSBvZiBgbGVuZ3RoYCwgYG1pbl9sZW5ndGhgLCBgbWF4X2xlbmd0aGBcIlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9yYW5kb21fbGVuZ3RoOiAoeyBsZW5ndGggPSAxLCBtaW5fbGVuZ3RoID0gbnVsbCwgbWF4X2xlbmd0aCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIG1pbl9sZW5ndGggaWYgbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoICMjIyBOT1RFIGRvbmUgdG8gYXZvaWQgY2hhbmdpbmcgUFJORyBzdGF0ZSAjIyNcbiAgICAgICAgcmV0dXJuIEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heDogKHsgbWluID0gbnVsbCwgbWF4ID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgbWluICA9IG1pbi5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1pbiApIGlzICdzdHJpbmcnXG4gICAgICAgIG1heCAgPSBtYXguY29kZVBvaW50QXQgMCBpZiAoIHR5cGVvZiBtYXggKSBpcyAnc3RyaW5nJ1xuICAgICAgICBtaW4gPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMCBdXG4gICAgICAgIG1heCA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAxIF1cbiAgICAgICAgcmV0dXJuIHsgbWluLCBtYXgsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfZmlsdGVyOiAoIGZpbHRlciApIC0+XG4gICAgICAgIHJldHVybiAoICggeCApIC0+IHRydWUgICAgICAgICAgICApIHVubGVzcyBmaWx0ZXI/XG4gICAgICAgIHJldHVybiAoIGZpbHRlciAgICAgICAgICAgICAgICAgICApIGlmICggdHlwZW9mIGZpbHRlciApIGlzICdmdW5jdGlvbidcbiAgICAgICAgcmV0dXJuICggKCB4ICkgLT4gZmlsdGVyLnRlc3QgeCAgICkgaWYgZmlsdGVyIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgICAgICMjIyBUQUlOVCB1c2UgYHJwcmAsIHR5cGluZyAjIyNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX183IHVuYWJsZSB0byB0dXJuIGFyZ3VtZW50IGludG8gYSBmaWx0ZXI6ICN7YXJndW1lbnR9XCJcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBDT05WRU5JRU5DRVxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMgZmxvYXQ6ICAgICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICMgaW50ZWdlcjogICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IE1hdGgucm91bmQgQGZsb2F0IHsgbWluLCBtYXgsIH1cbiAgICAgIGZsb2F0OiAgICAoIFAuLi4gKSAtPiAoIEBmbG9hdF9wcm9kdWNlciAgIFAuLi4gKSgpXG4gICAgICBpbnRlZ2VyOiAgKCBQLi4uICkgLT4gKCBAaW50ZWdlcl9wcm9kdWNlciBQLi4uICkoKVxuICAgICAgY2hyOiAgICAgICggUC4uLiApIC0+ICggQGNocl9wcm9kdWNlciAgICAgUC4uLiApKClcbiAgICAgIHRleHQ6ICAgICAoIFAuLi4gKSAtPiAoIEB0ZXh0X3Byb2R1Y2VyICAgIFAuLi4gKSgpXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgUFJPRFVDRVJTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXRfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gZmxvYXQgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnZmxvYXQnLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIGZpbHRlciBSIClcbiAgICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgaW50ZWdlcl9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcywgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmZsb2F0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBpbnRlZ2VyID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ2ludGVnZXInLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gTWF0aC5yb3VuZCBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjaHJfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGNhY2hlIHJlc3VsdCAjIyNcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIHByZWZpbHRlcixcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzLCAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuY2hyX3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcHJlZmlsdGVyICAgICAgICAgPSBAX2dldF9maWx0ZXIgcHJlZmlsdGVyXG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGNociA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdjaHInLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gU3RyaW5nLmZyb21Db2RlUG9pbnQgQGludGVnZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIHByZWZpbHRlciBSICkgYW5kICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB0ZXh0X3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgICMjIyBUQUlOVCBjb25zaWRlciB0byBjYWNoZSByZXN1bHQgIyMjXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMgICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy50ZXh0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiB0ZXh0ID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3RleHQnLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsZW5ndGggPSBAaW50ZWdlciB7IG1pbjogbWluX2xlbmd0aCwgbWF4OiBtYXhfbGVuZ3RoLCB9IHVubGVzcyBsZW5ndGhfaXNfY29uc3RcbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gKCBAY2hyIHsgbWluLCBtYXgsIH0gZm9yIF8gaW4gWyAxIC4uIGxlbmd0aCBdICkuam9pbiAnJ1xuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIGZpbHRlciBSIClcbiAgICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFNFVFNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfb2ZfY2hyczogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgc2l6ZSxcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5zZXRfb2ZfY2hycy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnc2V0X29mX2NocnMnLCBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfVxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICBwcm9kdWNlciAgICAgICAgICA9IEBjaHJfcHJvZHVjZXIgeyBtaW4sIG1heCwgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgUiAgICAgICAgICAgICAgICAgPSBuZXcgU2V0KClcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvciBjaHIgZnJvbSBAd2Fsa191bmlxdWUgeyBwcm9kdWNlciwgbjogc2l6ZSwgc2VlbjogUiwgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgICBudWxsXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl90ZXh0czogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgIHNpemUsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5zZXRfb2ZfdGV4dHMuLi4sIGNmZy4uLiwgfVxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgICB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgbGVuZ3RoX2lzX2NvbnN0ICAgPSBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGhcbiAgICAgICAgbGVuZ3RoICAgICAgICAgICAgPSBtaW5fbGVuZ3RoXG4gICAgICAgIFIgICAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgIHByb2R1Y2VyICAgICAgICAgID0gQHRleHRfcHJvZHVjZXIgeyBtaW4sIG1heCwgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCBmaWx0ZXIsIH1cbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdzZXRfb2ZfdGV4dHMnLCBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfVxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm9yIHRleHQgZnJvbSBAd2Fsa191bmlxdWUgeyBwcm9kdWNlciwgbjogc2l6ZSwgc2VlbjogUiwgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgICBudWxsXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSIClcblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgV0FMS0VSU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHdhbGs6ICggY2ZnICkgLT5cbiAgICAgICAgeyBwcm9kdWNlcixcbiAgICAgICAgICBuLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLndhbGsuLi4sIGNmZy4uLiwgfVxuICAgICAgICBjb3VudCAgICAgICAgICAgICA9IDBcbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd3YWxrJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgbG9vcFxuICAgICAgICAgIGNvdW50Kys7IGJyZWFrIGlmIGNvdW50ID4gblxuICAgICAgICAgIHlpZWxkIHByb2R1Y2VyKClcbiAgICAgICAgICAjIyMgTk9ERSBhbnkgZmlsdGVyaW5nICZjIGhhcHBlbnMgaW4gcHJvZHVjZXIgc28gbm8gZXh0cmFuZW91cyByb3VuZHMgYXJlIGV2ZXIgbWFkZSBieSBgd2FsaygpYCxcbiAgICAgICAgICB0aGVyZWZvcmUgdGhlIGByb3VuZHNgIGluIHRoZSBgd2Fsa2Agc3RhdHMgb2JqZWN0IGFsd2F5cyByZW1haW5zIGAwYCAjIyNcbiAgICAgICAgICAjIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3YWxrX3VuaXF1ZTogKCBjZmcgKSAtPlxuICAgICAgICB7IHByb2R1Y2VyLFxuICAgICAgICAgIHNlZW4sXG4gICAgICAgICAgcHVydmlldyxcbiAgICAgICAgICBuLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLndhbGtfdW5pcXVlLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgc2VlbiAgICAgICAgICAgICA/PSBuZXcgU2V0KClcbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd3YWxrX3VuaXF1ZScsIG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9XG4gICAgICAgIGNvdW50ICAgICAgICAgICAgID0gMFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbG9vcFxuICAgICAgICAgIHRyaW1fc2V0IHNlZW4sIHB1cnZpZXdcbiAgICAgICAgICBvbGRfc2l6ZSA9IHNlZW4uc2l6ZVxuICAgICAgICAgIHNlZW4uYWRkICggWSA9IHByb2R1Y2VyKCkgKVxuICAgICAgICAgIGlmIHNlZW4uc2l6ZSA+IG9sZF9zaXplXG4gICAgICAgICAgICB5aWVsZCBZXG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgICAgICBicmVhayBpZiBjb3VudCA+PSBuXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIGNvbnRpbnVlIGlmICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICBpZiBzZW50aW5lbCBpcyBkb250X2dvX29uXG4gICAgICAgICAgICBzZW50aW5lbCA9IG51bGxcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBzZW50aW5lbCApXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFNIVUZGTEVcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIHNodWZmbGU6ICggbGlzdCwgcmF0aW8gPSAxICkgLT5cbiAgICAgICMgICAjIyMgU2h1ZmZsZXMgdGhlIGVsZW1lbnRzIG9mIGEgbGlzdCByYW5kb21seS4gQWZ0ZXIgdGhlIGNhbGwsIHRoZSBlbGVtZW50cyBvZiB3aWxsIGJl4oCUbW9zdCBvZiB0aGVcbiAgICAgICMgICB0aW1l4oCUcmVvcmRlcmVkIChidXQgdGhpcyBpcyBub3QgZ3VhcmFudGVlZCwgYXMgdGhlcmUgaXMgYSByZWFsaXN0aWMgcHJvYmFiaWxpdHkgZm9yIHJlY3VycmVuY2VcbiAgICAgICMgICBvZiBvcmRlcmluZ3Mgd2l0aCBzaG9ydCBsaXN0cykuXG5cbiAgICAgICMgICBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSByZW5vd25lZCBGaXNoZXItWWF0ZXMgYWxnb3JpdGhtLCBidXQgd2l0aCBhIHR3aXN0OiBZb3UgbWF5IHBhc3MgaW5cbiAgICAgICMgICBhIGByYXRpb2AgYXMgc2Vjb25kIGFyZ3VtZW50ICh3aGljaCBzaG91bGQgYmUgYSBmbG9hdCBpbiB0aGUgcmFuZ2UgYDAgPD0gcmF0aW8gPD0gMWApOyBpZiBzZXQgdG8gYVxuICAgICAgIyAgIHZhbHVlIGxlc3MgdGhhbiBvbmUsIGEgcmFuZG9tIG51bWJlciB3aWxsIGJlIHVzZWQgdG8gZGVjaWRlIHdoZXRoZXIgb3Igbm90IHRvIHBlcmZvcm0gYSBnaXZlbiBzdGVwXG4gICAgICAjICAgaW4gdGhlIHNodWZmbGluZyBwcm9jZXNzLCBzbyBsaXN0cyBzaHVmZmxlZCB3aXRoIHplcm8taXNoIHJhdGlvcyB3aWxsIHNob3cgbGVzcyBkaXNvcmRlciB0aGFuIGxpc3RzXG4gICAgICAjICAgc2h1ZmZsZWQgd2l0aCBhIG9uZS1pc2ggcmF0aW8uXG5cbiAgICAgICMgICBJbXBsZW1lbnRhdGlvbiBnbGVhbmVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTYyODkwLzI1NjM2MS4gIyMjXG4gICAgICAjICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgIyAgIHJldHVybiBsaXN0IGlmICggdGhpc19pZHggPSBsaXN0Lmxlbmd0aCApIDwgMlxuICAgICAgIyAgIHJldHVybiBAX3NodWZmbGUgbGlzdCwgcmF0aW8gIywgTWF0aC5yYW5kb20sIEByYW5kb21faW50ZWdlci5iaW5kIEBcblxuICAgICAgIyAjICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyAjIGdldF9zaHVmZmxlOiAoIHNlZWRfMCA9IDAsIHNlZWRfMSA9IDEgKSAtPlxuICAgICAgIyAjICAgIyMjIFRoaXMgbWV0aG9kIHdvcmtzIHNpbWlsYXIgdG8gYGdldF9ybmRgOyBpdCBhY2NlcHRzIHR3byBgc2VlZGBzIHdoaWNoIGFyZSB1c2VkIHRvIHByb2R1Y2UgcmFuZG9tIG51bWJlclxuICAgICAgIyAjICAgZ2VuZXJhdG9ycyBhbmQgcmV0dXJucyBhIHByZWRpY3RhYmxlIHNodWZmbGluZyBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYXJndW1lbnRzIGxpa2UgQml0cydOJ1BpZWNlc1xuICAgICAgIyAjICAgYHNodWZmbGVgLiAjIyNcbiAgICAgICMgIyAgIHJuZCAgICAgICAgICAgICA9IEBnZXRfcm5kICAgICAgc2VlZF8wXG4gICAgICAjICMgICByYW5kb21faW50ZWdlciAgPSBAZ2V0X3JuZF9pbnQgIHNlZWRfMVxuICAgICAgIyAjICAgcmV0dXJuICggbGlzdCwgcmF0aW8gPSAxICkgPT4gQF9zaHVmZmxlIGxpc3QsIHJhdGlvLCBybmQsIHJhbmRvbV9pbnRlZ2VyXG5cbiAgICAgICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIF9zaHVmZmxlOiAoIGxpc3QsIHJhdGlvLCBybmQgPSBudWxsLCByYW5kb21faW50ZWdlciA9IG51bGwgKSAtPlxuICAgICAgIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMgICByZXR1cm4gbGlzdCBpZiAoIHRoaXNfaWR4ID0gbGlzdC5sZW5ndGggKSA8IDJcbiAgICAgICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAjICAgcm5kICAgICAgICAgICAgID0gPT4gQGZsb2F0KClcbiAgICAgICMgICByYW5kb21faW50ZWdlciAgPSAoIG1pbiwgbWF4ICkgPT4gQGludGVnZXIgbWluLCBtYXhcbiAgICAgICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAjICAgbG9vcFxuICAgICAgIyAgICAgdGhpc19pZHggKz0gLTFcbiAgICAgICMgICAgIHJldHVybiBsaXN0IGlmIHRoaXNfaWR4IDwgMVxuICAgICAgIyAgICAgaWYgcmF0aW8gPj0gMSBvciBybmQoKSA8PSByYXRpb1xuICAgICAgIyAgICAgICAjIHJldHVybiBsaXN0IGlmIHRoaXNfaWR4IDwgMVxuICAgICAgIyAgICAgICB0aGF0X2lkeCA9IHJhbmRvbV9pbnRlZ2VyIDAsIHRoaXNfaWR4XG4gICAgICAjICAgICAgIFsgbGlzdFsgdGhhdF9pZHggXSwgbGlzdFsgdGhpc19pZHggXSBdID0gWyBsaXN0WyB0aGlzX2lkeCBdLCBsaXN0WyB0aGF0X2lkeCBdIF1cbiAgICAgICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAjICAgcmV0dXJuIGxpc3RcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaHVmZmxlOiAoIGxpc3QsIGZhY3RvciA9IDEgKSAtPlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBsaXN0IGlmICggdGhpc19pZHggPSBsaXN0Lmxlbmd0aCApIDwgMlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGdldF9yYW5kb21faWR4ICA9IEBpbnRlZ2VyX3Byb2R1Y2VyIHsgbWluOiAwLCBtYXg6IGxpc3QubGVuZ3RoIC0gMSwgfVxuICAgICAgICBtYXhfY291bnQgICAgICAgPSBNYXRoLmNlaWwgbGlzdC5sZW5ndGggKiBmYWN0b3JcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb3IgY291bnQgaW4gWyAxIC4uIG1heF9jb3VudCBdXG4gICAgICAgICAgdGhpc19pZHggPSBnZXRfcmFuZG9tX2lkeCgpXG4gICAgICAgICAgdGhhdF9pZHggPSBnZXRfcmFuZG9tX2lkeCgpXG4gICAgICAgICAgWyBsaXN0WyB0aGF0X2lkeCBdLCBsaXN0WyB0aGlzX2lkeCBdLCBdID0gWyBsaXN0WyB0aGlzX2lkeCBdLCBsaXN0WyB0aGF0X2lkeCBdLCBdXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGxpc3RcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgaW50ZXJuYWxzXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEdldF9yYW5kb20sIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgVU5TVEFCTEVfR0VUUkFORE9NX0JSSUNTXG5cbiJdfQ==
