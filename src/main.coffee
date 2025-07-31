
############################################################################################################
#
#===========================================================================================================
module.exports = SFMODULES =

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_list_tools: ->
    append    = ( list, P... ) -> list.splice list.length, 0, P...
    is_empty  = ( list ) -> list.length is 0
    return { append, is_empty, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_escape_html_text: ->
    escape_html_text = ( text ) ->
      R = text
      R = R.replace /&/g, '&amp;'
      R = R.replace /</g, '&lt;'
      R = R.replace />/g, '&gt;'
      return R
    return { escape_html_text, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_tagfun_tools: ->

    # ### Given the arguments of either a tagged template function call ('tagfun call') or the single
    # argument of a conventional function call, `get_first_argument()` will return either

    # * the result of applying `as_text()` to the sole argument, or

    # * the result of concatenating the constant parts and the interpolated expressions, which each
    # expression replaced by the result of applying `as_text()` to it.

    # Another way to describe this behavior is to say that this function treats a conventional call with
    # a single expression the same way that it treats a funtag call with a string that contains nothing but
    # that same expression, so the invariant `( get_first_argument exp ) == ( get_first_argument"#{ exp }"
    # )` holds.

    # * intended for string producers, text processing, markup production;
    # * list some examples. ###

    # #---------------------------------------------------------------------------------------------------------
    # create_get_first_argument_fn = ( as_text = null ) ->
    #   as_text ?= ( expression ) -> "#{expression}"
    #   ### TAINT use proper validation ###
    #   unless ( typeof as_text ) is 'function'
    #     throw new Error "Ωidsp___1 expected a function, got #{rpr as_text}"
    #   #-------------------------------------------------------------------------------------------------------
    #   get_first_argument = ( P... ) ->
    #     unless is_tagfun_call P...
    #       unless P.length is 1
    #         throw new Error "Ωidsp___2 expected 1 argument, got #{P.length}"
    #       return as_text P[ 0 ]
    #     #.....................................................................................................
    #     [ parts, expressions..., ] = P
    #     R = parts[ 0 ]
    #     for expression, idx in expressions
    #       R += ( as_text expression ) + parts[ idx + 1 ]
    #     return R
    #   #-------------------------------------------------------------------------------------------------------
    #   get_first_argument.create = create_get_first_argument_fn
    #   return get_first_argument

    #---------------------------------------------------------------------------------------------------------
    is_tagfun_call = ( P... ) ->
      return false unless Array.isArray   P[ 0 ]
      return false unless Object.isFrozen P[ 0 ]
      return false unless P[ 0 ].raw?
      return true

    #---------------------------------------------------------------------------------------------------------
    walk_raw_parts = ( chunks, values... ) ->
      chunks      = ( chunk for chunk in chunks.raw )
      chunks.raw  = chunks[ ... ]
      Object.freeze chunks
      yield from walk_parts chunks, values...

    #---------------------------------------------------------------------------------------------------------
    walk_parts = ( chunks, values... ) ->
      unless is_tagfun_call chunks, values...
        if values.length isnt 0
          throw new Error "Ω___3 expected 1 argument in non-template call, got #{arguments.length}"
        if typeof chunks is 'string' then [ chunks, values, ] = [ [ chunks, ], [],          ]
        else                              [ chunks, values, ] = [ [ '', '', ], [ chunks, ], ]
      #.......................................................................................................
      yield { chunk: chunks[ 0 ], isa: 'chunk', }
      for value, idx in values
        yield { value, isa: 'value', }
        yield { chunk: chunks[ idx + 1 ], isa: 'chunk', }
      #.......................................................................................................
      return null

    #---------------------------------------------------------------------------------------------------------
    walk_raw_nonempty_parts = ( chunks, values... ) ->
      for part from walk_raw_parts chunks, values...
        yield part unless ( part.chunk is '' ) or ( part.value is '' )
      return null

    #---------------------------------------------------------------------------------------------------------
    walk_nonempty_parts = ( chunks, values... ) ->
      for part from walk_parts chunks, values...
        yield part unless ( part.chunk is '' ) or ( part.value is '' )
      return null

    #---------------------------------------------------------------------------------------------------------
    # return do exports = ( get_first_argument = create_get_first_argument_fn() ) -> {
    #   get_first_argument, is_tagfun_call,
    #   walk_parts, walk_nonempty_parts, walk_raw_parts, walk_raw_nonempty_parts, }
    return {
      is_tagfun_call,
      walk_parts,           walk_raw_parts,
      walk_nonempty_parts,  walk_raw_nonempty_parts, }


  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_managed_property_tools: ->
    set_getter = ( object, name, get ) -> Object.defineProperties object, { [name]: { get, }, }
    hide = ( object, name, value ) => Object.defineProperty object, name,
        enumerable:   false
        writable:     true
        configurable: true
        value:        value

    #---------------------------------------------------------------------------------------------------------
    return { set_getter, hide, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_nameit: ->
    nameit = ( name, fn ) -> Object.defineProperty fn, 'name', { value: name, }; fn
    #---------------------------------------------------------------------------------------------------------
    return { nameit, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_stack_classes: ->
    { set_getter,
      hide,       } = SFMODULES.require_managed_property_tools()
    misfit          = Symbol 'misfit'
    class XXX_Stack_error extends Error

    #===========================================================================================================
    class Stack

      #---------------------------------------------------------------------------------------------------------
      constructor: ->
        @data = []
        return undefined

      #---------------------------------------------------------------------------------------------------------
      toString: -> "[#{ ( "#{e}" for e in @data ).join'.' }]"

      #---------------------------------------------------------------------------------------------------------
      set_getter @::, 'length',   -> @data.length
      set_getter @::, 'is_empty', -> @data.length is 0
      clear: -> @data.length = 0; null
      [Symbol.iterator]: -> yield from @data

      #---------------------------------------------------------------------------------------------------------
      push:     ( x ) -> @data.push x;    null
      unshift:  ( x ) -> @data.unshift x; null

      #---------------------------------------------------------------------------------------------------------
      pop: ( fallback = misfit ) ->
        if @is_empty
          return fallback unless fallback is misfit
          throw new XXX_Stack_error "Ωidsp___4 unable to pop value from empty stack"
        return @data.pop()

      #---------------------------------------------------------------------------------------------------------
      shift: ( fallback = misfit ) ->
        if @is_empty
          return fallback unless fallback is misfit
          throw new XXX_Stack_error "Ωidsp___5 unable to shift value from empty stack"
        return @data.shift()

      #---------------------------------------------------------------------------------------------------------
      peek: ( fallback = misfit ) ->
        if @is_empty
          return fallback unless fallback is misfit
          throw new XXX_Stack_error "Ωidsp___6 unable to peek value of empty stack"
        return @data.at -1

    #-----------------------------------------------------------------------------------------------------------
    return { Stack, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_infiniproxy: ->
    ###

    ## To Do

    * **`[—]`** allow to set context to be used by `apply()`
    * **`[—]`** allow to call `sys.stack.clear()` manually where seen fit

    ###
    { hide,               } = SFMODULES.require_managed_property_tools()
    { Stack,              } = SFMODULES.require_stack_classes()
    ### TAINT in this simulation of single-file modules, a new distinct symbol is produced with each call to
    `require_infiniproxy()` ###
    sys_symbol              = Symbol 'sys'
    # misfit                  = Symbol 'misfit'
    template                =
      ### An object that will be checked for existing properties to return; when no provider is given or a
      provider lacks a requested property, `sys.sub_level_proxy` will be returned for property accesses: ###
      provider:     Object.create null
      ### A function to be called when the proxy (either `sys.top_level_proxy` or `sys.sub_level_proxy`) is
      called; notice that if the `provider` provides a method for a given key, that method will be called
      instead of the `callee`: ###
      callee:       null

    #=========================================================================================================
    create_infinyproxy = ( cfg ) ->
      ### TAINT use proper typechecking ###
      cfg = { template...,  cfg..., }
      #.......................................................................................................
      new_proxy = ({ is_top_level, }) ->
        callee_ctx  = null
        get_ctx     = -> callee_ctx ?= { is_top_level, cfg..., sys..., }
        #.....................................................................................................
        R = new Proxy cfg.callee,

          #-----------------------------------------------------------------------------------------------------
          apply: ( target, key, P ) ->
            # urge 'Ω__10', "apply #{rpr { target, key, P, is_top_level, }}"

            R = Reflect.apply target, get_ctx(), P
            sys.stack.clear()
            return R

          #-----------------------------------------------------------------------------------------------------
          get: ( target, key ) ->
            # urge 'Ω__11', "get #{rpr { target, key, }}"
            return get_ctx()                      if key is sys_symbol
            return target[ key ]                  if ( typeof key ) is 'symbol'
            return Reflect.get cfg.provider, key  if Reflect.has cfg.provider, key
            sys.stack.clear() if is_top_level
            sys.stack.push key
            # return "[result for getting non-preset key #{rpr key}] from #{rpr provider}"
            return sys.sub_level_proxy
        #.....................................................................................................
        return R
      #.......................................................................................................
      sys = { stack: new Stack(), }
      sys.top_level_proxy = new_proxy { is_top_level: true,  }
      sys.sub_level_proxy = new_proxy { is_top_level: false, }
      #.......................................................................................................
      return sys.top_level_proxy

    #---------------------------------------------------------------------------------------------------------
    return { create_infinyproxy, sys_symbol, }


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
        if failure_count > cfg.max_attempts
          throw new errors.TMP_exhaustion_error "Ω___5 too many (#{failure_count}) attempts; path #{rpr R} exists"
        #...................................................................................................
        R = get_next_filename R
        break unless exists R
      return R
    #.......................................................................................................
    return exports = { get_next_free_filename, get_next_filename, exists, cache_filename_re, errors, }


  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_ansi: ->

    #=========================================================================================================
    ANSI = new class Ansi
      ###

      * as for the background ('bg'), only colors and no effects can be set; in addition, the bg color can be
        set to its default (or 'transparent'), which will show the terminal's or the terminal emulator's
        configured bg color
      * as for the foreground ('fg'), colors and effects such as blinking, bold, italic, underline, overline,
        strike can be set; in addition, the configured terminal default font color can be set, and each effect
        has a dedicated off-switch
      * neat tables can be drawn by combining the overline effect with `│` U+2502 'Box Drawing Light Vertical
        Line'; the renmarkable feature of this is that it minimizes spacing around characters meaning it's
        possible to have adjacent rows of cells separated from the next row by a border without having to
        sacrifice a line of text just to draw the border.
      * while the two color palattes implied by the standard XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        * better to only use full RGB than to fuzz around with palettes
        * apps that use colors at all should be prepared for dark and bright backgrounds
        * in general better to set fg, bg colors than to use reverse
        * but reverse actually does do what it says—it swaps fg with bg color

      \x1b[39m default fg color
      \x1b[49m default bg color

      ###
      #-------------------------------------------------------------------------------------------------------
      fg_from_dec: ([ r, g, b, ]) -> "\x1b[38:2::#{r}:#{g}:#{b}m"
      bg_from_dec: ([ r, g, b, ]) -> "\x1b[48:2::#{r}:#{g}:#{b}m"
      fg_from_hex: ( rhx ) -> @fg_from_dec @dec_from_hex rhx
      bg_from_hex: ( rhx ) -> @bg_from_dec @dec_from_hex rhx
      fg_from_name: ( name ) ->
        rgb = @colors[ name ] ? @colors.fallback
        return @fg_from_dec rgb
      dec_from_hex: ( hex ) ->
        ### TAINT use proper typing ###
        throw new Error "Ω__25 expected text, got #{rpr hex}" unless ( typeof hex ) is 'string'
        throw new Error "Ω__25 not a proper hexadecimal RGB code: '#{hex.replace /'/g, "\\'"}'" unless /^#[0-9a-f]{6}$/i.test hex
        [ r16, g16, b16, ] = [ hex[ 1 .. 2 ], hex[ 3 .. 4 ], hex[ 5 .. 6 ], ]
        return [ ( parseInt r16, 16 ), ( parseInt g16, 16 ), ( parseInt b16, 16 ), ]

    #---------------------------------------------------------------------------------------------------------
    return exports = { ANSI, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_ansi_colors_and_effects: ->
    { ANSI, } = SFMODULES.require_ansi()
    #.........................................................................................................
    rgb_dec =
      black:              [   0,   0,   0, ]
      darkslategray:      [  47,  79,  79, ]
      dimgray:            [ 105, 105, 105, ]
      slategray:          [ 112, 128, 144, ]
      gray:               [ 128, 128, 128, ]
      lightslategray:     [ 119, 136, 153, ]
      darkgray:           [ 169, 169, 169, ]
      silver:             [ 192, 192, 192, ]
      lightgray:          [ 211, 211, 211, ]
      gainsboro:          [ 220, 220, 220, ]
    #.........................................................................................................
    rgb_hex =
      white:            '#ffffff'
      amethyst:         '#f0a3ff'
      blue:             '#0075dc'
      caramel:          '#993f00'
      damson:           '#4c005c'
      ebony:            '#191919'
      forest:           '#005c31'
      green:            '#2bce48'
      lime:             '#9dcc00'
      quagmire:         '#426600'
      honeydew:         '#ffcc99'
      iron:             '#808080'
      jade:             '#94ffb5'
      khaki:            '#8f7c00'
      mallow:           '#c20088'
      navy:             '#003380'
      orpiment:         '#ffa405'
      pink:             '#ffa8bb'
      red:              '#ff0010'
      sky:              '#5ef1f2'
      turquoise:        '#00998f'
      violet:           '#740aff'
      wine:             '#990000'
      uranium:          '#e0ff66'
      xanthin:          '#ffff80'
      yellow:           '#ffe100'
      zinnia:           '#ff5005'
    #.........................................................................................................
    R =
      overline1:          '\x1b[53m'
      overline0:          '\x1b[55m'
      default:            '\x1b[39m'
      bg_default:         '\x1b[49m'
      bold:               '\x1b[1m'
      bold0:              '\x1b[22m'
      italic:             '\x1b[3m'
      italic0:            '\x1b[23m'
      reset:              '\x1b[0m'
      #.......................................................................................................
      black:              ANSI.fg_from_dec rgb_dec.black
      darkslategray:      ANSI.fg_from_dec rgb_dec.darkslategray
      dimgray:            ANSI.fg_from_dec rgb_dec.dimgray
      slategray:          ANSI.fg_from_dec rgb_dec.slategray
      gray:               ANSI.fg_from_dec rgb_dec.gray
      lightslategray:     ANSI.fg_from_dec rgb_dec.lightslategray
      darkgray:           ANSI.fg_from_dec rgb_dec.darkgray
      silver:             ANSI.fg_from_dec rgb_dec.silver
      lightgray:          ANSI.fg_from_dec rgb_dec.lightgray
      gainsboro:          ANSI.fg_from_dec rgb_dec.gainsboro
      #.......................................................................................................
      white:              ANSI.fg_from_hex rgb_hex.white
      amethyst:           ANSI.fg_from_hex rgb_hex.amethyst
      blue:               ANSI.fg_from_hex rgb_hex.blue
      caramel:            ANSI.fg_from_hex rgb_hex.caramel
      damson:             ANSI.fg_from_hex rgb_hex.damson
      ebony:              ANSI.fg_from_hex rgb_hex.ebony
      forest:             ANSI.fg_from_hex rgb_hex.forest
      green:              ANSI.fg_from_hex rgb_hex.green
      lime:               ANSI.fg_from_hex rgb_hex.lime
      quagmire:           ANSI.fg_from_hex rgb_hex.quagmire
      honeydew:           ANSI.fg_from_hex rgb_hex.honeydew
      iron:               ANSI.fg_from_hex rgb_hex.iron
      jade:               ANSI.fg_from_hex rgb_hex.jade
      khaki:              ANSI.fg_from_hex rgb_hex.khaki
      mallow:             ANSI.fg_from_hex rgb_hex.mallow
      navy:               ANSI.fg_from_hex rgb_hex.navy
      orpiment:           ANSI.fg_from_hex rgb_hex.orpiment
      pink:               ANSI.fg_from_hex rgb_hex.pink
      red:                ANSI.fg_from_hex rgb_hex.red
      sky:                ANSI.fg_from_hex rgb_hex.sky
      turquoise:          ANSI.fg_from_hex rgb_hex.turquoise
      violet:             ANSI.fg_from_hex rgb_hex.violet
      wine:               ANSI.fg_from_hex rgb_hex.wine
      uranium:            ANSI.fg_from_hex rgb_hex.uranium
      xanthin:            ANSI.fg_from_hex rgb_hex.xanthin
      yellow:             ANSI.fg_from_hex rgb_hex.yellow
      zinnia:             ANSI.fg_from_hex rgb_hex.zinnia
      #.......................................................................................................
      bg_black:           ANSI.bg_from_dec rgb_dec.black
      bg_darkslategray:   ANSI.bg_from_dec rgb_dec.darkslategray
      bg_dimgray:         ANSI.bg_from_dec rgb_dec.dimgray
      bg_slategray:       ANSI.bg_from_dec rgb_dec.slategray
      bg_gray:            ANSI.bg_from_dec rgb_dec.gray
      bg_lightslategray:  ANSI.bg_from_dec rgb_dec.lightslategray
      bg_darkgray:        ANSI.bg_from_dec rgb_dec.darkgray
      bg_silver:          ANSI.bg_from_dec rgb_dec.silver
      bg_lightgray:       ANSI.bg_from_dec rgb_dec.lightgray
      bg_gainsboro:       ANSI.bg_from_dec rgb_dec.gainsboro
      #.......................................................................................................
      bg_white:           ANSI.bg_from_hex rgb_hex.white
      bg_amethyst:        ANSI.bg_from_hex rgb_hex.amethyst
      bg_blue:            ANSI.bg_from_hex rgb_hex.blue
      bg_caramel:         ANSI.bg_from_hex rgb_hex.caramel
      bg_damson:          ANSI.bg_from_hex rgb_hex.damson
      bg_ebony:           ANSI.bg_from_hex rgb_hex.ebony
      bg_forest:          ANSI.bg_from_hex rgb_hex.forest
      bg_green:           ANSI.bg_from_hex rgb_hex.green
      bg_lime:            ANSI.bg_from_hex rgb_hex.lime
      bg_quagmire:        ANSI.bg_from_hex rgb_hex.quagmire
      bg_honeydew:        ANSI.bg_from_hex rgb_hex.honeydew
      bg_iron:            ANSI.bg_from_hex rgb_hex.iron
      bg_jade:            ANSI.bg_from_hex rgb_hex.jade
      bg_khaki:           ANSI.bg_from_hex rgb_hex.khaki
      bg_mallow:          ANSI.bg_from_hex rgb_hex.mallow
      bg_navy:            ANSI.bg_from_hex rgb_hex.navy
      bg_orpiment:        ANSI.bg_from_hex rgb_hex.orpiment
      bg_pink:            ANSI.bg_from_hex rgb_hex.pink
      bg_red:             ANSI.bg_from_hex rgb_hex.red
      bg_sky:             ANSI.bg_from_hex rgb_hex.sky
      bg_turquoise:       ANSI.bg_from_hex rgb_hex.turquoise
      bg_violet:          ANSI.bg_from_hex rgb_hex.violet
      bg_wine:            ANSI.bg_from_hex rgb_hex.wine
      bg_uranium:         ANSI.bg_from_hex rgb_hex.uranium
      bg_xanthin:         ANSI.bg_from_hex rgb_hex.xanthin
      bg_yellow:          ANSI.bg_from_hex rgb_hex.yellow
      bg_zinnia:          ANSI.bg_from_hex rgb_hex.zinnia
    #.........................................................................................................
    return { ansi_colors_and_effects: R, }
