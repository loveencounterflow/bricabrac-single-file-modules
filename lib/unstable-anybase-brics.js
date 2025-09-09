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
      var decode, encode, exports, get_max_integer, get_max_niner_digit_count, get_required_digits, is_positive_all_niner, is_positive_integer_power_of, log_to_base, rpr;
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
          throw new RangeError("Ωanyb___1 Only nonnegative integers supported");
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
      //-------------------------------------------------------------------------------------------------------
      /* Logarithm to a given `base` of a given number `n` */
      log_to_base = function(n, base) {
        return (Math.log(n)) / (Math.log(base));
      };
      //-------------------------------------------------------------------------------------------------------
      /* Number of digits required to write a given number `n` in a positional system with a given `base` */
      get_required_digits = function(n, base) {
        return Math.ceil(log_to_base(n, base));
      };
      //-------------------------------------------------------------------------------------------------------
      /* Maximum number of highest-value digits (i.e. `base - 1`) to write a number that does not exceed a
             given number `max_n` (e.g. `Number.MAX_SAFE_INTEGER`) */
      get_max_niner_digit_count = function(max_n, base) {
        return (get_required_digits(max_n, base)) - 1;
      };
      //-------------------------------------------------------------------------------------------------------
      /* Maximum integer that can be encoded with the niners of a given base that doesn't exceed a given
             `max_n` (e.g. `Number.MAX_SAFE_INTEGER`) */
      get_max_integer = function(max_n, base) {
        return (base ** get_max_niner_digit_count(max_n, base)) - 1;
      };
      //-------------------------------------------------------------------------------------------------------
      /* Returns whether `∃p ∈ ℕ: ( base ** p ) == n`. */
      is_positive_integer_power_of = function(n, base) {
        if (!Number.isSafeInteger(n)) {
          throw new Error(`Ωanyb___3 expected a (safe) integer, got ${n}`);
        }
        if (!Number.isSafeInteger(base)) {
          throw new Error(`Ωanyb___4 expected a (safe) integer, got ${base}`);
        }
        if (!(n > 1)) {
          throw new Error(`Ωanyb___5 expected a positive integer, got ${n}`);
        }
        if (!(base > 1)) {
          throw new Error(`Ωanyb___6 expected an integer greater than 1, got ${base}`);
        }
        if (!(n > 1)) {
          return false;
        }
        while (n % base === 0) {
          n /= base;
        }
        return n === 1;
      };
      //-------------------------------------------------------------------------------------------------------
      /* Returns whether a given positive integer `n` would only consist of niners when written in a given
             `base`, which is the case if `n + 1` is a power of the base. */
      is_positive_all_niner = function(n, base) {
        return is_positive_integer_power_of(n + 1, base);
      };
      //.......................................................................................................
      return exports = {encode, decode, encode_bigint, decode_bigint, log_to_base, get_required_digits, get_max_niner_digit_count, get_max_integer, is_positive_integer_power_of, is_positive_all_niner};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWFueWJhc2UtYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLEtBQUEsRUFBQSxLQUFBOzs7RUFHQSxDQUFBLENBQUUsS0FBRixDQUFBLEdBQWEsT0FBYixFQUhBOzs7OztFQVNBLEtBQUEsR0FJRSxDQUFBOzs7SUFBQSxlQUFBLEVBQWlCLFFBQUEsQ0FBQSxDQUFBO0FBQ25CLFVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsZUFBQSxFQUFBLHlCQUFBLEVBQUEsbUJBQUEsRUFBQSxxQkFBQSxFQUFBLDRCQUFBLEVBQUEsV0FBQSxFQUFBO01BQUksQ0FBQTtRQUFFLGNBQUEsRUFBZ0I7TUFBbEIsQ0FBQSxHQUE0QixDQUFFLE9BQUEsQ0FBUSxJQUFSLENBQUYsQ0FBZ0IsQ0FBQyxRQUFRLENBQUMsWUFBMUIsQ0FBQSxDQUE1QjtNQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXFCQTs7Ozs7Ozs7Ozs7Ozs7OztLQXpCSjs7O01BMkNJLE1BQUEsR0FBUyxRQUFBLENBQUUsQ0FBRixFQUFLLFFBQUwsQ0FBQTtBQUNiLFlBQUEsQ0FBQSxFQUFBLElBQUEsRUFBQTtRQUFNLElBQXdFLENBQUEsR0FBSSxDQUE1RTtVQUFBLE1BQU0sSUFBSSxVQUFKLENBQWUsK0NBQWYsRUFBTjs7UUFDQSxJQUFzQixDQUFBLEtBQUssQ0FBM0I7QUFBQSxpQkFBTyxRQUFRLENBQUMsQ0FBRCxFQUFmOztRQUNBLElBQUEsR0FBUSxRQUFRLENBQUM7UUFDakIsQ0FBQSxHQUFRO0FBQ1IsZUFBTSxDQUFBLEdBQUksQ0FBVjtVQUNFLFNBQUEsR0FBWSxDQUFBLEdBQUk7VUFDaEIsQ0FBQSxHQUFZLFFBQVEsQ0FBRSxNQUFBLENBQU8sU0FBUCxDQUFGLENBQVIsR0FBK0I7VUFDM0MsQ0FBQSxjQUFZLElBQUs7UUFIbkI7QUFJQSxlQUFPO01BVEEs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QUNmLE1BRGUsRUFFZixNQUZlLEVBR2YsYUFIZSxFQUlmLGFBSmUsRUFLZixXQUxlLEVBTWYsbUJBTmUsRUFPZix5QkFQZSxFQVFmLGVBUmUsRUFTZiw0QkFUZSxFQVVmLHFCQVZlO0lBeEdGO0VBQWpCLEVBYkY7OztFQWtJQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQWxJQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnsgZGVidWcsIH0gPSBjb25zb2xlXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfYW55YmFzZTogLT5cbiAgICB7IHNob3dfbm9fY29sb3JzOiBycHIsICB9ID0gKCByZXF1aXJlICcuLicgKS51bnN0YWJsZS5yZXF1aXJlX3Nob3coKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgdGh4IHRvIGh0dHBzOi8vY2hhdGdwdC5jb20vcy90XzY4YjE4MTBhYjQ3MDgxOTFiYzg0MWYwNzhhNmUwZTY2ICMjI1xuICAgIGBgYFxuICAgIGZ1bmN0aW9uIGVuY29kZV9iaWdpbnQobnVtLCBhbHBoYWJldCkge1xuICAgICAgaWYgKHR5cGVvZiBudW0gPT09IFwibnVtYmVyXCIpIG51bSA9IEJpZ0ludChudW0pO1xuICAgICAgaWYgKG51bSA8IDBuKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIk9ubHkgbm9ubmVnYXRpdmUgaW50ZWdlcnMgc3VwcG9ydGVkXCIpO1xuICAgICAgaWYgKG51bSA9PT0gMG4pIHJldHVybiBhbHBoYWJldFswXTtcblxuICAgICAgY29uc3QgYmFzZSA9IEJpZ0ludChhbHBoYWJldC5sZW5ndGgpO1xuICAgICAgbGV0IHJlc3VsdCA9IFwiXCI7XG5cbiAgICAgIHdoaWxlIChudW0gPiAwbikge1xuICAgICAgICBjb25zdCByZW0gPSBudW0gJSBiYXNlO1xuICAgICAgICByZXN1bHQgPSBhbHBoYWJldFtOdW1iZXIocmVtKV0gKyByZXN1bHQ7XG4gICAgICAgIG51bSA9IG51bSAvIGJhc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGBgYFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgdGh4IHRvIGh0dHBzOi8vY2hhdGdwdC5jb20vcy90XzY4YjE4MTBhYjQ3MDgxOTFiYzg0MWYwNzhhNmUwZTY2ICMjI1xuICAgIGBgYFxuICAgIGZ1bmN0aW9uIGRlY29kZV9iaWdpbnQoc3RyLCBhbHBoYWJldCkge1xuICAgICAgY29uc3QgYmFzZSA9IEJpZ0ludChhbHBoYWJldC5sZW5ndGgpO1xuICAgICAgY29uc3QgbWFwID0gbmV3IE1hcChhbHBoYWJldC5zcGxpdChcIlwiKS5tYXAoKGNoLCBpKSA9PiBbY2gsIEJpZ0ludChpKV0pKTtcblxuICAgICAgbGV0IG51bSA9IDBuO1xuICAgICAgZm9yIChjb25zdCBjaCBvZiBzdHIpIHtcbiAgICAgICAgY29uc3QgdmFsID0gbWFwLmdldChjaCk7XG4gICAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNoYXJhY3RlcjogJHtjaH1gKTtcbiAgICAgICAgbnVtID0gbnVtICogYmFzZSArIHZhbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG4gICAgYGBgXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMjIyBUQUlOVCBmYWxsIGJhY2sgdG8gYE51bWJlcjo6dG9TdHJpbmcoKWAgd2hlcmUgcG9zc2libGUgKGJ1dCBub3QgZm9yIGJhc2UgMTAgYXMgaXQgdXNlcyBleHBvbmVudGlhbCBub3RhdGlvbikgIyMjXG4gICAgZW5jb2RlID0gKCBuLCBhbHBoYWJldCApIC0+XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvciBcIs6pYW55Yl9fXzEgT25seSBub25uZWdhdGl2ZSBpbnRlZ2VycyBzdXBwb3J0ZWRcIiBpZiBuIDwgMFxuICAgICAgcmV0dXJuIGFscGhhYmV0WzBdIGlmIG4gaXMgMFxuICAgICAgYmFzZSAgPSBhbHBoYWJldC5sZW5ndGhcbiAgICAgIFIgICAgID0gJydcbiAgICAgIHdoaWxlIG4gPiAwXG4gICAgICAgIHJlbWFpbmRlciA9IG4gJSBiYXNlXG4gICAgICAgIFIgICAgICAgICA9IGFscGhhYmV0WyBOdW1iZXIgcmVtYWluZGVyIF0gKyBSXG4gICAgICAgIG4gICAgICAgICA9IG4gLy8gYmFzZVxuICAgICAgcmV0dXJuIFJcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIFRBSU5UIGF2b2lkIGJ1aWxkaW5nIG1hcCwgdXNlIGluZGV4ICMjI1xuICAgICMjIyBUQUlOVCBmYWxsIGJhY2sgdG8gYE51bWJlcigpYCwgYHBhcnNlSW50KClgIHdoZXJlIHBvc3NpYmxlICMjI1xuICAgIGRlY29kZSA9ICggc3RyLCBhbHBoYWJldCApIC0+XG4gICAgICBiYXNlICA9IGFscGhhYmV0Lmxlbmd0aFxuICAgICAgbWFwICAgPSBuZXcgTWFwKGFscGhhYmV0LnNwbGl0KFwiXCIpLm1hcCgoY2gsIGkpID0+IFtjaCwgaV0pKVxuICAgICAgUiAgICAgPSAwXG4gICAgICBmb3IgY2hyIGluIEFycmF5LmZyb20gc3RyXG4gICAgICAgIHZhbCA9IG1hcC5nZXQoY2hyKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqWFueWJfX18yIEludmFsaWQgY2hhcmFjdGVyOiAje3JwciBjaHJ9XCIgdW5sZXNzIHZhbD9cbiAgICAgICAgUiA9IFIgKiBiYXNlICsgdmFsXG4gICAgICByZXR1cm4gUlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgTG9nYXJpdGhtIHRvIGEgZ2l2ZW4gYGJhc2VgIG9mIGEgZ2l2ZW4gbnVtYmVyIGBuYCAjIyNcbiAgICBsb2dfdG9fYmFzZSA9ICggbiwgYmFzZSApIC0+ICggTWF0aC5sb2cgbiApIC8gKCBNYXRoLmxvZyBiYXNlIClcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIE51bWJlciBvZiBkaWdpdHMgcmVxdWlyZWQgdG8gd3JpdGUgYSBnaXZlbiBudW1iZXIgYG5gIGluIGEgcG9zaXRpb25hbCBzeXN0ZW0gd2l0aCBhIGdpdmVuIGBiYXNlYCAjIyNcbiAgICBnZXRfcmVxdWlyZWRfZGlnaXRzID0gKCBuLCBiYXNlICkgLT4gTWF0aC5jZWlsIGxvZ190b19iYXNlIG4sIGJhc2VcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIE1heGltdW0gbnVtYmVyIG9mIGhpZ2hlc3QtdmFsdWUgZGlnaXRzIChpLmUuIGBiYXNlIC0gMWApIHRvIHdyaXRlIGEgbnVtYmVyIHRoYXQgZG9lcyBub3QgZXhjZWVkIGFcbiAgICAgICAgZ2l2ZW4gbnVtYmVyIGBtYXhfbmAgKGUuZy4gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYCkgIyMjXG4gICAgZ2V0X21heF9uaW5lcl9kaWdpdF9jb3VudCA9ICggbWF4X24sIGJhc2UgKSAtPiAoIGdldF9yZXF1aXJlZF9kaWdpdHMgbWF4X24sIGJhc2UgKSAtIDFcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIE1heGltdW0gaW50ZWdlciB0aGF0IGNhbiBiZSBlbmNvZGVkIHdpdGggdGhlIG5pbmVycyBvZiBhIGdpdmVuIGJhc2UgdGhhdCBkb2Vzbid0IGV4Y2VlZCBhIGdpdmVuXG4gICAgICAgIGBtYXhfbmAgKGUuZy4gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYCkgIyMjXG4gICAgZ2V0X21heF9pbnRlZ2VyID0gKCBtYXhfbiwgYmFzZSApIC0+ICggYmFzZSAqKiBnZXRfbWF4X25pbmVyX2RpZ2l0X2NvdW50IG1heF9uLCBiYXNlICkgLSAxXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMjIyBSZXR1cm5zIHdoZXRoZXIgYOKIg3Ag4oiIIOKElTogKCBiYXNlICoqIHAgKSA9PSBuYC4gIyMjXG4gICAgaXNfcG9zaXRpdmVfaW50ZWdlcl9wb3dlcl9vZiA9ICggbiwgYmFzZSApIC0+XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqWFueWJfX18zIGV4cGVjdGVkIGEgKHNhZmUpIGludGVnZXIsIGdvdCAje259XCIgICAgICAgICAgICAgdW5sZXNzIE51bWJlci5pc1NhZmVJbnRlZ2VyIG5cbiAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pYW55Yl9fXzQgZXhwZWN0ZWQgYSAoc2FmZSkgaW50ZWdlciwgZ290ICN7YmFzZX1cIiAgICAgICAgICB1bmxlc3MgTnVtYmVyLmlzU2FmZUludGVnZXIgYmFzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlhbnliX19fNSBleHBlY3RlZCBhIHBvc2l0aXZlIGludGVnZXIsIGdvdCAje259XCIgICAgICAgICAgIHVubGVzcyBuID4gMVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlhbnliX19fNiBleHBlY3RlZCBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiAxLCBnb3QgI3tiYXNlfVwiIHVubGVzcyBiYXNlID4gMVxuICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBuID4gMVxuICAgICAgbiAvPSBiYXNlIHdoaWxlIG4gJSBiYXNlID09IDBcbiAgICAgIHJldHVybiBuIGlzIDFcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIFJldHVybnMgd2hldGhlciBhIGdpdmVuIHBvc2l0aXZlIGludGVnZXIgYG5gIHdvdWxkIG9ubHkgY29uc2lzdCBvZiBuaW5lcnMgd2hlbiB3cml0dGVuIGluIGEgZ2l2ZW5cbiAgICAgICAgYGJhc2VgLCB3aGljaCBpcyB0aGUgY2FzZSBpZiBgbiArIDFgIGlzIGEgcG93ZXIgb2YgdGhlIGJhc2UuICMjI1xuICAgIGlzX3Bvc2l0aXZlX2FsbF9uaW5lciA9ICggbiwgYmFzZSApIC0+IGlzX3Bvc2l0aXZlX2ludGVnZXJfcG93ZXJfb2YgbiArIDEsIGJhc2VcblxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIGVuY29kZSxcbiAgICAgIGRlY29kZSxcbiAgICAgIGVuY29kZV9iaWdpbnQsXG4gICAgICBkZWNvZGVfYmlnaW50LFxuICAgICAgbG9nX3RvX2Jhc2UsXG4gICAgICBnZXRfcmVxdWlyZWRfZGlnaXRzLFxuICAgICAgZ2V0X21heF9uaW5lcl9kaWdpdF9jb3VudCxcbiAgICAgIGdldF9tYXhfaW50ZWdlcixcbiAgICAgIGlzX3Bvc2l0aXZlX2ludGVnZXJfcG93ZXJfb2YsXG4gICAgICBpc19wb3NpdGl2ZV9hbGxfbmluZXIsIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBCUklDU1xuXG4iXX0=
