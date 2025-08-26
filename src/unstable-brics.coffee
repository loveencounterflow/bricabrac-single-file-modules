'use strict'

############################################################################################################
#
#===========================================================================================================
BRICS =
  

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
  require_progress_indicators: ->
    { ansi_colors_and_effects: C, } = ( require './ansi-brics' ).require_ansi_colors_and_effects()
    fg  = C.green
    bg  = C.bg_red
    fg0 = C.default
    bg0 = C.bg_default

    #-----------------------------------------------------------------------------------------------------------
    get_percentage_bar = ( percentage ) ->
      ### 🮂🮃🮄🮅🮆 ▁▂▃▄▅▆▇█ ▉▊▋▌▍▎▏🮇🮈🮉🮊🮋 ▐ 🭰 🭱 🭲 🭳 🭴 🭵 🮀 🮁 🭶 🭷 🭸 🭹 🭺 🭻 🭽 🭾 🭼 🭿 ###
      percentage_rpr  = ( Math.round percentage ).toString().padStart 3
      if percentage is null or percentage <= 0  then return "#{percentage_rpr} %▕             ▏"
      if percentage >= 100                      then return "#{percentage_rpr} %▕█████████████▏"
      percentage      = ( Math.round percentage / 100 * 104 )
      R               = '█'.repeat percentage // 8
      switch percentage %% 8
        when 0 then R += ' '
        when 1 then R += '▏'
        when 2 then R += '▎'
        when 3 then R += '▍'
        when 4 then R += '▌'
        when 5 then R += '▋'
        when 6 then R += '▊'
        when 7 then R += '▉'
      return "#{percentage_rpr} %▕#{fg+bg}#{R.padEnd 13}#{fg0+bg0}▏"

    #-----------------------------------------------------------------------------------------------------------
    hollow_percentage_bar = ( n ) ->
      if n is null or n <= 0  then return '             '
      # if n >= 100             then return '░░░░░░░░░░░░░'
      if n >= 100             then return '▓▓▓▓▓▓▓▓▓▓▓▓▓'
      n = ( Math.round n / 100 * 104 )
      # R = '░'.repeat n // 8
      R = '▓'.repeat n // 8
      switch n %% 8
        when 0 then R += ' '
        when 1 then R += '▏'
        when 2 then R += '▎'
        when 3 then R += '▍'
        when 4 then R += '▌'
        when 5 then R += '▋'
        when 6 then R += '▊'
        when 7 then R += '▉'
        # when 8 then R += '█'
      return R.padEnd 13

    #.......................................................................................................
    return exports = { get_percentage_bar, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_format_stack: ->
    { ansi_colors_and_effects: C, } = ( require './ansi-brics' ).require_ansi_colors_and_effects()
    { strip_ansi,                 } = ( require './ansi-brics' ).require_strip_ansi()
    { type_of,                    } = ( require './unstable-rpr-type_of-brics' ).require_type_of()
    { hide,                       } = ( require './various-brics' ).require_managed_property_tools()
    { show_no_colors: rpr,        } = ( require './main' ).unstable.require_show()
    ### TAINT make use of `FS` optional like `get_relative_path()` ###
    FS                              = require 'node:fs'

    #=======================================================================================================
    main_c                    = {}
    main_c.reset              = C.reset # C.default + C.bg_default  + C.bold0
    main_c.folder_path        = C.black   + C.bg_lime     + C.bold
    main_c.file_name          = C.wine    + C.bg_lime     + C.bold
    main_c.callee             = C.black   + C.bg_lime     + C.bold
    main_c.line_nr            = C.black   + C.bg_blue     + C.bold
    main_c.column_nr          = C.black   + C.bg_blue     + C.bold
    main_c.context            = C.lightslategray  + C.bg_darkslatish
    # main_c.context            = C.lightslategray  + C.bg_darkslategray
    main_c.hit                = C.white           + C.bg_darkslatish + C.bold
    main_c.spot               = C.yellow             + C.bg_wine + C.bold
    # main_c.hit                = C.white          + C.bg_forest + C.bold
    main_c.reference          = C.lightslategray  + C.bg_black
    #.......................................................................................................
    external_c                = Object.create main_c
    external_c.folder_path    = C.black   + C.bg_yellow   + C.bold
    external_c.file_name      = C.wine    + C.bg_yellow   + C.bold
    external_c.callee         = C.black   + C.bg_yellow   + C.bold
    #.......................................................................................................
    dependency_c              = Object.create main_c
    dependency_c.folder_path  = C.black   + C.bg_orpiment + C.bold
    dependency_c.file_name    = C.wine    + C.bg_orpiment + C.bold
    dependency_c.callee       = C.black   + C.bg_orpiment + C.bold
    #.......................................................................................................
    internal_c                = Object.create main_c
    internal_c.folder_path    = C.gray    + C.bg_darkslatish
    internal_c.file_name      = C.gray    + C.bg_darkslatish
    internal_c.line_nr        = C.gray    + C.bg_darkslatish
    internal_c.column_nr      = C.gray    + C.bg_darkslatish
    internal_c.callee         = C.gray    + C.bg_darkslatish
    #.......................................................................................................
    unparsable_c              = {}
    unparsable_c.text         = C.black   + C.bg_violet      + C.bold
    unparsable_c.reset        = main_c.reset
    #.......................................................................................................
    headline_c                = {}
    headline_c.headline       = C.black   + C.bg_red      + C.bold
    headline_c.reset          = main_c.reset
    #.......................................................................................................
    templates =
      format_stack:
        relative:       true # boolean to use CWD, or specify reference path
        context:        2
        padding:
          path:           90
          callee:         60
        color:
          main:           main_c
          internal:       internal_c
          external:       external_c
          dependency:     dependency_c
          unparsable:     unparsable_c
          headline:       headline_c

    #-------------------------------------------------------------------------------------------------------
    stack_line_re = /// ^
      \s* at \s+
      (?:
        (?<callee> .*?    )
        \s+ \(
        )?
      (?<path>      (?<folder_path> .*? ) (?<file_name> [^ \/ ]+ )  ) :
      (?<line_nr>   \d+                                             ) :
      (?<column_nr> \d+                                             )
      \)?
      $ ///;

    #=======================================================================================================
    internals = Object.freeze { templates, }

    #=======================================================================================================
    class Format_stack

      #-----------------------------------------------------------------------------------------------------
      constructor: ( cfg ) ->
        @cfg              = { templates.format_stack..., cfg..., }
        @cfg.padding.line = @cfg.padding.path + @cfg.padding.callee
        me = ( P... ) => @format P...
        Object.setPrototypeOf me, @
        hide @, 'get_relative_path', do =>
          try PATH = require 'node:path' catch error then return null
          return PATH.relative.bind PATH
        hide @, 'state', { cache: new Map(), }
        return me

      #-----------------------------------------------------------------------------------------------------
      format: ( error_or_stack ) ->
        ### TAINT use proper validation ###
        switch type = type_of error_or_stack
          when 'error'
            error     = error_or_stack
            stack     = error.stack
          when 'text'
            error     = null
            stack     = error_or_stack
            # headline  = stack.
          else throw new Error "Ω___4 expected an error or a text, got a #{type}"
        lines = stack.split '\n'
        if lines.length > 1
          headline  = @format_headline lines.shift(), error
          lines     = lines.reverse()
          lines     = ( ( @format_line line ) for line in lines )
          return [ headline, lines..., headline, ].join '\n'
        return @format_line line

      #-----------------------------------------------------------------------------------------------------
      parse_line: ( line ) ->
        ### TAINT use proper validation ###
        unless ( type = type_of line ) is 'text'
          throw new Error "Ω___5 expected a text, got a #{type}"
        #...................................................................................................
        if ( '\n' in line )
          throw new Error "Ω___6 expected a single line, got a text with line breaks"
        #...................................................................................................
        return { text: line, type: 'unparsable', } unless ( match = line.match stack_line_re )?
        #...................................................................................................
        R           = { match.groups..., }
        is_internal = R.path.startsWith 'node:'
        R.callee   ?= '[anonymous]'
        R.line_nr   = parseInt R.line_nr,   10
        R.column_nr = parseInt R.column_nr, 10
        #...................................................................................................
        if @get_relative_path? and ( not is_internal ) and ( @cfg.relative isnt false )
          reference     = if ( @cfg.relative is true ) then process.cwd() else @cfg.relative
          R.path        = ( @get_relative_path reference, R.path        )
          R.folder_path = ( @get_relative_path reference, R.folder_path ) + '/'
          # R.path        = './' + R.path        unless R.path[ 0 ]         in './'
          # R.folder_path = './' + R.folder_path unless R.folder_path[ 0 ]  in './'
        #...................................................................................................
        switch true
          when is_internal                                then  R.type = 'internal'
          when /\bnode_modules\//.test R.path             then  R.type = 'dependency'
          when R.path.startsWith '../'                    then  R.type = 'external'
          else                                                  R.type = 'main'
        return R

      #-----------------------------------------------------------------------------------------------------
      format_line: ( line ) ->
        { stack_info,
          source_reference,   } = @_format_source_reference line
        context = if @cfg.context is false then [] else @_get_context stack_info
        return [ source_reference, context..., ].join '\n'

      #-----------------------------------------------------------------------------------------------------
      format_headline: ( line, error = null ) ->
        theme       = @cfg.color.headline
        error_class = error?.constructor.name ? '(no error class)'
        line        = " [#{error_class}] #{line}"
        line        = line.padEnd @cfg.padding.line, ' '
        return theme.headline + line + theme.reset

      #-----------------------------------------------------------------------------------------------------
      _format_source_reference: ( line ) ->
        stack_info      = @parse_line line
        theme           = @cfg.color[ stack_info.type ]
        #...................................................................................................
        if stack_info.type is 'unparsable'
          source_reference = theme.text + stack_info.text + theme.reset
          return { stack_info, source_reference, }
        #...................................................................................................
        folder_path     = theme.folder_path  + ' '    + stack_info.folder_path  + ''     + theme.reset
        file_name       = theme.file_name    + ''     + stack_info.file_name    + ' '    + theme.reset
        line_nr         = theme.line_nr      + ' ('   + stack_info.line_nr      + ''     + theme.reset
        column_nr       = theme.column_nr    + ':'    + stack_info.column_nr    + ') '   + theme.reset
        callee          = theme.callee       + ' # '  + stack_info.callee       + '() '  + theme.reset
        #...................................................................................................
        path_length     = ( strip_ansi folder_path + file_name + line_nr + column_nr  ).length
        callee_length   = ( strip_ansi callee                                         ).length
        #...................................................................................................
        path_length     = Math.max 0, @cfg.padding.path    -   path_length
        callee_length   = Math.max 0, @cfg.padding.callee  - callee_length
        #...................................................................................................
        padding_path    = theme.folder_path + ( ' '.repeat    path_length ) + theme.reset
        padding_callee  = theme.callee      + ( ' '.repeat  callee_length ) + theme.reset
        #...................................................................................................
        source_reference  = folder_path + file_name + line_nr + column_nr + padding_path + callee + padding_callee
        return { stack_info, source_reference, }

      #-----------------------------------------------------------------------------------------------------
      _get_context: ( stack_info ) ->
        return [] if ( stack_info.type in [ 'internal', 'unparsable', ] ) or ( stack_info.path is '' )
        try
          source = FS.readFileSync stack_info.path, { encoding: 'utf-8', }
        catch error
          throw error unless error.code is 'ENOENT'
          return [ "unable to read file #{rpr stack_info.path}", ]
        #...................................................................................................
        theme     = @cfg.color[ stack_info.type ]
        ref_width = 7
        width     = @cfg.padding.path + @cfg.padding.callee - ref_width
        source    = source.split '\n'
        hit_idx   = stack_info.line_nr - 1
        # return source[ hit_idx ] if @cfg.context < 1
        #...................................................................................................
        first_idx = Math.max ( hit_idx - @cfg.context ), 0
        last_idx  = Math.min ( hit_idx + @cfg.context ), source.length - 1
        R         = []
        #...................................................................................................
        for idx in [ first_idx .. last_idx ]
          line      = source[ idx ]
          reference = theme.reference + ( "#{idx + 1} ".padStart ref_width, ' ' )
          if ( idx is hit_idx )
            before    = line[ ... stack_info.column_nr - 1    ]
            spot      = line[     stack_info.column_nr - 1 .. ]
            behind    = ' '.repeat Math.max 0, width - line.length
            R.push reference + theme.hit + before + theme.spot + spot + theme.hit + behind + theme.reset
          else
            line      = line.padEnd width, ' '
            R.push reference + theme.context  + line + theme.reset
        #...................................................................................................
        return R

    #.......................................................................................................
    return exports = do =>
      format_stack = new Format_stack()
      return { format_stack, Format_stack, internals, }


#===========================================================================================================
Object.assign module.exports, BRICS

