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
          }
          // yield sentinel unless on_exhaustion is 'stop'
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWdldHJhbmRvbS1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7Ozs7O0VBS0Esd0JBQUEsR0FLRSxDQUFBOzs7O0lBQUEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBO01BQUksQ0FBQSxDQUFFLElBQUYsRUFDRSxVQURGLENBQUEsR0FDa0MsQ0FBRSxPQUFBLENBQVEsaUJBQVIsQ0FBRixDQUE2QixDQUFDLDhCQUE5QixDQUFBLENBRGxDLEVBQUo7OztNQUlJLE1BQUEsR0FBYyxvREFKbEI7O01BTUksVUFBQSxHQUFjO01BQ2QsS0FBQSxHQUFjLE1BQUEsQ0FBTyxPQUFQO01BQ2QsS0FBQSxHQUFjLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFBUSxZQUFBLENBQUEsRUFBQTtlQUFDLE1BQU0sQ0FBQyxXQUFQOztBQUFxQjtVQUFBLEtBQUEsTUFBQTs7Z0JBQTZCOzJCQUE3QixDQUFFLENBQUYsRUFBSyxDQUFMOztVQUFBLENBQUE7O1lBQXJCO01BQVQsRUFSbEI7O01BV0ksU0FBQSxHQUNFLENBQUE7UUFBQSxNQUFBLEVBQW9CLE1BQXBCO1FBQ0EsVUFBQSxFQUFvQixVQURwQjtRQUVBLEtBQUEsRUFBb0IsS0FGcEI7UUFHQSxLQUFBLEVBQW9CLEtBSHBCOztRQUtBLFNBQUEsRUFBVyxNQUFNLENBQUMsTUFBUCxDQUNUO1VBQUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLE1BQVAsQ0FDaEI7WUFBQSxJQUFBLEVBQW9CLElBQXBCO1lBQ0EsVUFBQSxFQUFvQixVQURwQjs7WUFHQSxRQUFBLEVBQW9CLElBSHBCO1lBSUEsaUJBQUEsRUFBb0IsTUFBTSxDQUFD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LEdBQW9CLElBQUMsQ0FBQSxVQUFELENBQVk7WUFBRSxJQUFBLEVBQU0sYUFBUjtZQUF1QixRQUF2QjtZQUFpQyxhQUFqQztZQUFnRDtVQUFoRCxDQUFaO1VBQ3BCLFFBQUEsR0FBb0IsSUFBSSxDQUFDO0FBQ3pCLGlCQUFBLElBQUE7WUFDRSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSyxRQUFBLENBQUEsQ0FBZDtZQUNBLElBQUcsSUFBSSxDQUFDLElBQUwsR0FBWSxRQUFmO2NBQ0UsTUFBTTtjQUNOLFFBQUEsR0FBYyxJQUFJLENBQUM7Y0FDbkIsSUFBUyxJQUFJLENBQUMsSUFBTCxJQUFhLENBQXRCO0FBQUEsc0JBQUE7O0FBQ0EsdUJBSkY7O1lBTUEsSUFBWSxDQUFFLFFBQUEsR0FBVyxLQUFLLENBQUMsS0FBTixDQUFBLENBQWIsQ0FBQSxLQUFnQyxLQUE1Qzs7QUFBQSx1QkFBQTs7VUFSRixDQVZSOztBQW9CUSxpQkFBUyxLQUFLLENBQUMsTUFBTixDQUFhLElBQWI7UUFyQkU7O01BL09mLEVBbEpKOztNQTBaSSxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkO0FBQ1osYUFBTyxPQUFBLEdBQVUsQ0FBRSxVQUFGLEVBQWMsU0FBZDtJQTVaRztFQUF0QixFQVZGOzs7RUEwYUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsd0JBQTlCO0FBMWFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9HRVRSQU5ET01fQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9yYW5kb21fdG9vbHM6IC0+XG4gICAgeyBoaWRlLFxuICAgICAgc2V0X2dldHRlciwgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcycgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgICMjIyBUQUlOVCByZXBsYWNlICMjI1xuICAgICMgeyBkZWZhdWx0OiBfZ2V0X3VuaXF1ZV90ZXh0LCAgfSA9IHJlcXVpcmUgJ3VuaXF1ZS1zdHJpbmcnXG4gICAgY2hyX3JlICAgICAgPSAvLy9eKD86XFxwe0x9fFxccHtac318XFxwe1p9fFxccHtNfXxcXHB7Tn18XFxwe1B9fFxccHtTfSkkLy8vdlxuICAgICMgbWF4X3JvdW5kcyA9IDlfOTk5XG4gICAgbWF4X3JvdW5kcyAgPSAxXzAwMFxuICAgIGdvX29uICAgICAgID0gU3ltYm9sICdnb19vbidcbiAgICBjbGVhbiAgICAgICA9ICggeCApIC0+IE9iamVjdC5mcm9tRW50cmllcyAoIFsgaywgdiwgXSBmb3IgaywgdiBvZiB4IHdoZW4gdj8gKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGludGVybmFscyA9ICMgT2JqZWN0LmZyZWV6ZVxuICAgICAgY2hyX3JlOiAgICAgICAgICAgICBjaHJfcmVcbiAgICAgIG1heF9yb3VuZHM6ICAgICAgICAgbWF4X3JvdW5kc1xuICAgICAgZ29fb246ICAgICAgICAgICAgICBnb19vblxuICAgICAgY2xlYW46ICAgICAgICAgICAgICBjbGVhblxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHRlbXBsYXRlczogT2JqZWN0LmZyZWV6ZVxuICAgICAgICByYW5kb21fdG9vbHNfY2ZnOiBPYmplY3QuZnJlZXplXG4gICAgICAgICAgc2VlZDogICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X3JvdW5kczogICAgICAgICBtYXhfcm91bmRzXG4gICAgICAgICAgIyB1bmlxdWVfY291bnQ6ICAgMV8wMDBcbiAgICAgICAgICBvbl9zdGF0czogICAgICAgICAgIG51bGxcbiAgICAgICAgICB1bmljb2RlX2NpZF9yYW5nZTogIE9iamVjdC5mcmVlemUgWyAweDAwMDAsIDB4MTBmZmZmIF1cbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgaW50X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMFxuICAgICAgICAgIG1heDogICAgICAgICAgICAgICAgMVxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBmbG9hdF9wcm9kdWNlcjpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgY2hyX3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgcHJlZmlsdGVyOiAgICAgICAgICBjaHJfcmVcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgdGV4dF9wcm9kdWNlcjpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIGxlbmd0aDogICAgICAgICAgICAgMVxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMlxuICAgICAgICAgIG1pbl9sZW5ndGg6ICAgICAgICAgbnVsbFxuICAgICAgICAgIG1heF9sZW5ndGg6ICAgICAgICAgbnVsbFxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBzZXRfb2ZfY2hyczpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMlxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBzdGF0czpcbiAgICAgICAgICBmbG9hdDpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICBpbnRlZ2VyOlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIGNocjpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcbiAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgICAgcm91bmRzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl90ZXh0czpcbiAgICAgICAgICAgIHJvdW5kczogICAgICAgICAgLTFcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBgYGBcbiAgICAvLyB0aHggdG8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NTkzMzE2Lzc1NjgwOTFcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvc2VlZGluZy10aGUtcmFuZG9tLW51bWJlci1nZW5lcmF0b3ItaW4tamF2YXNjcmlwdFxuXG4gICAgLy8gU3BsaXRNaXgzMlxuXG4gICAgLy8gQSAzMi1iaXQgc3RhdGUgUFJORyB0aGF0IHdhcyBtYWRlIGJ5IHRha2luZyBNdXJtdXJIYXNoMydzIG1peGluZyBmdW5jdGlvbiwgYWRkaW5nIGEgaW5jcmVtZW50b3IgYW5kXG4gICAgLy8gdHdlYWtpbmcgdGhlIGNvbnN0YW50cy4gSXQncyBwb3RlbnRpYWxseSBvbmUgb2YgdGhlIGJldHRlciAzMi1iaXQgUFJOR3Mgc28gZmFyOyBldmVuIHRoZSBhdXRob3Igb2ZcbiAgICAvLyBNdWxiZXJyeTMyIGNvbnNpZGVycyBpdCB0byBiZSB0aGUgYmV0dGVyIGNob2ljZS4gSXQncyBhbHNvIGp1c3QgYXMgZmFzdC5cblxuICAgIGNvbnN0IHNwbGl0bWl4MzIgPSBmdW5jdGlvbiAoIGEgKSB7XG4gICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICBhIHw9IDA7XG4gICAgICAgYSA9IGEgKyAweDllMzc3OWI5IHwgMDtcbiAgICAgICBsZXQgdCA9IGEgXiBhID4+PiAxNjtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4MjFmMGFhYWQpO1xuICAgICAgIHQgPSB0IF4gdCA+Pj4gMTU7XG4gICAgICAgdCA9IE1hdGguaW11bCh0LCAweDczNWEyZDk3KTtcbiAgICAgICByZXR1cm4gKCh0ID0gdCBeIHQgPj4+IDE1KSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnN0IHBybmcgPSBzcGxpdG1peDMyKChNYXRoLnJhbmRvbSgpKjIqKjMyKT4+PjApXG4gICAgLy8gZm9yKGxldCBpPTA7IGk8MTA7IGkrKykgY29uc29sZS5sb2cocHJuZygpKTtcbiAgICAvL1xuICAgIC8vIEkgd291bGQgcmVjb21tZW5kIHRoaXMgaWYgeW91IGp1c3QgbmVlZCBhIHNpbXBsZSBidXQgZ29vZCBQUk5HIGFuZCBkb24ndCBuZWVkIGJpbGxpb25zIG9mIHJhbmRvbVxuICAgIC8vIG51bWJlcnMgKHNlZSBCaXJ0aGRheSBwcm9ibGVtKS5cbiAgICAvL1xuICAgIC8vIE5vdGU6IEl0IGRvZXMgaGF2ZSBvbmUgcG90ZW50aWFsIGNvbmNlcm46IGl0IGRvZXMgbm90IHJlcGVhdCBwcmV2aW91cyBudW1iZXJzIHVudGlsIHlvdSBleGhhdXN0IDQuM1xuICAgIC8vIGJpbGxpb24gbnVtYmVycyBhbmQgaXQgcmVwZWF0cyBhZ2Fpbi4gV2hpY2ggbWF5IG9yIG1heSBub3QgYmUgYSBzdGF0aXN0aWNhbCBjb25jZXJuIGZvciB5b3VyIHVzZVxuICAgIC8vIGNhc2UuIEl0J3MgbGlrZSBhIGxpc3Qgb2YgcmFuZG9tIG51bWJlcnMgd2l0aCB0aGUgZHVwbGljYXRlcyByZW1vdmVkLCBidXQgd2l0aG91dCBhbnkgZXh0cmEgd29ya1xuICAgIC8vIGludm9sdmVkIHRvIHJlbW92ZSB0aGVtLiBBbGwgb3RoZXIgZ2VuZXJhdG9ycyBpbiB0aGlzIGxpc3QgZG8gbm90IGV4aGliaXQgdGhpcyBiZWhhdmlvci5cbiAgICBgYGBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBpbnRlcm5hbHMuU3RhdHNcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoeyBuYW1lLCBvbl9leGhhdXN0aW9uID0gJ2Vycm9yJywgb25fc3RhdHMgPSBudWxsLCBtYXhfcm91bmRzID0gbnVsbCB9KSAtPlxuICAgICAgICBAbmFtZSAgICAgICAgICAgICAgICAgICA9IG5hbWVcbiAgICAgICAgQG1heF9yb3VuZHMgICAgICAgICAgICA9IG1heF9yb3VuZHMgPyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcubWF4X3JvdW5kc1xuICAgICAgICBvbl9leGhhdXN0aW9uICAgICAgICAgID89ICdlcnJvcidcbiAgICAgICAgaGlkZSBALCAnX2ZpbmlzaGVkJywgICAgICBmYWxzZVxuICAgICAgICBoaWRlIEAsICdfcm91bmRzJywgICAgICAgIDBcbiAgICAgICAgaGlkZSBALCAnb25fZXhoYXVzdGlvbicsICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gb25fZXhoYXVzdGlvbiAgICAgICAgICAgIGlzICdlcnJvcicgICAgdGhlbiAtPiB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgZXhoYXVzdGVkXCJcbiAgICAgICAgICB3aGVuICggdHlwZW9mIG9uX2V4aGF1c3Rpb24gKSBpcyAnZnVuY3Rpb24nIHRoZW4gb25fZXhoYXVzdGlvblxuICAgICAgICAgICMjIyBUQUlOVCB1c2UgcnByLCB0eXBpbmcgIyMjXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgaWxsZWdhbCB2YWx1ZSBmb3Igb25fZXhoYXVzdGlvbjogI3tvbl9leGhhdXN0aW9ufVwiXG4gICAgICAgIGhpZGUgQCwgJ29uX3N0YXRzJywgICAgICAgc3dpdGNoIHRydWVcbiAgICAgICAgICB3aGVuICggdHlwZW9mIG9uX3N0YXRzICkgaXMgJ2Z1bmN0aW9uJyAgdGhlbiBvbl9zdGF0c1xuICAgICAgICAgIHdoZW4gKCBub3Qgb25fc3RhdHM/ICkgICAgICAgICAgICAgICAgICB0aGVuIG51bGxcbiAgICAgICAgICAjIyMgVEFJTlQgdXNlIHJwciwgdHlwaW5nICMjI1xuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlfX182IGlsbGVnYWwgdmFsdWUgZm9yIG9uX3N0YXRzOiAje29uX3N0YXRzfVwiXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJldHJ5OiAtPlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzcgc3RhdHMgaGFzIGFscmVhZHkgZmluaXNoZWRcIiBpZiBAX2ZpbmlzaGVkXG4gICAgICAgIEBfcm91bmRzKytcbiAgICAgICAgcmV0dXJuIEBvbl9leGhhdXN0aW9uKCkgaWYgQGV4aGF1c3RlZFxuICAgICAgICByZXR1cm4gZ29fb25cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZpbmlzaDogKCBSICkgLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX184IHN0YXRzIGhhcyBhbHJlYWR5IGZpbmlzaGVkXCIgaWYgQF9maW5pc2hlZFxuICAgICAgICBAX2ZpbmlzaGVkID0gdHJ1ZVxuICAgICAgICBAb25fc3RhdHMgeyBuYW1lOiBAbmFtZSwgcm91bmRzOiBAcm91bmRzLCBSLCB9IGlmIEBvbl9zdGF0cz9cbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnZmluaXNoZWQnLCAgIC0+IEBfZmluaXNoZWRcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAncm91bmRzJywgICAgLT4gQF9yb3VuZHNcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnZXhoYXVzdGVkJywgIC0+IEBfcm91bmRzID4gQG1heF9yb3VuZHNcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBHZXRfcmFuZG9tXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZ2V0X3JhbmRvbV9zZWVkOiAtPiAoIE1hdGgucmFuZG9tKCkgKiAyICoqIDMyICkgPj4+IDBcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnJhbmRvbV90b29sc19jZmcuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAY2ZnLnNlZWQgID89IEBjb25zdHJ1Y3Rvci5nZXRfcmFuZG9tX3NlZWQoKVxuICAgICAgICBoaWRlIEAsICdfZmxvYXQnLCBzcGxpdG1peDMyIEBjZmcuc2VlZFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgSU5URVJOQUxTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX25ld19zdGF0czogKCBjZmcgKSAtPlxuICAgICAgICByZXR1cm4gbmV3IGludGVybmFscy5TdGF0cyB7IGludGVybmFscy50ZW1wbGF0ZXMuX25ld19zdGF0cy4uLiwgKCBjbGVhbiBAY2ZnICkuLi4sIGNmZy4uLiwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4X2xlbmd0aDogKHsgbGVuZ3RoID0gMSwgbWluX2xlbmd0aCA9IG51bGwsIG1heF9sZW5ndGggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBpZiBtaW5fbGVuZ3RoP1xuICAgICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGgsIG1heF9sZW5ndGg6ICggbWF4X2xlbmd0aCA/IG1pbl9sZW5ndGggKiAyICksIH1cbiAgICAgICAgZWxzZSBpZiBtYXhfbGVuZ3RoP1xuICAgICAgICAgIHJldHVybiB7IG1pbl9sZW5ndGg6ICggbWluX2xlbmd0aCA/IDEgKSwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoOiBsZW5ndGgsIG1heF9sZW5ndGg6IGxlbmd0aCwgfSBpZiBsZW5ndGg/XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX18xMiBtdXN0IHNldCBhdCBsZWFzdCBvbmUgb2YgYGxlbmd0aGAsIGBtaW5fbGVuZ3RoYCwgYG1heF9sZW5ndGhgXCJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfcmFuZG9tX2xlbmd0aDogKHsgbGVuZ3RoID0gMSwgbWluX2xlbmd0aCA9IG51bGwsIG1heF9sZW5ndGggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgfSA9IEBfZ2V0X21pbl9tYXhfbGVuZ3RoIHsgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCB9XG4gICAgICAgIHJldHVybiBtaW5fbGVuZ3RoIGlmIG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aCAjIyMgTk9URSBkb25lIHRvIGF2b2lkIGNoYW5naW5nIFBSTkcgc3RhdGUgIyMjXG4gICAgICAgIHJldHVybiBAaW50ZWdlciB7IG1pbjogbWluX2xlbmd0aCwgbWF4OiBtYXhfbGVuZ3RoLCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X21pbl9tYXg6ICh7IG1pbiA9IG51bGwsIG1heCA9IG51bGwsIH09e30pIC0+XG4gICAgICAgIG1pbiAgPSBtaW4uY29kZVBvaW50QXQgMCBpZiAoIHR5cGVvZiBtaW4gKSBpcyAnc3RyaW5nJ1xuICAgICAgICBtYXggID0gbWF4LmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWF4ICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWluID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDAgXVxuICAgICAgICBtYXggPz0gQGNmZy51bmljb2RlX2NpZF9yYW5nZVsgMSBdXG4gICAgICAgIHJldHVybiB7IG1pbiwgbWF4LCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X2ZpbHRlcjogKCBmaWx0ZXIgKSAtPlxuICAgICAgICByZXR1cm4gKCAoIHggKSAtPiB0cnVlICAgICAgICAgICAgKSB1bmxlc3MgZmlsdGVyP1xuICAgICAgICByZXR1cm4gKCBmaWx0ZXIgICAgICAgICAgICAgICAgICAgKSBpZiAoIHR5cGVvZiBmaWx0ZXIgKSBpcyAnZnVuY3Rpb24nXG4gICAgICAgIHJldHVybiAoICggeCApIC0+IGZpbHRlci50ZXN0IHggICApIGlmIGZpbHRlciBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgICAjIyMgVEFJTlQgdXNlIGBycHJgLCB0eXBpbmcgIyMjXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX18xMyB1bmFibGUgdG8gdHVybiBhcmd1bWVudCBpbnRvIGEgZmlsdGVyOiAje2FyZ3VtZW50fVwiXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgQ09OVkVOSUVOQ0VcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIGZsb2F0OiAgICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAjIGludGVnZXI6ICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBNYXRoLnJvdW5kIEBmbG9hdCB7IG1pbiwgbWF4LCB9XG4gICAgICBmbG9hdDogICAgKCBQLi4uICkgLT4gKCBAZmxvYXRfcHJvZHVjZXIgICBQLi4uICkoKVxuICAgICAgaW50ZWdlcjogICggUC4uLiApIC0+ICggQGludGVnZXJfcHJvZHVjZXIgUC4uLiApKClcbiAgICAgIGNocjogICAgICAoIFAuLi4gKSAtPiAoIEBjaHJfcHJvZHVjZXIgICAgIFAuLi4gKSgpXG4gICAgICB0ZXh0OiAgICAgKCBQLi4uICkgLT4gKCBAdGV4dF9wcm9kdWNlciAgICBQLi4uICkoKVxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFBST0RVQ0VSU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZsb2F0X3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzLCAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuZmxvYXRfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGZsb2F0ID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ2Zsb2F0JywgKCBjbGVhbiB7IG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGludGVnZXJfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5mbG9hdF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gaW50ZWdlciA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdpbnRlZ2VyJywgKCBjbGVhbiB7IG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9IE1hdGgucm91bmQgbWluICsgQF9mbG9hdCgpICogKCBtYXggLSBtaW4gKVxuICAgICAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKSBpZiAoIGZpbHRlciBSIClcbiAgICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY2hyX3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgICMjIyBUQUlOVCBjb25zaWRlciB0byBjYWNoZSByZXN1bHQgIyMjXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBwcmVmaWx0ZXIsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcywgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmNocl9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHByZWZpbHRlciAgICAgICAgID0gQF9nZXRfZmlsdGVyIHByZWZpbHRlclxuICAgICAgICBmaWx0ZXIgICAgICAgICAgICA9IEBfZ2V0X2ZpbHRlciBmaWx0ZXJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBjaHIgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnY2hyJywgKCBjbGVhbiB7IG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9IFN0cmluZy5mcm9tQ29kZVBvaW50IEBpbnRlZ2VyIHsgbWluLCBtYXgsIH1cbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBwcmVmaWx0ZXIgUiApIGFuZCAoIGZpbHRlciBSIClcbiAgICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdGV4dF9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgY29uc2lkZXIgdG8gY2FjaGUgcmVzdWx0ICMjI1xuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgIG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzICAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMudGV4dF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCAgIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICBsZW5ndGhfaXNfY29uc3QgICA9IG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aFxuICAgICAgICBsZW5ndGggICAgICAgICAgICA9IG1pbl9sZW5ndGhcbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gdGV4dCA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd0ZXh0JywgKCBjbGVhbiB7IG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcm91bmRzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbGVuZ3RoID0gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfSB1bmxlc3MgbGVuZ3RoX2lzX2NvbnN0XG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9ICggQGNociB7IG1pbiwgbWF4LCB9IGZvciBfIGluIFsgMSAuLiBsZW5ndGggXSApLmpvaW4gJydcbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBmaWx0ZXIgUiApXG4gICAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBTRVRTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX2NocnM6ICggY2ZnICkgLT5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIHNpemUsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzLCAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuc2V0X29mX2NocnMuLi4sIGNmZy4uLiwgfVxuICAgICAgICBzdGF0cyAgICAgICAgICAgICA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3NldF9vZl9jaHJzJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgUiAgICAgICAgICAgICAgICAgPSBuZXcgU2V0KClcbiAgICAgICAgY2hyICAgICAgICAgICAgICAgPSBAY2hyX3Byb2R1Y2VyIHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBSLmFkZCBjaHIoKVxuICAgICAgICAgIGJyZWFrIGlmIFIuc2l6ZSA+PSBzaXplXG4gICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl90ZXh0czogKCBjZmcgKSAtPlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgIHNpemUsXG4gICAgICAgICAgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBvbl9zdGF0cyxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uLFxuICAgICAgICAgIG1heF9yb3VuZHMsICAgfSA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5zZXRfb2ZfdGV4dHMuLi4sIGNmZy4uLiwgfVxuICAgICAgICB7IG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCwgICB9ID0gQF9nZXRfbWluX21heF9sZW5ndGggeyBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIH1cbiAgICAgICAgbGVuZ3RoX2lzX2NvbnN0ICAgPSBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGhcbiAgICAgICAgbGVuZ3RoICAgICAgICAgICAgPSBtaW5fbGVuZ3RoXG4gICAgICAgIFIgICAgICAgICAgICAgICAgID0gbmV3IFNldCgpXG4gICAgICAgIHRleHQgICAgICAgICAgICAgID0gQHRleHRfcHJvZHVjZXIgeyBtaW4sIG1heCwgbGVuZ3RoLCBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoLCBmaWx0ZXIsIH1cbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdzZXRfb2ZfdGV4dHMnLCBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbG9vcFxuICAgICAgICAgIFIuYWRkIHRleHQoKVxuICAgICAgICAgIGJyZWFrIGlmIFIuc2l6ZSA+PSBzaXplXG4gICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSIClcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBXQUxLRVJTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgd2FsazogKCBjZmcgKSAtPlxuICAgICAgICB7IHByb2R1Y2VyLFxuICAgICAgICAgIG4sXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcm91bmRzICAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMud2Fsay4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIGNvdW50ICAgICAgICAgICAgID0gMFxuICAgICAgICBzdGF0cyAgICAgICAgICAgICA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3dhbGsnLCBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JvdW5kcywgfVxuICAgICAgICBsb29wXG4gICAgICAgICAgY291bnQrKzsgYnJlYWsgaWYgY291bnQgPiBuXG4gICAgICAgICAgeWllbGQgcHJvZHVjZXIoKVxuICAgICAgICAgICMjIyBOT0RFIGFueSBmaWx0ZXJpbmcgJmMgaGFwcGVucyBpbiBwcm9kdWNlciBzbyBubyBleHRyYW5lb3VzIHJvdW5kcyBhcmUgZXZlciBtYWRlIGJ5IGB3YWxrKClgLFxuICAgICAgICAgIHRoZXJlZm9yZSB0aGUgYHJvdW5kc2AgaW4gdGhlIGB3YWxrYCBzdGF0cyBvYmplY3QgYWx3YXlzIHJlbWFpbnMgYDBgICMjI1xuICAgICAgICAgICMgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBudWxsIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHdhbGtfdW5pcXVlOiAoIGNmZyApIC0+XG4gICAgICAgIHsgcHJvZHVjZXIsXG4gICAgICAgICAgc2VlbixcbiAgICAgICAgICAjIHdpbmRvdyxcbiAgICAgICAgICBuLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JvdW5kcyAgICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLndhbGsuLi4sIGNmZy4uLiwgfVxuICAgICAgICBzZWVuICAgICAgICAgICAgID89IG5ldyBTZXQoKVxuICAgICAgICBzdGF0cyAgICAgICAgICAgICA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3dhbGtfdW5pcXVlJywgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yb3VuZHMsIH1cbiAgICAgICAgb2xkX3NpemUgICAgICAgICAgPSBzZWVuLnNpemVcbiAgICAgICAgbG9vcFxuICAgICAgICAgIHNlZW4uYWRkIFkgID0gcHJvZHVjZXIoKVxuICAgICAgICAgIGlmIHNlZW4uc2l6ZSA+IG9sZF9zaXplXG4gICAgICAgICAgICB5aWVsZCBZXG4gICAgICAgICAgICBvbGRfc2l6ZSAgICA9IHNlZW4uc2l6ZVxuICAgICAgICAgICAgYnJlYWsgaWYgc2Vlbi5zaXplID49IG5cbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgIyMjIFRBSU5UIGltcGxlbWVudCAnc3RvcCdwaW5nIHRoZSBsb29wICMjI1xuICAgICAgICAgIGNvbnRpbnVlIGlmICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgICAjIHlpZWxkIHNlbnRpbmVsIHVubGVzcyBvbl9leGhhdXN0aW9uIGlzICdzdG9wJ1xuICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggbnVsbCApXG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0dFVFJBTkRPTV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-getrandom-brics.coffee