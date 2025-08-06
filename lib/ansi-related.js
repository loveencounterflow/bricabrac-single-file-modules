(function() {
  'use strict';
  var ANSI_BRICS;

  console.debug('Ωbrcs___1', require('./main'));

  //###########################################################################################################

  //===========================================================================================================
  ANSI_BRICS = {
    demo: function() {
      return console.debug('Ωbrcs___2', require('./main'));
    }
  };

  // #===========================================================================================================
  // ### NOTE Future Single-File Module ###
  // require_ansi: ->

  //   #=========================================================================================================
  //   ANSI = new class Ansi
  //     ###

  //     * as for the background ('bg'), only colors and no effects can be set; in addition, the bg color can be
  //       set to its default (or 'transparent'), which will show the terminal's or the terminal emulator's
  //       configured bg color
  //     * as for the foreground ('fg'), colors and effects such as blinking, bold, italic, underline, overline,
  //       strike can be set; in addition, the configured terminal default font color can be set, and each effect
  //       has a dedicated off-switch
  //     * neat tables can be drawn by combining the overline effect with `│` U+2502 'Box Drawing Light Vertical
  //       Line'; the renmarkable feature of this is that it minimizes spacing around characters meaning it's
  //       possible to have adjacent rows of cells separated from the next row by a border without having to
  //       sacrifice a line of text just to draw the border.
  //     * while the two color palattes implied by the standard XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //       * better to only use full RGB than to fuzz around with palettes
  //       * apps that use colors at all should be prepared for dark and bright backgrounds
  //       * in general better to set fg, bg colors than to use reverse
  //       * but reverse actually does do what it says—it swaps fg with bg color

  //     \x1b[39m default fg color
  //     \x1b[49m default bg color

  //     ###
  //     #-------------------------------------------------------------------------------------------------------
  //     fg_from_dec: ([ r, g, b, ]) -> "\x1b[38:2::#{r}:#{g}:#{b}m"
  //     bg_from_dec: ([ r, g, b, ]) -> "\x1b[48:2::#{r}:#{g}:#{b}m"
  //     fg_from_hex: ( rhx ) -> @fg_from_dec @dec_from_hex rhx
  //     bg_from_hex: ( rhx ) -> @bg_from_dec @dec_from_hex rhx
  //     fg_from_name: ( name ) ->
  //       rgb = @colors[ name ] ? @colors.fallback
  //       return @fg_from_dec rgb
  //     dec_from_hex: ( hex ) ->
  //       ### TAINT use proper typing ###
  //       throw new Error "Ω___3 expected text, got #{rpr hex}" unless ( typeof hex ) is 'string'
  //       throw new Error "Ω___4 not a proper hexadecimal RGB code: '#{hex.replace /'/g, "\\'"}'" unless /^#[0-9a-f]{6}$/i.test hex
  //       [ r16, g16, b16, ] = [ hex[ 1 .. 2 ], hex[ 3 .. 4 ], hex[ 5 .. 6 ], ]
  //       return [ ( parseInt r16, 16 ), ( parseInt g16, 16 ), ( parseInt b16, 16 ), ]

  //   #---------------------------------------------------------------------------------------------------------
  //   return exports = { ANSI, }

  // #===========================================================================================================
  // ### NOTE Future Single-File Module ###
  // require_ansi_colors_and_effects: ->
  //   { ANSI, } = SFMODULES.require_ansi()
  //   #.........................................................................................................
  //   rgb_dec =
  //     black:              [   0,   0,   0, ]
  //     darkslategray:      [  47,  79,  79, ]
  //     dimgray:            [ 105, 105, 105, ]
  //     slategray:          [ 112, 128, 144, ]
  //     gray:               [ 128, 128, 128, ]
  //     lightslategray:     [ 119, 136, 153, ]
  //     darkgray:           [ 169, 169, 169, ]
  //     silver:             [ 192, 192, 192, ]
  //     lightgray:          [ 211, 211, 211, ]
  //     gainsboro:          [ 220, 220, 220, ]
  //   #.........................................................................................................
  //   rgb_hex =
  //     white:            '#ffffff'
  //     amethyst:         '#f0a3ff'
  //     blue:             '#0075dc'
  //     caramel:          '#993f00'
  //     damson:           '#4c005c'
  //     ebony:            '#191919'
  //     forest:           '#005c31'
  //     green:            '#2bce48'
  //     lime:             '#9dcc00'
  //     quagmire:         '#426600'
  //     honeydew:         '#ffcc99'
  //     iron:             '#808080'
  //     jade:             '#94ffb5'
  //     khaki:            '#8f7c00'
  //     mallow:           '#c20088'
  //     navy:             '#003380'
  //     orpiment:         '#ffa405'
  //     pink:             '#ffa8bb'
  //     red:              '#ff0010'
  //     sky:              '#5ef1f2'
  //     turquoise:        '#00998f'
  //     violet:           '#740aff'
  //     wine:             '#990000'
  //     uranium:          '#e0ff66'
  //     xanthin:          '#ffff80'
  //     yellow:           '#ffe100'
  //     zinnia:           '#ff5005'
  //   #.........................................................................................................
  //   R =
  //     overline1:          '\x1b[53m'
  //     overline0:          '\x1b[55m'
  //     default:            '\x1b[39m'
  //     bg_default:         '\x1b[49m'
  //     bold:               '\x1b[1m'
  //     bold0:              '\x1b[22m'
  //     italic:             '\x1b[3m'
  //     italic0:            '\x1b[23m'
  //     reset:              '\x1b[0m'
  //     #.......................................................................................................
  //     black:              ANSI.fg_from_dec rgb_dec.black
  //     darkslategray:      ANSI.fg_from_dec rgb_dec.darkslategray
  //     dimgray:            ANSI.fg_from_dec rgb_dec.dimgray
  //     slategray:          ANSI.fg_from_dec rgb_dec.slategray
  //     gray:               ANSI.fg_from_dec rgb_dec.gray
  //     lightslategray:     ANSI.fg_from_dec rgb_dec.lightslategray
  //     darkgray:           ANSI.fg_from_dec rgb_dec.darkgray
  //     silver:             ANSI.fg_from_dec rgb_dec.silver
  //     lightgray:          ANSI.fg_from_dec rgb_dec.lightgray
  //     gainsboro:          ANSI.fg_from_dec rgb_dec.gainsboro
  //     #.......................................................................................................
  //     white:              ANSI.fg_from_hex rgb_hex.white
  //     amethyst:           ANSI.fg_from_hex rgb_hex.amethyst
  //     blue:               ANSI.fg_from_hex rgb_hex.blue
  //     caramel:            ANSI.fg_from_hex rgb_hex.caramel
  //     damson:             ANSI.fg_from_hex rgb_hex.damson
  //     ebony:              ANSI.fg_from_hex rgb_hex.ebony
  //     forest:             ANSI.fg_from_hex rgb_hex.forest
  //     green:              ANSI.fg_from_hex rgb_hex.green
  //     lime:               ANSI.fg_from_hex rgb_hex.lime
  //     quagmire:           ANSI.fg_from_hex rgb_hex.quagmire
  //     honeydew:           ANSI.fg_from_hex rgb_hex.honeydew
  //     iron:               ANSI.fg_from_hex rgb_hex.iron
  //     jade:               ANSI.fg_from_hex rgb_hex.jade
  //     khaki:              ANSI.fg_from_hex rgb_hex.khaki
  //     mallow:             ANSI.fg_from_hex rgb_hex.mallow
  //     navy:               ANSI.fg_from_hex rgb_hex.navy
  //     orpiment:           ANSI.fg_from_hex rgb_hex.orpiment
  //     pink:               ANSI.fg_from_hex rgb_hex.pink
  //     red:                ANSI.fg_from_hex rgb_hex.red
  //     sky:                ANSI.fg_from_hex rgb_hex.sky
  //     turquoise:          ANSI.fg_from_hex rgb_hex.turquoise
  //     violet:             ANSI.fg_from_hex rgb_hex.violet
  //     wine:               ANSI.fg_from_hex rgb_hex.wine
  //     uranium:            ANSI.fg_from_hex rgb_hex.uranium
  //     xanthin:            ANSI.fg_from_hex rgb_hex.xanthin
  //     yellow:             ANSI.fg_from_hex rgb_hex.yellow
  //     zinnia:             ANSI.fg_from_hex rgb_hex.zinnia
  //     #.......................................................................................................
  //     bg_black:           ANSI.bg_from_dec rgb_dec.black
  //     bg_darkslategray:   ANSI.bg_from_dec rgb_dec.darkslategray
  //     bg_dimgray:         ANSI.bg_from_dec rgb_dec.dimgray
  //     bg_slategray:       ANSI.bg_from_dec rgb_dec.slategray
  //     bg_gray:            ANSI.bg_from_dec rgb_dec.gray
  //     bg_lightslategray:  ANSI.bg_from_dec rgb_dec.lightslategray
  //     bg_darkgray:        ANSI.bg_from_dec rgb_dec.darkgray
  //     bg_silver:          ANSI.bg_from_dec rgb_dec.silver
  //     bg_lightgray:       ANSI.bg_from_dec rgb_dec.lightgray
  //     bg_gainsboro:       ANSI.bg_from_dec rgb_dec.gainsboro
  //     #.......................................................................................................
  //     bg_white:           ANSI.bg_from_hex rgb_hex.white
  //     bg_amethyst:        ANSI.bg_from_hex rgb_hex.amethyst
  //     bg_blue:            ANSI.bg_from_hex rgb_hex.blue
  //     bg_caramel:         ANSI.bg_from_hex rgb_hex.caramel
  //     bg_damson:          ANSI.bg_from_hex rgb_hex.damson
  //     bg_ebony:           ANSI.bg_from_hex rgb_hex.ebony
  //     bg_forest:          ANSI.bg_from_hex rgb_hex.forest
  //     bg_green:           ANSI.bg_from_hex rgb_hex.green
  //     bg_lime:            ANSI.bg_from_hex rgb_hex.lime
  //     bg_quagmire:        ANSI.bg_from_hex rgb_hex.quagmire
  //     bg_honeydew:        ANSI.bg_from_hex rgb_hex.honeydew
  //     bg_iron:            ANSI.bg_from_hex rgb_hex.iron
  //     bg_jade:            ANSI.bg_from_hex rgb_hex.jade
  //     bg_khaki:           ANSI.bg_from_hex rgb_hex.khaki
  //     bg_mallow:          ANSI.bg_from_hex rgb_hex.mallow
  //     bg_navy:            ANSI.bg_from_hex rgb_hex.navy
  //     bg_orpiment:        ANSI.bg_from_hex rgb_hex.orpiment
  //     bg_pink:            ANSI.bg_from_hex rgb_hex.pink
  //     bg_red:             ANSI.bg_from_hex rgb_hex.red
  //     bg_sky:             ANSI.bg_from_hex rgb_hex.sky
  //     bg_turquoise:       ANSI.bg_from_hex rgb_hex.turquoise
  //     bg_violet:          ANSI.bg_from_hex rgb_hex.violet
  //     bg_wine:            ANSI.bg_from_hex rgb_hex.wine
  //     bg_uranium:         ANSI.bg_from_hex rgb_hex.uranium
  //     bg_xanthin:         ANSI.bg_from_hex rgb_hex.xanthin
  //     bg_yellow:          ANSI.bg_from_hex rgb_hex.yellow
  //     bg_zinnia:          ANSI.bg_from_hex rgb_hex.zinnia
  //   #.........................................................................................................
  //   return { ansi_colors_and_effects: R, }
  //       chunkify = ( text ) ->
  //         chunks          = []
  //         width           = 0
  //         has_ansi        = false
  //         chunk_has_ansi  = true
  //         ### TAINT might as well return an empty list of chunks ###
  //         if text is ''
  //           return { has_ansi, width, chunks: [ { has_ansi, width, chunk: '', }, ], }
  //         for chunk in text.split ansi_matcher
  //           chunk_has_ansi    = not chunk_has_ansi
  //           has_ansi        or= chunk_has_ansi
  //           continue if chunk is ''
  //           chunk_width       = if has_ansi then 0 else string_width chunk
  //           width            += chunk_width
  //           chunks.push { has_ansi: chunk_has_ansi, width: chunk_width, chunk, }
  //         return { has_ansi, width, chunks, }
  //         # [Symbol.iterator]: ( -> d for d in chunks )
  //       do =>
  //         echo '—————————————————————————————————————————————'
  //         text = text_with_ansi_codes
  //         urge 'Ωfstr___5',                chunkify text
  //         info 'Ωfstr___6', d for d from ( chunkify text ).chunks
  //       do =>
  //         echo '—————————————————————————————————————————————'
  //         text = 'ABCDEFXYZ'
  //         urge 'Ωfstr___7',                chunkify text
  //         info 'Ωfstr___8', d for d from ( chunkify text ).chunks
  //       do =>
  //         echo '—————————————————————————————————————————————'
  //         text = "#{ C.black + C.bg_red + C.bold + C.bold0 + C.default + C.bg_default }"
  //         urge 'Ωfstr___9',                chunkify text
  //         info 'Ωfstr__10', d for d from ( chunkify text ).chunks
  //       do =>
  //         echo '—————————————————————————————————————————————'
  //         text = ''
  //         urge 'Ωfstr__11',                chunkify text
  //         info 'Ωfstr__12', d for d from ( chunkify text ).chunks

  //===========================================================================================================
  module.exports = ANSI_BRICS;

}).call(this);

//# sourceMappingURL=ansi-related.js.map