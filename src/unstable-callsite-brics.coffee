'use strict'

############################################################################################################
#
#===========================================================================================================
UNSTABLE_CALLSITE_BRICS =
  

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_get_callsite: ->

    #=========================================================================================================
    PATH        = require 'node:path'
    UTIL        = require 'node:util'
    URL         = require 'node:url'
    { debug,  } = console

    #---------------------------------------------------------------------------------------------------------
    internals = Object.freeze {}

    #---------------------------------------------------------------------------------------------------------
    get_app_details = ({ delta = 1 }={}) ->
      # callsite = get_callsite { delta: delta + 1, }
      path  = PATH.dirname get_callsite_path { delta: delta + 1, }
      #.......................................................................................................
      loop
        # break
        try
          package_path  = PATH.join path, 'package.json'
          package_json  = require package_path
          break
        catch error
          throw error unless error.code is 'MODULE_NOT_FOUND'
        path = PATH.dirname path
      #.......................................................................................................
      { name,
        version,  } = package_json
      return { name, version, path, package_path, package_json, }

    #---------------------------------------------------------------------------------------------------------
    get_callsite = ({ delta = 1 }={}) ->
      frame_count = if delta < 10 then 10 else 200
      callsites   = UTIL.getCallSites 200
      return callsites[ delta ]

    #---------------------------------------------------------------------------------------------------------
    get_callsite_path = ({ delta = 1 }={}) ->
      callsite = get_callsite { delta: delta + 1, }
      unless callsite.scriptName.startsWith 'file://'
        throw new Error "Ω___1 unable to get path for callsite.scriptName: #{callsite.scriptName}"
      return URL.fileURLToPath callsite.scriptName

    #---------------------------------------------------------------------------------------------------------
    require_from_app_folder = ({ delta = 1, path, }={}) ->
      unless ( typeof path ) is 'string'
        throw new Error "Ω___2 expected path to be a text, got #{path}"
      details = get_app_details { delta: delta + 1, }
      abspath = PATH.resolve PATH.join details.path, path
      return require abspath

    #---------------------------------------------------------------------------------------------------------
    require_bricabrac_cfg = ({ delta = 1, }={}) ->
      return require_from_app_folder { delta: delta + 1, path: 'bricabrac.cfg.js', }

    #=========================================================================================================
    internals = Object.freeze internals
    return exports = {
      get_callsite, get_callsite_path,
      get_app_details,
      require_from_app_folder, require_bricabrac_cfg,
      internals, }


#===========================================================================================================
Object.assign module.exports, UNSTABLE_CALLSITE_BRICS

