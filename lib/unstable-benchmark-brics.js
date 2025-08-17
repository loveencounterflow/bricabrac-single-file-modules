(function() {
  'use strict';
  var UNSTABLE_BENCHMARK_BRICS,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_BENCHMARK_BRICS = {
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_benchmarking: function() {
      var A, ANSI_constants, bigint_from_hrtime, exports, get_percentage_bar, get_progress, hrtime_as_bigint, inf, timeit;
      ({get_percentage_bar} = (require('./unstable-brics')).require_progress_indicators());
      //---------------------------------------------------------------------------------------------------------
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
      A = ANSI_constants = {
        cr: '\x1b[1G', // Carriage Return; move to first column (CHA n — Cursor Horizontal Absolut)
        el0: '\x1b[0K', // EL Erase in Line; 0: from cursor to end
        el1: '\x1b[1K', // EL Erase in Line; 1: from cursor to beginning
        el2: '\x1b[2K' // EL Erase in Line; 2: entire line
      };
      
      //---------------------------------------------------------------------------------------------------------
      get_progress = function({total, name_rpr} = {}) {
        var divisor, processed, progress;
        if (total == null) {
          return progress = function() {
            throw new Error("Ω___4 must call with option `total` in order to use progress bar");
          };
        }
        //.......................................................................................................
        processed = -1;
        divisor = Math.round(total / 100);
        //.......................................................................................................
        return progress = function({delta = 1} = {}) {
          var percentage, percentage_rpr;
          processed += delta;
          if ((modulo(processed, divisor)) !== 0) {
            return null;
          }
          percentage = Math.round(processed / total * 100);
          percentage_rpr = percentage.toString().padStart(3);
          process.stdout.write(`${name_rpr} ${get_percentage_bar(percentage)} ${A.cr}`);
          return null;
        };
      };
      //---------------------------------------------------------------------------------------------------------
      timeit = function(cfg, fn) {
        var arity, dt, dt_rpr, name_rpr, progress, result, t0, t1;
        switch (arity = arguments.length) {
          case 1:
            [cfg, fn] = [{}, cfg];
            break;
          case 2:
            null;
            break;
          default:
            throw new Error(`Ω___4 expected 1 or 2 arguments, got ${arity}`);
        }
        //.......................................................................................................
        cfg = {...{
            total: null
          }, ...cfg};
        name_rpr = (fn.name + ':').padEnd(40, ' ');
        progress = get_progress({
          total: cfg.total,
          name_rpr
        });
        t0 = hrtime_as_bigint();
        result = fn({progress});
        t1 = hrtime_as_bigint();
        dt = (Number(t1 - t0)) / 1_000_000;
        //  locale: 'en-US', numberingSystem: 'latn', style: 'decimal', minimumIntegerDigits: 1, minimumFractionDigits: 0,
        // maximumFractionDigits: 3, useGrouping: 'auto', notation: 'standard', signDisplay: 'auto', roundingIncrement: 1,
        // roundingMode: 'halfExpand', roundingPriority: 'auto', trailingZeroDisplay: 'auto' }
        dt_rpr = inf.format(dt);
        dt_rpr = dt_rpr.padStart(20, ' ');
        console.log(`${A.el2}${name_rpr} ${dt_rpr}`);
        return result;
      };
      //.........................................................................................................
      return exports = {bigint_from_hrtime, hrtime_as_bigint, timeit};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BENCHMARK_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJlbmNobWFyay1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQSwyREFBQTs7Ozs7RUFLQSx3QkFBQSxHQUlFLENBQUE7OztJQUFBLG9CQUFBLEVBQXNCLFFBQUEsQ0FBQSxDQUFBO0FBQ3hCLFVBQUEsQ0FBQSxFQUFBLGNBQUEsRUFBQSxrQkFBQSxFQUFBLE9BQUEsRUFBQSxrQkFBQSxFQUFBLFlBQUEsRUFBQSxnQkFBQSxFQUFBLEdBQUEsRUFBQTtNQUFJLENBQUEsQ0FBRSxrQkFBRixDQUFBLEdBQTBCLENBQUUsT0FBQSxDQUFRLGtCQUFSLENBQUYsQ0FBOEIsQ0FBQywyQkFBL0IsQ0FBQSxDQUExQixFQUFKOztNQUdJLGtCQUFBLEdBQXNCLFFBQUEsQ0FBQyxDQUFFLENBQUYsRUFBSyxFQUFMLENBQUQsQ0FBQTtlQUFpQixDQUFFLE1BQUEsQ0FBTyxDQUFQLENBQUYsQ0FBQSxHQUFlLGNBQWYsR0FBZ0MsQ0FBRSxNQUFBLENBQU8sRUFBUCxDQUFGO01BQWpEO01BQ3RCLGdCQUFBLEdBQW9DLFFBQUEsQ0FBQSxDQUFBO2VBQUcsa0JBQUEsQ0FBbUIsT0FBTyxDQUFDLE1BQVIsQ0FBQSxDQUFuQjtNQUFIO01BQ3BDLEdBQUEsR0FBc0IsSUFBSSxJQUFJLENBQUMsWUFBVCxDQUFzQixPQUF0QixFQUErQjtRQUFFLHFCQUFBLEVBQXVCLENBQXpCO1FBQTRCLHFCQUFBLEVBQXVCO01BQW5ELENBQS9CO01BQ3RCLENBQUEsR0FBSSxjQUFBLEdBQ0Y7UUFBQSxFQUFBLEVBQU0sU0FBTjtRQUNBLEdBQUEsRUFBTSxTQUROO1FBRUEsR0FBQSxFQUFNLFNBRk47UUFHQSxHQUFBLEVBQU0sU0FITjtNQUFBLEVBUE47OztNQWFJLFlBQUEsR0FBZSxRQUFBLENBQUMsQ0FBRSxLQUFGLEVBQVMsUUFBVCxJQUFxQixDQUFB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b3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblVOU1RBQkxFX0JFTkNITUFSS19CUklDUyA9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfYmVuY2htYXJraW5nOiAtPlxuICAgIHsgZ2V0X3BlcmNlbnRhZ2VfYmFyLCB9ID0gKCByZXF1aXJlICcuL3Vuc3RhYmxlLWJyaWNzJyApLnJlcXVpcmVfcHJvZ3Jlc3NfaW5kaWNhdG9ycygpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYmlnaW50X2Zyb21faHJ0aW1lICA9IChbIHMsIG5zLCBdKSAgLT4gKCBCaWdJbnQgcyApICogMV8wMDBfMDAwXzAwMG4gKyAoIEJpZ0ludCBucyApXG4gICAgaHJ0aW1lX2FzX2JpZ2ludCAgICA9ICAgICAgICAgICAgICAgLT4gYmlnaW50X2Zyb21faHJ0aW1lIHByb2Nlc3MuaHJ0aW1lKClcbiAgICBpbmYgICAgICAgICAgICAgICAgID0gbmV3IEludGwuTnVtYmVyRm9ybWF0ICdlbi1VUycsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAzLCBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDN9XG4gICAgQSA9IEFOU0lfY29uc3RhbnRzICA9XG4gICAgICBjcjogICAnXFx4MWJbMUcnICAgICAgICMgQ2FycmlhZ2UgUmV0dXJuOyBtb3ZlIHRvIGZpcnN0IGNvbHVtbiAoQ0hBIG4g4oCUIEN1cnNvciBIb3Jpem9udGFsIEFic29sdXQpXG4gICAgICBlbDA6ICAnXFx4MWJbMEsnICAgICAgICMgRUwgRXJhc2UgaW4gTGluZTsgMDogZnJvbSBjdXJzb3IgdG8gZW5kXG4gICAgICBlbDE6ICAnXFx4MWJbMUsnICAgICAgICMgRUwgRXJhc2UgaW4gTGluZTsgMTogZnJvbSBjdXJzb3IgdG8gYmVnaW5uaW5nXG4gICAgICBlbDI6ICAnXFx4MWJbMksnICAgICAgICMgRUwgRXJhc2UgaW4gTGluZTsgMjogZW50aXJlIGxpbmVcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfcHJvZ3Jlc3MgPSAoeyB0b3RhbCwgbmFtZV9ycHIsIH09e30pIC0+XG4gICAgICB1bmxlc3MgdG90YWw/XG4gICAgICAgIHJldHVybiBwcm9ncmVzcyA9IC0+IHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBtdXN0IGNhbGwgd2l0aCBvcHRpb24gYHRvdGFsYCBpbiBvcmRlciB0byB1c2UgcHJvZ3Jlc3MgYmFyXCJcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBwcm9jZXNzZWQgPSAtMVxuICAgICAgZGl2aXNvciAgID0gTWF0aC5yb3VuZCB0b3RhbCAvIDEwMFxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHJldHVybiBwcm9ncmVzcyA9ICh7IGRlbHRhID0gMSwgfT17fSkgLT5cbiAgICAgICAgcHJvY2Vzc2VkICAgICAgKz0gZGVsdGE7IHJldHVybiBudWxsIHVubGVzcyAoIHByb2Nlc3NlZCAlJSBkaXZpc29yICkgaXMgMFxuICAgICAgICBwZXJjZW50YWdlICAgICAgPSBNYXRoLnJvdW5kIHByb2Nlc3NlZCAvIHRvdGFsICogMTAwXG4gICAgICAgIHBlcmNlbnRhZ2VfcnByICA9IHBlcmNlbnRhZ2UudG9TdHJpbmcoKS5wYWRTdGFydCAzXG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlIFwiI3tuYW1lX3Jwcn0gI3tnZXRfcGVyY2VudGFnZV9iYXIgcGVyY2VudGFnZX0gI3tBLmNyfVwiXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdGltZWl0ID0gKCBjZmcsIGZuICkgLT5cbiAgICAgIHN3aXRjaCBhcml0eSA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgd2hlbiAxIHRoZW4gWyBjZmcsIGZuLCBdID0gWyB7fSwgY2ZnLCBdXG4gICAgICAgIHdoZW4gMiB0aGVuIG51bGxcbiAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgZXhwZWN0ZWQgMSBvciAyIGFyZ3VtZW50cywgZ290ICN7YXJpdHl9XCJcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBjZmcgICAgICAgICAgID0geyB7IHRvdGFsOiBudWxsLCB9Li4uLCBjZmcuLi4sIH1cbiAgICAgIG5hbWVfcnByICAgICAgPSAoIGZuLm5hbWUgKyAnOicgKS5wYWRFbmQgNDAsICcgJ1xuICAgICAgcHJvZ3Jlc3MgICAgICA9IGdldF9wcm9ncmVzcyB7IHRvdGFsOiBjZmcudG90YWwsIG5hbWVfcnByLCB9XG4gICAgICB0MCAgICAgICAgICAgID0gaHJ0aW1lX2FzX2JpZ2ludCgpXG4gICAgICByZXN1bHQgICAgICAgID0gZm4geyBwcm9ncmVzcywgfVxuICAgICAgdDEgICAgICAgICAgICA9IGhydGltZV9hc19iaWdpbnQoKVxuICAgICAgZHQgICAgICAgICAgICA9ICggTnVtYmVyIHQxIC0gdDAgKSAvIDFfMDAwXzAwMFxuICAgICAgIyAgbG9jYWxlOiAnZW4tVVMnLCBudW1iZXJpbmdTeXN0ZW06ICdsYXRuJywgc3R5bGU6ICdkZWNpbWFsJywgbWluaW11bUludGVnZXJEaWdpdHM6IDEsIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMCxcbiAgICAgICMgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAzLCB1c2VHcm91cGluZzogJ2F1dG8nLCBub3RhdGlvbjogJ3N0YW5kYXJkJywgc2lnbkRpc3BsYXk6ICdhdXRvJywgcm91bmRpbmdJbmNyZW1lbnQ6IDEsXG4gICAgICAjIHJvdW5kaW5nTW9kZTogJ2hhbGZFeHBhbmQnLCByb3VuZGluZ1ByaW9yaXR5OiAnYXV0bycsIHRyYWlsaW5nWmVyb0Rpc3BsYXk6ICdhdXRvJyB9XG4gICAgICBkdF9ycHIgICAgICAgID0gaW5mLmZvcm1hdCBkdFxuICAgICAgZHRfcnByICAgICAgICA9IGR0X3Jwci5wYWRTdGFydCAyMCwgJyAnXG4gICAgICBjb25zb2xlLmxvZyBcIiN7QS5lbDJ9I3tuYW1lX3Jwcn0gI3tkdF9ycHJ9XCJcbiAgICAgIHJldHVybiByZXN1bHRcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgYmlnaW50X2Zyb21faHJ0aW1lLCBocnRpbWVfYXNfYmlnaW50LCB0aW1laXQsIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBVTlNUQUJMRV9CRU5DSE1BUktfQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-benchmark-brics.coffee