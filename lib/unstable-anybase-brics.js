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
      var decode, encode, exports;
      //-------------------------------------------------------------------------------------------------------
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
            throw new Error("Ωanyb___2 Invalid character: ${rpr chr}");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWFueWJhc2UtYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLEtBQUEsRUFBQSxLQUFBOzs7RUFHQSxDQUFBLENBQUUsS0FBRixDQUFBLEdBQWEsT0FBYixFQUhBOzs7OztFQVNBLEtBQUEsR0FJRSxDQUFBOzs7SUFBQSxlQUFBLEVBQWlCLFFBQUEsQ0FBQSxDQUFBO01BSWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BcUJBOzs7Ozs7Ozs7Ozs7Ozs7OztBQXZCSixVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQTs7TUF3Q0ksTUFBQSxHQUFTLFFBQUEsQ0FBRSxDQUFGLEVBQUssUUFBTCxDQUFBO0FBQ2IsWUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBO1FBQU0sSUFBd0UsQ0FBQSxHQUFJLENBQTVFO1VBQUEsTUFBTSxJQUFJLFVBQUosQ0FBZSwrQ0FBZixFQUFOOztRQUNBLElBQXNCLENBQUEsS0FBSyxDQUEzQjtBQUFBLGlCQUFPLFFBQVEsQ0FBQyxDQUFELEVBQWY7O1FBQ0EsSUFBQSxHQUFRLFFBQVEsQ0FBQztRQUNqQixDQUFBLEdBQVE7QUFDUixlQUFNLENBQUEsR0FBSSxDQUFWO1VBQ0UsU0FBQSxHQUFZLENBQUEsR0FBSTtVQUNoQixDQUFBLEdBQVksUUFBUSxDQUFFLE1BQUEsQ0FBTyxTQUFQLENBQUYsQ0FBUixHQUErQjtVQUMzQyxDQUFBLGNBQVksSUFBSztRQUhuQjtBQUlBLGVBQU87TUFUQSxFQXhDYjs7O01BcURJLE1BQUEsR0FBUyxRQUFBLENBQUUsR0FBRixFQUFPLFFBQVAsQ0FBQTtBQUNiLFlBQUEsQ0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBO1FBQU0sSUFBQSxHQUFRLFFBQVEsQ0FBQztRQUNqQixHQUFBLEdBQVEsSUFBSSxHQUFKLENBQVEsUUFBUSxDQUFDLEtBQVQsQ0FBZSxFQUFmLENBQWtCLENBQUMsR0FBbkIsQ0FBdUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFBLEdBQUE7aUJBQVcsQ0FBQyxFQUFELEVBQUssQ0FBTDtRQUFYLENBQXZCLENBQVI7UUFDUixDQUFBLEdBQVE7QUFDUjtRQUFBLEtBQUEscUNBQUE7O1VBQ0UsR0FBQSxHQUFNLEdBQUcsQ0FBQyxHQUFKLENBQVEsR0FBUjtVQUNOLElBQWlFLFdBQWpFO1lBQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSx5Q0FBVixFQUFOOztVQUNBLENBQUEsR0FBSSxDQUFBLEdBQUksSUFBSixHQUFXO1FBSGpCO0FBSUEsZUFBTztNQVJBLEVBckRiOztBQWdFSSxhQUFPLE9BQUEsR0FBVSxDQUFFLE1BQUYsRUFBVSxNQUFWLEVBQWtCLGFBQWxCLEVBQWlDLGFBQWpDO0lBbEVGO0VBQWpCLEVBYkY7OztFQWtGQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQWxGQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnsgZGVidWcsIH0gPSBjb25zb2xlXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfYW55YmFzZTogLT5cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIHRoeCB0byBodHRwczovL2NoYXRncHQuY29tL3MvdF82OGIxODEwYWI0NzA4MTkxYmM4NDFmMDc4YTZlMGU2NiAjIyNcbiAgICBgYGBcbiAgICBmdW5jdGlvbiBlbmNvZGVfYmlnaW50KG51bSwgYWxwaGFiZXQpIHtcbiAgICAgIGlmICh0eXBlb2YgbnVtID09PSBcIm51bWJlclwiKSBudW0gPSBCaWdJbnQobnVtKTtcbiAgICAgIGlmIChudW0gPCAwbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJPbmx5IG5vbm5lZ2F0aXZlIGludGVnZXJzIHN1cHBvcnRlZFwiKTtcbiAgICAgIGlmIChudW0gPT09IDBuKSByZXR1cm4gYWxwaGFiZXRbMF07XG5cbiAgICAgIGNvbnN0IGJhc2UgPSBCaWdJbnQoYWxwaGFiZXQubGVuZ3RoKTtcbiAgICAgIGxldCByZXN1bHQgPSBcIlwiO1xuXG4gICAgICB3aGlsZSAobnVtID4gMG4pIHtcbiAgICAgICAgY29uc3QgcmVtID0gbnVtICUgYmFzZTtcbiAgICAgICAgcmVzdWx0ID0gYWxwaGFiZXRbTnVtYmVyKHJlbSldICsgcmVzdWx0O1xuICAgICAgICBudW0gPSBudW0gLyBiYXNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBgYGBcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyMjIHRoeCB0byBodHRwczovL2NoYXRncHQuY29tL3MvdF82OGIxODEwYWI0NzA4MTkxYmM4NDFmMDc4YTZlMGU2NiAjIyNcbiAgICBgYGBcbiAgICBmdW5jdGlvbiBkZWNvZGVfYmlnaW50KHN0ciwgYWxwaGFiZXQpIHtcbiAgICAgIGNvbnN0IGJhc2UgPSBCaWdJbnQoYWxwaGFiZXQubGVuZ3RoKTtcbiAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoYWxwaGFiZXQuc3BsaXQoXCJcIikubWFwKChjaCwgaSkgPT4gW2NoLCBCaWdJbnQoaSldKSk7XG5cbiAgICAgIGxldCBudW0gPSAwbjtcbiAgICAgIGZvciAoY29uc3QgY2ggb2Ygc3RyKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IG1hcC5nZXQoY2gpO1xuICAgICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjaGFyYWN0ZXI6ICR7Y2h9YCk7XG4gICAgICAgIG51bSA9IG51bSAqIGJhc2UgKyB2YWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudW07XG4gICAgfVxuICAgIGBgYFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBlbmNvZGUgPSAoIG4sIGFscGhhYmV0ICkgLT5cbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yIFwizqlhbnliX19fMiBPbmx5IG5vbm5lZ2F0aXZlIGludGVnZXJzIHN1cHBvcnRlZFwiIGlmIG4gPCAwXG4gICAgICByZXR1cm4gYWxwaGFiZXRbMF0gaWYgbiBpcyAwXG4gICAgICBiYXNlICA9IGFscGhhYmV0Lmxlbmd0aFxuICAgICAgUiAgICAgPSAnJ1xuICAgICAgd2hpbGUgbiA+IDBcbiAgICAgICAgcmVtYWluZGVyID0gbiAlIGJhc2VcbiAgICAgICAgUiAgICAgICAgID0gYWxwaGFiZXRbIE51bWJlciByZW1haW5kZXIgXSArIFJcbiAgICAgICAgbiAgICAgICAgID0gbiAvLyBiYXNlXG4gICAgICByZXR1cm4gUlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIyMgVEFJTlQgYXZvaWQgYnVpbGRpbmcgbWFwLCB1c2UgaW5kZXggIyMjXG4gICAgZGVjb2RlID0gKCBzdHIsIGFscGhhYmV0ICkgLT5cbiAgICAgIGJhc2UgID0gYWxwaGFiZXQubGVuZ3RoXG4gICAgICBtYXAgICA9IG5ldyBNYXAoYWxwaGFiZXQuc3BsaXQoXCJcIikubWFwKChjaCwgaSkgPT4gW2NoLCBpXSkpXG4gICAgICBSICAgICA9IDBcbiAgICAgIGZvciBjaHIgaW4gQXJyYXkuZnJvbSBzdHJcbiAgICAgICAgdmFsID0gbWFwLmdldChjaHIpXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pYW55Yl9fXzIgSW52YWxpZCBjaGFyYWN0ZXI6ICR7cnByIGNocn1cIiB1bmxlc3MgdmFsP1xuICAgICAgICBSID0gUiAqIGJhc2UgKyB2YWxcbiAgICAgIHJldHVybiBSXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBlbmNvZGUsIGRlY29kZSwgZW5jb2RlX2JpZ2ludCwgZGVjb2RlX2JpZ2ludCwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEJSSUNTXG5cbiJdfQ==
