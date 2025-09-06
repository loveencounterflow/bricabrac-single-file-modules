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
      var decode, encode, exports, get_max_integer, get_max_niners, get_required_digits, log_to_base, rpr;
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
      get_max_niners = function(max_n, base) {
        return (get_required_digits(max_n, base)) - 1;
      };
      //-------------------------------------------------------------------------------------------------------
      /* Maximum integer that can be encoded with the niners of a given base that doesn't exceed a given
             `max_n` (e.g. `Number.MAX_SAFE_INTEGER`) */
      get_max_integer = function(max_n, base) {
        return (base ** get_max_niners(max_n, base)) - 1;
      };
      //.......................................................................................................
      return exports = {encode, decode, encode_bigint, decode_bigint, log_to_base, get_required_digits, get_max_niners, get_max_integer};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWFueWJhc2UtYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLEtBQUEsRUFBQSxLQUFBOzs7RUFHQSxDQUFBLENBQUUsS0FBRixDQUFBLEdBQWEsT0FBYixFQUhBOzs7OztFQVNBLEtBQUEsR0FJRSxDQUFBOzs7SUFBQSxlQUFBLEVBQWlCLFFBQUEsQ0FBQSxDQUFBO0FBQ25CLFVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsZUFBQSxFQUFBLGNBQUEsRUFBQSxtQkFBQSxFQUFBLFdBQUEsRUFBQTtNQUFJLENBQUE7UUFBRSxjQUFBLEVBQWdCO01BQWxCLENBQUEsR0FBNEIsQ0FBRSxPQUFBLENBQVEsSUFBUixDQUFGLENBQWdCLENBQUMsUUFBUSxDQUFDLFlBQTFCLENBQUEsQ0FBNUI7TUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFxQkE7Ozs7Ozs7Ozs7Ozs7Ozs7S0F6Qko7OztNQTJDSSxNQUFBLEdBQVMsUUFBQSxDQUFFLENBQUYsRUFBSyxRQUFMLENBQUE7QUFDYixZQUFBLENBQUEsRUFBQSxJQUFBLEVBQUE7UUFBTSxJQUF3RSxDQUFBLEdBQUksQ0FBNUU7VUFBQSxNQUFNLElBQUksVUFBSixDQUFlLCtDQUFmLEVBQU47O1FBQ0EsSUFBc0IsQ0FBQSxLQUFLLENBQTNCO0FBQUEsaUJBQU8sUUFBUSxDQUFDLENBQUQsRUFBZjs7UUFDQSxJQUFBLEdBQVEsUUFBUSxDQUFDO1FBQ2pCLENBQUEsR0FBUTtBQUNSLGVBQU0sQ0FBQSxHQUFJLENBQVY7VUFDRSxTQUFBLEdBQVksQ0FBQSxHQUFJO1VBQ2hCLENBQUEsR0FBWSxRQUFRLENBQUUsTUFBQSxDQUFPLFNBQVAsQ0FBRixDQUFSLEdBQStCO1VBQzNDLENBQUEsY0FBWSxJQUFLO1FBSG5CO0FBSUEsZUFBTztNQVRBLEVBM0NiOzs7O01BeURJLE1BQUEsR0FBUyxRQUFBLENBQUUsR0FBRixFQUFPLFFBQVAsQ0FBQTtBQUNiLFlBQUEsQ0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBO1FBQU0sSUFBQSxHQUFRLFFBQVEsQ0FBQztRQUNqQixHQUFBLEdBQVEsSUFBSSxHQUFKLENBQVEsUUFBUSxDQUFDLEtBQVQsQ0FBZSxFQUFmLENBQWtCLENBQUMsR0FBbkIsQ0FBdUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFBLEdBQUE7aUJBQVcsQ0FBQyxFQUFELEVBQUssQ0FBTDtRQUFYLENBQXZCLENBQVI7UUFDUixDQUFBLEdBQVE7QUFDUjtRQUFBLEtBQUEscUNBQUE7O1VBQ0UsR0FBQSxHQUFNLEdBQUcsQ0FBQyxHQUFKLENBQVEsR0FBUjtVQUNOLElBQWlFLFdBQWpFO1lBQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLDZCQUFBLENBQUEsQ0FBZ0MsR0FBQSxDQUFJLEdBQUosQ0FBaEMsQ0FBQSxDQUFWLEVBQU47O1VBQ0EsQ0FBQSxHQUFJLENBQUEsR0FBSSxJQUFKLEdBQVc7UUFIakI7QUFJQSxlQUFPO01BUkEsRUF6RGI7OztNQXFFSSxXQUFBLEdBQWMsUUFBQSxDQUFFLENBQUYsRUFBSyxJQUFMLENBQUE7ZUFBZSxDQUFFLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxDQUFGLENBQUEsR0FBaUIsQ0FBRSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsQ0FBRjtNQUFoQyxFQXJFbEI7OztNQXlFSSxtQkFBQSxHQUFzQixRQUFBLENBQUUsQ0FBRixFQUFLLElBQUwsQ0FBQTtlQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBQSxDQUFZLENBQVosRUFBZSxJQUFmLENBQVY7TUFBZixFQXpFMUI7Ozs7TUE4RUksY0FBQSxHQUFpQixRQUFBLENBQUUsS0FBRixFQUFTLElBQVQsQ0FBQTtlQUFtQixDQUFFLG1CQUFBLENBQW9CLEtBQXBCLEVBQTJCLElBQTNCLENBQUYsQ0FBQSxHQUFzQztNQUF6RCxFQTlFckI7Ozs7TUFtRkksZUFBQSxHQUFrQixRQUFBLENBQUUsS0FBRixFQUFTLElBQVQsQ0FBQTtlQUFtQixDQUFFLElBQUEsSUFBUSxjQUFBLENBQWUsS0FBZixFQUFzQixJQUF0QixDQUFWLENBQUEsR0FBeUM7TUFBNUQsRUFuRnRCOztBQXNGSSxhQUFPLE9BQUEsR0FBVSxDQUNmLE1BRGUsRUFFZixNQUZlLEVBR2YsYUFIZSxFQUlmLGFBSmUsRUFLZixXQUxlLEVBTWYsbUJBTmUsRUFPZixjQVBlLEVBUWYsZUFSZTtJQXZGRjtFQUFqQixFQWJGOzs7RUErR0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsS0FBOUI7QUEvR0EiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG57IGRlYnVnLCB9ID0gY29uc29sZVxuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5CUklDUyA9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2FueWJhc2U6IC0+XG4gICAgeyBzaG93X25vX2NvbG9yczogcnByLCAgfSA9ICggcmVxdWlyZSAnLi4nICkudW5zdGFibGUucmVxdWlyZV9zaG93KClcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIHRoeCB0byBodHRwczovL2NoYXRncHQuY29tL3MvdF82OGIxODEwYWI0NzA4MTkxYmM4NDFmMDc4YTZlMGU2NiAjIyNcbiAgICBgYGBcbiAgICBmdW5jdGlvbiBlbmNvZGVfYmlnaW50KG51bSwgYWxwaGFiZXQpIHtcbiAgICAgIGlmICh0eXBlb2YgbnVtID09PSBcIm51bWJlclwiKSBudW0gPSBCaWdJbnQobnVtKTtcbiAgICAgIGlmIChudW0gPCAwbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJPbmx5IG5vbm5lZ2F0aXZlIGludGVnZXJzIHN1cHBvcnRlZFwiKTtcbiAgICAgIGlmIChudW0gPT09IDBuKSByZXR1cm4gYWxwaGFiZXRbMF07XG5cbiAgICAgIGNvbnN0IGJhc2UgPSBCaWdJbnQoYWxwaGFiZXQubGVuZ3RoKTtcbiAgICAgIGxldCByZXN1bHQgPSBcIlwiO1xuXG4gICAgICB3aGlsZSAobnVtID4gMG4pIHtcbiAgICAgICAgY29uc3QgcmVtID0gbnVtICUgYmFzZTtcbiAgICAgICAgcmVzdWx0ID0gYWxwaGFiZXRbTnVtYmVyKHJlbSldICsgcmVzdWx0O1xuICAgICAgICBudW0gPSBudW0gLyBiYXNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBgYGBcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIHRoeCB0byBodHRwczovL2NoYXRncHQuY29tL3MvdF82OGIxODEwYWI0NzA4MTkxYmM4NDFmMDc4YTZlMGU2NiAjIyNcbiAgICBgYGBcbiAgICBmdW5jdGlvbiBkZWNvZGVfYmlnaW50KHN0ciwgYWxwaGFiZXQpIHtcbiAgICAgIGNvbnN0IGJhc2UgPSBCaWdJbnQoYWxwaGFiZXQubGVuZ3RoKTtcbiAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoYWxwaGFiZXQuc3BsaXQoXCJcIikubWFwKChjaCwgaSkgPT4gW2NoLCBCaWdJbnQoaSldKSk7XG5cbiAgICAgIGxldCBudW0gPSAwbjtcbiAgICAgIGZvciAoY29uc3QgY2ggb2Ygc3RyKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IG1hcC5nZXQoY2gpO1xuICAgICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjaGFyYWN0ZXI6ICR7Y2h9YCk7XG4gICAgICAgIG51bSA9IG51bSAqIGJhc2UgKyB2YWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudW07XG4gICAgfVxuICAgIGBgYFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgVEFJTlQgZmFsbCBiYWNrIHRvIGBOdW1iZXI6OnRvU3RyaW5nKClgIHdoZXJlIHBvc3NpYmxlIChidXQgbm90IGZvciBiYXNlIDEwIGFzIGl0IHVzZXMgZXhwb25lbnRpYWwgbm90YXRpb24pICMjI1xuICAgIGVuY29kZSA9ICggbiwgYWxwaGFiZXQgKSAtPlxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IgXCLOqWFueWJfX18yIE9ubHkgbm9ubmVnYXRpdmUgaW50ZWdlcnMgc3VwcG9ydGVkXCIgaWYgbiA8IDBcbiAgICAgIHJldHVybiBhbHBoYWJldFswXSBpZiBuIGlzIDBcbiAgICAgIGJhc2UgID0gYWxwaGFiZXQubGVuZ3RoXG4gICAgICBSICAgICA9ICcnXG4gICAgICB3aGlsZSBuID4gMFxuICAgICAgICByZW1haW5kZXIgPSBuICUgYmFzZVxuICAgICAgICBSICAgICAgICAgPSBhbHBoYWJldFsgTnVtYmVyIHJlbWFpbmRlciBdICsgUlxuICAgICAgICBuICAgICAgICAgPSBuIC8vIGJhc2VcbiAgICAgIHJldHVybiBSXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMjIyBUQUlOVCBhdm9pZCBidWlsZGluZyBtYXAsIHVzZSBpbmRleCAjIyNcbiAgICAjIyMgVEFJTlQgZmFsbCBiYWNrIHRvIGBOdW1iZXIoKWAsIGBwYXJzZUludCgpYCB3aGVyZSBwb3NzaWJsZSAjIyNcbiAgICBkZWNvZGUgPSAoIHN0ciwgYWxwaGFiZXQgKSAtPlxuICAgICAgYmFzZSAgPSBhbHBoYWJldC5sZW5ndGhcbiAgICAgIG1hcCAgID0gbmV3IE1hcChhbHBoYWJldC5zcGxpdChcIlwiKS5tYXAoKGNoLCBpKSA9PiBbY2gsIGldKSlcbiAgICAgIFIgICAgID0gMFxuICAgICAgZm9yIGNociBpbiBBcnJheS5mcm9tIHN0clxuICAgICAgICB2YWwgPSBtYXAuZ2V0KGNocilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlhbnliX19fMiBJbnZhbGlkIGNoYXJhY3RlcjogI3tycHIgY2hyfVwiIHVubGVzcyB2YWw/XG4gICAgICAgIFIgPSBSICogYmFzZSArIHZhbFxuICAgICAgcmV0dXJuIFJcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIExvZ2FyaXRobSB0byBhIGdpdmVuIGBiYXNlYCBvZiBhIGdpdmVuIG51bWJlciBgbmAgIyMjXG4gICAgbG9nX3RvX2Jhc2UgPSAoIG4sIGJhc2UgKSAtPiAoIE1hdGgubG9nIG4gKSAvICggTWF0aC5sb2cgYmFzZSApXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMjIyBOdW1iZXIgb2YgZGlnaXRzIHJlcXVpcmVkIHRvIHdyaXRlIGEgZ2l2ZW4gbnVtYmVyIGBuYCBpbiBhIHBvc2l0aW9uYWwgc3lzdGVtIHdpdGggYSBnaXZlbiBgYmFzZWAgIyMjXG4gICAgZ2V0X3JlcXVpcmVkX2RpZ2l0cyA9ICggbiwgYmFzZSApIC0+IE1hdGguY2VpbCBsb2dfdG9fYmFzZSBuLCBiYXNlXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMjIyBNYXhpbXVtIG51bWJlciBvZiBoaWdoZXN0LXZhbHVlIGRpZ2l0cyAoaS5lLiBgYmFzZSAtIDFgKSB0byB3cml0ZSBhIG51bWJlciB0aGF0IGRvZXMgbm90IGV4Y2VlZCBhXG4gICAgICAgIGdpdmVuIG51bWJlciBgbWF4X25gIChlLmcuIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmApICMjI1xuICAgIGdldF9tYXhfbmluZXJzID0gKCBtYXhfbiwgYmFzZSApIC0+ICggZ2V0X3JlcXVpcmVkX2RpZ2l0cyBtYXhfbiwgYmFzZSApIC0gMVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgTWF4aW11bSBpbnRlZ2VyIHRoYXQgY2FuIGJlIGVuY29kZWQgd2l0aCB0aGUgbmluZXJzIG9mIGEgZ2l2ZW4gYmFzZSB0aGF0IGRvZXNuJ3QgZXhjZWVkIGEgZ2l2ZW5cbiAgICAgICAgYG1heF9uYCAoZS5nLiBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgKSAjIyNcbiAgICBnZXRfbWF4X2ludGVnZXIgPSAoIG1heF9uLCBiYXNlICkgLT4gKCBiYXNlICoqIGdldF9tYXhfbmluZXJzIG1heF9uLCBiYXNlICkgLSAxXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgZW5jb2RlLFxuICAgICAgZGVjb2RlLFxuICAgICAgZW5jb2RlX2JpZ2ludCxcbiAgICAgIGRlY29kZV9iaWdpbnQsXG4gICAgICBsb2dfdG9fYmFzZSxcbiAgICAgIGdldF9yZXF1aXJlZF9kaWdpdHMsXG4gICAgICBnZXRfbWF4X25pbmVycyxcbiAgICAgIGdldF9tYXhfaW50ZWdlciwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEJSSUNTXG5cbiJdfQ==
