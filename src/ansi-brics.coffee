'use strict'

############################################################################################################
#
#===========================================================================================================
ANSI_BRICS =
  

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
        throw new Error "Ω___3 expected text, got #{rpr hex}" unless ( typeof hex ) is 'string'
        throw new Error "Ω___4 not a proper hexadecimal RGB code: '#{hex.replace /'/g, "\\'"}'" unless /^#[0-9a-f]{6}$/i.test hex
        [ r16, g16, b16, ] = [ hex[ 1 .. 2 ], hex[ 3 .. 4 ], hex[ 5 .. 6 ], ]
        return [ ( parseInt r16, 16 ), ( parseInt g16, 16 ), ( parseInt b16, 16 ), ]

    #---------------------------------------------------------------------------------------------------------
    return exports = { ANSI, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_ansi_colors_and_effects: ->
    { ANSI, } = ANSI_BRICS.require_ansi()
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

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_ansi_chunker: ->

    #=========================================================================================================
    VARIOUS_BRICS           = require './various-brics'
    { set_getter,
      hide,               } = VARIOUS_BRICS.require_managed_property_tools()
    segmenter               = new Intl.Segmenter()
    #.........................................................................................................
    simple_get_width  = ( text ) -> ( Array.from text ).length
    ansi_splitter     = /((?:\x1b\[[^m]+m)+)/g
    js_segmentize     = ( text ) -> ( d.segment for d from segmenter.segment text )
    cfg_template      = Object.freeze
      splitter:           ansi_splitter
      get_width:          simple_get_width
      segmentize:         js_segmentize
    #.........................................................................................................
    internals         = Object.freeze { simple_get_width, ansi_splitter, js_segmentize, cfg_template, }

    #=========================================================================================================
    class Chunk

      #-------------------------------------------------------------------------------------------------------
      [Symbol.iterator]: -> yield from @text

      #-------------------------------------------------------------------------------------------------------
      constructor: ({ has_ansi, width, text, }) ->
        @width = width
        hide @, 'has_ansi', has_ansi
        hide @, 'text',     text
        return undefined

      #-------------------------------------------------------------------------------------------------------
      set_getter @::, 'length', -> @text.length

    #=========================================================================================================
    class Ansi_chunker

      #-------------------------------------------------------------------------------------------------------
      [Symbol.iterator]: -> yield from @chunks

      #-------------------------------------------------------------------------------------------------------
      constructor: ( cfg = null ) ->
        hide @, 'cfg', { cfg_template..., cfg..., }
        hide @, 'chunks',   []
        @reset()
        return undefined

      #-------------------------------------------------------------------------------------------------------
      set_getter @::, 'has_ansi', ->
        for chunk in @chunks
          return true if chunk.has_ansi
        return false

      #-------------------------------------------------------------------------------------------------------
      set_getter @::, 'width',  -> @chunks.reduce ( ( sum, chunk ) -> sum + chunk.width   ), 0
      set_getter @::, 'length', -> @chunks.reduce ( ( sum, chunk ) -> sum + chunk.length  ), 0
      set_getter @::, 'text',   -> @chunks.reduce ( ( sum, chunk ) -> sum + chunk.text    ), ''

      #-------------------------------------------------------------------------------------------------------
      reset: ->
        @chunks   = []
        return null

      #-------------------------------------------------------------------------------------------------------
      chunkify: ( source ) ->
        @reset()
        if source is ''
          ### TAINT might as well return an empty list of @chunks ###
          @chunks.push new Chunk { has_ansi: false, width: 0, text: '', }
          return @
        #.....................................................................................................
        has_ansi = true
        for text in source.split @cfg.splitter
          has_ansi  = not has_ansi
          continue if text is ''
          width     = if has_ansi then 0 else @cfg.get_width text
          @chunks.push new Chunk { has_ansi, width, text, }
        #.....................................................................................................
        return @

    #=========================================================================================================
    chunkify = ( text ) -> new Ansi_chunker text


    #=========================================================================================================
    return exports = { Ansi_chunker, chunkify, internals, }


  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_chr_gauge: ->
    { ansi_colors_and_effects: C, } = ANSI_BRICS.require_ansi_colors_and_effects()
    build_chr_gauge = ({ length = 30, }) ->
      even_color    = ( x ) -> C.bg_yellow  + C.black   + C.bold + "#{x}" + C.reset
      odd_color     = ( x ) -> C.bg_black   + C.yellow  + C.bold + "#{x}" + C.reset
      decade_color  = ( x ) -> C.bg_white   + C.red     + C.bold + "#{x}" + C.reset
      decade        = 0
      count         = 0
      R             = ''
      loop
        for unit in [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ]
          count++
          break if count > length
          if unit is 0
            decade++
            R += decade_color decade
          else
            R += ( if unit %% 2 is 0 then even_color else odd_color ) unit
        break if count > length
      return R


    #=========================================================================================================
    return exports = { build_chr_gauge, }

#===========================================================================================================
Object.assign module.exports, ANSI_BRICS

