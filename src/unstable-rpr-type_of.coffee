'use strict'

############################################################################################################
#
#===========================================================================================================
BRICS =

  

  #=========================================================================================================
  ### NOTE Future Single-File Module ###
  require_show: ->

    #=======================================================================================================
    write                     = ( p ) -> process.stdout.write p
    C                         = require '/home/flow/jzr/hengist-NG/node_modules/.pnpm/ansis@4.1.0/node_modules/ansis/index.cjs'
    # { hide,
    #   set_getter,   } = ( require './main' ).require_managed_property_tools()
    # SQLITE            = require 'node:sqlite'
    # { debug,        } = console

    #=======================================================================================================
    ### thx to https://github.com/sindresorhus/identifier-regex ###
    jsid_re   = ///^ [ $ _ \p{ID_Start} ] [ $ _ \u200C \u200D \p{ID_Continue} ]* $///v
    isa_jsid  = ( x ) -> ( ( typeof x ) is 'string' ) and jsid_re.test x
    #-------------------------------------------------------------------------------------------------------
    templates =
      show: { indentation: null, }

    #=======================================================================================================
    internals = { jsid_re, isa_jsid, templates, }

    #=======================================================================================================
    class Show

      #-----------------------------------------------------------------------------------------------------
      constructor: ( cfg ) ->
        me = ( x ) =>
          return ( text for text from @pen x ).join ''
        Object.setPrototypeOf me, @
        @cfg    = { templates.show..., cfg..., }
        @state  = { level: 0, ended_with_nl: false, }
        @spacer = '\x20\x20'
        Object.defineProperty @, 'dent',
          get: => @spacer.repeat @state.level
        return me

      #-----------------------------------------------------------------------------------------------------
      pen: ( x ) ->
        for text from @dispatch x
          @state.ended_with_nl = text.endsWith '\n'
          yield text
        unless @state.ended_with_nl
          @state.ended_with_nl = true
          # yield '\n'
        return null

      #-----------------------------------------------------------------------------------------------------
      go_down: ->
        @state.level++
        return @state.level

      #-----------------------------------------------------------------------------------------------------
      go_up: ->
        if @state.level < 1
          throw new Error "Ω___1 unable to go below level 0"
        @state.level--
        return @state.level

      #-----------------------------------------------------------------------------------------------------
      dispatch: ( x ) ->
        if ( method = @[ "show_#{type_of x}" ] )?
          yield from method.call @, x
        else
          yield from @show_other x
        return null

      #-----------------------------------------------------------------------------------------------------
      _show_key: ( key ) ->
        if isa_jsid key then return colors._key key
        return [ ( t for t from @dispatch key )..., ].join ''

      #-----------------------------------------------------------------------------------------------------
      show_pod: ( x ) ->
        has_keys = false
        yield colors.pod '{'
        #...................................................................................................
        for key, value of x
          ### TAINT code duplication ###
          has_keys = true
          yield ' ' + ( @_show_key key ) + colors.pod ': '
          for text from @dispatch value
            yield text
          yield colors.pod ','
        #...................................................................................................
        yield colors.pod if ( not has_keys ) then '}' else ' }'
        return null

      #-----------------------------------------------------------------------------------------------------
      show_map: ( x ) ->
        has_keys = false
        yield colors.map 'map{'
        #...................................................................................................
        for [ key, value, ] from x.entries()
          ### TAINT code duplication ###
          has_keys = true
          yield ' ' + ( @_show_key key ) + colors.map ': '
          for text from @dispatch value
            yield text
          yield colors.map ','
        #...................................................................................................
        yield colors.map if ( not has_keys ) then '}' else ' }'
        return null

      #-----------------------------------------------------------------------------------------------------
      show_list: ( x ) ->
        yield colors.list '['
        for element in x
          ### TAINT code duplication ###
          for text from @dispatch element
            yield ' ' + text + ( colors.list ',' )
        yield colors.list if ( x.length is 0 ) then ']' else ' ]'
        return null

      #-----------------------------------------------------------------------------------------------------
      show_set: ( x ) ->
        yield colors.set 'set['
        for element from x.keys()
          ### TAINT code duplication ###
          for text from @dispatch element
            yield ' ' + text + colors.set ','
        yield colors.set if ( x.length is 0 ) then ']' else ' ]'
        return null

      #-----------------------------------------------------------------------------------------------------
      show_text: ( x ) ->
        if "'" in x then  yield colors.text '"' + ( x.replace /"/g, '\\"' ) + '"'
        else              yield colors.text "'" + ( x.replace /'/g, "\\'" ) + "'"
        return null

      #-----------------------------------------------------------------------------------------------------
      show_float: ( x ) ->
        yield ( colors.float x.toString() )
        return null

      #-----------------------------------------------------------------------------------------------------
      show_regex: ( x ) ->
        yield ( colors.regex x.toString() )
        return null

      #-----------------------------------------------------------------------------------------------------
      ### full words: ###
      # show_true:      ( x ) -> yield ( colors.true      'true'      )
      # show_false:     ( x ) -> yield ( colors.false     'false'     )
      # show_undefined: ( x ) -> yield ( colors.undefined 'undefined' )
      # show_null:      ( x ) -> yield ( colors.null      'null'      )
      # show_nan:       ( x ) -> yield ( colors.nan       'NaN'       )
      ### (mostly) single letters: ###
      show_true:      ( x ) -> yield ( colors.true      ' T '     )
      show_false:     ( x ) -> yield ( colors.false     ' F '     )
      show_undefined: ( x ) -> yield ( colors.undefined ' U '     )
      show_null:      ( x ) -> yield ( colors.null      ' N '     )
      show_nan:       ( x ) -> yield ( colors.nan       ' NaN '   )

      #-----------------------------------------------------------------------------------------------------
      show_other: ( x ) ->
        # yield '\n' unless @state.ended_with_nl
        yield colors.other "#{x}"
        return null

    #=======================================================================================================
    COLOR = new C.Ansis().extend
      aliceblue:                  '#f0f8ff'
      antiquewhite:               '#faebd7'
      aqua:                       '#00ffff'
      aquamarine:                 '#7fffd4'
      azure:                      '#f0ffff'
      beige:                      '#f5f5dc'
      bisque:                     '#ffe4c4'
      black:                      '#000000'
      blanchedalmond:             '#ffebcd'
      blue:                       '#0000ff'
      blueviolet:                 '#8a2be2'
      brown:                      '#a52a2a'
      burlywood:                  '#deb887'
      cadetblue:                  '#5f9ea0'
      chartreuse:                 '#7fff00'
      chocolate:                  '#d2691e'
      coral:                      '#ff7f50'
      cornflowerblue:             '#6495ed'
      cornsilk:                   '#fff8dc'
      crimson:                    '#dc143c'
      cyan:                       '#00ffff'
      darkblue:                   '#00008b'
      darkcyan:                   '#008b8b'
      darkgoldenrod:              '#b8860b'
      darkgray:                   '#a9a9a9'
      darkgreen:                  '#006400'
      darkkhaki:                  '#bdb76b'
      darkmagenta:                '#8b008b'
      darkolivegreen:             '#556b2f'
      darkorange:                 '#ff8c00'
      darkorchid:                 '#9932cc'
      darkred:                    '#8b0000'
      darksalmon:                 '#e9967a'
      darkseagreen:               '#8fbc8f'
      darkslateblue:              '#483d8b'
      darkslategray:              '#2f4f4f'
      darkturquoise:              '#00ced1'
      darkviolet:                 '#9400d3'
      deeppink:                   '#ff1493'
      deepskyblue:                '#00bfff'
      dimgray:                    '#696969'
      dodgerblue:                 '#1e90ff'
      firebrick:                  '#b22222'
      floralwhite:                '#fffaf0'
      forestgreen:                '#228b22'
      gainsboro:                  '#dcdcdc'
      ghostwhite:                 '#f8f8ff'
      gold:                       '#ffd700'
      goldenrod:                  '#daa520'
      gray:                       '#808080'
      green:                      '#008000'
      greenyellow:                '#adff2f'
      honeydew:                   '#f0fff0'
      hotpink:                    '#ff69b4'
      indianred:                  '#cd5c5c'
      indigo:                     '#4b0082'
      ivory:                      '#fffff0'
      khaki:                      '#f0e68c'
      lavender:                   '#e6e6fa'
      lavenderblush:              '#fff0f5'
      lawngreen:                  '#7cfc00'
      lemonchiffon:               '#fffacd'
      lightblue:                  '#add8e6'
      lightcoral:                 '#f08080'
      lightcyan:                  '#e0ffff'
      lightgoldenrodyellow:       '#fafad2'
      lightgray:                  '#d3d3d3'
      lightgreen:                 '#90ee90'
      lightpink:                  '#ffb6c1'
      lightsalmon:                '#ffa07a'
      lightseagreen:              '#20b2aa'
      lightskyblue:               '#87cefa'
      lightslategray:             '#778899'
      lightsteelblue:             '#b0c4de'
      lightyellow:                '#ffffe0'
      lime:                       '#00ff00'
      limegreen:                  '#32cd32'
      linen:                      '#faf0e6'
      magenta:                    '#ff00ff'
      maroon:                     '#800000'
      mediumaquamarine:           '#66cdaa'
      mediumblue:                 '#0000cd'
      mediumorchid:               '#ba55d3'
      mediumpurple:               '#9370db'
      mediumseagreen:             '#3cb371'
      mediumslateblue:            '#7b68ee'
      mediumspringgreen:          '#00fa9a'
      mediumturquoise:            '#48d1cc'
      mediumvioletred:            '#c71585'
      midnightblue:               '#191970'
      mintcream:                  '#f5fffa'
      mistyrose:                  '#ffe4e1'
      moccasin:                   '#ffe4b5'
      navajowhite:                '#ffdead'
      navy:                       '#000080'
      oldlace:                    '#fdf5e6'
      olive:                      '#808000'
      olivedrab:                  '#6b8e23'
      orange:                     '#ffa500'
      orangered:                  '#ff4500'
      orchid:                     '#da70d6'
      palegoldenrod:              '#eee8aa'
      palegreen:                  '#98fb98'
      paleturquoise:              '#afeeee'
      palevioletred:              '#db7093'
      papayawhip:                 '#ffefd5'
      peachpuff:                  '#ffdab9'
      peru:                       '#cd853f'
      pink:                       '#ffc0cb'
      plum:                       '#dda0dd'
      powderblue:                 '#b0e0e6'
      purple:                     '#800080'
      red:                        '#ff0000'
      rosybrown:                  '#bc8f8f'
      royalblue:                  '#4169e1'
      saddlebrown:                '#8b4513'
      salmon:                     '#fa8072'
      sandybrown:                 '#f4a460'
      seagreen:                   '#2e8b57'
      seashell:                   '#fff5ee'
      sienna:                     '#a0522d'
      silver:                     '#c0c0c0'
      skyblue:                    '#87ceeb'
      slateblue:                  '#6a5acd'
      slategray:                  '#708090'
      snow:                       '#fffafa'
      springgreen:                '#00ff7f'
      steelblue:                  '#4682b4'
      tan:                        '#d2b48c'
      teal:                       '#008080'
      thistle:                    '#d8bfd8'
      tomato:                     '#ff6347'
      turquoise:                  '#40e0d0'
      violet:                     '#ee82ee'
      wheat:                      '#f5deb3'
      white:                      '#ffffff'
      whitesmoke:                 '#f5f5f5'
      yellow:                     '#ffff00'
      yellowgreen:                '#9acd32'
      #.....................................................................................................
      FANCYRED:                   '#fd5230'
      FANCYORANGE:                '#fd6d30'
      # oomph: ( x ) -> debug 'Ω___2', x; return "~~~ #{x} ~~~"

    colors =
      _key:       ( x ) -> COLOR.cyan                             x
      pod:        ( x ) -> COLOR.gold                             x
      map:        ( x ) -> COLOR.gold                             x
      list:       ( x ) -> COLOR.gold                             x
      set:        ( x ) -> COLOR.gold                             x
      text:       ( x ) -> COLOR.wheat                            x
      float:      ( x ) -> COLOR.FANCYRED                         x
      regex:      ( x ) -> COLOR.plum                             x
      true:       ( x ) -> COLOR.inverse.bold.italic.lime         x
      false:      ( x ) -> COLOR.inverse.bold.italic.FANCYORANGE  x
      undefined:  ( x ) -> COLOR.inverse.bold.italic.magenta      x
      null:       ( x ) -> COLOR.inverse.bold.italic.blue         x
      nan:        ( x ) -> COLOR.inverse.bold.italic.magenta      x
      other:      ( x ) -> COLOR.inverse.red                      x

    #=======================================================================================================
    show = new Show()


    #=======================================================================================================
    internals = Object.freeze { internals..., }
    return exports = {
      Show,
      show,
      internals, }


#===========================================================================================================
Object.assign module.exports, BRICS



#-----------------------------------------------------------------------------------------------------------
object_prototype  = Object.getPrototypeOf {}
pod_prototypes    = [ null, object_prototype, ]

#-----------------------------------------------------------------------------------------------------------
type_of = ( x ) ->
  #.........................................................................................................
  ### Primitives: ###
  return 'null'         if x is null
  return 'undefined'    if x is undefined
  return 'infinity'     if ( x is +Infinity ) or ( x is -Infinity )
  # return 'boolean'      if ( x is true ) or ( x is false )
  return 'true'         if ( x is true )
  return 'false'        if ( x is false )
  return 'nan'          if Number.isNaN     x
  return 'float'        if Number.isFinite  x
  # return 'unset'        if x is unset
  return 'pod'          if ( Object.getPrototypeOf x ) in pod_prototypes
  #.........................................................................................................
  switch jstypeof = typeof x
    when 'string'                       then return 'text'
    when 'symbol'                       then return 'symbol'
  #.........................................................................................................
  return 'list'         if Array.isArray  x
  ### TAINT consider to return x.constructor.name ###
  switch millertype = ( ( Object::toString.call x ).replace /^\[object ([^\]]+)\]$/, '$1' ).toLowerCase()
    when 'regexp'                       then return 'regex'
  return millertype
  # switch millertype = Object::toString.call x
  #   when '[object Function]'            then return 'function'
  #   when '[object AsyncFunction]'       then return 'asyncfunction'
  #   when '[object GeneratorFunction]'   then return 'generatorfunction'

#===========================================================================================================
demo_show = ->
  { debug,
    log: echo, } = console
  { show,
    Show, } = BRICS.require_show()
  debug 'Ω___3', show
  debug 'Ω___4', show.state
  debug 'Ω___5', show show.dent
  debug 'Ω___6', show.go_down()
  debug 'Ω___7', show show.dent
  echo()
  echo '————————————————————————————————————————————————————————————————'
  echo show v_1 = "foo 'bar'"
  echo '————————————————————————————————————————————————————————————————'
  echo show v_2 = {}
  echo '————————————————————————————————————————————————————————————————'
  echo show v_3 = { kong: 108, low: 923, numbers: [ 10, 11, 12, ], }
  echo '————————————————————————————————————————————————————————————————'
  echo show v_4 = []
  echo '————————————————————————————————————————————————————————————————'
  echo show v_5 = [ 'some', 'words', 'to', 'show', 1, -1, false, ]
  echo '————————————————————————————————————————————————————————————————'
  echo show v_6 = new Map [ [ 'kong', 108, ], [ 'low', 923, ], [ 971, 'word', ], [ true, '+1', ], [ 'a b c', false, ] ]
  echo '————————————————————————————————————————————————————————————————'
  echo show v_7 = new Set [ 'some', 'words', true, false, null, undefined, 3.1415926, NaN, ]
  echo '————————————————————————————————————————————————————————————————'
  echo show v_8 = /abc[de]/
  echo '————————————————————————————————————————————————————————————————'
  echo show v_9 = Buffer.from 'abcäöü'
  echo '————————————————————————————————————————————————————————————————'
  echo show v_10 = { v_1, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9, } # v_10, v_11, v_12, v_13, v_14, }
  v_10.v_10 = v_10
  echo '————————————————————————————————————————————————————————————————'
  # echo show v_10 = { v_1, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9, v_10, } # v_10, v_11, v_12, v_13, v_14, }
  echo '————————————————————————————————————————————————————————————————'
  echo()
  return null

demo_show()



