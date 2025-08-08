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

    #.......................................................................................................
    return exports = { bigint_from_hrtime, hrtime_as_bigint, }

#===========================================================================================================
Object.assign module.exports, UNSTABLE_BENCHMARK_BRICS

