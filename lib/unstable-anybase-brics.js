(function() {
  'use strict';
  var BRICS, debug;

  //===========================================================================================================
  ({debug} = console);

  //###########################################################################################################

  //===========================================================================================================
  BRICS = {
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_anybase: function() {
      var decode, encode, exports, rpr;
      ({
        show_no_colors: rpr
      } = (require('..')).unstable.require_show());
      
    function encode_bigint(num, alphabet) {
      if (typeof num === "number") num = BigInt(num);
      if (num < 0n) throw new RangeError("Only nonnegative integers supported");
      if (num === 0n) return alphabet[0];

      const base = BigInt(alphabet.length);
      let result = "";

      while (num > 0n) {
        const rem = num % base;
        result = alphabet[Number(rem)] + result;
        num = num / base;
      }

      return result;
    }
    //-------------------------------------------------------------------------------------------------------
    /* thx to https://chatgpt.com/s/t_68b1810ab4708191bc841f078a6e0e66 */
    ;
      
    function decode_bigint(str, alphabet) {
      const base = BigInt(alphabet.length);
      const map = new Map(alphabet.split("").map((ch, i) => [ch, BigInt(i)]));

      let num = 0n;
      for (const ch of str) {
        const val = map.get(ch);
        if (val === undefined) throw new Error(`Invalid character: ${ch}`);
        num = num * base + val;
      }

      return num;
    }
    //-------------------------------------------------------------------------------------------------------
    /* thx to https://chatgpt.com/s/t_68b1810ab4708191bc841f078a6e0e66 */
    ;
      //-------------------------------------------------------------------------------------------------------
      /* TAINT fall back to `Number::toString()` where possible (but not for base 10 as it uses exponential notation) */
      encode = function(n, alphabet) {
        var R, base, remainder;
        if (n < 0) {
          throw new RangeError("Ωanyb___2 Only nonnegative integers supported");
        }
        if (n === 0) {
          return alphabet[0];
        }
        base = alphabet.length;
        R = '';
        while (n > 0) {
          remainder = n % base;
          R = alphabet[Number(remainder)] + R;
          n = Math.floor(n / base);
        }
        return R;
      };
      //-------------------------------------------------------------------------------------------------------
      /* TAINT avoid building map, use index */
      /* TAINT fall back to `Number()`, `parseInt()` where possible */
      decode = function(str, alphabet) {
        var R, base, chr, j, len, map, ref, val;
        base = alphabet.length;
        map = new Map(alphabet.split("").map((ch, i) => {
          return [ch, i];
        }));
        R = 0;
        ref = Array.from(str);
        for (j = 0, len = ref.length; j < len; j++) {
          chr = ref[j];
          val = map.get(chr);
          if (val == null) {
            throw new Error(`Ωanyb___2 Invalid character: ${rpr(chr)}`);
          }
          R = R * base + val;
        }
        return R;
      };
      //.......................................................................................................
      return exports = {encode, decode, encode_bigint, decode_bigint};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWFueWJhc2UtYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLEtBQUEsRUFBQSxLQUFBOzs7RUFHQSxDQUFBLENBQUUsS0FBRixDQUFBLEdBQWEsT0FBYixFQUhBOzs7OztFQVNBLEtBQUEsR0FJRSxDQUFBOzs7SUFBQSxlQUFBLEVBQWlCLFFBQUEsQ0FBQSxDQUFBO0FBQ25CLFVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUE7TUFBSSxDQUFBO1FBQUUsY0FBQSxFQUFnQjtNQUFsQixDQUFBLEdBQTRCLENBQUUsT0FBQSxDQUFRLElBQVIsQ0FBRixDQUFnQixDQUFDLFFBQVEsQ0FBQyxZQUExQixDQUFBLENBQTVCO01BSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BcUJBOzs7Ozs7Ozs7Ozs7Ozs7O0tBekJKOzs7TUEyQ0ksTUFBQSxHQUFTLFFBQUEsQ0FBRSxDQUFGLEVBQUssUUFBTCxDQUFBO0FBQ2IsWUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBO1FBQU0sSUFBd0UsQ0FBQSxHQUFJLENBQTVFO1VBQUEsTUFBTSxJQUFJLFVBQUosQ0FBZSwrQ0FBZixFQUFOOztRQUNBLElBQXNCLENBQUEsS0FBSyxDQUEzQjtBQUFBLGlCQUFPLFFBQVEsQ0FBQyxDQUFELEVBQWY7O1FBQ0EsSUFBQSxHQUFRLFFBQVEsQ0FBQztRQUNqQixDQUFBLEdBQVE7QUFDUixlQUFNLENBQUEsR0FBSSxDQUFWO1VBQ0UsU0FBQSxHQUFZLENBQUEsR0FBSTtVQUNoQixDQUFBLEdBQVksUUFBUSxDQUFFLE1BQUEsQ0FBTyxTQUFQLENBQUYsQ0FBUixHQUErQjtVQUMzQyxDQUFBLGNBQVksSUFBSztRQUhuQjtBQUlBLGVBQU87TUFUQSxFQTNDYjs7OztNQXlESSxNQUFBLEdBQVMsUUFBQSxDQUFFLEdBQUYsRUFBTyxRQUFQLENBQUE7QUFDYixZQUFBLENBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQTtRQUFNLElBQUEsR0FBUSxRQUFRLENBQUM7UUFDakIsR0FBQSxHQUFRLElBQUksR0FBSixDQUFRLFFBQVEsQ0FBQyxLQUFULENBQWUsRUFBZixDQUFrQixDQUFDLEdBQW5CLENBQXVCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBQSxHQUFBO2lCQUFXLENBQUMsRUFBRCxFQUFLLENBQUw7UUFBWCxDQUF2QixDQUFSO1FBQ1IsQ0FBQSxHQUFRO0FBQ1I7UUFBQSxLQUFBLHFDQUFBOztVQUNFLEdBQUEsR0FBTSxHQUFHLENBQUMsR0FBSixDQUFRLEdBQVI7VUFDTixJQUFpRSxXQUFqRTtZQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSw2QkFBQSxDQUFBLENBQWdDLEdBQUEsQ0FBSSxHQUFKLENBQWhDLENBQUEsQ0FBVixFQUFOOztVQUNBLENBQUEsR0FBSSxDQUFBLEdBQUksSUFBSixHQUFXO1FBSGpCO0FBSUEsZUFBTztNQVJBLEVBekRiOztBQW9FSSxhQUFPLE9BQUEsR0FBVSxDQUFFLE1BQUYsRUFBVSxNQUFWLEVBQWtCLGFBQWxCLEVBQWlDLGFBQWpDO0lBckVGO0VBQWpCLEVBYkY7OztFQXFGQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQXJGQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnsgZGVidWcsIH0gPSBjb25zb2xlXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfYW55YmFzZTogLT5cbiAgICB7IHNob3dfbm9fY29sb3JzOiBycHIsICB9ID0gKCByZXF1aXJlICcuLicgKS51bnN0YWJsZS5yZXF1aXJlX3Nob3coKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgdGh4IHRvIGh0dHBzOi8vY2hhdGdwdC5jb20vcy90XzY4YjE4MTBhYjQ3MDgxOTFiYzg0MWYwNzhhNmUwZTY2ICMjI1xuICAgIGBgYFxuICAgIGZ1bmN0aW9uIGVuY29kZV9iaWdpbnQobnVtLCBhbHBoYWJldCkge1xuICAgICAgaWYgKHR5cGVvZiBudW0gPT09IFwibnVtYmVyXCIpIG51bSA9IEJpZ0ludChudW0pO1xuICAgICAgaWYgKG51bSA8IDBuKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIk9ubHkgbm9ubmVnYXRpdmUgaW50ZWdlcnMgc3VwcG9ydGVkXCIpO1xuICAgICAgaWYgKG51bSA9PT0gMG4pIHJldHVybiBhbHBoYWJldFswXTtcblxuICAgICAgY29uc3QgYmFzZSA9IEJpZ0ludChhbHBoYWJldC5sZW5ndGgpO1xuICAgICAgbGV0IHJlc3VsdCA9IFwiXCI7XG5cbiAgICAgIHdoaWxlIChudW0gPiAwbikge1xuICAgICAgICBjb25zdCByZW0gPSBudW0gJSBiYXNlO1xuICAgICAgICByZXN1bHQgPSBhbHBoYWJldFtOdW1iZXIocmVtKV0gKyByZXN1bHQ7XG4gICAgICAgIG51bSA9IG51bSAvIGJhc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGBgYFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgdGh4IHRvIGh0dHBzOi8vY2hhdGdwdC5jb20vcy90XzY4YjE4MTBhYjQ3MDgxOTFiYzg0MWYwNzhhNmUwZTY2ICMjI1xuICAgIGBgYFxuICAgIGZ1bmN0aW9uIGRlY29kZV9iaWdpbnQoc3RyLCBhbHBoYWJldCkge1xuICAgICAgY29uc3QgYmFzZSA9IEJpZ0ludChhbHBoYWJldC5sZW5ndGgpO1xuICAgICAgY29uc3QgbWFwID0gbmV3IE1hcChhbHBoYWJldC5zcGxpdChcIlwiKS5tYXAoKGNoLCBpKSA9PiBbY2gsIEJpZ0ludChpKV0pKTtcblxuICAgICAgbGV0IG51bSA9IDBuO1xuICAgICAgZm9yIChjb25zdCBjaCBvZiBzdHIpIHtcbiAgICAgICAgY29uc3QgdmFsID0gbWFwLmdldChjaCk7XG4gICAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNoYXJhY3RlcjogJHtjaH1gKTtcbiAgICAgICAgbnVtID0gbnVtICogYmFzZSArIHZhbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG4gICAgYGBgXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMjIyBUQUlOVCBmYWxsIGJhY2sgdG8gYE51bWJlcjo6dG9TdHJpbmcoKWAgd2hlcmUgcG9zc2libGUgKGJ1dCBub3QgZm9yIGJhc2UgMTAgYXMgaXQgdXNlcyBleHBvbmVudGlhbCBub3RhdGlvbikgIyMjXG4gICAgZW5jb2RlID0gKCBuLCBhbHBoYWJldCApIC0+XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvciBcIs6pYW55Yl9fXzIgT25seSBub25uZWdhdGl2ZSBpbnRlZ2VycyBzdXBwb3J0ZWRcIiBpZiBuIDwgMFxuICAgICAgcmV0dXJuIGFscGhhYmV0WzBdIGlmIG4gaXMgMFxuICAgICAgYmFzZSAgPSBhbHBoYWJldC5sZW5ndGhcbiAgICAgIFIgICAgID0gJydcbiAgICAgIHdoaWxlIG4gPiAwXG4gICAgICAgIHJlbWFpbmRlciA9IG4gJSBiYXNlXG4gICAgICAgIFIgICAgICAgICA9IGFscGhhYmV0WyBOdW1iZXIgcmVtYWluZGVyIF0gKyBSXG4gICAgICAgIG4gICAgICAgICA9IG4gLy8gYmFzZVxuICAgICAgcmV0dXJuIFJcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIFRBSU5UIGF2b2lkIGJ1aWxkaW5nIG1hcCwgdXNlIGluZGV4ICMjI1xuICAgICMjIyBUQUlOVCBmYWxsIGJhY2sgdG8gYE51bWJlcigpYCwgYHBhcnNlSW50KClgIHdoZXJlIHBvc3NpYmxlICMjI1xuICAgIGRlY29kZSA9ICggc3RyLCBhbHBoYWJldCApIC0+XG4gICAgICBiYXNlICA9IGFscGhhYmV0Lmxlbmd0aFxuICAgICAgbWFwICAgPSBuZXcgTWFwKGFscGhhYmV0LnNwbGl0KFwiXCIpLm1hcCgoY2gsIGkpID0+IFtjaCwgaV0pKVxuICAgICAgUiAgICAgPSAwXG4gICAgICBmb3IgY2hyIGluIEFycmF5LmZyb20gc3RyXG4gICAgICAgIHZhbCA9IG1hcC5nZXQoY2hyKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqWFueWJfX18yIEludmFsaWQgY2hhcmFjdGVyOiAje3JwciBjaHJ9XCIgdW5sZXNzIHZhbD9cbiAgICAgICAgUiA9IFIgKiBiYXNlICsgdmFsXG4gICAgICByZXR1cm4gUlxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZW5jb2RlLCBkZWNvZGUsIGVuY29kZV9iaWdpbnQsIGRlY29kZV9iaWdpbnQsIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBCUklDU1xuXG4iXX0=
