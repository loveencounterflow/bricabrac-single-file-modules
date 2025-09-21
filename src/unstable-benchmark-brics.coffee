'use strict'

#===========================================================================================================
{ debug, } = console

#===========================================================================================================
BRICS =

  #=========================================================================================================
  ### NOTE Future Single-File Module ###
  require_benchmarking: ->
    # { get_setter,
    #   hide,                       } = ( require './various-brics' ).require_managed_property_tools()
    { get_percentage_bar,         } = ( require './unstable-brics' ).require_progress_indicators()
    { nameit,                     } = ( require './various-brics' ).require_nameit()
    NFA = ( require './unstable-normalize-function-arguments-brics' ).require_normalize_function_arguments()
    { # get_signature,
      # Normalize_function_arguments,
      # Template,
      # internals,
      nfa,                } = NFA
    #-------------------------------------------------------------------------------------------------------
    bigint_from_hrtime  = ([ s, ns, ])  -> ( BigInt s ) * 1_000_000_000n + ( BigInt ns )
    hrtime_as_bigint    =               -> bigint_from_hrtime process.hrtime()
    inf                 = new Intl.NumberFormat 'en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3}
    ANSI                =
      cr:   '\x1b[1G'       # Carriage Return; move to first column (CHA n — Cursor Horizontal Absolut)
      el0:  '\x1b[0K'       # EL Erase in Line; 0: from cursor to end
      el1:  '\x1b[1K'       # EL Erase in Line; 1: from cursor to beginning
      el2:  '\x1b[2K'       # EL Erase in Line; 2: entire line

    #-------------------------------------------------------------------------------------------------------
    get_progress = ({ total, task_rpr, }={}) ->
      unless total?
        return progress = -> throw new Error "Ωbm___1 must call with option `total` in order to use progress bar"
      #.....................................................................................................
      processed = -1
      divisor   = Math.round total / 100
      #.....................................................................................................
      return progress = ({ delta = 1, }={}) ->
        processed      += delta; return null unless ( processed %% divisor ) is 0
        percentage      = Math.round processed / total * 100
        percentage_rpr  = percentage.toString().padStart 3
        process.stdout.write "#{task_rpr} #{get_percentage_bar percentage} #{ANSI.cr}"
        return null

    #-------------------------------------------------------------------------------------------------------
    timeit_tpl = { brand: 'unnamed', task: null, }

    #=======================================================================================================
    class Benchmarker

      #-----------------------------------------------------------------------------------------------------
      constructor: ->
        @brands   = {}
        # @tasks    = {}
        return undefined

      #-----------------------------------------------------------------------------------------------------
      timeit: nfa { template: timeit_tpl, }, ( brand, task, cfg, fn ) ->
      # timeit: nfa ( brand, task, cfg, fn ) ->
        # debug 'Ωbm___2', { brand, task, cfg, fn } # ; return null
        # switch arity = arguments.length
        #   when 1 then [ cfg, fn, ] = [ {}, cfg, ]
        #   when 2 then null
        #   else throw new Error "Ωbm___3 expected 1 or 2 arguments, got #{arity}"
        #.....................................................................................................
        cfg                 = { { total: null, }..., cfg..., }
        task                = task ? ( if ( fn.name is '' ) then '(anonymous)' else fn.name )
        task_rpr            = ( task + ':' ).padEnd 40, ' '
        progress            = get_progress { total: cfg.total, task_rpr, }
        t0                  = hrtime_as_bigint()
        result              = fn { progress, }
        t1                  = hrtime_as_bigint()
        dt                  = ( Number t1 - t0 ) / 1_000_000
        #.....................................................................................................
        dts_brand           = @brands[ brand ] ?= {}
        dts_task            = dts_brand[ task ] ?= []
        dts_task.push dt
        # dts_task           = ( @tasks[   task ] ?= { dts: [], } ).dts
        # dts_brand.push dt
        #.....................................................................................................
        #  locale: 'en-US', numberingSystem: 'latn', style: 'decimal', minimumIntegerDigits: 1, minimumFractionDigits: 0,
        # maximumFractionDigits: 3, useGrouping: 'auto', notation: 'standard', signDisplay: 'auto', roundingIncrement: 1,
        # roundingMode: 'halfExpand', roundingPriority: 'auto', trailingZeroDisplay: 'auto' }
        dt_rpr        = inf.format dt
        dt_rpr        = dt_rpr.padStart 20, ' '
        #...................................................................................................
        if cfg.handler?
          cfg.handler {
            brand,
            task,
            dt,
            dt_rpr,
            total:    cfg.total,
            brands:   @brands,
            # tasks:    @tasks,
            }
        else
          console.log "#{ANSI.el2}#{task_rpr} #{dt_rpr}"
        #...................................................................................................
        return result

      #-----------------------------------------------------------------------------------------------------
      get_averages_by_brands: ->
        R = {}
        for brand, tracks of @brands
          target = R[ brand ] = {}
          for track, dts of tracks
            target[ track ] = ( dts.reduce ( ( a, b ) -> a + b ), 0 ) / dts.length
        return R

    #=======================================================================================================
    timeit = do =>
      bm  = new Benchmarker()
      R   = ( P... ) -> bm.timeit P...
      nameit 'timeit', R
      R.bm = bm
      return R

    #.......................................................................................................
    return exports = { Benchmarker, bigint_from_hrtime, hrtime_as_bigint, timeit, }

#===========================================================================================================
Object.assign module.exports, BRICS

