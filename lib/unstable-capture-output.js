(function() {
  'use strict';
  var BRICS;

  //###########################################################################################################

  //===========================================================================================================
  BRICS = {
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_capture_output: function() {
      var capture_output, exports, with_capture_output, with_capture_output_async, with_capture_output_sync;
      //-------------------------------------------------------------------------------------------------------
      capture_output = function(handler) {
        /* TAINT validate */
        var old_stderr_write, old_stdout_write, reset_output;
        old_stdout_write = process.stdout.write;
        old_stderr_write = process.stderr.write;
        process.stdout.write = function(text, ...P) {
          return handler(text, ...P);
        };
        process.stderr.write = function(text, ...P) {
          return handler(text, ...P);
        };
        reset_output = function() {
          process.stdout.write = old_stdout_write;
          process.stderr.write = old_stderr_write;
          return null;
        };
        return {reset_output};
      };
      //-------------------------------------------------------------------------------------------------------
      with_capture_output = function(handler, fn) {
        if ((Object.prototype.toString.call(fn)) === '[object AsyncFunction]') {
          return with_capture_output_async(handler, fn);
        }
        return with_capture_output_sync(handler, fn);
      };
      //-------------------------------------------------------------------------------------------------------
      with_capture_output_sync = function(handler, fn) {
        /* TAINT validate */
        var reset_output;
        try {
          ({reset_output} = capture_output(handler));
          return fn();
        } finally {
          reset_output();
        }
      };
      //-------------------------------------------------------------------------------------------------------
      with_capture_output_async = async function(handler, fn) {
        /* TAINT validate */
        var reset_output;
        try {
          ({reset_output} = capture_output(handler));
          return (await fn());
        } finally {
          reset_output();
        }
      };
      //.......................................................................................................
      return exports = {capture_output, with_capture_output, with_capture_output_sync, with_capture_output_async};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWNhcHR1cmUtb3V0cHV0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBOzs7OztFQUtBLEtBQUEsR0FJRSxDQUFBOzs7SUFBQSxzQkFBQSxFQUF3QixRQUFBLENBQUEsQ0FBQTtBQUUxQixVQUFBLGNBQUEsRUFBQSxPQUFBLEVBQUEsbUJBQUEsRUFBQSx5QkFBQSxFQUFBLHdCQUFBOztNQUNJLGNBQUEsR0FBaUIsUUFBQSxDQUFFLE9BQUYsQ0FBQSxFQUFBOztBQUNyQixZQUFBLGdCQUFBLEVBQUEsZ0JBQUEsRUFBQTtRQUNNLGdCQUFBLEdBQXdCLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDdkMsZ0JBQUEsR0FBd0IsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN2QyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQWYsR0FBd0IsUUFBQSxDQUFFLElBQUYsRUFBQSxHQUFRLENBQVIsQ0FBQTtpQkFBa0IsT0FBQSxDQUFRLElBQVIsRUFBYyxHQUFBLENBQWQ7UUFBbEI7UUFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLEdBQXdCLFFBQUEsQ0FBRSxJQUFGLEVBQUEsR0FBUSxDQUFSLENBQUE7aUJBQWtCLE9BQUEsQ0FBUSxJQUFSLEVBQWMsR0FBQSxDQUFkO1FBQWxCO1FBQ3hCLFlBQUEsR0FBd0IsUUFBQSxDQUFBLENBQUE7VUFDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLEdBQXdCO1VBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixHQUF3QjtBQUN4QixpQkFBTztRQUhlO0FBSXhCLGVBQU8sQ0FBRSxZQUFGO01BVlEsRUFEckI7O01BY0ksbUJBQUEsR0FBc0IsUUFBQSxDQUFFLE9BQUYsRUFBVyxFQUFYLENBQUE7UUFDcEIsSUFBZ0QsQ0FBRSxNQUFNLENBQUEsU0FBRSxDQUFBLFFBQVEsQ0FBQyxJQUFqQixDQUFzQixFQUF0QixDQUFGLENBQUEsS0FBZ0Msd0JBQWhGO0FBQUEsaUJBQU8seUJBQUEsQ0FBMEIsT0FBMUIsRUFBbUMsRUFBbkMsRUFBUDs7QUFDQSxlQUFPLHdCQUFBLENBQTBCLE9BQTFCLEVBQW1DLEVBQW5DO01BRmEsRUFkMUI7O01BbUJJLHdCQUFBLEdBQTJCLFFBQUEsQ0FBRSxPQUFGLEVBQVcsRUFBWCxDQUFBLEVBQUE7O0FBQy9CLFlBQUE7QUFDTTtVQUNFLENBQUEsQ0FBRSxZQUFGLENBQUEsR0FBb0IsY0FBQSxDQUFlLE9BQWYsQ0FBcEI7QUFDQSxpQkFBTyxFQUFBLENBQUEsRUFGVDtTQUFBO1VBSUUsWUFBQSxDQUFBLEVBSkY7O01BRnlCLEVBbkIvQjs7TUE0QkkseUJBQUEsR0FBNEIsTUFBQSxRQUFBLENBQUUsT0FBRixFQUFXLEVBQVgsQ0FBQSxFQUFBOztBQUNoQyxZQUFBO0FBQ007VUFDRSxDQUFBLENBQUUsWUFBRixDQUFBLEdBQW9CLGNBQUEsQ0FBZSxPQUFmLENBQXBCO0FBQ0EsaUJBQU8sQ0FBQSxNQUFNLEVBQUEsQ0FBQSxDQUFOLEVBRlQ7U0FBQTtVQUlFLFlBQUEsQ0FBQSxFQUpGOztNQUYwQixFQTVCaEM7O0FBcUNJLGFBQU8sT0FBQSxHQUFVLENBQ2YsY0FEZSxFQUVmLG1CQUZlLEVBR2Ysd0JBSGUsRUFJZix5QkFKZTtJQXZDSztFQUF4QixFQVRGOzs7RUF1REEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsS0FBOUI7QUF2REEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY2FwdHVyZV9vdXRwdXQ6IC0+XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNhcHR1cmVfb3V0cHV0ID0gKCBoYW5kbGVyICkgLT5cbiAgICAgICMjIyBUQUlOVCB2YWxpZGF0ZSAjIyNcbiAgICAgIG9sZF9zdGRvdXRfd3JpdGUgICAgICA9IHByb2Nlc3Muc3Rkb3V0LndyaXRlXG4gICAgICBvbGRfc3RkZXJyX3dyaXRlICAgICAgPSBwcm9jZXNzLnN0ZGVyci53cml0ZVxuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgID0gKCB0ZXh0LCBQLi4uICkgLT4gaGFuZGxlciB0ZXh0LCBQLi4uXG4gICAgICBwcm9jZXNzLnN0ZGVyci53cml0ZSAgPSAoIHRleHQsIFAuLi4gKSAtPiBoYW5kbGVyIHRleHQsIFAuLi5cbiAgICAgIHJlc2V0X291dHB1dCAgICAgICAgICA9IC0+XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlICA9IG9sZF9zdGRvdXRfd3JpdGVcbiAgICAgICAgcHJvY2Vzcy5zdGRlcnIud3JpdGUgID0gb2xkX3N0ZGVycl93cml0ZVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgcmV0dXJuIHsgcmVzZXRfb3V0cHV0LCB9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHdpdGhfY2FwdHVyZV9vdXRwdXQgPSAoIGhhbmRsZXIsIGZuICkgLT5cbiAgICAgIHJldHVybiB3aXRoX2NhcHR1cmVfb3V0cHV0X2FzeW5jIGhhbmRsZXIsIGZuIGlmICggT2JqZWN0Ojp0b1N0cmluZy5jYWxsIGZuICkgaXMgJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nXG4gICAgICByZXR1cm4gd2l0aF9jYXB0dXJlX291dHB1dF9zeW5jICBoYW5kbGVyLCBmblxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB3aXRoX2NhcHR1cmVfb3V0cHV0X3N5bmMgPSAoIGhhbmRsZXIsIGZuICkgLT5cbiAgICAgICMjIyBUQUlOVCB2YWxpZGF0ZSAjIyNcbiAgICAgIHRyeVxuICAgICAgICB7IHJlc2V0X291dHB1dCwgfSA9IGNhcHR1cmVfb3V0cHV0IGhhbmRsZXJcbiAgICAgICAgcmV0dXJuIGZuKClcbiAgICAgIGZpbmFsbHlcbiAgICAgICAgcmVzZXRfb3V0cHV0KClcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgd2l0aF9jYXB0dXJlX291dHB1dF9hc3luYyA9ICggaGFuZGxlciwgZm4gKSAtPlxuICAgICAgIyMjIFRBSU5UIHZhbGlkYXRlICMjI1xuICAgICAgdHJ5XG4gICAgICAgIHsgcmVzZXRfb3V0cHV0LCB9ID0gY2FwdHVyZV9vdXRwdXQgaGFuZGxlclxuICAgICAgICByZXR1cm4gYXdhaXQgZm4oKVxuICAgICAgZmluYWxseVxuICAgICAgICByZXNldF9vdXRwdXQoKVxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIGNhcHR1cmVfb3V0cHV0LFxuICAgICAgd2l0aF9jYXB0dXJlX291dHB1dCxcbiAgICAgIHdpdGhfY2FwdHVyZV9vdXRwdXRfc3luYyxcbiAgICAgIHdpdGhfY2FwdHVyZV9vdXRwdXRfYXN5bmMsIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBCUklDU1xuXG4iXX0=
