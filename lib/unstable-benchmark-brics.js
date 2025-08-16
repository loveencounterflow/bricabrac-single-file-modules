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
      var bigint_from_hrtime, exports, get_percentage_bar, get_progress, hrtime_as_bigint, inf, timeit;
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
          var cr, percentage, percentage_rpr;
          processed += delta;
          if ((modulo(processed, divisor)) !== 0) {
            return;
          }
          percentage = Math.round(processed / total * 100);
          percentage_rpr = percentage.toString().padStart(3);
          // console.log "Ω___4 total: #{total}, processed: #{processed}, percentage: #{percentage}"
          cr = "\x1b[1G"; // Carriage Return; move to first column
          process.stdout.write(`${name_rpr} ${get_percentage_bar(percentage)} ${cr}`);
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
        console.log(`${name_rpr} ${dt_rpr}`.padEnd(100));
        return result;
      };
      //.........................................................................................................
      return exports = {bigint_from_hrtime, hrtime_as_bigint, timeit};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BENCHMARK_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJlbmNobWFyay1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQSwyREFBQTs7Ozs7RUFLQSx3QkFBQSxHQUlFLENBQUE7OztJQUFBLG9CQUFBLEVBQXNCLFFBQUEsQ0FBQSxDQUFBO0FBQ3hCLFVBQUEsa0JBQUEsRUFBQSxPQUFBLEVBQUEsa0JBQUEsRUFBQSxZQUFBLEVBQUEsZ0JBQUEsRUFBQSxHQUFBLEVBQUE7TUFBSSxDQUFBLENBQUUsa0JBQUYsQ0FBQSxHQUEwQixDQUFFLE9BQUEsQ0FBUSxrQkFBUixDQUFGLENBQThCLENBQUMsMkJBQS9CLENBQUEsQ0FBMUIsRUFBSjs7TUFHSSxrQkFBQSxHQUFzQixRQUFBLENBQUMsQ0FBRSxDQUFGLEVBQUssRUFBTCxDQUFELENBQUE7ZUFBaUIsQ0FBRSxNQUFBLENBQU8sQ0FBUCxDQUFGLENBQUEsR0FBZSxjQUFmLEdBQWdDLENBQUUsTUFBQSxDQUFPLEVBQVAsQ0FBRjtNQUFqRDtNQUN0QixnQkFBQSxHQUFvQyxRQUFBLENBQUEsQ0FBQTtlQUFHLGtCQUFBLENBQW1CLE9BQU8sQ0FBQyxNQUFSLENBQUEsQ0FBbkI7TUFBSDtNQUNwQyxHQUFBLEdBQXNCLElBQUksSUFBSSxDQUFDLFlBQVQsQ0FBc0IsT0FBdEIsRUFBK0I7UUFBRSxxQkFBQSxFQUF1QixDQUF6QjtRQUE0QixxQkFBQSxFQUF1QjtNQUFuRCxDQUEvQixFQUwxQjs7TUFRSSxZQUFBLEdBQWUsUUFBQSxDQUFDLENBQUUsS0FBRixFQUFTLFFBQVQsSUFBcUIsQ0FBQSxDQUF0QixDQUFBO0FBQ25CLFlBQUEsT0FBQSxFQUFBLFNBQUEsRUFBQTtRQUFNLElBQU8sYUFBUDtBQUNFLGlCQUFPLFFBQUEsR0FBVyxRQUFBLENBQUEsQ0FBQTtZQUFHLE1BQU0sSUFBSSxLQUFKLENBQVUsa0VBQVY7VUFBVCxFQURwQjtTQUFOOztRQUdNLFNBQUEsR0FBWSxDQUFDO1FBQ2IsT0FBQSxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBQSxHQUFRLEdBQW5CLEVBSmxCOztBQU1NLGVBQU8sUUFBQSxHQUFXLFFBQUEsQ0FBQyxDQUFFLEtBQUEsR0FBUSxDQUFWLElBQWUsQ0FBQSxDQUFoQixDQUFBO0FBQ3hCLGNBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQTtVQUFRLFNBQUEsSUFBYTtVQUNiLElBQWMsUUFBRSxXQUFhLFFBQWYsQ0FBQSxLQUE0QixDQUExQztBQUFBLG1CQUFBOztVQUNBLFVBQUEsR0FBa0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFBLEdBQVksS0FBWixHQUFvQixHQUEvQjtVQUNsQixjQUFBLEdBQWtCLFVBQVUsQ0FBQyxRQUFYLENBQUEsQ0FBcUIsQ0FBQyxRQUF0QixDQUErQixDQUEvQixFQUgxQjs7VUFLUSxFQUFBLEdBQUssVUFMYjtVQU1RLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixDQUFBLENBQUEsQ0FBRyxRQUFILEVBQUEsQ0FBQSxDQUFlLGtCQUFBLENBQW1CLFVBQW5CLENBQWYsRUFBQSxDQUFBLENBQWdELEVBQWhELENBQUEsQ0FBckI7QUFDQSxpQkFBTztRQVJTO01BUEwsRUFSbkI7O01BMEJJLE1BQUEsR0FBUyxRQUFBLENBQUUsR0FBRixFQUFPLEVBQVAsQ0FBQTtBQUNiLFlBQUEsS0FBQSxFQUFBLEVBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBO0FBQU0sZ0JBQU8sS0FBQSxHQUFRLFNBQVMsQ0FBQyxNQUF6QjtBQUFBLGVBQ08sQ0FEUDtZQUNjLENBQUUsR0FBRixFQUFPLEVBQVAsQ0FBQSxHQUFlLENBQUUsQ0FBQSxDQUFGLEVBQU0sR0FBTjtBQUF0QjtBQURQLGVBRU8sQ0FGUDtZQUVjO0FBQVA7QUFGUDtZQUdPLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSxxQ0FBQSxDQUFBLENBQXdDLEtBQXhDLENBQUEsQ0FBVjtBQUhiLFNBQU47O1FBS00sR0FBQSxHQUFnQixDQUFFLEdBQUE7WUFBRSxLQUFBLEVBQU87VUFBVCxDQUFGLEVBQXVCLEdBQUEsR0FBdkI7UUFDaEIsUUFBQSxHQUFnQixDQUFFLEVBQUUsQ0FBQyxJQUFILEdBQVUsR0FBWixDQUFpQixDQUFDLE1BQWxCLENBQXlCLEVBQXpCLEVBQTZCLEdBQTdCO1FBQ2hCLFFBQUEsR0FBZ0IsWUFBQSxDQUFhO1VBQUUsS0FBQSxFQUFPLEdBQUcsQ0FBQyxLQUFiO1VBQW9CO1FBQXBCLENBQWI7UUFDaEIsRUFBQSxHQUFnQixnQkFBQSxDQUFBO1FBQ2hCLE1BQUEsR0FBZ0IsRUFBQSxDQUFHLENBQUUsUUFBRixDQUFIO1FBQ2hCLEVBQUEsR0FBZ0IsZ0JBQUEsQ0FBQTtRQUNoQixFQUFBLEdBQWdCLENBQUUsTUFBQSxDQUFPLEVBQUEsR0FBSyxFQUFaLENBQUYsQ0FBQSxHQUFxQixVQVgzQzs7OztRQWVNLE1BQUEsR0FBZ0IsR0FBRyxDQUFDLE1BQUosQ0FBVyxFQUFYO1FBQ2hCLE1BQUEsR0FBZ0IsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsRUFBaEIsRUFBb0IsR0FBcEI7UUFDaEIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFBLENBQUEsQ0FBRyxRQUFILEVBQUEsQ0FBQSxDQUFlLE1BQWYsQ0FBQSxDQUF1QixDQUFDLE1BQXhCLENBQStCLEdBQS9CLENBQVo7QUFDQSxlQUFPO01BbkJBLEVBMUJiOztBQWdESSxhQUFPLE9BQUEsR0FBVSxDQUFFLGtCQUFGLEVBQXNCLGdCQUF0QixFQUF3QyxNQUF4QztJQWpERztFQUF0QixFQVRGOzs7RUE2REEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsd0JBQTlCO0FBN0RBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9CRU5DSE1BUktfQlJJQ1MgPVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2JlbmNobWFya2luZzogLT5cbiAgICB7IGdldF9wZXJjZW50YWdlX2JhciwgfSA9ICggcmVxdWlyZSAnLi91bnN0YWJsZS1icmljcycgKS5yZXF1aXJlX3Byb2dyZXNzX2luZGljYXRvcnMoKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJpZ2ludF9mcm9tX2hydGltZSAgPSAoWyBzLCBucywgXSkgIC0+ICggQmlnSW50IHMgKSAqIDFfMDAwXzAwMF8wMDBuICsgKCBCaWdJbnQgbnMgKVxuICAgIGhydGltZV9hc19iaWdpbnQgICAgPSAgICAgICAgICAgICAgIC0+IGJpZ2ludF9mcm9tX2hydGltZSBwcm9jZXNzLmhydGltZSgpXG4gICAgaW5mICAgICAgICAgICAgICAgICA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCAnZW4tVVMnLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMywgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAzfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9wcm9ncmVzcyA9ICh7IHRvdGFsLCBuYW1lX3JwciwgfT17fSkgLT5cbiAgICAgIHVubGVzcyB0b3RhbD9cbiAgICAgICAgcmV0dXJuIHByb2dyZXNzID0gLT4gdGhyb3cgbmV3IEVycm9yIFwizqlfX180IG11c3QgY2FsbCB3aXRoIG9wdGlvbiBgdG90YWxgIGluIG9yZGVyIHRvIHVzZSBwcm9ncmVzcyBiYXJcIlxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHByb2Nlc3NlZCA9IC0xXG4gICAgICBkaXZpc29yICAgPSBNYXRoLnJvdW5kIHRvdGFsIC8gMTAwXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgcmV0dXJuIHByb2dyZXNzID0gKHsgZGVsdGEgPSAxLCB9PXt9KSAtPlxuICAgICAgICBwcm9jZXNzZWQgKz0gZGVsdGFcbiAgICAgICAgcmV0dXJuIHVubGVzcyAoIHByb2Nlc3NlZCAlJSBkaXZpc29yICkgaXMgMFxuICAgICAgICBwZXJjZW50YWdlICAgICAgPSBNYXRoLnJvdW5kIHByb2Nlc3NlZCAvIHRvdGFsICogMTAwXG4gICAgICAgIHBlcmNlbnRhZ2VfcnByICA9IHBlcmNlbnRhZ2UudG9TdHJpbmcoKS5wYWRTdGFydCAzXG4gICAgICAgICMgY29uc29sZS5sb2cgXCLOqV9fXzQgdG90YWw6ICN7dG90YWx9LCBwcm9jZXNzZWQ6ICN7cHJvY2Vzc2VkfSwgcGVyY2VudGFnZTogI3twZXJjZW50YWdlfVwiXG4gICAgICAgIGNyID0gXCJcXHgxYlsxR1wiICAgICAgICMgQ2FycmlhZ2UgUmV0dXJuOyBtb3ZlIHRvIGZpcnN0IGNvbHVtblxuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSBcIiN7bmFtZV9ycHJ9ICN7Z2V0X3BlcmNlbnRhZ2VfYmFyIHBlcmNlbnRhZ2V9ICN7Y3J9XCJcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB0aW1laXQgPSAoIGNmZywgZm4gKSAtPlxuICAgICAgc3dpdGNoIGFyaXR5ID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICB3aGVuIDEgdGhlbiBbIGNmZywgZm4sIF0gPSBbIHt9LCBjZmcsIF1cbiAgICAgICAgd2hlbiAyIHRoZW4gbnVsbFxuICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBleHBlY3RlZCAxIG9yIDIgYXJndW1lbnRzLCBnb3QgI3thcml0eX1cIlxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGNmZyAgICAgICAgICAgPSB7IHsgdG90YWw6IG51bGwsIH0uLi4sIGNmZy4uLiwgfVxuICAgICAgbmFtZV9ycHIgICAgICA9ICggZm4ubmFtZSArICc6JyApLnBhZEVuZCA0MCwgJyAnXG4gICAgICBwcm9ncmVzcyAgICAgID0gZ2V0X3Byb2dyZXNzIHsgdG90YWw6IGNmZy50b3RhbCwgbmFtZV9ycHIsIH1cbiAgICAgIHQwICAgICAgICAgICAgPSBocnRpbWVfYXNfYmlnaW50KClcbiAgICAgIHJlc3VsdCAgICAgICAgPSBmbiB7IHByb2dyZXNzLCB9XG4gICAgICB0MSAgICAgICAgICAgID0gaHJ0aW1lX2FzX2JpZ2ludCgpXG4gICAgICBkdCAgICAgICAgICAgID0gKCBOdW1iZXIgdDEgLSB0MCApIC8gMV8wMDBfMDAwXG4gICAgICAjICBsb2NhbGU6ICdlbi1VUycsIG51bWJlcmluZ1N5c3RlbTogJ2xhdG4nLCBzdHlsZTogJ2RlY2ltYWwnLCBtaW5pbXVtSW50ZWdlckRpZ2l0czogMSwgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAwLFxuICAgICAgIyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDMsIHVzZUdyb3VwaW5nOiAnYXV0bycsIG5vdGF0aW9uOiAnc3RhbmRhcmQnLCBzaWduRGlzcGxheTogJ2F1dG8nLCByb3VuZGluZ0luY3JlbWVudDogMSxcbiAgICAgICMgcm91bmRpbmdNb2RlOiAnaGFsZkV4cGFuZCcsIHJvdW5kaW5nUHJpb3JpdHk6ICdhdXRvJywgdHJhaWxpbmdaZXJvRGlzcGxheTogJ2F1dG8nIH1cbiAgICAgIGR0X3JwciAgICAgICAgPSBpbmYuZm9ybWF0IGR0XG4gICAgICBkdF9ycHIgICAgICAgID0gZHRfcnByLnBhZFN0YXJ0IDIwLCAnICdcbiAgICAgIGNvbnNvbGUubG9nIFwiI3tuYW1lX3Jwcn0gI3tkdF9ycHJ9XCIucGFkRW5kIDEwMFxuICAgICAgcmV0dXJuIHJlc3VsdFxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBiaWdpbnRfZnJvbV9ocnRpbWUsIGhydGltZV9hc19iaWdpbnQsIHRpbWVpdCwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0JFTkNITUFSS19CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-benchmark-brics.coffee