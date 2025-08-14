'use strict'

############################################################################################################
#
#===========================================================================================================
UNSTABLE_GETRANDOM_BRICS =
  

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_random_tools: ->
    { hide,
      set_getter,                 } = ( require './various-brics' ).require_managed_property_tools()
    ### TAINT replace ###
    # { default: _get_unique_text,  } = require 'unique-string'
    chr_re      = ///^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$///v
    # max_rounds = 9_999
    max_rounds  = 1_000
    go_on       = Symbol 'go_on'
    clean       = ( x ) -> Object.fromEntries ( [ k, v, ] for k, v of x when v? )

    #---------------------------------------------------------------------------------------------------------
    internals = # Object.freeze
      chr_re:             chr_re
      max_rounds:         max_rounds
      go_on:              go_on
      clean:              clean
      #.......................................................................................................
      templates: Object.freeze
        random_tools_cfg: Object.freeze
          seed:               null
          max_rounds:         max_rounds
          # unique_count:   1_000
          on_stats:           null
          unicode_cid_range:  Object.freeze [ 0x0000, 0x10ffff ]
          on_exhaustion:      'error'
        int_producer:
          min:                0
          max:                1
          filter:             null
          on_exhaustion:      'error'
        float_producer:
          min:                0
          max:                1
          filter:             null
          on_exhaustion:      'error'
        chr_producer:
          min:                0x000000
          max:                0x10ffff
          prefilter:          chr_re
          filter:             null
          on_exhaustion:      'error'
        text_producer:
          min:                0x000000
          max:                0x10ffff
          length:             1
          size:               2
          min_length:         null
          max_length:         null
          filter:             null
          on_exhaustion:      'error'
        set_of_chrs:
          min:                0x000000
          max:                0x10ffff
          size:               2
          on_exhaustion:      'error'
        stats:
          float:
            rounds:          -1
          integer:
            rounds:          -1
          chr:
            rounds:          -1
          text:
            rounds:          -1
          set_of_chrs:
            rounds:          -1
          set_of_texts:
            rounds:          -1

    #---------------------------------------------------------------------------------------------------------
    ```
    // thx to https://stackoverflow.com/a/47593316/7568091
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

    // SplitMix32

    // A 32-bit state PRNG that was made by taking MurmurHash3's mixing function, adding a incrementor and
    // tweaking the constants. It's potentially one of the better 32-bit PRNGs so far; even the author of
    // Mulberry32 considers it to be the better choice. It's also just as fast.

    const splitmix32 = function ( a ) {
     return function() {
       a |= 0;
       a = a + 0x9e3779b9 | 0;
       let t = a ^ a >>> 16;
       t = Math.imul(t, 0x21f0aaad);
       t = t ^ t >>> 15;
       t = Math.imul(t, 0x735a2d97);
       return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
      }
    }

    // const prng = splitmix32((Math.random()*2**32)>>>0)
    // for(let i=0; i<10; i++) console.log(prng());
    //
    // I would recommend this if you just need a simple but good PRNG and don't need billions of random
    // numbers (see Birthday problem).
    //
    // Note: It does have one potential concern: it does not repeat previous numbers until you exhaust 4.3
    // billion numbers and it repeats again. Which may or may not be a statistical concern for your use
    // case. It's like a list of random numbers with the duplicates removed, but without any extra work
    // involved to remove them. All other generators in this list do not exhibit this behavior.
    ```

    #=========================================================================================================
    class internals.Stats

      #-------------------------------------------------------------------------------------------------------
      constructor: ({ name, on_exhaustion = 'error', on_stats = null, max_rounds = null }) ->
        @name                   = name
        @max_rounds            = max_rounds ? internals.templates.random_tools_cfg.max_rounds
        on_exhaustion          ?= 'error'
        hide @, '_finished',      false
        hide @, '_rounds',        0
        hide @, 'on_exhaustion',  switch true
          when on_exhaustion            is 'error'    then -> throw new Error "Ω___4 exhausted"
          when ( typeof on_exhaustion ) is 'function' then on_exhaustion
          ### TAINT use rpr, typing ###
          else throw new Error "Ω___5 illegal value for on_exhaustion: #{on_exhaustion}"
        hide @, 'on_stats',       switch true
          when ( typeof on_stats ) is 'function'  then on_stats
          when ( not on_stats? )                  then null
          ### TAINT use rpr, typing ###
          else throw new Error "Ω___6 illegal value for on_stats: #{on_stats}"
        return undefined

      #-------------------------------------------------------------------------------------------------------
      retry: ->
        throw new Error "Ω___7 stats has already finished" if @_finished
        @_rounds++
        return @on_exhaustion() if @exhausted
        return go_on

      #-------------------------------------------------------------------------------------------------------
      finish: ( R ) ->
        throw new Error "Ω___8 stats has already finished" if @_finished
        @_finished = true
        @on_stats { name: @name, rounds: @rounds, R, } if @on_stats?
        return R

      #-------------------------------------------------------------------------------------------------------
      set_getter @::, 'finished',   -> @_finished
      set_getter @::, 'rounds',    -> @_rounds
      set_getter @::, 'exhausted',  -> @_rounds > @max_rounds

    #=========================================================================================================
    class Get_random

      #-------------------------------------------------------------------------------------------------------
      @get_random_seed: -> ( Math.random() * 2 ** 32 ) >>> 0

      #-------------------------------------------------------------------------------------------------------
      constructor: ( cfg ) ->
        @cfg        = { internals.templates.random_tools_cfg..., cfg..., }
        @cfg.seed  ?= @constructor.get_random_seed()
        hide @, '_float', splitmix32 @cfg.seed
        return undefined


      #=======================================================================================================
      # INTERNALS
      #-------------------------------------------------------------------------------------------------------
      _new_stats: ( cfg ) ->
        return new internals.Stats { internals.templates._new_stats..., ( clean @cfg )..., cfg..., }

      #-------------------------------------------------------------------------------------------------------
      _get_min_max_length: ({ length = 1, min_length = null, max_length = null, }={}) ->
        if min_length?
          return { min_length, max_length: ( max_length ? min_length * 2 ), }
        else if max_length?
          return { min_length: ( min_length ? 1 ), max_length, }
        return { min_length: length, max_length: length, } if length?
        throw new Error "Ω__12 must set at least one of `length`, `min_length`, `max_length`"

      #-------------------------------------------------------------------------------------------------------
      _get_random_length: ({ length = 1, min_length = null, max_length = null, }={}) ->
        { min_length,
          max_length, } = @_get_min_max_length { length, min_length, max_length, }
        return min_length if min_length is max_length ### NOTE done to avoid changing PRNG state ###
        return @integer { min: min_length, max: max_length, }

      #-------------------------------------------------------------------------------------------------------
      _get_min_max: ({ min = null, max = null, }={}) ->
        min  = min.codePointAt 0 if ( typeof min ) is 'string'
        max  = max.codePointAt 0 if ( typeof max ) is 'string'
        min ?= @cfg.unicode_cid_range[ 0 ]
        max ?= @cfg.unicode_cid_range[ 1 ]
        return { min, max, }

      #-------------------------------------------------------------------------------------------------------
      _get_filter: ( filter ) ->
        return ( ( x ) -> true            ) unless filter?
        return ( filter                   ) if ( typeof filter ) is 'function'
        return ( ( x ) -> filter.test x   ) if filter instanceof RegExp
        ### TAINT use `rpr`, typing ###
        throw new Error "Ω__13 unable to turn argument into a filter: #{argument}"


      #=======================================================================================================
      # CONVENIENCE
      #-------------------------------------------------------------------------------------------------------
      # float:    ({ min = 0, max = 1, }={}) -> min + @_float() * ( max - min )
      # integer:  ({ min = 0, max = 1, }={}) -> Math.round @float { min, max, }
      float:    ( P... ) -> ( @float_producer   P... )()
      integer:  ( P... ) -> ( @integer_producer P... )()
      chr:      ( P... ) -> ( @chr_producer     P... )()
      text:     ( P... ) -> ( @text_producer    P... )()


      #=======================================================================================================
      # PRODUCERS
      #-------------------------------------------------------------------------------------------------------
      float_producer: ( cfg ) ->
        { min,
          max,
          filter,
          on_stats,
          on_exhaustion,
          max_rounds,   } = { internals.templates.float_producer..., cfg..., }
        #.....................................................................................................
        { min,
          max,          } = @_get_min_max { min, max, }
        filter            = @_get_filter filter
        #.....................................................................................................
        return float = =>
          stats = @_new_stats { name: 'float', ( clean { on_stats, on_exhaustion, max_rounds, } )..., }
          #...................................................................................................
          loop
            R = min + @_float() * ( max - min )
            return ( stats.finish R ) if ( filter R )
            return sentinel unless ( sentinel = stats.retry() ) is go_on
          #...................................................................................................
          return null

      #-------------------------------------------------------------------------------------------------------
      integer_producer: ( cfg ) ->
        { min,
          max,
          filter,
          on_stats,
          on_exhaustion,
          max_rounds,   } = { internals.templates.float_producer..., cfg..., }
        #.....................................................................................................
        { min,
          max,          } = @_get_min_max { min, max, }
        filter            = @_get_filter filter
        #.....................................................................................................
        return integer = =>
          stats = @_new_stats { name: 'integer', ( clean { on_stats, on_exhaustion, max_rounds, } )..., }
          #...................................................................................................
          loop
            R = Math.round min + @_float() * ( max - min )
            return ( stats.finish R ) if ( filter R )
            return sentinel unless ( sentinel = stats.retry() ) is go_on
          #...................................................................................................
          return null

      #-------------------------------------------------------------------------------------------------------
      chr_producer: ( cfg ) ->
        ### TAINT consider to cache result ###
        { min,
          max,
          prefilter,
          filter,
          on_stats,
          on_exhaustion,
          max_rounds,   } = { internals.templates.chr_producer..., cfg..., }
        #.....................................................................................................
        { min,
          max,          } = @_get_min_max { min, max, }
        #.....................................................................................................
        prefilter         = @_get_filter prefilter
        filter            = @_get_filter filter
        #.....................................................................................................
        return chr = =>
          stats = @_new_stats { name: 'chr', ( clean { on_stats, on_exhaustion, max_rounds, } )..., }
          #...................................................................................................
          loop
            R = String.fromCodePoint @integer { min, max, }
            return ( stats.finish R ) if ( prefilter R ) and ( filter R )
            return sentinel unless ( sentinel = stats.retry() ) is go_on
          #...................................................................................................
          return null

      #-------------------------------------------------------------------------------------------------------
      text_producer: ( cfg ) ->
        ### TAINT consider to cache result ###
        { min,
          max,
          length,
          min_length,
          max_length,
          filter,
          on_stats,
          on_exhaustion,
          max_rounds    } = { internals.templates.text_producer..., cfg..., }
        #.....................................................................................................
        { min,
          max,          } = @_get_min_max { min, max, }
        #.....................................................................................................
        { min_length,
          max_length,   } = @_get_min_max_length { length, min_length, max_length, }
        length_is_const   = min_length is max_length
        length            = min_length
        filter            = @_get_filter filter
        #.....................................................................................................
        return text = =>
          stats = @_new_stats { name: 'text', ( clean { on_stats, on_exhaustion, max_rounds, } )..., }
          #...................................................................................................
          length = @integer { min: min_length, max: max_length, } unless length_is_const
          loop
            R = ( @chr { min, max, } for _ in [ 1 .. length ] ).join ''
            return ( stats.finish R ) if ( filter R )
            return sentinel unless ( sentinel = stats.retry() ) is go_on
          #...................................................................................................
          return null


      #=======================================================================================================
      # SETS
      #-------------------------------------------------------------------------------------------------------
      set_of_chrs: ( cfg ) ->
        { min,
          max,
          size,
          on_stats,
          on_exhaustion,
          max_rounds,   } = { internals.templates.set_of_chrs..., cfg..., }
        stats             = @_new_stats { name: 'set_of_chrs', on_stats, on_exhaustion, max_rounds, }
        R                 = new Set()
        chr               = @chr_producer { min, max, }
        #.....................................................................................................
        loop
          R.add chr()
          break if R.size >= size
          return sentinel unless ( sentinel = stats.retry() ) is go_on
        return ( stats.finish R )

      #-------------------------------------------------------------------------------------------------------
      set_of_texts: ( cfg ) ->
        { min,
          max,
          length,
          size,
          min_length,
          max_length,
          filter,
          on_stats,
          on_exhaustion,
          max_rounds,   } = { internals.templates.set_of_texts..., cfg..., }
        { min_length,
          max_length,   } = @_get_min_max_length { length, min_length, max_length, }
        length_is_const   = min_length is max_length
        length            = min_length
        R                 = new Set()
        text              = @text_producer { min, max, length, min_length, max_length, filter, }
        stats             = @_new_stats { name: 'set_of_texts', on_stats, on_exhaustion, max_rounds, }
        #.....................................................................................................
        loop
          R.add text()
          break if R.size >= size
          return sentinel unless ( sentinel = stats.retry() ) is go_on
        return ( stats.finish R )


      #=======================================================================================================
      # WALKERS
      #-------------------------------------------------------------------------------------------------------
      walk: ( cfg ) ->
        { producer,
          n,
          on_stats,
          on_exhaustion,
          max_rounds    } = { internals.templates.walk..., cfg..., }
        count             = 0
        stats             = @_new_stats { name: 'walk', on_stats, on_exhaustion, max_rounds, }
        loop
          count++; break if count > n
          yield producer()
          ### NODE any filtering &c happens in producer so no extraneous rounds are ever made by `walk()`,
          therefore the `rounds` in the `walk` stats object always remains `0` ###
          # return sentinel unless ( sentinel = stats.retry() ) is go_on
        return ( stats.finish null )

      #-------------------------------------------------------------------------------------------------------
      walk_unique: ( cfg ) ->
        { producer,
          seen,
          window,
          n,
          on_stats,
          on_exhaustion,
          max_rounds    } = { internals.templates.walk..., cfg..., }
        seen             ?= new Set()
        stats             = @_new_stats { name: 'walk_unique', on_stats, on_exhaustion, max_rounds, }
        old_size          = seen.size
        loop
          seen.add Y  = producer()
          yield Y if seen.size > old_size
          old_size    = seen.size
          break if seen.size >= n
          ### TAINT implement 'stop'ping the loop ###
          continue if ( sentinel = stats.retry() ) is go_on
          yield sentinel unless on_exhaustion is 'stop'
        return ( stats.finish null )


    #=========================================================================================================
    internals = Object.freeze internals
    return exports = { Get_random, internals, }


#===========================================================================================================
Object.assign module.exports, UNSTABLE_GETRANDOM_BRICS

