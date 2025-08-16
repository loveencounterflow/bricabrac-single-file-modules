'use strict'

############################################################################################################
#
#===========================================================================================================
UNSTABLE_BENCHMARK_BRICS =

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_benchmarking: ->
    { get_percentage_bar, } = ( require './unstable-brics' ).require_progress_indicators()

    #---------------------------------------------------------------------------------------------------------
    bigint_from_hrtime  = ([ s, ns, ])  -> ( BigInt s ) * 1_000_000_000n + ( BigInt ns )
    hrtime_as_bigint    =               -> bigint_from_hrtime process.hrtime()
    inf                 = new Intl.NumberFormat 'en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3}

    #---------------------------------------------------------------------------------------------------------
    get_progress = ({ total, name_rpr, }={}) ->
      unless total?
        return progress = -> throw new Error "Ω___4 must call with option `total` in order to use progress bar"
      #.......................................................................................................
      processed = -1
      divisor   = Math.round total / 100
      #.......................................................................................................
      return progress = ({ delta = 1, }={}) ->
        processed += delta
        return unless ( processed %% divisor ) is 0
        percentage      = Math.round processed / total * 100
        percentage_rpr  = percentage.toString().padStart 3
        # console.log "Ω___4 total: #{total}, processed: #{processed}, percentage: #{percentage}"
        cr = "\x1b[1G"       # Carriage Return; move to first column
        process.stdout.write "#{name_rpr} #{get_percentage_bar percentage} #{cr}"
        return null

    #---------------------------------------------------------------------------------------------------------
    timeit = ( cfg, fn ) ->
      switch arity = arguments.length
        when 1 then [ cfg, fn, ] = [ {}, cfg, ]
        when 2 then null
        else throw new Error "Ω___4 expected 1 or 2 arguments, got #{arity}"
      #.......................................................................................................
      cfg           = { { total: null, }..., cfg..., }
      name_rpr      = ( fn.name + ':' ).padEnd 40, ' '
      progress      = get_progress { total: cfg.total, name_rpr, }
      t0            = hrtime_as_bigint()
      result        = fn { progress, }
      t1            = hrtime_as_bigint()
      dt            = ( Number t1 - t0 ) / 1_000_000
      #  locale: 'en-US', numberingSystem: 'latn', style: 'decimal', minimumIntegerDigits: 1, minimumFractionDigits: 0,
      # maximumFractionDigits: 3, useGrouping: 'auto', notation: 'standard', signDisplay: 'auto', roundingIncrement: 1,
      # roundingMode: 'halfExpand', roundingPriority: 'auto', trailingZeroDisplay: 'auto' }
      dt_rpr        = inf.format dt
      dt_rpr        = dt_rpr.padStart 20, ' '
      console.log "#{name_rpr} #{dt_rpr}".padEnd 100
      return result

    #.........................................................................................................
    return exports = { bigint_from_hrtime, hrtime_as_bigint, timeit, }

#===========================================================================================================
Object.assign module.exports, UNSTABLE_BENCHMARK_BRICS

