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
        max_attempts: 9999,
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
          throw new errors.TMP_validation_error(`Ω___9 expected a text, got ${rpr(path)}`);
        }
        if (!(path.length > 0)) {
          throw new errors.TMP_validation_error(`Ω__10 expected a nonempty text, got ${rpr(path)}`);
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
          if (failure_count > cfg.max_attempts) {
            throw new errors.TMP_exhaustion_error(`Ω__11 too many (${failure_count}) attempts; path ${rpr(R)} exists`);
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
      var Get_random, exports, get_setter, hide, internals;
      ({hide, get_setter} = (require('./various-brics')).require_managed_property_tools());
      /* TAINT replace */
      // { default: _get_unique_text,  } = require 'unique-string'

      //---------------------------------------------------------------------------------------------------------
      internals = Object.freeze({
        chr_re: /^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$/v,
        templates: {
          random_tools_cfg: {
            seed: null,
            size: 1_000,
            max_attempts: 1_000,
            // unique_count:   1_000
            unicode_ranges: (function() {
              var results = [];
              for (var i = 0x0000; i <= 1114111; i++){ results.push(i); }
              return results;
            }).apply(this)
          }
        }
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
      Get_random = (function() {
        var _get_unique_text, get_codepoi, get_texts_mapped_to_width_length, get_unique_text;

        //=========================================================================================================
        class Get_random {
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
            hide(this, '_seen', {
              float: new Set()
            });
            return void 0;
          }

          //-------------------------------------------------------------------------------------------------------
          float(min = 0, max = 1) {
            return min + this._float() * (max - min);
          }

          integer(min = 0, max = 1) {
            return Math.round(this.float(min, max));
          }

          //-------------------------------------------------------------------------------------------------------
          chr() {
            var R, count;
            count = 0;
            while (true) {
              count++;
              if (count > this.cfg.max_attempts) {
                throw new Error("Ω__10 exhausted");
              }
              if (internals.chr_re.test((R = String.fromCodePoint(this.integer(0x0000, 0x10ffff))))) {
                return R;
              }
            }
            return null;
          }

          // #-------------------------------------------------------------------------------------------------------
          // unique_float: ({ min = 0, max = 1, }) ->
          //   ### TAINT refactor ###
          //   cache = @_seen.float
          //   if cache.size >= @cfg.unique_count
          //     for e from cache
          //       cache.delete e
          //       break
          //   #.....................................................................................................
          //   ### TAINT refactor ###
          //   old_size = cache.size
          //   while cache.size is old_size
          //     R = @_float()
          //     cache.add R
          //   #.....................................................................................................
          //   return R if min is 0 and max is 1
          //   return min + R * ( max - min )

            //-------------------------------------------------------------------------------------------------------
          get_unique_random() {}

        };

        //-------------------------------------------------------------------------------------------------------
        get_codepoi = function(cfg) {};

        //-------------------------------------------------------------------------------------------------------
        get_unique_text = function(cfg) {
          return cfg = {...internals.templates.get_texts_mapped_to_width_length_cfg, ...cfg};
        };

        _get_unique_text = function(min_length) {
          return _get_unique_text().slice(0, +(GUY.rnd.random_integer(1, 15)) + 1 || 9e9);
        };

        //-------------------------------------------------------------------------------------------------------
        get_texts_mapped_to_width_length = function(cfg) {
          var R, entry, old_size;
          cfg = {...internals.templates.get_texts_mapped_to_width_length_cfg, ...cfg};
          R = new Map();
          old_size = 0;
          while (true) {
            while (R.size === old_size) {
              entry = [get_unique_text(), GUY.rnd.random_integer(0, 10)];
              R.set(...entry);
            }
            old_size = R.size;
            if (old_size >= cfg.size) {
              break;
            }
          }
          return R;
        };

        return Get_random;

      }).call(this);
      //=========================================================================================================
      return exports = {Get_random, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxjQUFBOzs7OztFQUtBLGNBQUEsR0FLRSxDQUFBOzs7O0lBQUEsMEJBQUEsRUFBNEIsUUFBQSxDQUFBLENBQUE7QUFDOUIsVUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLG9CQUFBLEVBQUEsb0JBQUEsRUFBQSxpQkFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLHNCQUFBLEVBQUE7TUFBSSxHQUFBLEdBQ0U7UUFBQSxZQUFBLEVBQWdCLElBQWhCO1FBQ0EsTUFBQSxFQUFnQixJQURoQjtRQUVBLE1BQUEsRUFBZ0I7TUFGaEI7TUFHRixpQkFBQSxHQUFvQixNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FFWixNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUcsQ0FBQyxNQUFsQixDQUZZLENBQUEsa0NBQUEsQ0FBQSxDQU1aLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBTlksQ0FBQSxFQUFBLENBQUEsRUFRZixHQVJlLEVBSnhCOzs7OztNQWlCSSxHQUFBLEdBQW9CLFFBQUEsQ0FBRSxDQUFGLENBQUE7QUFDbEIsZUFBTyxDQUFBLENBQUEsQ0FBQSxDQUE2QixDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQXpDLEdBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLENBQUEsR0FBQSxNQUFKLENBQUEsQ0FBQTtBQUNQLGVBQU8sQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBO01BRlc7TUFHcEIsTUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFtQyxNQUFuQyxDQUFBLENBQXRCO1FBQ0Esb0JBQUEsRUFBNEIsdUJBQU4sTUFBQSxxQkFBQSxRQUFt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VUFBRixFQUFjLFNBQWQ7SUE1SEc7RUFqRnRCLEVBVkY7OztFQTJOQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixjQUE5QjtBQTNOQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9uZXh0X2ZyZWVfZmlsZW5hbWU6IC0+XG4gICAgY2ZnID1cbiAgICAgIG1heF9hdHRlbXB0czogICA5OTk5XG4gICAgICBwcmVmaXg6ICAgICAgICAgJ34uJ1xuICAgICAgc3VmZml4OiAgICAgICAgICcuYnJpY2FicmFjLWNhY2hlJ1xuICAgIGNhY2hlX2ZpbGVuYW1lX3JlID0gLy8vXG4gICAgICBeXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5wcmVmaXh9IClcbiAgICAgICg/PGZpcnN0Pi4qKVxuICAgICAgXFwuXG4gICAgICAoPzxucj5bMC05XXs0fSlcbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICAgJFxuICAgICAgLy8vdlxuICAgICMgY2FjaGVfc3VmZml4X3JlID0gLy8vXG4gICAgIyAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICMgICAkXG4gICAgIyAgIC8vL3ZcbiAgICBycHIgICAgICAgICAgICAgICA9ICggeCApIC0+XG4gICAgICByZXR1cm4gXCInI3t4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiIGlmICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJ30nXCJcbiAgICAgIHJldHVybiBcIiN7eH1cIlxuICAgIGVycm9ycyA9XG4gICAgICBUTVBfZXhoYXVzdGlvbl9lcnJvcjogY2xhc3MgVE1QX2V4aGF1c3Rpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgICAgVE1QX3ZhbGlkYXRpb25fZXJyb3I6IGNsYXNzIFRNUF92YWxpZGF0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICBGUyAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICBQQVRIICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpwYXRoJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZXhpc3RzID0gKCBwYXRoICkgLT5cbiAgICAgIHRyeSBGUy5zdGF0U3luYyBwYXRoIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwZSBjaGVja2luZyAjIyNcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzkgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgKCB0eXBlb2YgcGF0aCApIGlzICdzdHJpbmcnXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfXzEwIGV4cGVjdGVkIGEgbm9uZW1wdHkgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzIHBhdGgubGVuZ3RoID4gMFxuICAgICAgZGlybmFtZSAgPSBQQVRILmRpcm5hbWUgcGF0aFxuICAgICAgYmFzZW5hbWUgPSBQQVRILmJhc2VuYW1lIHBhdGhcbiAgICAgIHVubGVzcyAoIG1hdGNoID0gYmFzZW5hbWUubWF0Y2ggY2FjaGVfZmlsZW5hbWVfcmUgKT9cbiAgICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2Jhc2VuYW1lfS4wMDAxI3tjZmcuc3VmZml4fVwiXG4gICAgICB7IGZpcnN0LCBuciwgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIG5yICAgICAgICAgICAgICA9IFwiI3soIHBhcnNlSW50IG5yLCAxMCApICsgMX1cIi5wYWRTdGFydCA0LCAnMCdcbiAgICAgIHBhdGggICAgICAgICAgICA9IGZpcnN0XG4gICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7Zmlyc3R9LiN7bnJ9I3tjZmcuc3VmZml4fVwiXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgIFIgICAgICAgICAgICAgPSBwYXRoXG4gICAgICBmYWlsdXJlX2NvdW50ID0gLTFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZhaWx1cmVfY291bnQrK1xuICAgICAgICBpZiBmYWlsdXJlX2NvdW50ID4gY2ZnLm1heF9hdHRlbXB0c1xuICAgICAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX2V4aGF1c3Rpb25fZXJyb3IgXCLOqV9fMTEgdG9vIG1hbnkgKCN7ZmFpbHVyZV9jb3VudH0pIGF0dGVtcHRzOyBwYXRoICN7cnByIFJ9IGV4aXN0c1wiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgUiA9IGdldF9uZXh0X2ZpbGVuYW1lIFJcbiAgICAgICAgYnJlYWsgdW5sZXNzIGV4aXN0cyBSXG4gICAgICByZXR1cm4gUlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBzd2FwX3N1ZmZpeCA9ICggcGF0aCwgc3VmZml4ICkgLT4gcGF0aC5yZXBsYWNlIGNhY2hlX3N1ZmZpeF9yZSwgc3VmZml4XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X25leHRfZnJlZV9maWxlbmFtZSwgZ2V0X25leHRfZmlsZW5hbWUsIGV4aXN0cywgY2FjaGVfZmlsZW5hbWVfcmUsIGVycm9ycywgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NvbW1hbmRfbGluZV90b29sczogLT5cbiAgICBDUCA9IHJlcXVpcmUgJ25vZGU6Y2hpbGRfcHJvY2VzcydcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCA9ICggY29tbWFuZCwgaW5wdXQgKSAtPlxuICAgICAgcmV0dXJuICggQ1AuZXhlY1N5bmMgY29tbWFuZCwgeyBlbmNvZGluZzogJ3V0Zi04JywgaW5wdXQsIH0gKS5yZXBsYWNlIC9cXG4kL3MsICcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoID0gKCB0ZXh0ICkgLT5cbiAgICAgICMjIyB0aHggdG8gaHR0cHM6Ly91bml4LnN0YWNrZXhjaGFuZ2UuY29tL2EvMjU4NTUxLzI4MDIwNCAjIyNcbiAgICAgIHJldHVybiBwYXJzZUludCAoIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ICd3YyAtLW1heC1saW5lLWxlbmd0aCcsIHRleHQgKSwgMTBcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9jb21tYW5kX2xpbmVfcmVzdWx0LCBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoLCB9XG5cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9yYW5kb21fdG9vbHM6IC0+XG4gICAgeyBoaWRlLFxuICAgICAgZ2V0X3NldHRlciwgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcycgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgICMjIyBUQUlOVCByZXBsYWNlICMjI1xuICAgICMgeyBkZWZhdWx0OiBfZ2V0X3VuaXF1ZV90ZXh0LCAgfSA9IHJlcXVpcmUgJ3VuaXF1ZS1zdHJpbmcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZVxuICAgICAgY2hyX3JlOiAvLy9eKD86XFxwe0x9fFxccHtac318XFxwe1p9fFxccHtNfXxcXHB7Tn18XFxwe1B9fFxccHtTfSkkLy8vdlxuICAgICAgdGVtcGxhdGVzOlxuICAgICAgICByYW5kb21fdG9vbHNfY2ZnOlxuICAgICAgICAgIHNlZWQ6ICAgICAgICAgICBudWxsXG4gICAgICAgICAgc2l6ZTogICAgICAgICAgIDFfMDAwXG4gICAgICAgICAgbWF4X2F0dGVtcHRzOiAgIDFfMDAwXG4gICAgICAgICAgIyB1bmlxdWVfY291bnQ6ICAgMV8wMDBcbiAgICAgICAgICB1bmljb2RlX3JhbmdlczogWyAweDAwMDAgLi4gMHgxMGZmZmYgXVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGBgYFxuICAgIC8vIHRoeCB0byBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDc1OTMzMTYvNzU2ODA5MVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9zZWVkaW5nLXRoZS1yYW5kb20tbnVtYmVyLWdlbmVyYXRvci1pbi1qYXZhc2NyaXB0XG5cbiAgICAvLyBTcGxpdE1peDMyXG5cbiAgICAvLyBBIDMyLWJpdCBzdGF0ZSBQUk5HIHRoYXQgd2FzIG1hZGUgYnkgdGFraW5nIE11cm11ckhhc2gzJ3MgbWl4aW5nIGZ1bmN0aW9uLCBhZGRpbmcgYSBpbmNyZW1lbnRvciBhbmRcbiAgICAvLyB0d2Vha2luZyB0aGUgY29uc3RhbnRzLiBJdCdzIHBvdGVudGlhbGx5IG9uZSBvZiB0aGUgYmV0dGVyIDMyLWJpdCBQUk5HcyBzbyBmYXI7IGV2ZW4gdGhlIGF1dGhvciBvZlxuICAgIC8vIE11bGJlcnJ5MzIgY29uc2lkZXJzIGl0IHRvIGJlIHRoZSBiZXR0ZXIgY2hvaWNlLiBJdCdzIGFsc28ganVzdCBhcyBmYXN0LlxuXG4gICAgY29uc3Qgc3BsaXRtaXgzMiA9IGZ1bmN0aW9uICggYSApIHtcbiAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgIGEgfD0gMDtcbiAgICAgICBhID0gYSArIDB4OWUzNzc5YjkgfCAwO1xuICAgICAgIGxldCB0ID0gYSBeIGEgPj4+IDE2O1xuICAgICAgIHQgPSBNYXRoLmltdWwodCwgMHgyMWYwYWFhZCk7XG4gICAgICAgdCA9IHQgXiB0ID4+PiAxNTtcbiAgICAgICB0ID0gTWF0aC5pbXVsKHQsIDB4NzM1YTJkOTcpO1xuICAgICAgIHJldHVybiAoKHQgPSB0IF4gdCA+Pj4gMTUpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc3QgcHJuZyA9IHNwbGl0bWl4MzIoKE1hdGgucmFuZG9tKCkqMioqMzIpPj4+MClcbiAgICAvLyBmb3IobGV0IGk9MDsgaTwxMDsgaSsrKSBjb25zb2xlLmxvZyhwcm5nKCkpO1xuICAgIC8vXG4gICAgLy8gSSB3b3VsZCByZWNvbW1lbmQgdGhpcyBpZiB5b3UganVzdCBuZWVkIGEgc2ltcGxlIGJ1dCBnb29kIFBSTkcgYW5kIGRvbid0IG5lZWQgYmlsbGlvbnMgb2YgcmFuZG9tXG4gICAgLy8gbnVtYmVycyAoc2VlIEJpcnRoZGF5IHByb2JsZW0pLlxuICAgIC8vXG4gICAgLy8gTm90ZTogSXQgZG9lcyBoYXZlIG9uZSBwb3RlbnRpYWwgY29uY2VybjogaXQgZG9lcyBub3QgcmVwZWF0IHByZXZpb3VzIG51bWJlcnMgdW50aWwgeW91IGV4aGF1c3QgNC4zXG4gICAgLy8gYmlsbGlvbiBudW1iZXJzIGFuZCBpdCByZXBlYXRzIGFnYWluLiBXaGljaCBtYXkgb3IgbWF5IG5vdCBiZSBhIHN0YXRpc3RpY2FsIGNvbmNlcm4gZm9yIHlvdXIgdXNlXG4gICAgLy8gY2FzZS4gSXQncyBsaWtlIGEgbGlzdCBvZiByYW5kb20gbnVtYmVycyB3aXRoIHRoZSBkdXBsaWNhdGVzIHJlbW92ZWQsIGJ1dCB3aXRob3V0IGFueSBleHRyYSB3b3JrXG4gICAgLy8gaW52b2x2ZWQgdG8gcmVtb3ZlIHRoZW0uIEFsbCBvdGhlciBnZW5lcmF0b3JzIGluIHRoaXMgbGlzdCBkbyBub3QgZXhoaWJpdCB0aGlzIGJlaGF2aW9yLlxuICAgIGBgYFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEdldF9yYW5kb21cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBnZXRfcmFuZG9tX3NlZWQ6IC0+ICggTWF0aC5yYW5kb20oKSAqIDIgKiogMzIgKSA+Pj4gMFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgQGNmZyAgICAgICAgPSB7IGludGVybmFscy50ZW1wbGF0ZXMucmFuZG9tX3Rvb2xzX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEBjZmcuc2VlZCAgPz0gQGNvbnN0cnVjdG9yLmdldF9yYW5kb21fc2VlZCgpXG4gICAgICAgIGhpZGUgQCwgJ19mbG9hdCcsIHNwbGl0bWl4MzIgQGNmZy5zZWVkXG4gICAgICAgIGhpZGUgQCwgJ19zZWVuJyxcbiAgICAgICAgICBmbG9hdDogbmV3IFNldCgpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZsb2F0OiAgICAoIG1pbiA9IDAsIG1heCA9IDEgKSAtPiBtaW4gKyBAX2Zsb2F0KCkgKiAoIG1heCAtIG1pbiApXG4gICAgICBpbnRlZ2VyOiAgKCBtaW4gPSAwLCBtYXggPSAxICkgLT4gTWF0aC5yb3VuZCBAZmxvYXQgbWluLCBtYXhcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNocjogLT5cbiAgICAgICAgY291bnQgPSAwXG4gICAgICAgIGxvb3BcbiAgICAgICAgICBjb3VudCsrXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfXzEwIGV4aGF1c3RlZFwiIGlmIGNvdW50ID4gQGNmZy5tYXhfYXR0ZW1wdHNcbiAgICAgICAgICByZXR1cm4gUiBpZiBpbnRlcm5hbHMuY2hyX3JlLnRlc3QgKCBSID0gU3RyaW5nLmZyb21Db2RlUG9pbnQgQGludGVnZXIgMHgwMDAwLCAweDEwZmZmZiApXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMgdW5pcXVlX2Zsb2F0OiAoeyBtaW4gPSAwLCBtYXggPSAxLCB9KSAtPlxuICAgICAgIyAgICMjIyBUQUlOVCByZWZhY3RvciAjIyNcbiAgICAgICMgICBjYWNoZSA9IEBfc2Vlbi5mbG9hdFxuICAgICAgIyAgIGlmIGNhY2hlLnNpemUgPj0gQGNmZy51bmlxdWVfY291bnRcbiAgICAgICMgICAgIGZvciBlIGZyb20gY2FjaGVcbiAgICAgICMgICAgICAgY2FjaGUuZGVsZXRlIGVcbiAgICAgICMgICAgICAgYnJlYWtcbiAgICAgICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMgICAjIyMgVEFJTlQgcmVmYWN0b3IgIyMjXG4gICAgICAjICAgb2xkX3NpemUgPSBjYWNoZS5zaXplXG4gICAgICAjICAgd2hpbGUgY2FjaGUuc2l6ZSBpcyBvbGRfc2l6ZVxuICAgICAgIyAgICAgUiA9IEBfZmxvYXQoKVxuICAgICAgIyAgICAgY2FjaGUuYWRkIFJcbiAgICAgICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMgICByZXR1cm4gUiBpZiBtaW4gaXMgMCBhbmQgbWF4IGlzIDFcbiAgICAgICMgICByZXR1cm4gbWluICsgUiAqICggbWF4IC0gbWluIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGdldF91bmlxdWVfcmFuZG9tOiAtPlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZ2V0X2NvZGVwb2kgPSAoIGNmZyApIC0+XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnZXRfdW5pcXVlX3RleHQgPSAoIGNmZyApIC0+XG4gICAgICAgIGNmZyA9IHsgaW50ZXJuYWxzLnRlbXBsYXRlcy5nZXRfdGV4dHNfbWFwcGVkX3RvX3dpZHRoX2xlbmd0aF9jZmcuLi4sIGNmZy4uLiwgfVxuXG4gICAgICBfZ2V0X3VuaXF1ZV90ZXh0ID0gKCBtaW5fbGVuZ3RoICkgLT4gX2dldF91bmlxdWVfdGV4dCgpWyAuLiAoIEdVWS5ybmQucmFuZG9tX2ludGVnZXIgMSwgMTUgKSBdXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnZXRfdGV4dHNfbWFwcGVkX3RvX3dpZHRoX2xlbmd0aCA9ICggY2ZnICkgLT5cbiAgICAgICAgY2ZnICAgICAgID0geyBpbnRlcm5hbHMudGVtcGxhdGVzLmdldF90ZXh0c19tYXBwZWRfdG9fd2lkdGhfbGVuZ3RoX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIFIgICAgICAgICA9IG5ldyBNYXAoKVxuICAgICAgICBvbGRfc2l6ZSAgPSAwXG4gICAgICAgIGxvb3BcbiAgICAgICAgICB3aGlsZSBSLnNpemUgaXMgb2xkX3NpemVcbiAgICAgICAgICAgIGVudHJ5ID0gWyBnZXRfdW5pcXVlX3RleHQoKSwgKCBHVVkucm5kLnJhbmRvbV9pbnRlZ2VyIDAsIDEwICksIF1cbiAgICAgICAgICAgIFIuc2V0IGVudHJ5Li4uXG4gICAgICAgICAgb2xkX3NpemUgPSBSLnNpemVcbiAgICAgICAgICBicmVhayBpZiBvbGRfc2l6ZSA+PSBjZmcuc2l6ZVxuICAgICAgICByZXR1cm4gUlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHJldHVybiBleHBvcnRzID0geyBHZXRfcmFuZG9tLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-brics.coffee