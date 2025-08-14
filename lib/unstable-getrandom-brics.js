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
  Object.assign(module.exports, UNSTABLE_GETRANDOM_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWdldHJhbmRvbS1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7Ozs7O0VBS0Esd0JBQUEsR0FLRSxDQUFBOzs7O0lBQUEsb0JBQUEsRUFBc0IsUUFBQSxDQUFBLENBQUE7QUFDeEIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBO01BQUksQ0FBQSxDQUFFLElBQUYsRUFDRSxVQURGLENBQUEsR0FDa0MsQ0FBRSxPQUFBLENBQVEsaUJBQVIsQ0FBRixDQUE2QixDQUFDLDhCQUE5QixDQUFBLENBRGxDLEVBQUo7OztNQUlJLE1BQUEsR0FBYyxvREFKbEI7O01BTUksV0FBQSxHQUFjO01BQ2QsS0FBQSxHQUFjLE1BQUEsQ0FBTyxPQUFQO01BQ2QsS0FBQSxHQUFjLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFBUSxZQUFBLENBQUEsRUFBQTtlQUFDLE1BQU0sQ0FBQyxXQUFQOztBQUFxQjtVQUFBLEtBQUEsTUFBQTs7Z0JBQTZCOzJCQUE3QixDQUFFLENBQUYsRUFBSyxDQUFMOztVQUFBLENBQUE7O1lBQXJCO01BQVQsRUFSbEI7O01BV0ksU0FBQSxHQUNFLENBQUE7UUFBQSxNQUFBLEVBQW9CLE1BQXBCO1FBQ0EsV0FBQSxFQUFvQixXQURwQjtRQUVBLEtBQUEsRUFBb0IsS0FGcEI7UUFHQSxLQUFBLEVBQW9CLEtBSHBCOztRQUtBLFNBQUEsRUFBVyxNQUFNLENBQUMsTUFBUCxDQUNUO1VBQUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLE1BQVAsQ0FDaEI7WUFBQSxJQUFBLEVBQW9CLElBQXBCO1lBQ0EsSUFBQSxFQUFvQixLQURwQjtZQUVBLFdBQUEsRUFBb0IsV0FGcEI7O1lBSUEsUUFBQSxFQUFvQixJQUpwQjtZQUtB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QU0sSUFBQSxDQUFBLENBQU47WUFDQSxJQUFTLENBQUMsQ0FBQyxJQUFGLElBQVUsSUFBbkI7QUFBQSxvQkFBQTs7WUFDQSxJQUF1QixDQUFFLFFBQUEsR0FBVyxLQUFLLENBQUMsS0FBTixDQUFBLENBQWIsQ0FBQSxLQUFnQyxLQUF2RDtBQUFBLHFCQUFPLFNBQVA7O1VBSEY7QUFJQSxpQkFBUyxLQUFLLENBQUMsTUFBTixDQUFhLENBQWI7UUF2QkcsQ0E3THBCOzs7OztRQTBOWSxFQUFOLElBQU0sQ0FBQyxDQUFFLFFBQUYsRUFBWSxDQUFBLEdBQUksQ0FBaEIsSUFBcUIsQ0FBQSxDQUF0QixDQUFBO0FBQ1osY0FBQTtVQUFRLEtBQUEsR0FBUTtBQUNSLGlCQUFBLElBQUE7WUFDRSxLQUFBO1lBQVMsSUFBUyxLQUFBLEdBQVEsQ0FBakI7QUFBQSxvQkFBQTs7WUFDVCxNQUFNLFFBQUEsQ0FBQTtVQUZSO0FBR0EsaUJBQU87UUFMSDs7TUE1TlIsRUFqSko7O01BcVhJLFNBQUEsR0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQ7QUFDWixhQUFPLE9BQUEsR0FBVSxDQUFFLFVBQUYsRUFBYyxTQUFkO0lBdlhHO0VBQXRCLEVBVkY7OztFQXFZQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4Qix3QkFBOUI7QUFyWUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblVOU1RBQkxFX0dFVFJBTkRPTV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3JhbmRvbV90b29sczogLT5cbiAgICB7IGhpZGUsXG4gICAgICBzZXRfZ2V0dGVyLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyMjIFRBSU5UIHJlcGxhY2UgIyMjXG4gICAgIyB7IGRlZmF1bHQ6IF9nZXRfdW5pcXVlX3RleHQsICB9ID0gcmVxdWlyZSAndW5pcXVlLXN0cmluZydcbiAgICBjaHJfcmUgICAgICA9IC8vL14oPzpcXHB7TH18XFxwe1pzfXxcXHB7Wn18XFxwe019fFxccHtOfXxcXHB7UH18XFxwe1N9KSQvLy92XG4gICAgIyBtYXhfcmV0cmllcyA9IDlfOTk5XG4gICAgbWF4X3JldHJpZXMgPSAxXzAwMFxuICAgIGdvX29uICAgICAgID0gU3ltYm9sICdnb19vbidcbiAgICBjbGVhbiAgICAgICA9ICggeCApIC0+IE9iamVjdC5mcm9tRW50cmllcyAoIFsgaywgdiwgXSBmb3IgaywgdiBvZiB4IHdoZW4gdj8gKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGludGVybmFscyA9ICMgT2JqZWN0LmZyZWV6ZVxuICAgICAgY2hyX3JlOiAgICAgICAgICAgICBjaHJfcmVcbiAgICAgIG1heF9yZXRyaWVzOiAgICAgICAgbWF4X3JldHJpZXNcbiAgICAgIGdvX29uOiAgICAgICAgICAgICAgZ29fb25cbiAgICAgIGNsZWFuOiAgICAgICAgICAgICAgY2xlYW5cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB0ZW1wbGF0ZXM6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcmFuZG9tX3Rvb2xzX2NmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICAgIHNlZWQ6ICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMV8wMDBcbiAgICAgICAgICBtYXhfcmV0cmllczogICAgICAgIG1heF9yZXRyaWVzXG4gICAgICAgICAgIyB1bmlxdWVfY291bnQ6ICAgMV8wMDBcbiAgICAgICAgICBvbl9zdGF0czogICAgICAgICAgIG51bGxcbiAgICAgICAgICB1bmljb2RlX2NpZF9yYW5nZTogIE9iamVjdC5mcmVlemUgWyAweDAwMDAsIDB4MTBmZmZmIF1cbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgY2hyX3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgcHJlZmlsdGVyOiAgICAgICAgICBjaHJfcmVcbiAgICAgICAgICBmaWx0ZXI6ICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICBvbl9leGhhdXN0aW9uOiAgICAgICdlcnJvcidcbiAgICAgICAgdGV4dF9wcm9kdWNlcjpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIGxlbmd0aDogICAgICAgICAgICAgMVxuICAgICAgICAgIG1pbl9sZW5ndGg6ICAgICAgICAgbnVsbFxuICAgICAgICAgIG1heF9sZW5ndGg6ICAgICAgICAgbnVsbFxuICAgICAgICAgIGZpbHRlcjogICAgICAgICAgICAgbnVsbFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICBzZXRfb2ZfY2hyczpcbiAgICAgICAgICBtaW46ICAgICAgICAgICAgICAgIDB4MDAwMDAwXG4gICAgICAgICAgbWF4OiAgICAgICAgICAgICAgICAweDEwZmZmZlxuICAgICAgICAgIHNpemU6ICAgICAgICAgICAgICAgMlxuICAgICAgICAgIG9uX2V4aGF1c3Rpb246ICAgICAgJ2Vycm9yJ1xuICAgICAgICB0ZXh0X3Byb2R1Y2VyOlxuICAgICAgICAgIG1pbjogICAgICAgICAgICAgICAgMHgwMDAwMDBcbiAgICAgICAgICBtYXg6ICAgICAgICAgICAgICAgIDB4MTBmZmZmXG4gICAgICAgICAgbGVuZ3RoOiAgICAgICAgICAgICAxXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgICAgICAyXG4gICAgICAgICAgbWluX2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgbWF4X2xlbmd0aDogICAgICAgICBudWxsXG4gICAgICAgICAgZmlsdGVyOiAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbjogICAgICAnZXJyb3InXG4gICAgICAgIHN0YXRzOlxuICAgICAgICAgIGZsb2F0OlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBpbnRlZ2VyOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBjaHI6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuICAgICAgICAgIHNldF9vZl9jaHJzOlxuICAgICAgICAgICAgcmV0cmllczogICAgICAgICAgLTFcbiAgICAgICAgICBzZXRfb2ZfdGV4dHM6XG4gICAgICAgICAgICByZXRyaWVzOiAgICAgICAgICAtMVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGBgYFxuICAgIC8vIHRoeCB0byBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDc1OTMzMTYvNzU2ODA5MVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9zZWVkaW5nLXRoZS1yYW5kb20tbnVtYmVyLWdlbmVyYXRvci1pbi1qYXZhc2NyaXB0XG5cbiAgICAvLyBTcGxpdE1peDMyXG5cbiAgICAvLyBBIDMyLWJpdCBzdGF0ZSBQUk5HIHRoYXQgd2FzIG1hZGUgYnkgdGFraW5nIE11cm11ckhhc2gzJ3MgbWl4aW5nIGZ1bmN0aW9uLCBhZGRpbmcgYSBpbmNyZW1lbnRvciBhbmRcbiAgICAvLyB0d2Vha2luZyB0aGUgY29uc3RhbnRzLiBJdCdzIHBvdGVudGlhbGx5IG9uZSBvZiB0aGUgYmV0dGVyIDMyLWJpdCBQUk5HcyBzbyBmYXI7IGV2ZW4gdGhlIGF1dGhvciBvZlxuICAgIC8vIE11bGJlcnJ5MzIgY29uc2lkZXJzIGl0IHRvIGJlIHRoZSBiZXR0ZXIgY2hvaWNlLiBJdCdzIGFsc28ganVzdCBhcyBmYXN0LlxuXG4gICAgY29uc3Qgc3BsaXRtaXgzMiA9IGZ1bmN0aW9uICggYSApIHtcbiAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgIGEgfD0gMDtcbiAgICAgICBhID0gYSArIDB4OWUzNzc5YjkgfCAwO1xuICAgICAgIGxldCB0ID0gYSBeIGEgPj4+IDE2O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHgyMWYwYWFhZCk7XG4gICAgICAgdCA9IHQgXiB0ID4+PiAxNTtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4NzM1YTJkOTcpO1xuICAgICAgIHJldHVybiAoKHQgPSB0IF4gdCA+Pj4gMTUpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc3QgcHJuZyA9IHNwbGl0bWl4MzIoKE1hdGgucmFuZG9tKCkqMioqMzIpPj4+MClcbiAgICAvLyBmb3IobGV0IGk9MDsgaTwxMDsgaSsrKSBjb25zb2xlLmxvZyhwcm5nKCkpO1xuICAgIC8vXG4gICAgLy8gSSB3b3VsZCByZWNvbW1lbmQgdGhpcyBpZiB5b3UganVzdCBuZWVkIGEgc2ltcGxlIGJ1dCBnb29kIFBSTkcgYW5kIGRvbid0IG5lZWQgYmlsbGlvbnMgb2YgcmFuZG9tXG4gICAgLy8gbnVtYmVycyAoc2VlIEJpcnRoZGF5IHByb2JsZW0pLlxuICAgIC8vXG4gICAgLy8gTm90ZTogSXQgZG9lcyBoYXZlIG9uZSBwb3RlbnRpYWwgY29uY2VybjogaXQgZG9lcyBub3QgcmVwZWF0IHByZXZpb3VzIG51bWJlcnMgdW50aWwgeW91IGV4aGF1c3QgNC4zXG4gICAgLy8gYmlsbGlvbiBudW1iZXJzIGFuZCBpdCByZXBlYXRzIGFnYWluLiBXaGljaCBtYXkgb3IgbWF5IG5vdCBiZSBhIHN0YXRpc3RpY2FsIGNvbmNlcm4gZm9yIHlvdXIgdXNlXG4gICAgLy8gY2FzZS4gSXQncyBsaWtlIGEgbGlzdCBvZiByYW5kb20gbnVtYmVycyB3aXRoIHRoZSBkdXBsaWNhdGVzIHJlbW92ZWQsIGJ1dCB3aXRob3V0IGFueSBleHRyYSB3b3JrXG4gICAgLy8gaW52b2x2ZWQgdG8gcmVtb3ZlIHRoZW0uIEFsbCBvdGhlciBnZW5lcmF0b3JzIGluIHRoaXMgbGlzdCBkbyBub3QgZXhoaWJpdCB0aGlzIGJlaGF2aW9yLlxuICAgIGBgYFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIGludGVybmFscy5TdGF0c1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICh7IG5hbWUsIG9uX2V4aGF1c3Rpb24gPSAnZXJyb3InLCBvbl9zdGF0cyA9IG51bGwsIG1heF9yZXRyaWVzID0gbnVsbCB9KSAtPlxuICAgICAgICBAbmFtZSAgICAgICAgICAgICAgICAgICA9IG5hbWVcbiAgICAgICAgQG1heF9yZXRyaWVzICAgICAgICAgICAgPSBtYXhfcmV0cmllcyA/IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy5tYXhfcmV0cmllc1xuICAgICAgICBvbl9leGhhdXN0aW9uICAgICAgICAgID89ICdlcnJvcidcbiAgICAgICAgaGlkZSBALCAnX2ZpbmlzaGVkJywgICAgICBmYWxzZVxuICAgICAgICBoaWRlIEAsICdfcmV0cmllcycsICAgICAgIDBcbiAgICAgICAgaGlkZSBALCAnb25fZXhoYXVzdGlvbicsICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gb25fZXhoYXVzdGlvbiAgICAgICAgICAgIGlzICdlcnJvcicgICAgdGhlbiAtPiB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgZXhoYXVzdGVkXCJcbiAgICAgICAgICB3aGVuICggdHlwZW9mIG9uX2V4aGF1c3Rpb24gKSBpcyAnZnVuY3Rpb24nIHRoZW4gb25fZXhoYXVzdGlvblxuICAgICAgICAgICMjIyBUQUlOVCB1c2UgcnByLCB0eXBpbmcgIyMjXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgaWxsZWdhbCB2YWx1ZSBmb3Igb25fZXhoYXVzdGlvbjogI3tvbl9leGhhdXN0aW9ufVwiXG4gICAgICAgIGhpZGUgQCwgJ29uX3N0YXRzJywgICAgICAgc3dpdGNoIHRydWVcbiAgICAgICAgICB3aGVuICggdHlwZW9mIG9uX3N0YXRzICkgaXMgJ2Z1bmN0aW9uJyAgdGhlbiBvbl9zdGF0c1xuICAgICAgICAgIHdoZW4gKCBub3Qgb25fc3RhdHM/ICkgICAgICAgICAgICAgICAgICB0aGVuIG51bGxcbiAgICAgICAgICAjIyMgVEFJTlQgdXNlIHJwciwgdHlwaW5nICMjI1xuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlfX182IGlsbGVnYWwgdmFsdWUgZm9yIG9uX3N0YXRzOiAje29uX3N0YXRzfVwiXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJldHJ5OiAtPlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzcgc3RhdHMgaGFzIGFscmVhZHkgZmluaXNoZWRcIiBpZiBAX2ZpbmlzaGVkXG4gICAgICAgIEBfcmV0cmllcysrXG4gICAgICAgIHJldHVybiBAb25fZXhoYXVzdGlvbigpIGlmIEBleGhhdXN0ZWRcbiAgICAgICAgcmV0dXJuIGdvX29uXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmaW5pc2g6ICggUiApIC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fOCBzdGF0cyBoYXMgYWxyZWFkeSBmaW5pc2hlZFwiIGlmIEBfZmluaXNoZWRcbiAgICAgICAgQF9maW5pc2hlZCA9IHRydWVcbiAgICAgICAgQG9uX3N0YXRzIHsgbmFtZTogQG5hbWUsIHJldHJpZXM6IEByZXRyaWVzLCBSLCB9IGlmIEBvbl9zdGF0cz9cbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnZmluaXNoZWQnLCAgIC0+IEBfZmluaXNoZWRcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAncmV0cmllcycsICAgIC0+IEBfcmV0cmllc1xuICAgICAgc2V0X2dldHRlciBAOjosICdleGhhdXN0ZWQnLCAgLT4gQF9yZXRyaWVzID4gQG1heF9yZXRyaWVzXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgR2V0X3JhbmRvbVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGdldF9yYW5kb21fc2VlZDogLT4gKCBNYXRoLnJhbmRvbSgpICogMiAqKiAzMiApID4+PiAwXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBAY2ZnICAgICAgICA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5yYW5kb21fdG9vbHNfY2ZnLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgQGNmZy5zZWVkICA/PSBAY29uc3RydWN0b3IuZ2V0X3JhbmRvbV9zZWVkKClcbiAgICAgICAgaGlkZSBALCAnX2Zsb2F0Jywgc3BsaXRtaXgzMiBAY2ZnLnNlZWRcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIElOVEVSTkFMU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9uZXdfc3RhdHM6ICggY2ZnICkgLT5cbiAgICAgICAgcmV0dXJuIG5ldyBpbnRlcm5hbHMuU3RhdHMgeyBpbnRlcm5hbHMudGVtcGxhdGVzLl9uZXdfc3RhdHMuLi4sICggY2xlYW4gQGNmZyApLi4uLCBjZmcuLi4sIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfbWluX21heF9sZW5ndGg6ICh7IGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgaWYgbWluX2xlbmd0aD9cbiAgICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoLCBtYXhfbGVuZ3RoOiAoIG1heF9sZW5ndGggPyBtaW5fbGVuZ3RoICogMiApLCB9XG4gICAgICAgIGVsc2UgaWYgbWF4X2xlbmd0aD9cbiAgICAgICAgICByZXR1cm4geyBtaW5fbGVuZ3RoOiAoIG1pbl9sZW5ndGggPyAxICksIG1heF9sZW5ndGgsIH1cbiAgICAgICAgcmV0dXJuIHsgbWluX2xlbmd0aDogbGVuZ3RoLCBtYXhfbGVuZ3RoOiBsZW5ndGgsIH0gaWYgbGVuZ3RoP1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fMTIgbXVzdCBzZXQgYXQgbGVhc3Qgb25lIG9mIGBsZW5ndGhgLCBgbWluX2xlbmd0aGAsIGBtYXhfbGVuZ3RoYFwiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X3JhbmRvbV9sZW5ndGg6ICh7IGxlbmd0aCA9IDEsIG1pbl9sZW5ndGggPSBudWxsLCBtYXhfbGVuZ3RoID0gbnVsbCwgfT17fSkgLT5cbiAgICAgICAgeyBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICByZXR1cm4gbWluX2xlbmd0aCBpZiBtaW5fbGVuZ3RoIGlzIG1heF9sZW5ndGggIyMjIE5PVEUgZG9uZSB0byBhdm9pZCBjaGFuZ2luZyBQUk5HIHN0YXRlICMjI1xuICAgICAgICByZXR1cm4gQGludGVnZXIgeyBtaW46IG1pbl9sZW5ndGgsIG1heDogbWF4X2xlbmd0aCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9taW5fbWF4OiAoeyBtaW4gPSBudWxsLCBtYXggPSBudWxsLCB9PXt9KSAtPlxuICAgICAgICBtaW4gID0gbWluLmNvZGVQb2ludEF0IDAgaWYgKCB0eXBlb2YgbWluICkgaXMgJ3N0cmluZydcbiAgICAgICAgbWF4ICA9IG1heC5jb2RlUG9pbnRBdCAwIGlmICggdHlwZW9mIG1heCApIGlzICdzdHJpbmcnXG4gICAgICAgIG1pbiA/PSBAY2ZnLnVuaWNvZGVfY2lkX3JhbmdlWyAwIF1cbiAgICAgICAgbWF4ID89IEBjZmcudW5pY29kZV9jaWRfcmFuZ2VbIDEgXVxuICAgICAgICByZXR1cm4geyBtaW4sIG1heCwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9maWx0ZXI6ICggZmlsdGVyICkgLT5cbiAgICAgICAgcmV0dXJuICggKCB4ICkgLT4gdHJ1ZSAgICAgICAgICAgICkgdW5sZXNzIGZpbHRlcj9cbiAgICAgICAgcmV0dXJuICggZmlsdGVyICAgICAgICAgICAgICAgICAgICkgaWYgKCB0eXBlb2YgZmlsdGVyICkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgICByZXR1cm4gKCAoIHggKSAtPiBmaWx0ZXIudGVzdCB4ICAgKSBpZiBmaWx0ZXIgaW5zdGFuY2VvZiBSZWdFeHBcbiAgICAgICAgIyMjIFRBSU5UIHVzZSBgcnByYCwgdHlwaW5nICMjI1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fMTMgdW5hYmxlIHRvIHR1cm4gYXJndW1lbnQgaW50byBhIGZpbHRlcjogI3thcmd1bWVudH1cIlxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIENPTlZFTklFTkNFXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmxvYXQ6ICAgICh7IG1pbiA9IDAsIG1heCA9IDEsIH09e30pIC0+IG1pbiArIEBfZmxvYXQoKSAqICggbWF4IC0gbWluIClcbiAgICAgIGludGVnZXI6ICAoeyBtaW4gPSAwLCBtYXggPSAxLCB9PXt9KSAtPiBNYXRoLnJvdW5kIEBmbG9hdCB7IG1pbiwgbWF4LCB9XG4gICAgICBjaHI6ICAgICAgKCBQLi4uICkgLT4gKCBAY2hyX3Byb2R1Y2VyIFAuLi4gKSgpXG4gICAgICB0ZXh0OiAgICAgKCBQLi4uICkgLT4gKCBAdGV4dF9wcm9kdWNlciBQLi4uICkoKVxuXG5cbiAgICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAjIFBST0RVQ0VSU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZsb2F0X3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcywgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuZmxvYXRfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGZsb2F0ID0gPT5cbiAgICAgICAgICBzdGF0cyA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ2Zsb2F0JywgKCBjbGVhbiB7IG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcmV0cmllcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBpbnRlZ2VyX3Byb2R1Y2VyOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcywgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuZmxvYXRfcHJvZHVjZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LCAgICAgICAgICB9ID0gQF9nZXRfbWluX21heCB7IG1pbiwgbWF4LCB9XG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGludGVnZXIgPSA9PlxuICAgICAgICAgIHN0YXRzID0gQF9uZXdfc3RhdHMgeyBuYW1lOiAnaW50ZWdlcicsICggY2xlYW4geyBvbl9zdGF0cywgb25fZXhoYXVzdGlvbiwgbWF4X3JldHJpZXMsIH0gKS4uLiwgfVxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBsb29wXG4gICAgICAgICAgICBSID0gTWF0aC5yb3VuZCBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjaHJfcHJvZHVjZXI6ICggY2ZnICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGNhY2hlIHJlc3VsdCAjIyNcbiAgICAgICAgeyBtaW4sXG4gICAgICAgICAgbWF4LFxuICAgICAgICAgIHByZWZpbHRlcixcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcywgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMuY2hyX3Byb2R1Y2VyLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCwgICAgICAgICAgfSA9IEBfZ2V0X21pbl9tYXggeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcHJlZmlsdGVyICAgICAgICAgPSBAX2dldF9maWx0ZXIgcHJlZmlsdGVyXG4gICAgICAgIGZpbHRlciAgICAgICAgICAgID0gQF9nZXRfZmlsdGVyIGZpbHRlclxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGNociA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdjaHInLCAoIGNsZWFuIHsgb25fc3RhdHMsIG9uX2V4aGF1c3Rpb24sIG1heF9yZXRyaWVzLCB9ICkuLi4sIH1cbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgbG9vcFxuICAgICAgICAgICAgUiA9IFN0cmluZy5mcm9tQ29kZVBvaW50IEBpbnRlZ2VyIHsgbWluLCBtYXgsIH1cbiAgICAgICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSICkgaWYgKCBwcmVmaWx0ZXIgUiApIGFuZCAoIGZpbHRlciBSIClcbiAgICAgICAgICAgIHJldHVybiBzZW50aW5lbCB1bmxlc3MgKCBzZW50aW5lbCA9IHN0YXRzLnJldHJ5KCkgKSBpcyBnb19vblxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdGV4dF9wcm9kdWNlcjogKCBjZmcgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgY29uc2lkZXIgdG8gY2FjaGUgcmVzdWx0ICMjI1xuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgIG1pbl9sZW5ndGgsXG4gICAgICAgICAgbWF4X2xlbmd0aCxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgb25fc3RhdHMsXG4gICAgICAgICAgb25fZXhoYXVzdGlvbixcbiAgICAgICAgICBtYXhfcmV0cmllcyAgIH0gPSB7IGludGVybmFscy50ZW1wbGF0ZXMudGV4dF9wcm9kdWNlci4uLiwgY2ZnLi4uLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB7IG1pbixcbiAgICAgICAgICBtYXgsICAgICAgICAgIH0gPSBAX2dldF9taW5fbWF4IHsgbWluLCBtYXgsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCAgIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICBsZW5ndGhfaXNfY29uc3QgICA9IG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aFxuICAgICAgICBsZW5ndGggICAgICAgICAgICA9IG1pbl9sZW5ndGhcbiAgICAgICAgZmlsdGVyICAgICAgICAgICAgPSBAX2dldF9maWx0ZXIgZmlsdGVyXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gdGV4dCA9ID0+XG4gICAgICAgICAgc3RhdHMgPSBAX25ld19zdGF0cyB7IG5hbWU6ICd0ZXh0JywgKCBjbGVhbiB7IG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcmV0cmllcywgfSApLi4uLCB9XG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGxlbmd0aCA9IEBpbnRlZ2VyIHsgbWluOiBtaW5fbGVuZ3RoLCBtYXg6IG1heF9sZW5ndGgsIH0gdW5sZXNzIGxlbmd0aF9pc19jb25zdFxuICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgIFIgPSAoIEBjaHIgeyBtaW4sIG1heCwgfSBmb3IgXyBpbiBbIDEgLi4gbGVuZ3RoIF0gKS5qb2luICcnXG4gICAgICAgICAgICByZXR1cm4gKCBzdGF0cy5maW5pc2ggUiApIGlmICggZmlsdGVyIFIgKVxuICAgICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHJldHVybiBudWxsXG5cblxuICAgICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICMgU0VUU1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9vZl9jaHJzOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JldHJpZXMsICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnNldF9vZl9jaHJzLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgc3RhdHMgICAgICAgICAgICAgPSBAX25ld19zdGF0cyB7IG5hbWU6ICdzZXRfb2ZfY2hycycsIG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcmV0cmllcywgfVxuICAgICAgICBSICAgICAgICAgICAgICAgICA9IG5ldyBTZXQoKVxuICAgICAgICBjaHIgICAgICAgICAgICAgICA9IEBjaHJfcHJvZHVjZXIgeyBtaW4sIG1heCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbG9vcFxuICAgICAgICAgIFIuYWRkIGNocigpXG4gICAgICAgICAgYnJlYWsgaWYgUi5zaXplID49IHNpemVcbiAgICAgICAgICByZXR1cm4gc2VudGluZWwgdW5sZXNzICggc2VudGluZWwgPSBzdGF0cy5yZXRyeSgpICkgaXMgZ29fb25cbiAgICAgICAgcmV0dXJuICggc3RhdHMuZmluaXNoIFIgKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X29mX3RleHRzOiAoIGNmZyApIC0+XG4gICAgICAgIHsgbWluLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgc2l6ZSxcbiAgICAgICAgICBtaW5fbGVuZ3RoLFxuICAgICAgICAgIG1heF9sZW5ndGgsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIG9uX3N0YXRzLFxuICAgICAgICAgIG9uX2V4aGF1c3Rpb24sXG4gICAgICAgICAgbWF4X3JldHJpZXMsICB9ID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLnNldF9vZl90ZXh0cy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIHsgbWluX2xlbmd0aCxcbiAgICAgICAgICBtYXhfbGVuZ3RoLCAgIH0gPSBAX2dldF9taW5fbWF4X2xlbmd0aCB7IGxlbmd0aCwgbWluX2xlbmd0aCwgbWF4X2xlbmd0aCwgfVxuICAgICAgICBsZW5ndGhfaXNfY29uc3QgICA9IG1pbl9sZW5ndGggaXMgbWF4X2xlbmd0aFxuICAgICAgICBsZW5ndGggICAgICAgICAgICA9IG1pbl9sZW5ndGhcbiAgICAgICAgUiAgICAgICAgICAgICAgICAgPSBuZXcgU2V0KClcbiAgICAgICAgdGV4dCAgICAgICAgICAgICAgPSBAdGV4dF9wcm9kdWNlciB7IG1pbiwgbWF4LCBsZW5ndGgsIG1pbl9sZW5ndGgsIG1heF9sZW5ndGgsIGZpbHRlciwgfVxuICAgICAgICBzdGF0cyAgICAgICAgICAgICA9IEBfbmV3X3N0YXRzIHsgbmFtZTogJ3NldF9vZl90ZXh0cycsIG9uX3N0YXRzLCBvbl9leGhhdXN0aW9uLCBtYXhfcmV0cmllcywgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbG9vcFxuICAgICAgICAgIFIuYWRkIHRleHQoKVxuICAgICAgICAgIGJyZWFrIGlmIFIuc2l6ZSA+PSBzaXplXG4gICAgICAgICAgcmV0dXJuIHNlbnRpbmVsIHVubGVzcyAoIHNlbnRpbmVsID0gc3RhdHMucmV0cnkoKSApIGlzIGdvX29uXG4gICAgICAgIHJldHVybiAoIHN0YXRzLmZpbmlzaCBSIClcblxuXG4gICAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgIyBXQUxLRVJTXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgd2FsazogKHsgcHJvZHVjZXIsIG4gPSAxLCB9PXt9KSAtPlxuICAgICAgICBjb3VudCA9IDBcbiAgICAgICAgbG9vcFxuICAgICAgICAgIGNvdW50Kys7IGJyZWFrIGlmIGNvdW50ID4gblxuICAgICAgICAgIHlpZWxkIHByb2R1Y2VyKClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIGludGVybmFsc1xuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0dFVFJBTkRPTV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-getrandom-brics.coffee