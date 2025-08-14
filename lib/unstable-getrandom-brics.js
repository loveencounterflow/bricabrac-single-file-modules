(function() {
  'use strict';
  var UNSTABLE_GETRANDOM_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_GETRANDOM_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_random_tools: function() {
      var Get_random, chr_re, clean, exports, go_on, hide, internals, max_rounds, set_getter;
      ({hide, set_getter} = (require('./various-brics')).require_managed_property_tools());
      /* TAINT replace */
      // { default: _get_unique_text,  } = require 'unique-string'
      chr_re = /^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$/v;
      // max_rounds = 9_999
      max_rounds = 1_000;
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
          var Y, n, old_size, on_exhaustion, on_stats, producer, seen, sentinel, stats, window;
          ({producer, seen, window, n, on_stats, on_exhaustion, max_rounds} = {...internals.templates.walk, ...cfg});
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWdldHJhbmRvbS1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7Ozs7O0VBS0Esd0JBQUEsR0FLRSxDQUFBOzs7O0lBQUEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBO01BQUksQ0FBQSxDQUFFLElBQUYsRUFDRSxVQURGLENBQUEsR0FDa0MsQ0FBRSxPQUFBLENBQVEsaUJBQVIsQ0FBRixDQUE2QixDQUFDLDhCQUE5QixDQUFBLENBRGxDLEVBQUo7OztNQUlJLE1BQUEsR0FBYyxvREFKbEI7O01BTUksVUFBQSxHQUFjO01BQ2QsS0FBQSxHQUFjLE1BQUEsQ0FBTyxPQUFQO01BQ2QsS0FBQSxHQUFjLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFBUSxZQUFBLENBQUEsRUFBQTtlQUFDLE1BQU0sQ0FBQyxXQUFQOztBQUFxQjtVQUFBLEtBQUEsTUFBQTs7Z0JBQTZCOzJCQUE3QixDQUFFLENBQUYsRUFBSyxDQUFMOztVQUFBLENBQUE7O1lBQXJCO01BQVQsRUFSbEI7O01BV0ksU0FBQSxHQUNFLENBQUE7UUFBQSxNQUFBLEVBQW9CLE1BQXBCO1FBQ0EsVUFBQSxFQUFvQixVQURwQjtRQUVBLEtBQUEsRUFBb0IsS0FGcEI7UUFHQSxLQUFBLEVBQW9CLEtBSHBCOztRQUtBLFNBQUEsRUFBVyxNQUFNLENBQUMsTUFBUCxDQUNUO1VBQUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLE1BQVAsQ0FDaEI7WUFBQSxJQUFBLEVBQW9CLElBQXBCO1lBQ0EsVUFBQSxFQUFvQixVQURwQjs7WUFHQSxRQUFBLEVBQW9CLElBSHBCO1lBSUEsaUJBQUEsRUFBb0IsTUFBTSxDQUFD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QUE7O1VBQ3BCLEtBQUEsR0FBb0IsSUFBQyxDQUFBLFVBQUQsQ0FBWTtZQUFFLElBQUEsRUFBTSxhQUFSO1lBQXVCLFFBQXZCO1lBQWlDLGFBQWpDO1lBQWdEO1VBQWhELENBQVo7VUFDcEIsUUFBQSxHQUFvQixJQUFJLENBQUM7QUFDekIsaUJBQUEsSUFBQTtZQUNFLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxHQUFLLFFBQUEsQ0FBQSxDQUFkO1lBQ0EsSUFBVyxJQUFJLENBQUMsSUFBTCxHQUFZLFFBQXZCO2NBQUEsTUFBTSxFQUFOOztZQUNBLFFBQUEsR0FBYyxJQUFJLENBQUM7WUFDbkIsSUFBUyxJQUFJLENBQUMsSUFBTCxJQUFhLENBQXRCO0FBQUEsb0JBQUE7O1lBRUEsSUFBWSxDQUFFLFFBQUEsR0FBVyxLQUFLLENBQUMsS0FBTixDQUFBLENBQWIsQ0FBQSxLQUFnQyxLQUE1Qzs7QUFBQSx1QkFBQTs7WUFDQSxJQUFzQixhQUFBLEtBQWlCLE1BQXZDO2NBQUEsTUFBTSxTQUFOOztVQVBGO0FBUUEsaUJBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxJQUFiO1FBbkJFOztNQS9PZixFQWxKSjs7TUF3WkksU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtBQUNaLGFBQU8sT0FBQSxHQUFVLENBQUUsVUFBRixFQUFjLFNBQWQ7SUExWkc7RUFBdEIsRUFWRjs7O0VBd2FBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLHdCQUE5QjtBQXhhQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfR0VUUkFORE9NX0JSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfcmFuZG9tX3Rvb2xzOiAtPlxuICAgIHsgaGlkZSxcbiAgICAgIHNldF9nZXR0ZXIsICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICAjIyMgVEFJTlQgcmVwbGFjZSAjIyNcbiAgICAjIHsgZGVmYXVsdDogX2dldF91bmlxdWVfdGV4dCwgIH0gPSByZXF1aXJlICd1bmlxdWUtc3RyaW5nJ1xuICAgIGNocl9yZSAgICAgID0gLy8vXig/OlxccHtMfXxcXHB7WnN9fFxccHtafXxcXHB7TX18XFxwe059fFxccHtQfXxcXHB7U30pJC8vL3ZcbiAgICAjIG1heF9yb3VuZHMgPSA5Xzk5OVxuICAgIG1heF9yb3VuZHMgID0gMV8wMDBcbiAgICBnb19vbiAgICAgICA9IFN5bWJvbCAnZ29fb24nXG4gICAgY2xlYW4gICAgICAgPSAoIHggKSAtPiBPYmplY3QuZnJvbUVudHJpZXMgKCBbIGssIHYsIF0gZm9yIGssIHYgb2YgeCB3aGVuIHY/IClcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSAjIE9iamVjdC5mcmVlemVcbiAgICAgIGNocl9yZTogICAgICAgICAgICAgY2hyX3JlXG4gICAgICBtYXhfcm91bmRzOiAgICAgICAgIG1heF9yb3VuZHNcbiAgICAgIGdvX29uOiAgICAgICAgICAgICAgZ29fb25cbiAgICAgIGNsZWFuOiAgICAgICAgICAgICAgY2xlYW5cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB0ZW1wbGF0ZXM6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcmFuZG9tX3Rvb2xzX2NmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICAgIHNlZWQ6ICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG1heF9yb3VuZHM6ICAgICAgICAgbWF4X3JvdW5kc1xuICAgICAgICAgICMgdW5pcXVlX2NvdW50OiAgIDFfMDAwXG4gICAgICAgICAgb25fc3RhdHM6ICAgICAgICAgICBudWxsXG4gICAgICAgICAgdW5pY29kZV9jaWRfcmFuZ2U6ICBPYmplY3QuZnJlZXplIFsgMHgwMDAwLCAweDEwZmZmZiBdXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIGludF9wcm9kdWNlcjpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgZmxvYXRfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIGNocl9wcm9kdWNlcjpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIHByZWZpbHRlcjogICAgICAgICAgY2hyX3JlXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHRleHRfcHJvZHVjZXI6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBsZW5ndGg6ICAgICAgICAgICAgIDFcbiAgICAgICAgICBzaXplOiAgICAgICAgICAgICAgIDJcbiAgICAgICAgICBtaW5fbGVuZ3RoOiAgICAgICAgIG51bGxcbiAgICAgICAgICBtYXhfbGVuZ3RoOiAgICAgICAgIG51bGxcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgc2V0X29mX2NocnM6XG4gICAgICAgICAgbWluOiAgICAgICAgICAgICAgICAweDAwMDAwMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMHgxMGZmZmZcbiAgICAgICAgICBzaXplOiAgICAgICAgICAgICAgIDJcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgc3RhdHM6XG4gICAgICAgICAgZmxvYXQ6XG4gICAgICAgICAgICByb3VuZHM6ICAgICAgICAgIC0xXG4gICAgICAgICAgaW50ZWdlcjpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICBjaHI6XG4gICAgICAgICAgICByb3VuZHM6ICAgICAgICAgIC0xXG4gICAgICAgICAgdGV4dDpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICBzZXRfb2ZfY2hyczpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICBzZXRfb2ZfdGV4dHM6XG4gICAgICAgICAgICByb3VuZHM6ICAgICAgICAgIC0xXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYGBgXG4gICAgLy8gdGh4IHRvIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NzU5MzMxNi83NTY4MDkxXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTIxMjk1L3NlZWRpbmctdGhlLXJhbmRvbS1udW1iZXItZ2VuZXJhdG9yLWluLWphdmFzY3JpcHRcblxuICAgIC8vIFNwbGl0TWl4MzJcblxuICAgIC8vIEEgMzItYml0IHN0YXRlIFBSTkcgdGhhdCB3YXMgbWFkZSBieSB0YWtpbmcgTXVybXVySGFzaDMncyBtaXhpbmcgZnVuY3Rpb24sIGFkZGluZyBhIGluY3JlbWVudG9yIGFuZFxuICAgIC8vIHR3ZWFraW5nIHRoZSBjb25zdGFudHMuIEl0J3MgcG90ZW50aWFsbHkgb25lIG9mIHRoZSBiZXR0ZXIgMzItYml0IFBSTkdzIHNvIGZhcjsgZXZlbiB0aGUgYXV0aG9yIG9mXG4gICAgLy8gTXVsYmVycnkzMiBjb25zaWRlcnMgaXQgdG8gYmUgdGhlIGJldHRlciBjaG9pY2UuIEl0J3MgYWxzbyBqdXN0IGFzIGZhc3QuXG5cbiAgICBjb25zdCBzcGxpdG1peDMyID0gZnVuY3Rpb24gKCBhICkge1xuICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgYSB8PSAwO1xuICAgICAgIGEgPSBhICsgMHg5ZTM3NzliOSB8IDA7XG4gICAgICAgbGV0IHQgPSBhIF4gYSA+Pj4gMTY7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDIxZjBhYWFkKTtcbiAgICAgICB0ID0gdCBeIHQgPj4+IDE1O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHg3MzVhMmQ5Nyk7XG4gICAgICAgcmV0dXJuICgodCA9IHQgXiB0ID4+PiAxNSkgPj4+IDApIC8gNDI5NDk2NzI5NjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zdCBwcm5nID0gc3BsaXRtaXgzMigoTWF0aC5yYW5kb20oKSoyKiozMik+Pj4wKVxuICAgIC8vIGZvcihsZXQgaT0wOyBpPDEwOyBpKyspIGNvbnNvbGUubG9nKHBybmcoKSk7XG4gICAgLy9cbiAgICAvLyBJIHdvdWxkIHJlY29tbWVuZCB0aGlzIGlmIHlvdSBqdXN0IG5lZWQgYSBzaW1wbGUgYnV0IGdvb2QgUFJORyBhbmQgZG9uJ3QgbmVlZCBiaWxsaW9ucyBvZiByYW5kb21cbiAgICAvLyBudW1iZXJzIChzZWUgQmlydGhkYXkgcHJvYmxlbSkuXG4gICAgLy9cbiAgICAvLyBOb3RlOiBJdCBkb2VzIGhhdmUgb25lIHBvdGVudGlhbCBjb25jZXJuOiBpdCBkb2VzIG5vdCByZXBlYXQgcHJldmlvdXMgbnVtYmVycyB1bnRpbCB5b3UgZXhoYXVzdCA0LjNcbiAgICAvLyBiaWxsaW9uIG51bWJlcnMgYW5kIGl0IHJlcGVhdHMgYWdhaW4uIFdoaWNoIG1heSBvciBtYXkgbm90IGJlIGEgc3RhdGlzdGljYWwgY29uY2VybiBmb3IgeW91ciB1c2VcbiAgICAvLyBjYXNlLiBJdCdzIGxpa2UgYSBsaXN0IG9mIHJhbmRvbSBudW1iZXJzIHdpdGggdGhlIGR1cGxpY2F0ZXMgcmVtb3ZlZCwgYnV0IHdpdGhvdXQgYW55IGV4dHJhIHdvcmtcbiAgICAvLyBpbnZvbHZlZCB0byByZW1vdmUgdGhlbS4gQWxsIG90aGVyIGdlbmVyYXRvcnMgaW4gdGhpcyBsaXN0IGRvIG5vdCBleGhpYml0IHRoaXMgYmVoYXZpb3IuXG4gICAgYGBgXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgaW50ZXJuYWxzLlN0YXRzXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKHsgbmFtZSwgb25fZXhoYXVzdGlvbiA9ICdlcnJvcicsIG9uX3N0YXRzID0gbnVsbCwgbWF4X3JvdW5kcyA9IG51bGwgfSkgLT5cbiAgICAgICAgQG5hbWUgICAgICAgICAgICAgICAgICAgPSBuYW1lXG4gICAgICAgIEBtYXhfcm91bmRzICAgICAgICAgICAgPSBtYXhfcm91bmRzID8gaW50ZXJuYWxzLnRlbXBsYXRlcy5yYW5kb21fdG9vbHNfY2ZnLm1heF9yb3VuZHNcbiAgICAgICAgb25fZXhoYXVzdGlvbiAgICAgICAgICA/PSAnZXJyb3InXG4gICAgICAgIGhpZGUgQCwgJ19maW5pc2hlZCcsICAgICAgZmFsc2VcbiAgICAgICAgaGlkZSBALCAnX3JvdW5kcycsICAgICAgICAwXG4gICAgICAgIGhpZGUgQCwgJ29uX2V4aGF1c3Rpb24nLCAgc3dpdGNoIHRydWVcbiAgICAgICAgICB3aGVuIG9uX2V4aGF1c3Rpb24gICAgICAgICAgICBpcyAnZXJyb3InICAgIHRoZW4gLT4gdGhyb3cgbmV3IEVycm9yIFwizqlfX180IGV4aGF1c3RlZFwiXG4gICAgICAgICAgd2hlbiAoIHR5cGVvZiBvbl9leGhhdXN0aW9uICkgaXMgJ2Z1bmN0aW9uJyB0aGVuIG9uX2V4aGF1c3Rpb25cbiAgICAgICAgICAjIyMgVEFJTlQgdXNlIHJwciwgdHlwaW5nICMjI1xuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IGlsbGVnYWwgdmFsdWUgZm9yIG9uX2V4aGF1c3Rpb246ICN7b25fZXhoYXVzdGlvbn1cIlxuICAgICAgICBoaWRlIEAsICdvbl9zdGF0cycsICAgICAgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiAoIHR5cGVvZiBvbl9zdGF0cyApIGlzICdmdW5jdGlvbicgIHRoZW4gb25fc3RhdHNcbiAgICAgICAgICB3aGVuICggbm90IG9uX3N0YXRzPyApICAgICAgICAgICAgICAgICAgdGhlbiBudWxsXG4gICAgICAgICAgIyMjIFRBSU5UIHVzZSBycHIsIHR5cGluZyAjIyNcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNiBpbGxlZ2FsIHZhbHVlIGZvciBvbl9zdGF0czogI3tvbl9zdGF0c31cIlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByZXRyeTogLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX183IHN0YXRzIGhhcyBhbHJlYWR5IGZpbmlzaGVkXCIgaWYgQF9maW5pc2hlZFxuICAgICAgICBAX3JvdW5kcysrXG4gICAgICAgIHJldHVybiBAb25fZXhoYXVzdGlvbigpIGlmIEBleGhhdXN0ZWRcbiAgICAgICAgcmV0dXJuIGdvX29uXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmaW5pc2g6ICggUiApIC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fOCBzdGF0cyBoYXMgYWxyZWFkeSBmaW5pc2hlZFwiIGlmIEBfZmluaXNoZWRcbiAgICAgICAgQF9maW5pc2hlZCA9IHRydWVcbiAgICAgICAgQG9uX3N0YXRzIHsgbmFtZTogQG5hbWUsIHJvdW5kczogQHJvdW5kcywgUiwgfSBpZiBAb25fc3RhdHM/XG4gICAgICAgIHJldHVybiBSXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2ZpbmlzaGVkJywgICAtPiBAX2ZpbmlzaGVkXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3JvdW5kcycsICAgIC0+IEBfcm91bmRzXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2V4aGF1c3RlZCcsICAtPiBAX3JvdW5kcyA+IEBtYXhfcm91bmRzXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgR2V0X3JhbmRvbVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGdldF9yYW5kb21fc2VlZDogLT4gKCBNYXRoLnJhbmRvbSgpICogMiAqKiAzMiApID4+PiAwXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBAY2ZnICAgICAgICA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5yYW5kb21fdG9vbHNfY2ZnLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgQGNmZy5zZWVkICA/PSBAY29uc3RydWN0b3IuZ2V0X3JhbmRvbV9zZWVkKClcbiAgICAgICAgaGlkZSBALCAnX2Zsb2F0Jywgc3BsaXRtaXgzMiBAY2ZnLnNlZWRcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIElOVEVSTkFMU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9uZXdfc3RhdHM6ICggY2ZnICkgLT5cbiAgICAgICAgcmV0dXJuIG5ldyBpbnRlcm5hbHMuU3RhdHMgeyBpbnRlcm5hbHMudGVtcGxhdGVzLl9uZXdfc3RhdHMuLi4sICggY2xlYW4gQGNmZyApLi4uLCBjZmcuLi4sIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heF9sZW5ndGg6ICh7IGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgaWYgbWluX2xlbmd0aD9cbiAgICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoOiAoIG1heF9sZW5ndGggPyBtaW5fbGVuZ3RoICogMiApLCB9XG4gICAgICAgIGVsc2UgaWYgbWF4X2xlbmd0aD9cbiAgICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoOiAoIG1pbl9sZW5ndGggPyAxICksIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogbGVuZ3RoLCBtYXhfbGVuZ3RoOiBsZW5ndGgsIH0gaWYgbGVuZ3RoP1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fMTIgbXVzdCBzZXQgYXQgbGVhc3Qgb25lIG9mIGBsZW5ndGhgLCBgbWluX2xlbmd0aGAsIGBtYXhfbGVuZ3RoYFwiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X3JhbmRvbV9sZW5ndGg6ICh7IGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4gbWluX2xlbmd0aCBpZiBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGggIyMjIE5PVEUgZG9uZSB0byBhdm9pZCBjaGFuZ2luZyBQUk5HIHN0YXRlICMjI1xuICAgICAgICByZXR1cm4gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4OiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBtaW4gID0gbWluLmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWluICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWF4ICA9IG1heC5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1heCApIGlzICdzdHJpbmcnXG4gICAgICAgIG1pbiA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAwIF1cbiAgICAgICAgbWF4ID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDEgXVxuICAgICAgICByZXR1cm4geyBtaW4sIG1heCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9maWx0ZXI6ICggZmlsdGVyICkgLT5cbiAgICAgICAgcmV0dXJuICggKCB4ICkgLT4gdHJ1ZSAgICAgICAgICAgICkgdW5sZXNzIGZpbHRlcj9cbiAgICAgICAgcmV0dXJuICggZmlsdGVyICAgICAgICAgICAgICAgICAgICkgaWYgKCB0eXBlb2YgZmlsdGVyICkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgICByZXR1cm4gKCAoIHggKSAtPiBmaWx0ZXIudGVzdCB4ICAgKSBpZiBmaWx0ZXIgaW5zdGFuY2VvZiBSZWdFeHBcbiAgICAgICAgIyMjIFRBSU5UIHVzZSBgcnByYCwgdHlwaW5nICMjI1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fMTMgdW5hYmxlIHRvIHR1cm4gYXJndW1lbnQgaW50byBhIGZpbHRlcjogI3thcmd1bWVudH1cIlxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIENPTlZFTklFTkNFXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyBmbG9hdDogICAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgIyBpbnRlZ2VyOiAgKHsgbWluID0gMCwgbWF4ID0gMSwgfT17fSkgLT4gTWF0aC5yb3VuZCBAZmxvYXQgeyBtaW4sIG1heCwgfVxuICAgICAgZmxvYXQ6ICAgICggUC4uLiApIC0+ICggQGZsb2F0X3Byb2R1Y2VyICAgUC4uLiApKClcbiAgICAgIGludGVnZXI6ICAoIFAuLi4gKSAtPiAoIEBpbnRlZ2VyX3Byb2R1Y2VyIFAuLi4gKSgpXG4gICAgICBjaHI6ICAgICAgKCBQLi4uICkgLT4gKCBAY2hyX3Byb2R1Y2VyICAgICBQLi4uICkoKVxuICAgICAgdGV4dDogICAgICggUC4uLiApIC0+ICggQHRleHRfcHJvZHVjZXIgICAgUC4uLiApKClcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBQUk9EVUNFUlNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmbG9hdF9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcywgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmZsb2F0X3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBmbG9hdCA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdmbG9hdCcsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBpbnRlZ2VyX3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzLCAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuZmxvYXRfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGludGVnZXIgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnaW50ZWdlcicsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBNYXRoLnJvdW5kIG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNocl9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgY29uc2lkZXIgdG8gY2FjaGUgcmVzdWx0ICMjI1xuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgcHJlZmlsdGVyLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5jaHJfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwcmVmaWx0ZXIgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBwcmVmaWx0ZXJcbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gY2hyID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ2NocicsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBTdHJpbmcuZnJvbUNvZGVQb2ludCBAaW50ZWdlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggcHJlZmlsdGVyIFIgKSBhbmQgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRleHRfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGNhY2hlIHJlc3VsdCAjIyNcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnRleHRfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgICB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgbGVuZ3RoX2lzX2NvbnN0ICAgPSBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGhcbiAgICAgICAgbGVuZ3RoICAgICAgICAgICAgPSBtaW5fbGVuZ3RoXG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIHRleHQgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAndGV4dCcsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxlbmd0aCA9IEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH0gdW5sZXNzIGxlbmd0aF9pc19jb25zdFxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSAoIEBjaHIgeyBtaW4sIG1heCwgfSBmb3IgXyBpbiBbIDEgLi4gbGVuZ3RoIF0gKS5qb2luICcnXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgU0VUU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl9jaHJzOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcywgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnNldF9vZl9jaHJzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdzZXRfb2ZfY2hycycsIG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9XG4gICAgICAgIFIgICAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgIGNociAgICAgICAgICAgICAgID0gQGNocl9wcm9kdWNlciB7IG1pbiwgbWF4LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsb29wXG4gICAgICAgICAgUi5hZGQgY2hyKClcbiAgICAgICAgICBicmVhayBpZiBSLnNpemUgPj0gc2l6ZVxuICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfb2ZfdGV4dHM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzLCAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX3RleHRzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsICAgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIGxlbmd0aF9pc19jb25zdCAgID0gbWluX2xlbmd0aCBpcyBtYXhfbGVuZ3RoXG4gICAgICAgIGxlbmd0aCAgICAgICAgICAgID0gbWluX2xlbmd0aFxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICB0ZXh0ICAgICAgICAgICAgICA9IEB0ZXh0X3Byb2R1Y2VyIHsgbWluLCBtYXgsIGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgZmlsdGVyLCB9XG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnc2V0X29mX3RleHRzJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBSLmFkZCB0ZXh0KClcbiAgICAgICAgICBicmVhayBpZiBSLnNpemUgPj0gc2l6ZVxuICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgV0FMS0VSU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHdhbGs6ICggY2ZnICkgLT5cbiAgICAgICAgeyBwcm9kdWNlcixcbiAgICAgICAgICBuLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLndhbGsuLi4sIGNmZy4uLiwgfVxuICAgICAgICBjb3VudCAgICAgICAgICAgICA9IDBcbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd3YWxrJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgbG9vcFxuICAgICAgICAgIGNvdW50Kys7IGJyZWFrIGlmIGNvdW50ID4gblxuICAgICAgICAgIHlpZWxkIHByb2R1Y2VyKClcbiAgICAgICAgICAjIyMgTk9ERSBhbnkgZmlsdGVyaW5nICZjIGhhcHBlbnMgaW4gcHJvZHVjZXIgc28gbm8gZXh0cmFuZW91cyByb3VuZHMgYXJlIGV2ZXIgbWFkZSBieSBgd2FsaygpYCxcbiAgICAgICAgICB0aGVyZWZvcmUgdGhlIGByb3VuZHNgIGluIHRoZSBgd2Fsa2Agc3RhdHMgb2JqZWN0IGFsd2F5cyByZW1haW5zIGAwYCAjIyNcbiAgICAgICAgICAjIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3YWxrX3VuaXF1ZTogKCBjZmcgKSAtPlxuICAgICAgICB7IHByb2R1Y2VyLFxuICAgICAgICAgIHNlZW4sXG4gICAgICAgICAgd2luZG93LFxuICAgICAgICAgIG4sXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzICAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMud2Fsay4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIHNlZW4gICAgICAgICAgICAgPz0gbmV3IFNldCgpXG4gICAgICAgIHN0YXRzICAgICAgICAgICAgID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnd2Fsa191bmlxdWUnLCBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfVxuICAgICAgICBvbGRfc2l6ZSAgICAgICAgICA9IHNlZW4uc2l6ZVxuICAgICAgICBsb29wXG4gICAgICAgICAgc2Vlbi5hZGQgWSAgPSBwcm9kdWNlcigpXG4gICAgICAgICAgeWllbGQgWSBpZiBzZWVuLnNpemUgPiBvbGRfc2l6ZVxuICAgICAgICAgIG9sZF9zaXplICAgID0gc2Vlbi5zaXplXG4gICAgICAgICAgYnJlYWsgaWYgc2Vlbi5zaXplID49IG5cbiAgICAgICAgICAjIyMgVEFJTlQgaW1wbGVtZW50ICdzdG9wJ3BpbmcgdGhlIGxvb3AgIyMjXG4gICAgICAgICAgY29udGludWUgaWYgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgIHlpZWxkIHNlbnRpbmVsIHVubGVzcyBvbl9leGhhdXN0aW9uIGlzICdzdG9wJ1xuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0dFVFJBTkRPTV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-getrandom-brics.coffee