'use strict'

############################################################################################################
#
#===========================================================================================================
UNSTABLE_BRICS =
  

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_next_free_filename: ->
    cfg =
      max_retries:    9999
      prefix:         '~.'
      suffix:         '.bricabrac-cache'
    cache_filename_re = ///
      ^
      (?: #{RegExp.escape cfg.prefix} )
      (?<first>.*)
      \.
      (?<nr>[0-9]{4})
      (?: #{RegExp.escape cfg.suffix} )
      $
      ///v
    # cache_suffix_re = ///
    #   (?: #{RegExp.escape cfg.suffix} )
    #   $
    #   ///v
    rpr               = ( x ) ->
      return "'#{x.replace /'/g, "\\'" if ( typeof x ) is 'string'}'"
      return "#{x}"
    errors =
      TMP_exhaustion_error: class TMP_exhaustion_error extends Error
      TMP_validation_error: class TMP_validation_error extends Error
    FS            = require 'node:fs'
    PATH          = require 'node:path'
    #.......................................................................................................
    exists = ( path ) ->
      try FS.statSync path catch error then return false
      return true
    #.......................................................................................................
    get_next_filename = ( path ) ->
      ### TAINT use proper type checking ###
      throw new errors.TMP_validation_error "Ω___1 expected a text, got #{rpr path}" unless ( typeof path ) is 'string'
      throw new errors.TMP_validation_error "Ω___2 expected a nonempty text, got #{rpr path}" unless path.length > 0
      dirname  = PATH.dirname path
      basename = PATH.basename path
      unless ( match = basename.match cache_filename_re )?
        return PATH.join dirname, "#{cfg.prefix}#{basename}.0001#{cfg.suffix}"
      { first, nr,  } = match.groups
      nr              = "#{( parseInt nr, 10 ) + 1}".padStart 4, '0'
      path            = first
      return PATH.join dirname, "#{cfg.prefix}#{first}.#{nr}#{cfg.suffix}"
    #.......................................................................................................
    get_next_free_filename = ( path ) ->
      R             = path
      failure_count = -1
      #.....................................................................................................
      loop
        #...................................................................................................
        failure_count++
        if failure_count > cfg.max_retries
           throw new errors.TMP_exhaustion_error "Ω___3 too many (#{failure_count}) retries;  path #{rpr R} exists"
        #...................................................................................................
        R = get_next_filename R
        break unless exists R
      return R
    #.......................................................................................................
    # swap_suffix = ( path, suffix ) -> path.replace cache_suffix_re, suffix
    #.......................................................................................................
    return exports = { get_next_free_filename, get_next_filename, exists, cache_filename_re, errors, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_command_line_tools: ->
    CP = require 'node:child_process'
    #-----------------------------------------------------------------------------------------------------------
    get_command_line_result = ( command, input ) ->
      return ( CP.execSync command, { encoding: 'utf-8', input, } ).replace /\n$/s, ''

    #-----------------------------------------------------------------------------------------------------------
    get_wc_max_line_length = ( text ) ->
      ### thx to https://unix.stackexchange.com/a/258551/280204 ###
      return parseInt ( get_command_line_result 'wc --max-line-length', text ), 10

    #.......................................................................................................
    return exports = { get_command_line_result, get_wc_max_line_length, }


  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_random_tools: ->
    { hide,
      get_setter,                 } = ( require './various-brics' ).require_managed_property_tools()
    ### TAINT replace ###
    # { default: _get_unique_text,  } = require 'unique-string'
    chr_re = ///^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$///v

    #---------------------------------------------------------------------------------------------------------
    internals = Object.freeze
      chr_re: chr_re
      templates: Object.freeze
        random_tools_cfg: Object.freeze
          seed:               null
          size:               1_000
          max_retries:        1_000
          # unique_count:   1_000
          on_stats:           null
          unicode_cid_range:  Object.freeze [ 0x0000, 0x10ffff ]
        chr_producer:
          min:                0x000000
          max:                0x10ffff
          prefilter:          chr_re
          filter:             null
        text_producer:
          min:                0x000000
          max:                0x10ffff
          length:             1
          min_length:         null
          max_length:         null
          filter:             null
        set_of_chrs:
          min:                0x000000
          max:                0x10ffff
          size:               2
        text_producer:
          min:                0x000000
          max:                0x10ffff
          length:             1
          size:               2
          min_length:         null
          max_length:         null
          filter:             null
        stats:
          chr:
            retries:          -1
          text:
            retries:          -1
          set_of_chrs:
            retries:          -1
          set_of_texts:
            retries:          -1

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
      # STATS
      #-------------------------------------------------------------------------------------------------------
      _create_stats_for: ( name ) ->
        unless ( template = internals.templates.stats[ name ] )?
          throw new Error "Ω___4 unknown stats name #{name}" ### TAINT use rpr() ###
        stats = { template..., }
        #.....................................................................................................
        if @cfg.on_stats? then  finish = ( R ) => @cfg.on_stats { name, stats, R, }; R
        else                    finish = ( R ) => R
        #.....................................................................................................
        return { stats, finish, }


      #=======================================================================================================
      # INTERNALS
      #-------------------------------------------------------------------------------------------------------
      _get_min_max_length: ({ length = 1, min_length = null, max_length = null, }={}) ->
        if min_length?
          return { min_length, max_length: ( max_length ? min_length * 2 ), }
        else if max_length?
          return { min_length: ( min_length ? 1 ), max_length, }
        return { min_length: length, max_length: length, } if length?
        throw new Error "Ω___5 must set at least one of `length`, `min_length`, `max_length`"

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
        throw new Error "Ω__11 unable to turn argument into a filter: #{argument}"


      #=======================================================================================================
      # CONVENIENCE
      #-------------------------------------------------------------------------------------------------------
      chr:      ( P... ) -> ( @chr_producer P... )()
      text:     ( P... ) -> ( @text_producer P... )()
      float:    ({ min = 0, max = 1, }={}) -> min + @_float() * ( max - min )
      integer:  ({ min = 0, max = 1, }={}) -> Math.round @float { min, max, }


      #=======================================================================================================
      # PRODUCERS
      #-------------------------------------------------------------------------------------------------------
      chr_producer: ( cfg ) ->
        ### TAINT consider to cache result ###
        { min,
          max,
          prefilter,
          filter,     } = { internals.templates.chr_producer..., cfg..., }
        #.....................................................................................................
        { min,
          max,        } = @_get_min_max { min, max, }
        #.....................................................................................................
        prefilter       = @_get_filter prefilter
        filter          = @_get_filter filter
        #.....................................................................................................
        return chr = =>
          { stats,
            finish,     } = @_create_stats_for 'chr'
          #.....................................................................................................
          loop
            stats.retries++; throw new Error "Ω__12 exhausted" if stats.retries > @cfg.max_retries
            R = String.fromCodePoint @integer { min, max, }
            return ( finish R ) if ( prefilter R ) and ( filter R )
          #.....................................................................................................
          return null

      #-------------------------------------------------------------------------------------------------------
      text_producer: ( cfg ) ->
        ### TAINT consider to cache result ###
        { min,
          max,
          length,
          min_length,
          max_length,
          filter,     } = { internals.templates.text_producer..., cfg..., }
        #.....................................................................................................
        { min,
          max,        } = @_get_min_max { min, max, }
        #.....................................................................................................
        { min_length,
          max_length, } = @_get_min_max_length { length, min_length, max_length, }
        length_is_const = min_length is max_length
        length          = min_length
        #.....................................................................................................
        filter          = @_get_filter filter
        #.....................................................................................................
        return text = =>
          { stats,
            finish,     } = @_create_stats_for 'text'
          #.....................................................................................................
          length = @integer { min: min_length, max: max_length, } unless length_is_const
          loop
            stats.retries++; throw new Error "Ω__10 exhausted" if stats.retries > @cfg.max_retries
            R = ( @chr { min, max, } for _ in [ 1 .. length ] ).join ''
            return ( finish R ) if ( filter R )
          #.....................................................................................................
          return null


      #=======================================================================================================
      # SETS
      #-------------------------------------------------------------------------------------------------------
      set_of_chrs: ( cfg ) ->
        { stats,
          finish,     } = @_create_stats_for 'set_of_chrs'
        { min,
          max,
          size,       } = { internals.templates.set_of_chrs..., cfg..., }
        R               = new Set()
        chr             = @chr_producer { min, max, }
        #.....................................................................................................
        while R.size < size
          stats.retries++; throw new Error "Ω__12 exhausted" if stats.retries > @cfg.max_retries
          R.add chr()
        return ( finish R )

      #-------------------------------------------------------------------------------------------------------
      set_of_texts: ( cfg ) ->
        { stats,
          finish,     } = @_create_stats_for 'set_of_texts'
        { min,
          max,
          length,
          size,
          min_length,
          max_length,
          filter,     } = { internals.templates.set_of_texts..., cfg..., }
        { min_length,
          max_length, } = @_get_min_max_length { length, min_length, max_length, }
        length_is_const = min_length is max_length
        length          = min_length
        R               = new Set()
        text            = @text_producer { min, max, length, min_length, max_length, filter, }
        #.....................................................................................................
        while R.size < size
          stats.retries++; throw new Error "Ω__12 exhausted" if stats.retries > @cfg.max_retries
          R.add text()
        return ( finish R )


      #=======================================================================================================
      # WALKERS
      #-------------------------------------------------------------------------------------------------------
      walk: ({ producer, n = 1, }={}) ->
        count = 0
        loop
          count++; break if count > n
          yield producer()
        return null

    #=========================================================================================================
    return exports = { Get_random, internals, }


#===========================================================================================================
Object.assign module.exports, UNSTABLE_BRICS

