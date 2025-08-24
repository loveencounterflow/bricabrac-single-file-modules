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
    { type_of,                    } = ( require './unstable-rpr-type_of-brics' ).require_show()

    #=======================================================================================================
    templates =
      error_formatter:
        path:       ( text ) -> "#{C.green}#{text}#{C.bg_default}"
        line_nr:    ( text ) -> ":#{C.blue}#{text}#{C.bg_default}"
        column_nr:  ( text ) -> "#{C.red}:#{text}:#{C.bg_default}"
        function:   ( text ) -> " #{C.gold}#{text}#{C.bg_default}()"

    #-------------------------------------------------------------------------------------------------------
    stack_line_re = /// ^
      \s* at \s+
      (?:
        (?<callee> .*?    )
        \s+ \(
        )?
      (?<path> .+       ) :
      (?<line_nr>   \d+ ) :
      (?<column_nr> \d+ )
      \)?
      $ ///;

    #=======================================================================================================
    internals = Object.freeze { templates, }

    #=======================================================================================================
    class Format_stack

      #-----------------------------------------------------------------------------------------------------
      constructor: ( cfg ) ->
        @cfg = { templates.error_formatter..., cfg..., }
        me = ( P... ) => @format P...
        Object.setPrototypeOf me, @
        return me

      #-----------------------------------------------------------------------------------------------------
      format: ( error_or_stack_trace ) ->
        ### TAINT use proper validation ###
        switch type = type_of error_or_stack_trace
          when 'error'  then stack_trace = error_or_stack_trace.stack
          when 'text'   then stack_trace = error_or_stack_trace
          else throw new Error "Ω___1 expected an error or a text, got a #{type}"
        return ( (  @format_line) )

      #-----------------------------------------------------------------------------------------------------
      parse_line: ( line ) ->
        return null unless ( match = line.match stack_line_re )?
        [, callee, path, line_nr, column_nr] = match
        R           = { match.groups..., }
        R.callee   ?= null
        R.line_nr   = parseInt R.line_nr,   10
        R.column_nr = parseInt R.column_nr, 10
        return R

    ```
    function parseStackLine(line) {
      // Matches:
      // "    at functionName (/path/file.js:10:15)"
      // "    at /path/file.js:42:1"
    }

    function parseStackTrace(stack) {
      return stack
        .split("\n")
        .map(parseStackLine)
        .filter(Boolean);
    }

    ```
    #.......................................................................................................
    return exports = do =>
      format_stack = new Format_stack()
      return { format_stack, internals, parseStackLine, parseStackTrace, }


#===========================================================================================================
Object.assign module.exports, BRICS

