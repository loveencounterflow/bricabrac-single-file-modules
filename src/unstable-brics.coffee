'use strict'

############################################################################################################
#
#===========================================================================================================
UNSTABLE_BRICS =
  

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_next_free_filename: ->
    cfg =
      max_attempts:   9999
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
      throw new errors.TMP_validation_error "Ω___9 expected a text, got #{rpr path}" unless ( typeof path ) is 'string'
      throw new errors.TMP_validation_error "Ω__10 expected a nonempty text, got #{rpr path}" unless path.length > 0
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
        if failure_count > cfg.max_attempts
          throw new errors.TMP_exhaustion_error "Ω__11 too many (#{failure_count}) attempts; path #{rpr R} exists"
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

    #---------------------------------------------------------------------------------------------------------
    internals = Object.freeze
      chr_re: ///^(?:\p{L}|\p{Zs}|\p{Z}|\p{M}|\p{N}|\p{P}|\p{S})$///v
      templates:
        random_tools_cfg:
          seed:           null
          size:           1_000
          max_attempts:   1_000
          # unique_count:   1_000
          unicode_ranges: [ 0x0000 .. 0x10ffff ]

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
        hide @, '_seen',
          float: new Set()
        return undefined

      #-------------------------------------------------------------------------------------------------------
      float:    ( min = 0, max = 1 ) -> min + @_float() * ( max - min )
      integer:  ( min = 0, max = 1 ) -> Math.round @float min, max

      #-------------------------------------------------------------------------------------------------------
      chr: ->
        count = 0
        loop
          count++
          throw new Error "Ω__10 exhausted" if count > @cfg.max_attempts
          return R if internals.chr_re.test ( R = String.fromCodePoint @integer 0x0000, 0x10ffff )
        return null

      # #-------------------------------------------------------------------------------------------------------
      # unique_float: ({ min = 0, max = 1, }) ->
      #   ### TAINT refactor ###
      #   cache = @_seen.float
      #   if cache.size >= @cfg.unique_count
      #     for e from cache
      #       cache.delete e
      #       break
      #   #.....................................................................................................
      #   ### TAINT refactor ###
      #   old_size = cache.size
      #   while cache.size is old_size
      #     R = @_float()
      #     cache.add R
      #   #.....................................................................................................
      #   return R if min is 0 and max is 1
      #   return min + R * ( max - min )

      #-------------------------------------------------------------------------------------------------------
      get_unique_random: ->

      #-------------------------------------------------------------------------------------------------------
      get_codepoi = ( cfg ) ->

      #-------------------------------------------------------------------------------------------------------
      get_unique_text = ( cfg ) ->
        cfg = { internals.templates.get_texts_mapped_to_width_length_cfg..., cfg..., }

      _get_unique_text = ( min_length ) -> _get_unique_text()[ .. ( GUY.rnd.random_integer 1, 15 ) ]

      #-------------------------------------------------------------------------------------------------------
      get_texts_mapped_to_width_length = ( cfg ) ->
        cfg       = { internals.templates.get_texts_mapped_to_width_length_cfg..., cfg..., }
        R         = new Map()
        old_size  = 0
        loop
          while R.size is old_size
            entry = [ get_unique_text(), ( GUY.rnd.random_integer 0, 10 ), ]
            R.set entry...
          old_size = R.size
          break if old_size >= cfg.size
        return R

    #=========================================================================================================
    return exports = { Get_random, internals, }


#===========================================================================================================
Object.assign module.exports, UNSTABLE_BRICS

