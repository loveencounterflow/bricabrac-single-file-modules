(function() {
  'use strict';
  var UNSTABLE_BENCHMARK_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_BENCHMARK_BRICS = {
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_benchmarking: function() {
      var bigint_from_hrtime, exports, hrtime_as_bigint;
      // CP = require 'node:child_process'
      bigint_from_hrtime = function([s, ns]) {
        return (BigInt(s)) * 1_000_000_000n + (BigInt(ns));
      };
      hrtime_as_bigint = function() {
        return bigint_from_hrtime(process.hrtime());
      };
      //.......................................................................................................
      return exports = {bigint_from_hrtime, hrtime_as_bigint};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_BENCHMARK_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJlbmNobWFyay1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7Ozs7O0VBS0Esd0JBQUEsR0FJRSxDQUFBOzs7SUFBQSxvQkFBQSxFQUFzQixRQUFBLENBQUEsQ0FBQTtBQUN4QixVQUFBLGtCQUFBLEVBQUEsT0FBQSxFQUFBLGdCQUFBOztNQUNJLGtCQUFBLEdBQXNCLFFBQUEsQ0FBQyxDQUFFLENBQUYsRUFBSyxFQUFMLENBQUQsQ0FBQTtlQUFpQixDQUFFLE1BQUEsQ0FBTyxDQUFQLENBQUYsQ0FBQSxHQUFlLGNBQWYsR0FBZ0MsQ0FBRSxNQUFBLENBQU8sRUFBUCxDQUFGO01BQWpEO01BQ3RCLGdCQUFBLEdBQW9DLFFBQUEsQ0FBQSxDQUFBO2VBQUcsa0JBQUEsQ0FBbUIsT0FBTyxDQUFDLE1BQVIsQ0FBQSxDQUFuQjtNQUFILEVBRnhDOztBQUtJLGFBQU8sT0FBQSxHQUFVLENBQUUsa0JBQUYsRUFBc0IsZ0JBQXRCO0lBTkc7RUFBdEIsRUFURjs7O0VBa0JBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLHdCQUE5QjtBQWxCQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQkVOQ0hNQVJLX0JSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9iZW5jaG1hcmtpbmc6IC0+XG4gICAgIyBDUCA9IHJlcXVpcmUgJ25vZGU6Y2hpbGRfcHJvY2VzcydcbiAgICBiaWdpbnRfZnJvbV9ocnRpbWUgID0gKFsgcywgbnMsIF0pICAtPiAoIEJpZ0ludCBzICkgKiAxXzAwMF8wMDBfMDAwbiArICggQmlnSW50IG5zIClcbiAgICBocnRpbWVfYXNfYmlnaW50ICAgID0gICAgICAgICAgICAgICAtPiBiaWdpbnRfZnJvbV9ocnRpbWUgcHJvY2Vzcy5ocnRpbWUoKVxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgYmlnaW50X2Zyb21faHJ0aW1lLCBocnRpbWVfYXNfYmlnaW50LCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgVU5TVEFCTEVfQkVOQ0hNQVJLX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-benchmark-brics.coffee