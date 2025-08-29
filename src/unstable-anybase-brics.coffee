'use strict'

#===========================================================================================================
{ debug, } = console


############################################################################################################
#
#===========================================================================================================
BRICS =

  #=========================================================================================================
  ### NOTE Future Single-File Module ###
  require_anybase: ->

    #-------------------------------------------------------------------------------------------------------
    ### thx to https://chatgpt.com/s/t_68b1810ab4708191bc841f078a6e0e66 ###
    ```
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
    ```

    #-------------------------------------------------------------------------------------------------------
    ### thx to https://chatgpt.com/s/t_68b1810ab4708191bc841f078a6e0e66 ###
    ```
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
    ```

    #-------------------------------------------------------------------------------------------------------
    encode = ( n, alphabet ) ->
      throw new RangeError "Ωanyb___2 Only nonnegative integers supported" if n < 0
      return alphabet[0] if n is 0
      base  = alphabet.length
      R     = ''
      while n > 0
        remainder = n % base
        R         = alphabet[ Number remainder ] + R
        n         = n // base
      return R

    #-------------------------------------------------------------------------------------------------------
    ### TAINT avoid building map, use index ###
    decode = ( str, alphabet ) ->
      base  = alphabet.length
      map   = new Map(alphabet.split("").map((ch, i) => [ch, i]))
      R     = 0
      for chr in Array.from str
        val = map.get(chr)
        throw new Error "Ωanyb___2 Invalid character: ${rpr chr}" unless val?
        R = R * base + val
      return R

    #.......................................................................................................
    return exports = { encode, decode, encode_bigint, decode_bigint, }

#===========================================================================================================
Object.assign module.exports, BRICS

