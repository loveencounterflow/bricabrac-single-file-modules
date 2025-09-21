(function() {
  'use strict';
  var BRICS, debug,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //===========================================================================================================
  ({debug} = console);

  //===========================================================================================================
  BRICS = {
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_benchmarking: function() {
      var ANSI, Benchmarker, NFA, bigint_from_hrtime, exports, get_percentage_bar, get_progress, hrtime_as_bigint, inf, nameit, nfa, timeit, timeit_tpl;
      // { get_setter,
      //   hide,                       } = ( require './various-brics' ).require_managed_property_tools()
      ({get_percentage_bar} = (require('./unstable-brics')).require_progress_indicators());
      ({nameit} = (require('./various-brics')).require_nameit());
      NFA = (require('./unstable-normalize-function-arguments-brics')).require_normalize_function_arguments(); // get_signature,
      // Normalize_function_arguments,
      // Template,
      // internals,
      ({nfa} = NFA);
      //-------------------------------------------------------------------------------------------------------
      bigint_from_hrtime = function([s, ns]) {
        return (BigInt(s)) * 1_000_000_000n + (BigInt(ns));
      };
      hrtime_as_bigint = function() {
        return bigint_from_hrtime(process.hrtime());
      };
      inf = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      });
      ANSI = {
        cr: '\x1b[1G', // Carriage Return; move to first column (CHA n — Cursor Horizontal Absolut)
        el0: '\x1b[0K', // EL Erase in Line; 0: from cursor to end
        el1: '\x1b[1K', // EL Erase in Line; 1: from cursor to beginning
        el2: '\x1b[2K' // EL Erase in Line; 2: entire line
      };
      
      //-------------------------------------------------------------------------------------------------------
      get_progress = function({total, task_rpr} = {}) {
        var divisor, processed, progress;
        if (total == null) {
          return progress = function() {
            throw new Error("Ωbm___1 must call with option `total` in order to use progress bar");
          };
        }
        //.....................................................................................................
        processed = -1;
        divisor = Math.round(total / 100);
        //.....................................................................................................
        return progress = function({delta = 1} = {}) {
          var percentage, percentage_rpr;
          processed += delta;
          if ((modulo(processed, divisor)) !== 0) {
            return null;
          }
          percentage = Math.round(processed / total * 100);
          percentage_rpr = percentage.toString().padStart(3);
          process.stdout.write(`${task_rpr} ${get_percentage_bar(percentage)} ${ANSI.cr}`);
          return null;
        };
      };
      //-------------------------------------------------------------------------------------------------------
      timeit_tpl = {
        brand: 'unnamed',
        task: null
      };
      Benchmarker = (function() {
        //=======================================================================================================
        class Benchmarker {
          //-----------------------------------------------------------------------------------------------------
          constructor() {
            this.brands = {};
            // @tasks    = {}
            return void 0;
          }

          //-----------------------------------------------------------------------------------------------------
          get_averages_by_brands() {
            var R, brand, dts, ref, target, track, tracks;
            R = {};
            ref = this.brands;
            for (brand in ref) {
              tracks = ref[brand];
              target = R[brand] = {};
              for (track in tracks) {
                dts = tracks[track];
                target[track] = (dts.reduce((function(a, b) {
                  return a + b;
                }), 0)) / dts.length;
              }
            }
            return R;
          }

        };

        //-----------------------------------------------------------------------------------------------------
        Benchmarker.prototype.timeit = nfa({
          template: timeit_tpl
        }, function(brand, task, cfg, fn) {
          var base, dt, dt_rpr, dts_brand, dts_task, progress, result, t0, t1, task_rpr;
          // timeit: nfa ( brand, task, cfg, fn ) ->
          // debug 'Ωbm___2', { brand, task, cfg, fn } # ; return null
          // switch arity = arguments.length
          //   when 1 then [ cfg, fn, ] = [ {}, cfg, ]
          //   when 2 then null
          //   else throw new Error "Ωbm___3 expected 1 or 2 arguments, got #{arity}"
          //.....................................................................................................
          cfg = {...{
              total: null
            }, ...cfg};
          task = task != null ? task : ((fn.name === '') ? '(anonymous)' : fn.name);
          task_rpr = (task + ':').padEnd(40, ' ');
          progress = get_progress({
            total: cfg.total,
            task_rpr
          });
          t0 = hrtime_as_bigint();
          result = fn({progress});
          t1 = hrtime_as_bigint();
          dt = (Number(t1 - t0)) / 1_000_000;
          //.....................................................................................................
          dts_brand = (base = this.brands)[brand] != null ? base[brand] : base[brand] = {};
          dts_task = dts_brand[task] != null ? dts_brand[task] : dts_brand[task] = [];
          dts_task.push(dt);
          // dts_task           = ( @tasks[   task ] ?= { dts: [], } ).dts
          // dts_brand.push dt
          //.....................................................................................................
          //  locale: 'en-US', numberingSystem: 'latn', style: 'decimal', minimumIntegerDigits: 1, minimumFractionDigits: 0,
          // maximumFractionDigits: 3, useGrouping: 'auto', notation: 'standard', signDisplay: 'auto', roundingIncrement: 1,
          // roundingMode: 'halfExpand', roundingPriority: 'auto', trailingZeroDisplay: 'auto' }
          dt_rpr = inf.format(dt);
          dt_rpr = dt_rpr.padStart(20, ' ');
          //...................................................................................................
          if (cfg.handler != null) {
            cfg.handler({
              brand,
              task,
              dt,
              dt_rpr,
              total: cfg.total,
              brands: this.brands
            });
          } else {
            // tasks:    @tasks,
            console.log(`${ANSI.el2}${task_rpr} ${dt_rpr}`);
          }
          //...................................................................................................
          return result;
        });

        return Benchmarker;

      }).call(this);
      //=======================================================================================================
      timeit = (() => {
        var R, bm;
        bm = new Benchmarker();
        R = function(...P) {
          return bm.timeit(...P);
        };
        nameit('timeit', R);
        R.bm = bm;
        return R;
      })();
      //.......................................................................................................
      return exports = {Benchmarker, bigint_from_hrtime, hrtime_as_bigint, timeit};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJlbmNobWFyay1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUE7SUFBQSwyREFBQTs7O0VBR0EsQ0FBQSxDQUFFLEtBQUYsQ0FBQSxHQUFhLE9BQWIsRUFIQTs7O0VBTUEsS0FBQSxHQUlFLENBQUE7OztJQUFBLG9CQUFBLEVBQXNCLFFBQUEsQ0FBQSxDQUFBO0FBQ3hCLFVBQUEsSUFBQSxFQUFBLFdBQUEsRUFBQSxHQUFBLEVBQUEsa0JBQUEsRUFBQSxPQUFBLEVBQUEsa0JBQUEsRUFBQSxZQUFBLEVBQUEsZ0JBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsVUFBQTs7O01BRUksQ0FBQSxDQUFFLGtCQUFGLENBQUEsR0FBa0MsQ0FBRSxPQUFBLENBQVEsa0JBQVIsQ0FBRixDQUE4QixDQUFDLDJCQUEvQixDQUFBLENBQWxDO01BQ0EsQ0FBQSxDQUFFLE1BQUYsQ0FBQSxHQUFrQyxDQUFFLE9BQUEsQ0FBUSxpQkFBUixDQUFGLENBQTZCLENBQUMsY0FBOUIsQ0FBQSxDQUFsQztNQUNBLEdBQUEsR0FBTSxDQUFFLE9BQUEsQ0FBUSwrQ0FBUixDQUFGLENBQTJELENBQUMsb0NBQTVELENBQUEsRUFKVjs7OztNQUtJLENBQUEsQ0FJRSxHQUpGLENBQUEsR0FJMEIsR0FKMUIsRUFMSjs7TUFXSSxrQkFBQSxHQUFzQixRQUFBLENBQUMsQ0FBRSxDQUFGLEVBQUssRUFBTCxDQUFELENBQUE7ZUFBaUIsQ0FBRSxNQUFBLENBQU8sQ0FBUCxDQUFGLENBQUEsR0FBZSxjQUFmLEdBQWdDLENBQUUsTUFBQSxDQUFPLEVBQVAsQ0FBRjtNQUFqRDtNQUN0QixnQkFBQSxHQUFvQyxRQUFBLENBQUEsQ0FBQTtlQUFHLGtCQUFBLENBQW1CLE9BQU8sQ0FBQyxNQUFSLENBQUEsQ0FB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SSxDQUFDLEdBQVIsQ0FBQSxDQUFBLENBQWMsUUFBZCxFQUFBLENBQUEsQ0FBMEIsTUFBMUIsQ0FBQSxDQUFaLEVBWEY7V0E1QlI7O0FBeUNRLGlCQUFPO1FBMUM4QixDQUEvQjs7OztvQkFoRGQ7O01Bc0dJLE1BQUEsR0FBWSxDQUFBLENBQUEsQ0FBQSxHQUFBO0FBQ2hCLFlBQUEsQ0FBQSxFQUFBO1FBQU0sRUFBQSxHQUFNLElBQUksV0FBSixDQUFBO1FBQ04sQ0FBQSxHQUFNLFFBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBQTtpQkFBWSxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQUEsQ0FBVjtRQUFaO1FBQ04sTUFBQSxDQUFPLFFBQVAsRUFBaUIsQ0FBakI7UUFDQSxDQUFDLENBQUMsRUFBRixHQUFPO0FBQ1AsZUFBTztNQUxHLENBQUEsSUF0R2hCOztBQThHSSxhQUFPLE9BQUEsR0FBVSxDQUFFLFdBQUYsRUFBZSxrQkFBZixFQUFtQyxnQkFBbkMsRUFBcUQsTUFBckQ7SUEvR0c7RUFBdEIsRUFWRjs7O0VBNEhBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLEtBQTlCO0FBNUhBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxueyBkZWJ1ZywgfSA9IGNvbnNvbGVcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5CUklDUyA9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2JlbmNobWFya2luZzogLT5cbiAgICAjIHsgZ2V0X3NldHRlcixcbiAgICAjICAgaGlkZSwgICAgICAgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcycgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgIHsgZ2V0X3BlcmNlbnRhZ2VfYmFyLCAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdW5zdGFibGUtYnJpY3MnICkucmVxdWlyZV9wcm9ncmVzc19pbmRpY2F0b3JzKClcbiAgICB7IG5hbWVpdCwgICAgICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnICkucmVxdWlyZV9uYW1laXQoKVxuICAgIE5GQSA9ICggcmVxdWlyZSAnLi91bnN0YWJsZS1ub3JtYWxpemUtZnVuY3Rpb24tYXJndW1lbnRzLWJyaWNzJyApLnJlcXVpcmVfbm9ybWFsaXplX2Z1bmN0aW9uX2FyZ3VtZW50cygpXG4gICAgeyAjIGdldF9zaWduYXR1cmUsXG4gICAgICAjIE5vcm1hbGl6ZV9mdW5jdGlvbl9hcmd1bWVudHMsXG4gICAgICAjIFRlbXBsYXRlLFxuICAgICAgIyBpbnRlcm5hbHMsXG4gICAgICBuZmEsICAgICAgICAgICAgICAgIH0gPSBORkFcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJpZ2ludF9mcm9tX2hydGltZSAgPSAoWyBzLCBucywgXSkgIC0+ICggQmlnSW50IHMgKSAqIDFfMDAwXzAwMF8wMDBuICsgKCBCaWdJbnQgbnMgKVxuICAgIGhydGltZV9hc19iaWdpbnQgICAgPSAgICAgICAgICAgICAgIC0+IGJpZ2ludF9mcm9tX2hydGltZSBwcm9jZXNzLmhydGltZSgpXG4gICAgaW5mICAgICAgICAgICAgICAgICA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCAnZW4tVVMnLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMywgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAzfVxuICAgIEFOU0kgICAgICAgICAgICAgICAgPVxuICAgICAgY3I6ICAgJ1xceDFiWzFHJyAgICAgICAjIENhcnJpYWdlIFJldHVybjsgbW92ZSB0byBmaXJzdCBjb2x1bW4gKENIQSBuIOKAlCBDdXJzb3IgSG9yaXpvbnRhbCBBYnNvbHV0KVxuICAgICAgZWwwOiAgJ1xceDFiWzBLJyAgICAgICAjIEVMIEVyYXNlIGluIExpbmU7IDA6IGZyb20gY3Vyc29yIHRvIGVuZFxuICAgICAgZWwxOiAgJ1xceDFiWzFLJyAgICAgICAjIEVMIEVyYXNlIGluIExpbmU7IDE6IGZyb20gY3Vyc29yIHRvIGJlZ2lubmluZ1xuICAgICAgZWwyOiAgJ1xceDFiWzJLJyAgICAgICAjIEVMIEVyYXNlIGluIExpbmU7IDI6IGVudGlyZSBsaW5lXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9wcm9ncmVzcyA9ICh7IHRvdGFsLCB0YXNrX3JwciwgfT17fSkgLT5cbiAgICAgIHVubGVzcyB0b3RhbD9cbiAgICAgICAgcmV0dXJuIHByb2dyZXNzID0gLT4gdGhyb3cgbmV3IEVycm9yIFwizqlibV9fXzEgbXVzdCBjYWxsIHdpdGggb3B0aW9uIGB0b3RhbGAgaW4gb3JkZXIgdG8gdXNlIHByb2dyZXNzIGJhclwiXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHByb2Nlc3NlZCA9IC0xXG4gICAgICBkaXZpc29yICAgPSBNYXRoLnJvdW5kIHRvdGFsIC8gMTAwXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHJldHVybiBwcm9ncmVzcyA9ICh7IGRlbHRhID0gMSwgfT17fSkgLT5cbiAgICAgICAgcHJvY2Vzc2VkICAgICAgKz0gZGVsdGE7IHJldHVybiBudWxsIHVubGVzcyAoIHByb2Nlc3NlZCAlJSBkaXZpc29yICkgaXMgMFxuICAgICAgICBwZXJjZW50YWdlICAgICAgPSBNYXRoLnJvdW5kIHByb2Nlc3NlZCAvIHRvdGFsICogMTAwXG4gICAgICAgIHBlcmNlbnRhZ2VfcnByICA9IHBlcmNlbnRhZ2UudG9TdHJpbmcoKS5wYWRTdGFydCAzXG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlIFwiI3t0YXNrX3Jwcn0gI3tnZXRfcGVyY2VudGFnZV9iYXIgcGVyY2VudGFnZX0gI3tBTlNJLmNyfVwiXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRpbWVpdF90cGwgPSB7IGJyYW5kOiAndW5uYW1lZCcsIHRhc2s6IG51bGwsIH1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgQmVuY2htYXJrZXJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgQGJyYW5kcyAgID0ge31cbiAgICAgICAgIyBAdGFza3MgICAgPSB7fVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdGltZWl0OiBuZmEgeyB0ZW1wbGF0ZTogdGltZWl0X3RwbCwgfSwgKCBicmFuZCwgdGFzaywgY2ZnLCBmbiApIC0+XG4gICAgICAjIHRpbWVpdDogbmZhICggYnJhbmQsIHRhc2ssIGNmZywgZm4gKSAtPlxuICAgICAgICAjIGRlYnVnICfOqWJtX19fMicsIHsgYnJhbmQsIHRhc2ssIGNmZywgZm4gfSAjIDsgcmV0dXJuIG51bGxcbiAgICAgICAgIyBzd2l0Y2ggYXJpdHkgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICMgICB3aGVuIDEgdGhlbiBbIGNmZywgZm4sIF0gPSBbIHt9LCBjZmcsIF1cbiAgICAgICAgIyAgIHdoZW4gMiB0aGVuIG51bGxcbiAgICAgICAgIyAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlibV9fXzMgZXhwZWN0ZWQgMSBvciAyIGFyZ3VtZW50cywgZ290ICN7YXJpdHl9XCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGNmZyAgICAgICAgICAgICAgICAgPSB7IHsgdG90YWw6IG51bGwsIH0uLi4sIGNmZy4uLiwgfVxuICAgICAgICB0YXNrICAgICAgICAgICAgICAgID0gdGFzayA/ICggaWYgKCBmbi5uYW1lIGlzICcnICkgdGhlbiAnKGFub255bW91cyknIGVsc2UgZm4ubmFtZSApXG4gICAgICAgIHRhc2tfcnByICAgICAgICAgICAgPSAoIHRhc2sgKyAnOicgKS5wYWRFbmQgNDAsICcgJ1xuICAgICAgICBwcm9ncmVzcyAgICAgICAgICAgID0gZ2V0X3Byb2dyZXNzIHsgdG90YWw6IGNmZy50b3RhbCwgdGFza19ycHIsIH1cbiAgICAgICAgdDAgICAgICAgICAgICAgICAgICA9IGhydGltZV9hc19iaWdpbnQoKVxuICAgICAgICByZXN1bHQgICAgICAgICAgICAgID0gZm4geyBwcm9ncmVzcywgfVxuICAgICAgICB0MSAgICAgICAgICAgICAgICAgID0gaHJ0aW1lX2FzX2JpZ2ludCgpXG4gICAgICAgIGR0ICAgICAgICAgICAgICAgICAgPSAoIE51bWJlciB0MSAtIHQwICkgLyAxXzAwMF8wMDBcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGR0c19icmFuZCAgICAgICAgICAgPSBAYnJhbmRzWyBicmFuZCBdID89IHt9XG4gICAgICAgIGR0c190YXNrICAgICAgICAgICAgPSBkdHNfYnJhbmRbIHRhc2sgXSA/PSBbXVxuICAgICAgICBkdHNfdGFzay5wdXNoIGR0XG4gICAgICAgICMgZHRzX3Rhc2sgICAgICAgICAgID0gKCBAdGFza3NbICAgdGFzayBdID89IHsgZHRzOiBbXSwgfSApLmR0c1xuICAgICAgICAjIGR0c19icmFuZC5wdXNoIGR0XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAjICBsb2NhbGU6ICdlbi1VUycsIG51bWJlcmluZ1N5c3RlbTogJ2xhdG4nLCBzdHlsZTogJ2RlY2ltYWwnLCBtaW5pbXVtSW50ZWdlckRpZ2l0czogMSwgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAwLFxuICAgICAgICAjIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMywgdXNlR3JvdXBpbmc6ICdhdXRvJywgbm90YXRpb246ICdzdGFuZGFyZCcsIHNpZ25EaXNwbGF5OiAnYXV0bycsIHJvdW5kaW5nSW5jcmVtZW50OiAxLFxuICAgICAgICAjIHJvdW5kaW5nTW9kZTogJ2hhbGZFeHBhbmQnLCByb3VuZGluZ1ByaW9yaXR5OiAnYXV0bycsIHRyYWlsaW5nWmVyb0Rpc3BsYXk6ICdhdXRvJyB9XG4gICAgICAgIGR0X3JwciAgICAgICAgPSBpbmYuZm9ybWF0IGR0XG4gICAgICAgIGR0X3JwciAgICAgICAgPSBkdF9ycHIucGFkU3RhcnQgMjAsICcgJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmIGNmZy5oYW5kbGVyP1xuICAgICAgICAgIGNmZy5oYW5kbGVyIHtcbiAgICAgICAgICAgIGJyYW5kLFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgIGR0LFxuICAgICAgICAgICAgZHRfcnByLFxuICAgICAgICAgICAgdG90YWw6ICAgIGNmZy50b3RhbCxcbiAgICAgICAgICAgIGJyYW5kczogICBAYnJhbmRzLFxuICAgICAgICAgICAgIyB0YXNrczogICAgQHRhc2tzLFxuICAgICAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5sb2cgXCIje0FOU0kuZWwyfSN7dGFza19ycHJ9ICN7ZHRfcnByfVwiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGdldF9hdmVyYWdlc19ieV9icmFuZHM6IC0+XG4gICAgICAgIFIgPSB7fVxuICAgICAgICBmb3IgYnJhbmQsIHRyYWNrcyBvZiBAYnJhbmRzXG4gICAgICAgICAgdGFyZ2V0ID0gUlsgYnJhbmQgXSA9IHt9XG4gICAgICAgICAgZm9yIHRyYWNrLCBkdHMgb2YgdHJhY2tzXG4gICAgICAgICAgICB0YXJnZXRbIHRyYWNrIF0gPSAoIGR0cy5yZWR1Y2UgKCAoIGEsIGIgKSAtPiBhICsgYiApLCAwICkgLyBkdHMubGVuZ3RoXG4gICAgICAgIHJldHVybiBSXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHRpbWVpdCA9IGRvID0+XG4gICAgICBibSAgPSBuZXcgQmVuY2htYXJrZXIoKVxuICAgICAgUiAgID0gKCBQLi4uICkgLT4gYm0udGltZWl0IFAuLi5cbiAgICAgIG5hbWVpdCAndGltZWl0JywgUlxuICAgICAgUi5ibSA9IGJtXG4gICAgICByZXR1cm4gUlxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgQmVuY2htYXJrZXIsIGJpZ2ludF9mcm9tX2hydGltZSwgaHJ0aW1lX2FzX2JpZ2ludCwgdGltZWl0LCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
