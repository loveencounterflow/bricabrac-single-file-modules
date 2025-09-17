'use strict'

############################################################################################################
#
#===========================================================================================================
BRICS =

  #=========================================================================================================
  ### NOTE Future Single-File Module ###
  require_capture_output: ->

    #-------------------------------------------------------------------------------------------------------
    capture_output = ( handler ) ->
      ### TAINT validate ###
      old_stdout_write      = process.stdout.write
      old_stderr_write      = process.stderr.write
      process.stdout.write  = ( text, P... ) -> handler text, P...
      process.stderr.write  = ( text, P... ) -> handler text, P...
      reset_output          = ->
        process.stdout.write  = old_stdout_write
        process.stderr.write  = old_stderr_write
        return null
      return { reset_output, }

    #-------------------------------------------------------------------------------------------------------
    with_capture_output = ( handler, fn ) ->
      return with_capture_output_async handler, fn if ( Object::toString.call fn ) is '[object AsyncFunction]'
      return with_capture_output_sync  handler, fn

    #-------------------------------------------------------------------------------------------------------
    with_capture_output_sync = ( handler, fn ) ->
      ### TAINT validate ###
      try
        { reset_output, } = capture_output handler
        return fn()
      finally
        reset_output()

    #-------------------------------------------------------------------------------------------------------
    with_capture_output_async = ( handler, fn ) ->
      ### TAINT validate ###
      try
        { reset_output, } = capture_output handler
        return await fn()
      finally
        reset_output()

    #.......................................................................................................
    return exports = {
      capture_output,
      with_capture_output,
      with_capture_output_sync,
      with_capture_output_async, }

#===========================================================================================================
Object.assign module.exports, BRICS

