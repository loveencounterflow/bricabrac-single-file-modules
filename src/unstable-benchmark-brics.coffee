'use strict'

############################################################################################################
#
#===========================================================================================================
UNSTABLE_BENCHMARK_BRICS =

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_benchmarking: ->
    # CP = require 'node:child_process'
    bigint_from_hrtime  = ([ s, ns, ])  -> ( BigInt s ) * 1_000_000_000n + ( BigInt ns )
    hrtime_as_bigint    =               -> bigint_from_hrtime process.hrtime()

    #---------------------------------------------------------------------------------------------------------
    timeit = ( fn ) ->
      t0          = hrtime_as_bigint()
      result      = fn()
      t1          = hrtime_as_bigint()
      name_rpr    = ( fn.name + ':' ).padEnd 20, ' '
      dt          = ( Number t1 - t0 ) / 1_000_000
      dt_rpr      = ( new Intl.NumberFormat 'en-US' ).format dt
      dt_rpr      = dt_rpr.padStart 20, ' '
      console.log "#{name_rpr} #{dt_rpr}"
      return result

    #.........................................................................................................
    return exports = { bigint_from_hrtime, hrtime_as_bigint, timeit, }

#===========================================================================================================
Object.assign module.exports, UNSTABLE_BENCHMARK_BRICS

