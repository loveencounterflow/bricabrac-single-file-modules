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
    bg  = C.bg_black
    fg0 = C.default
    bg0 = C.bg_default

    #-----------------------------------------------------------------------------------------------------------
    get_percentage_bar = ( percentage ) ->
      ###

      🮂🮃🮄🮅🮆
      ▁▂▃▄▅▆▇█

      ▉▊▋▌▍▎▏🮇🮈🮉🮊🮋

      ▐

      🭰 🭱 🭲 🭳 🭴 🭵

      🮀 🮁

      🭶 🭷 🭸 🭹 🭺 🭻

      🭽 🭾
      🭼 🭿

      ###
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
      return "#{fg+bg}#{percentage_rpr} %▕#{R.padEnd 13}▏#{fg0+bg0}"

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
Object.assign module.exports, BRICS

